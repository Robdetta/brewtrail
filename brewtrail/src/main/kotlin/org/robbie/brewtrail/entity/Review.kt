package org.robbie.brewtrail.entity


import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.persistence.Column
import java.time.Instant
import jakarta.persistence.ManyToOne
import jakarta.persistence.JoinColumn

@Entity
data class Review(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne
    @JoinColumn(name = "user_id")
    val user: User,

    @ManyToOne
    @JoinColumn(name = "brewery_id")
    val brewery: Brewery, // Brewery ID from the Open Brewery DB API

    @Column(name = "rating")
    val rating: Double,

    @Column(name = "comment")
    val comment: String? = null,

    @Column(name= "created_at", nullable = false, updatable = false)
    val createdAt: Instant = Instant.now(),

    @Column(name="updated_at",nullable = false)
    var updatedAt: Instant = Instant.now()
)
