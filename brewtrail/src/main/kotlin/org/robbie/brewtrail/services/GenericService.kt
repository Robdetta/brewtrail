package org.robbie.brewtrail.services

interface GenericService<T, ID> {
    fun findById(id: ID): T?
    fun save(entity: T): T
    fun deleteById(id: ID)
    fun findAll(): List<T>
}