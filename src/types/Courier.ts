export interface CourierDTO {
    pk: number;
    name: string;
    phoneNumber: string;
    isAvailable: boolean;
    isOnline: boolean; 
    profilePictureUrl?: string;
  }