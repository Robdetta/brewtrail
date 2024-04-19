package org.robbie.brewtrail.controllers

import org.robbie.brewtrail.entity.FriendshipStatus
import org.robbie.brewtrail.services.FriendshipService
import org.robbie.brewtrail.services.UserService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.web.bind.annotation.*
import org.robbie.brewtrail.entity.User

@RestController
@RequestMapping("/api")
class FriendshipController(
    private val userService: UserService,
    private val friendshipService: FriendshipService
) {

    @PostMapping("/friendships/request")
    fun sendFriendRequest(@AuthenticationPrincipal jwt: Jwt, @RequestParam addresseeId: Long): ResponseEntity<Any> {
        val requesterId = userService.getUserIdFromJwt(jwt)
        return try {
            friendshipService.sendFriendRequest(requesterId, addresseeId)
            ResponseEntity.ok("Friend request sent successfully.")
        } catch (e: Exception) {
            ResponseEntity.badRequest().body("Failed to send friend request: ${e.message}")
        }
    }

    @PostMapping("/friendships/accept/{requestId}")
    fun acceptFriendRequest(@PathVariable requestId: Long): ResponseEntity<Any> {
        return try {
            friendshipService.acceptFriendRequest(requestId)
            ResponseEntity.ok("Friend request accepted.")
        } catch (e: Exception) {
            ResponseEntity.badRequest().body("Failed to accept friend request: ${e.message}")
        }
    }

    @PostMapping("/friendships/reject/{requestId}")
    fun rejectFriendRequest(@PathVariable requestId: Long): ResponseEntity<Any> {
        return try {
            friendshipService.rejectFriendRequest(requestId)
            ResponseEntity.ok("Friend request rejected.")
        } catch (e: Exception) {
            ResponseEntity.badRequest().body("Failed to reject friend request: ${e.message}")
        }
    }

    @GetMapping("/friendships")
    fun listFriendsAndRequests(@AuthenticationPrincipal jwt: Jwt, @RequestParam status: FriendshipStatus): ResponseEntity<Any> {
        val userId = userService.getUserIdFromJwt(jwt)
        return try {
            val friendsAndRequests = friendshipService.getFriendshipsForUser(userId, status)
            ResponseEntity.ok(friendsAndRequests)
        } catch (e: Exception) {
            ResponseEntity.badRequest().body("Failed to get friends and requests: ${e.message}")
        }
    }

    @GetMapping("/search/user")
    fun searchUsers(@RequestParam query: String): ResponseEntity<List<User>> {
        val users = userService.searchUsers(query)
        return ResponseEntity.ok(users)
    }

}