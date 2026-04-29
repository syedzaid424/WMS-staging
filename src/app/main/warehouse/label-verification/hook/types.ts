export interface SelectOptionsApiData {
  name: string;
  data:
    | string[]
    | {
        id: number;
        label: string;
        value: string;
      }[];
}
