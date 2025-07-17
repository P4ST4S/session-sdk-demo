import React, { useState, useRef, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import type { DrawerItem } from "../../utils/jdiCountry";
import useIsMobile from "../../hooks/useIsMobile";

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
  const isMobile = useIsMobile();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  // Close dropdown when clicking outside (desktop only)
  useEffect(() => {
    if (!isMobile && isOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setQuery("");
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, isMobile]);

  const handleItemSelect = (item: DrawerItem) => {
    onChange(item);
    setIsOpen(false);
    setQuery("");
  };

  // Mobile version (drawer)
  if (isMobile) {
    return (
      <>
        <div className={`flex flex-col space-y-2 w-full ${className}`}>
          <label className="block text-sm md:text-base font-semibold text-gray-900">
            {title}
          </label>

          <button
            onClick={() => setIsOpen(true)}
            className="w-full px-3 py-3 border rounded-lg text-base transition-colors
              focus:outline-none focus:ring-2 focus:ring-[#11E5C5] focus:border-transparent
              border-gray-300 hover:border-gray-400 text-left flex items-center justify-between"
          >
            <span className={selectedItem ? "text-gray-900" : "text-gray-500"}>
              {selectedItem?.label || `Sélectionner ${title.toLowerCase()}`}
            </span>
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <Dialog
          open={isOpen}
          onClose={() => {
            setIsOpen(false);
            setQuery("");
          }}
          className="relative z-50"
        >
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            aria-hidden="true"
          />
          <div className="fixed inset-0 flex items-end">
            <Dialog.Panel className="w-full bg-white h-[75%] rounded-t-2xl p-4 overflow-y-auto">
              {/* Search bar */}
              <div className="flex items-center h-[60px] border rounded-lg mb-4 px-3 py-2 border-gray-300">
                <input
                  type="text"
                  className="flex-grow outline-none placeholder-gray-500 text-base"
                  placeholder={`Rechercher ${title.toLowerCase()}`}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className="border-l h-5 mx-2 border-gray-300" />
                <SearchIcon className="w-4 h-4 text-gray-400" />
              </div>

              {/* List */}
              <ul className="space-y-1">
                {filteredItems.map((item) => (
                  <li key={item.id}>
                    <button
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 
                        active:bg-gray-200 transition-colors text-base"
                      onClick={() => handleItemSelect(item)}
                    >
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
                {filteredItems.length === 0 && (
                  <li className="text-center text-gray-400 text-sm py-4">
                    {errorMessage || "Aucun résultat trouvé"}
                  </li>
                )}
              </ul>
            </Dialog.Panel>
          </div>
        </Dialog>
      </>
    );
  }

  // Desktop version (dropdown)
  return (
    <div
      className={`relative flex flex-col space-y-2 w-full ${className}`}
      ref={dropdownRef}
    >
      <label className="block text-sm md:text-base font-semibold text-gray-900">
        {title}
      </label>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-3 md:py-4 border rounded-lg text-base transition-colors
          focus:outline-none focus:ring-2 focus:ring-[#11E5C5] focus:border-transparent
          border-gray-300 hover:border-gray-400 text-left flex items-center justify-between"
      >
        <span className={selectedItem ? "text-gray-900" : "text-gray-500"}>
          {selectedItem?.label || `Sélectionner ${title.toLowerCase()}`}
        </span>
        <ChevronDownIcon
          className={`h-5 w-5 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 
          rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
        >
          {/* Search bar */}
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center border rounded-lg px-3 py-2 border-gray-300">
              <SearchIcon className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                className="flex-grow outline-none placeholder-gray-500 text-sm"
                placeholder={`Rechercher ${title.toLowerCase()}`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          {/* List */}
          <ul className="py-1">
            {filteredItems.map((item) => (
              <li key={item.id}>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 
                    active:bg-gray-200 transition-colors text-sm"
                  onClick={() => handleItemSelect(item)}
                >
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
            {filteredItems.length === 0 && (
              <li className="text-center text-gray-400 text-sm py-3">
                {errorMessage || "Aucun résultat trouvé"}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
