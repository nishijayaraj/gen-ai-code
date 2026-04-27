package com.example.demo.controller;

import com.example.demo.dto.UserDTO;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping
    public List<UserDTO> getUsers() {
        return Arrays.asList(
            new UserDTO("John Doe", 30, "john@example.com"),
            new UserDTO("Jane Smith", 25, "jane@example.com")
        );
    }

    @PostMapping
    public UserDTO createUser(@RequestBody UserDTO user) {
        return user;
    }
}
