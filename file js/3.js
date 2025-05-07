document.addEventListener('DOMContentLoaded', () => {

    // --- Header Interaction Elements ---
    const searchBox = document.querySelector('.search-box');
    const searchIcon = document.querySelector('#search-icon');
    const navbar = document.querySelector('.navbar');
    const menuIcon = document.querySelector('#menu-icon');
    const header = document.querySelector('header');

    // --- Dropdown Elements ---
    // const directoryLink = document.querySelector('.directory-link'); // <<< COMMENT OUT HOẶC XÓA
    // const accountLink = document.querySelector('.account-link');     // <<< COMMENT OUT HOẶC XÓA
    // const categoryDropdown = document.getElementById('categoryDropdownContainer'); // Để lại nếu dùng cho closeAllDropdowns
    // const accountDropdown = document.getElementById('accountDropdownContainer');   // Để lại nếu dùng cho closeAllDropdowns


    // --- Event Listeners ---

    // Search Box Toggle
    if (searchIcon && searchBox) {
        searchIcon.onclick = (e) => {
            e.stopPropagation();
            searchBox.classList.toggle('active');
            if (navbar) navbar.classList.remove('active');
            // closeAllDropdowns(); 
        };
    } else { console.warn("Search icon or search box not found."); }

    // Mobile Menu Toggle
    if (menuIcon && navbar) {
        menuIcon.onclick = (e) => {
            e.stopPropagation();
            navbar.classList.toggle('active');
            if (searchBox) searchBox.classList.remove('active');
            // closeAllDropdowns(); 
        };
    } else { console.warn("Menu icon or navbar not found."); }

    // Header Shadow on Scroll
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('shadow', window.scrollY > 0);
            if (navbar) navbar.classList.remove('active');
            if (searchBox) searchBox.classList.remove('active');
            // closeAllDropdowns(); 
        });
    } else { console.warn("Header element not found."); }

    // Dropdown Toggles
    
    if (directoryLink && categoryDropdown) {
        directoryLink.addEventListener('click', (e) => {
            e.stopPropagation();
            const fileToLoad = 'category-content.html';
            toggleDropdown(categoryDropdown.id, fileToLoad);
        });
    }
     if (accountLink && accountDropdown) {
        accountLink.addEventListener('click', (e) => {
            e.stopPropagation();
            const fileToLoad = 'account-content.html';
            toggleDropdown(accountDropdown.id, fileToLoad);
        });
    }
    

    // Close elements when clicking outside
    window.addEventListener('click', (event) => {
        if (searchBox && !searchBox.contains(event.target) && searchIcon && !searchIcon.contains(event.target)) {
             searchBox.classList.remove('active');
        }
        if (navbar && !navbar.contains(event.target) && menuIcon && !menuIcon.contains(event.target)) {
            navbar.classList.remove('active');
        }
        // let clickedInsideDropdown = false;
        // document.querySelectorAll('.dropdown-content.active').forEach(dropdown => { // Chỉ kiểm tra dropdown đang active
        //     if(dropdown.contains(event.target)) clickedInsideDropdown = true;
        // });
        // // const categoryTrigger = document.querySelector('.directory-link');
        // // const accountTrigger = document.querySelector('.account-link');
        // // let clickedOnToggleLink = (categoryTrigger && categoryTrigger.contains(event.target)) || (accountTrigger && accountTrigger.contains(event.target));

        // // if (!clickedOnToggleLink && !clickedInsideDropdown) {
        // //     closeAllDropdowns();
        // // }
    });

    // Prevent clicks inside dropdowns/search box from closing them immediately
    if (searchBox) searchBox.addEventListener('click', e => e.stopPropagation());
    // document.querySelectorAll('.dropdown-content').forEach(dropdown => dropdown.addEventListener('click', e => e.stopPropagation())); // current3.js sẽ xử lý

    // --- Swiper Slider Initialization --- (Giữ nguyên)
    const homeSwiper = new Swiper(".homeSwiper", {
        // ... (config swiper giữ nguyên) ...
    });

    // --- Helper Functions ---
    /* <<< COMMENT OUT HOẶC XÓA TOÀN BỘ HÀM closeAllDropdowns VÀ toggleDropdown TRONG 3.js >>>
    function closeAllDropdowns(excludeId = null) {
        // ...
    }

    async function toggleDropdown(dropdownId, fileToLoad) {
        // ...
    }
    */

     console.log("3.js script loaded and initialized (dropdown logic moved to current3.js)."); // Thay đổi log

}); // End DOMContentLoaded