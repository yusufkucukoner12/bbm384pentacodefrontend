import { Menu } from './Menu';

export interface Restaurant {
  pk: number;
  name: string;
  version: string | null;
  imageUrl: string;
  address: string;
  phoneNumber: string;
  description: string;
  email: string;
  foodType: string;
  openingHours: string;
  closingHours: string;
  deliveryTime: string;
  deliveryFee: string;
  minOrderAmount: string;
  maxOrderAmount: string;

  // Related entities
  menus: Menu[];

  // Relation to parent restaurant (if exists)
  restaurant?: Restaurant;
}
