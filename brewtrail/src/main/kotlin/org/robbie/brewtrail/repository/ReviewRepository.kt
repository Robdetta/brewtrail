package org.robbie.brewtrail.repository

import org.robbie.brewtrail.entity.Review
import org.springframework.data.repository.CrudRepository

interface ReviewRepository : CrudRepository<Review, Long> {
    // Find all reviews for a specific brewery
    fun findByOpenBreweryDbId(breweryId: Long): List<Review>

    // Find all reviews made by a specific user
    fun findByUserId(userId: Long): List<Review>

    // You can add more methods as needed for different queries
}
