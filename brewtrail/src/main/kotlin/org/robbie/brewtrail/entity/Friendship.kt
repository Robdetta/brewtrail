package org.robbie.brewtrail.entity

@Entity
@Table(name = "friendships")
data class Friendship(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne
    @JoinColumn(name = "requester_id", referencedColumnName = "id")
    val requester: User,

    @ManyToOne
    @JoinColumn(name = "addressee_id", referencedColumnName = "id")
    val addressee: User,

    @Enumerated(EnumType.STRING)
    val status: FriendshipStatus,

    @Column(nullable = false, updatable = false)
    val createdAt: Instant = Instant.now(),

    @Column(nullable = false)
    var updatedAt: Instant = Instant.now()
)

enum class FriendshipStatus {
    PENDING,
    ACCEPTED,
    REJECTED
}
