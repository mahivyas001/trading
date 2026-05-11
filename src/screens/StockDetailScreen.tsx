import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Moon, Sparkles, Sun } from "lucide-react-native";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SignalBadge from "../components/components/SignalBadge";
import { ChartPoint, useAppStore } from "../store/useAppStore";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CHART_HEIGHT = 280;
const CARD_RADIUS = 20;

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

// ─── Beginner Real Line Chart ───
const BeginnerChart = ({
  colors,
  data,
}: {
  colors: ReturnType<typeof getColors>;
  data: ChartPoint[];
}) => {
  if (!data || data.length === 0) return null;

  const linePoints = data.map((d) => d.close);
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
        30-Day Performance
      </Text>
      <Text style={[styles.chartSubtitle, { color: colors.textSecondary }]}>
        Smooth ride to the top 🚀
      </Text>

      <View style={styles.chartArea}>
        <View style={styles.yAxis}>
          <Text style={[styles.axisLabel, { color: colors.textSecondary }]}>
            ${maxVal.toFixed(0)}
          </Text>
          <Text style={[styles.axisLabel, { color: colors.textSecondary }]}>
            ${((maxVal + minVal) / 2).toFixed(0)}
          </Text>
          <Text style={[styles.axisLabel, { color: colors.textSecondary }]}>
            ${minVal.toFixed(0)}
          </Text>
        </View>

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
                {isLast && (
                  <View
                    style={[
                      styles.glowDot,
                      {
                        left: x - 10,
                        top: y - 10,
                        backgroundColor: colors.green,
                      },
                    ]}
                  />
                )}
              </React.Fragment>
            );
          })}
        </View>
      </View>
    </View>
  );
};

