package org.robbie.brewtrail.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant

@Entity
@Table(name = "detailed_reviews")  // This should match the name of the view in your database
class DetailedReview(
    @Id
    @Column(name = "review_id")
    val reviewId: Long,

    @Column(name = "user_id")
    val userId: Long,

    @Column(name = "user_name")
    val userName: String,

    @Column(name = "brewery_id")
    val breweryId: String,

    @Column(name = "brewery_name")
    val breweryName: String,

    @Column(name = "rating")
    val rating: Double,

    @Column(name = "comment")
    val comment: String?,

    @Column(name = "created_at")
    val createdAt: Instant
)