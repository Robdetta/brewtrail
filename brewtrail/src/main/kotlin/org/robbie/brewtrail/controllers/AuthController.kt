package org.robbie.brewtrail.controllers

import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RestController

@RestController
class AuthController {

    @PostMapping("/auth/token")
    fun handleToken(@RequestHeader("Authorization") authHeader: String, response: HttpServletResponse): ResponseEntity<Void> {
        val token = authHeader.substring("Bearer ".length)
        val authCookie = Cookie("auth_token", token).apply {
            isHttpOnly = true
            secure = true  // Set to true if you're in a production environment using HTTPS
            path = "/"
        }
        response.addCookie(authCookie)
        return ResponseEntity.ok().build()
    }
}