export type SelectItem = {
  id: string;
  label: string;
};

export interface SelectProps {
  items: SelectItem[];
  title: string;
  selectedItem: SelectItem;
  onChange: (item: SelectItem) => void;
}
