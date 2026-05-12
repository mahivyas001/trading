import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Moon, Sparkles, Sun } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, {
  Defs,
  G,
  Line,
  Path,
  Rect,
  Stop,
  LinearGradient as SvgLinearGradient,
} from "react-native-svg";
import { Card } from "../components/Card";
import SignalBadge from "../components/SignalBadge";
import { Skeleton } from "../components/Skeleton";
import { Typography } from "../components/Typography";
import { useAppStore } from "../store/useAppStore";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CHART_WIDTH = SCREEN_WIDTH - 48; // accounting for padding

// ---------- Line Chart (Beginner) ----------
const LineChart = ({
  data,
  width,
  height,
}: {
  data: number[];
  width: number;
  height: number;
}) => {
  if (!data.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);

  const points = data
    .map((val, i) => `${i * stepX},${height - ((val - min) / range) * height}`)
    .join(" ");

  const gradientPath = `M0,${height} ${points} L${width},${height} Z`;

  return (
    <Svg width={width} height={height}>
      <Defs>
        <SvgLinearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#4F46E5" stopOpacity="0.4" />
          <Stop offset="1" stopColor="#4F46E5" stopOpacity="0" />
        </SvgLinearGradient>
      </Defs>
      {[0, 0.25, 0.5, 0.75, 1].map((perc) => {
        const y = height * perc;
        return (
          <Line
            key={perc}
            x1="0"
            y1={y}
            x2={width}
            y2={y}
            stroke="#E2E8F0"
            strokeDasharray="4,4"
          />
        );
      })}
      <Path d={gradientPath} fill="url(#lineGrad)" />
      <Path d={`M${points}`} fill="none" stroke="#4F46E5" strokeWidth={2} />
    </Svg>
  );
};

// ---------- Candlestick Chart (Advanced) ----------
const CandlestickChart = ({
  data,
  width,
  height,
  volumeHeight = 60,
}: {
  data: {
    open: number;
    close: number;
    high: number;
    low: number;
    volume: number;
  }[];
  width: number;
  height: number;
  volumeHeight?: number;
}) => {
  if (!data.length) return null;
  const chartHeight = height - volumeHeight;
  const maxHigh = Math.max(...data.map((d) => d.high));
  const minLow = Math.min(...data.map((d) => d.low));
  const priceRange = maxHigh - minLow || 1;
  const maxVolume = Math.max(...data.map((d) => d.volume));
  const candleWidth = (width / data.length) * 0.6;
  const stepX = width / data.length;

  return (
    <Svg width={width} height={height}>
      {data.map((item, i) => {
        const x = i * stepX + stepX / 2;
        const highY = ((maxHigh - item.high) / priceRange) * chartHeight;
        const lowY = ((maxHigh - item.low) / priceRange) * chartHeight;
        const openY = ((maxHigh - item.open) / priceRange) * chartHeight;
        const closeY = ((maxHigh - item.close) / priceRange) * chartHeight;
        const color = item.close > item.open ? "#10B981" : "#F43F5E";
        const bodyTop = Math.min(openY, closeY);
        const bodyHeight = Math.abs(closeY - openY) || 1;

        return (
          <G key={i}>
            <Line
              x1={x}
              x2={x}
              y1={highY}
              y2={lowY}
              stroke={color}
              strokeWidth={1}
            />
            <Rect
              x={x - candleWidth / 2}
              y={bodyTop}
              width={candleWidth}
              height={bodyHeight}
              fill={color}
            />
            <Rect
              x={x - candleWidth / 2}
              y={chartHeight + 10}
              width={candleWidth}
              height={(item.volume / maxVolume) * volumeHeight}
              fill={color}
              opacity={0.3}
            />
          </G>
        );
      })}
    </Svg>
  );
};

// ---------- Collapsible Section ----------
const CollapsibleSection = ({
  title,
  children,
  defaultExpanded = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const animatedHeight = useRef(
    new Animated.Value(defaultExpanded ? 1 : 0),
  ).current;

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: expanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [expanded]);

  const maxHeight = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300], // enough space for content
  });

  return (
    <View className="mb-4">
      <TouchableOpacity
        className="flex-row justify-between items-center py-3"
        onPress={() => setExpanded(!expanded)}
      >
        <Typography variant="body" className="font-semibold">
          {title}
        </Typography>
        <Typography variant="body" className="text-neutral">
          {expanded ? "▲" : "▼"}
        </Typography>
      </TouchableOpacity>
      <Animated.View style={{ maxHeight, overflow: "hidden" }}>
        <View className="pb-3">{children}</View>
      </Animated.View>
    </View>
  );
};

