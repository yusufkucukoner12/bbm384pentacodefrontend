import { Menu } from './Menu';



export interface Restaurant {
  pk: number;
  name: string;
  version:  string | null;
  menus: Menu[];
  imageUrl: string;
  address?: string;
  phoneNumber?: string;
  description?: string;
  email?: string;
}