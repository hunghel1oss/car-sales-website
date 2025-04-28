document.addEventListener('DOMContentLoaded', function() {
    const selectedCarId = localStorage.getItem('selectedCarId');
    const storedCars = localStorage.getItem('carAds');
    const carAdsArray = storedCars ? JSON.parse(storedCars) : [];
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const brandElement = document.getElementById('brand');
    const modelElement = document.getElementById('model');
    const yearElement = document.getElementById('year');
    const seatsElement = document.getElementById('seats');
    const colorElement = document.getElementById('color');
    const mileageElement = document.getElementById('mileage');
    const priceElement = document.getElementById('price');
    const conditionElement = document.getElementById('condition');
    const registrationPaperElement = document.getElementById('registrationPaper');
    const inspectionExpiryElement = document.getElementById('inspectionExpiry');
    const insuranceExpiryElement = document.getElementById('insuranceExpiry');
    const accidentElement = document.getElementById('accident');
    const accidentDetailsElement = document.getElementById('accidentDetails');
    const paymentMethodsElement = document.getElementById('paymentMethods');
    const deliveryTimeElement = document.getElementById('deliveryTime');
    const viewingLocationElement = document.getElementById('viewingLocation');
    const sellerNameElement = document.getElementById('sellerName');
    const sellerPhoneElement = document.getElementById('sellerPhone');
    const sellerAddressElement = document.getElementById('sellerAddress');
    const sellerEmailElement = document.getElementById('sellerEmail');

    if (selectedCarId && carAdsArray && carAdsArray.length > 0) {
        // Tìm chiếc xe có ID trùng khớp
        const carDetails = carAdsArray.find(car => car.ID.toString() === selectedCarId);

        if (carDetails) {
            if (brandElement) brandElement.textContent = carDetails.brand;
            if (modelElement) modelElement.textContent = carDetails.model;
            if (yearElement) yearElement.textContent = carDetails.year;
            if (seatsElement) seatsElement.textContent = carDetails.seats;
            if (colorElement) colorElement.textContent = carDetails.color;
            if (mileageElement) mileageElement.textContent = carDetails.mileage ? `${carDetails.mileage.toLocaleString('vi-VN')} km` : '';
            if (priceElement) priceElement.textContent = carDetails.price ? `${carDetails.price.toLocaleString('vi-VN')} VNĐ` : '';

            // Hiển thị tất cả hình ảnh
            if (imagePreviewContainer && carDetails.imagesBase64 && carDetails.imagesBase64.length > 0) {
                imagePreviewContainer.innerHTML = ''; // Xóa ảnh cũ (nếu có)
                carDetails.imagesBase64.forEach(base64Img => {
                    const img = document.createElement('img');
                    img.src = base64Img;
                    img.style.maxWidth = '150px';
                    img.style.height = 'auto';
                    img.style.marginRight = '5px';
                    imagePreviewContainer.appendChild(img);
                });
            } else if (imagePreviewContainer) {
                imagePreviewContainer.textContent = 'Không có hình ảnh.';
            }

            if (conditionElement) conditionElement.textContent = carDetails.condition === 'new' ? 'Xe mới' : (carDetails.condition === 'used' ? 'Xe cũ' : '');
            if (registrationPaperElement) registrationPaperElement.textContent = carDetails.registrationPaper === 'yes' ? 'Đầy đủ, hợp lệ' : (carDetails.registrationPaper === 'no' ? 'Không đầy đủ/hết hạn' : '');
            if (inspectionExpiryElement) inspectionExpiryElement.textContent = carDetails.inspectionExpiry || 'Không có';
            if (insuranceExpiryElement) insuranceExpiryElement.textContent = carDetails.insuranceExpiry || 'Không có';
            if (accidentElement) accidentElement.textContent = carDetails.accident === 'no' ? 'Chưa từng bị tai nạn' : (carDetails.accident === 'yes' ? 'Đã từng bị tai nạn' : '');
            if (accidentDetailsElement) accidentDetailsElement.textContent = carDetails.accidentDetails || 'Không có thông tin chi tiết.';
            if (paymentMethodsElement) paymentMethodsElement.textContent = carDetails.paymentMethods ? carDetails.paymentMethods.join(', ') : 'Không có';
            if (deliveryTimeElement) deliveryTimeElement.textContent = carDetails.deliveryTime || 'Không xác định';
            if (viewingLocationElement) viewingLocationElement.textContent = carDetails.viewingLocation;
            if (sellerNameElement) sellerNameElement.textContent = carDetails.sellerName;
            if (sellerPhoneElement) sellerPhoneElement.textContent = carDetails.sellerPhone;
            if (sellerAddressElement) sellerAddressElement.textContent = carDetails.sellerAddress;
            if (sellerEmailElement) sellerEmailElement.textContent = carDetails.sellerEmail;

            // Xóa ID đã chọn khỏi localStorage sau khi đã sử dụng
            localStorage.removeItem('selectedCarId');

        } else {
            console.log(`Không tìm thấy xe với ID: ${selectedCarId}`);
            if (imagePreviewContainer) {
                imagePreviewContainer.textContent = 'Không tìm thấy thông tin xe.';
            }
        }
    } else {
        console.log('Không có ID xe được chọn hoặc không có dữ liệu xe.');
        if (imagePreviewContainer) {
            imagePreviewContainer.textContent = 'Không có thông tin xe.';
        }
    }
});