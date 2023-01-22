package ru.kata.spring.boot_security.demo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.exceptions.UserNotFoundException;
import ru.kata.spring.boot_security.demo.exceptions.UserExistException;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.RoleDao;
import ru.kata.spring.boot_security.demo.repository.UserDao;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

    public static final Logger LOG = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserDao userDao;
    private final RoleDao roleDao;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserDao userDao, RoleDao roleDao, PasswordEncoder passwordEncoder) {
        this.userDao = userDao;
        this.roleDao = roleDao;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void saveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        try {
            LOG.info("Saving user, email: {}", user.getEmail());
            userDao.saveUser(user);
        } catch (Exception ex) {
            LOG.error("Error during saving user. {}", ex.getMessage());
            throw new UserExistException("The user, email: " + user.getEmail() + " already exist.");
        }
    }

    @Override
    public User getUserById(long id) {
        return userDao.getUserById(id);
    }

    @Override
    public List<User> getAllUsers() {
        return userDao.getAllUsers();
    }

    @Override
    @Transactional
    public void updateUser(User user, Long id) {
        User userUpdate = getUserById(id);
        if (userUpdate != null) {
            userUpdate.setFirstName(user.getFirstName());
            userUpdate.setLastName(user.getLastName());
            userUpdate.setAge(user.getAge());
            userUpdate.setEmail(user.getEmail());
            userUpdate.setPassword(passwordEncoder.encode(user.getPassword()));
            userUpdate.setRoles(user.getRoles());
        } else {
            throw new UserNotFoundException("The user not updated, because not found.");
        }

        LOG.info("Updating user id: {}, email: {}", id, userUpdate.getEmail());
        userDao.updateUser(userUpdate);
    }

    @Override
    @Transactional
    public void removeUserById(long id) {
        try {
            LOG.info("Deleting user id: {}, email: {}", id, getUserById(id).getEmail());
            userDao.removeUserById(id);
        } catch (Exception ex) {
            LOG.error("Error during removal user. {}", ex.getMessage());
            throw new UserNotFoundException("The user not deleted, because not found.");
        }
    }

    @Override
    public User findByEmail(String email) {
        return userDao.findByEmail(email);
    }

    @Override
    @Transactional
    public boolean addRole(Role role) {
        Role role1 = roleDao.findRoleByName(role.getName());
        if (role1 != null) {
            return false;
        }
        roleDao.saveRole(role);
        return true;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userDao.findByEmail(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), user.getAuthorities());
    }
}