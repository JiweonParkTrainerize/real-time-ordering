export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "In Transit"
  | "Delivered";

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  statusHistory: { status: OrderStatus; timestamp: string }[];
  estimatedDelivery: string;
}
