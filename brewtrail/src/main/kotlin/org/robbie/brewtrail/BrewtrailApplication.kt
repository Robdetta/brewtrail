package org.robbie.brewtrail

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.ComponentScan


@SpringBootApplication
@ComponentScan(basePackages = ["org.robbie.brewtrail"])
class BrewtrailApplication

    fun main(args: Array<String>) {
        runApplication<BrewtrailApplication>(*args)
    }



