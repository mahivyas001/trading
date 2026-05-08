import { useRouter } from "expo-router";
import {
    Minus,
    Moon,
    Search,
    Sun,
    TrendingDown,
    TrendingUp,
} from "lucide-react-native";
import React from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import SignalBadge from "../components/components/SignalBadge";
import { useAppStore } from "../store/useAppStore";

// ─── Mock Data ───────────────────────────────────────────────────────────────

interface RadarCardData {
  ticker: string;
  name: string;
  price: string;
  change: string;
  signal: "Bullish" | "Bearish" | "Neutral";
}

interface WatchlistItemData {
  ticker: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  signal: "Bullish" | "Bearish" | "Neutral";
}

const radarData: RadarCardData[] = [
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    price: "$198.45",
    change: "+2.34",
    signal: "Bullish",
  },
  {
    ticker: "TSLA",
    name: "Tesla Inc.",
    price: "$245.67",
    change: "-1.23",
    signal: "Bearish",
  },
  {
    ticker: "NVDA",
    name: "NVIDIA Corp.",
    price: "$789.12",
    change: "+0.89",
    signal: "Neutral",
  },
];

const watchlistData: WatchlistItemData[] = [
  {
    ticker: "MSFT",
    name: "Microsoft Corp.",
    price: "$425.30",
    change: "+3.21",
    changePercent: "+0.76%",
    signal: "Bullish",
  },
  {
    ticker: "GOOGL",
    name: "Alphabet Inc.",
    price: "$176.89",
    change: "-0.45",
    changePercent: "-0.25%",
    signal: "Bearish",
  },
  {
    ticker: "AMZN",
    name: "Amazon.com Inc.",
    price: "$198.23",
    change: "+1.12",
    changePercent: "+0.57%",
    signal: "Neutral",
  },
  {
    ticker: "META",
    name: "Meta Platforms",
    price: "$512.45",
    change: "+5.67",
    changePercent: "+1.12%",
    signal: "Bullish",
  },
  {
    ticker: "JPM",
    name: "JPMorgan Chase",
    price: "$204.78",
    change: "-0.89",
    changePercent: "-0.43%",
    signal: "Bearish",
  },
];

// ─── Radar Card ──────────────────────────────────────────────────────────────

const RadarCard: React.FC<{ item: RadarCardData }> = ({ item }) => {
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const router = useRouter();

  const isPositive = item.signal === "Bullish";
  const isNegative = item.signal === "Bearish";
  const ChangeIcon = isPositive
    ? TrendingUp
    : isNegative
      ? TrendingDown
      : Minus;
  const changeColor = isPositive
    ? "#10B981"
    : isNegative
      ? "#F43F5E"
      : "#64748B";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.push(`/stock/${item.ticker}`)}
      className={`rounded-2xl p-5 mr-4 w-44 shadow-sm ${isDarkMode ? "bg-[#1E293B]" : "bg-white"}`}
      style={{
        shadowColor: isDarkMode ? "#000" : "#94A3B8",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
      }}
    >
      <Text
        className={`text-lg font-bold ${isDarkMode ? "text-[#F8FAFC]" : "text-[#0F172A]"}`}
      >
        {item.ticker}
      </Text>
      <Text
        className={`text-xs mt-0.5 ${isDarkMode ? "text-[#64748B]" : "text-[#64748B]"}`}
      >
        {item.name}
      </Text>
      <View className="h-px bg-[#64748B]/20 my-3" />
      <Text
        className={`text-xl font-bold ${isDarkMode ? "text-[#F8FAFC]" : "text-[#0F172A]"}`}
      >
        {item.price}
      </Text>
      <View className="flex-row items-center justify-between mt-2">
        <View className="flex-row items-center">
          <ChangeIcon size={14} color={changeColor} strokeWidth={2.5} />
          <Text
            style={{ color: changeColor }}
            className="text-sm font-semibold ml-1"
          >
            {item.change}
          </Text>
        </View>
        <SignalBadge signal={item.signal} />
      </View>
    </TouchableOpacity>
  );
};

// ─── Watchlist Item ──────────────────────────────────────────────────────────

