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
  id: string;
  rating: number;
  comment: string;
  userName: string;
  breweryName: string;
  createdAt: Date;
  breweryId: string;
}

interface ReviewsByBrewery {
  [key: string]: Review[];
}

interface ReviewContextType {
  generalReviews: Review[];
  userReviews: Review[];
  breweryReviews: ReviewsByBrewery;
  loading: boolean;
  error: string;
  fetchGeneralReviews: () => Promise<void>;
  fetchUserReviews: () => Promise<void>;
  fetchBreweryReviews: (breweryId: string) => Promise<void>;
  addReview: (review: Review) => void;
  updateUserReview: (
    reviewId: string,
    updateData: Partial<Review>,
  ) => Promise<void>;
  deleteUserReview: (reviewId: string) => Promise<void>;
}

const BASE_URL = 'http://localhost:8080/api/reviews';

const ReviewContext = createContext<ReviewContextType>({
  generalReviews: [],
  userReviews: [],
  breweryReviews: {},
  loading: false,
  error: '',
  fetchGeneralReviews: async () => {},
  fetchUserReviews: async () => {},
  fetchBreweryReviews: async (_breweryId: string) => {},
  addReview: (_review: Review) => {},
  updateUserReview: async (
    _reviewId: string,
    _updateData: Partial<Review>,
  ) => {},
  deleteUserReview: async (_reviewId: string) => {},
});

export const ReviewProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { session } = useAuth();
  const [generalReviews, setGeneralReviews] = useState<Review[]>([]);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [breweryReviews, setBreweryReviews] = useState<ReviewsByBrewery>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all reviews
  const fetchGeneralReviews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllReviews();
      setGeneralReviews(data);
    } catch (err) {
      setError('Failed to fetch general reviews');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch reviews for a specific brewery
  const fetchBreweryReviews = useCallback(async (breweryId: string) => {
    setLoading(true);
    try {
      const reviews = await fetchReviewsForBrewery(breweryId);
      setBreweryReviews((prev) => ({ ...prev, [breweryId]: reviews }));
    } catch (error) {
      console.error('Error fetching brewery reviews:', error);
      setError('Failed to fetch brewery reviews');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch reviews specific to the logged-in user
  const fetchUserReviews = useCallback(async () => {
    if (session?.access_token) {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/user/reviews`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        });
        const data: Review[] = await response.json();
        setUserReviews(data);
      } catch (error) {
        setError('Failed to fetch user reviews');
      } finally {
        setLoading(false);
      }
    }
  }, [session?.access_token]);

  const addReview = useCallback((review: Review) => {
    setGeneralReviews((prev) => [...prev, review]);
    if (review.breweryId) {
      setBreweryReviews((prev) => ({
        ...prev,
        [review.breweryId]: [...(prev[review.breweryId] || []), review],
      }));
    }
  }, []);

  return (
    <ReviewContext.Provider
      value={{
        generalReviews,
        userReviews,
        breweryReviews,
        loading,
        error,
        fetchGeneralReviews,
        fetchUserReviews,
        fetchBreweryReviews,
        addReview,
        updateUserReview: async () => {},
        deleteUserReview: async () => {},
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (!context)
    throw new Error('useReviews must be used within a ReviewProvider');
  return context;
};
