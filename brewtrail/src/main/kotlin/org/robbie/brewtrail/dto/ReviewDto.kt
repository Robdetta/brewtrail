package org.robbie.brewtrail.dto

data class ReviewDto(
    val userId: Long,
    val openBreweryDbId: String,
    val rating: Double,
    val comment: String?
)