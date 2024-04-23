package org.robbie.brewtrail.repository

import org.robbie.brewtrail.entity.Brewery
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface BreweryRepository : JpaRepository<Brewery, Long> {
    fun findByOpenBreweryDbId(openBreweryDbId: String): Brewery?

}
