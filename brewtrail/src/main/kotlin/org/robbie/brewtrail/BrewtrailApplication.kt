package org.robbie.brewtrail

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.web.client.RestTemplate


@SpringBootApplication
class BrewtrailApplication {

    @Bean
    fun restTemplate(): RestTemplate = RestTemplate()

}

fun main(args: Array<String>) {
    runApplication<BrewtrailApplication>(*args)
}
