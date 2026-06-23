import { useVirtualizer } from "@tanstack/react-virtual";
import { RefObject } from "react";

interface UseVirtualListParams<T> {
  items: T[];
  parentRef: RefObject<HTMLDivElement>;
  itemHeight: number;
}

export function useVirtualList<T>({
  items,
  parentRef,
  itemHeight,
}: UseVirtualListParams<T>) {
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    overscan: 5,
  });

  return virtualizer;
}
