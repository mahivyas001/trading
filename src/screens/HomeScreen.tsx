import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Moon, Sparkles, Sun } from "lucide-react-native";
import React, { useCallback, useEffect } from "react";
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../components/Card";
import SignalBadge from "../components/SignalBadge";
import { Skeleton } from "../components/Skeleton";
import { Typography } from "../components/Typography";
import { useAppStore } from "../store/useAppStore";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const RADAR_CARD_WIDTH = SCREEN_WIDTH * 0.65;

export default function HomeScreen() {
  const router = useRouter();
  const {
    isDarkMode,
    toggleDarkMode,
    liveStocks,
    isLoading,
    fetchLiveMarketData,
  } = useAppStore();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchLiveMarketData();
    setRefreshing(false);
  }, [fetchLiveMarketData]);

  useEffect(() => {
    if (liveStocks.length === 0) {
      fetchLiveMarketData();
    }
  }, []);

  // Split live stocks into radar (first 3) and watchlist (rest)
  const radarStocks = liveStocks.slice(0, 3);
  const watchlistStocks = liveStocks.slice(3);

  // Radar card
  const renderRadarCard = (item: any) => {
    const isBullish = item.signal === "Bullish";
    const gradientColors: readonly [string, string] = isBullish
      ? ["#4F46E5", "transparent"]
      : item.signal === "Bearish"
        ? ["#F43F5E", "transparent"]
        : ["#64748B", "transparent"]; // neutral

    return (
      <TouchableOpacity
        key={item.ticker}
        activeOpacity={0.8}
        onPress={() => router.push(`/stock/${item.ticker}`)}
        style={{ width: RADAR_CARD_WIDTH, marginRight: 12 }}
      >
        <Card variant="elevated" className="overflow-hidden">
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0.3 }}
            end={{ x: 0.7, y: 1 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 16,
            }}
          />
          <View className="p-4">
            <View className="flex-row justify-between items-center mb-2">
              <View>
                <Typography variant="h3" className="text-white">
                  {item.ticker}
                </Typography>
                <Typography variant="caption" className="text-white/80">
                  {item.name}
                </Typography>
              </View>
              <SignalBadge signal={item.signal} />
            </View>
            <Typography variant="h2" className="text-white">
              ${item.price.toFixed(2)}
            </Typography>
            <View className="flex-row items-center mt-1">
              <Typography
                variant="body"
                className={
                  isBullish
                    ? "text-white"
                    : item.signal === "Bearish"
                      ? "text-white"
                      : "text-white/70"
                }
              >
                {item.change >= 0 ? "+" : ""}
                {item.change.toFixed(2)} ({item.changePercent.toFixed(2)}%)
              </Typography>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  // Watchlist item
  const renderWatchlistItem = (item: any, index: number) => {
    const isBullish = item.signal === "Bullish";
    return (
      <TouchableOpacity
        key={item.ticker}
        onPress={() => router.push(`/stock/${item.ticker}`)}
        className={`flex-row items-center justify-between px-4 py-3 ${
          index % 2 === 0
            ? "bg-neutral-light/30 dark:bg-neutral-dark/30"
            : "bg-transparent"
        }`}
      >
        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary-dark/10 items-center justify-center mr-3">
            <Typography variant="body" className="font-bold text-primary">
              {item.ticker.charAt(0)}
            </Typography>
          </View>
          <View className="flex-1">
            <Typography variant="body" className="font-semibold">
              {item.ticker}
            </Typography>
            <Typography
              variant="caption"
              className="text-neutral dark:text-neutral-light"
            >
              {item.name}
            </Typography>
          </View>
        </View>
        <View className="items-end mr-2">
          <Typography variant="body" className="font-semibold">
            ${item.price.toFixed(2)}
          </Typography>
          <Typography
            variant="caption"
            className={isBullish ? "text-bullish" : "text-bearish"}
          >
            {item.change >= 0 ? "+" : ""}
            {item.changePercent.toFixed(2)}%
          </Typography>
        </View>
        <SignalBadge signal={item.signal} />
      </TouchableOpacity>
    );
  };

  // Empty watchlist state
  const EmptyWatchlist = () => (
    <View className="items-center py-10">
      <Typography variant="h1" className="text-5xl mb-4">
        📊
      </Typography>
      <Typography
        variant="body"
        className="text-center mb-4 text-neutral dark:text-neutral-light"
      >
        Your watchlist is empty
      </Typography>
      <TouchableOpacity className="bg-primary px-6 py-2 rounded-button">
        <Typography variant="body" className="text-white font-semibold">
          Add stocks to watch
        </Typography>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      {/* Header */}
      <View className="px-4 pt-2 pb-1 flex-row justify-between items-center">
        <View>
          <Typography variant="h2" className="font-bold">
            Market Mentor
          </Typography>
          <Typography
            variant="caption"
            className="text-neutral dark:text-neutral-light"
          >
            AI‑powered market insights
          </Typography>
        </View>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={toggleDarkMode} className="p-2">
            {isDarkMode ? (
              <Sun color="#94A3B8" size={24} />
            ) : (
              <Moon color="#64748B" size={24} />
            )}
          </TouchableOpacity>
          <TouchableOpacity className="p-2">
            <Sparkles color="#4F46E5" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar (simple, non‑functional for now) */}
      <View className="px-4 mt-2 mb-4">
        <View className="flex-row items-center bg-surface-light dark:bg-surface-dark rounded-full shadow-card-light dark:shadow-card-dark px-4 py-2">
          <Typography variant="body" className="mr-2">
            🔍
          </Typography>
          <TextInput
            placeholder="Search stocks..."
            placeholderTextColor="#94A3B8"
            className="flex-1 text-base text-text-light dark:text-text-dark"
          />
        </View>
      </View>

      {/* Main ScrollView */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* AI Radar */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center px-4 mb-3">
            <Typography variant="h3" className="font-semibold">
              Today's AI Radar
            </Typography>
            <TouchableOpacity>
              <Typography variant="body" className="text-primary">
                View all
              </Typography>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 16 }}
          >
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <View
                    key={i}
                    style={{ width: RADAR_CARD_WIDTH, marginRight: 12 }}
                  >
                    <Skeleton
                      width={RADAR_CARD_WIDTH - 8}
                      height={160}
                      className="rounded-card"
                    />
                  </View>
                ))
              : radarStocks.map((stock) => renderRadarCard(stock))}
          </ScrollView>
        </View>

        {/* Watchlist */}
        <View className="px-4 mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Typography variant="h3" className="font-semibold">
              Watchlist
            </Typography>
            <TouchableOpacity>
              <Typography variant="body" className="text-primary">
                Edit
              </Typography>
            </TouchableOpacity>
          </View>
          {isLoading ? (
            <View className="gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} width={100} height={64} className="rounded" />
              ))}
            </View>
          ) : watchlistStocks.length === 0 ? (
            <EmptyWatchlist />
          ) : (
            <View
              style={{
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              {watchlistStocks.map((item, index) =>
                renderWatchlistItem(item, index),
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
