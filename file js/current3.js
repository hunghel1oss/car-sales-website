window.HuanHungCarshopApp = window.HuanHungCarshopApp || {};

window.HuanHungCarshopApp.getSavedCarsForCurrentUser = function() {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if (!loggedInUserId) return [];
    return JSON.parse(localStorage.getItem(`savedCars_${loggedInUserId}`)) || [];
};
window.HuanHungCarshopApp.isCarSaved = function(carId) {
    if (!carId) return false;
    const savedCars = window.HuanHungCarshopApp.getSavedCarsForCurrentUser();
    return savedCars.includes(carId);
};
window.HuanHungCarshopApp.toggleSaveCar = function(carId, heartIconElementOrButton, buttonTextElement = null) {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if (!loggedInUserId) { alert("Vui lòng đăng nhập để thực hiện thao tác này!"); return { success: false, isNowSaved: false }; }
    if (!carId) { console.error("toggleSaveCar được gọi với carId không hợp lệ."); return { success: false, isNowSaved: false }; }
    let savedCars = window.HuanHungCarshopApp.getSavedCarsForCurrentUser();
    const carIndex = savedCars.indexOf(carId);
    let isNowSaved = false;
    if (carIndex > -1) {
        savedCars.splice(carIndex, 1); isNowSaved = false;
        if (heartIconElementOrButton && heartIconElementOrButton.classList.contains('car-card-heart')) { heartIconElementOrButton.classList.remove('bxs-heart', 'saved'); heartIconElementOrButton.classList.add('bx-heart'); heartIconElementOrButton.title = "Lưu xe này"; }
        if (buttonTextElement && heartIconElementOrButton && heartIconElementOrButton.id === 'saveAdButton') { buttonTextElement.textContent = "Lưu tin"; const icon = heartIconElementOrButton.querySelector('i'); if (icon) { icon.classList.remove('bxs-heart'); icon.classList.add('bx-heart'); } heartIconElementOrButton.title = "Lưu tin này"; }
    } else {
        savedCars.push(carId); isNowSaved = true;
        if (heartIconElementOrButton && heartIconElementOrButton.classList.contains('car-card-heart')) { heartIconElementOrButton.classList.remove('bx-heart'); heartIconElementOrButton.classList.add('bxs-heart', 'saved'); heartIconElementOrButton.title = "Bỏ lưu xe này"; }
        if (buttonTextElement && heartIconElementOrButton && heartIconElementOrButton.id === 'saveAdButton') { buttonTextElement.textContent = "Bỏ lưu tin"; const icon = heartIconElementOrButton.querySelector('i'); if (icon) { icon.classList.remove('bx-heart'); icon.classList.add('bxs-heart'); } heartIconElementOrButton.title = "Bỏ lưu tin này"; }
    }
    localStorage.setItem(`savedCars_${loggedInUserId}`, JSON.stringify(savedCars));
    return { success: true, isNowSaved: isNowSaved };
};


const dropdownConfig = {
    'categoryDropdownContainer': {
        filePath: './directory.html',
        contentSelector: '.Danh-muc',
        loaded: false,
        element: null
    },
    'accountDropdownContainer': {
        filePath: './account.html',
        contentSelector: '.account', 
        loaded: false,
        element: null
    }
};

function initializeDOMElements() {
    for (const id in dropdownConfig) {
        dropdownConfig[id].element = document.getElementById(id);
        if (!dropdownConfig[id].element) {
        }
    }
}

