import { Menu } from './Menu';

export interface Restaurant {
    pk: number;
    name: string;
    version: string | null;
    menus: Menu[];
    imageUrl: string;
    description: string;
    address: string;
    phone: string;
  }
  