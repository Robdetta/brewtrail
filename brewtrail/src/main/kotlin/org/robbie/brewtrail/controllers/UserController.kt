package org.robbie.brewtrail.controllers

import org.robbie.brewtrail.dto.UserDto
import org.robbie.brewtrail.dto.UserProfile
import org.robbie.brewtrail.entity.Review
import org.robbie.brewtrail.entity.User
import org.robbie.brewtrail.services.interfaces.BreweryService
import org.robbie.brewtrail.services.interfaces.ReviewService
import org.robbie.brewtrail.services.interfaces.UserService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.jwt.Jwt

@RestController
@RequestMapping("/api/users") // Base path for this controller
class UserController(
    private val userService: UserService,
    private val reviewService: ReviewService
) {

    private val logger: Logger = LoggerFactory.getLogger(BreweryService::class.java)
    @PostMapping
    fun addUser(@RequestBody userDto: UserDto): User {
    return userService.createUser(userDto.name, userDto.email, userDto.password) // Pass the password to createUser
     }

    @GetMapping
    fun getAllUsers(): List<User> {
        return userService.findAll()
    }


    @GetMapping("/profile/{userId}")
    fun getUserProfile(@PathVariable userId: Long?): ResponseEntity<UserProfile> {
        logger.info("Fetching profile for user ID: {}", userId)
        try {
            val userProfile = userService.getUserProfile(userId!!)
            logger.info("Successfully retrieved user profile: {}", userProfile)
            return ResponseEntity.ok(userProfile)
        } catch (e: Exception) {
            logger.error("Error retrieving user profile", e)
            return ResponseEntity.notFound().build()
        }
    }

    @GetMapping("/profile")
    fun getUserProfile(@AuthenticationPrincipal jwt: Jwt): ResponseEntity<UserProfile> {
        val userId = userService.getUserIdFromJwt(jwt)
        logger.info("Fetching profile for user ID: {}", userId)
        return try {
            val userProfile = userService.getUserProfile(userId)
            logger.info("Successfully retrieved user profile: {}", userProfile)
            ResponseEntity.ok(userProfile)
        } catch (e: Exception) {
            logger.error("Error retrieving user profile", e)
            ResponseEntity.notFound().build()
        }
    }

    @GetMapping("/search")
    fun searchUsers(@RequestParam query: String): ResponseEntity<List<User>> {
        val users = userService.searchUsers(query)
        return ResponseEntity.ok(users)
    }

    @GetMapping("/{userId}/reviews")
    fun getUserReviews(@PathVariable userId: Long): ResponseEntity<List<Review>> {
        val reviews = reviewService.getUserReviews(userId)
        return if (reviews.isNotEmpty()) ResponseEntity.ok(reviews)
        else ResponseEntity.noContent().build()
    }

}

//    @PostMapping("/oauth/google")
//    fun processGoogleUser(@RequestBody userInfo: GoogleUserInfoDto): ResponseEntity<Any> {
//        val user = userService.processGoogleUser(userInfo)
//        // Generate a token for the user or perform additional actions as needed
//        return ResponseEntity.ok(user)
//    }
