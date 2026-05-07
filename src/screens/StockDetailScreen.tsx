import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import SignalBadge from "../components/components/SignalBadge";
import { useAppStore } from "../store/useAppStore";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CHART_HEIGHT = 280;
const CARD_RADIUS = 20;

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_STOCK = {
  ticker: "AAPL",
  companyName: "Apple Inc.",
  currentPrice: 198.54,
  change: 2.34,
  changePercent: 1.19,
  signal: "Bullish" as const,
};

// ─── Beginner Stats ──────────────────────────────────────────────────────────
const beginnerMetrics = [
  {
    label: "What it's worth",
    value: "$3.12T",
    emoji: "💰",
    desc: "Total company value",
  },
  {
    label: "Today's Mood",
    value: "Bullish 📈",
    emoji: "😊",
    desc: "Price going up today",
  },
  {
    label: "Yearly Change",
    value: "+24.3%",
    emoji: "📊",
    desc: "Great year so far!",
  },
  {
    label: "Dividend Yield",
    value: "0.52%",
    emoji: "🎁",
    desc: "Cash paid to you yearly",
  },
];

// ─── Advanced Stats ──────────────────────────────────────────────────────────
const advancedMetrics = [
  { label: "P/E Ratio", value: "32.4", sub: "Industry: 28.1" },
  { label: "PEG Ratio", value: "2.15", sub: "Growth adjusted" },
  { label: "RSI (14)", value: "62.8", sub: "Neutral territory" },
  { label: "MACD", value: "1.24 ▲", sub: "Bullish crossover" },
  { label: "Support", value: "$192.10", sub: "Strong floor" },
  { label: "Resistance", value: "$205.40", sub: "Key ceiling" },
  { label: "Volatility", value: "18.4%", sub: "Below average" },
  { label: "Beta (1Y)", value: "1.21", sub: "More volatile than market" },
];

// ─── Color Theme ─────────────────────────────────────────────────────────────
const getColors = (isDark: boolean) => ({
  bg: isDark ? "#0F172A" : "#F8FAFC",
  surface: isDark ? "#1E293B" : "#FFFFFF",
  text: isDark ? "#F8FAFC" : "#0F172A",
  textSecondary: isDark ? "#94A3B8" : "#64748B",
  accent: "#4F46E5",
  accentGlow: isDark ? "rgba(79, 70, 229, 0.15)" : "rgba(79, 70, 229, 0.08)",
  green: "#10B981",
  red: "#F43F5E",
  border: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
  cardShadow: isDark ? "#000" : "#94A3B8",
});

