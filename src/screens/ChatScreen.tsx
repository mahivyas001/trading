import { Send } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography } from "../components/Typography";
import { useAppStore } from "../store/useAppStore";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

export default function ChatScreen() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const { isDarkMode } = useAppStore();
  const colors = {
    bg: isDarkMode ? "#0F172A" : "#F8FAFC",
    surface: isDarkMode ? "#1E293B" : "#FFFFFF",
    text: isDarkMode ? "#F8FAFC" : "#0F172A",
    textSecondary: isDarkMode ? "#94A3B8" : "#64748B",
    bubbleUser: "#4F46E5",
    bubbleAI: isDarkMode ? "#334155" : "#E2E8F0",
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      isUser: true,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Call your backend chat endpoint
      const response = await fetch("http://192.168.1.9:8081/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticker: "AAPL", // Default ticker – you could let the user choose
          message: userMsg.text,
        }),
      });
      const data = await response.json();

      let replyText = "Sorry, I couldn't fetch a response.";
      if (data.success && data.reply) {
        replyText = data.reply;
      } else if (data.error) {
        replyText = data.error;
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: replyText,
        isUser: false,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "Network error. Make sure the backend is running.",
          isUser: false,
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(
        () => flatListRef.current?.scrollToEnd({ animated: true }),
        100,
      );
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View className={`mb-3 ${item.isUser ? "items-end" : "items-start"}`}>
      <View
        style={{
          backgroundColor: item.isUser ? colors.bubbleUser : colors.bubbleAI,
          maxWidth: "80%",
          borderRadius: 16,
          padding: 12,
          borderBottomRightRadius: item.isUser ? 4 : 16,
          borderBottomLeftRadius: item.isUser ? 16 : 4,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        }}
      >
        <Typography
          variant="body"
          style={{ color: item.isUser ? "#FFFFFF" : colors.text }}
        >
          {item.text}
        </Typography>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center">
            <Typography variant="h3" style={{ color: colors.textSecondary }}>
              Ask me anything about stocks!
            </Typography>
            <Typography
              variant="caption"
              style={{ color: colors.textSecondary }}
            >
              e.g., "What's happening with AAPL?"
            </Typography>
          </View>
        }
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="p-3 border-t border-neutral-light dark:border-neutral-dark"
        style={{ backgroundColor: colors.surface }}
      >
        <View className="flex-row items-center gap-2">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type your question..."
            placeholderTextColor={colors.textSecondary}
            className="flex-1 px-4 py-3 rounded-full text-base"
            style={{
              backgroundColor: isDarkMode ? "#0F172A" : "#F8FAFC",
              color: colors.text,
              borderWidth: 1,
              borderColor: isDarkMode ? "#334155" : "#E2E8F0",
            }}
            multiline
            returnKeyType="send"
            onSubmitEditing={sendMessage}
            editable={!loading}
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={loading || !input.trim()}
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{
              backgroundColor: loading || !input.trim() ? "#94A3B8" : "#4F46E5",
            }}
          >
            <Send color="#FFFFFF" size={18} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
