import { useEffect } from "react";
import { fetchOrder } from "../store/orderSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

/**
 * Loads order data for `orderId` into Redux and exposes order, loading, and error.
 */
export function useOrderTracking(orderId: string) {
  const dispatch = useAppDispatch();
  const order = useAppSelector((s) => s.order.order);
  const loading = useAppSelector((s) => s.order.loading);
  const errorMessage = useAppSelector((s) => s.order.error);

  useEffect(() => {
    if (!orderId) return;
    dispatch(fetchOrder(orderId));
  }, [dispatch, orderId]);

  return {
    order,
    loading,
    error: errorMessage ? new Error(errorMessage) : null,
  };
}
