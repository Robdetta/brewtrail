package org.robbie.brewtrail.entity

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.persistence.Column
import java.time.Instant
import java.util.*

@Entity
@Table(name = "app_users") 
data class User(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(name="name",nullable = true)
    var name: String? = null,

    @Column(name ="email", nullable = false, unique = true)
    val email: String,

    @Column(name="password_Hash", nullable = true)
    var passwordHash: String? = null, // Store hashed password for traditional auth

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: Instant = Instant.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant = Instant.now(),

    @Column(name = "auth_uid", nullable = true, unique = true)
    val authUid: UUID? = null // Nullable for users who sign up with email/password
)
