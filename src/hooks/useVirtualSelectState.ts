import { useState, useCallback, useEffect } from "react";

interface UseVirtualSelectStateReturn {
  open: boolean;
  setOpen: (open: boolean) => void;
  search: string;
  setSearch: (search: string) => void;
  debouncedSearch: string;
  reset: () => void;
}

export function useVirtualSelectState(
  initialSearch = ""
): UseVirtualSelectStateReturn {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);

  useEffect(() => {
    if (!open) {
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, open]);

  const reset = useCallback(() => {
    setSearch(initialSearch);
    setDebouncedSearch(initialSearch);
    setOpen(false);
  }, [initialSearch]);

  return {
    open,
    setOpen,
    search,
    setSearch,
    debouncedSearch,
    reset,
  };
}
