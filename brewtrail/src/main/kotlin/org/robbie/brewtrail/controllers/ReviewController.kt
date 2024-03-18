package org.robbie.brewtrail.controllers

import org.robbie.brewtrail.dto.ReviewDto
import org.robbie.brewtrail.services.ReviewService
import org.robbie.brewtrail.entity.Review
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin(origins = ["http://localhost:8081"])
@RequestMapping("/api/reviews")
class ReviewController(private val reviewService: ReviewService) {
    private val logger = LoggerFactory.getLogger(ReviewController::class.java)
    @PostMapping
    fun addReview(@RequestBody reviewDto: ReviewDto): ResponseEntity<Review> {
        logger.debug("Attempting to add review: {}", reviewDto)
        val review = reviewService.createReview(
            userId = reviewDto.userId,
            openBreweryDbId = reviewDto.openBreweryDbId,
            rating = reviewDto.rating,
            comment = reviewDto.comment
        )
        return ResponseEntity.ok(review)
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
}