package org.robbie.brewtrail.services.interfaces

import org.robbie.brewtrail.entity.Friendship
import org.robbie.brewtrail.entity.FriendshipStatus

interface FriendshipService : GenericService<Friendship, Long> {
    fun sendFriendRequest(requesterId: Long, addresseeId: Long): Friendship
    fun acceptFriendRequest(friendshipId: Long)
    fun rejectFriendRequest(friendshipId: Long)
    fun getFriendshipsForUser(userId: Long, status: FriendshipStatus): List<Friendship>
}

