document.addEventListener('DOMContentLoaded', () => {

    // --- Header Interaction Elements ---
    const searchBox = document.querySelector('.search-box');
    const searchIcon = document.querySelector('#search-icon');
    const navbar = document.querySelector('.navbar');
    const menuIcon = document.querySelector('#menu-icon');
    const header = document.querySelector('header');

    // --- Dropdown Elements ---
    const directoryLink = document.querySelector('.directory-link');
    const accountLink = document.querySelector('.account-link');
    const categoryDropdown = document.getElementById('categoryDropdownContainer');
    const accountDropdown = document.getElementById('accountDropdownContainer');


    // --- Event Listeners ---

    // Search Box Toggle
    if (searchIcon && searchBox) {
        searchIcon.onclick = (e) => {
            e.stopPropagation();
            searchBox.classList.toggle('active');
            if (navbar) navbar.classList.remove('active');
            closeAllDropdowns();
        };
    } else { console.warn("Search icon or search box not found."); }

    // Mobile Menu Toggle
    if (menuIcon && navbar) {
        menuIcon.onclick = (e) => {
            e.stopPropagation();
            navbar.classList.toggle('active');
            if (searchBox) searchBox.classList.remove('active');
            closeAllDropdowns();
        };
    } else { console.warn("Menu icon or navbar not found."); }

    // Header Shadow on Scroll
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('shadow', window.scrollY > 0);
            // Close interactive elements on scroll
            if (navbar) navbar.classList.remove('active');
            if (searchBox) searchBox.classList.remove('active');
            closeAllDropdowns();
        });
    } else { console.warn("Header element not found."); }

    // Dropdown Toggles
    if (directoryLink && categoryDropdown) {
        directoryLink.addEventListener('click', (e) => {
            e.stopPropagation();
            const fileToLoad = 'category-content.html'; // Hardcode or extract if needed
            toggleDropdown(categoryDropdown.id, fileToLoad);
        });
    }
     if (accountLink && accountDropdown) {
        accountLink.addEventListener('click', (e) => {
            e.stopPropagation();
            const fileToLoad = 'account-content.html'; // Hardcode or extract if needed
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
        let clickedInsideDropdown = document.querySelectorAll('.dropdown-content').forEach(dropdown => { if(dropdown.contains(event.target)) return true; });
        let clickedOnToggleLink = (directoryLink && directoryLink.contains(event.target)) || (accountLink && accountLink.contains(event.target));
        if (!clickedOnToggleLink && !clickedInsideDropdown) {
            closeAllDropdowns();
        }
    });

    // Prevent clicks inside dropdowns/search box from closing them immediately
    if (searchBox) searchBox.addEventListener('click', e => e.stopPropagation());
    document.querySelectorAll('.dropdown-content').forEach(dropdown => dropdown.addEventListener('click', e => e.stopPropagation()));


    // --- Swiper Slider Initialization ---
    const homeSwiper = new Swiper(".homeSwiper", {
        slidesPerView: 1,       // Show one slide at a time
        spaceBetween: 30,       // Optional space between slides (if slidesPerView > 1)
        loop: true,             // Enable continuous loop
        autoplay: {             // Enable autoplay
          delay: 4000,          // Delay between slides in ms
          disableOnInteraction: false, // Don't stop autoplay on user interaction
        },
        pagination: {
          el: ".swiper-pagination", // Selector for pagination bullets
          clickable: true,         // Allow clicking on bullets
        },
        navigation: {
          nextEl: ".swiper-button-next", // Selector for next button
          prevEl: ".swiper-button-prev", // Selector for previous button
        },
        // Optional: Add effects like fade
        // effect: "fade",
        // fadeEffect: {
        //   crossFade: true
        // },
      });


    // --- Helper Functions ---
    function closeAllDropdowns(excludeId = null) {
        document.querySelectorAll('.dropdown-content').forEach(dropdown => {
            if (dropdown.id !== excludeId && dropdown.style.display === 'block') {
                dropdown.style.display = 'none';
            }
        });
    }

    async function toggleDropdown(dropdownId, fileToLoad) {
        const dropdownContainer = document.getElementById(dropdownId);
        if (!dropdownContainer) return;

        closeAllDropdowns(dropdownId);
        if (searchBox) searchBox.classList.remove('active');
        if (navbar) navbar.classList.remove('active');

        const isCurrentlyVisible = dropdownContainer.style.display === 'block';

        if (!isCurrentlyVisible) {
            if (!dropdownContainer.dataset.loaded) {
                console.log(`Fetching content for ${dropdownId} from ${fileToLoad}...`);
                try {
                    const response = await fetch(fileToLoad);
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    const html = await response.text();
                    dropdownContainer.innerHTML = html;
                    dropdownContainer.dataset.loaded = 'true';
                    dropdownContainer.style.display = 'block';
                    console.log(`Content loaded and shown for ${dropdownId}.`);
                } catch (error) {
                    console.error(`Could not load content for ${dropdownId}:`, error);
                    dropdownContainer.innerHTML = `<p style="color: red; padding: 5px;">Error loading content.</p>`;
                    dropdownContainer.dataset.loaded = 'error';
                    dropdownContainer.style.display = 'block';
                }
            } else if (dropdownContainer.dataset.loaded !== 'error') {
                 dropdownContainer.style.display = 'block';
                 console.log(`Showing existing content for ${dropdownId}.`);
            } else {
                dropdownContainer.style.display = 'block'; // Keep showing error
            }
        } else {
            dropdownContainer.style.display = 'none';
            console.log(`Hiding content for ${dropdownId}.`);
        }
    }

     console.log("Combined script loaded and initialized.");

}); // End DOMContentLoaded