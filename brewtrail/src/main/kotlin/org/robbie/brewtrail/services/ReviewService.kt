package org.robbie.brewtrail.services

import jakarta.persistence.EntityNotFoundException
import org.robbie.brewtrail.entity.DetailedReview
import org.robbie.brewtrail.entity.Review
import org.robbie.brewtrail.repository.BreweryRepository
import org.robbie.brewtrail.repository.DetailedReviewRepository
import org.robbie.brewtrail.repository.ReviewRepository
import org.robbie.brewtrail.repository.UserRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant


@Service
class ReviewService(
    private val reviewRepository: ReviewRepository,
    private val userRepository: UserRepository, // Repository to access User entities
    private val breweryRepository: BreweryRepository, // Repository to access Brewery entities
    private val breweryService: BreweryService,
    private val detailedReviewRepository: DetailedReviewRepository

) {
    companion object {
        private val logger = LoggerFactory.getLogger(ReviewService::class.java)
    }

    @Transactional
    fun createReview(userId: Long, openBreweryDbId: String, rating: Double, comment: String?): Review {
        val user = userRepository.findById(userId).orElseThrow { EntityNotFoundException("User not found") }
        val brewery = breweryRepository.findByOpenBreweryDbId(openBreweryDbId)
            ?: breweryService.fetchBreweryByOpenBreweryDbId(openBreweryDbId)
            ?: throw EntityNotFoundException("Brewery not found with openBreweryDbId: $openBreweryDbId")

        // Check if a review by this user for this brewery already exists
        reviewRepository.findByUserAndBrewery(user, brewery)?.let {
            throw IllegalStateException("Review already exists for this brewery by the user")
        }

        val newReview = Review(user = user, brewery = brewery, rating = rating, comment = comment, createdAt = Instant.now(), updatedAt = Instant.now())
        return reviewRepository.save(newReview)
    }

    @Transactional
    fun updateReview(reviewId: Long, userId: Long, rating: Double, comment: String?): Review {
        val review = reviewRepository.findByIdAndUserId(reviewId, userId).orElseThrow {
            EntityNotFoundException("Review not found or does not belong to the user")
        }

        review.rating = rating
        review.comment = comment
        review.updatedAt = Instant.now()
        return reviewRepository.save(review)
    }

    @Transactional
    fun deleteReview(reviewId: Long, userId: Long) {
        val review = reviewRepository.findById(reviewId).orElseThrow { EntityNotFoundException("Review not found") }
        reviewRepository.delete(review)
    }

    fun getAllDetailedReviews(): List<DetailedReview> = detailedReviewRepository.findAll()

    fun getDetailedReviewsByUserId(userId: Long): List<DetailedReview> =
        detailedReviewRepository.findByUserId(userId)

    fun getDetailedReviewsByBreweryId(openBreweryDbId: String): List<DetailedReview> {
        return detailedReviewRepository.findByOpenBreweryDbId(openBreweryDbId)
    }

}

