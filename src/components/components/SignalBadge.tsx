import React from "react";
import { Text, View } from "react-native";

type Signal = "Bullish" | "Bearish" | "Neutral";

interface SignalBadgeProps {
  signal: Signal;
}

const signalStyles: Record<Signal, { textColor: string; bgClass: string }> = {
  Bullish: {
    textColor: "#10B981",
    bgClass: "bg-bullish",
  },
  Bearish: {
    textColor: "#F43F5E",
    bgClass: "bg-bearish",
  },
  Neutral: {
    textColor: "#64748B",
    bgClass: "bg-neutral",
  },
};

const SignalBadge: React.FC<SignalBadgeProps> = ({ signal }) => {
  const style = signalStyles[signal];

  return (
    <View
      className={`self-start rounded-full px-3 py-1`}
      style={{
        backgroundColor:
          signal === "Bullish"
            ? "rgba(16, 185, 129, 0.15)"
            : signal === "Bearish"
              ? "rgba(244, 63, 94, 0.15)"
              : "rgba(100, 116, 139, 0.15)",
      }}
    >
      <Text
        style={{ color: style.textColor }}
        className="text-xs font-semibold tracking-wide"
      >
        {signal}
      </Text>
    </View>
  );
};

export default SignalBadge;
