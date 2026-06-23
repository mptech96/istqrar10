import { ReactNode } from "react";
import { PaginatedResponse } from "@/types/paginated-response";

export interface SelectOption<T = unknown> {
  value: string;
  label: string;
  item: T;
}

export type VirtualSelectQueryArgs = {
  searchQuery?: string;
  per_page?: number;
};

export type VirtualSelectQueryResult<T> = {
  data?: {
    pages: PaginatedResponse<T>[];
  };
  isLoading?: boolean;
  isFetching?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  fetchNextPage: () => unknown;
};

export type UseVirtualSelectInfiniteQuery<
  T,
  TQueryArgs extends Record<string, unknown> = Record<string, never>,
> = (
  args: TQueryArgs & VirtualSelectQueryArgs,
  options?: { skip?: boolean },
) => VirtualSelectQueryResult<T>;

export interface VirtualSelectProps<
  T = unknown,
  TQueryArgs extends Record<string, unknown> = Record<string, never>,
> {
  useQuery: UseVirtualSelectInfiniteQuery<T, TQueryArgs>;
  queryArgs?: TQueryArgs;
  getOptionValue: (item: T) => string;
  getOptionLabel: (item: T) => string;
  value?: string;
  defaultValue?: string;
  selectedLabel?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  itemHeight?: number;
  maxVisible?: number;
  pageSize?: number;
  renderOption?: (item: T, isSelected: boolean) => ReactNode;
}
