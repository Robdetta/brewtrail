package org.robbie.brewtrail.entity


import jakarta.persistence.Entity

import jakarta.persistence.Column
import jakarta.persistence.ManyToOne
import jakarta.persistence.JoinColumn

@Entity
data class Review(
    @ManyToOne
    @JoinColumn(name = "user_id")
    val user: User,

    @ManyToOne
    @JoinColumn(name = "brewery_id")
    val brewery: Brewery, // Brewery ID from the Open Brewery DB API

    @Column(name = "rating")
    var rating: Double,

    @Column(name = "comment")
    var comment: String? = null,

) : BaseEntity()
