 package org.robbie.brewtrail.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
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
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

import java.util.*
import javax.crypto.spec.SecretKeySpec


@Configuration
@EnableWebSecurity
@EnableMethodSecurity
class SecurityConfig {

//    @Bean
//    fun jwtDecoder(): JwtDecoder {
//        val secretKey = System.getenv("JWT_SECRET")
//        val decodedKey = Base64.getDecoder().decode(secretKey)
//        val secretKeySpec = SecretKeySpec(decodedKey, "HMACSHA256")
//        val decoder = NimbusJwtDecoder.withSecretKey(secretKeySpec)..build()
//
//        return JwtDecoder { token: String ->
//            println("JWT to decode: $token")  // Log the raw token
//            try {
//                val jwt = decoder.decode(token)
//                println("JWT decoded successfully: $jwt")
//                jwt
//            } catch (e: Exception) {
//                println("Error decoding JWT: ${e.message}")
//                throw e
//            }
//        }
//    }

    @Bean
    fun jwtDecoder(): JwtDecoder {
        val secretKey = System.getenv("JWT_SECRET") ?: throw IllegalStateException("JWT_SECRET is not configured")
        val secretKeySpec = SecretKeySpec(secretKey.toByteArray(), "HMACSHA256")

        return NimbusJwtDecoder.withSecretKey(secretKeySpec).build()
    }
    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration().apply {
            allowCredentials = true
            allowedOrigins = listOf("http://localhost:8081") // Specify your frontend URL
            allowedHeaders = listOf("*")
            allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")
            maxAge = 3600L
        }
        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration)
        return source
    }

    @Bean
    fun securityFilterChain(httpSecurity: HttpSecurity): SecurityFilterChain {
        httpSecurity
            .cors { it.configurationSource(corsConfigurationSource()) }
            .csrf { csrf -> csrf.disable() }
            .authorizeHttpRequests { auth ->
                auth
                    .requestMatchers("/api/search/**","/api/breweries/**", "/api/reviews/**").permitAll()  // Public endpoints
                    .anyRequest().authenticated()  // Other endpoints require authentication
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
