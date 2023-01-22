package ru.kata.spring.boot_security.demo.repository;

import ru.kata.spring.boot_security.demo.model.Role;

import java.util.List;

public interface RoleDao {

    Role getRoleById(long id);

    List<Role> findAllRoles();

    void saveRole(Role role);

    Role findRoleByName(String role);
}