// ---------- Main Screen ----------
export default function StockDetailScreen() {
  const router = useRouter();
  const { ticker } = useLocalSearchParams<{ ticker: string }>();
  const {
    isDarkMode,
    toggleDarkMode,
    userMode,
    setUserMode,
    liveStocks,
    currentAnalysis,
    isAnalysisLoading,
    fetchStockAnalysis,
  } = useAppStore();

  // Trigger analysis fetch when ticker changes
  useEffect(() => {
    if (ticker) {
      fetchStockAnalysis(ticker);
    }
  }, [ticker]);

  // Derive basic stock info from live stocks (fallback if not found)
  const stockBasic = liveStocks.find((s) => s.ticker === ticker) || {
    ticker: ticker || "???",
    name: "Unknown",
    price: 0,
    change: 0,
    changePercent: 0,
    signal: "Neutral" as const,
  };

  // Derived values for UI
  const isBullish = stockBasic.change >= 0;
  const changeColor = isBullish ? "#10B981" : "#F43F5E";

  // Chart data: use real chart_data from analysis
  const lineData: number[] =
    currentAnalysis?.chart_data?.map((d) => d.close) ?? [];
  const candleData = currentAnalysis?.chart_data ?? [];

  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-background-dark" : "bg-background-light"}`}
    >
      {/* ---------- Top Bar ---------- */}
      <View className="flex-row justify-between items-center px-4 py-2">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className={`p-2 rounded-full ${
              isDarkMode ? "bg-surface-dark" : "bg-surface-light"
            }`}
          >
            <ChevronLeft color={isDarkMode ? "#F8FAFC" : "#0F172A"} size={24} />
          </TouchableOpacity>
          <Typography variant="h2" className="font-bold">
            {ticker}
          </Typography>
        </View>
        <View className="flex-row items-center gap-3">
          {/* Light/Dark Mode Toggle */}
          <TouchableOpacity
            onPress={toggleDarkMode}
            className={`p-2 rounded-full ${
              isDarkMode ? "bg-surface-dark" : "bg-surface-light"
            }`}
          >
            {isDarkMode ? (
              <Sun color="#94A3B8" size={24} />
            ) : (
              <Moon color="#64748B" size={24} />
            )}
          </TouchableOpacity>
          {/* Beginner / Pro Toggle */}
          <TouchableOpacity
            onPress={() =>
              setUserMode(userMode === "beginner" ? "advanced" : "beginner")
            }
            className={`px-3 py-1 rounded-full ${
              isDarkMode ? "bg-surface-dark" : "bg-surface-light"
            }`}
          >
            <Typography variant="caption" className="font-medium">
              {userMode === "beginner" ? "🐣 Beginner" : "🦅 Pro"}
            </Typography>
          </TouchableOpacity>
        </View>
      </View>

      {/* ---------- Scrollable Content ---------- */}
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Price Header */}
        <View className="mb-6 mt-2">
          <View className="flex-row items-baseline gap-3">
            <Typography variant="h1" className="font-bold">
              ${stockBasic.price.toFixed(2)}
            </Typography>
            <SignalBadge signal={stockBasic.signal} />
          </View>
          <View className="flex-row items-center gap-2 mt-1">
            <View
              className={`px-3 py-1 rounded-full ${
                isBullish ? "bg-bullish/20" : "bg-bearish/20"
              }`}
            >
              <Typography
                variant="body"
                className={isBullish ? "text-bullish" : "text-bearish"}
              >
                {stockBasic.change >= 0 ? "+" : ""}
                {stockBasic.change.toFixed(2)} (
                {stockBasic.changePercent.toFixed(2)}%)
              </Typography>
            </View>
            <Typography variant="body" className="text-neutral">
              {stockBasic.name}
            </Typography>
          </View>
        </View>

        {/* AI Insight Card */}
        <View className="mb-6">
          {isAnalysisLoading ? (
            <Skeleton width={100} height={100} className="rounded-card" />
          ) : (
            <Card variant="filled" className="border-l-4 border-primary p-4">
              <View className="flex-row items-start gap-3">
                <Sparkles color="#4F46E5" size={24} />
                <View className="flex-1">
                  <Typography variant="body" className="font-semibold mb-1">
                    AI Insight
                  </Typography>
                  <Typography
                    variant="body"
                    className="text-neutral dark:text-neutral-light"
                  >
                    {userMode === "beginner"
                      ? (currentAnalysis?.ai_insight?.beginner ??
                        "Loading insight...")
                      : (currentAnalysis?.ai_insight?.advanced ??
                        "Loading insight...")}
                  </Typography>
                </View>
              </View>
            </Card>
          )}
        </View>

        {/* Chart Area */}
        <View className="mb-6">
          {isAnalysisLoading || !currentAnalysis?.chart_data ? (
            <Skeleton
              width={CHART_WIDTH}
              height={userMode === "beginner" ? 200 : 280}
              className="rounded-card"
            />
          ) : (
            <Card variant="elevated" className="p-0 overflow-hidden">
              {userMode === "beginner" ? (
                <LineChart data={lineData} width={CHART_WIDTH} height={200} />
              ) : (
                <CandlestickChart
                  data={candleData}
                  width={CHART_WIDTH}
                  height={280}
                />
              )}
            </Card>
          )}
        </View>

        {/* Technical Stats */}
        <View className="mb-6">
          <Typography variant="h3" className="font-semibold mb-3">
            Technical Stats
          </Typography>
          {isAnalysisLoading ? (
            <View className="flex-row gap-2">
              <Skeleton width={(SCREEN_WIDTH - 48) * 0.48} height={80} />
              <Skeleton width={(SCREEN_WIDTH - 48) * 0.48} height={80} />
            </View>
          ) : (
            <>
              {userMode === "beginner" ? (
                <Card variant="outlined" className="p-4">
                  <Typography variant="body" className="mb-2">
                    {currentAnalysis?.trend_signal ?? "No trend signal"}
                  </Typography>
                  <Typography variant="body">
                    RSI is at{" "}
                    {currentAnalysis?.rsi_14 !== undefined
                      ? currentAnalysis.rsi_14
                      : "..."}
                    , which suggests{" "}
                    {Number(currentAnalysis?.rsi_14) > 70
                      ? "overbought conditions"
                      : Number(currentAnalysis?.rsi_14) < 30
                        ? "oversold conditions"
                        : "neutral momentum"}
                    .
                  </Typography>
                </Card>
              ) : (
                <View className="flex-row flex-wrap gap-2">
                  {[
                    {
                      label: "RSI (14)",
                      value: currentAnalysis?.rsi_14 ?? "...",
                    },
                    {
                      label: "50-Day SMA",
                      value: currentAnalysis?.sma_50
                        ? `$${currentAnalysis.sma_50}`
                        : "...",
                    },
                    {
                      label: "200-Day SMA",
                      value: currentAnalysis?.sma_200
                        ? `$${currentAnalysis.sma_200}`
                        : "...",
                    },
                    {
                      label: "Trend Signal",
                      value: currentAnalysis?.trend_signal ?? "...",
                    },
                  ].map((item) => (
                    <Card
                      key={item.label}
                      variant="outlined"
                      className="w-[48%] p-4"
                    >
                      <Typography
                        variant="caption"
                        className="text-neutral mb-1"
                      >
                        {item.label}
                      </Typography>
                      <Typography variant="body" className="font-semibold">
                        {item.value}
                      </Typography>
                    </Card>
                  ))}
                </View>
              )}
            </>
          )}
        </View>

        {/* Last Updated */}
        <Typography variant="caption" className="text-neutral text-right mb-4">
          Real-time data from Market Mentor API
        </Typography>

        {/* Collapsible More Details (using actual data if available) */}
        <CollapsibleSection title="More Details">
          {isAnalysisLoading ? (
            <Skeleton width={SCREEN_WIDTH - 48} height={80} />
          ) : (
            <View className="gap-2">
              <View className="flex-row justify-between">
                <Typography variant="body">52‑Week High</Typography>
                <Typography variant="body" className="font-semibold">
                  -- (coming soon)
                </Typography>
              </View>
              <View className="flex-row justify-between">
                <Typography variant="body">52‑Week Low</Typography>
                <Typography variant="body" className="font-semibold">
                  -- (coming soon)
                </Typography>
              </View>
              <View className="flex-row justify-between">
                <Typography variant="body">Volume</Typography>
                <Typography variant="body" className="font-semibold">
                  {currentAnalysis?.chart_data?.[
                    currentAnalysis.chart_data.length - 1
                  ]?.volume?.toLocaleString() ?? "--"}
                </Typography>
              </View>
              <View className="flex-row justify-between">
                <Typography variant="body">Market Cap</Typography>
                <Typography variant="body" className="font-semibold">
                  -- (coming soon)
                </Typography>
              </View>
            </View>
          )}
        </CollapsibleSection>
      </ScrollView>
    </SafeAreaView>
  );
}
