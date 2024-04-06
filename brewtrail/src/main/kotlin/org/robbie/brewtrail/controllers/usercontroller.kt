package org.robbie.brewtrail.controllers

import org.hibernate.query.sqm.tree.SqmNode.log
import org.robbie.brewtrail.dto.GoogleUserInfoDto
import org.springframework.web.bind.annotation.*
import org.robbie.brewtrail.services.UserService
import org.robbie.brewtrail.entity.User
import org.robbie.brewtrail.repository.UserRepository
import org.springframework.http.ResponseEntity

@RestController
@RequestMapping("/users") // Base path for this controller
class UserController(private val userService: UserService) {


    @PostMapping
    fun addUser(@RequestBody userDto: UserDto): User {
    return userService.createUser(userDto.name, userDto.email, userDto.password) // Pass the password to createUser   
     }

    @GetMapping
    fun getAllUsers(): List<User> {
        return userService.getAllUsers()
    }

    @GetMapping("/test") // This maps to /users/test
    fun testEndpoint(): String {
        return "Test endpoint is working"
    }

    @PostMapping("/oauth/google")
    fun processGoogleUser(@RequestBody userInfo: GoogleUserInfoDto): ResponseEntity<Any> {
        val user = userService.processGoogleUser(userInfo)
        // Generate a token for the user or perform additional actions as needed
        return ResponseEntity.ok(user)
    }


    data class UserDto(val name: String, val email: String, val password: String)
}