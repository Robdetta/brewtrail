package org.robbie.brewtrail.services.impl

import jakarta.persistence.EntityNotFoundException
import org.robbie.brewtrail.dto.UserProfile
import org.robbie.brewtrail.entity.User
import org.robbie.brewtrail.repository.UserRepository
import org.robbie.brewtrail.services.interfaces.UserService
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.stereotype.Service
import java.util.*



@Service
class UserServiceImpl(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
): UserService {

     override fun createUser(name: String, email: String, password: String): User {
        val passwordHash = passwordEncoder.encode(password) // Hash the password
        val newUser = User(name = name, email = email, passwordHash = passwordHash)
        return userRepository.save(newUser)
    }


    override fun getUserByAuthUid(authUid: UUID): User {
        return userRepository.findByAuthUid(authUid)
            .orElseThrow { EntityNotFoundException("User not found for UUID: $authUid") }
    }

    override fun getUserIdFromJwt(jwt: Jwt): Long {
        val authUid = UUID.fromString(jwt.subject)
        val user = userRepository.findByAuthUid(authUid)
            .orElseThrow { EntityNotFoundException("User not found") }
        return user.id
    }

    override fun getUserProfile(userId: Long): UserProfile {
        return userRepository.findById(userId).map { user ->
            UserProfile(
                id = user.id,
                name = user.name,
                email = user.email
            )
        }.orElseThrow { RuntimeException("User not found") }
    }

    override fun searchUsers(query: String): List<User> {
        return userRepository.findByNameContainingIgnoreCase(query)
    }

    override fun findById(id: Long): User? = userRepository.findById(id).orElse(null)

    override fun save(entity: User): User = userRepository.save(entity)

    override fun deleteById(id: Long) = userRepository.deleteById(id)

    override fun findAll(): List<User> = userRepository.findAll().toList()

}

//TODO add google auth
//@Transactional
//override fun processGoogleUser(userInfo: GoogleUserInfoDto): User {
//    val existingUser = userRepository.findByEmail(userInfo.email).orElse(null)
//    return if (existingUser != null) {
//        // Optionally update user details and return
//        existingUser.name = userInfo.name
//        userRepository.save(existingUser)
//    } else {
//        // Create a new user
//        val newUser = User(name = userInfo.name, email = userInfo.email, passwordHash = "")
//        userRepository.save(newUser)
//    }
//}