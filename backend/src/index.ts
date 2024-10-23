import cors from "cors";
import express from "express";
import yahooFinance from "yahoo-finance2";
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

// Suppress survey notice
yahooFinance.suppressNotices(["yahooSurvey"]);

// Search stocks by name
router.get("/search", async (req, res) => {
  const query = req.query.q as string;
  console.log("Received search query:", query); // Log the search query
  if (!query) {
    return res.status(400).json({ error: "Query parameter 'q' is required" });
  }

  try {
    // Fetch stock symbols based on the query
    const searchResults = await yahooFinance.search(query);
    console.log("Search Results:", searchResults); // Log the search results
    const symbols = searchResults.quotes
      .map((stock: any) => stock.symbol)
      .filter(
        (symbol: string | undefined): symbol is string => symbol !== undefined
      );
    console.log("Filtered Symbols:", symbols); // Log the filtered symbols

    // Fetch stock prices for each symbol
    const pricePromises = symbols.map((symbol: string) =>
      yahooFinance.quote(symbol).catch((error) => {
        console.error(`Error fetching quote for symbol ${symbol}:`, error);
        return null;
      })
    );
    const priceResponses = await Promise.all(pricePromises);

    // Filter out stocks without a price
    const stocksWithPrice = priceResponses
      .filter((response) => response !== null)
      .map((response, index) => ({
        symbol: symbols[index],
        price: response?.regularMarketPrice,
      }))
      .filter((stock) => stock.price !== null && stock.price !== undefined);

    // Include Indian stocks and other relevant stocks
    const indianStocks = stocksWithPrice.filter((stock) =>
      stock.symbol.endsWith(".NS")
    );

    // Limit the results to 5 stocks
    const limitedStocks = stocksWithPrice.slice(0, 5);

    // Extract only the symbols
    const symbolsOnly = limitedStocks.map((stock) => stock.symbol);
    console.log("Final Symbols to Return:", symbolsOnly); // Log the final symbols

    res.json(symbolsOnly);
  } catch (error) {
    console.error("Error fetching stock data:", error);
    res.status(500).json({ error: "Error fetching stock data" });
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

  try {
    const response = await yahooFinance.quote(symbol);
    res.json(response);
  } catch (error) {
    console.error("Error fetching stock data:", error);
    res.status(500).json({ error: "Error fetching stock data" });
  }
});
