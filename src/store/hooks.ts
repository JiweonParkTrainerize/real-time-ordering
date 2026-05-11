import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";

/** Use throughout the app instead of plain `useDispatch`. */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

/** Use throughout the app instead of plain `useSelector`. */
export const useAppSelector = useSelector.withTypes<RootState>();
