package org.robbie.brewtrail.controllers

import org.robbie.brewtrail.dto.ReviewDto
import org.robbie.brewtrail.entity.DetailedReview
import org.robbie.brewtrail.services.interfaces.DetailedReviewService
import org.robbie.brewtrail.services.interfaces.ReviewService
import org.robbie.brewtrail.services.interfaces.UserService
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.web.bind.annotation.*
import java.util.*


data class ApiResponse(val message: String)
@RestController
@CrossOrigin(origins = ["http://localhost:8081"])
@RequestMapping("/api/reviews")
class ReviewController(
    private val reviewService: ReviewService,
    private val userService: UserService,
    private val detailedReviewService: DetailedReviewService
) {
    private val logger = LoggerFactory.getLogger(ReviewController::class.java)

    @PostMapping
    fun addReview(@RequestBody reviewDto: ReviewDto, @AuthenticationPrincipal jwt: Jwt): ResponseEntity<ApiResponse> {
        val userUuid = UUID.fromString(jwt.subject) // Assuming JWT 'sub' contains the UUID
        val user = userService.getUserByAuthUid(userUuid)

        reviewService.createReview(
            userId = user.id,
            openBreweryDbId = reviewDto.openBreweryDbId,
            rating = reviewDto.rating,
            comment = reviewDto.comment
        )
        return ResponseEntity.ok(ApiResponse("Review added successfully"))
    }

    @GetMapping("/brewery/{openBreweryDbId}")
    fun getReviewsByBrewery(@PathVariable openBreweryDbId: String): ResponseEntity<List<DetailedReview>> {
        logger.debug("Fetching reviews for brewery with openBreweryDbId: {}", openBreweryDbId)
        val reviews = reviewService.getDetailedReviewsByBreweryId(openBreweryDbId)
        return if (reviews.isNotEmpty()) {
            ResponseEntity.ok(reviews)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @GetMapping("/all")
    fun getAllDetailedReviews(): ResponseEntity<List<DetailedReview>> {
        val reviews = detailedReviewService.findAll()
        return if (reviews.isNotEmpty()) ResponseEntity.ok(reviews)
        else ResponseEntity.noContent().build()
    }

    @GetMapping("/user/reviews")
    fun getReviewsByUser(@AuthenticationPrincipal jwt: Jwt): ResponseEntity<Any> {
        logger.debug("Received request to fetch reviews with JWT subject: ${jwt.subject}")
        val userId = userService.getUserIdFromJwt(jwt)
        try {
            val reviews = reviewService.getDetailedReviewsByUserId(userId)
            logger.debug("Sending reviews for User ID {}: {}", userId, reviews)
            return ResponseEntity.ok(reviews)
        } catch (ex: Exception) {
            logger.error("Error fetching reviews: ${ex.message}", ex)
            return ResponseEntity.badRequest().body("Error fetching reviews")
        }
    }

    @PutMapping("/{reviewId}")
    fun updateReview(@PathVariable reviewId: Long, @RequestBody reviewDto: ReviewDto, @AuthenticationPrincipal jwt: Jwt): ResponseEntity<Any> {
        val userId = userService.getUserIdFromJwt(jwt)
        try {
            val updatedReview = reviewService.updateReview(reviewId, userId, reviewDto.rating, reviewDto.comment)
            return ResponseEntity.ok(updatedReview)
        } catch (ex: SecurityException) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized access")
        } catch (ex: Exception) {
            return ResponseEntity.badRequest().body("Error updating review")
        }
    }

    @GetMapping("/user/{userId}/reviews")
    fun getReviewsByUserId(
        @PathVariable userId: Long,
        @AuthenticationPrincipal jwt: Jwt
    ): ResponseEntity<List<DetailedReview>> {
        logger.debug("Fetching reviews for user with ID: {}", userId)
        val reviews = reviewService.getDetailedReviewsByUserId(userId)
        return if (reviews.isNotEmpty()) {
            ResponseEntity.ok(reviews)
        } else {
            ResponseEntity.notFound().build()
        }
    }


    @DeleteMapping("/{reviewId}")
    fun deleteReview(@PathVariable reviewId: Long, @AuthenticationPrincipal jwt: Jwt): ResponseEntity<Any> {
        val userId = userService.getUserIdFromJwt(jwt)
        try {
            reviewService.deleteReview(reviewId, userId)
            return ResponseEntity.ok("Review deleted successfully")
        } catch (ex: SecurityException) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized access")
        } catch (ex: Exception) {
            return ResponseEntity.badRequest().body("Error deleting review")
        }
    }

}