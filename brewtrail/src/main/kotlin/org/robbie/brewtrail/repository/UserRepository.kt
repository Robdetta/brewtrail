package org.robbie.brewtrail.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.robbie.brewtrail.entity.User
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface UserRepository : JpaRepository<User, Long> {
    fun findByEmail(email: String): Optional<User>
}
