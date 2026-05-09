import { create } from "zustand";

type UserMode = "beginner" | "advanced";

export interface StockData {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  signal: "Bullish" | "Bearish" | "Neutral";
}

// ─── NEW: Interface for our Math Engine Data ───
export interface StockAnalysis {
  ticker: string;
  current_price: number;
  rsi_14: number | string;
  sma_50: number | string;
  sma_200: number | string;
  trend_signal: string;
  ai_insight: {
    beginner: string;
    advanced: string;
  };
}

interface AppState {
  isDarkMode: boolean;
  userMode: UserMode;
  liveStocks: StockData[];
  isLoading: boolean;

  // NEW: Holds the data for the specific stock you click on
  currentAnalysis: StockAnalysis | null;
  isAnalysisLoading: boolean;

  toggleDarkMode: () => void;
  setUserMode: (mode: UserMode) => void;
  fetchLiveMarketData: () => Promise<void>;
  fetchStockAnalysis: (ticker: string) => Promise<void>; // NEW!
}

export const useAppStore = create<AppState>((set) => ({
  isDarkMode: true,
  userMode: "beginner",
  liveStocks: [],
  isLoading: true,
  currentAnalysis: null,
  isAnalysisLoading: true,

  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setUserMode: (mode) => set({ userMode: mode }),

  fetchLiveMarketData: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch("http://localhost:8000/api/market");
      const json = await response.json();
      if (json.success) {
        set({ liveStocks: json.data, isLoading: false });
      } else {
        throw new Error("Backend returned an error.");
      }
    } catch (error) {
      console.warn("Backend offline! Using Fallback Data.");
      const mockSymbols = [
        "AAPL",
        "TSLA",
        "NVDA",
        "MSFT",
        "GOOGL",
        "AMZN",
        "META",
        "JPM",
      ];
      const basePrices = [
        198.45, 245.67, 789.12, 425.3, 176.89, 198.23, 512.45, 204.78,
      ];

      const fallbackData: StockData[] = mockSymbols.map((ticker, index) => {
        const randomChange = Math.random() * 4 - 2;
        const price = basePrices[index] + randomChange;
        const changePercent = (randomChange / basePrices[index]) * 100;
        let signal: "Bullish" | "Bearish" | "Neutral" = "Neutral";
        if (changePercent > 0.5) signal = "Bullish";
        else if (changePercent < -0.5) signal = "Bearish";

        return {
          ticker,
          name: `${ticker} Corp`,
          price: Number(price.toFixed(2)),
          change: Number(randomChange.toFixed(2)),
          changePercent: Number(changePercent.toFixed(2)),
          signal,
        };
      });
      set({ liveStocks: fallbackData, isLoading: false });
    }
  },

  // ─── NEW: Fetch Real Math from Backend ───
  fetchStockAnalysis: async (ticker: string) => {
    set({ isAnalysisLoading: true, currentAnalysis: null });
    try {
      const response = await fetch(
        `http://localhost:8000/api/analyze/${ticker}`,
      );
      const json = await response.json();
      if (json.success) {
        set({ currentAnalysis: json.analysis, isAnalysisLoading: false });
      } else {
        throw new Error("Analysis failed");
      }
    } catch (error) {
      console.warn("Analysis Backend offline. Using Mock Analysis.");
      // Fallback if Python server is off
      set({
        currentAnalysis: {
          ticker: ticker,
          current_price: 150.0,
          rsi_14: 45.2,
          sma_50: 148.5,
          sma_200: 142.1,
          trend_signal: "Neutral (Mock)",
          ai_insight: {
            beginner:
              "This is a simulated AI insight. The stock looks okay, but our backend server is currently offline!",
            advanced:
              "Simulated backend data. RSI and SMA indicate neutral consolidation.",
          },
        },
        isAnalysisLoading: false,
      });
    }
  },
}));
