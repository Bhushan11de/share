import cors from "cors";
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const router = express.Router();

app.use(express.json());
app.use(cors());

app.use("/api", router);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Alpha Vantage API key
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
console.log("Alpha Vantage API Key:", ALPHA_VANTAGE_API_KEY);

// Search stocks by name
router.get("/search", async (req, res) => {
  const query = req.query.q as string;
  if (!query) {
    return res.status(400).json({ error: "Query parameter 'q' is required" });
  }

  if (!ALPHA_VANTAGE_API_KEY) {
    return res.status(500).json({ error: "Alpha Vantage API key is missing" });
  }

  try {
    const response = await axios.get(`https://www.alphavantage.co/query`, {
      params: {
        function: "SYMBOL_SEARCH",
        keywords: query,
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });

    console.log("Alpha Vantage API response:", response.data);

    if (response.data.Note) {
      console.error("Alpha Vantage API limit reached:", response.data.Note);
      return res.status(429).json({ error: "Alpha Vantage API limit reached" });
    }

    if (response.data["Error Message"]) {
      console.error("Alpha Vantage API error:", response.data["Error Message"]);
      return res.status(500).json({ error: response.data["Error Message"] });
    }

    if (!response.data.bestMatches) {
      console.error("No bestMatches found in response:", response.data);
      return res.status(500).json({ error: "Failed to fetch stock data" });
    }

    const stocks = response.data.bestMatches.map((match: any) => ({
      name: match["2. name"],
      symbol: match["1. symbol"],
      region: match["4. region"],
      marketOpen: match["5. marketOpen"],
      marketClose: match["6. marketClose"],
      timezone: match["7. timezone"],
      currency: match["8. currency"],
      matchScore: match["9. matchScore"],
    }));

    res.json(stocks.slice(0, 10)); // Limit to top 10 results
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error fetching stock data:", error.message);
      res
        .status(500)
        .json({ error: "Failed to fetch stock data from Alpha Vantage" });
    } else {
      console.error("Unexpected error fetching stock data:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
});
