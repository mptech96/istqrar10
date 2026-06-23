import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  RefObject,
} from "react";
import { Popover, PopoverContent, PopoverAnchor } from "@/components/ui/popover";
import { useVirtualizer } from "@tanstack/react-virtual";
import { VirtualSelectTrigger } from "./VirtualSelectTrigger";
import { VirtualSelectContent } from "./VirtualSelectContent";
import { useVirtualSelectState } from "../../hooks/useVirtualSelectState";
import { useVirtualList } from "../../hooks/useVirtualList";

import { VirtualSelectProps, SelectOption } from "./types";

export function VirtualSelect<
  T = unknown,
  TQueryArgs extends Record<string, unknown> = Record<string, never>,
>({
  useQuery,
  queryArgs,
  getOptionValue,
  getOptionLabel,
  value,
  defaultValue,
  selectedLabel: selectedLabelProp,
  onChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  disabled = false,
  itemHeight = 36,
  maxVisible = 8,
  pageSize = 10,
  renderOption,
}: VirtualSelectProps<T, TQueryArgs>) {
  const triggerRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [triggerWidth, setTriggerWidth] = useState<number | undefined>();

  const {
    open,
    setOpen,
    search,
    setSearch,
    debouncedSearch,
  } = useVirtualSelectState("");

  const currentValue = value ?? defaultValue ?? "";

  const {
    data,
    isLoading = false,
    isFetching = false,
    isFetchingNextPage = false,
    hasNextPage = false,
    fetchNextPage,
  } = useQuery(
    {
      ...(queryArgs ?? ({} as TQueryArgs)),
      searchQuery: debouncedSearch,
      per_page: pageSize,
    },
    { skip: disabled }
  );

  const options = useMemo<SelectOption<T>[]>(() => {
    const items = data?.pages.flatMap((page) => page.data) ?? [];

    return items.map((item) => ({
      value: getOptionValue(item),
      label: getOptionLabel(item),
      item,
    }));
  }, [data, getOptionLabel, getOptionValue]);

  const selectedLabel = useMemo(() => {
    if (!currentValue) return "";
    const selected = options.find((opt) => opt.value === currentValue);
    return selected?.label ?? selectedLabelProp ?? "";
  }, [currentValue, options, selectedLabelProp]);

  // Update trigger width on open
  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setTriggerWidth(rect.width);
    }
  }, [open]);

  const virtualRows = useMemo(
    () => (hasNextPage ? [...options, null] : options),
    [hasNextPage, options]
  );

  const virtualizer = useVirtualList({
    items: virtualRows,
    parentRef: scrollContainerRef as RefObject<HTMLDivElement>,
    itemHeight,
  });
  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    if (!open) return;

    const frame = requestAnimationFrame(() => {
      virtualizer.measure();
    });

    return () => cancelAnimationFrame(frame);
  }, [hasNextPage, itemHeight, open, options.length, virtualizer]);

  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];

    if (
      !lastItem ||
      lastItem.index < options.length ||
      !hasNextPage ||
      isFetchingNextPage ||
      isFetching
    ) {
      return;
    }

    fetchNextPage();
  }, [
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    options.length,
    virtualItems,
  ]);

  const handleSelect = useCallback(
    (option: SelectOption<T>) => {
      onChange?.(option.value);
      setSearch("");
      setOpen(false);
    },
    [onChange, setOpen, setSearch]
  );

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      setOpen(newOpen);
      if (!newOpen) {
        setSearch("");
        virtualizer.measure();
      }
    },
    [setOpen, setSearch, virtualizer]
  );

  const handleTriggerClick = useCallback(() => {
    if (!disabled) {
      handleOpenChange(!open);
    }
  }, [disabled, open, handleOpenChange]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value);
    },
    [setSearch]
  );

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverAnchor asChild>
        <VirtualSelectTrigger
          ref={triggerRef}
          value={search}
          selectedLabel={selectedLabel}
          isOpen={open}
          onChange={(e) => setSearch(e.target.value)}
          onClick={handleTriggerClick}
          placeholder={placeholder}
          disabled={disabled}
        />
      </PopoverAnchor>

      <PopoverContent
        align="start"
        style={{
          width: triggerWidth,
          padding: 0,
        }}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <VirtualSelectContent
          options={options}
          selectedValue={currentValue}
          onSelect={handleSelect}
          search={search}
          onSearchChange={handleSearchChange}
          itemHeight={itemHeight}
          maxVisible={maxVisible}
          isLoading={isLoading}
          isFetching={isFetching}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          searchPlaceholder={searchPlaceholder}
          emptyMessage={emptyMessage}
          renderOption={renderOption}
          scrollContainerRef={scrollContainerRef as RefObject<HTMLDivElement>}
          virtualizer={virtualizer as unknown as ReturnType<typeof useVirtualizer>}
        />
      </PopoverContent>
    </Popover>
  );
}
