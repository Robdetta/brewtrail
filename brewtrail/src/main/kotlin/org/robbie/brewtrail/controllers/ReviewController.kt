package org.robbie.brewtrail.controllers

import org.robbie.brewtrail.dto.ReviewDto
import org.robbie.brewtrail.entity.Review
import org.robbie.brewtrail.services.ReviewService
import org.robbie.brewtrail.services.UserService
import org.slf4j.LoggerFactory
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
    private val userService: UserService
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
    fun getReviewsByBrewery(@PathVariable openBreweryDbId: String): ResponseEntity<List<Review>> {
        logger.debug("Fetching reviews for brewery with openBreweryDbId: {}", openBreweryDbId)
        val reviews = reviewService.findReviewsByBrewery(openBreweryDbId)
        return if (reviews.isNotEmpty()) {
            ResponseEntity.ok(reviews)
        } else {
            ResponseEntity.notFound().build()
        }
    }

//    @GetMapping("/user/reviews")
//    fun getReviewsByUser(@AuthenticationPrincipal jwt: Jwt): ResponseEntity<Any> {
//        logger.info("Received request to fetch reviews for JWT subject: ${jwt.subject}")
//        try {
//            val authUid = UUID.fromString(jwt.subject)
//            val user = userService.getUserByAuthUid(authUid)
//            val reviews = reviewService.findReviewsByUserId(user.id)
//            logger.info("Sending reviews for User ID ${user.id}: $reviews")
//            return ResponseEntity.ok(reviews)
//        } catch (ex: Exception) {
//            logger.error("Error fetching reviews: ${ex.message}", ex)
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching reviews")
//        }
//    }
    @GetMapping("/all")
    fun getAllReviews(): ResponseEntity<List<Review>> {
        val reviews = reviewService.findAllReviews()
        return if (reviews.isNotEmpty()) ResponseEntity.ok(reviews)
        else ResponseEntity.noContent().build()
    }

    @GetMapping("/user/reviews")
    fun getReviewsByUser(@AuthenticationPrincipal jwt: Jwt): ResponseEntity<Any> {
        logger.debug("Received request to fetch reviews with JWT subject: ${jwt.subject}")
        try {
            val authUid = UUID.fromString(jwt.subject) // Convert JWT subject to UUID
            val user = userService.getUserByAuthUid(authUid)
            val reviews = reviewService.findReviewsByUserId(user.id)
            logger.debug("Sending reviews for User ID {}: {}", user.id, reviews)
            return ResponseEntity.ok(reviews)
        } catch (ex: Exception) {
            logger.error("Error fetching reviews: ${ex.message}", ex)
            return ResponseEntity.badRequest().body("Error fetching reviews")
        }
    }



}