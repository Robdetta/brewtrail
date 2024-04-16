export interface Review {
  id: string;
  breweryId: string;
  userId: string;
  rating: number;
  comment: string;
}

export interface ReviewContextType {
  reviews: Review[];
  fetchReviews: () => Promise<void>;
  addReview: (rating: number, comment: string) => Promise<void>;
}
