package org.robbie.brewtrail.services.interfaces

import org.robbie.brewtrail.entity.Brewery
import org.springframework.http.ResponseEntity

interface BreweryService : GenericService<Brewery, Long> {
    fun searchBreweriesByCityAndState(city: String, state: String?): ResponseEntity<List<Brewery>>
    fun fetchBreweryByOpenBreweryDbId(openBreweryDbId: String): Brewery?
}