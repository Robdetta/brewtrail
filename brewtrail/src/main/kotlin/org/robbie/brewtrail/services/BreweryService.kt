package org.robbie.brewtrail.services

import org.robbie.brewtrail.dto.BreweryCreationDto
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import org.robbie.brewtrail.entity.Brewery
import org.robbie.brewtrail.repository.BreweryRepository

@Service
class BreweryService(
    private val restTemplate: RestTemplate,
    private val breweryRepository: BreweryRepository
) {
    private val logger: Logger = LoggerFactory.getLogger(BreweryService::class.java)
    private val baseUrl = "https://api.openbrewerydb.org/breweries"

    fun searchBreweriesByCityAndState(city: String, state: String?): ResponseEntity<String> {
        var url = "$baseUrl?by_city=${city.replace(" ", "_")}"
        state?.let {
            url += "&by_state=${state.replace(" ", "_")}"
        }
        return restTemplate.getForEntity(url, String::class.java)
    }

    fun fetchBreweryByOpenBreweryDbId(openBreweryDbId: String): Brewery? {
        logger.debug("Fetching brewery with openBreweryDbId: $openBreweryDbId")
        val existingBrewery = breweryRepository.findByOpenBreweryDbId(openBreweryDbId)
        if (existingBrewery != null) {
            logger.debug("Brewery with openBreweryDbId: $openBreweryDbId already exists in the database.")
            return existingBrewery
        }

        val url = "$baseUrl/$openBreweryDbId"
        return try {
            val breweryDto = restTemplate.getForObject(url, BreweryCreationDto::class.java)
            breweryDto?.let {
                convertDtoToEntity(it).also { brewery ->
                    breweryRepository.save(brewery)
                    logger.debug("Successfully fetched and saved brewery with openBreweryDbId: $openBreweryDbId")
                }
            }
        } catch (e: Exception) {
            logger.error("Failed to fetch brewery with openBreweryDbId: $openBreweryDbId", e)
            null
        }
    }


    private fun convertDtoToEntity(dto: BreweryCreationDto): Brewery {
        return Brewery(
            openBreweryDbId = dto.openBreweryDbId ?: throw IllegalArgumentException("Brewery ID cannot be null"),
            name = dto.name ?: "Unknown Brewery",
            breweryType = dto.breweryType ?: "Unknown Type",
            address1 = dto.address1 ?: "Unknown Address",
            city = dto.city ?: "Unknown City",
            stateProvince = dto.stateProvince,
            postalCode = dto.postalCode ?: "Unknown Postal Code",
            country = dto.country ?: "Unknown Country",
            longitude = dto.longitude,
            latitude = dto.latitude,
            phone = dto.phone,
            websiteUrl = dto.websiteUrl,
        )
    }
}
