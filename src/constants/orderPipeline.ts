import type { OrderStatus } from "../type/order";
export const ORDER_PIPELINE: OrderStatus[] = [
  "Pending",
  "Processing",
  "Shipped",
  "In Transit",
  "Delivered",
];

export function statusRank(status: OrderStatus): number {
  return ORDER_PIPELINE.indexOf(status);
}
