package org.robbie.brewtrail.repository

import org.robbie.brewtrail.entity.Friendship
import org.robbie.brewtrail.entity.FriendshipStatus
import org.robbie.brewtrail.entity.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.*

interface FriendshipRepository : JpaRepository<Friendship, Long> {
    fun findByRequesterAndAddressee(requester: User, addressee: User): Optional<Friendship>
    @Query("SELECT f FROM Friendship f WHERE (f.requester.id = :userId OR f.addressee.id = :userId) AND f.status = :status")
    fun findFriendshipsByUserIdAndStatus(@Param("userId") userId: Long, @Param("status") status: FriendshipStatus): List<Friendship>
}

