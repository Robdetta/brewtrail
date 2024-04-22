package org.robbie.brewtrail.services

import jakarta.persistence.EntityNotFoundException
import org.robbie.brewtrail.entity.DetailedReview
import org.robbie.brewtrail.entity.Review
import org.robbie.brewtrail.repository.BreweryRepository
import org.robbie.brewtrail.repository.DetailedReviewRepository
import org.robbie.brewtrail.repository.ReviewRepository
import org.robbie.brewtrail.repository.UserRepository
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

): GenericService<Review, Long> {

    override fun findById(id: Long): Review? = reviewRepository.findById(id).orElse(null)

    override fun save(entity: Review): Review = reviewRepository.save(entity)

    override fun deleteById(id: Long) {
        reviewRepository.deleteById(id)
        return Unit  // Explicitly returning Unit to match the interface signature
    }

    override fun findAll(): List<Review> = reviewRepository.findAll().toList()

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

        val newReview = Review(user = user, brewery = brewery, rating = rating, comment = comment)
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

    fun getUserReviews(userId: Long): List<Review> = reviewRepository.findByUserId(userId)}

