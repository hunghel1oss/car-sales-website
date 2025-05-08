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
            console.error(`Dropdown container with ID '${id}' not found.`);
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

function updateAccountDropdown() {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    const accountDropdownContainer = dropdownConfig['accountDropdownContainer'].element;
    const accountLinkTextSpan = document.querySelector('.account-link span.action-text');

    if (!accountDropdownContainer) {
        console.error("Account dropdown container (#accountDropdownContainer) not found.");
        return;
    }
    if (!accountLinkTextSpan) {
        console.warn("Account link text span (.account-link span.action-text) not found.");
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    let currentUser = loggedInUserId ? users.find(u => u.id && u.id.toString() === loggedInUserId) : null;

    if (currentUser) { 
        if (accountLinkTextSpan) accountLinkTextSpan.textContent = currentUser.fullname;
        const loggedInDropdownHTML = `
            <div class="account-dropdown-logged-in">
                <p class="greeting">Xin chào, ${currentUser.fullname}</p><hr>
                <div class="ND-account"><h3 class="Tk">Quản lý</h3>
                    <div class="ta"><img src="./flie ảnh/shopping-cart.svg" alt="GH" class="img-ta"><a href="#" class="Tk">Giỏ hàng</a></div>
                    <div class="ta"><img src="./flie ảnh/donban.svg" alt="ĐB" class="img-ta"><a href="#user-posted-cars" class="Tk nav-link-internal">Đơn bán của tôi</a></div>
                </div><hr>
                <div class="ND-account"><h3 class="Tk">Tiện ích</h3>
                    <div class="ta"><img src="./flie ảnh/tindaluu.svg" alt="TL" class="img-ta"><a href="#" class="Tk">Tin đã lưu</a></div>
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
            const targetLink = document.querySelector(`.navbar a.nav-link[href="#user-posted-cars"]`);
            resetToDefaultView(targetLink);
            document.getElementById('user-posted-cars')?.scrollIntoView({ behavior: 'smooth' });
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
    if (!config || !config.element) return;
    const dropdownElement = config.element;
    const isActiveBeforeToggle = dropdownElement.classList.contains('active');
    if (!isActiveBeforeToggle) closeAllActiveDropdowns(containerId);

    if (isActiveBeforeToggle) {
        dropdownElement.classList.remove('active');
    } else {
        if (containerId === 'accountDropdownContainer') {
            updateAccountDropdown(); 
            if (!config.loaded) { 
                dropdownElement.innerHTML = `<p class="dropdown-loading">Loading...</p>`;
                const contentHTML = await fetchContent(config.filePath, config.contentSelector);
                dropdownElement.innerHTML = contentHTML;
                config.loaded = !contentHTML.includes("dropdown-error");
            }
        } else if (!config.loaded) {
            dropdownElement.innerHTML = `<p class="dropdown-loading">Loading...</p>`;
            const contentHTML = await fetchContent(config.filePath, config.contentSelector);
            dropdownElement.innerHTML = contentHTML;
            config.loaded = !contentHTML.includes("dropdown-error");
        }
        if(config.loaded || containerId === 'accountDropdownContainer'){
             dropdownElement.classList.add('active');
        }
    }
}

function renderCarCardGlobal(car, cardType = 'general') {
    const carBox = document.createElement('div');
    carBox.classList.add('box');
    carBox.setAttribute('data-car-id', car.ID);
    carBox.setAttribute('data-user-id', car.userId || 'unknown');
    const styleType = (cardType === 'old-onload' || cardType === 'filtered-used') ? 'old' : 'new';
    carBox.setAttribute('data-style-type', styleType);
    const firstImage = (car.imagesBase64 && car.imagesBase64.length > 0) ? car.imagesBase64[0] : './img/car-placeholder.png';

    let imageAndPriceHTML = `<img src="${firstImage}" alt="${car.brand || ''} ${car.model || ''}">`;
    if (styleType === 'new') {
        imageAndPriceHTML += `<p class="car-card-price">${car.price ? car.price.toLocaleString('vi-VN') + ' VNĐ' : 'Liên hệ'}</p>`;
    }

    let textContentHTML = `<div class="card-text-content">`;
    if (styleType === 'new') {
        textContentHTML += `
            <h2>${car.brand || 'N/A'} ${car.model || ''}</h2>
            ${car.year ? `<p class="car-card-year">Năm: ${car.year}</p>` : ''}
            <p class="car-seller-info">Người đăng: ${car.sellerName || 'N/A'}</p>`;
    } else { 
        textContentHTML += `
            <h3>${car.brand || 'N/A'} ${car.model || ''}</h3>
            ${car.price ? `<span class="car-price-old">${car.price.toLocaleString('vi-VN')} VNĐ</span>` : '<span class="car-price-old">Liên hệ</span>'}
            ${car.year ? `<p class="car-year-old">Năm: ${car.year}</p>` : ''}
            ${car.mileage ? `<p class="car-mileage-old">Đã chạy: ${car.mileage.toLocaleString('vi-VN')} km</p>` : ''}`;
    }
    textContentHTML += `</div>`; 

    let footerHTML = '';
    if (styleType === 'old') {
        footerHTML = `<div class="box-footer-details"><a href="#" class="details-btn">Xem Chi Tiết</a></div>`;
    }
    carBox.innerHTML = imageAndPriceHTML + textContentHTML + footerHTML;

    carBox.addEventListener('click', function(e) {
        if (!e.target.classList.contains('details-btn')) {
            localStorage.setItem('selectedCarIdToView', this.getAttribute('data-car-id'));
            localStorage.setItem('selectedCarOwnerIdToView', this.getAttribute('data-user-id'));
            window.location.href = './car-details.html';
        }
    });
    const detailsBtn = carBox.querySelector('.details-btn');
    if (detailsBtn) {
         detailsBtn.addEventListener('click', (e) => {
             e.preventDefault(); e.stopPropagation();
             localStorage.setItem('selectedCarIdToView', carBox.getAttribute('data-car-id'));
             localStorage.setItem('selectedCarOwnerIdToView', carBox.getAttribute('data-user-id'));
             window.location.href = './car-details.html';
         });
     }
    return carBox;
}

function displayUserCarAds() {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    const container = document.querySelector('#user-posted-cars .user-cars-container');
    const sectionElement = document.getElementById('user-posted-cars');
    if (!container || !sectionElement) return;
    container.innerHTML = '';
    if (!loggedInUserId) {
        container.innerHTML = `<p class="no-cars-message">Vui lòng <a href="login.html" class="text-link">đăng nhập</a> để xem xe của bạn.</p>`;
        sectionElement.style.display = 'none'; return;
    }
    sectionElement.style.display = 'block';
    const userData = JSON.parse(localStorage.getItem('userSpecificData'))?.[loggedInUserId];
    if (userData?.carAds?.length > 0) {
        userData.carAds.forEach(car => container.appendChild(renderCarCardGlobal(car, 'user-posted')));
    } else {
        container.innerHTML = `<p class="no-cars-message">Bạn chưa đăng xe nào. <a href="salespage.html" class="text-link">Đăng ngay!</a></p>`;
    }
}

function loadInitialCarsIntoSections() {
    const newCarsContainer = document.querySelector('#new-cars-on-load .new-cars-onload-container');
    const oldCarsContainer = document.querySelector('#old-cars-on-load .old-cars-onload-container');
    const userSpecificData = JSON.parse(localStorage.getItem('userSpecificData')) || {};
    let allCars = [];
    for (const userId in userSpecificData) { if (userSpecificData[userId]?.carAds) { userSpecificData[userId].carAds.forEach(carAd => allCars.push({ ...carAd, userId })); } }

    if (newCarsContainer) {
        newCarsContainer.innerHTML = '';
        const newCarsData = allCars.filter(car => car.condition === 'new');
        if (newCarsData.length > 0) newCarsData.forEach(car => newCarsContainer.appendChild(renderCarCardGlobal(car, 'new-onload')));
        else newCarsContainer.innerHTML = `<p class="no-cars-message">Hiện chưa có xe mới nào được đăng.</p>`;
    }
    if (oldCarsContainer) {
        oldCarsContainer.innerHTML = '';
        const oldCarsData = allCars.filter(car => car.condition === 'used');
        if (oldCarsData.length > 0) oldCarsData.forEach(car => oldCarsContainer.appendChild(renderCarCardGlobal(car, 'old-onload')));
        else oldCarsContainer.innerHTML = `<p class="no-cars-message">Hiện chưa có xe cũ nào được đăng.</p>`;
    }
}
function displayCarsInCentralArea(carsToDisplay, type, filterDescription = "") {
    const displaySection = document.getElementById('filtered-cars-display');
    const displayContainer = document.querySelector('#filtered-cars-display .cars-display-container');
    const categorySpan = document.getElementById('filtered-cars-category');
    const titleH2 = document.getElementById('filtered-cars-title');
    if (!displaySection || !displayContainer || !categorySpan || !titleH2) return;

    displayContainer.innerHTML = '';
    document.querySelectorAll('.default-view-section').forEach(sec => sec.style.display = 'none');

    if (type === 'search') { categorySpan.textContent = "Kết quả tìm kiếm cho"; titleH2.textContent = `"${filterDescription}"`; }
    else if (type === 'new') { categorySpan.textContent = "Xe Mới (Lọc)"; titleH2.textContent = "Danh sách xe mới"; }
    else if (type === 'used') { categorySpan.textContent = "Xe Cũ (Lọc)"; titleH2.textContent = "Danh sách xe đã qua sử dụng"; }
    else if (type === 'seats') { categorySpan.textContent = "Lọc theo số chỗ"; titleH2.textContent = `Xe ${filterDescription}`; }

    if (carsToDisplay.length > 0) {
        carsToDisplay.forEach(car => {
            const cardStyleType = car.condition === 'new' ? 'filtered-new' : 'filtered-used';
            displayContainer.appendChild(renderCarCardGlobal(car, cardStyleType));
        });
    } else {
        let message = `Không tìm thấy xe nào.`;
        if (type === 'search') message = `Không tìm thấy xe nào với từ khóa "${filterDescription}".`;
        else message = `Không tìm thấy xe ${filterDescription} nào.`;
        displayContainer.innerHTML = `<p class="no-cars-message">${message}</p>`;
    }
    displaySection.style.display = 'block';
    displaySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    updateNavbarActiveState(null);
}

function performCarSearch(searchTerm) {
    searchTerm = searchTerm.toLowerCase().trim();
    if (!searchTerm) { resetToDefaultView(document.querySelector('.navbar a.nav-link[href="#home"]')); return; }
    const userSpecificData = JSON.parse(localStorage.getItem('userSpecificData')) || {};
    let allCars = [];
    for (const userId in userSpecificData) { if (userSpecificData[userId]?.carAds) { userSpecificData[userId].carAds.forEach(carAd => allCars.push({ ...carAd, userId })); } }
    const searchResults = allCars.filter(car =>
        (car.brand && car.brand.toLowerCase().includes(searchTerm)) ||
        (car.model && car.model.toLowerCase().includes(searchTerm)) ||
        (car.sellerName && car.sellerName.toLowerCase().includes(searchTerm)) ||
        (car.year && car.year.toString().includes(searchTerm))
    );
    displayCarsInCentralArea(searchResults, 'search', searchTerm);
}

function filterCarsBySeats(seatValue) {
    const userSpecificData = JSON.parse(localStorage.getItem('userSpecificData')) || {};
    let allCars = [];
    for (const userId in userSpecificData) { if (userSpecificData[userId]?.carAds) { userSpecificData[userId].carAds.forEach(carAd => allCars.push({ ...carAd, userId })); } }

    let filteredCars;
    let filterDescription;
    if (seatValue === "8+") {
        filteredCars = allCars.filter(car => car.seats && !isNaN(parseInt(car.seats)) && parseInt(car.seats) >= 8);
        filterDescription = "8 chỗ trở lên";
    } else {
        const seatNumber = parseInt(seatValue);
         if (!isNaN(seatNumber)) {
            filteredCars = allCars.filter(car => car.seats && parseInt(car.seats) === seatNumber);
            filterDescription = `${seatValue} chỗ`;
         } else { filteredCars = []; filterDescription = "không hợp lệ"; }
    }
    displayCarsInCentralArea(filteredCars, 'seats', filterDescription);
}

function updateNavbarActiveState(activeLink) {
    document.querySelectorAll('.navbar .nav-link').forEach(link => link.classList.remove('active'));
    if (activeLink) activeLink.classList.add('active');
}

function resetToDefaultView(newActiveLink = null) {
    document.getElementById('filtered-cars-display').style.display = 'none';
    document.querySelectorAll('.default-view-section').forEach(sec => {
        if (sec.id === 'user-posted-cars') {
             sec.style.display = localStorage.getItem('loggedInUserId') ? 'block' : 'none';
        } else { sec.style.display = sec.id === 'about' ? 'flex' : 'block'; }
    });
    loadInitialCarsIntoSections(); 
    displayUserCarAds(); 
    if (newActiveLink) updateNavbarActiveState(newActiveLink);
    else updateNavbarActiveState(document.querySelector('.navbar a.nav-link[href="#home"]'));
}
document.addEventListener('DOMContentLoaded', () => {
    initializeDOMElements();
    updateAccountDropdown();
    displayUserCarAds();
    loadInitialCarsIntoSections();

    const searchInputGlobal = document.getElementById('searchInputGlobal');
    const searchBoxGlobal = document.querySelector('.search-box.container');
    const searchIconHeader = document.querySelector('#search-icon');
    const mainNavbar = document.querySelector('.navbar');
    const menuIcon = document.querySelector('#menu-icon');
    const header = document.querySelector('header');
    const categoryDropdownContainer = document.getElementById('categoryDropdownContainer');

    if (searchInputGlobal) {
        let searchTimeout;
        searchInputGlobal.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            if (searchInputGlobal.value.trim() === "") { resetToDefaultView(document.querySelector('.navbar a.nav-link[href="#home"]')); }
            else { searchTimeout = setTimeout(() => performCarSearch(searchInputGlobal.value), 500); }
        });
        searchInputGlobal.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); clearTimeout(searchTimeout); performCarSearch(searchInputGlobal.value); if (searchBoxGlobal) searchBoxGlobal.classList.remove('active'); }
        });
    }
    if (searchIconHeader && searchBoxGlobal) {
        searchIconHeader.addEventListener('click', (e) => {
            e.stopPropagation(); searchBoxGlobal.classList.toggle('active');
            if (mainNavbar) mainNavbar.classList.remove('active'); closeAllActiveDropdowns();
            if (searchBoxGlobal.classList.contains('active')) searchInputGlobal.focus();
            else if (searchInputGlobal.value.trim() === "") resetToDefaultView();
        });
    }
    if (menuIcon && mainNavbar) {
        menuIcon.addEventListener('click', (e) => {
            e.stopPropagation(); mainNavbar.classList.toggle('active');
            if (searchBoxGlobal) searchBoxGlobal.classList.remove('active'); closeAllActiveDropdowns();
        });
    }
    if (header) {
        const handleScroll = () => { header.classList.toggle('shadow', window.scrollY > 0); };
        window.addEventListener('scroll', handleScroll); handleScroll();
    }
    window.addEventListener('click', (event) => {
        if (searchBoxGlobal && searchBoxGlobal.classList.contains('active') && !searchBoxGlobal.contains(event.target) && !searchIconHeader?.contains(event.target)) { searchBoxGlobal.classList.remove('active'); if (searchInputGlobal.value.trim() === "") resetToDefaultView(); }
        if (mainNavbar && mainNavbar.classList.contains('active') && !mainNavbar.contains(event.target) && !menuIcon?.contains(event.target)) { mainNavbar.classList.remove('active'); }
        let clickedInsideActiveDropdown = false;
        document.querySelectorAll('.dropdown-content.active').forEach(dropdown => { if (dropdown.contains(event.target)) clickedInsideActiveDropdown = true; });
        let clickedOnDropdownTrigger = event.target.closest('a[onclick*="toggleDropdown"]');
        if (!clickedInsideActiveDropdown && !clickedOnDropdownTrigger) closeAllActiveDropdowns();
    });
    if (searchBoxGlobal) searchBoxGlobal.addEventListener('click', e => e.stopPropagation());

    document.querySelectorAll('.navbar .nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const filterType = this.getAttribute('data-nav-filter'); 
            const hrefTarget = this.getAttribute('href');

            if (filterType) { 
                e.preventDefault();
                const userSpecificData = JSON.parse(localStorage.getItem('userSpecificData')) || {};
                let allCars = [];
                for (const userId in userSpecificData) { if (userSpecificData[userId]?.carAds) { userSpecificData[userId].carAds.forEach(carAd => allCars.push({ ...carAd, userId })); } }
                const carsToShow = allCars.filter(car => car.condition === filterType);
                displayCarsInCentralArea(carsToShow, filterType); 
                updateNavbarActiveState(this);
            } else if (hrefTarget === '#home' || (hrefTarget.startsWith('#') && document.getElementById(hrefTarget.substring(1)))) {
                
                const targetId = hrefTarget.substring(1);
                const targetSection = document.getElementById(targetId);

                resetToDefaultView(this); 

                if (hrefTarget === '#home') { window.scrollTo({ top: 0, behavior: 'smooth' }); }
                else if (targetSection) {
                     targetSection.style.display = targetSection.id === 'about' ? 'flex' : 'block';
                     setTimeout(()=> targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
                }
            } else { updateNavbarActiveState(this); } 

            if (mainNavbar?.classList.contains('active')) mainNavbar.classList.remove('active'); 
        });
    });

    if (categoryDropdownContainer) {
        categoryDropdownContainer.addEventListener('click', function(event) {
            const targetLink = event.target.closest('a.seat-filter-link');
            if (targetLink) {
                event.preventDefault();
                const seatFilterValue = targetLink.getAttribute('data-seats');
                if (seatFilterValue) {
                    filterCarsBySeats(seatFilterValue);
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
    } else { console.warn("Swiper or .homeSwiper element not found."); }

    console.log("current3.js fully initialized.");
}); 