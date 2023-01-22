const adminUrl = '/api/admins/';
const userUrl = '/api/users/';

let navbar = $('#navbar');                          // Шапка сайта, с емайл и ролью + кнопка логаут.
let userTable = $('#user-tbody');                   // Тело таблицы с информацией о пользователе. Исп. для роли USER.
let allUsersTable = $('#users-tbody');              // Тело таблицы с информацией обо всех пользователях. Исп. для роли ADMIN.
let formEdit = document.forms['editForm'];          // Форма в модальном окне EDIT
let formDelete = document.forms['deleteForm'];      // Форма в модальном окне DELETE
let formNew = document.forms['formNewUser'];        // Форма добавления нового пользователя

function getRoles(user) {
    let roles = [];

    for (let role of user.roles) {
        roles.push(" " + role.name.toString().replaceAll('ROLE_', ''))
    }

    return roles;
}

// Функция для показа шапки приложения.
function showNavbar() {
    navbar.empty();
    fetch(userUrl)
        .then(response => response.json())
        .then(data => {
            let nav = `<div class="collapse navbar-collapse d-flex">
                            <div class="roles p-2 flex-grow-1">
                                <strong>${data.username}</strong>
                                    with roles:
                                <span>${getRoles(data)}</span>
                            </div>
                            <div class="">
                                <form class="form-inline my-2 my-lg-0" action="/logout" method="post">
                                    <button class="btn btn-link btn-logout" type="submit">Logout</button>
                                </form>
                            </div>
                        </div>`;

            navbar.append(nav);
        });
}

// Выводим тело таблицы с информацией о конкретном пользователе. Для роли USER
function showUserTable() {
    userTable.empty();
    fetch(userUrl)
        .then(response => response.json())
        .then(data => {
            let userTableBody = `<tr>
                                    <td>${data.id}</td>
                                    <td>${data.firstName}</td>
                                    <td>${data.lastName}</td>
                                    <td>${data.age}</td>
                                    <td>${data.email}</td>
                                    <td>${getRoles(data)}</td>
                                 </tr>`;

            userTable.append(userTableBody);
        });
}

// Выводим тело таблицы с информацией обо всех пользователях. Исп. для роли ADMIN.
function showAllUsers() {
    allUsersTable.empty();
    fetch(adminUrl)
        .then(response => response.json())
        .then(data => {
            data.forEach(user => {
                let allUsersTableBody = `<tr>
                                            <td>${user.id}</td>
                                            <td>${user.firstName}</td>
                                            <td>${user.lastName}</td>
                                            <td>${user.age}</td>
                                            <td>${user.email}</td>
                                            <td>${getRoles(user)}</td>
                                            <td>
                                                <!-- Кнопка-триггер модального окна EDIT-->
                                                <button type="button" class="btn btn-info" data-toggle="modal"
                                                    data-target="#editModal" onclick="editModal(${user.id})">Edit</button>
                                            </td>
                                            <td>
                                                <!-- Кнопка-триггер модального окна DELETE-->
                                                <button type="button" class="btn btn-danger" data-toggle="modal" 
                                                    data-target="#deleteModal" onclick="deleteModal(${user.id})">Delete</button>
                                            </td>
                                        </tr>`;

                allUsersTable.append(allUsersTableBody);
            })
        });
}

// Вызов модального окна EDIT при клике на кнопку
async function editModal(id) {
    $('#editModal').modal('show');

    let editableUser = await (await fetch(adminUrl + id)).json();

    formEdit.id.value = editableUser.id;
    formEdit.firstName.value = editableUser.firstName;
    formEdit.lastName.value = editableUser.lastName;
    formEdit.age.value = editableUser.age;
    formEdit.email.value = editableUser.email;
}

// Вызов модального окна DELETE при клике на кнопку
async function deleteModal(id) {
    $('#deleteModal').modal('show');

    let removableUser = await (await fetch(adminUrl + id)).json();

    formDelete.id.value = removableUser.id;
    formDelete.firstName.value = removableUser.firstName;
    formDelete.lastName.value = removableUser.lastName;
    formDelete.age.value = removableUser.age;
    formDelete.email.value = removableUser.email;
}

// Редактирование конкретного пользователя в модальном окне "Edit user". Исп. для роли ADMIN.
function editUser() {
    formEdit.addEventListener('submit', event => {
        event.preventDefault();

        let editRoles = [];

        for (let i = 0; i < formEdit.roles.options.length; i++) {
            if (formEdit.roles.options[i].selected) editRoles.push({
                id: formEdit.roles.options[i].value, name: "ROLE_" + formEdit.roles.options[i].text
            });
        }

        fetch(adminUrl + formEdit.id.value, {
            method: 'PATCH', headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                id: formEdit.id.value,
                firstName: formEdit.firstName.value,
                lastName: formEdit.lastName.value,
                age: formEdit.age.value,
                email: formEdit.email.value,
                password: formEdit.password.value,
                roles: editRoles
            })
        }).then(() => {
            $('#editFormCloseBtn').click();
            showAllUsers();
        });
    });
}

// Удаление конкретного пользователя в модальном окне "Delete user". Исп. для роли ADMIN.
function deleteUser() {
    formDelete.addEventListener('submit', event => {
        event.preventDefault();
        fetch(adminUrl + formDelete.id.value, {
            method: 'DELETE', headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => {
            $('#deleteFormCloseBtn').click();
            showAllUsers();
        });
    });
}

// Добавление нового пользователя во вкладке "New User". Исп. для роли ADMIN.
function addNewUser() {
    formNew.addEventListener('submit', e => {
        e.preventDefault();

        let newUserRoles = [];

        for (let i = 0; i < formNew.roles.options.length; i++) {
            if (formNew.roles.options[i].selected) newUserRoles.push({
                id: formNew.roles.options[i].value, name: "ROLE_" + formNew.roles.options[i].text
            });
        }

        fetch(adminUrl, {
            method: 'POST', headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                id: formNew.id.value,
                firstName: formNew.firstName.value,
                lastName: formNew.lastName.value,
                age: formNew.age.value,
                email: formNew.email.value,
                password: formNew.password.value,
                roles: newUserRoles
            })
        }).then(() => {
            formNew.reset();
            showAllUsers();
            $('#users-tab').click();
        });
    });
}

showNavbar();
showUserTable();
showAllUsers();
editUser();
deleteUser();
addNewUser();