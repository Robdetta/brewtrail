package org.robbie.brewtrail.repository

import org.robbie.brewtrail.entity.Brewery
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface BreweryRepository : JpaRepository<Brewery, Long> {
    // Define custom query methods here if needed, for example:
    fun findByOpenBreweryDbId(openBreweryDbId: String): Brewery?
    fun findByName(name: String): List<Brewery>
    fun findByCity(city: String): List<Brewery>
}
