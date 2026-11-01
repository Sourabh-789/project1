document.addEventListener('DOMContentLoaded', () => {
    function simulateAjax(callback) {
        setTimeout(callback, 200);
    }

    function getUsers() {
        try {
            return JSON.parse(localStorage.getItem('users')) || [];
        } catch (error) {
            return [];
        }
    }

    function saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    const regForm = document.getElementById('regForm');
    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('regName').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const password = document.getElementById('regPassword').value.trim();

            if (!name || !email || !password) {
                alert('Please fill in all fields.');
                return;
            }

            simulateAjax(() => {
                const users = getUsers();
                const existingUser = users.find((user) => user.email.toLowerCase() === email.toLowerCase());

                if (existingUser) {
                    alert('An account with this email already exists. Please login instead.');
                    return;
                }

                const userData = {
                    name,
                    email,
                    password,
                    joinedAt: new Date().toISOString()
                };

                users.push(userData);
                saveUsers(users);

                localStorage.setItem('name', name);
                localStorage.setItem('email', email);
                localStorage.setItem('currentUser', email);

                alert('Registration Successful');
                window.location.href = 'login.html';
            });
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();

            if (!email || !password) {
                alert('Please enter both email and password.');
                return;
            }

            simulateAjax(() => {
                const users = getUsers();
                const user = users.find(
                    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
                );

                if (user) {
                    localStorage.setItem('name', user.name);
                    localStorage.setItem('email', user.email);
                    localStorage.setItem('currentUser', user.email);
                    alert('Login Successful');
                    window.location.href = 'profile.html';
                } else {
                    alert('Invalid Email or Password. Please try again.');
                }
            });
        });
    }

    const profileName = document.getElementById('profileName');
    if (profileName) {
        const name = localStorage.getItem('name');
        const email = localStorage.getItem('email');
        const currentUser = localStorage.getItem('currentUser');

        if (name && email && currentUser) {
            const users = getUsers();
            const activeUser = users.find((user) => user.email.toLowerCase() === currentUser.toLowerCase());

            profileName.textContent = activeUser ? activeUser.name : name;
            document.getElementById('profileEmail').textContent = activeUser ? activeUser.email : email;
            document.getElementById('profileAvatar').textContent = (activeUser ? activeUser.name : name).charAt(0).toUpperCase();

            const joinedAt = activeUser && activeUser.joinedAt ? new Date(activeUser.joinedAt) : new Date();
            const joinDate = joinedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            document.getElementById('joinDate').textContent = joinDate;
        } else {
            window.location.href = 'login.html';
        }

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('name');
                localStorage.removeItem('email');
                localStorage.removeItem('currentUser');
                window.location.href = 'login.html';
            });
        }
    }
});