// ─── Beginner Line Chart Placeholder ─────────────────────────────────────────
const BeginnerChart = ({
  colors,
}: {
  colors: ReturnType<typeof getColors>;
}) => {
  const linePoints = [
    35, 42, 38, 55, 48, 62, 58, 72, 68, 78, 85, 82, 90, 88, 95,
  ];
  const maxVal = Math.max(...linePoints);
  const minVal = Math.min(...linePoints);
  const range = maxVal - minVal || 1;
  const stepX = (SCREEN_WIDTH - 80) / (linePoints.length - 1);

  return (
    <View
      style={[
        styles.chartCard,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <LinearGradient
        colors={[colors.accentGlow, "transparent"]}
        style={styles.chartGlow}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <Text style={[styles.chartTitle, { color: colors.text }]}>
        Price Performance
      </Text>
      <Text style={[styles.chartSubtitle, { color: colors.textSecondary }]}>
        Smooth ride to the top 🚀
      </Text>

      {/* Chart Area */}
      <View style={styles.chartArea}>
        {/* Y-axis labels */}
        <View style={styles.yAxis}>
          <Text style={[styles.axisLabel, { color: colors.textSecondary }]}>
            ${(maxVal + 110).toFixed(0)}
          </Text>
          <Text style={[styles.axisLabel, { color: colors.textSecondary }]}>
            ${((maxVal + minVal) / 2 + 90).toFixed(0)}
          </Text>
          <Text style={[styles.axisLabel, { color: colors.textSecondary }]}>
            ${(minVal + 85).toFixed(0)}
          </Text>
        </View>

        {/* SVG-like line using Views */}
        <View style={styles.lineChartContainer}>
          {linePoints.map((val, i) => {
            const y =
              CHART_HEIGHT * 0.85 -
              ((val - minVal) / range) * (CHART_HEIGHT * 0.7);
            const x = 10 + i * stepX;
            const isLast = i === linePoints.length - 1;
            return (
              <React.Fragment key={`pt-${i}`}>
                {i > 0 &&
                  (() => {
                    const prevY =
                      CHART_HEIGHT * 0.85 -
                      ((linePoints[i - 1] - minVal) / range) *
                        (CHART_HEIGHT * 0.7);
                    const prevX = 10 + (i - 1) * stepX;
                    const dx = x - prevX;
                    const dy = y - prevY;
                    const length = Math.sqrt(dx * dx + dy * dy);
                    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                    return (
                      <View
                        style={[
                          styles.lineSegment,
                          {
                            left: prevX,
                            top: prevY + 1,
                            width: length,
                            transform: [{ rotate: `${angle}deg` }],
                            backgroundColor: isLast
                              ? colors.green
                              : colors.accent,
                            opacity: isLast ? 1 : 0.6,
                          },
                        ]}
                      />
                    );
                  })()}
              </React.Fragment>
            );
          })}
        </View>
      </View>
    </View>
  );
};

// ─── Advanced Candlestick Chart Placeholder ──────────────────────────────────
const AdvancedChart = ({
  colors,
}: {
  colors: ReturnType<typeof getColors>;
}) => {
  const gridLines = [0, 1, 2, 3, 4];
  const candles = [
    { high: 0.85, low: 0.2, open: 0.3, close: 0.72, volume: 0.7 },
    { high: 0.9, low: 0.35, open: 0.72, close: 0.5, volume: 0.5 },
    { high: 0.75, low: 0.15, open: 0.5, close: 0.68, volume: 0.8 },
    { high: 0.82, low: 0.4, open: 0.68, close: 0.55, volume: 0.6 },
    { high: 0.7, low: 0.1, open: 0.55, close: 0.65, volume: 0.75 },
    { high: 0.88, low: 0.3, open: 0.65, close: 0.78, volume: 0.9 },
    { high: 0.95, low: 0.5, open: 0.78, close: 0.85, volume: 0.85 },
    { high: 0.92, low: 0.45, open: 0.85, close: 0.6, volume: 0.65 },
  ];

  const candleWidth = Math.min((SCREEN_WIDTH - 100) / candles.length - 2, 14);

  return (
    <View
      style={[
        styles.chartCard,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.chartTitle, { color: colors.text }]}>
        AAPL · 1Y Candlestick
      </Text>
      <Text style={[styles.chartSubtitle, { color: colors.textSecondary }]}>
        Interactive · Volume overlay
      </Text>

      <View style={styles.advChartArea}>
        {/* Candlesticks */}
        <View style={styles.candlesContainer}>
          {candles.map((c, i) => {
            const isGreen = c.close >= c.open;
            const candleColor = isGreen ? colors.green : colors.red;
            const candleTop =
              (1 - Math.max(c.open, c.close)) * CHART_HEIGHT * 0.8 + 20;
            const candleHeight =
              Math.abs(c.close - c.open) * CHART_HEIGHT * 0.8 || 2;
            const wickTop = (1 - c.high) * CHART_HEIGHT * 0.8 + 20;
            const wickHeight = (c.high - c.low) * CHART_HEIGHT * 0.8;
            const left = 10 + i * (candleWidth + 2);

            return (
              <React.Fragment key={`c-${i}`}>
                <View
                  style={[
                    styles.wick,
                    {
                      left: left + candleWidth / 2 - 1,
                      top: wickTop,
                      height: wickHeight,
                      backgroundColor: colors.textSecondary,
                      opacity: 0.3,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.candle,
                    {
                      left,
                      top: candleTop,
                      width: candleWidth,
                      height: candleHeight,
                      backgroundColor: candleColor,
                    },
                  ]}
                />
              </React.Fragment>
            );
          })}
        </View>
      </View>
    </View>
  );
};

// ─── Main Screen Component ───────────────────────────────────────────────────
export default function StockDetailScreen() {
  const params = useLocalSearchParams<{ ticker?: string }>();
  const { isDarkMode, userMode } = useAppStore();
  const colors = getColors(isDarkMode);
  const stock = MOCK_STOCK;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Header Section ── */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={[styles.ticker, { color: colors.text }]}>
              {params.ticker || stock.ticker}
            </Text>
            <SignalBadge signal={stock.signal} />
          </View>
          <Text style={[styles.companyName, { color: colors.textSecondary }]}>
            {stock.companyName}
          </Text>

          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: colors.text }]}>
              ${stock.currentPrice.toFixed(2)}
            </Text>
            <View
              style={[
                styles.changeBadge,
                {
                  backgroundColor:
                    stock.change >= 0
                      ? "rgba(16, 185, 129, 0.12)"
                      : "rgba(244, 63, 94, 0.12)",
                },
              ]}
            >
              <Text
                style={[
                  styles.changeText,
                  { color: stock.change >= 0 ? colors.green : colors.red },
                ]}
              >
                {stock.change >= 0 ? "+" : ""}
                {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
              </Text>
            </View>
          </View>
        </View>

        {/* ── Chart Section ── */}
        {userMode === "beginner" ? (
          <BeginnerChart colors={colors} />
        ) : (
          <AdvancedChart colors={colors} />
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles (Simplified for space) ───────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16 },
  header: { marginBottom: 24 },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ticker: { fontSize: 34, fontWeight: "800", letterSpacing: -0.5 },
  companyName: {
    fontSize: 15,
    fontWeight: "500",
    marginTop: 2,
    marginBottom: 12,
  },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 12 },
  price: { fontSize: 48, fontWeight: "800", letterSpacing: -1 },
  changeBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  changeText: { fontSize: 14, fontWeight: "700" },
  chartCard: {
    borderRadius: CARD_RADIUS,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
  },
  chartGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: CHART_HEIGHT * 0.6,
  },
  chartTitle: { fontSize: 17, fontWeight: "700", marginBottom: 2 },
  chartSubtitle: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 16,
    opacity: 0.7,
  },
  chartArea: { flexDirection: "row", height: CHART_HEIGHT },
  yAxis: { width: 44, justifyContent: "space-between", paddingVertical: 4 },
  axisLabel: { fontSize: 10, fontWeight: "600", opacity: 0.5 },
  lineChartContainer: { flex: 1, height: CHART_HEIGHT, position: "relative" },
  lineSegment: { position: "absolute", height: 3, borderRadius: 1.5 },
  advChartArea: { height: CHART_HEIGHT, position: "relative" },
  candlesContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: CHART_HEIGHT,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  wick: { position: "absolute", width: 2, borderRadius: 1 },
  candle: { position: "absolute", borderRadius: 2 },
});
