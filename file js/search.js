document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search3input');
    const searchContainer = document.querySelector('.current3'); 
    const searchResultsContainer = document.createElement('div');
    searchResultsContainer.classList.add('search-results-container');
    searchContainer.appendChild(searchResultsContainer); 

    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            const searchTerm = searchInput.value.trim().toLowerCase();
            searchResultsContainer.innerHTML = ''; 

            const storedCars = localStorage.getItem('carAds');
            const carAdsArray = storedCars ? JSON.parse(storedCars) : [];

            if (carAdsArray && carAdsArray.length > 0 && searchTerm) {
                const results = carAdsArray.filter(car =>
                    car.brand.toLowerCase().includes(searchTerm) ||
                    car.model.toLowerCase().includes(searchTerm)
                );

                if (results.length > 0) {
                    results.forEach(car => {
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
                        searchResultsContainer.appendChild(carCard);

                        carCard.addEventListener('click', function() {
                            const selectedCarId = this.dataset.id;
                            localStorage.setItem('selectedCarId', selectedCarId);
                            window.location.href = './car-details.html';
                        });
                    });
                } else {
                    searchResultsContainer.innerHTML = '<p>Không tìm thấy xe nào phù hợp.</p>';
                }
            } else if (!searchTerm) {
                searchResultsContainer.innerHTML = '<p>Vui lòng nhập tên xe để tìm kiếm.</p>';
            } else {
                searchResultsContainer.innerHTML = '<p>Chưa có dữ liệu xe được lưu.</p>';
            }
        }
    });
});