import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { OrderStatus } from "../type/order";
import {
  ORDER_PIPELINE as PIPELINE,
  statusRank,
} from "../constants/orderPipeline";
import { useOrderTracking } from "../hooks/useOrderTracking";
import { fetchOrder } from "../store/orderSlice";
import { useAppDispatch } from "../store/hooks";

const ACCENT = "#DFFF5E";
const BG = "#F9F9F7";
const CARD_DARK = "#1a1a1a";

const LABELS: Record<OrderStatus, string> = {
  Pending: "Order placed",
  Processing: "Processed",
  Shipped: "Shipped",
  "In Transit": "In transit",
  Delivered: "Delivered",
};

function formatOrderHeaderId(id: string) {
  return id.startsWith("#") ? id : `#${id}`;
}

function formatEstimated(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

function formatHistoryTime(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

type Props = {
  orderId: string;
  onBack?: () => void;
};

export function OrderTrackingScreen({ orderId, onBack }: Props) {
  const dispatch = useAppDispatch();
  const { order, loading, error } = useOrderTracking(orderId);

  if (loading && !order) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={CARD_DARK} />
        <Text style={styles.loadingText}>Loading order…</Text>
      </View>
    );
  }

  if (error && !order) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorBody}>{error.message}</Text>
        <Pressable
          style={styles.retryBtn}
          onPress={() => dispatch(fetchOrder(orderId))}
        >
          <Text style={styles.retryLabel}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (!order) {
    return null;
  }

  const currentIdx = statusRank(order.status);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.headerRow}>
        <Pressable
          onPress={onBack}
          style={({ pressed }) => [
            styles.backBtn,
            pressed && styles.backBtnPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <View style={styles.headerTextWrap}>
          <Text style={styles.title}>Order Tracking</Text>
          <Text style={styles.subId}>{formatOrderHeaderId(order.id)}</Text>
        </View>
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.statusCardLabel}>CURRENT STATUS</Text>
        <Text style={styles.statusValue}>{order.status}</Text>
      </View>

      <View style={styles.etaCard}>
        <View>
          <Text style={styles.etaLabel}>ESTIMATED DELIVERY</Text>
          <Text style={styles.etaDate}>
            {formatEstimated(order.estimatedDelivery)}
          </Text>
        </View>
        <Text style={styles.boxEmoji}>📦</Text>
      </View>

      <Text style={styles.sectionTitle}>STATUS HISTORY</Text>

      {PIPELINE.map((status, index) => {
        const historyEntry = order.statusHistory.find(
          (h) => h.status === status
        );
        const stepIdx = statusRank(status);
        const isDone = stepIdx < currentIdx;
        const isCurrent = stepIdx === currentIdx;
        const isFuture = stepIdx > currentIdx;
        const isLast = index === PIPELINE.length - 1;

        return (
          <View key={status} style={styles.timelineRow}>
            <View style={styles.timelineGutter}>
              <View
                style={[
                  styles.timelineIcon,
                  isDone && styles.timelineIconDone,
                  isCurrent && styles.timelineIconCurrent,
                  isFuture && styles.timelineIconFuture,
                ]}
              >
                {isDone && <Text style={styles.check}>✓</Text>}
                {isCurrent && <Text style={styles.arrow}>→</Text>}
              </View>
              {!isLast && (
                <View
                  style={[
                    styles.timelineLine,
                    statusRank(PIPELINE[index + 1]) > currentIdx
                      ? styles.timelineLineMuted
                      : null,
                  ]}
                />
              )}
            </View>
            <View style={styles.timelineBody}>
              <Text
                style={[styles.timelineTitle, isFuture && styles.timelineMuted]}
              >
                {LABELS[status]}
              </Text>
              {historyEntry && (
                <Text
                  style={[
                    styles.timelineTime,
                    isFuture && styles.timelineMuted,
                  ]}
                >
                  {formatHistoryTime(historyEntry.timestamp)}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: BG,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 8,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: BG,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#555",
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  errorBody: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  retryBtn: {
    backgroundColor: CARD_DARK,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
  },
  retryLabel: {
    color: "#fff",
    fontWeight: "600",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    gap: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  backBtnPressed: {
    opacity: 0.85,
  },
  backIcon: {
    fontSize: 22,
    color: CARD_DARK,
  },
  headerTextWrap: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: CARD_DARK,
  },
  subId: {
    marginTop: 4,
    fontSize: 14,
    color: "#888",
  },
  statusCard: {
    backgroundColor: CARD_DARK,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  statusCardLabel: {
    color: "#999",
    fontSize: 11,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  statusValue: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
  },
  etaCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  etaLabel: {
    color: "#999",
    fontSize: 11,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  etaDate: {
    fontSize: 20,
    fontWeight: "700",
    color: CARD_DARK,
  },
  boxEmoji: {
    fontSize: 40,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.6,
    color: "#888",
    marginBottom: 16,
  },
  timelineRow: {
    flexDirection: "row",
    minHeight: 72,
  },
  timelineGutter: {
    width: 36,
    alignItems: "center",
  },
  timelineIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  timelineIconDone: {
    backgroundColor: CARD_DARK,
  },
  timelineIconCurrent: {
    backgroundColor: ACCENT,
  },
  timelineIconFuture: {
    backgroundColor: "#e8e8e8",
    borderWidth: 2,
    borderColor: "#ddd",
  },
  check: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  arrow: {
    color: CARD_DARK,
    fontSize: 14,
    fontWeight: "700",
  },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 32,
    backgroundColor: CARD_DARK,
    marginTop: -2,
  },
  timelineLineMuted: {
    backgroundColor: "#d4d4d4",
  },
  timelineBody: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 16,
  },
  timelineTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: CARD_DARK,
  },
  timelineTime: {
    marginTop: 4,
    fontSize: 13,
    color: "#888",
  },
  timelineMuted: {
    opacity: 0.45,
  },
});
