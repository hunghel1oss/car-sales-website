async function toggleDropdown(dropdownId, fileToLoad) {
    const dropdownContainer = document.getElementById(dropdownId);

    if (!dropdownContainer.innerHTML) {
        try {
            const response = await fetch(fileToLoad);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            dropdownContainer.innerHTML = html;
            dropdownContainer.style.display = 'block';
        } catch (error) {
            console.error(`Không thể tải nội dung cho ${dropdownId}:`, error);
            dropdownContainer.innerHTML = `<p>Lỗi tải nội dung.</p>`;
            dropdownContainer.style.display = 'block';
        }
    } else {
        dropdownContainer.style.display = dropdownContainer.style.display === 'block' ? 'none' : 'block';
    }
}

// Đóng dropdown khi nhấp chuột ra ngoài
window.onclick = function(event) {
    // Đóng dropdown Danh Mục
    const categoryDropdown = document.getElementById('categoryDropdown');
    const directoryLink = document.querySelector('.directory3');
    if (!directoryLink.contains(event.target) && event.target !== categoryDropdown && !categoryDropdown.contains(event.target)) {
        categoryDropdown.style.display = 'none';
    }

    // Đóng dropdown Tài khoản
    const accountDropdownContainer = document.getElementById('accountDropdownContainer');
    const accountLink = document.querySelector('.account-3');
    if (!accountLink.contains(event.target) && event.target !== accountDropdownContainer && !accountDropdownContainer.contains(event.target)) {
        accountDropdownContainer.style.display = 'none';
    }
}