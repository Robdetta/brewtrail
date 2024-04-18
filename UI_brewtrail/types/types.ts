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
  id?: number;
  brewery_id: number;
  user_id: number;
  rating: number;
  comment: string;
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
