package org.robbie.brewtrail.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.client.ClientHttpResponse
import org.springframework.web.client.RestTemplate

@Configuration
class RestTemplateConfig {

    @Bean
    fun restTemplate(): RestTemplate {
        val restTemplate = RestTemplate()
        restTemplate.interceptors.add { request, body, execution ->
            val response = execution.execute(request, body)
            removeUnwantedHeaders(response)
            response
        }
        return restTemplate
    }

    private fun removeUnwantedHeaders(response: ClientHttpResponse) {
        // Directly remove the Transfer-Encoding header if it exists
        response.headers.remove("Transfer-Encoding")
    }
}