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
import { useAppStore } from "../store/useAppStore";

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

// ─── Beginner Chart Placeholder ───
const BeginnerChart = ({
  colors,
}: {
  colors: ReturnType<typeof getColors>;
}) => {
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
      />
      <Text style={[styles.chartTitle, { color: colors.text }]}>
        Price Performance
      </Text>
      <Text style={[styles.chartSubtitle, { color: colors.textSecondary }]}>
        Smooth ride to the top 🚀
      </Text>
      <View
        style={[
          styles.chartArea,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: colors.accent, fontWeight: "bold" }}>
          [ Beautiful Line Chart Here ]
        </Text>
      </View>
    </View>
  );
};

// ─── Advanced Chart Placeholder ───
const AdvancedChart = ({
  colors,
}: {
  colors: ReturnType<typeof getColors>;
}) => {
  return (
    <View
      style={[
        styles.chartCard,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.chartTitle, { color: colors.text }]}>
        1Y Candlestick
      </Text>
      <Text style={[styles.chartSubtitle, { color: colors.textSecondary }]}>
        Interactive · Volume overlay
      </Text>
      <View
        style={[
          styles.chartArea,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: colors.textSecondary, fontWeight: "bold" }}>
          [ Complex Candlestick Chart Here ]
        </Text>
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

  // 1. Grab the basic info from the Home Screen list
  const stockBasic = liveStocks.find((s) => s.ticker === ticker) || {
    ticker: ticker,
    name: `${ticker} Corp`,
    price: 0,
    change: 0,
    changePercent: 0,
    signal: "Neutral" as const,
  };

  // 2. Fetch the heavy math analysis when the screen opens!
  useEffect(() => {
    fetchStockAnalysis(ticker);
  }, [ticker]);

  // 3. Dynamic Stats Arrays based on REAL data!
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

        {/* ── NEW: AI Insight Card ── */}
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

        {/* ── Simple / Pro Toggle Switch ── */}
        <View
          style={[
            styles.toggleContainer,
            {
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.05)",
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setUserMode("beginner")}
            style={[
              styles.toggleButton,
              userMode === "beginner" && { backgroundColor: colors.surface },
            ]}
          >
            <Text
              style={[
                styles.toggleText,
                {
                  color:
                    userMode === "beginner"
                      ? colors.text
                      : colors.textSecondary,
                },
              ]}
            >
              Simple
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setUserMode("advanced")}
            style={[
              styles.toggleButton,
              userMode === "advanced" && { backgroundColor: colors.surface },
            ]}
          >
            <Text
              style={[
                styles.toggleText,
                {
                  color:
                    userMode === "advanced"
                      ? colors.text
                      : colors.textSecondary,
                },
              ]}
            >
              Pro
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Chart Section ── */}
        {userMode === "beginner" ? (
          <BeginnerChart colors={colors} />
        ) : (
          <AdvancedChart colors={colors} />
        )}

        {/* ── Dynamic Stats Loading ── */}
        {isAnalysisLoading ? (
          <View style={{ padding: 40, alignItems: "center" }}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={{ color: colors.textSecondary, marginTop: 12 }}>
              Calculating technicals...
            </Text>
          </View>
        ) : (
          <View style={styles.statsContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {userMode === "beginner"
                ? "Quick Overview"
                : "Technical Analysis"}
            </Text>

            {userMode === "beginner" ? (
              // Beginner UI
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
              // Advanced UI
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
  toggleContainer: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  toggleText: { fontSize: 15, fontWeight: "700" },
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
  chartArea: { height: CHART_HEIGHT },
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
