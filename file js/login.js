// login.js
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form form');
    const passwordInput = document.getElementById('password');
    const passwordToggleIcons = document.querySelectorAll('.password-toggle-icon');

    if (passwordInput && passwordToggleIcons.length === 2) {
        const eyeClosedImg = passwordToggleIcons[0]; 
        const eyeOpenImg = passwordToggleIcons[1];   
        eyeOpenImg.style.display = 'none'; 
        eyeClosedImg.style.display = 'inline-block'; 
        eyeClosedImg.addEventListener('click', function() { 
            passwordInput.setAttribute('type', 'text');
            eyeClosedImg.style.display = 'none';
            eyeOpenImg.style.display = 'inline-block';
        });

        eyeOpenImg.addEventListener('click', function() { 
            passwordInput.setAttribute('type', 'password');
            eyeOpenImg.style.display = 'none';
            eyeClosedImg.style.display = 'inline-block';
        });
    } else {
        console.warn("Password input or toggle icons not found or not configured correctly.");
    }

    const isRemembered = localStorage.getItem('rememberLogin');
    const storedUsername = localStorage.getItem('username');

    if (isRemembered === 'true' && storedUsername) {
        const rememberCheckbox = document.getElementById('remember');
        const usernameInput = document.getElementById('username');
        if (rememberCheckbox) rememberCheckbox.checked = true;
        if (usernameInput) usernameInput.value = storedUsername;
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const usernameInput = document.getElementById('username');
            const username = usernameInput ? usernameInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value : '';

            if (!username || !password) {
                alert('Vui lòng nhập đầy đủ thông tin.');
                return;
            }

            const storedUsers = localStorage.getItem('users');
            const usersArray = storedUsers ? JSON.parse(storedUsers) : [];
            const user = usersArray.find(u => (u.phone === username || (u.fullname && u.fullname.toLowerCase() === username.toLowerCase())) && u.matkhau === simpleHash(password));

            if (user) {
                alert('Đăng nhập thành công! ID người dùng: ' + user.id);
                localStorage.setItem('loggedInUserId', user.id.toString());

                let userSpecificData = JSON.parse(localStorage.getItem('userSpecificData')) || {};
                if (!userSpecificData[user.id.toString()]) {
                    userSpecificData[user.id.toString()] = {
                        carAds: [],
                        savedPosts: [],
                        savedSearches: [],
                        myReviews: []
                    };
                }
                localStorage.setItem('userSpecificData', JSON.stringify(userSpecificData));

                const rememberCheckbox = document.getElementById('remember');
                if (rememberCheckbox && rememberCheckbox.checked) {
                    localStorage.setItem('rememberLogin', 'true');
                    localStorage.setItem('username', username);
                } else {
                    localStorage.removeItem('rememberLogin');
                    localStorage.removeItem('username');
                }
                window.location.href = './3.html';
            } else {
                alert('Số điện thoại/Email hoặc mật khẩu không đúng.');
            }
        });
    }


    function simpleHash(password) {
        let hash = 0;
        if (password.length === 0) return hash;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; 
        }
        return hash;
    }
});