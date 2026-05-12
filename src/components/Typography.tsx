import React from "react";
import { Text, TextProps } from "react-native";
import { cn } from "../lib/utils";

interface TypographyProps extends TextProps {
  variant?: "h1" | "h2" | "h3" | "body" | "caption";
  children: React.ReactNode;
}

const variantStyles = {
  h1: "text-4xl font-bold text-text-light dark:text-text-dark",
  h2: "text-3xl font-semibold text-text-light dark:text-text-dark",
  h3: "text-2xl font-semibold text-text-light dark:text-text-dark",
  body: "text-base text-text-light dark:text-text-dark",
  caption: "text-xs text-neutral dark:text-neutral-light",
};

export const Typography: React.FC<TypographyProps> = ({
  variant = "body",
  children,
  className,
  ...props
}) => {
  return (
    <Text className={cn(variantStyles[variant], className)} {...props}>
      {children}
    </Text>
  );
};
