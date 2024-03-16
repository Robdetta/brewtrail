package org.robbie.brewtrail.controllers

import org.robbie.brewtrail.services.BreweryService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api")
class BrewerySearchController(private val breweryService: BreweryService) {

    @CrossOrigin(origins = ["http://localhost:8081"]) // Adjust the origin as per your frontend setup
    @GetMapping("/search")
    fun searchBreweriesByCityAndState(
        @RequestParam city: String,
        @RequestParam(required = false) state: String?
    ): ResponseEntity<String> {
        return breweryService.searchBreweriesByCityAndState(city, state)
    }
}