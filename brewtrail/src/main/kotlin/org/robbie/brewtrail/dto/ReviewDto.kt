package org.robbie.brewtrail.dto

class ReviewDto {
    data class ReviewDto(
        val userId: Long,
        val openBreweryDbId: String,
        val rating: Double,
        val comment: String?
    )

}