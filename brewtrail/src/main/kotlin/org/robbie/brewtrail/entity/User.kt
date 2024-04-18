package org.robbie.brewtrail.entity

import jakarta.persistence.*
import java.time.Instant
import java.util.*

@Entity
@Table(name = "app_users")
data class User(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = true)
    var name: String? = null,

    @Column(nullable = false, unique = true)
    val email: String,

    @Column(nullable = true)
    var passwordHash: String? = null, // Store hashed password for traditional auth

    @Column(nullable = false, updatable = false)
    val createdAt: Instant = Instant.now(),

    @Column(nullable = false)
    var updatedAt: Instant = Instant.now(),

    @Column(nullable = true, unique = true)
    val authUid: UUID? = null,// Nullable for users who sign up with email/password

    @Column(nullable = false)
    var isAdmin: Boolean = false,

    @OneToMany(mappedBy = "requester")
    val sentRequests: Set<Friendship> = HashSet(),

    @OneToMany(mappedBy = "addressee")
    val receivedRequests: Set<Friendship> = HashSet()
)