// ─── Advanced Real Candlestick Chart ───
const AdvancedChart = ({
  colors,
  data,
}: {
  colors: ReturnType<typeof getColors>;
  data: ChartPoint[];
}) => {
  if (!data || data.length === 0) return null;

  const minPrice = Math.min(...data.map((c) => c.low));
  const maxPrice = Math.max(...data.map((c) => c.high));
  const range = maxPrice - minPrice || 1;
  const maxVol = Math.max(...data.map((c) => c.volume)) || 1;

  // Normalize data for UI drawing (0 to 1 scale)
  const candles = data.map((c) => ({
    open: (c.open - minPrice) / range,
    close: (c.close - minPrice) / range,
    high: (c.high - minPrice) / range,
    low: (c.low - minPrice) / range,
    volume: c.volume / maxVol,
    rawClose: c.close,
    rawOpen: c.open,
  }));

  const gridLines = [0, 1, 2, 3, 4];
  const candleWidth = Math.min((SCREEN_WIDTH - 100) / candles.length - 2, 8);

  return (
    <View
      style={[
        styles.chartCard,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.chartTitle, { color: colors.text }]}>
        30-Day Candlestick
      </Text>
      <Text style={[styles.chartSubtitle, { color: colors.textSecondary }]}>
        Price & Volume Analysis
      </Text>

      <View style={styles.advChartArea}>
        {/* Y-Axis Labels */}
        <View style={styles.advYAxis}>
          {gridLines.map((i) => (
            <Text
              key={`yl-${i}`}
              style={[
                styles.axisLabelSmall,
                {
                  color: colors.textSecondary,
                  top: (CHART_HEIGHT / gridLines.length) * i + 5,
                },
              ]}
            >
              ${(maxPrice - (range / gridLines.length) * i).toFixed(0)}
            </Text>
          ))}
        </View>

        {/* Candles */}
        <View style={styles.candlesContainer}>
          {candles.map((c, i) => {
            const isGreen = c.rawClose >= c.rawOpen;
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
                <View
                  style={[
                    styles.volumeBar,
                    {
                      left,
                      bottom: 0,
                      width: candleWidth,
                      height: c.volume * 40,
                      backgroundColor: isGreen
                        ? "rgba(16, 185, 129, 0.2)"
                        : "rgba(244, 63, 94, 0.2)",
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

export default function StockDetailScreen() {
  const params = useLocalSearchParams<{ ticker?: string }>();
  const ticker = params.ticker || "AAPL";
  const router = useRouter();

  const {
    isDarkMode,
    userMode,
    setUserMode,
    toggleDarkMode,
    liveStocks,
    fetchStockAnalysis,
    currentAnalysis,
    isAnalysisLoading,
  } = useAppStore();
  const colors = getColors(isDarkMode);

  const stockBasic = liveStocks.find((s) => s.ticker === ticker) || {
    ticker: ticker,
    name: `${ticker} Corp`,
    price: 0,
    change: 0,
    changePercent: 0,
    signal: "Neutral" as const,
  };

  useEffect(() => {
    fetchStockAnalysis(ticker);
  }, [ticker]);

  const beginnerMetrics = [
    {
      label: "AI Trend",
      value: currentAnalysis?.trend_signal || "Loading...",
      emoji: "🤖",
      desc: "Current momentum",
    },
    {
      label: "Today's Mood",
      value: stockBasic.signal + " 📈",
      emoji: "😊",
      desc: "Price action today",
    },
  ];

  const advancedMetrics = [
    {
      label: "RSI (14)",
      value: currentAnalysis?.rsi_14 || "...",
      sub: "Relative Strength",
    },
    {
      label: "50-Day SMA",
      value: currentAnalysis?.sma_50 ? `$${currentAnalysis.sma_50}` : "...",
      sub: "Short-term trend",
    },
    {
      label: "200-Day SMA",
      value: currentAnalysis?.sma_200 ? `$${currentAnalysis.sma_200}` : "...",
      sub: "Long-term trend",
    },
    {
      label: "AI Trend",
      value: currentAnalysis?.trend_signal || "...",
      sub: "Calculated Signal",
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── TOP NAVIGATION BAR ── */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              padding: 8,
              backgroundColor: colors.surface,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <ChevronLeft color={colors.text} size={24} />
          </TouchableOpacity>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              onPress={toggleDarkMode}
              style={{
                padding: 8,
                backgroundColor: colors.surface,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              {isDarkMode ? (
                <Sun color={colors.textSecondary} size={24} />
              ) : (
                <Moon color={colors.textSecondary} size={24} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                setUserMode(userMode === "beginner" ? "advanced" : "beginner")
              }
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                backgroundColor: colors.surface,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                justifyContent: "center",
              }}
            >
              <Text
                style={{ color: colors.text, fontWeight: "700", fontSize: 14 }}
              >
                {userMode === "beginner" ? "🐣 Beginner" : "🦅 Pro"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Header Section ── */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={[styles.ticker, { color: colors.text }]}>
              {stockBasic.ticker}
            </Text>
            <SignalBadge signal={stockBasic.signal} />
          </View>
          <Text style={[styles.companyName, { color: colors.textSecondary }]}>
            {stockBasic.name}
          </Text>

          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: colors.text }]}>
              ${stockBasic.price.toFixed(2)}
            </Text>
            <View
              style={[
                styles.changeBadge,
                {
                  backgroundColor:
                    stockBasic.change >= 0
                      ? "rgba(16, 185, 129, 0.12)"
                      : "rgba(244, 63, 94, 0.12)",
                },
              ]}
            >
              <Text
                style={[
                  styles.changeText,
                  { color: stockBasic.change >= 0 ? colors.green : colors.red },
                ]}
              >
                {stockBasic.change >= 0 ? "+" : ""}
                {stockBasic.change.toFixed(2)} (
                {stockBasic.changePercent.toFixed(2)}%)
              </Text>
            </View>
          </View>
        </View>

        {/* ── AI Insight Card ── */}
        {!isAnalysisLoading && currentAnalysis?.ai_insight && (
          <View
            style={{
              backgroundColor: isDarkMode
                ? "rgba(79, 70, 229, 0.1)"
                : "rgba(79, 70, 229, 0.05)",
              borderColor: colors.accent,
              borderWidth: 1,
              borderRadius: 16,
              padding: 16,
              marginBottom: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
                gap: 8,
              }}
            >
              <Sparkles color={colors.accent} size={18} />
              <Text
                style={{
                  color: colors.accent,
                  fontWeight: "800",
                  fontSize: 14,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                AI Market Insight
              </Text>
            </View>
            <Text
              style={{
                color: colors.text,
                fontSize: 15,
                lineHeight: 22,
                fontWeight: "500",
              }}
            >
              {userMode === "beginner"
                ? currentAnalysis.ai_insight.beginner
                : currentAnalysis.ai_insight.advanced}
            </Text>
          </View>
        )}

        {/* ── Chart Section ── */}
        {!isAnalysisLoading && currentAnalysis?.chart_data ? (
          userMode === "beginner" ? (
            <BeginnerChart colors={colors} data={currentAnalysis.chart_data} />
          ) : (
            <AdvancedChart colors={colors} data={currentAnalysis.chart_data} />
          )
        ) : (
          <View
            style={[
              styles.chartCard,
              {
                height: CHART_HEIGHT,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={{ color: colors.textSecondary, marginTop: 12 }}>
              Drawing Charts...
            </Text>
          </View>
        )}

        {/* ── Dynamic Stats ── */}
        {!isAnalysisLoading && (
          <View style={styles.statsContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {userMode === "beginner"
                ? "Quick Overview"
                : "Technical Analysis"}
            </Text>

            {userMode === "beginner" ? (
              beginnerMetrics.map((metric, i) => (
                <View
                  key={i}
                  style={[
                    styles.statRow,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <View style={styles.statLeft}>
                    <Text style={styles.statEmoji}>{metric.emoji}</Text>
                    <View>
                      <Text
                        style={[
                          styles.statLabel,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {metric.label}
                      </Text>
                      <Text
                        style={[
                          styles.statDesc,
                          { color: colors.textSecondary, opacity: 0.6 },
                        ]}
                      >
                        {metric.desc}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {metric.value}
                  </Text>
                </View>
              ))
            ) : (
              <View style={styles.advancedGrid}>
                {advancedMetrics.map((metric, i) => (
                  <View
                    key={i}
                    style={[
                      styles.advancedCard,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.advancedLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {metric.label}
                    </Text>
                    <Text
                      style={[styles.advancedValue, { color: colors.text }]}
                    >
                      {metric.value}
                    </Text>
                    <Text
                      style={[
                        styles.advancedSub,
                        { color: colors.textSecondary, opacity: 0.5 },
                      ]}
                    >
                      {metric.sub}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16 },
  header: { marginBottom: 20 },
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
  axisLabelSmall: { fontSize: 9, fontWeight: "500", opacity: 0.4 },
  lineChartContainer: { flex: 1, height: CHART_HEIGHT, position: "relative" },
  lineSegment: { position: "absolute", height: 2.5, borderRadius: 1.5 },
  glowDot: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    opacity: 0.3,
  },
  advChartArea: { height: CHART_HEIGHT + 30, position: "relative" },
  advYAxis: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 36,
    height: CHART_HEIGHT,
  },
  candlesContainer: {
    position: "absolute",
    left: 40,
    right: 0,
    top: 0,
    height: CHART_HEIGHT,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  wick: { position: "absolute", width: 2, borderRadius: 1 },
  candle: { position: "absolute", borderRadius: 2, borderWidth: 0.5 },
  volumeBar: { position: "absolute", borderRadius: 1 },
  statsContainer: { marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "700", marginBottom: 16 },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
  },
  statLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  statEmoji: { fontSize: 22 },
  statLabel: { fontSize: 13, fontWeight: "600" },
  statDesc: { fontSize: 11, fontWeight: "400", marginTop: 1 },
  statValue: { fontSize: 16, fontWeight: "700" },
  advancedGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  advancedCard: {
    width: (SCREEN_WIDTH - 50) / 2,
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  advancedLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  advancedValue: { fontSize: 18, fontWeight: "800", marginBottom: 4 },
  advancedSub: { fontSize: 10, fontWeight: "500" },
});
