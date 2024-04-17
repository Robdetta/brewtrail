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

        val review = Review(user = user, brewery = brewery, rating = rating, comment = comment, createdAt = Instant.now(), updatedAt = Instant.now())
        return reviewRepository.save(review)
    }

    @Transactional(readOnly = true)
    fun findReviewsByBrewery(openBreweryDbId: String): List<Review> {
        return reviewRepository.findByBrewery_OpenBreweryDbId(openBreweryDbId)
    }

    fun findReviewsByUserId(userId: Long): List<Review> {
        return reviewRepository.findByUserId(userId)
    }

    @Transactional(readOnly = true)
    fun findAllReviews(): List<Review> = reviewRepository.findAll().toList()

    fun getAllDetailedReviews(): List<DetailedReview> = detailedReviewRepository.findAll()

    fun getDetailedReviewsByUserId(userId: Long): List<DetailedReview> =
        detailedReviewRepository.findByUserId(userId)

    fun getDetailedReviewsByBreweryId(breweryId: String): List<DetailedReview> =
        detailedReviewRepository.findByBreweryId(breweryId)
}

