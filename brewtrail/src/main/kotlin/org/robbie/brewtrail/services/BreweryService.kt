package org.robbie.brewtrail.services

import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.getForEntity

@Service
class BreweryService(private val restTemplate: RestTemplate) { // RestTemplate should be configured as a Bean

    private val baseUrl = "https://api.openbrewerydb.org/breweries"

    fun searchBreweriesByCityAndState(city: String, state: String?): ResponseEntity<String> {
        var url = "$baseUrl?by_city=${city.replace(" ", "_")}"
        state?.let {
            url += "&by_state=${state.replace(" ", "_")}"
        }
        return restTemplate.getForEntity(url, String::class.java)
    }

    // Additional methods related to breweries can be added here
}