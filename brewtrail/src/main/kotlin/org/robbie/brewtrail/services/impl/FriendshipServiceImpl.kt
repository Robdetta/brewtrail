package org.robbie.brewtrail.services.impl

import jakarta.transaction.Transactional
import org.robbie.brewtrail.entity.Friendship
import org.robbie.brewtrail.entity.FriendshipStatus
import org.robbie.brewtrail.repository.FriendshipRepository
import org.robbie.brewtrail.repository.UserRepository
import org.robbie.brewtrail.services.interfaces.FriendshipService
import org.springframework.stereotype.Service

@Service
class FriendshipServiceImpl(
    private val friendshipRepository: FriendshipRepository,
    private val userRepository: UserRepository
): FriendshipService {
    @Transactional
    override fun sendFriendRequest(requesterId: Long, addresseeId: Long): Friendship {
        val requester = userRepository.findById(requesterId).orElseThrow {IllegalArgumentException("Requester not found")}
        val addressee = userRepository.findById(addresseeId).orElseThrow {IllegalArgumentException("Addressee not found")}

        val existingFriendship = friendshipRepository.findByRequesterAndAddressee(requester, addressee)
        if(existingFriendship.isPresent) {
            throw IllegalStateException("Friend request already exist or friendship already established")
        }

        val friendship = Friendship(
            requester = requester,
            addressee = addressee,
            status = FriendshipStatus.PENDING
        )
        return friendshipRepository.save(friendship)
    }

    override fun acceptFriendRequest(friendshipId: Long) {
        val friendship = friendshipRepository.findById(friendshipId)
            .orElseThrow{IllegalArgumentException("Friendship request not found")}

        if(friendship.status != FriendshipStatus.PENDING) {
            throw IllegalStateException("Friendship request is not in a pending state")
        }

        friendship.status = FriendshipStatus.ACCEPTED
        friendshipRepository.save(friendship)
    }

    override fun rejectFriendRequest(friendshipId: Long) {
       val friendship = friendshipRepository.findById(friendshipId)
           .orElseThrow{IllegalArgumentException("Friendship request not found") }

        friendshipRepository.delete(friendship)
    }

    override fun getFriendshipsForUser(userId: Long, status: FriendshipStatus): List<Friendship> {
        return friendshipRepository.findFriendshipsByUserIdAndStatus(userId, status)
    }

    override fun findById(id: Long): Friendship? = friendshipRepository.findById(id).orElse(null)

    override fun save(entity: Friendship): Friendship = friendshipRepository.save(entity)

    override fun deleteById(id: Long) = friendshipRepository.deleteById(id)

    override fun findAll(): List<Friendship> = friendshipRepository.findAll().toList()

}
