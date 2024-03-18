package org.robbie.brewtrail.controllers

import org.robbie.brewtrail.entity.Brewery
import org.robbie.brewtrail.services.BreweryService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/breweries")
class BreweryController(private val breweryService: BreweryService) {

    @CrossOrigin(origins = ["http://localhost:8081"]) // Adjust as needed
    @GetMapping("/{openBreweryDbId}")
    fun getBreweryDetails(@PathVariable openBreweryDbId: String): ResponseEntity<Brewery> {
        val brewery = breweryService.fetchBreweryByOpenBreweryDbId(openBreweryDbId)
        return if (brewery != null) {
            ResponseEntity.ok(brewery)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    // Add other endpoints as needed
}
