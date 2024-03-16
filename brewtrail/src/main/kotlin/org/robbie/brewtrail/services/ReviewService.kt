package org.robbie.brewtrail.services

import org.robbie.brewtrail.entity.Review
import org.robbie.brewtrail.repository.BreweryRepository
import org.robbie.brewtrail.repository.ReviewRepository
import org.robbie.brewtrail.repository.UserRepository
import org.springframework.stereotype.Service
import jakarta.persistence.EntityNotFoundException
import java.time.Instant

@Service
class ReviewService(
    private val reviewRepository: ReviewRepository,
    private val userRepository: UserRepository, // Repository to access User entities
    private val breweryRepository: BreweryRepository // Repository to access Brewery entities
) {

    fun createReview(userId: Long, openBreweryDbId: String, rating: Double, comment: String?): Review {
        // Fetch the User by ID
        val user = userRepository.findById(userId).orElseThrow { EntityNotFoundException("User not found") }

        // Fetch the Brewery by openBreweryDbId (assuming you have a method findByOpenBreweryDbId in your BreweryRepository)
        val brewery = breweryRepository.findByOpenBreweryDbId(openBreweryDbId) ?: throw EntityNotFoundException("Brewery not found")

        // Create a new Review instance
        val review = Review(
                user = user,
                openBreweryDbId = openBreweryDbId, // Use the fetched Brewery entity
                rating = rating,
                comment = comment,
                createdAt = Instant.now(),
                updatedAt = Instant.now()
        )

        // Save the new Review to the database
        return reviewRepository.save(review)
    }

    // Other service methods...
}

