package org.robbie.brewtrail.services.impl

import org.robbie.brewtrail.entity.DetailedReview
import org.robbie.brewtrail.repository.DetailedReviewRepository
import org.robbie.brewtrail.services.interfaces.DetailedReviewService
import org.springframework.stereotype.Service

@Service
class DetailedReviewServiceImpl(
    private val detailedReviewRepository: DetailedReviewRepository
) : DetailedReviewService {

    override fun findById(id: Long): DetailedReview? =
        detailedReviewRepository.findById(id).orElse(null)

    override fun save(entity: DetailedReview): DetailedReview =
        detailedReviewRepository.save(entity)

    override fun deleteById(id: Long) =
        detailedReviewRepository.deleteById(id)

    override fun findAll(): List<DetailedReview> =
        detailedReviewRepository.findAll()

    override fun findByUserId(userId: Long): List<DetailedReview> =
        detailedReviewRepository.findByUserId(userId)

    override fun findByOpenBreweryDbId(openBreweryDbId: String): List<DetailedReview> =
        detailedReviewRepository.findByOpenBreweryDbId(openBreweryDbId)
}