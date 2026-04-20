export interface FilterField {
  id: number;
  name: string;
  colspan?: { xs: number; sm: number; md: number; lg: number };
  layout?: "vertical" | "horizontal";
  label?: string;
  placeholder?: string;
  value?: any;
  type?: "search" | "select" | "range";
  options?: { label: string; value: any }[];
  default: any;
}

export interface FilterBarProps {
  schema: FilterField[];
  onChange: (filters: Record<string, any>) => void;
}
