import { forwardRef, RefObject } from "react";
import { Command, CommandInput } from "@/components/ui/command";
import { Loader2 } from "lucide-react";
import { SelectOption } from "./types";
import { VirtualSelectItem } from "./VirtualSelectItem";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ReactNode } from "react";

interface VirtualSelectContentProps<T = unknown> {
  options: SelectOption<T>[];
  selectedValue?: string;
  onSelect: (option: SelectOption<T>) => void;
  search: string;
  onSearchChange: (value: string) => void;
  itemHeight: number;
  maxVisible: number;
  isLoading: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  renderOption?: (item: T, isSelected: boolean) => ReactNode;
  scrollContainerRef: RefObject<HTMLDivElement>;
  virtualizer: ReturnType<typeof useVirtualizer>;
}


export const VirtualSelectContent = forwardRef<
  HTMLDivElement,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  VirtualSelectContentProps<any>
>(
  (
    {
      options,
      selectedValue,
      onSelect,
      search,
      onSearchChange,
      itemHeight,
      maxVisible,
      isLoading,
      isFetching,
      isFetchingNextPage,
      hasNextPage,
      searchPlaceholder = "Search...",
      emptyMessage = "No results found.",
      renderOption,
      scrollContainerRef,
      virtualizer,
    },
    ref
  ) => {
    const maxHeight = maxVisible * itemHeight;
    const virtualItems = virtualizer.getVirtualItems();
    const totalSize = virtualizer.getTotalSize();
    const showInitialLoading =
      isLoading || (isFetching && options.length === 0);

    const paddingTop = virtualItems.length > 0 ? virtualItems?.[0]?.start ?? 0 : 0;

    return (
      <div ref={ref} className="w-full">
        <Command shouldFilter={false}>
         {/*  <CommandInput
            placeholder={searchPlaceholder}
            value={search}
            onValueChange={onSearchChange}
          /> */}

          <div
            ref={scrollContainerRef}
            style={{
              height: maxHeight,
              overflow: "auto",
            }}
            className="relative"
          >
            {showInitialLoading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}

            {!showInitialLoading && options.length === 0 && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </div>
            )}

            {!showInitialLoading && options.length > 0 && (
              <div
                style={{
                  height: totalSize,
                  width: "100%",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    transform: `translateY(${paddingTop}px)`,
                  }}
                >
                  {virtualItems.map((virtualItem) => {
                    const option = options[virtualItem.index];
                    const isLoaderRow = virtualItem.index >= options.length;

                    if (isLoaderRow) {
                      return (
                        <div
                          key={virtualItem.key}
                          data-index={virtualItem.index}
                          style={{
                            height: itemHeight,
                          }}
                          className="flex items-center justify-center text-sm text-muted-foreground"
                        >
                          {isFetchingNextPage || hasNextPage ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : null}
                        </div>
                      );
                    }

                    if (!option) return null;

                    return (
                      <div
                        key={virtualItem.key}
                        data-index={virtualItem.index}
                        style={{
                          height: itemHeight,
                        }}
                      >
                        <VirtualSelectItem
                          option={option}
                          isSelected={option.value === selectedValue}
                          onSelect={onSelect}
                          renderOption={renderOption}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </Command>
      </div>
    );
  }
);

VirtualSelectContent.displayName = "VirtualSelectContent";
