import { CommandItem } from "@/components/ui/command";
import { Check } from "lucide-react";
import { SelectOption } from "./types";
import { ReactNode } from "react";

interface VirtualSelectItemProps<T = unknown> {
  option: SelectOption<T>;
  isSelected: boolean;
  onSelect: (option: SelectOption<T>) => void;
  renderOption?: (item: T, isSelected: boolean) => ReactNode;
}

export function VirtualSelectItem<T = unknown>({
  option,
  isSelected,
  onSelect,
  renderOption,
}: VirtualSelectItemProps<T>) {
  return (
    <CommandItem
      value={option.value}
      onSelect={() => onSelect(option)}
      className="cursor-pointer"
    >
      {renderOption ? (
        renderOption(option.item, isSelected)
      ) : (
        <>
          <Check
            className={`mr-2 h-4 w-4 ${isSelected ? "opacity-100" : "opacity-0"}`}
          />
          <span>{option.label}</span>
        </>
      )}
    </CommandItem>
  );
}
