package org.robbie.brewtrail.controllers

import org.robbie.brewtrail.entity.Brewery
import org.robbie.brewtrail.services.interfaces.BreweryService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api")
class BreweryController(private val breweryService: BreweryService) {

    @GetMapping("/breweries/{openBreweryDbId}")
    fun getBreweryDetails(@PathVariable openBreweryDbId: String): ResponseEntity<Brewery> {
        val brewery = breweryService.fetchBreweryByOpenBreweryDbId(openBreweryDbId)
        return if (brewery != null) {
            ResponseEntity.ok(brewery)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @GetMapping("/search")
    fun searchBreweriesByCityAndState(
        @RequestParam city: String,
        @RequestParam(required = false) state: String?
    ): ResponseEntity<List<Brewery>> {
        return breweryService.searchBreweriesByCityAndState(city, state)
    }
    // Add other endpoints as needed
}
