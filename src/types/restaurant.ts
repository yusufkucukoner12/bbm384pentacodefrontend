import { Menu } from './menu';

export interface Restaurant {
    pk: number;
    name: string;
    version: string | null;
    menus: Menu[];
  }
  