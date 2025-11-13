package org.robbie.brewtrail.entity

import jakarta.persistence.Entity
import jakarta.persistence.Column


@Entity
data class Brewery(



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
    ) : BaseEntity()