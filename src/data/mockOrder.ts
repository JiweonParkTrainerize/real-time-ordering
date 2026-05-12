import type { Order } from "../type/order";

/** Stub “API” payload — swap for `fetch` in a real app. */
export function getMockOrder(orderId: string): Order {
  return {
    id: orderId,
    userId: "user-42",
    status: "In Transit",
    estimatedDelivery: "2026-05-14T18:00:00.000Z",
    statusHistory: [
      {
        status: "Pending",
        timestamp: "2026-05-11T09:12:00.000Z",
      },
      {
        status: "Processing",
        timestamp: "2026-05-11T11:30:00.000Z",
      },
      {
        status: "Shipped",
        timestamp: "2026-05-11T14:00:00.000Z",
      },
      {
        status: "In Transit",
        timestamp: "2026-05-12T08:45:00.000Z",
      },
    ],
  };
}
