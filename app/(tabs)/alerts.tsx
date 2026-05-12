import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Modal,
  PanResponder,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../src/components/Card";
import { Typography } from "../../src/components/Typography";
import { useAppStore } from "../../src/store/useAppStore";

// ---------- Swipeable Row ----------
const SwipeableRow = ({
  children,
  onDelete,
}: {
  children: React.ReactNode;
  onDelete: () => void;
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const deleteBtnWidth = 80;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 10,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(Math.max(gestureState.dx, -deleteBtnWidth));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -50) {
          Animated.spring(translateX, {
            toValue: -deleteBtnWidth,
            useNativeDriver: true,
          }).start();
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const resetSwipe = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View className="overflow-hidden rounded-card">
      <Animated.View style={{ transform: [{ translateX }] }}>
        {children}
      </Animated.View>
      <View
        className="absolute top-0 right-0 h-full justify-center bg-bearish"
        style={{ width: deleteBtnWidth }}
      >
        <TouchableOpacity
          className="items-center justify-center flex-1 px-2"
          onPress={() => {
            onDelete();
            resetSwipe();
          }}
        >
          <Typography variant="caption" className="text-white font-semibold">
            Delete
          </Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ---------- Toast ----------
const Toast = ({
  message,
  visible,
  onHide,
}: {
  message: string;
  visible: boolean;
  onHide: () => void;
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => onHide());
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={{ opacity }}
      className="absolute top-12 left-0 right-0 items-center z-50"
    >
      <View className="bg-primary-dark dark:bg-primary-light px-6 py-3 rounded-full shadow-modal-light dark:shadow-modal-dark">
        <Typography variant="body" className="text-white font-semibold">
          {message}
        </Typography>
      </View>
    </Animated.View>
  );
};

// ---------- Alert Setup Modal ----------
const AlertSetupModal = ({
  visible,
  onClose,
  onSave,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (type: string) => void;
}) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const alertTypes = [
    {
      id: "ai_signal",
      title: "AI Signal Change",
      description: "Get notified when our AI changes a stock’s signal.",
      icon: "🤖",
    },
    {
      id: "price_drop",
      title: "Price Drop",
      description: "Alert when a stock drops by a certain %.",
      icon: "📉",
    },
    {
      id: "negative_news",
      title: "Negative News",
      description: "Be the first to know about bad news.",
      icon: "📰",
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="flex-1 bg-black/40 justify-end"
      >
        <Animated.View
          className="bg-surface-light dark:bg-surface-dark rounded-modal px-4 pt-6 pb-8 mx-3 mb-3"
          style={{ transform: [{ translateY: slideAnim }] }}
        >
          {/* Handle bar */}
          <View className="items-center mb-4">
            <View className="w-12 h-1.5 bg-neutral-light dark:bg-neutral-dark rounded-full" />
          </View>

          <Typography
            variant="h3"
            className="font-semibold mb-6 dark:text-text-dark"
          >
            Choose Alert Type
          </Typography>

          {alertTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              onPress={() => setSelectedType(type.id)}
              activeOpacity={0.9}
              className="mb-4"
            >
              <Card
                variant="outlined"
                className={`flex-row items-center p-4 ${
                  selectedType === type.id ? "border-2 border-primary" : ""
                }`}
              >
                <View className="flex-row items-center flex-1">
                  <Typography variant="h2" className="mr-4">
                    {type.icon}
                  </Typography>
                  <View className="flex-1">
                    <Typography
                      variant="body"
                      className="font-semibold dark:text-text-dark"
                    >
                      {type.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      className="text-neutral dark:text-neutral-light"
                    >
                      {type.description}
                    </Typography>
                  </View>
                </View>
                {selectedType === type.id && (
                  <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                    <Typography variant="caption" className="text-white">
                      ✓
                    </Typography>
                  </View>
                )}
              </Card>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            disabled={!selectedType}
            className={`py-3 rounded-button items-center ${
              selectedType
                ? "bg-primary"
                : "bg-neutral-light dark:bg-neutral-dark"
            }`}
            onPress={() => {
              if (selectedType) {
                onSave(selectedType);
                onClose();
              }
            }}
          >
            <Typography
              variant="body"
              className={`font-semibold ${
                selectedType
                  ? "text-white"
                  : "text-neutral dark:text-neutral-light"
              }`}
            >
              Save Alert
            </Typography>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

// ---------- Main AlertsScreen ----------
export default function AlertsScreen() {
  const { alerts, addAlert, toggleAlert, removeAlert } = useAppStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const activeCount = alerts.filter((a) => a.active).length;

  const handleSaveAlert = useCallback(
    (type: string) => {
      const newAlert = {
        id: Date.now().toString(),
        type,
        ticker: "AAPL", // placeholder – you can add a ticker selector later
        description: getDescriptionForType(type),
        emoji: getEmojiForType(type),
        active: true,
      };
      addAlert(newAlert);
      setToastMessage("Alert created successfully!");
      setToastVisible(true);
    },
    [addAlert],
  );

  const getDescriptionForType = (type: string) => {
    switch (type) {
      case "ai_signal":
        return "AI signal change for AAPL";
      case "price_drop":
        return "Price drops over 5%";
      case "negative_news":
        return "Negative news detected";
      default:
        return "";
    }
  };

  const getEmojiForType = (type: string) => {
    switch (type) {
      case "ai_signal":
        return "🤖";
      case "price_drop":
        return "📉";
      case "negative_news":
        return "📰";
      default:
        return "🔔";
    }
  };

  const alertTypeLabels: Record<string, string> = {
    ai_signal: "AI Signal",
    price_drop: "Price Drop",
    negative_news: "Negative News",
  };

  // Empty state
  if (alerts.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark justify-center items-center">
        <Typography variant="h1" className="text-6xl mb-6">
          📊
        </Typography>
        <Typography
          variant="h3"
          className="text-center font-semibold mb-2 dark:text-text-dark"
        >
          No alerts yet
        </Typography>
        <Typography
          variant="body"
          className="text-center text-neutral dark:text-neutral-light mb-8"
        >
          Tap the + button to create one
        </Typography>

        {/* FAB */}
        <TouchableOpacity
          className="absolute bottom-8 right-8 w-16 h-16 bg-primary rounded-full items-center justify-center shadow-modal-light dark:shadow-modal-dark"
          onPress={() => setModalVisible(true)}
        >
          <Typography variant="h2" className="text-white">
            +
          </Typography>
        </TouchableOpacity>

        <AlertSetupModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleSaveAlert}
        />
        <Toast
          message={toastMessage}
          visible={toastVisible}
          onHide={() => setToastVisible(false)}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      {/* Header */}
      <View className="px-4 pt-2 pb-2 flex-row justify-between items-center">
        <View>
          <Typography variant="h2" className="font-bold dark:text-text-dark">
            Smart Alerts
          </Typography>
          <Typography
            variant="caption"
            className="text-neutral dark:text-neutral-light"
          >
            {activeCount} active
          </Typography>
        </View>
      </View>

      {/* Alerts List */}
      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) => (
          <SwipeableRow onDelete={() => removeAlert(item.id)}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => toggleAlert(item.id)}
            >
              <Card
                variant="outlined"
                className={`flex-row items-center p-4 ${
                  !item.active ? "opacity-60" : ""
                }`}
              >
                <Typography variant="h2" className="mr-4">
                  {item.emoji ?? "🔔"}
                </Typography>
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Typography
                      variant="body"
                      className="font-semibold dark:text-text-dark"
                    >
                      {item.ticker}
                    </Typography>
                    <View className="bg-primary/10 dark:bg-primary-dark/10 px-2 py-0.5 rounded-full">
                      <Typography
                        variant="caption"
                        className="text-primary dark:text-primary-light font-medium"
                      >
                        {alertTypeLabels[item.type] ?? item.type}
                      </Typography>
                    </View>
                  </View>
                  <Typography
                    variant="caption"
                    className="text-neutral dark:text-neutral-light"
                  >
                    {item.description}
                  </Typography>
                </View>
                <View
                  className={`w-3 h-3 rounded-full ml-2 ${
                    item.active
                      ? "bg-primary"
                      : "bg-neutral-light dark:bg-neutral-dark border border-neutral"
                  }`}
                />
              </Card>
            </TouchableOpacity>
          </SwipeableRow>
        )}
      />

      {/* FAB */}
      <TouchableOpacity
        className="absolute bottom-8 right-8 w-16 h-16 bg-primary rounded-full items-center justify-center shadow-modal-light dark:shadow-modal-dark"
        onPress={() => setModalVisible(true)}
      >
        <Typography variant="h2" className="text-white">
          +
        </Typography>
      </TouchableOpacity>

      <AlertSetupModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveAlert}
      />
      <Toast
        message={toastMessage}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
}
