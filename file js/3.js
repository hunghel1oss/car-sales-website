document.addEventListener('DOMContentLoaded', () => {
    const homeNavLinkForFilter = document.querySelector('.navbar a.nav-link[href="#home"]');
    const displaySection = document.getElementById('filtered-cars-display');
    const displayContainer = displaySection ? displaySection.querySelector('.cars-display-container') : null;
    const categorySpan = document.getElementById('filtered-cars-category');
    const titleH2 = document.getElementById('filtered-cars-title');
    const descriptionPFiltered = document.getElementById('filtered-cars-description');
    const userCarsContainer = document.querySelector('#user-posted-cars .user-cars-container');
    const userPostedCarsSection = document.getElementById('user-posted-cars');

    function renderCarCard_3js(car, cardPurpose = 'general') {
        const carBox = document.createElement('div');
        carBox.classList.add('box');
        if (!car || !car.ID) {
            console.error("renderCarCard_3js: Invalid car data provided.", car);
            carBox.innerHTML = "<p>Lỗi dữ liệu xe.</p>";
            return carBox;
        }
        carBox.setAttribute('data-car-id', car.ID);
        carBox.setAttribute('data-user-id', car.userId || 'unknown');
        let styleType = 'new';
        if (car.condition === 'used' || cardPurpose === 'old-onload' || cardPurpose === 'user-posted' || cardPurpose === 'saved' || cardPurpose === 'filtered-used') {
            styleType = 'old';
        }
        carBox.setAttribute('data-style-type', styleType);

        let firstImage = './img/car-placeholder.png'; // Ảnh mặc định
        if (car.imageUrls && Array.isArray(car.imageUrls) && car.imageUrls.length > 0 && car.imageUrls[0]) {
            firstImage = car.imageUrls[0];
        }

        const heartIcon = document.createElement('i');
        heartIcon.classList.add('bx', 'car-card-heart');
        if (window.HuanHungCarshopApp && typeof window.HuanHungCarshopApp.isCarSaved === 'function' && window.HuanHungCarshopApp.isCarSaved(car.ID)) {
            heartIcon.classList.add('bxs-heart', 'saved'); heartIcon.title = "Bỏ lưu xe này";
        } else {
            heartIcon.classList.add('bx-heart'); heartIcon.title = "Lưu xe này";
        }
        heartIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.HuanHungCarshopApp && typeof window.HuanHungCarshopApp.toggleSaveCar === 'function') {
                const result = window.HuanHungCarshopApp.toggleSaveCar(car.ID, heartIcon);
                if (result.success && !result.isNowSaved && cardPurpose === 'saved') {
                     carBox.remove();
                     const savedCarsContainer = document.querySelector('#filtered-cars-display .cars-display-container');
                     if (savedCarsContainer && savedCarsContainer.children.length === 0) {
                         savedCarsContainer.innerHTML = `<p class="no-cars-message">Bạn chưa lưu xe nào.</p>`;
                     }
                }
            } else { alert("Cần đăng nhập để thực hiện."); }
        });

        let imageHTML = `<img src="${firstImage}" alt="${car.brand || 'Xe'} ${car.model || ''}" onerror="this.onerror=null;this.src='./img/image-link-error.png';this.alt='Ảnh không tải được';">`;
        let statusHTML = '';
        const carStatus = car.status || 'available';
        let statusText = "Còn xe"; let statusClass = "status-available";
        switch (carStatus) {
            case 'pending': statusText = "Đang giao dịch"; statusClass = "status-pending"; break;
            case 'sold': statusText = "Đã bán"; statusClass = "status-sold"; break;
        }
        statusHTML = `<div class="car-card-status ${statusClass}">${statusText}</div>`;

        let cardContentBelowImage = '';
        if (styleType === 'new' && cardPurpose !== 'user-posted' && cardPurpose !== 'saved') {
            cardContentBelowImage = `
                <div class="card-text-content">
                    <h2>${car.brand || 'N/A'} ${car.model || ''}</h2>
                    ${car.year ? `<p class="car-card-year">Năm: ${car.year}</p>` : ''}
                    <p class="car-seller-info">Người đăng: ${car.sellerName || 'N/A'}</p>
                    ${car.price ? `<p class="car-card-price-text">${car.price.toLocaleString('vi-VN') + ' VNĐ'}</p>` : '<p class="car-card-price-text">Liên hệ</p>'}
                </div>`;
        } else {
            cardContentBelowImage = `
                <div class="card-text-content">
                    <h3>${car.brand || 'N/A'} ${car.model || ''}</h3>
                    ${car.year ? `<p class="car-year-old">Năm: ${car.year}</p>` : ''}
                    ${car.mileage ? `<p class="car-mileage-old">Đã chạy: ${car.mileage.toLocaleString('vi-VN')} km</p>` : ''}
                    <p class="car-seller-info">Người đăng: ${car.sellerName || 'N/A'}</p>
                    ${car.price ? `<span class="car-price-old">${car.price.toLocaleString('vi-VN')} VNĐ</span>` : '<span class="car-price-old">Liên hệ</span>'}
                </div>`;
        }
        let footerHTML = '';
        if (cardPurpose === 'user-posted') {
            footerHTML = `<div class="box-footer-actions"><a href="#" class="details-btn action-btn-card">Xem Chi Tiết</a><a href="#" class="edit-btn action-btn-card">Sửa Tin</a></div>`;
        } else if (styleType === 'old' || cardPurpose === 'saved') {
            footerHTML = `<div class="box-footer-details"><a href="#" class="details-btn action-btn-card">Xem Chi Tiết</a></div>`;
        }

        carBox.innerHTML = imageHTML + cardContentBelowImage + footerHTML;
        carBox.appendChild(heartIcon);
        if (statusHTML) {
            const statusElement = document.createElement('div');
            statusElement.innerHTML = statusHTML.trim();
            carBox.appendChild(statusElement.firstChild);
        }

        const detailsBtn = carBox.querySelector('.details-btn');
        if (detailsBtn) {
             detailsBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); localStorage.setItem('selectedCarIdToView', carBox.getAttribute('data-car-id')); localStorage.setItem('selectedCarOwnerIdToView', carBox.getAttribute('data-user-id')); window.location.href = './car-details.html'; });
        }
        if (cardPurpose === 'user-posted') {
            const editBtn = carBox.querySelector('.edit-btn');
            if (editBtn) { editBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); const carIdToEdit = carBox.getAttribute('data-car-id'); window.location.href = `./salespage.html?editCarId=${carIdToEdit}`; }); }
        }
        carBox.addEventListener('click', function(e) {
            if (!e.target.closest('.car-card-heart') && !e.target.closest('.action-btn-card') && !e.target.closest('.car-card-status')) {
                localStorage.setItem('selectedCarIdToView', this.getAttribute('data-car-id'));
                localStorage.setItem('selectedCarOwnerIdToView', this.getAttribute('data-user-id'));
                window.location.href = './car-details.html';
            }
        });
        return carBox;
    }

    function displayUserPostedCars_3js() {
        if (!userCarsContainer || !userPostedCarsSection) { return; }
        userCarsContainer.innerHTML = ''; const loggedInUserId = localStorage.getItem('loggedInUserId');
        if (!loggedInUserId) { userCarsContainer.innerHTML = `<p class="no-cars-message">Vui lòng <a href="login.html" class="text-link">đăng nhập</a> để xem xe của bạn.</p>`; userPostedCarsSection.style.display = 'block'; return; }
        const userSpecificData = JSON.parse(localStorage.getItem('userSpecificData')) || {}; const userData = userSpecificData[loggedInUserId];
        if (userData && userData.carAds && userData.carAds.length > 0) {
            const sortedCarAds = userData.carAds.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
            sortedCarAds.forEach(car => { userCarsContainer.appendChild(renderCarCard_3js(car, 'user-posted')); });
            userPostedCarsSection.style.display = 'block';
        } else { userCarsContainer.innerHTML = `<p class="no-cars-message">Bạn chưa đăng xe nào. <a href="salespage.html" class="text-link">Đăng ngay!</a></p>`; userPostedCarsSection.style.display = 'block'; }
    }
    window.displayUserPostedCars_3js = displayUserPostedCars_3js;
    displayUserPostedCars_3js();

    window.displaySavedCarsFrom3JS = function() {
        if (!displaySection || !displayContainer || !categorySpan || !titleH2 || !descriptionPFiltered) { console.error("Một hoặc nhiều phần tử hiển thị không tìm thấy cho 'Tin đã lưu'."); return; }
        document.querySelectorAll('.default-view-section').forEach(sec => { if (sec) sec.style.display = 'none'; }); displaySection.style.display = 'block'; setActiveNavLink_3js(null);
        const loggedInUserId = localStorage.getItem('loggedInUserId');
        if (!loggedInUserId) { categorySpan.textContent = "Danh sách yêu thích"; titleH2.textContent = "Xe bạn đã lưu"; descriptionPFiltered.textContent = "Xem lại những chiếc xe bạn quan tâm."; displayContainer.innerHTML = `<p class="no-cars-message">Vui lòng <a href="login.html" class="text-link">đăng nhập</a> để xem xe đã lưu.</p>`; displaySection.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
        const savedCarIds = (window.HuanHungCarshopApp && typeof window.HuanHungCarshopApp.getSavedCarsForCurrentUser === 'function') ? window.HuanHungCarshopApp.getSavedCarsForCurrentUser() : [];
        const userSpecificData = JSON.parse(localStorage.getItem('userSpecificData')) || {}; let allCarsMasterList = [];
        for (const userId in userSpecificData) { if (userSpecificData[userId]?.carAds) { userSpecificData[userId].carAds.forEach(carAd => allCarsMasterList.push({ ...carAd, userId })); } }
        const savedCarsDetails = savedCarIds.map(savedId => { return allCarsMasterList.find(car => car.ID === savedId); }).filter(car => car !== undefined);
        displayContainer.innerHTML = ''; categorySpan.textContent = "Danh sách yêu thích"; titleH2.textContent = "Xe bạn đã lưu"; descriptionPFiltered.textContent = "Xem lại những chiếc xe bạn quan tâm.";
        if (savedCarsDetails.length > 0) { savedCarsDetails.forEach(car => { displayContainer.appendChild(renderCarCard_3js(car, 'saved')); });
        } else { displayContainer.innerHTML = `<p class="no-cars-message">Bạn chưa lưu xe nào. Hãy <a href="#home" class="text-link" onclick="resetFilterView_3js(document.querySelector('.navbar a.nav-link[href=\\'#home\\']'));">khám phá xe</a> và lưu lại!</p>`; }
        displaySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    function setActiveNavLink_3js(activeLink) { document.querySelectorAll('.navbar .nav-link').forEach(link => link.classList.remove('active')); if (activeLink) { activeLink.classList.add('active'); } }
    window.setActiveNavLink_3js = setActiveNavLink_3js;

    function displayFilteredResults_3js(filterType, filterValue = null, source = 'navbar') {
        if (!displaySection || !displayContainer || !categorySpan || !titleH2 || !descriptionPFiltered) { console.error("Một hoặc nhiều phần tử hiển thị không tìm thấy cho 3.js filtering."); return; }
        const userSpecificData = JSON.parse(localStorage.getItem('userSpecificData')) || {}; let allCars = [];
        for (const userId in userSpecificData) { if (userSpecificData[userId]?.carAds) { userSpecificData[userId].carAds.forEach(carAd => { allCars.push({ ...carAd, userId: userId }); }); } }
        let filteredCars = []; let categoryText = "Kết quả lọc"; let titleText = ""; let descriptionText = "Hiển thị xe dựa trên tiêu chí của bạn.";
        if (filterType === 'condition') { filteredCars = allCars.filter(car => car.condition === filterValue); categoryText = filterValue === 'new' ? `Xe Mới (${source === 'navbar' ? 'Lọc Nhanh' : 'Khác'})` : `Xe Cũ (${source === 'navbar' ? 'Lọc Nhanh' : 'Khác'})`; titleText = filterValue === 'new' ? "Danh sách xe mới" : "Danh sách xe đã qua sử dụng"; descriptionText = filterValue === 'new' ? `Khám phá các mẫu xe mới nhất.` : `Tìm các xe đã qua sử dụng chất lượng.`;
        } else if (filterType === 'seats') { let seatDescription = ""; if (filterValue === "8+") { filteredCars = allCars.filter(car => car.seats && (parseInt(car.seats) >= 8 || car.seats.toLowerCase().includes("8+"))); seatDescription = "8 chỗ trở lên"; } else { const seatNumber = parseInt(filterValue); if (!isNaN(seatNumber)) { filteredCars = allCars.filter(car => car.seats && parseInt(car.seats) === seatNumber); seatDescription = `${filterValue} chỗ`; } else { filteredCars = []; seatDescription = "không hợp lệ"; } } categoryText = "Lọc theo số chỗ"; titleText = `Xe ${seatDescription}`; descriptionText = `Hiển thị xe có ${seatDescription}.`;
        } else if (filterType === 'search') { const searchTerm = filterValue.toLowerCase(); filteredCars = allCars.filter(car => (car.brand && car.brand.toLowerCase().includes(searchTerm)) || (car.model && car.model.toLowerCase().includes(searchTerm)) || (car.sellerName && car.sellerName.toLowerCase().includes(searchTerm)) || (car.year && car.year.toString().includes(searchTerm)) || (car.ID && car.ID.toLowerCase().includes(searchTerm)) ); categoryText = "Kết quả tìm kiếm"; titleText = `Xe cho từ khóa: "${filterValue}"`; descriptionText = `Đã tìm thấy ${filteredCars.length} xe.`;
        } else { console.error("Unknown filter type in 3.js:", filterType); return; }
        displayContainer.innerHTML = ''; categorySpan.textContent = categoryText; titleH2.textContent = titleText; descriptionPFiltered.textContent = descriptionText;
        if (filteredCars.length > 0) { filteredCars.forEach(car => { displayContainer.appendChild(renderCarCard_3js(car, 'filtered')); });
        } else { displayContainer.innerHTML = `<p class="no-cars-message">Không tìm thấy xe nào phù hợp với tiêu chí của bạn.</p>`; }
        document.querySelectorAll('.default-view-section').forEach(sec => { if (sec) sec.style.display = 'none'; });
        displaySection.style.display = 'block'; displaySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    window.displayFilteredResults_3js = displayFilteredResults_3js;

    function resetFilterView_3js(activeNavLink = null) {
        if (displaySection) displaySection.style.display = 'none';
        document.querySelectorAll('.default-view-section').forEach(sec => { if(sec) { if (sec.id === 'user-posted-cars') { displayUserPostedCars_3js(); } else { sec.style.display = sec.id === 'about' ? 'flex' : 'block'; } } });
        setActiveNavLink_3js(activeNavLink || document.querySelector('.navbar a.nav-link[href="#home"]'));
        loadInitialCarsIntoSections_3js();
    }
    window.resetFilterView_3js = resetFilterView_3js;

    function loadInitialCarsIntoSections_3js() {
        const newCarsContainer = document.querySelector('#new-cars-on-load .new-cars-onload-container'); const oldCarsContainer = document.querySelector('#old-cars-on-load .old-cars-onload-container'); const userSpecificData = JSON.parse(localStorage.getItem('userSpecificData')) || {}; let allCars = [];
        for (const userId in userSpecificData) { if (userSpecificData[userId]?.carAds) { userSpecificData[userId].carAds.forEach(carAd => allCars.push({ ...carAd, userId })); } }
        if (newCarsContainer) { newCarsContainer.innerHTML = ''; const newCarsData = allCars.filter(car => car.condition === 'new').sort((a,b) => new Date(b.postedDate) - new Date(a.postedDate)); if (newCarsData.length > 0) { newCarsData.slice(0, 6).forEach(car => newCarsContainer.appendChild(renderCarCard_3js(car, 'new-onload'))); } else { newCarsContainer.innerHTML = `<p class="no-cars-message">Hiện chưa có xe mới nào được đăng.</p>`; } }
        if (oldCarsContainer) { oldCarsContainer.innerHTML = ''; const oldCarsData = allCars.filter(car => car.condition === 'used').sort((a,b) => new Date(b.postedDate) - new Date(a.postedDate)); if (oldCarsData.length > 0) { oldCarsData.slice(0, 6).forEach(car => oldCarsContainer.appendChild(renderCarCard_3js(car, 'old-onload'))); } else { oldCarsContainer.innerHTML = `<p class="no-cars-message">Hiện chưa có xe cũ nào được đăng.</p>`; } }
    }
    loadInitialCarsIntoSections_3js();

    const searchInputGlobal_3js = document.getElementById('searchInputGlobal');
    if (searchInputGlobal_3js) { let searchTimeout_3js; searchInputGlobal_3js.addEventListener('input', () => { clearTimeout(searchTimeout_3js); const searchTerm = searchInputGlobal_3js.value.trim(); if (searchTerm === "") { resetFilterView_3js(document.querySelector('.navbar a.nav-link[href="#home"]')); } else { searchTimeout_3js = setTimeout(() => { displayFilteredResults_3js('search', searchTerm); setActiveNavLink_3js(null); }, 500); } }); searchInputGlobal_3js.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); clearTimeout(searchTimeout_3js); const searchTerm = searchInputGlobal_3js.value.trim(); if(searchTerm) { displayFilteredResults_3js('search', searchTerm); setActiveNavLink_3js(null); } else { resetFilterView_3js(document.querySelector('.navbar a.nav-link[href="#home"]')); } const searchBoxGlobal = document.querySelector('.search-box.container'); if (searchBoxGlobal) searchBoxGlobal.classList.remove('active'); } }); }

    if(window.location.hash === '#user-posted-cars') { const userPostedLink = document.querySelector('.navbar a.nav-link[href="#user-posted-cars"]'); resetFilterView_3js(userPostedLink); setTimeout(() => { const targetSection = document.getElementById('user-posted-cars'); if (targetSection) { targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }, 100);
    } else if (window.location.hash) { const targetIdFromHash = window.location.hash.substring(1); const sectionToScroll = document.getElementById(targetIdFromHash); if(sectionToScroll && sectionToScroll.classList.contains('default-view-section')){ const correspondingNavLink = document.querySelector(`.navbar a.nav-link[href="#${targetIdFromHash}"]`); resetFilterView_3js(correspondingNavLink); setTimeout(() => { sectionToScroll.scrollIntoView({ behavior: 'smooth', block: 'start' }); },100); } }

    console.log("3.js (using image URLs, with car status on card, no price tag) loaded.");
});