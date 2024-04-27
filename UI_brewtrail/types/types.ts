export interface Brewery {
  id?: number;
  open_brewery_db_id: string;
  name: string;
  city: string;
  stateProvince: string;
  breweryType?: string;
  websiteUrl: string;
  phone?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  address4?: string;
  address5?: string;
  postalCode?: string;
  country?: string;
  longitude?: string;
  latitude?: string;
}

export interface Review {
  reviewId: number;
  rating: number;
  comment: string;
  userName: string;
  breweryName: string;
  createdAt: Date;
  breweryId: string;
  openBreweryDbId: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error?: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  profilePicture?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export enum FriendshipStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export interface Friendship {
  [x: string]: any;
  id: number;
  requester: User;
  addressee: User;
  status: FriendshipStatus;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface SignInResult {
  success: boolean;
  session?: any; // Replace 'any' with your session type
  error?: string;
}
