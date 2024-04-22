import { View, Text, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';
import { Redirect } from 'expo-router';
import { useReviews } from '@/context/ReviewContext';
import EditReviewModal from '@/friends/EditReviewModal';
import { deleteReview, updateReview } from '@/services/services';
import DeleteReviewModal from '../(modals)/DeleteReviewModal';

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
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentReviewToDelete, setCurrentReviewToDelete] =
    useState<Review | null>(null);

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
  const handleDeleteConfirm = async (currentReviewToDelete: Review) => {
    if (!currentReview || !session?.access_token) {
      console.error('Missing review ID or session token');
      return;
    }

    try {
      await deleteReview(currentReview.reviewId, session.access_token);
      console.log('Review deleted successfully');
      fetchUserReviews(); // Refresh the reviews list
      setDeleteModalVisible(false);
      setCurrentReview(null); // Clear current review
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  const handleEditReview = (review: Review) => {
    console.log('Review selected for edit:', review); // Debug log
    setCurrentReview(review);
    setModalVisible(true);
  };

  const handleDeleteReview = (review: Review) => {
    setCurrentReview(review);
    setDeleteModalVisible(true);
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
            <Text>Brewery: {review.breweryName}</Text>
            <Text>Rating: {review.rating}</Text>
            <Text>Comment: {review.comment}</Text>
            <Text>
              Posted: {new Date(review.createdAt).toLocaleDateString()}
            </Text>
            <Button
              title='Edit'
              onPress={() => handleEditReview(review)}
            />
            <Button
              title='Delete'
              onPress={() => {
                handleDeleteReview(review); // Set the review to be potentially deleted
                setDeleteModalVisible(true); // Show the delete confirmation modal
              }}
              color='red'
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
      <DeleteReviewModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirmDelete={() => {
          if (currentReviewToDelete) {
            handleDeleteConfirm(currentReviewToDelete); // Pass the review to be deleted to the confirmation function
          } else {
            console.error('currentReviewToDelete is null');
          }
        }}
      />
    </View>
  );
};

export default ReviewsPage;