const WatchlistItem: React.FC<{ item: WatchlistItemData }> = ({ item }) => {
  const isDarkMode = useAppStore((s) => s.isDarkMode);
  const router = useRouter();

  const isPositive = item.change.startsWith("+");
  const isNeutral = item.change.startsWith("0");
  const changeColor = isPositive
    ? "#10B981"
    : isNeutral
      ? "#64748B"
      : "#F43F5E";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.push(`/stock/${item.ticker}`)}
      className={`flex-row items-center justify-between rounded-2xl px-5 py-4 mb-3 ${isDarkMode ? "bg-[#1E293B]" : "bg-white"}`}
      style={{
        shadowColor: isDarkMode ? "#000" : "#94A3B8",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDarkMode ? 0.25 : 0.08,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View className="flex-1">
        <View className="flex-row items-center">
          <Text
            className={`text-base font-bold ${isDarkMode ? "text-[#F8FAFC]" : "text-[#0F172A]"}`}
          >
            {item.ticker}
          </Text>
          <View className="ml-2">
            <SignalBadge signal={item.signal} />
          </View>
        </View>
        <Text
          className={`text-xs mt-0.5 ${isDarkMode ? "text-[#64748B]" : "text-[#64748B]"}`}
        >
          {item.name}
        </Text>
      </View>
      <View className="items-end">
        <Text
          className={`text-base font-bold ${isDarkMode ? "text-[#F8FAFC]" : "text-[#0F172A]"}`}
        >
          {item.price}
        </Text>
        <View className="flex-row items-center mt-0.5">
          {isPositive ? (
            <TrendingUp size={12} color={changeColor} strokeWidth={2.5} />
          ) : isNeutral ? (
            <Minus size={12} color={changeColor} strokeWidth={2.5} />
          ) : (
            <TrendingDown size={12} color={changeColor} strokeWidth={2.5} />
          )}
          <Text
            style={{ color: changeColor }}
            className="text-xs font-semibold ml-1"
          >
            {item.changePercent}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ─── Home Screen ─────────────────────────────────────────────────────────────

const HomeScreen: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useAppStore(); // <-- Hooked up toggleDarkMode!

  return (
    <View className={`flex-1 ${isDarkMode ? "bg-[#0F172A]" : "bg-[#F8FAFC]"}`}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header with Sun/Moon ──────────────────────── */}
        <View className="px-6 pt-14 pb-4 flex-row justify-between items-start">
          <View>
            <Text
              className={`text-3xl font-extrabold tracking-tight ${isDarkMode ? "text-[#F8FAFC]" : "text-[#0F172A]"}`}
            >
              Smart Stock
            </Text>
            <Text
              className={`text-3xl font-extrabold tracking-tight ${isDarkMode ? "text-[#F8FAFC]" : "text-[#0F172A]"}`}
            >
              Analysis
            </Text>
          </View>

          <TouchableOpacity
            onPress={toggleDarkMode}
            className={`p-3 rounded-full ${isDarkMode ? "bg-[#1E293B]" : "bg-gray-200"}`}
          >
            {isDarkMode ? (
              <Sun color="#94A3B8" size={22} />
            ) : (
              <Moon color="#64748B" size={22} />
            )}
          </TouchableOpacity>
        </View>

        {/* ── Search Bar ──────────────────── */}
        <View className="px-6 pb-6">
          <View
            className={`flex-row items-center rounded-2xl px-4 py-3.5 ${
              isDarkMode
                ? "bg-[#1E293B] border border-[#334155]"
                : "bg-white border border-[#E2E8F0]"
            }`}
          >
            <Search
              size={20}
              color={isDarkMode ? "#64748B" : "#94A3B8"}
              strokeWidth={2}
            />
            <TextInput
              className={`flex-1 ml-3 text-base ${isDarkMode ? "text-[#F8FAFC]" : "text-[#0F172A]"}`}
              placeholder="Search for a stock..."
              placeholderTextColor={isDarkMode ? "#475569" : "#94A3B8"}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* ── Today's AI Radar ────────────── */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between px-6 mb-4">
            <Text
              className={`text-lg font-bold ${isDarkMode ? "text-[#F8FAFC]" : "text-[#0F172A]"}`}
            >
              Today's AI Radar
            </Text>
            <Text
              className="text-sm font-semibold"
              style={{ color: "#4F46E5" }}
            >
              See All
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24 }}
          >
            {radarData.map((item, index) => (
              <RadarCard key={`${item.ticker}-${index}`} item={item} />
            ))}
          </ScrollView>
        </View>

        {/* ── Watchlist ───────────────────── */}
        <View className="px-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text
              className={`text-lg font-bold ${isDarkMode ? "text-[#F8FAFC]" : "text-[#0F172A]"}`}
            >
              Watchlist
            </Text>
            <Text
              className="text-sm font-semibold"
              style={{ color: "#4F46E5" }}
            >
              Manage
            </Text>
          </View>

          {watchlistData.map((item, index) => (
            <WatchlistItem key={`${item.ticker}-${index}`} item={item} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
