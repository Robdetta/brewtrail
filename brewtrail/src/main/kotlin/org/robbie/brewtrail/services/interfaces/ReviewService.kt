package org.robbie.brewtrail.services.interfaces

import org.robbie.brewtrail.entity.DetailedReview
import org.robbie.brewtrail.entity.Review


interface ReviewService : GenericService<Review, Long> {
    fun createReview(userId: Long, openBreweryDbId: String, rating: Double, comment: String?): Review
    fun updateReview(reviewId: Long, userId: Long, rating: Double, comment: String?): Review
    fun deleteReview(reviewId: Long, userId: Long)
    fun getAllDetailedReviews(): List<DetailedReview>
    fun getDetailedReviewsByUserId(userId: Long): List<DetailedReview>
    fun getDetailedReviewsByBreweryId(openBreweryDbId: String): List<DetailedReview>
    fun getUserReviews(userId: Long): List<Review>
}