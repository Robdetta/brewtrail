package org.robbie.brewtrail.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.robbie.brewtrail.entity.User
import java.util.*

interface UserRepository : JpaRepository<User, Long> {
    fun findByEmail(email: String): Optional<User>
}
