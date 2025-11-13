package org.robbie.brewtrail.repository

import org.robbie.brewtrail.entity.Brewery
import org.robbie.brewtrail.entity.Review
import org.robbie.brewtrail.entity.User
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import java.util.*


@Repository
interface ReviewRepository : CrudRepository<Review, Long> {
    fun findByUserId(userId: Long?): List<Review>    // You can add more methods as needed for different queries
    fun findByUserAndBrewery(user: User, brewery: Brewery): Review?
    fun findByIdAndUserId(reviewId: Long, userId: Long): Optional<Review>
}
