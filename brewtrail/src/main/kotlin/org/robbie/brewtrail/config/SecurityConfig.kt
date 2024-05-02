 package org.robbie.brewtrail.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.Customizer
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter
import org.springframework.security.web.SecurityFilterChain
import org.springframework.web.client.RestTemplate
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.CorsUtils
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

import java.util.*
import javax.crypto.spec.SecretKeySpec


@Configuration
@EnableWebSecurity
@EnableMethodSecurity
class SecurityConfig {

    @Bean
    fun jwtDecoder(): JwtDecoder {
        val secretKey = System.getenv("JWT_SECRET") ?: throw IllegalStateException("JWT_SECRET is not configured")
        val secretKeySpec = SecretKeySpec(secretKey.toByteArray(), "HMACSHA256")

        return NimbusJwtDecoder.withSecretKey(secretKeySpec).build()
    }
    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val config = CorsConfiguration().apply {
            allowedOrigins = listOf(System.getenv("FRONTEND_URL")) // Ensure this matches exactly what the client sends
            allowedHeaders = listOf("*")
            allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")
            allowCredentials = true
            maxAge = 3600L
        }
        config.addAllowedMethod(HttpMethod.OPTIONS) // Explicitly allow OPTIONS

        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", config)
        return source
    }

    @Bean
    fun securityFilterChain(httpSecurity: HttpSecurity): SecurityFilterChain {
        httpSecurity
            .cors { it.configurationSource(corsConfigurationSource()) }
            .csrf { csrf -> csrf.disable() }
            .authorizeHttpRequests { auth ->
                auth
                    .requestMatchers("/api/search/**","/api/breweries/**", "/api/reviews/").permitAll()
                    .requestMatchers(CorsUtils::isPreFlightRequest).permitAll()// Public endpoints
                    .requestMatchers("/api/reviews/user/**").authenticated()
                    .anyRequest().permitAll()// Other endpoints require authentication
            }
            .sessionManagement { session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)  // Stateless session management
            }


            .oauth2ResourceServer { oauth2 -> oauth2.jwt { jwt -> jwt.decoder(jwtDecoder()) } }
            .httpBasic(Customizer.withDefaults())  // Basic authentication as a fallback

        return httpSecurity.build()
    }


    @Bean
    fun jwtAuthenticationConverter(): JwtAuthenticationConverter {
        val converter = JwtAuthenticationConverter()
        converter.setJwtGrantedAuthoritiesConverter { jwt: Jwt ->
            // Custom logic to extract and log the authorities or any other claims
            val authorities = JwtGrantedAuthoritiesConverter().convert(jwt) ?: emptyList()
            println("JWT Claims: ${jwt.claims}")  // Log JWT claims
            println("JWT Headers: ${jwt.headers}")  // Log JWT headers
            authorities
        }
        return converter
    }
    @Bean
    fun passwordEncoder(): PasswordEncoder {
        return BCryptPasswordEncoder()  // Define a password encoder bean
    }

}
