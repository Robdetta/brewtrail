package org.robbie.brewtrail.entity


import jakarta.persistence.*
import jakarta.persistence.MappedSuperclass
import java.time.Instant

@MappedSuperclass
open class BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    open val id: Long? = null

    @Column(name = "created_at", nullable = false, updatable = false)
    open val createdAt: Instant = Instant.now()

    @Column(name = "updated_at", nullable = false)
    open var updatedAt: Instant = Instant.now()
}