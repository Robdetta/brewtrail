package org.robbie.brewtrail.services

import org.robbie.brewtrail.entity.DetailedReview
import org.robbie.brewtrail.repository.DetailedReviewRepository
import org.springframework.stereotype.Service

@Service
class DetailedReviewService(
    private val detailedReviewRepository: DetailedReviewRepository
) : GenericService<DetailedReview, Long> {

    override fun findById(id: Long): DetailedReview? = detailedReviewRepository.findById(id).orElse(null)

    override fun save(entity: DetailedReview): DetailedReview = detailedReviewRepository.save(entity)

    override fun deleteById(id: Long) = detailedReviewRepository.deleteById(id)

    override fun findAll(): List<DetailedReview> = detailedReviewRepository.findAll()
}
