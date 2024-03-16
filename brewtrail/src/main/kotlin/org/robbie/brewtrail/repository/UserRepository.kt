package org.robbie.brewtrail.repository

import org.springframework.data.jpa.repository.JpaRepository
import org.robbie.brewtrail.entity.User

interface UserRepository : JpaRepository<User, Long>
