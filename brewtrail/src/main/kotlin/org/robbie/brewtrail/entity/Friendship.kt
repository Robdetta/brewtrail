package org.robbie.brewtrail.entity

import jakarta.persistence.*
import java.time.Instant

@Entity
@Table(name = "friendships")
data class Friendship(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id", referencedColumnName = "id")
    val requester: User,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "addressee_id", referencedColumnName = "id")
    val addressee: User,

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    var status: FriendshipStatus,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: Instant = Instant.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant = Instant.now()
)

enum class FriendshipStatus {
    PENDING,
    ACCEPTED,
    REJECTED
}
