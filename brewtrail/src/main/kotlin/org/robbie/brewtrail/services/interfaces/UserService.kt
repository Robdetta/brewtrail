package org.robbie.brewtrail.services.interfaces

import org.robbie.brewtrail.dto.UserProfile
import org.robbie.brewtrail.entity.User
import org.springframework.security.oauth2.jwt.Jwt
import java.util.UUID

interface UserService: GenericService<User, Long> {
    fun createUser (name: String, email: String, password: String) : User
    fun getUserByAuthUid(authUid: UUID): User
    fun getUserIdFromJwt(jwt: Jwt) : Long
    fun getUserProfile(userId: Long) : UserProfile
    fun searchUsers(query: String) : List<User>

}


//TODO add google auth
//   fun processGoogleUser(userInfo: GoogleUserInfoDto): User
