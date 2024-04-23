package org.robbie.brewtrail.services.impl

import jakarta.persistence.EntityNotFoundException
import jakarta.transaction.Transactional
import org.robbie.brewtrail.entity.DetailedReview
import org.robbie.brewtrail.entity.Review
import org.robbie.brewtrail.repository.BreweryRepository
import org.robbie.brewtrail.repository.DetailedReviewRepository
import org.robbie.brewtrail.repository.ReviewRepository
import org.robbie.brewtrail.repository.UserRepository
import org.robbie.brewtrail.services.interfaces.ReviewService
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class ReviewServiceImpl(
    private val reviewRepository: ReviewRepository,
    private val userRepository: UserRepository,
    private val breweryRepository: BreweryRepository,
    private val detailedReviewRepository: DetailedReviewRepository
) : ReviewService {

    override fun findById(id: Long): Review? = reviewRepository.findById(id).orElse(null)

    override fun save(entity: Review): Review = reviewRepository.save(entity)

    override fun deleteById(id: Long) {
        reviewRepository.deleteById(id)
    }

    override fun findAll(): List<Review> = reviewRepository.findAll().toList()

    @Transactional
    override fun createReview(userId: Long, openBreweryDbId: String, rating: Double, comment: String?): Review {
        val user = userRepository.findById(userId).orElseThrow { EntityNotFoundException("User not found") }
        val brewery = breweryRepository.findByOpenBreweryDbId(openBreweryDbId)
            ?: throw EntityNotFoundException("Brewery not found with openBreweryDbId: $openBreweryDbId")

        reviewRepository.findByUserAndBrewery(user, brewery)?.let {
            throw IllegalStateException("Review already exists for this brewery by the user")
        }

        val newReview = Review(user = user, brewery = brewery, rating = rating, comment = comment)
        return reviewRepository.save(newReview)
    }

    @Transactional
    override fun updateReview(reviewId: Long, userId: Long, rating: Double, comment: String?): Review {
        val review = reviewRepository.findByIdAndUserId(reviewId, userId).orElseThrow {
            EntityNotFoundException("Review not found or does not belong to the user")
        }

        review.rating = rating
        review.comment = comment
        review.updatedAt = Instant.now()
        return reviewRepository.save(review)
    }

    @Transactional
    override fun deleteReview(reviewId: Long, userId: Long) {
        val review = reviewRepository.findById(reviewId).orElseThrow { EntityNotFoundException("Review not found") }
        reviewRepository.delete(review)
    }

    override fun getAllDetailedReviews(): List<DetailedReview> = detailedReviewRepository.findAll()


    override fun getDetailedReviewsByUserId(userId: Long): List<DetailedReview> =
        detailedReviewRepository.findByUserId(userId)


    override fun getDetailedReviewsByBreweryId(openBreweryDbId: String): List<DetailedReview> =
        detailedReviewRepository.findByOpenBreweryDbId(openBreweryDbId)


    override fun getUserReviews(userId: Long): List<Review> = reviewRepository.findByUserId(userId)
}