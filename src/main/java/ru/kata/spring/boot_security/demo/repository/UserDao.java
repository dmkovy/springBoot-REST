package ru.kata.spring.boot_security.demo.repository;

import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

public interface UserDao {
    void saveUser(User user);

    User getUserById(long id);

    List<User> getAllUsers();

    void updateUser(User user);

    void removeUserById(long id);
}
