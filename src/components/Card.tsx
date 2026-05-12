import React from "react";
import { View, ViewProps } from "react-native";
import { cn } from "../lib/utils";

// Helper to strip text-related classes before passing to View
const viewClasses = (className?: string) => {
  if (!className) return "";
  return className
    .split(/\s+/)
    .filter(
      (c) =>
        !c.startsWith("text-") &&
        !c.startsWith("font-") &&
        !c.startsWith("leading-") &&
        !c.startsWith("tracking-"),
    )
    .join(" ");
};

interface CardProps extends ViewProps {
  variant?: "elevated" | "outlined" | "filled";
  children: React.ReactNode;
}

const variantStyles = {
  elevated:
    "bg-surface-light dark:bg-surface-dark rounded-card shadow-card-light dark:shadow-card-dark",
  outlined:
    "bg-surface-light dark:bg-surface-dark rounded-card border border-neutral-light dark:border-neutral-dark",
  filled: "bg-neutral-light dark:bg-neutral-dark rounded-card",
};

export const Card: React.FC<CardProps> = ({
  variant = "elevated",
  children,
  className,
  ...props
}) => {
  return (
    <View
      className={cn("p-4", variantStyles[variant], viewClasses(className))}
      {...props}
    >
      {children}
    </View>
  );
};
