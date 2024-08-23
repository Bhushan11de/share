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

// Finnhub API key
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
console.log("Finnhub API Key:", FINNHUB_API_KEY);

// Search stocks by name
router.get("/search", async (req, res) => {
  const query = req.query.q as string;
  if (!query) {
    return res.status(400).json({ error: "Query parameter 'q' is required" });
  }

  if (!FINNHUB_API_KEY) {
    return res.status(500).json({ error: "Finnhub API key is missing" });
  }

  try {
    console.log("Making request to Finnhub API with key:", FINNHUB_API_KEY);
    const response = await axios.get(`https://finnhub.io/api/v1/search`, {
      params: {
        q: query,
      },
      headers: {
        "X-Finnhub-Token": FINNHUB_API_KEY,
      },
    });
    console.log("Response from Finnhub API:", response.data);

    // Format and limit the response data to 10 entries
    const formattedData = response.data.result
      .slice(0, 10)
      .map((item: any) => ({
        name: item.description,
        symbol: item.symbol,
      }));

    res.json(formattedData);
  } catch (error) {
    console.error(
      "Error fetching data from Finnhub API:",
      (error as any).response?.data || (error as any).message
    );
    res.status(500).json({ error: "Error fetching data from Finnhub API" });
  }
});

// Get current stock price by symbol
router.get("/stock", async (req, res) => {
  const symbol = req.query.symbol as string;
  if (!symbol) {
    return res
      .status(400)
      .json({ error: "Query parameter 'symbol' is required" });
  }

  if (!FINNHUB_API_KEY) {
    return res.status(500).json({ error: "Finnhub API key is missing" });
  }

  try {
    console.log("Making request to Finnhub API with key:", FINNHUB_API_KEY);
    const response = await axios.get(`https://finnhub.io/api/v1/quote`, {
      params: {
        symbol: symbol,
      },
      headers: {
        "X-Finnhub-Token": FINNHUB_API_KEY,
      },
    });
    console.log("Response from Finnhub API:", response.data);

    // Extract the current price from the response
    const currentPrice = response.data.c;

    res.json({ symbol, price: currentPrice });
  } catch (error) {
    console.error(
      "Error fetching data from Finnhub API:",
      (error as any).response?.data || (error as any).message
    );
    res.status(500).json({ error: "Error fetching data from Finnhub API" });
  }
});
