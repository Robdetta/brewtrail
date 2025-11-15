package org.robbie.brewtrail.services.impl

import org.robbie.brewtrail.dto.BreweryCreationDto
import org.robbie.brewtrail.entity.Brewery
import org.robbie.brewtrail.repository.BreweryRepository
import org.robbie.brewtrail.services.interfaces.BreweryService
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate


@Service
class BreweryServiceImpl(
    private val breweryRepository: BreweryRepository,
    private val restTemplate: RestTemplate
) : BreweryService {

    private val baseUrl = "http://api.openbrewerydb.org/v1/breweries"
    override fun searchBreweriesByCityAndState(city: String, state: String?): ResponseEntity<String> {
        val url = "$baseUrl?by_city=${city.replace(" ", "_")}" + state?.let { "&by_state=${state.replace(" ", "_")}"}.orEmpty()
        return restTemplate.getForEntity(url, String::class.java)
    }

    override fun fetchBreweryByOpenBreweryDbId(openBreweryDbId: String): Brewery? {
        return breweryRepository.findByOpenBreweryDbId(openBreweryDbId)
            ?: restTemplate.getForObject("$baseUrl/$openBreweryDbId", BreweryCreationDto::class.java)?.let {
                convertDtoToEntity(it)
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
            websiteUrl = dto.websiteUrl
        ).also { brewery -> breweryRepository.save(brewery) }
    }

    override fun findById(id: Long): Brewery? = breweryRepository.findById(id).orElse(null)
    override fun save(entity: Brewery) : Brewery = breweryRepository.save(entity)
    override fun deleteById(id: Long) = breweryRepository.deleteById(id)
    override fun findAll(): List<Brewery> = breweryRepository.findAll().toList()


}