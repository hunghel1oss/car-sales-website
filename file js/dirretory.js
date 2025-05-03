document.addEventListener('DOMContentLoaded', function() {
    const catalogLinks = document.querySelectorAll('.Noi-dung-danh-muc a');

    catalogLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); 

            const selectedCategoryText = this.textContent.trim();
            const storedCars = localStorage.getItem('carAds');
            const carAdsArray = storedCars ? JSON.parse(storedCars) : [];
            const filteredCars = [];

            if (carAdsArray && carAdsArray.length > 0) {
                switch (selectedCategoryText) {
                    case 'Xe 4 chỗ':
                        filteredCars.push(...carAdsArray.filter(car => parseInt(car.seats) === 4));
                        break;
                    case 'Xe 7 chỗ':
                        filteredCars.push(...carAdsArray.filter(car => parseInt(car.seats) === 7));
                        break;
                    case 'Xe 2 chỗ':
                        filteredCars.push(...carAdsArray.filter(car => parseInt(car.seats) === 2));
                        break;
                    case 'Xe 8 chỗ trở lên':
                        filteredCars.push(...carAdsArray.filter(car => parseInt(car.seats) >= 8));
                        break;
                    default:
                        console.log('Danh mục không xác định:', selectedCategoryText);
                        return;
                }

                displayFilteredCars(filteredCars);
            } else {
                const carListContainer = document.querySelector('.car-list-container');
                if (carListContainer) {
                    carListContainer.innerHTML = '<p>Chưa có tin đăng xe nào.</p>';
                }
            }
        });
    });

    function displayFilteredCars(cars) {
        const carListContainer = document.querySelector('.car-list-container');
        if (!carListContainer) return;

        carListContainer.innerHTML = ''; 

        if (cars.length > 0) {
            cars.forEach(car => {
                const carCard = document.createElement('div');
                carCard.classList.add('car-card');
                carCard.dataset.id = car.ID;

                const img = document.createElement('img');
                img.src = car.imagesBase64 && car.imagesBase64[0] ? car.imagesBase64[0] : './images/default-car.png';
                img.alt = `${car.brand} ${car.model}`;
                img.classList.add('img-car-card');

                const brandModel = document.createElement('h3');
                brandModel.textContent = `${car.brand} ${car.model} (${car.year || 'Không rõ năm'})`;

                const mainInfo = document.createElement('div');
                mainInfo.classList.add('main-info');

                const price = document.createElement('p');
                price.textContent = `Giá: ${car.price ? car.price.toLocaleString('vi-VN') : 'Liên hệ'} VNĐ`;

                const mileage = document.createElement('p');
                mileage.textContent = `Đã chạy: ${car.mileage ? car.mileage.toLocaleString('vi-VN') : 'Không rõ'} km`;

                mainInfo.appendChild(price);
                mainInfo.appendChild(mileage);

                carCard.appendChild(img);
                carCard.appendChild(brandModel);
                carCard.appendChild(mainInfo);

                carCard.addEventListener('click', function() {
                    const selectedCarId = this.dataset.id;
                    localStorage.setItem('selectedCarId', selectedCarId);
                    window.location.href = './car-details.html';
                });

                carListContainer.appendChild(carCard);
            });
        } else {
            carListContainer.innerHTML = '<p>Không có xe phù hợp với danh mục này.</p>';
        }
    }
});
function toggleDropdown(dropdownId, url) {
    const dropdown = document.getElementById(dropdownId);
    if (dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
    } else {
        // Tạm thời chỉ xử lý hiển thị, bạn có thể thêm logic tải nội dung từ url nếu cần
        dropdown.innerHTML = `
            <div class="Noi-dung-danh-muc">
                <div class="noi-dung-dm">
                    <img src="./flie ảnh/4-cho.svg" alt="" class="img-dm">
                    <a href="" class="catalogContent-4seats">Xe 4 chỗ</a>
                </div>
                <div class="noi-dung-dm">
                    <img src="./flie ảnh/7-cho.svg" alt="" class="img-dm">
                    <a href="" class="catalogContent-7seats">Xe 7 chỗ</a>
                </div>
                <div class="noi-dung-dm">
                    <img src="./flie ảnh/truck-monster.svg" alt="" class="img-dm">
                    <a href="" class="catalogContent-pickupTruck">Xe 2 chỗ</a>
                </div>
                <div class="noi-dung-dm">
                    <img src="./flie ảnh/xe-tai.svg" alt="" class="img-dm">
                    <a href="" class="catalogContent-Truck">Xe 8 chỗ trở lên</a>
                </div>
            </div>
        `;
        dropdown.style.display = 'block';
        const dropdownLinks = dropdown.querySelectorAll('.Noi-dung-danh-muc a');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                const selectedCategoryText = this.textContent.trim();
                const storedCars = localStorage.getItem('carAds');
                const carAdsArray = storedCars ? JSON.parse(storedCars) : [];
                const filteredCars = [];

                if (carAdsArray && carAdsArray.length > 0) {
                    switch (selectedCategoryText) {
                        case 'Xe 4 chỗ':
                            filteredCars.push(...carAdsArray.filter(car => parseInt(car.seats) === 4));
                            break;
                        case 'Xe 7 chỗ':
                            filteredCars.push(...carAdsArray.filter(car => parseInt(car.seats) === 7));
                            break;
                        case 'Xe 2 chỗ':
                            filteredCars.push(...carAdsArray.filter(car => parseInt(car.seats) === 2));
                            break;
                        case 'Xe 8 chỗ trở lên':
                            filteredCars.push(...carAdsArray.filter(car => parseInt(car.seats) >= 8));
                            break;
                        default:
                            console.log('Danh mục không xác định:', selectedCategoryText);
                            return;
                    }
                    displayFilteredCars(filteredCars);
                    dropdown.style.display = 'none'; 
                } else {
                    const carListContainer = document.querySelector('.car-list-container');
                    if (carListContainer) {
                        carListContainer.innerHTML = '<p>Chưa có tin đăng xe nào.</p>';
                    }
                }
            });
        });
    }
}