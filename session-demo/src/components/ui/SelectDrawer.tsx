import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import type { DrawerItem } from "../../utils/jdiCountry";

/**
 * SelectDrawer component
 *
 * A mobile-friendly select component that opens a bottom drawer with searchable options.
 * Features a title, searchable item list, and customizable error messaging.
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Label text displayed above the select control
 * @param {DrawerItem[]} props.items - Array of selectable options with id and label
 * @param {DrawerItem|null} props.selectedItem - Currently selected item or null if none selected
 * @param {(item: DrawerItem|null) => void} props.onChange - Callback function triggered when selection changes
 * @param {string} [props.className=""] - Optional additional CSS classes to apply
 * @param {string} [props.errorMessage=""] - Custom error message shown when no results match search
 * @returns {JSX.Element} A select component that opens a searchable drawer when clicked
 */
type Props = {
  title: string;
  items: DrawerItem[];
  selectedItem: DrawerItem | null;
  onChange: (item: DrawerItem | null) => void;
  className?: string;
  errorMessage?: string;
};

export const SelectDrawer: React.FC<Props> = ({
  title,
  items,
  selectedItem,
  onChange,
  className = "",
  errorMessage = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <div
        className={`flex flex-col py-6 space-y-2 w-full max-w-[322px] mx-auto ${className}`}
      >
        <h2 className="text-xl font-bold text-left text-[#3C3C40]">{title}</h2>

        <button
          onClick={() => setIsOpen(true)}
          className="border rounded-lg px-4 py-3 text-left w-full flex items-center justify-between"
          style={{ borderColor: "rgba(60, 60, 64, 0.3)" }}
        >
          <div className="flex items-center gap-2">
            <span>{selectedItem?.label || "Sélectionner un pays"}</span>
          </div>
          <ChevronDownIcon className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div
          className="fixed inset-0 bg-[#00000084] bg-opacity-50"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex items-end">
          <Dialog.Panel className="w-full bg-white h-[75%] rounded-t-2xl p-4 overflow-y-auto">
            {/* Search bar */}
            <div
              className="flex items-center h-[60px] border rounded-lg mb-4 px-3 py-2"
              style={{ borderColor: "rgba(60, 60, 64, 0.3)" }}
            >
              <input
                type="text"
                className="flex-grow outline-none placeholder-gray-500 text-md"
                placeholder={title}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div
                className="border-l h-5 mx-2"
                style={{ borderColor: "rgba(60, 60, 64, 0.3)" }}
              />
              <SearchIcon className="w-4 h-4 text-gray-400" />
            </div>

            {/* List */}
            <ul className="space-y-2">
              {filteredItems.map((item) => {
                return (
                  <li key={item.id}>
                    <button
                      className="w-full text-left px-4 py-2 rounded hover:bg-gray-100 flex items-center gap-2"
                      onClick={() => {
                        onChange(item);
                        setIsOpen(false);
                        setQuery("");
                      }}
                    >
                      <span>{item.label}</span>
                    </button>
                    <div
                      className="border-b border-gray-200"
                      style={{ borderColor: "rgba(60, 60, 64, 0.3)" }}
                    />
                  </li>
                );
              })}
              {filteredItems.length === 0 && (
                <li className="text-center text-gray-400 text-sm py-2">
                  {errorMessage || "Aucun résultat trouvé"}
                </li>
              )}
            </ul>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};
