document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const logoutButton = document.getElementById('logoutButton');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const profileForm = document.getElementById('profileForm');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const todoForm = document.getElementById('todoForm');
    const todoList = document.getElementById('todoList');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(user => user.email === email && user.password === password);

            if (user) {
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                window.location.href = 'dashboard.html';
            } else {
                alert('Invalid email or password');
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.some(user => user.email === email)) {
                alert('Email already exists');
                return;
            }
            users.push({ username, email, password });
            localStorage.setItem('users', JSON.stringify(users));

            alert('Sign up successful');
            window.location.href = 'login.html';
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('loggedInUser');
            window.location.href = 'login.html';
        });
    }

    if (welcomeMessage) {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (loggedInUser) {
            welcomeMessage.textContent = `Welcome, ${loggedInUser.username}!`;
        } else {
            window.location.href = 'login.html';
        }
    }

    if (profileForm) {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (loggedInUser) {
            document.getElementById('profileUsername').value = loggedInUser.username;
            document.getElementById('profileEmail').value = loggedInUser.email;

            profileForm.addEventListener('submit', function(event) {
                event.preventDefault();
                loggedInUser.username = document.getElementById('profileUsername').value;
                loggedInUser.email = document.getElementById('profileEmail').value;

                const users = JSON.parse(localStorage.getItem('users'));
                const userIndex = users.findIndex(user => user.email === loggedInUser.email);
                users[userIndex] = loggedInUser;
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

                alert('Profile updated successfully');
            });

            changePasswordForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const oldPassword = document.getElementById('oldPassword').value;
                const newPassword = document.getElementById('newPassword').value;

                if (oldPassword !== loggedInUser.password) {
                    alert('Old password is incorrect');
                    return;
                }

                loggedInUser.password = newPassword;

                const users = JSON.parse(localStorage.getItem('users'));
                const userIndex = users.findIndex(user => user.email === loggedInUser.email);
                users[userIndex].password = newPassword;
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

                alert('Password changed successfully');
            });
        } else {
            window.location.href = 'login.html';
        }
    }

    if (todoForm) {
        todoForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const task = document.getElementById('todoInput').value;
            const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

            if (!loggedInUser.todos) {
                loggedInUser.todos = [];
            }

            loggedInUser.todos.push(task);
            localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

            const users = JSON.parse(localStorage.getItem('users'));
            const userIndex = users.findIndex(user => user.email === loggedInUser.email);
            users[userIndex] = loggedInUser;
            localStorage.setItem('users', JSON.stringify(users));

            document.getElementById('todoInput').value = '';
            renderTodoList(loggedInUser.todos);
        });

        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (loggedInUser && loggedInUser.todos) {
            renderTodoList(loggedInUser.todos);
        }
    }

    function renderTodoList(todos) {
        todoList.innerHTML = '';
        todos.forEach((task, index) => {
            const li = document.createElement('li');
            li.textContent = task;
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function() {
                todos.splice(index, 1);
                localStorage.setItem('loggedInUser', JSON.stringify(JSON.parse(localStorage.getItem('loggedInUser'))));
                const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
                loggedInUser.todos = todos;
                const users = JSON.parse(localStorage.getItem('users'));
                const userIndex = users.findIndex(user => user.email === loggedInUser.email);
                users[userIndex] = loggedInUser;
                localStorage.setItem('users', JSON.stringify(users));
                renderTodoList(todos);
            });
            li.appendChild(deleteButton);
            todoList.appendChild(li);
        });
    }
});
