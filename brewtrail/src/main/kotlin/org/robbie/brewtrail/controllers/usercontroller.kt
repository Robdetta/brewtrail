import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/users")
class UserController(private val userRepository: UserRepository) {

    @PostMapping
    fun addUser(@RequestBody user: User): User = userRepository.save(user)

}
