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
  fetchReviewsForUser: (userId: number) => Promise<void>;
  lastUpdated: number;
}

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL + '/reviews';
console.log('API Base URL:', process.env.EXPO_PUBLIC_BASE_URL);

const ReviewContext = createContext<ReviewContextType>({
  generalReviews: [],
  userReviews: [],
  breweryReviews: {},
  loading: false,
  error: '',
  lastUpdated: new Date(),
  fetchGeneralReviews: async () => {},
  fetchUserReviews: async () => {},
  fetchBreweryReviews: async (_breweryId: string) => {},
  addReview: (_review: Review) => {},
  updateUserReview: async (
    _reviewId: string,
    _updateData: Partial<Review>,
  ) => {},
  deleteUserReview: async (_reviewId: string) => {},
  fetchReviewsForUser: async (_userId: number) => {},
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
  const [reviews, setReviews] = useState({});
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

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

  const fetchReviewsForUser = useCallback(
    async (userId: number) => {
      if (session?.access_token) {
        const url = `${BASE_URL}/user/${userId}/reviews`;
        try {
          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${session.access_token}`, // Ensure you're using a valid token
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return await response.json();
        } catch (error) {
          console.error('Failed to fetch reviews:', error);
          throw error; // Re-throw to handle it in the component
        }
      }
    },
    [session?.access_token],
  );

  const addReview = useCallback((review: Review) => {
    console.log('Adding new review:', review);
    setGeneralReviews((prev) => [review, ...prev]); // Add new review at the start if sorting by newest first
    if (review.breweryId) {
      setBreweryReviews((prev) => ({
        ...prev,
        [review.breweryId]: [review, ...(prev[review.breweryId] || [])],
      }));
    }
    setLastUpdated(Date.now());
  }, []);

  const deleteUserReview = useCallback((reviewId: string) => {
    setGeneralReviews((prev) =>
      prev.filter((review) => review.id !== reviewId),
    );
    setUserReviews((prev) => prev.filter((review) => review.id !== reviewId));
    setBreweryReviews((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
        updated[key] = updated[key].filter((review) => review.id !== reviewId);
      });
      return updated;
    });
  }, []);

  return (
    <ReviewContext.Provider
      value={{
        generalReviews,
        userReviews,
        breweryReviews,
        loading,
        error,
        lastUpdated,
        fetchGeneralReviews,
        fetchReviewsForUser,
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
