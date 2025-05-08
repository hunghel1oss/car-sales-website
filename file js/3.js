document.addEventListener('DOMContentLoaded', () => {
    const navLinkNewCar = document.getElementById('nav-link-new-car'); 
    const navLinkOldCar = document.getElementById('nav-link-old-car'); 
    const homeNavLinkForFilter = document.querySelector('.navbar a.nav-link[href="#home"]');
    const displaySection = document.getElementById('filtered-cars-display');
    const displayContainer = document.querySelector('#filtered-cars-display .cars-display-container');
    const categorySpan = document.getElementById('filtered-cars-category');
    const titleH2 = document.getElementById('filtered-cars-title');
    const categoryDropdownContainer = document.getElementById('categoryDropdownContainer');
    function renderCarCard(car) {
        const carBox = document.createElement('div');
        carBox.classList.add('box');
        carBox.setAttribute('data-car-id', car.ID);
        carBox.setAttribute('data-user-id', car.userId || 'unknown'); 

        const firstImage = (car.imagesBase64 && car.imagesBase64.length > 0) ? car.imagesBase64[0] : './img/car-placeholder.png';

        carBox.innerHTML = `
            <img src="${firstImage}" alt="${car.brand || ''} ${car.model || ''}">
            <h2>${car.brand || 'N/A'} ${car.model || ''}</h2>
            ${car.price ? `<p class="car-card-price">${car.price.toLocaleString('vi-VN')} VNĐ</p>` : '<p class="car-card-price">Liên hệ</p>'}
            ${car.year ? `<p class="car-card-year">Năm: ${car.year}</p>` : ''}
            <p class="car-seller-info">Người đăng: ${car.sellerName || 'N/A'}</p>
        `;

        carBox.addEventListener('click', function() {
            localStorage.setItem('selectedCarIdToView', this.getAttribute('data-car-id'));
            localStorage.setItem('selectedCarOwnerIdToView', this.getAttribute('data-user-id'));
            window.location.href = './car-details.html';
        });
        return carBox;
    }

    function setActiveNavLink(activeLink) {
        const navLinks = document.querySelectorAll('.navbar .nav-link');
        navLinks.forEach(link => link.classList.remove('active'));
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    function displayFilteredResults(filterType, filterValue = null) {
        if (!displaySection || !displayContainer || !categorySpan || !titleH2) {
            console.error("Required display elements not found in DOM.");
            return;
        }

        const userSpecificData = JSON.parse(localStorage.getItem('userSpecificData')) || {};
        let allCars = [];
        for (const userId in userSpecificData) {
            if (userSpecificData[userId]?.carAds) {
                userSpecificData[userId].carAds.forEach(carAd => {
                    allCars.push({ ...carAd, userId: userId }); 
                });
            }
        }

        let filteredCars = [];
        let categoryText = "Kết quả lọc";
        let titleText = "";
        if (filterType === 'condition') {
            filteredCars = allCars.filter(car => car.condition === filterValue);
            categoryText = filterValue === 'new' ? "Xe Mới (Lọc)" : "Xe Cũ (Lọc)";
            titleText = filterValue === 'new' ? "Danh sách xe mới" : "Danh sách xe đã qua sử dụng";
        } else if (filterType === 'seats') { 
             let seatDescription = "";
             if (filterValue === "8+") {
                 filteredCars = allCars.filter(car => car.seats && !isNaN(parseInt(car.seats)) && parseInt(car.seats) >= 8);
                 seatDescription = "8 chỗ trở lên";
             } else {
                 const seatNumber = parseInt(filterValue);
                 if (!isNaN(seatNumber)) {
                    filteredCars = allCars.filter(car => car.seats && parseInt(car.seats) === seatNumber);
                    seatDescription = `${filterValue} chỗ`;
                 } else {
                    console.error("Invalid seat value:", filterValue); filteredCars = []; seatDescription = "không hợp lệ";
                 }
             }
            categoryText = "Lọc theo số chỗ";
            titleText = `Xe ${seatDescription}`;
        } else {
            console.error("Unknown filter type:", filterType);
            return; 
        }
        displayContainer.innerHTML = ''; 
        categorySpan.textContent = categoryText;
        titleH2.textContent = titleText;

        if (filteredCars.length > 0) {
            filteredCars.forEach(car => {
                displayContainer.appendChild(renderCarCard(car));
            });
        } else {
            displayContainer.innerHTML = `<p class="no-cars-message">Không tìm thấy xe nào phù hợp.</p>`;
        }
        document.querySelectorAll('.default-view-section').forEach(sec => {
             if(sec) sec.style.display = 'none'; 
        });
        displaySection.style.display = 'block';
        displaySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (navLinkNewCar) {
        navLinkNewCar.addEventListener('click', (e) => {
            e.preventDefault();
            displayFilteredResults('condition', 'new'); 
            setActiveNavLink(navLinkNewCar);
        });
    }

    if (navLinkOldCar) {
        navLinkOldCar.addEventListener('click', (e) => {
            e.preventDefault();
            displayFilteredResults('condition', 'used'); 
            setActiveNavLink(navLinkOldCar);
        });
    }
    function resetFilterView(activeNavLink = null) {
         if (displaySection) displaySection.style.display = 'none';
         document.querySelectorAll('.default-view-section').forEach(sec => {
              if(sec) sec.style.display = sec.id === 'about' ? 'flex' : 'block'; 
         });
         if(activeNavLink){
             setActiveNavLink(activeNavLink);
         } else {
             setActiveNavLink(document.querySelector('.navbar a.nav-link[href="#home"]'));
         }
    }

    if (homeNavLinkForFilter) {
        homeNavLinkForFilter.addEventListener('click', (e) => {
            resetFilterView(homeNavLinkForFilter);
        });
    }
    const otherNavLinks = document.querySelectorAll('.navbar .nav-link:not([data-nav-filter]):not([href="#home"])'); // Sửa data attribute nếu khác
    otherNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                resetFilterView(link);
                 const targetSection = document.querySelector(href);
                 if(targetSection) targetSection.style.display = targetSection.id === 'about' ? 'flex' : 'block'; // Đảm bảo section đích hiển thị
            } else {
                setActiveNavLink(link);
            }
        });
    });

    if (categoryDropdownContainer) {
        categoryDropdownContainer.addEventListener('click', function(event) {
            const targetLink = event.target.closest('a.seat-filter-link'); 

            if (targetLink) {
                event.preventDefault();
                const seatFilterValue = targetLink.getAttribute('data-seats'); 

                if (seatFilterValue) {
                    displayFilteredResults('seats', seatFilterValue);
                    setActiveNavLink(null); 
                    categoryDropdownContainer.classList.remove('active'); 
                } else {
                    console.warn("Seat filter link missing data-seats attribute.");
                }
            }
        });
    } else {
        console.warn("#categoryDropdownContainer not found for seat filter listener.");
    }

    console.log("3.js (Handling Navbar and Seat Filtering) loaded.");
}); 