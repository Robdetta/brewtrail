package org.robbie.brewtrail.controllers

import jakarta.servlet.http.HttpServletResponse
import org.robbie.brewtrail.entity.Brewery
import org.robbie.brewtrail.services.interfaces.BreweryService
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api")
class BreweryController(private val breweryService: BreweryService) {

    private val logger = LoggerFactory.getLogger(ReviewController::class.java)


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
        @RequestParam(required = false) state: String?,
        response: HttpServletResponse // Inject the response object
    ): ResponseEntity<String> {
        // Log request details
        logger.info("Search request received for city: $city and state: $state")

        // Execute the search
        val searchResult = breweryService.searchBreweriesByCityAndState(city, state)

        // Log response headers
        response.headerNames.forEach { headerName ->
            logger.info("Response Header: $headerName - Value: ${response.getHeader(headerName)}")
        }

        // Return the search result
        return searchResult
    }
}
