package org.robbie.brewtrail.services

import org.robbie.brewtrail.entity.User
import org.robbie.brewtrail.repository.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
    ) {

    fun createUser(name: String, email: String, password: String): User {
        val passwordHash = passwordEncoder.encode(password) // Hash the password
        val newUser = User(name = name, email = email, passwordHash = passwordHash)
        return userRepository.save(newUser)
    }

    fun getAllUsers(): List<User> {
        return userRepository.findAll()
    }
}