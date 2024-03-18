package org.robbie.brewtrail.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.robbie.brewtrail.entity.User
import java.util.*

interface UserRepository : JpaRepository<User, Long> {
   override fun findById(userId: Long): Optional<User>
}
