package org.robbie.brewtrail.controllers

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.getForEntity


@RestController
class BrewerySearchController {

    private val restTemplate = RestTemplate()
    private val baseUrl = "https://api.openbrewerydb.org/breweries"

    @CrossOrigin(origins = ["http://localhost:8081"])
    @GetMapping("/api/search")
    fun searchBreweriesByCityAndState(@RequestParam city: String, @RequestParam(required = false) state: String?): ResponseEntity<String> {
        var url = "$baseUrl?by_city=${city.replace(" ", "_")}"
        if (state != null) {
            url += "&by_state=${state.replace(" ", "_")}"
        }
        return restTemplate.getForEntity(url, String::class.java)
    }
}
