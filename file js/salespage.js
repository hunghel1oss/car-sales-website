document.addEventListener('DOMContentLoaded', function() {
    const carForm = document.getElementById('carForm');
    const carListDiv = document.getElementById('carList');
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const accidentSelect = document.getElementById('accident');
    const accidentDetailsTextarea = document.getElementById('accidentDetails');
    const conditionSelect = document.getElementById('condition');
    const usedCarDetailsDiv = document.getElementById('usedCarDetails');
    const carsKey = 'cars';

    function saveCar(carInfo) {
        let storedCars = localStorage.getItem(carsKey);
        let carsArray;

        if (storedCars) {
            carsArray = JSON.parse(storedCars);
        } else {
            carsArray = [];
        }
        carsArray.push(carInfo);
        localStorage.setItem(carsKey, JSON.stringify(carsArray));
    }
    function displayCars() {
        carListDiv.innerHTML = '';
        const storedCars = localStorage.getItem(carsKey);
        if (storedCars) {
            const cars = JSON.parse(storedCars);
            cars.forEach(function(car) {
                const carItem = document.createElement('div');
                carItem.classList.add('car-item');
                let accidentInfo = '';
                if (car.accident === 'yes') {
                    accidentInfo = `<p><strong>Tai nạn:</strong> Đã từng (${car.accidentDetails || 'không có mô tả'})</p>`;
                } else {
                    accidentInfo = `<p><strong>Tai nạn:</strong> Chưa từng</p>`;
                }
                let conditionInfo = '';
                if (car.condition === 'used') {
                    conditionInfo = `<p><strong>Tình trạng:</strong> Xe cũ</p><p><strong>Giấy tờ:</strong> ${car.registrationPaper}</p><p><strong>Đăng kiểm:</strong> ${car.inspectionExpiry || 'không rõ'}</p><p><strong>Bảo hiểm:</strong> ${car.insuranceExpiry || 'không rõ'}</p>`;
                } else {
                    conditionInfo = `<p><strong>Tình trạng:</strong> Xe mới</p>`;
                }
                let paymentMethodsText = '';
                if (Array.isArray(car.paymentMethods)) {
                    paymentMethodsText = car.paymentMethods.join(', ');
                } else {
                    paymentMethodsText = car.paymentMethods;
                }
                carItem.innerHTML = `
                    <img src="${car.image}" alt="${car.brand} ${car.model}">
                    <h3>${car.brand} ${car.model} (${car.year})</h3>
                    <p>Số chỗ ngồi: ${car.seats}</p>
                    <p>Màu xe: ${car.color}</p>
                    <p>Đã chạy: ${parseInt(car.mileage).toLocaleString('vi-VN')} km</p>
                    <p>Giá: ${parseInt(car.price).toLocaleString('vi-VN')} VNĐ</p>
                    ${conditionInfo}
                    ${accidentInfo}
                    <p><strong>Thanh toán:</strong> ${paymentMethodsText}</p>
                    <p><strong>Giao xe dự kiến:</strong> ${car.deliveryTime || 'không xác định'}</p>
                    <p><strong>Xem xe tại:</strong> ${car.viewingLocation}</p>
                    <hr>
                    <p><strong>Người bán:</strong> ${car.sellerName} (${car.sellerType || 'cá nhân'})</p>
                    <p><strong>Điện thoại:</strong> ${car.sellerPhone}</p>
                    <p><strong>Địa chỉ:</strong> ${car.sellerAddress}</p>
                    <p><strong>Email:</strong> ${car.sellerEmail}</p>
                `;
                carListDiv.appendChild(carItem);
            });
        } else {
            carListDiv.innerHTML = '<p>Chưa có xe nào được đăng.</p>';
        }
    }
    accidentSelect.addEventListener('change', function() {
        if (this.value === 'yes') {
            accidentDetailsTextarea.style.display = 'block';
        } else {
            accidentDetailsTextarea.style.display = 'none';
            accidentDetailsTextarea.value = ''; 
        }
    });
    conditionSelect.addEventListener('change', function() {
        if (this.value === 'used') {
            usedCarDetailsDiv.style.display = 'block';
        } else {
            usedCarDetailsDiv.style.display = 'none';
            document.getElementById('registrationPaper').value = '';
            document.getElementById('inspectionExpiry').value = '';
            document.getElementById('insuranceExpiry').value = '';
        }
    });

    imageUpload.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            }
            reader.readAsDataURL(file);
        } else {
            imagePreview.src = '#';
            imagePreview.style.display = 'none';
        }
    });
    carForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const brand = document.getElementById('brand').value;
        const model = document.getElementById('model').value;
        const year = document.getElementById('year').value;
        const seats = document.getElementById('seats').value;
        const color = document.getElementById('color').value;
        const mileage = document.getElementById('mileage').value;
        const price = document.getElementById('price').value;
        const condition = document.getElementById('condition').value;
        const registrationPaper = document.getElementById('registrationPaper').value;
        const inspectionExpiry = document.getElementById('inspectionExpiry').value;
        const insuranceExpiry = document.getElementById('insuranceExpiry').value;
        const accident = document.getElementById('accident').value;
        const accidentDetails = document.getElementById('accidentDetails').value;
        const paymentMethods = Array.from(document.getElementById('paymentMethods').selectedOptions).map(option => option.value);
        const deliveryTime = document.getElementById('deliveryTime').value;
        const viewingLocation = document.getElementById('viewingLocation').value;
        const sellerName = document.getElementById('sellerName').value;
        const sellerPhone = document.getElementById('sellerPhone').value;
        const sellerAddress = document.getElementById('sellerAddress').value;
        const sellerEmail = document.getElementById('sellerEmail').value;
        const file = imageUpload.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const carInfo = {
                    brand: brand,
                    model: model,
                    year: year,
                    seats: seats,
                    color: color,
                    mileage: mileage,
                    price: price,
                    image: e.target.result,
                    condition: condition,
                    registrationPaper: registrationPaper,
                    inspectionExpiry: inspectionExpiry,
                    insuranceExpiry: insuranceExpiry,
                    accident: accident,
                    accidentDetails: accidentDetails,
                    paymentMethods: paymentMethods,
                    deliveryTime: deliveryTime,
                    viewingLocation: viewingLocation,
                    sellerName: sellerName,
                    sellerPhone: sellerPhone,
                    sellerAddress: sellerAddress,
                    sellerEmail: sellerEmail
                };
                saveCar(carInfo);
                displayCars();
                carForm.reset();
                imagePreview.src = '#';
                imagePreview.style.display = 'none';
            }
            reader.readAsDataURL(file); 
        } else {
            alert('Vui lòng chọn hình ảnh cho xe.');
        }
    });
    displayCars();
});