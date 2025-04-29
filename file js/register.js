document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.querySelector('.register-form form');

    // Hàm mã hóa mật khẩu đơn giản (chỉ cho mục đích minh họa!)
    function simpleHash(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const fullnameInput = document.getElementById('fullname');
        const dobInput = document.getElementById('dob');
        const phoneInput = document.getElementById('phone');
        const matkhauInput = document.getElementById('matkhau');
        const xacnhanMkInput = document.getElementById('xacnhanMk');

        const fullname = fullnameInput.value.trim();
        const dob = dobInput.value;
        const phone = phoneInput.value.trim();
        const matkhau = matkhauInput.value;
        const xacnhanMk = xacnhanMkInput.value;

        if (matkhau !== xacnhanMk) {
            alert('Mật khẩu và xác nhận mật khẩu không khớp.');
            return;
        }

        const storedUsers = localStorage.getItem('users');
        let usersArray = storedUsers ? JSON.parse(storedUsers) : [];
        const newId = usersArray.length > 0 ? usersArray[usersArray.length - 1].id + 1 : 1;

        const hashedMatkhau = simpleHash(matkhau);

        const newUser = {
            id: newId,
            fullname: fullname,
            dob: dob,
            phone: phone,
            matkhau: hashedMatkhau
        };

        usersArray.push(newUser);
        localStorage.setItem('users', JSON.stringify(usersArray));
        window.location.href = './login.html'
        registerForm.reset();
    });

    // Xử lý sự kiện click cho hình ảnh hiển thị/ẩn mật khẩu bằng vòng lặp
    const passwordFields = document.querySelectorAll('.form-group input[type="password"]');

    passwordFields.forEach(passwordInput => {
        const eyeOpenImg = passwordInput.nextElementSibling;
        const eyeClosedImg = eyeOpenImg.nextElementSibling;

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

        // Ẩn hình ảnh "hiển thị mật khẩu" ban đầu
        eyeOpenImg.style.display = 'none';
    });
});