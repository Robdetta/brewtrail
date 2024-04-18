package org.robbie.brewtrail.repository

import org.robbie.brewtrail.entity.Friendship
import org.robbie.brewtrail.entity.FriendshipStatus
import org.robbie.brewtrail.entity.User
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface FriendshipRepository : JpaRepository<Friendship, Long> {
    fun findByRequesterAndAddressee(requester: User, addressee: User): Optional<Friendship>
//    fun findAllByRequesterIdOrAddresseeIdAndStatus(userId: Long, userId2: Long, status: FriendshipStatus): List<Friendship>
    fun findAllByRequesterIdOrAddresseeIdAndStatus(userId: Long, status: FriendshipStatus): List<Friendship>
}

