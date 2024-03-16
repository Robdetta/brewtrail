package org.robbie.brewtrail

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.getForObject
import org.springframework.web.bind.annotation.GetMapping

@SpringBootApplication
class BrewtrailApplication {

    @Bean
    fun restTemplate(): RestTemplate = RestTemplate()

    @GetMapping("/api/search")
    fun searchBreweries(): String {
        return "Simplified response"
    }

    // Other beans and methods...
}

fun main(args: Array<String>) {
    runApplication<BrewtrailApplication>(*args)
}
