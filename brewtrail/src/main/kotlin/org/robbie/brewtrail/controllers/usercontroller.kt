package org.robbie.brewtrail.controllers

import org.springframework.web.bind.annotation.*
import org.robbie.brewtrail.services.UserService
import org.robbie.brewtrail.entity.User
import org.robbie.brewtrail.repository.UserRepository

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

    data class UserDto(val name: String, val email: String, val password: String)
}