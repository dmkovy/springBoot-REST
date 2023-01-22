package ru.kata.spring.boot_security.demo.init;

import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Collection;

@Component
public class Init {

    private final UserService userService;

    public Init(UserService userService) {
        this.userService = userService;
    }

    @PostConstruct
    public void initializer() {

        Role roleAdmin = Role.builder()
                .name("ROLE_ADMIN")
                .build();

        Role roleUser = Role.builder()
                .name("ROLE_USER")
                .build();

        userService.addRole(roleAdmin);
        userService.addRole(roleUser);

        Collection<Role> adminRoleList = new ArrayList<>();
        Collection<Role> userRoleList = new ArrayList<>();

        adminRoleList.add(roleAdmin);
        adminRoleList.add(roleUser);
        userRoleList.add(roleUser);

        User admin = User.builder()
                .firstName("admin")
                .lastName("admin")
                .age(33)
                .email("admin@ad.min")
                .password("admin")
                .roles(adminRoleList)
                .build();

        User user = User.builder()
				.firstName("user")
				.lastName("user")
				.age(55)
				.email("user@us.er")
				.password("user")
				.roles(userRoleList)
				.build();

        userService.saveUser(admin);
        userService.saveUser(user);
    }
}