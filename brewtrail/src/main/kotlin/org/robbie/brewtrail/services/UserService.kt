package org.robbie.brewtrail.services

import jakarta.persistence.EntityNotFoundException
import jakarta.transaction.Transactional
import org.robbie.brewtrail.dto.GoogleUserInfoDto
import org.robbie.brewtrail.entity.User
import org.robbie.brewtrail.repository.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.util.*

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


    fun getUserByAuthUid(authUid: UUID): User {
        return userRepository.findByAuthUid(authUid)
            .orElseThrow { EntityNotFoundException("User not found for UUID: $authUid") }
    }

    @Transactional
    fun processGoogleUser(userInfo: GoogleUserInfoDto): User {
        val existingUser = userRepository.findByEmail(userInfo.email).orElse(null)
        return if (existingUser != null) {
            // Optionally update user details and return
            existingUser.name = userInfo.name
            userRepository.save(existingUser)
        } else {
            // Create a new user
            val newUser = User(name = userInfo.name, email = userInfo.email, passwordHash = "")
            userRepository.save(newUser)
        }
    }
}