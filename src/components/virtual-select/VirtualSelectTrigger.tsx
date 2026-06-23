import { forwardRef, InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";

interface VirtualSelectTriggerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value"> {
  value?: string;
  selectedLabel?: string;
  isOpen: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  onBlur?: () => void;
}

export const VirtualSelectTrigger = forwardRef<
  HTMLInputElement,
  VirtualSelectTriggerProps
>(
  (
    {
      value,
      selectedLabel,
      isOpen,
      onChange,
      onClick,
      onBlur,
      placeholder,
      ...props
    },
    ref
  ) => {
    const displayValue = isOpen ? value : selectedLabel;

    return (
      <Input
        ref={ref}
        type="text"
        value={displayValue ?? ""}
        placeholder={placeholder}
        readOnly={!isOpen}
        onChange={onChange}
        onClick={onClick}
        onBlur={onBlur}
        {...props}
      />
    );
  }
);

VirtualSelectTrigger.displayName = "VirtualSelectTrigger";
