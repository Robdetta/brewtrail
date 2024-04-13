package org.robbie.brewtrail.entity

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.persistence.Column
import java.time.Instant

@Entity
data class Brewery(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,  // Internal unique ID

    @Column(name = "open_brewery_db_id", unique = true)
    val openBreweryDbId: String,  // ID from Open Brewery DB

    @Column(name = "name")
    val name: String,

    @Column(name = "brewery_type")
    val breweryType: String,

    @Column(name = "street")
    val address1: String,

    @Column(name = "city")
    val city: String,

    @Column(name = "state_province")
    val stateProvince: String?,

    @Column(name = "postal_code")
    val postalCode: String,

    @Column(name = "country")
    val country: String,

    @Column(name = "longitude")
    val longitude: String?,

    @Column(name = "latitude")
    val latitude: String?,

    @Column(name = "phone")
    val phone: String?,

    @Column(name = "website_url")
    val websiteUrl: String?,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: Instant = Instant.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant = Instant.now()
)
