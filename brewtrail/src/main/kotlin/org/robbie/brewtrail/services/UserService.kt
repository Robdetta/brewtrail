package org.robbie.brewtrail.services

import org.robbie.brewtrail.entity.User
import org.robbie.brewtrail.repository.UserRepository
import org.springframework.stereotype.Service

@Service
class UserService(private val userRepository: UserRepository) {

    fun createUser(name: String, email: String): User {
        val newUser = User(name = name, email = email)
        return userRepository.save(newUser)
    }

    fun getAllUsers(): List<User> {
        return userRepository.findAll()
    }
}