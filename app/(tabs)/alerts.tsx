import {
    Bell,
    Plus,
    X
} from "lucide-react-native";
import React, { useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useAppStore } from "../../src/store/useAppStore";

// ─── Mock Alert Data ──────────────────────────────────────────────────────────

const mockAlerts = [
  {
    id: "1",
    ticker: "AAPL",
    type: "AI Signal Change",
    description: "Alert me if AI signal turns Bearish",
    icon: "🤖",
    active: true,
  },
  {
    id: "2",
    ticker: "TSLA",
    type: "Price Drop",
    description: "Alert me if price drops by 5%",
    icon: "📉",
    active: true,
  },
  {
    id: "3",
    ticker: "NVDA",
    type: "News Sentiment",
    description: "Alert me if bad news breaks",
    icon: "📰",
    active: false,
  },
];

// ─── Alert Type Options ───────────────────────────────────────────────────────

const alertTypes = [
  {
    id: "signal",
    title: "AI Signal Change",
    subtitle: "Get notified when signal turns Bullish or Bearish",
    emoji: "🤖",
  },
  {
    id: "price",
    title: "Price Drop (Buy the Dip)",
    subtitle: "Get notified if the stock drops by 5% or more",
    emoji: "📉",
  },
  {
    id: "news",
    title: "Negative News Alert",
    subtitle: "Get notified if bad news or sentiment drops",
    emoji: "📰",
  },
];

// ─── Main Alerts Screen ───────────────────────────────────────────────────────

export default function AlertsScreen() {
  const { isDarkMode } = useAppStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAlertType, setSelectedAlertType] = useState<string | null>(
    null,
  );

  const colors = {
    bg: isDarkMode ? "#0F172A" : "#F8FAFC",
    surface: isDarkMode ? "#1E293B" : "#FFFFFF",
    text: isDarkMode ? "#F8FAFC" : "#0F172A",
    textSecondary: isDarkMode ? "#94A3B8" : "#64748B",
    border: isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
    modalBg: isDarkMode ? "#1E293B" : "#FFFFFF",
    overlay: "rgba(0,0,0,0.6)",
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
              {mockAlerts.filter((a) => a.active).length} active alerts
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

          {mockAlerts.map((alert) => (
            <View
              key={alert.id}
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
                <Text style={styles.alertEmoji}>{alert.icon}</Text>
                <View style={styles.alertInfo}>
                  <View style={styles.alertTitleRow}>
                    <Text style={[styles.alertTicker, { color: colors.text }]}>
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
            </View>
          ))}
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
            {/* Modal Handle */}
            <View
              style={[
                styles.modalHandle,
                { backgroundColor: isDarkMode ? "#334155" : "#E2E8F0" },
              ]}
            />

            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Choose Alert Type
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

            <Text
              style={[styles.modalSubtitle, { color: colors.textSecondary }]}
            >
              Select what triggers this alert
            </Text>

            {/* Alert Type Options */}
            {alertTypes.map((type) => {
              const isSelected = selectedAlertType === type.id;
              return (
                <TouchableOpacity
                  key={type.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedAlertType(type.id)}
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
              onPress={() => {
                setModalVisible(false);
                setSelectedAlertType(null);
              }}
              style={[
                styles.saveButton,
                { opacity: selectedAlertType ? 1 : 0.4 },
              ]}
              disabled={!selectedAlertType}
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
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
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
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
    marginTop: 8,
  },
  saveButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});
