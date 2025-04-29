document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form form');
    const passwordInput = document.getElementById('password');

    const eyeOpenImg = passwordInput.nextElementSibling;
    const eyeClosedImg = eyeOpenImg.nextElementSibling;
    eyeOpenImg.style.display = 'none';
    eyeOpenImg.addEventListener('click', function() {
        passwordInput.setAttribute('type', 'text');
        eyeOpenImg.style.display = 'none';
        eyeClosedImg.style.display = 'inline';
    });
    eyeClosedImg.addEventListener('click', function() {
        passwordInput.setAttribute('type', 'password');
        eyeOpenImg.style.display = 'inline';
        eyeClosedImg.style.display = 'none';
    });
    const isRemembered = localStorage.getItem('rememberLogin');
    const storedUsername = localStorage.getItem('username');

    if (isRemembered === 'true' && storedUsername) {
        document.getElementById('remember').checked = true;
        document.getElementById('username').value = storedUsername;
    }

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = passwordInput.value;
        const storedUsers = localStorage.getItem('users');
        const usersArray = storedUsers ? JSON.parse(storedUsers) : [];
        const user = usersArray.find(user => (user.phone === username || user.fullname.toLowerCase() === username.toLowerCase()) && user.matkhau === simpleHash(password)); // Sử dụng hàm băm tương tự như trang đăng ký

        if (user) {
            alert('Đăng nhập thành công!');
            const rememberCheckbox = document.getElementById('remember');
            if (rememberCheckbox.checked) {
                localStorage.setItem('rememberLogin', 'true');
                localStorage.setItem('username', username);
            } else {
                localStorage.removeItem('rememberLogin');
                localStorage.removeItem('username');
            }
            window.location.href = './current3.html';
        } else {
            alert('Số điện thoại/Email hoặc mật khẩu không đúng.');
        }
    });
    function simpleHash(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; 
        }
        return hash;
    }
});