async function fetchContent(filePath, contentSelector) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status} for ${filePath}`);
        const htmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        const contentElement = doc.querySelector(contentSelector);
        if (contentElement) return contentElement.outerHTML;
        console.error(`Content selector "${contentSelector}" not found in ${filePath}.`);
        return `<p class="dropdown-error">Error: Content not found.</p>`;
    } catch (error) {
        console.error(`Error fetching dropdown content from ${filePath}:`, error);
        return `<p class="dropdown-error">Error loading content. Check console.</p>`;
    }
}

function closeAllActiveDropdowns(excludeId = null) {
    for (const id in dropdownConfig) {
        if (id !== excludeId && dropdownConfig[id].element && dropdownConfig[id].element.classList.contains('active')) {
            dropdownConfig[id].element.classList.remove('active');
        }
    }
}
window.closeAllActiveDropdowns = closeAllActiveDropdowns; 

function updateAccountDropdown() {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    const accountDropdownContainer = dropdownConfig['accountDropdownContainer'].element;
    const accountLinkTextSpan = document.querySelector('.header-actions .account .action-text'); 

    if (!accountDropdownContainer) {
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    let currentUser = loggedInUserId ? users.find(u => u.id && u.id.toString() === loggedInUserId) : null;

    if (currentUser) {
        if (accountLinkTextSpan) accountLinkTextSpan.textContent = currentUser.fullname;
        const loggedInDropdownHTML = `
            <div class="account-dropdown-logged-in">
                <p class="greeting">Xin chào, ${currentUser.fullname}</p><hr>
                <div class="ND-account"><h3 class="Tk">Quản lý</h3>
                    <div class="ta"><img src="./flie ảnh/donban.svg" alt="ĐB" class="img-ta"><a href="#user-posted-cars" class="Tk nav-link-internal">Đơn bán của tôi</a></div>
                </div><hr>
                <div class="ND-account"><h3 class="Tk">Tiện ích</h3>
                    <div class="ta"><img src="./flie ảnh/tindaluu.svg" alt="TL" class="img-ta"><a href="#" class="Tk" id="savedAdsLink">Tin đã lưu</a></div>
                </div><hr>
                <div class="ND-account sell-car-link-container">
                    <a href="./salespage.html" class="Tk" id="sellCarBtnLoggedIn">Bán Xe Ngay</a>
                </div><hr>
                <div class="logout-container"><button id="logoutButton">Đăng xuất</button></div>
            </div>`;
        accountDropdownContainer.innerHTML = loggedInDropdownHTML;
        dropdownConfig['accountDropdownContainer'].loaded = true; 

        document.getElementById('logoutButton')?.addEventListener('click', () => {
            localStorage.removeItem('loggedInUserId');
            if (accountLinkTextSpan) accountLinkTextSpan.textContent = "Tài khoản";
            alert('Đã đăng xuất!');
            window.location.reload();
        });

        accountDropdownContainer.querySelector('a[href="#user-posted-cars"]')?.addEventListener('click', (e) => {
            e.preventDefault();
            const targetLink = document.querySelector('header .navbar a.nav-link[href="#user-posted-cars"]');
            if (typeof resetFilterView_3js === 'function') { 
                resetFilterView_3js(targetLink);
            }
            const userPostedCarsSection = document.getElementById('user-posted-cars');
            if (userPostedCarsSection) {
                 userPostedCarsSection.style.display = 'block';
                 userPostedCarsSection.scrollIntoView({ behavior: 'smooth' });
            }
            closeAllActiveDropdowns();
        });

        document.getElementById('savedAdsLink')?.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof window.displaySavedCarsFrom3JS === 'function') { 
                window.displaySavedCarsFrom3JS();
            } else { console.error("Function displaySavedCarsFrom3JS is not available."); }
            closeAllActiveDropdowns();
        });

    } else { 
        if (accountLinkTextSpan) accountLinkTextSpan.textContent = "Tài khoản";
        dropdownConfig['accountDropdownContainer'].loaded = false; 
    }
}

async function toggleDropdown(containerId, event) {
    if (event) { event.preventDefault(); event.stopPropagation(); }
    const config = dropdownConfig[containerId];
    if (!config || !config.element) {
        console.error(`toggleDropdown: Config or element not found for ${containerId}`);
        return;
    }

    const dropdownElement = config.element;
    const isActiveBeforeToggle = dropdownElement.classList.contains('active');

    if (!isActiveBeforeToggle) {
        closeAllActiveDropdowns(containerId);
    }

    if (isActiveBeforeToggle) {
        dropdownElement.classList.remove('active');
    } else {

        if (containerId === 'accountDropdownContainer') {
            updateAccountDropdown();
            if (!localStorage.getItem('loggedInUserId') && !config.loaded) {
                dropdownElement.innerHTML = `<p class="dropdown-loading">Đang tải...</p>`;
                const contentHTML = await fetchContent(config.filePath, config.contentSelector);
                dropdownElement.innerHTML = contentHTML;
                config.loaded = !contentHTML.includes("dropdown-error"); 
            }
        } else if (!config.loaded) { 
            dropdownElement.innerHTML = `<p class="dropdown-loading">Đang tải...</p>`;
            const contentHTML = await fetchContent(config.filePath, config.contentSelector);
            dropdownElement.innerHTML = contentHTML;
            config.loaded = !contentHTML.includes("dropdown-error");
        }

        const isLoggedInAccount = (containerId === 'accountDropdownContainer' && localStorage.getItem('loggedInUserId'));
        if (config.loaded || isLoggedInAccount) {
            dropdownElement.classList.add('active');
        } else {
        }
    }
}
window.toggleDropdown = toggleDropdown; 

document.addEventListener('DOMContentLoaded', () => {
    initializeDOMElements(); 
    updateAccountDropdown(); 

    const header = document.querySelector('header:not(.page-header-details)'); 
    const searchInputGlobal = document.getElementById('searchInputGlobal');
    const searchBoxGlobal = document.querySelector('header .search-box.container');
    const searchIconHeader = document.getElementById('search-icon');
    const mainNavbar = document.querySelector('header .navbar');
    const menuIcon = document.getElementById('menu-icon'); 

    if (header) {
        const handleScroll = () => {
            if (document.body.contains(header)) { 
                header.classList.toggle('shadow', window.scrollY > 0);
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll(); 
    }

    if (searchIconHeader && searchBoxGlobal) {
        searchIconHeader.addEventListener('click', (e) => {
            e.stopPropagation();
            searchBoxGlobal.classList.toggle('active');
            if (mainNavbar) mainNavbar.classList.remove('active'); 
            closeAllActiveDropdowns(); 
            if (searchBoxGlobal.classList.contains('active') && searchInputGlobal) {
                searchInputGlobal.focus();
            }
        });
    }

    if (menuIcon && mainNavbar) {
        menuIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            mainNavbar.classList.toggle('active');
            if (searchBoxGlobal) searchBoxGlobal.classList.remove('active'); 
            closeAllActiveDropdowns();
        });
    }

    window.addEventListener('click', (event) => {
        if (searchBoxGlobal && searchBoxGlobal.classList.contains('active') &&
            !searchBoxGlobal.contains(event.target) &&
            (!searchIconHeader || !searchIconHeader.contains(event.target))) {
            searchBoxGlobal.classList.remove('active');
        }
        if (mainNavbar && mainNavbar.classList.contains('active') &&
            !mainNavbar.contains(event.target) &&
            (!menuIcon || !menuIcon.contains(event.target))) {
            mainNavbar.classList.remove('active');
        }

        let clickedInsideActiveDropdown = false;
        document.querySelectorAll('.dropdown-content.active').forEach(dropdown => {
            if (dropdown.contains(event.target)) {
                clickedInsideActiveDropdown = true;
            }
        });
        let clickedOnDropdownTrigger = event.target.closest('a[onclick*="toggleDropdown"]');
        if (!clickedInsideActiveDropdown && !clickedOnDropdownTrigger) {
            closeAllActiveDropdowns();
        }
    });
    if (searchBoxGlobal) {
        searchBoxGlobal.addEventListener('click', e => e.stopPropagation());
    }

    document.querySelectorAll('header .navbar .nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const filterType = this.getAttribute('data-nav-filter');
            const hrefTarget = this.getAttribute('href');

            if (typeof setActiveNavLink_3js === 'function') { 
                 setActiveNavLink_3js(this);
            }

            if (filterType) { 
                e.preventDefault();
                if (typeof displayFilteredResults_3js === 'function') { 
                    displayFilteredResults_3js('condition', filterType, 'navbar');
                }
            } else if (hrefTarget === '#home') { 
                e.preventDefault();
                if (typeof resetFilterView_3js === 'function') { 
                    resetFilterView_3js(this);
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (hrefTarget && hrefTarget.startsWith('#')) { 
                const targetId = hrefTarget.substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection && targetSection.classList.contains('default-view-section')) {
                    e.preventDefault();
                    if (typeof resetFilterView_3js === 'function') { 
                         resetFilterView_3js(this);
                    }

                    setTimeout(()=> {
                       
                        if (targetSection.id !== 'user-posted-cars') { 
                            targetSection.style.display = targetSection.id === 'about' ? 'flex' : 'block';
                        }
                        targetSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    },0);
                }
            }
            if (mainNavbar?.classList.contains('active')) mainNavbar.classList.remove('active');
            closeAllActiveDropdowns();
        });
    });

    const categoryDropdownContainer_current3 = document.getElementById('categoryDropdownContainer');
    if (categoryDropdownContainer_current3) {
        categoryDropdownContainer_current3.addEventListener('click', function(event) {
            const targetLink = event.target.closest('a.seat-filter-link'); 
            if (targetLink) {
                event.preventDefault();
                const seatFilterValue = targetLink.getAttribute('data-seats');
                if (seatFilterValue && typeof displayFilteredResults_3js === 'function') { 
                    displayFilteredResults_3js('seats', seatFilterValue, 'category');
                     if (typeof setActiveNavLink_3js === 'function') setActiveNavLink_3js(null); 
                    closeAllActiveDropdowns();
                }
            }
        });
    }

    const homeSwiperEl = document.querySelector(".homeSwiper");
    if (typeof Swiper !== 'undefined' && homeSwiperEl) {
        new Swiper(".homeSwiper", {
            spaceBetween: 30, centeredSlides: true,
            autoplay: { delay: 4000, disableOnInteraction: false },
            pagination: { el: ".swiper-pagination", clickable: true },
            navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
            loop: true, effect: 'fade', fadeEffect: { crossFade: true },
        });
    }

    const currentYearSpan = document.getElementById('currentYear'); // Cho footer chính của 3.html
    if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();
    const currentYearDetailsSpan = document.getElementById('currentYearDetails'); // Cho footer của car-details.html
    if (currentYearDetailsSpan) currentYearDetailsSpan.textContent = new Date().getFullYear();

    console.log("current3.js (no cart logic, refined listeners) fully initialized.");
});