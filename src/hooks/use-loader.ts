import { useAppDispatch } from "@/lib/store";
import { startLoading, stopLoading } from "@/features/loading-slice";
import { useCallback } from "react";

export const useLoader = () => {
  const dispatch = useAppDispatch();

  const start = useCallback(
    (message?: string) => {
      dispatch(startLoading(message));
    },
    [dispatch]
  );

  const stop = useCallback(() => {
    dispatch(stopLoading());
  }, [dispatch]);

  return { start, stop };
};
