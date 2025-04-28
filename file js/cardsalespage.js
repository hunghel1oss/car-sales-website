document.addEventListener('DOMContentLoaded', function() {
    const carListContainer = document.querySelector('.car-list-container');
    const storedCars = localStorage.getItem('carAds');
    let carAdsArray = storedCars ? JSON.parse(storedCars) : [];

    carAdsArray.sort((a, b) => b.ID - a.ID);

    const urlParams = new URLSearchParams(window.location.search);
    const newCarId = urlParams.get('newCarId');

    if (carAdsArray && carAdsArray.length > 0) {
        carAdsArray.forEach(car => {
   
            if (car.brand && car.model) {
                const carCard = document.createElement('div');
                carCard.classList.add('car-card');
                carCard.dataset.id = car.ID;

                if (newCarId && car.ID.toString() === newCarId) {
                    carCard.classList.add('new-car-highlight');
                }

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
                carListContainer.appendChild(carCard);

                carCard.addEventListener('click', function() {
                    const selectedCarId = this.dataset.id;
                    localStorage.setItem('selectedCarId', selectedCarId);
                    window.location.href = './car-details.html';
                });
            }
        });
    } else {
        carListContainer.innerHTML = '<p>Chưa có tin đăng xe nào.</p>';
    }
});