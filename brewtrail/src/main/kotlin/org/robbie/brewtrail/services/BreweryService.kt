package org.robbie.brewtrail.services

import org.robbie.brewtrail.dto.BreweryCreationDto
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import org.robbie.brewtrail.entity.Brewery
import org.robbie.brewtrail.repository.BreweryRepository
import java.time.Instant

@Service
class BreweryService(
    private val restTemplate: RestTemplate,
    private val breweryRepository: BreweryRepository
) { // RestTemplate should be configured as a Bean

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
        val url = "$baseUrl/$openBreweryDbId"
        return try {
            val breweryDto = restTemplate.getForObject(url, BreweryCreationDto::class.java)
            if (breweryDto != null) {
                // Convert BreweryCreationDto to Brewery entity and save it to the database
                // This step depends on how you map DTOs to entities and save them
                val brewery = convertDtoToEntity(breweryDto)
                // Save the brewery entity to the database
                // Assuming you have a breweryRepository available
                breweryRepository.save(brewery)
                logger.debug("Successfully fetched and saved brewery with openBreweryDbId: $openBreweryDbId")
                brewery
            } else {
                logger.error("No brewery found with openBreweryDbId: $openBreweryDbId")
                null
            }
        } catch (e: Exception) {
            logger.error("Failed to fetch brewery with openBreweryDbId: $openBreweryDbId", e)
            null
        }
    }

    // This method should convert your BreweryCreationDto to a Brewery entity
    // You'll need to implement this based on your entity and DTO definitions
    private fun convertDtoToEntity(dto: BreweryCreationDto): Brewery {
        // Conversion logic here
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
            createdAt = Instant.now(), // Set the creation and update timestamps to the current time
            updatedAt = Instant.now()
        )
    }

    // Additional methods related to breweries can be added here
}
