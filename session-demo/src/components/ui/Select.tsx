import type { SelectProps } from "../../types/ui/select";

import * as RadixSelect from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";

const Select = ({ items, title, selectedItem, onChange }: SelectProps) => {
  return (
    <div className="w-64">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        {title}
      </label>
      <RadixSelect.Root
        value={selectedItem.id}
        onValueChange={(value) => {
          const selected = items.find((item) => item.id === value);
          if (selected) onChange(selected);
        }}
      >
        <RadixSelect.Trigger className="inline-flex items-center justify-between w-full px-4 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#11E5C5]">
          <RadixSelect.Value placeholder="Select an option" />
          <RadixSelect.Icon className="ml-2">
            <ChevronDown className="w-4 h-4" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content className="z-50 overflow-hidden bg-white border border-gray-200 rounded-md shadow-lg animate-fade-in">
            <RadixSelect.Viewport className="p-1">
              {items.map((item) => (
                <RadixSelect.Item
                  key={item.id}
                  value={item.id}
                  className={
                    "relative flex select-none items-center rounded-md px-3 py-2 text-sm text-gray-700 cursor-pointer focus:bg-[#41f6db25] radix-disabled:opacity-50"
                  }
                >
                  <RadixSelect.ItemText>{item.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator className="absolute right-2">
                    <Check className="w-4 h-4 text-[#11E5C5]" />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </div>
  );
};

export default Select;
