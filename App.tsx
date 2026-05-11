import React, { useEffect } from "react";
import { StyleSheet, SafeAreaView, Text } from "react-native";
import { Provider } from "react-redux";
import { store } from "./src/store/store";
import { useAppDispatch, useAppSelector } from "./src/store/hooks";
import { setTest } from "./src/store/orderSlice";

// Assume this hook exists — the candidate may implement or stub it
// function useOrderTracking(orderId: string): { order: Order | null; loading: boolean; error: Error | null }

/*
  TASK: Build the OrderTrackingScreen component.

  Focus on:
  1. Fetching and displaying the order status
     (stub useOrderTracking if needed, but show how you'd wire it up)
  2. A status timeline showing statusHistory[]
  3. Loading and error states

  Don't worry about pixel-perfect UI.
  Think out loud as you go.
*/

const App = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setTest("test"));
  }, []);
  const test = useAppSelector((state) => state.order.test);
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.h1}>Real Time Order Tracking Screen</Text>
      <Text style={styles.paragraph}>Start your project here {test}</Text>
    </SafeAreaView>
  );
};

/** Redux Provider wrapper — candidates use `useAppDispatch` / `useAppSelector` in child components. */
export default function AppWithStore() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
  paragraph: {
    margin: 8,
    fontSize: 16,
    textAlign: "center",
  },
  h1: {
    margin: 28,
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
  },
});
