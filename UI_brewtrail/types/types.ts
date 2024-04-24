export interface Brewery {
  id?: number;
  open_brewery_db_id: string;
  name: string;
  city: string;
  state: string;
  type?: string;
  website_url?: string;
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
