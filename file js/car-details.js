document.addEventListener('DOMContentLoaded', function() {
    const selectedCarId = localStorage.getItem('selectedCarIdToView');
    const selectedCarOwnerId = localStorage.getItem('selectedCarOwnerIdToView');
    const elements = {
        brand: document.getElementById('brand'),
        model: document.getElementById('model'),
        year: document.getElementById('year'),
        seats: document.getElementById('seats'),
        color: document.getElementById('color'),
        mileage: document.getElementById('mileage'),
        price: document.getElementById('price'),
        imagePreviewContainer: document.getElementById('imagePreviewContainer'),
        condition: document.getElementById('condition'),
        registrationPaper: document.getElementById('registrationPaper'),
        inspectionExpiry: document.getElementById('inspectionExpiry'),
        insuranceExpiry: document.getElementById('insuranceExpiry'),
        accident: document.getElementById('accident'),
        accidentDetails: document.getElementById('accidentDetails'),
        additionalInfo: document.getElementById('additionalInfo'),
        paymentMethods: document.getElementById('paymentMethods'),
        deliveryTime: document.getElementById('deliveryTime'),
        viewingLocation: document.getElementById('viewingLocation'),
        postedDate: document.getElementById('postedDate'),
        sellerName: document.getElementById('sellerName'),
        sellerPhone: document.getElementById('sellerPhone'),
        sellerAddress: document.getElementById('sellerAddress'),
        sellerEmail: document.getElementById('sellerEmail'),
        sellerPhoneLink: document.getElementById('sellerPhoneLink'),
        sellerEmailLink: document.getElementById('sellerEmailLink'),
        usedCarSpecificDetailsDiv: document.getElementById('usedCarSpecificDetails'),
        accidentDetailsGroup: document.getElementById('accidentDetailsGroup')
    };

    if (selectedCarId && selectedCarOwnerId) {
        const userSpecificData = JSON.parse(localStorage.getItem('userSpecificData')) || {};
        const ownerData = userSpecificData[selectedCarOwnerId];

        if (ownerData && ownerData.carAds) {
            const carDetails = ownerData.carAds.find(car => car.ID === selectedCarId);

            if (carDetails) {
                document.title = `${carDetails.brand} ${carDetails.model} - Chi Tiết Xe`; 

                elements.brand.textContent = carDetails.brand || 'N/A';
                elements.model.textContent = carDetails.model || 'N/A';
                elements.year.textContent = carDetails.year || 'N/A';
                elements.seats.textContent = carDetails.seats ? `${carDetails.seats} chỗ` : 'N/A';
                elements.color.textContent = carDetails.color || 'N/A';
                elements.mileage.textContent = carDetails.mileage != null ? `${carDetails.mileage.toLocaleString('vi-VN')} km` : 'N/A';
                elements.price.textContent = carDetails.price != null ? `${carDetails.price.toLocaleString('vi-VN')} VNĐ` : 'Thỏa thuận';

                if (elements.imagePreviewContainer && carDetails.imagesBase64 && carDetails.imagesBase64.length > 0) {
                    elements.imagePreviewContainer.innerHTML = '';
                    carDetails.imagesBase64.forEach(base64Img => {
                        const img = document.createElement('img');
                        img.src = base64Img;
                        img.alt = `Ảnh ${carDetails.brand} ${carDetails.model}`;
                        // Style for images is in car-details.css, but you can add more here if needed
                        elements.imagePreviewContainer.appendChild(img);
                    });
                } else if (elements.imagePreviewContainer) {
                    elements.imagePreviewContainer.textContent = 'Không có hình ảnh.';
                }

                elements.condition.textContent = carDetails.condition === 'new' ? 'Xe mới' : (carDetails.condition === 'used' ? 'Xe cũ (đã qua sử dụng)' : 'N/A');

                if (carDetails.condition === 'used') {
                    if(elements.usedCarSpecificDetailsDiv) elements.usedCarSpecificDetailsDiv.style.display = 'block';
                    elements.registrationPaper.textContent = carDetails.registrationPaper === 'yes' ? 'Đầy đủ, hợp lệ' : (carDetails.registrationPaper === 'no' ? 'Không đầy đủ/chưa hợp lệ' : 'Không rõ');
                    elements.inspectionExpiry.textContent = carDetails.inspectionExpiry ? new Date(carDetails.inspectionExpiry).toLocaleDateString('vi-VN') : 'Không có / Không rõ';
                    elements.insuranceExpiry.textContent = carDetails.insuranceExpiry ? new Date(carDetails.insuranceExpiry).toLocaleDateString('vi-VN') : 'Không có / Không rõ';
                } else {
                     if(elements.usedCarSpecificDetailsDiv) elements.usedCarSpecificDetailsDiv.style.display = 'none';
                }


                elements.accident.textContent = carDetails.accident === 'no' ? 'Chưa từng bị tai nạn' : (carDetails.accident === 'yes' ? 'Đã từng bị tai nạn' : 'N/A');
                if (carDetails.accident === 'yes' && carDetails.accidentDetails) {
                    elements.accidentDetails.textContent = carDetails.accidentDetails;
                    if(elements.accidentDetailsGroup) elements.accidentDetailsGroup.style.display = 'block'; // Show the group
                } else {
                    if(elements.accidentDetailsGroup) elements.accidentDetailsGroup.style.display = 'none'; // Hide if no details or no accident
                }

                elements.additionalInfo.textContent = carDetails.additionalInfo || 'Không có mô tả thêm.';


                let paymentText = 'N/A';
                if (carDetails.paymentMethods) {
                    switch (carDetails.paymentMethods) {
                        case "cash": paymentText = "Tiền mặt"; break;
                        case "transfer": paymentText = "Chuyển khoản"; break;
                        case "installment": paymentText = "Hỗ trợ trả góp"; break;
                        case "all": paymentText = "Tất cả các phương thức trên"; break;
                        default: paymentText = carDetails.paymentMethods;
                    }
                }
                elements.paymentMethods.textContent = paymentText;

                elements.deliveryTime.textContent = carDetails.deliveryTime || 'Thỏa thuận khi giao dịch';
                elements.viewingLocation.textContent = carDetails.viewingLocation || 'N/A';
                elements.postedDate.textContent = carDetails.postedDate ? new Date(carDetails.postedDate).toLocaleDateString('vi-VN') : 'N/A';

                elements.sellerName.textContent = carDetails.sellerName || 'N/A';
                elements.sellerPhone.textContent = carDetails.sellerPhone || 'N/A';
                if (elements.sellerPhoneLink && carDetails.sellerPhone) elements.sellerPhoneLink.href = `tel:${carDetails.sellerPhone}`;

                elements.sellerAddress.textContent = carDetails.sellerAddress || 'N/A';
                elements.sellerEmail.textContent = carDetails.sellerEmail || 'N/A';
                 if (elements.sellerEmailLink && carDetails.sellerEmail) elements.sellerEmailLink.href = `mailto:${carDetails.sellerEmail}`;


                // Clean up localStorage after use
                // localStorage.removeItem('selectedCarIdToView');
                // localStorage.removeItem('selectedCarOwnerIdToView'); // Keep if you want "back" to work to the same user's list

            } else {
                document.body.innerHTML = '<div class="card-details-container"><h1>Lỗi</h1><p>Không tìm thấy thông tin chi tiết cho chiếc xe này. Vui lòng thử lại.</p><p><a href="3.html">Quay lại trang chủ</a></p></div>';
                console.error(`Car with ID ${selectedCarId} not found in owner ${selectedCarOwnerId}'s ads.`);
            }
        } else {
            document.body.innerHTML = '<div class="card-details-container"><h1>Lỗi</h1><p>Không tìm thấy dữ liệu của người đăng tin. Xe có thể đã bị xóa.</p><p><a href="3.html">Quay lại trang chủ</a></p></div>';
            console.error(`Owner data for ID ${selectedCarOwnerId} not found.`);
        }
    } else {
        document.body.innerHTML = '<div class="card-details-container"><h1>Không có xe được chọn</h1><p>Vui lòng chọn một chiếc xe từ danh sách để xem chi tiết.</p><p><a href="3.html">Quay lại trang chủ</a></p></div>';
        console.error('selectedCarIdToView or selectedCarOwnerIdToView not found in localStorage.');
    }
});