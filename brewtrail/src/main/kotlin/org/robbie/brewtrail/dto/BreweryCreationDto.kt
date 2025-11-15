package org.robbie.brewtrail.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class BreweryCreationDto(
    @JsonProperty("id") val openBreweryDbId: String?,
    @JsonProperty("name") val name: String?,
    @JsonProperty("brewery_type") val breweryType: String? = "Unknown", // Make breweryType nullable or provide a default value
    @JsonProperty("address_1") val address1: String?,
    @JsonProperty("city") val city: String?,
    @JsonProperty("state_province") val stateProvince: String?,
    @JsonProperty("postal_code") val postalCode: String?,
    @JsonProperty("country") val country: String?,
    @JsonProperty("longitude") val longitude: String?,
    @JsonProperty("latitude") val latitude: String?,
    @JsonProperty("phone") val phone: String?,
    @JsonProperty("website_url") val websiteUrl: String?
)
