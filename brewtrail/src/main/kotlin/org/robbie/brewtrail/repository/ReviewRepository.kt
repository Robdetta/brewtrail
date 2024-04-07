package org.robbie.brewtrail.repository

import org.robbie.brewtrail.entity.Review
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface ReviewRepository : CrudRepository<Review, Long> {
    // Find all reviews for a specific brewery
    fun findByBrewery_OpenBreweryDbId(openBreweryDbId: String): List<Review>

    // Find all reviews made by a specific user
    fun findByUserId(userId: Long): List<Review>

    // You can add more methods as needed for different queries
}
