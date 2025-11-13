package org.robbie.brewtrail.services.interfaces

import org.robbie.brewtrail.entity.DetailedReview
import org.springframework.stereotype.Service

@Service
interface DetailedReviewService : GenericService<DetailedReview, Long> {
    fun findByUserId(userId: Long): List<DetailedReview>
    fun findByOpenBreweryDbId(openBreweryDbId: String): List<DetailedReview>
}