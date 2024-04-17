package org.robbie.brewtrail.repository


import org.robbie.brewtrail.entity.DetailedReview
import org.springframework.data.jpa.repository.JpaRepository

interface DetailedReviewRepository : JpaRepository<DetailedReview, Long> {
    // You can define methods to fetch data as needed
    fun findByUserId(userId: Long): List<DetailedReview>
    fun findByBreweryId(breweryId: String): List<DetailedReview>
}