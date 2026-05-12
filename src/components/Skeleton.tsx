import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { cn } from "../lib/utils";

interface SkeletonProps {
  width?: number;
  height?: number;
  circle?: boolean;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = 100,
  height = 20,
  circle = false,
  className,
}) => {
  const shimmerWidth = width * 2;
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(translateX, {
        toValue: width,
        duration: 1500,
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [width, translateX]);

  return (
    <View
      className={cn(
        "overflow-hidden bg-neutral-light dark:bg-neutral-dark",
        circle ? "rounded-full" : "rounded",
        className,
      )}
      style={{
        width: circle ? width : width,
        height: circle ? width : height,
      }}
    >
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: shimmerWidth,
          left: 0,
          transform: [{ translateX }],
        }}
      >
        <LinearGradient
          colors={[
            "rgba(255,255,255,0)",
            "rgba(255,255,255,0.3)",
            "rgba(255,255,255,0.3)",
            "rgba(255,255,255,0)",
          ]}
          locations={[0, 0.4, 0.6, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
};
