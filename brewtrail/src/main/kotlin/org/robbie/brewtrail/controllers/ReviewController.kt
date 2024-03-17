package org.robbie.brewtrail.controllers

import org.robbie.brewtrail.dto.ReviewDto
import org.robbie.brewtrail.services.ReviewService
import org.robbie.brewtrail.entity.Review
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping
class ReviewController(private val reviewService: ReviewService) {
    @PostMapping
    fun addReview(@RequestBody reviewDto: ReviewDto.ReviewDto): ResponseEntity<Review> {
        val review = reviewService.createReview(
            userId = reviewDto.userId,
            openBreweryDbId = reviewDto.openBreweryDbId,
            rating = reviewDto.rating,
            comment = reviewDto.comment
        )
        return ResponseEntity.ok(review)
    }
}