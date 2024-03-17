package org.robbie.brewtrail.services

import org.robbie.brewtrail.entity.Review
import org.robbie.brewtrail.repository.BreweryRepository
import org.robbie.brewtrail.repository.ReviewRepository
import org.robbie.brewtrail.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import jakarta.persistence.EntityNotFoundException
import org.robbie.brewtrail.dto.BreweryCreationDto
import org.robbie.brewtrail.entity.Brewery
import org.slf4j.LoggerFactory
import java.time.Instant

@Service
class ReviewService(
    private val reviewRepository: ReviewRepository,
    private val userRepository: UserRepository, // Repository to access User entities
    private val breweryRepository: BreweryRepository, // Repository to access Brewery entities
    private val breweryService: BreweryService

) {
    companion object {
        private val logger = LoggerFactory.getLogger(ReviewService::class.java)
    }

    @Transactional
    fun createReview(userId: Long, openBreweryDbId: String, rating: Double, comment: String?): Review {
        val user = userRepository.findById(userId).orElseThrow { EntityNotFoundException("User not found") }

        val brewery = breweryRepository.findByOpenBreweryDbId(openBreweryDbId)
            ?: breweryService.fetchBreweryByOpenBreweryDbId(openBreweryDbId)?.let { dto ->
                Brewery(
                    openBreweryDbId = dto.openBreweryDbId,
                    name = dto.name,
                    breweryType = dto.breweryType,
                    address1 = dto.address1 ?: "",
                    city = dto.city,
                    stateProvince = dto.stateProvince,
                    postalCode = dto.postalCode ?: "",
                    country = dto.country,
                    longitude = dto.longitude,
                    latitude = dto.latitude,
                    phone = dto.phone,
                    websiteUrl = dto.websiteUrl,
                    createdAt = Instant.now(),
                    updatedAt = Instant.now()
                ).also { newBrewery ->
                    breweryRepository.save(newBrewery)
                }
            } ?: throw EntityNotFoundException("Brewery not found with openBreweryDbId: $openBreweryDbId")

        val review = Review(
            user = user,
            brewery = brewery,  // Use the Brewery entity here
            rating = rating,
            comment = comment,
            createdAt = Instant.now(),
            updatedAt = Instant.now()
        )

        return reviewRepository.save(review)
    }
    // Other service methods...
}

