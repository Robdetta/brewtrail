package org.robbie.brewtrail.services

import org.robbie.brewtrail.entity.Friendship
import org.robbie.brewtrail.entity.FriendshipStatus
import org.robbie.brewtrail.repository.FriendshipRepository
import org.robbie.brewtrail.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class FriendshipService(
    private val friendshipRepository: FriendshipRepository,
    private val userRepository: UserRepository
) {

    @Transactional
    fun sendFriendRequest(requesterId: Long, addresseeId: Long): Friendship {
        val requester = userRepository.findById(requesterId).orElseThrow { IllegalArgumentException("Requester not found") }
        val addressee = userRepository.findById(addresseeId).orElseThrow { IllegalArgumentException("Addressee not found") }

        val existingFriendship = friendshipRepository.findByRequesterAndAddressee(requester, addressee)
        if (existingFriendship.isPresent) {
            throw IllegalStateException("Friend request already exists or friendship already established")
        }

        val friendship = Friendship(
            requester = requester,
            addressee = addressee,
            status = FriendshipStatus.PENDING
        )
        return friendshipRepository.save(friendship)
    }

    @Transactional
    fun acceptFriendRequest(friendshipId: Long) {
        val friendship = friendshipRepository.findById(friendshipId)
            .orElseThrow { IllegalArgumentException("Friendship request not found") }

        if (friendship.status != FriendshipStatus.PENDING) {
            throw IllegalStateException("Friendship request is not in a pending state")
        }

        friendship.status = FriendshipStatus.ACCEPTED
        friendshipRepository.save(friendship)
    }

    @Transactional
    fun rejectFriendRequest(friendshipId: Long) {
        val friendship = friendshipRepository.findById(friendshipId)
            .orElseThrow { IllegalArgumentException("Friendship request not found") }

        friendshipRepository.delete(friendship)
    }

    fun getFriendshipsForUser(userId: Long, status: FriendshipStatus): List<Friendship> {
        return friendshipRepository.findAllByRequesterIdOrAddresseeIdAndStatus(userId, status)
    }

}
