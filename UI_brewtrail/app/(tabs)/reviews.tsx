import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';
import { Redirect } from 'expo-router';
import { useReviews } from '@/context/ReviewContext';
import EditReviewModal from '@/friends/EditReviewModal';
import { deleteReview, updateReview } from '@/services/services';
import DeleteReviewModal from '../(modals)/DeleteReviewModal';
import { Review } from '@/types/types';
import ReviewsList from '@/listing/ReviewList';

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
    if (!currentReviewToDelete || !session?.access_token) {
      console.error('Missing review ID or session token');
      return;
    }

    try {
      await deleteReview(currentReviewToDelete.reviewId, session.access_token);
      console.log('Review deleted successfully');
      fetchUserReviews(); // Refresh the reviews list
      setDeleteModalVisible(false);
      setCurrentReview(null); // Clear current review
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  const sortedUserReviews = userReviews.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Reviews</Text>
      <ReviewsList
        reviews={sortedUserReviews}
        showUserName={false}
        onEdit={(review) => {
          setCurrentReview(review);
          setModalVisible(true);
        }}
        onDelete={(review) => {
          setCurrentReviewToDelete(review);
          setDeleteModalVisible(true);
        }}
      />
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
        onConfirmDelete={() =>
          currentReviewToDelete && handleDeleteConfirm(currentReviewToDelete)
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default ReviewsPage;
