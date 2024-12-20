
import { Item } from './item.model';

export interface Category {
  id: number;
  name: string;
  items: Item[];
  isExpanded: boolean;
  isSelected: boolean;
}