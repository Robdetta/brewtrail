import { View, Text, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';
import { Redirect } from 'expo-router';
import { useReviews } from '@/context/ReviewContext';
import EditReviewModal from '@/friends/EditReviewModal';
import { updateReview } from '@/services/services';

interface Review {
  openBreweryDbId: string;
  reviewId: string;
  rating: number;
  comment: string;
  userName: string;
  createdAt: string;
}

const ReviewsPage = () => {
  const { userReviews, loading, error, fetchUserReviews } = useReviews();
  const { session } = useAuth();
  const [currentReview, setCurrentReview] = useState<Review | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (session?.access_token) {
      fetchUserReviews();
    }
  }, [fetchUserReviews, session?.access_token]);

  if (!session) {
    // Redirect to the login screen if the user is not authenticated
    return <Redirect href='/(modals)/login' />;
  }

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  const handleSaveChanges = async (rating: number, comment: string) => {
    if (!currentReview || !session?.access_token) {
      console.error('Missing review ID or session token');
      return;
    }

    // Construct the update data according to the backend's ReviewDto structure
    const updatedData = {
      rating: Number(rating), // Ensure rating is a number
      comment: comment,
      openBreweryDbId: currentReview.openBreweryDbId, // Ensure this field is included in currentReview
    };

    console.log(
      'Attempting to save review:',
      currentReview.reviewId,
      updatedData,
    ); // Log the data being sent

    try {
      const result = await updateReview(
        currentReview.reviewId,
        session.access_token,
        updatedData,
      );

      if (result) {
        console.log('Review updated successfully:', result); // Log the successful update
        fetchUserReviews(); // Refresh the reviews list
        setModalVisible(false);
        setCurrentReview(null);
      }
    } catch (error) {
      console.error('Failed to update review:', error);
    }
  };

  const handleEditReview = (review: Review) => {
    console.log('Review selected for edit:', review); // Debug log
    setCurrentReview(review);
    setModalVisible(true);
  };

  return (
    <View>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Your Reviews</Text>
      {userReviews.length > 0 ? (
        userReviews.map((review, index) => (
          <View
            key={index}
            style={{ padding: 10 }}
          >
            <Text>Rating: {review.rating}</Text>
            <Text>Comment: {review.comment}</Text>
            <Text>
              Posted: {new Date(review.createdAt).toLocaleDateString()}
            </Text>
            <Button
              title='Edit'
              onPress={() => handleEditReview(review)}
            />
          </View>
        ))
      ) : (
        <Text>No reviews found.</Text>
      )}
      {currentReview && (
        <EditReviewModal
          review={currentReview}
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleSaveChanges}
        />
      )}
    </View>
  );
};

export default ReviewsPage;
