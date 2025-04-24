document.addEventListener('DOMContentLoaded', function() {
    const carListDiv = document.getElementById('carList');
    const carsKey = 'cars';

    // Hàm lấy nội dung HTML từ file bên ngoài
    async function fetchHTML(url) {
        const response = await fetch(url);
        return await response.text();
    }

    // Hàm hiển thị danh sách xe từ Local Storage dưới dạng card
    async function displayCars() {
        carListDiv.innerHTML = '';

        const storedCars = localStorage.getItem(carsKey);

        if (storedCars) {
            const cars = JSON.parse(storedCars);
            const carCardTemplate = await fetchHTML('car-card.html');
            const carDetailsTemplate = await fetchHTML('car-details.html');

            cars.forEach(function(car, index) {
                // Tạo HTML cho card nhỏ bằng template
                let cardHTML = carCardTemplate;
                cardHTML = cardHTML.replace('{{index}}', index);
                cardHTML = cardHTML.replace('{{image}}', car.image);
                cardHTML = cardHTML.replace('{{brand}}', car.brand);
                cardHTML = cardHTML.replace('{{model}}', car.model);
                cardHTML = cardHTML.replace('{{year}}', car.year);
                cardHTML = cardHTML.replace('{{price}}', parseInt(car.price).toLocaleString('vi-VN'));
                cardHTML = cardHTML.replace('{{mileage}}', parseInt(car.mileage).toLocaleString('vi-VN'));

                const carCard = document.createElement('div');
                carCard.innerHTML = cardHTML;
                carListDiv.appendChild(carCard);

                // Thêm sự kiện click để hiển thị chi tiết
                carCard.addEventListener('click', async function() {
                    const detailsDiv = this.querySelector('.car-details');
                    if (!detailsDiv) {
                        let detailsHTML = carDetailsTemplate;
                        detailsHTML = detailsHTML.replace('{{seats}}', car.seats);
                        detailsHTML = detailsHTML.replace('{{color}}', car.color);
                        detailsHTML = detailsHTML.replace('{{condition}}', car.condition === 'used' ? 'Xe cũ' : 'Xe mới');
                        detailsHTML = detailsHTML.replace('{{accident}}', car.accident === 'yes' ? `Đã từng (${car.accidentDetails || 'không có mô tả'})` : 'Chưa từng');
                        detailsHTML = detailsHTML.replace('{{paymentMethods}}', Array.isArray(car.paymentMethods) ? car.paymentMethods.join(', ') : car.paymentMethods);
                        detailsHTML = detailsHTML.replace('{{deliveryTime}}', car.deliveryTime || 'không xác định');
                        detailsHTML = detailsHTML.replace('{{viewingLocation}}', car.viewingLocation);
                        detailsHTML = detailsHTML.replace('{{sellerName}}', car.sellerName);
                        detailsHTML = detailsHTML.replace('{{sellerType}}', car.sellerType || 'cá nhân');
                        detailsHTML = detailsHTML.replace('{{sellerPhone}}', car.sellerPhone);
                        detailsHTML = detailsHTML.replace('{{sellerAddress}}', car.sellerAddress);
                        detailsHTML = detailsHTML.replace('{{sellerEmail}}', car.sellerEmail);

                        if (car.condition === 'used') {
                            detailsHTML = detailsHTML.replace('{{#if isUsed}}', '');
                            detailsHTML = detailsHTML.replace('{{/if}}', '');
                            detailsHTML = detailsHTML.replace('{{registrationPaper}}', car.registrationPaper);
                            detailsHTML = detailsHTML.replace('{{inspectionExpiry}}', car.inspectionExpiry || 'không rõ');
                            detailsHTML = detailsHTML.replace('{{insuranceExpiry}}', car.insuranceExpiry || 'không rõ');
                        } else {
                            // Xóa phần thông tin xe cũ nếu không phải xe cũ
                            const usedCarInfoRegex = /{{#if isUsed}}[\s\S]*?{{\/if}}/g;
                            detailsHTML = detailsHTML.replace(usedCarInfoRegex, '');
                        }

                        const detailsContainer = document.createElement('div');
                        detailsContainer.classList.add('car-details');
                        detailsContainer.innerHTML = detailsHTML;
                        this.appendChild(detailsContainer);
                        detailsContainer.style.display = 'block';
                    } else {
                        detailsDiv.style.display = detailsDiv.style.display === 'block' ? 'none' : 'block';
                    }
                });
            });

        } else {
            carListDiv.innerHTML = '<p>Chưa có xe nào được đăng.</p>';
        }
    }

    // ... (Các phần xử lý sự kiện form submit và các dropdown khác giữ nguyên) ...

    // Gọi hàm hiển thị danh sách xe khi trang được tải
    displayCars();
});