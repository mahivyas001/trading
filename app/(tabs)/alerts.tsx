import { Bell, Plus, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppStore } from "../../src/store/useAppStore";

const alertTypes = [
  {
    id: "signal",
    title: "AI Signal Change",
    subtitle: "Notify when signal turns Bullish or Bearish",
    emoji: "🤖",
  },
  {
    id: "price",
    title: "Price Drop (Buy the Dip)",
    subtitle: "Notify if the stock drops by 5% or more",
    emoji: "📉",
  },
  {
    id: "news",
    title: "Negative News Alert",
    subtitle: "Notify if bad news or sentiment drops",
    emoji: "📰",
  },
];

export default function AlertsScreen() {
  const { isDarkMode, alerts, addAlert, toggleAlert } = useAppStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<
    (typeof alertTypes)[0] | null
  >(null);
  const [tickerInput, setTickerInput] = useState("");

  const colors = {
    bg: isDarkMode ? "#0F172A" : "#F8FAFC",
    surface: isDarkMode ? "#1E293B" : "#FFFFFF",
    text: isDarkMode ? "#F8FAFC" : "#0F172A",
    textSecondary: isDarkMode ? "#94A3B8" : "#64748B",
    border: isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
    modalBg: isDarkMode ? "#1E293B" : "#FFFFFF",
    overlay: "rgba(0,0,0,0.6)",
  };

  const handleSaveAlert = () => {
    if (!selectedType || !tickerInput.trim()) return;

    addAlert({
      id: Math.random().toString(),
      ticker: tickerInput.toUpperCase().trim(),
      type: selectedType.title,
      description: selectedType.subtitle,
      emoji: selectedType.emoji,
      active: true,
    });

    setModalVisible(false);
    setSelectedType(null);
    setTickerInput("");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Smart Alerts
            </Text>
            <Text
              style={[styles.headerSubtitle, { color: colors.textSecondary }]}
            >
              {alerts.filter((a) => a.active).length} active alerts watching the
              market
            </Text>
          </View>
          <View
            style={[
              styles.headerBadge,
              { backgroundColor: "rgba(79, 70, 229, 0.15)" },
            ]}
          >
            <Bell color="#4F46E5" size={20} />
          </View>
        </View>

        {/* ── Active Alerts List ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            YOUR ALERTS
          </Text>

          {alerts.length === 0 ? (
            <View style={{ padding: 40, alignItems: "center", opacity: 0.5 }}>
              <Bell color={colors.textSecondary} size={40} />
              <Text
                style={{
                  color: colors.textSecondary,
                  marginTop: 12,
                  fontWeight: "600",
                }}
              >
                No alerts set yet.
              </Text>
            </View>
          ) : (
            alerts.map((alert) => (
              <TouchableOpacity
                key={alert.id}
                activeOpacity={0.8}
                onPress={() => toggleAlert(alert.id)}
                style={[
                  styles.alertCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    opacity: alert.active ? 1 : 0.5,
                  },
                ]}
              >
                <View style={styles.alertLeft}>
                  <Text style={styles.alertEmoji}>{alert.emoji}</Text>
                  <View style={styles.alertInfo}>
                    <View style={styles.alertTitleRow}>
                      <Text
                        style={[styles.alertTicker, { color: colors.text }]}
                      >
                        {alert.ticker}
                      </Text>
                      <View
                        style={[
                          styles.alertTypeBadge,
                          { backgroundColor: "rgba(79, 70, 229, 0.1)" },
                        ]}
                      >
                        <Text style={styles.alertTypeText}>{alert.type}</Text>
                      </View>
                    </View>
                    <Text
                      style={[
                        styles.alertDescription,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {alert.description}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.activeDot,
                    { backgroundColor: alert.active ? "#10B981" : "#64748B" },
                  ]}
                />
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* ── Floating Create Alert Button ── */}
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setModalVisible(true)}
          style={styles.createButton}
        >
          <Plus color="#FFFFFF" size={20} strokeWidth={2.5} />
          <Text style={styles.createButtonText}>Create New Alert</Text>
        </TouchableOpacity>
      </View>

      {/* ── Bottom Sheet Modal ── */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}
        >
          <View
            style={[styles.modalSheet, { backgroundColor: colors.modalBg }]}
          >
            <View
              style={[
                styles.modalHandle,
                { backgroundColor: isDarkMode ? "#334155" : "#E2E8F0" },
              ]}
            />

            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Create Alert
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[
                  styles.closeButton,
                  { backgroundColor: isDarkMode ? "#0F172A" : "#F1F5F9" },
                ]}
              >
                <X color={colors.textSecondary} size={18} />
              </TouchableOpacity>
            </View>

            {/* Ticker Input */}
            <Text
              style={{
                color: colors.textSecondary,
                fontWeight: "600",
                marginBottom: 8,
                marginTop: 10,
              }}
            >
              Stock Ticker:
            </Text>
            <TextInput
              value={tickerInput}
              onChangeText={setTickerInput}
              placeholder="e.g., AAPL"
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="characters"
              style={{
                backgroundColor: isDarkMode ? "#0F172A" : "#F8FAFC",
                color: colors.text,
                padding: 16,
                borderRadius: 12,
                fontSize: 16,
                fontWeight: "700",
                borderWidth: 1,
                borderColor: colors.border,
                marginBottom: 20,
              }}
            />

            <Text
              style={{
                color: colors.textSecondary,
                fontWeight: "600",
                marginBottom: 8,
              }}
            >
              Trigger Condition:
            </Text>
            {alertTypes.map((type) => {
              const isSelected = selectedType?.id === type.id;
              return (
                <TouchableOpacity
                  key={type.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedType(type)}
                  style={[
                    styles.alertTypeCard,
                    {
                      backgroundColor: isSelected
                        ? "rgba(79, 70, 229, 0.1)"
                        : isDarkMode
                          ? "#0F172A"
                          : "#F8FAFC",
                      borderColor: isSelected ? "#4F46E5" : colors.border,
                      borderWidth: isSelected ? 1.5 : 1,
                    },
                  ]}
                >
                  <Text style={styles.alertTypeEmoji}>{type.emoji}</Text>
                  <View style={styles.alertTypeInfo}>
                    <Text
                      style={[styles.alertTypeTitle, { color: colors.text }]}
                    >
                      {type.title}
                    </Text>
                    <Text
                      style={[
                        styles.alertTypeSubtitle,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {type.subtitle}
                    </Text>
                  </View>
                  {isSelected && (
                    <View style={styles.selectedIndicator}>
                      <Text style={styles.selectedCheck}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}

            {/* Save Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleSaveAlert}
              style={[
                styles.saveButton,
                { opacity: selectedType && tickerInput.trim() ? 1 : 0.4 },
              ]}
              disabled={!selectedType || !tickerInput.trim()}
            >
              <Text style={styles.saveButtonText}>Save Alert</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  headerTitle: { fontSize: 32, fontWeight: "800", letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 14, fontWeight: "500", marginTop: 4 },
  headerBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  section: { paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 12,
  },
  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
  alertLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  alertEmoji: { fontSize: 28, marginRight: 14 },
  alertInfo: { flex: 1 },
  alertTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  alertTicker: { fontSize: 16, fontWeight: "800" },
  alertTypeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  alertTypeText: { fontSize: 10, fontWeight: "700", color: "#4F46E5" },
  alertDescription: { fontSize: 12, fontWeight: "500" },
  activeDot: { width: 10, height: 10, borderRadius: 5, marginLeft: 12 },
  floatingButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  createButton: {
    backgroundColor: "#4F46E5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  createButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  modalTitle: { fontSize: 22, fontWeight: "800" },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modalSubtitle: { fontSize: 14, fontWeight: "500", marginBottom: 20 },
  alertTypeCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
  },
  alertTypeEmoji: { fontSize: 26, marginRight: 14 },
  alertTypeInfo: { flex: 1 },
  alertTypeTitle: { fontSize: 15, fontWeight: "700", marginBottom: 3 },
  alertTypeSubtitle: { fontSize: 12, fontWeight: "500" },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedCheck: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
  saveButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 14,
  },
  saveButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});
