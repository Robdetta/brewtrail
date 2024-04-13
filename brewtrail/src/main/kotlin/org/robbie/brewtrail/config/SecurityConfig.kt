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
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.web.client.RestTemplate
import java.util.*
import javax.crypto.spec.SecretKeySpec


@Configuration
@EnableWebSecurity
@EnableMethodSecurity
class SecurityConfig {

    @Bean
    fun jwtDecoder(): JwtDecoder {
        val secretKey = System.getenv("JWT_SECRET")
        val decodedKey = Base64.getDecoder().decode(secretKey)
        val secretKeySpec = SecretKeySpec(decodedKey, "HMACSHA256")

        return NimbusJwtDecoder.withSecretKey(secretKeySpec).build()
    }


    @Bean
    fun filterChain(httpSecurity: HttpSecurity): SecurityFilterChain {
        httpSecurity
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
    fun passwordEncoder(): PasswordEncoder {
        return BCryptPasswordEncoder()  // Define a password encoder bean
    }

}
