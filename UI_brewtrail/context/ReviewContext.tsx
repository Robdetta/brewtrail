import { fetchAllReviews, fetchReviewsForBrewery } from '@/services/services';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { useAuth } from '@/context/auth';

interface Review {
  rating: number;
  comment: string;
  breweryId: string;
}

interface ReviewsByBrewery {
  [key: string]: Review[];
}

interface ReviewContextType {
  reviews: Review[];
  loading: boolean;
  error: string;
  reviewsByBrewery: ReviewsByBrewery;
  fetchGeneralReviews: () => Promise<void>;
  fetchBreweryReviews: (breweryId: string) => Promise<void>;
  addReview: (review: Review) => void;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (!context)
    throw new Error('useReviews must be used within a ReviewProvider');
  return context;
};

export const ReviewProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsByBrewery, setReviewsByBrewery] = useState<ReviewsByBrewery>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchGeneralReviews = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAllReviews();
      setReviews(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch reviews');
      setLoading(false);
    }
  }, []);

  const fetchBreweryReviews = useCallback(async (breweryId: string) => {
    try {
      setLoading(true);
      const data = await fetchReviewsForBrewery(breweryId);
      setReviewsByBrewery((prev) => ({ ...prev, [breweryId]: data }));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to fetch brewery reviews');
      setLoading(false);
    }
  }, []);

  const addReview = useCallback((review: Review) => {
    setReviewsByBrewery((prev) => ({
      ...prev,
      [review.breweryId]: [...(prev[review.breweryId] || []), review],
    }));
    setReviews((prev) => [...prev, review]);
  }, []);

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        loading,
        error,
        reviewsByBrewery,
        fetchGeneralReviews,
        fetchBreweryReviews,
        addReview,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};
