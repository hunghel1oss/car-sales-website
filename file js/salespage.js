// file js/salespage.js
document.addEventListener('DOMContentLoaded', function() {
    const carForm = document.getElementById('carForm');
    const imageUpload = document.getElementById('imageUpload');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const pageTitleElement = document.getElementById('pageTitle');
    const submitButton = document.getElementById('submitButton');
    const editingCarIdInput = document.getElementById('editingCarId');
    const carStatusSelect = document.getElementById('carStatus'); // THÊM SELECTOR

    let base64ImageArray = [];
    let existingImageUrls = [];
    let imagesToRemove = [];

    const urlParams = new URLSearchParams(window.location.search);
    const carIdToEdit = urlParams.get('editCarId');
    let isEditMode = !!carIdToEdit;

    function displayImagePreview(imageData, isExisting = false) {
        const imgContainer = document.createElement('div');
        imgContainer.classList.add('image-preview-item');

        const img = document.createElement('img');
        img.src = imageData;
        img.alt = isExisting ? "Ảnh hiện tại" : "Ảnh mới";

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.textContent = 'X';
        removeBtn.title = 'Xóa ảnh này';
        removeBtn.classList.add('remove-image-btn');

        removeBtn.onclick = function() {
            if (isExisting) {
                const indexInExisting = existingImageUrls.indexOf(imageData);
                if (indexInExisting > -1) {
                    existingImageUrls.splice(indexInExisting, 1);
                    imagesToRemove.push(imageData);
                }
            } else {
                const indexInBase64 = base64ImageArray.indexOf(imageData);
                if (indexInBase64 > -1) {
                    base64ImageArray.splice(indexInBase64, 1);
                }
            }
            imgContainer.remove();
            updateImageUploadRequirement();
        };

        imgContainer.appendChild(img);
        imgContainer.appendChild(removeBtn);
        imagePreviewContainer.appendChild(imgContainer);
    }

    function encodeImageFileAsURL(file, callback) {
        const reader = new FileReader();
        reader.onloadend = function() {
            callback(reader.result);
        }
        reader.readAsDataURL(file);
    }

    if (imageUpload && imagePreviewContainer) {
        imageUpload.addEventListener('change', function() {
            const files = this.files;
            const currentTotalImages = base64ImageArray.length + existingImageUrls.length - imagesToRemove.filter(url => existingImageUrls.includes(url)).length;

            if (files.length + currentTotalImages > 10) {
                alert('Bạn chỉ có thể có tối đa 10 hình ảnh.');
                this.value = "";
                return;
            }

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file && file.type.startsWith('image/')) {
                    encodeImageFileAsURL(file, function(base64Img) {
                        if (base64ImageArray.length + existingImageUrls.length < 10) {
                            displayImagePreview(base64Img, false);
                            base64ImageArray.push(base64Img);
                            updateImageUploadRequirement();
                        } else {
                            // This case should ideally not be reached if outer check is correct
                            // but as a safeguard:
                            // alert('Đã đạt giới hạn 10 ảnh.');
                            break; // Stop processing more files from this batch
                        }
                    });
                } else if (file) {
                    alert(`File ${file.name} không phải là hình ảnh và sẽ được bỏ qua.`);
                }
            }
            this.value = "";
        });
    }

    function updateImageUploadRequirement() {
        // const totalImages = base64ImageArray.length + existingImageUrls.length - imagesToRemove.filter(url => existingImageUrls.includes(url)).length;
        // Logic này có thể không cần thiết nếu bạn chỉ alert khi quá số lượng
    }

    function populateFormForEdit(carData) {
        document.getElementById('brand').value = carData.brand || '';
        document.getElementById('model').value = carData.model || '';
        document.getElementById('year').value = carData.year || '';
        document.getElementById('seats').value = carData.seats || '';
        document.getElementById('color').value = carData.color || '';
        document.getElementById('mileage').value = carData.mileage || '';
        document.getElementById('price').value = carData.price || '';

        if (carStatusSelect) { // ĐIỀN TRẠNG THÁI
            carStatusSelect.value = carData.status || 'available';
        }

        document.getElementById('condition').value = carData.condition || '';
        conditionSelect.dispatchEvent(new Event('change')); // Trigger change to show/hide dependent fields

        if (carData.condition === 'used') {
            document.getElementById('registrationPaper').value = carData.registrationPaper || '';
            document.getElementById('inspectionExpiry').value = carData.inspectionExpiry || '';
            document.getElementById('insuranceExpiry').value = carData.insuranceExpiry || '';
        }

        document.getElementById('accident').value = carData.accident || '';
        accidentSelect.dispatchEvent(new Event('change')); // Trigger change
        if (carData.accident === 'yes') {
            document.getElementById('accidentDetails').value = carData.accidentDetails || '';
        }

        document.getElementById('paymentMethods').value = carData.paymentMethods || '';
        document.getElementById('deliveryTime').value = carData.deliveryTime || '';
        document.getElementById('viewingLocation').value = carData.viewingLocation || '';
        document.getElementById('additionalInfo').value = carData.additionalInfo || '';
        document.getElementById('sellerName').value = carData.sellerName || '';
        document.getElementById('sellerPhone').value = carData.sellerPhone || '';
        document.getElementById('sellerAddress').value = carData.sellerAddress || '';
        document.getElementById('sellerEmail').value = carData.sellerEmail || '';

        if (carData.imagesBase64 && carData.imagesBase64.length > 0) {
            existingImageUrls = [...carData.imagesBase64];
            imagePreviewContainer.innerHTML = '';
            existingImageUrls.forEach(imgUrl => {
                displayImagePreview(imgUrl, true);
            });
        }
        updateImageUploadRequirement();
    }

    if (isEditMode) {
        if (pageTitleElement) pageTitleElement.textContent = "Chỉnh sửa tin đăng xe";
        if (submitButton) submitButton.textContent = "Cập Nhật Tin";
        if (editingCarIdInput) editingCarIdInput.value = carIdToEdit;

        const loggedInUserId = localStorage.getItem('loggedInUserId');
        if (!loggedInUserId) {
            alert('Vui lòng đăng nhập để chỉnh sửa tin!');
            window.location.href = './login.html';
            return; // Dừng thực thi nếu chưa đăng nhập
        }

        const userSpecificData = JSON.parse(localStorage.getItem('userSpecificData')) || {};
        const userData = userSpecificData[loggedInUserId];

        if (userData && userData.carAds) {
            const carToEdit = userData.carAds.find(car => car.ID === carIdToEdit);
            if (carToEdit) {
                populateFormForEdit(carToEdit);
            } else {
                alert('Không tìm thấy tin xe để chỉnh sửa hoặc bạn không có quyền.');
                window.location.href = './3.html';
            }
        } else {
            alert('Không tìm thấy dữ liệu người dùng hoặc tin đăng.');
            window.location.href = './3.html';
        }
    } else {
        // Chế độ đăng mới
        base64ImageArray = [];
        existingImageUrls = [];
        imagesToRemove = [];
        if(imagePreviewContainer) imagePreviewContainer.innerHTML = '';
        if(carStatusSelect) carStatusSelect.value = 'available'; // Mặc định khi đăng mới
        updateImageUploadRequirement();
    }

    if (carForm) {
        carForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const loggedInUserId = localStorage.getItem('loggedInUserId');
            if (!loggedInUserId) {
                alert('Vui lòng đăng nhập để thực hiện thao tác này!');
                window.location.href = './login.html';
                return;
            }

            const finalImageArray = [...existingImageUrls, ...base64ImageArray];

            if (finalImageArray.length === 0) {
                alert('Vui lòng tải lên ít nhất một hình ảnh cho xe.');
                if(imageUpload) imageUpload.focus();
                return;
            }
             if (finalImageArray.length > 10) {
                alert('Số lượng hình ảnh không được vượt quá 10.');
                return;
            }

            const carInfo = {
                userId: loggedInUserId,
                brand: document.getElementById('brand').value.trim(),
                model: document.getElementById('model').value.trim(),
                year: parseInt(document.getElementById('year').value),
                seats: document.getElementById('seats').value,
                color: document.getElementById('color').value.trim(),
                mileage: parseInt(document.getElementById('mileage').value),
                price: parseInt(document.getElementById('price').value),
                imagesBase64: finalImageArray,
                condition: document.getElementById('condition').value,
                registrationPaper: document.getElementById('registrationPaper') ? document.getElementById('registrationPaper').value : '',
                inspectionExpiry: document.getElementById('inspectionExpiry') ? document.getElementById('inspectionExpiry').value : '',
                insuranceExpiry: document.getElementById('insuranceExpiry') ? document.getElementById('insuranceExpiry').value : '',
                accident: document.getElementById('accident').value,
                accidentDetails: document.getElementById('accidentDetails') ? document.getElementById('accidentDetails').value.trim() : '',
                paymentMethods: document.getElementById('paymentMethods').value,
                deliveryTime: document.getElementById('deliveryTime').value.trim(),
                viewingLocation: document.getElementById('viewingLocation').value.trim(),
                additionalInfo: document.getElementById('additionalInfo') ? document.getElementById('additionalInfo').value.trim() : '',
                sellerName: document.getElementById('sellerName').value.trim(),
                sellerPhone: document.getElementById('sellerPhone').value.trim(),
                sellerAddress: document.getElementById('sellerAddress').value.trim(),
                sellerEmail: document.getElementById('sellerEmail') ? document.getElementById('sellerEmail').value.trim() : '',
                status: carStatusSelect ? carStatusSelect.value : 'available' // LẤY TRẠNG THÁI
            };

            if (!carInfo.brand || !carInfo.model || !carInfo.year || !carInfo.seats || !carInfo.color ||
                isNaN(carInfo.mileage) || isNaN(carInfo.price) || !carInfo.condition || !carInfo.accident ||
                !carInfo.paymentMethods || !carInfo.viewingLocation || !carInfo.sellerName || !carInfo.sellerPhone ||
                !carInfo.sellerAddress || !carInfo.status ) { // Thêm kiểm tra status
                alert("Vui lòng điền đầy đủ các trường bắt buộc (*).");
                return;
            }

            let userSpecificData = JSON.parse(localStorage.getItem('userSpecificData')) || {};
            if (!userSpecificData[loggedInUserId]) {
                userSpecificData[loggedInUserId] = { carAds: [], savedPosts: [], savedSearches: [], myReviews: [] };
            }
            if (!userSpecificData[loggedInUserId].carAds) {
                userSpecificData[loggedInUserId].carAds = [];
            }

            if (isEditMode && editingCarIdInput && editingCarIdInput.value) {
                const carIdBeingEdited = editingCarIdInput.value;
                const carIndex = userSpecificData[loggedInUserId].carAds.findIndex(car => car.ID === carIdBeingEdited);
                if (carIndex > -1) {
                    userSpecificData[loggedInUserId].carAds[carIndex] = {
                        ...userSpecificData[loggedInUserId].carAds[carIndex], // Giữ lại ID, postedDate
                        ...carInfo, // Ghi đè các trường còn lại, bao gồm status
                        ID: carIdBeingEdited,
                        updatedDate: new Date().toISOString()
                    };
                    localStorage.setItem('userSpecificData', JSON.stringify(userSpecificData));
                    alert('Cập nhật tin thành công!');
                } else {
                    alert('Lỗi: Không tìm thấy tin để cập nhật.');
                    return;
                }
            } else {
                carInfo.ID = Date.now().toString() + "_" + Math.random().toString(36).substr(2, 5);
                carInfo.postedDate = new Date().toISOString();
                // status đã được gán ở trên
                userSpecificData[loggedInUserId].carAds.push(carInfo);
                localStorage.setItem('userSpecificData', JSON.stringify(userSpecificData));
                alert('Đăng tin thành công!');
            }

            base64ImageArray = [];
            existingImageUrls = [];
            imagesToRemove = [];
            if(imagePreviewContainer) imagePreviewContainer.innerHTML = '';
            carForm.reset();
            if(carStatusSelect) carStatusSelect.value = 'available'; // Reset status
            updateImageUploadRequirement();

            const usedCarDetailsDiv = document.getElementById('usedCarDetails');
            const accidentDetailsTextArea = document.getElementById('accidentDetails');
            if(usedCarDetailsDiv) usedCarDetailsDiv.style.display = 'none';
            if(accidentDetailsTextArea) {
                accidentDetailsTextArea.style.display = 'none';
                accidentDetailsTextArea.value = '';
            }

            window.location.href = './3.html#user-posted-cars';
        });
    }

    const conditionSelect = document.getElementById('condition');
    const usedCarDetailsDiv = document.getElementById('usedCarDetails');
    if (conditionSelect && usedCarDetailsDiv) {
        conditionSelect.addEventListener('change', function() {
            usedCarDetailsDiv.style.display = this.value === 'used' ? 'block' : 'none';
            if (this.value === 'new') {
                document.getElementById('registrationPaper').value = '';
                document.getElementById('inspectionExpiry').value = '';
                document.getElementById('insuranceExpiry').value = '';
            }
        });
    }

    const accidentSelect = document.getElementById('accident');
    const accidentDetailsTextArea = document.getElementById('accidentDetails');
    if (accidentSelect && accidentDetailsTextArea) {
        accidentSelect.addEventListener('change', function() {
            accidentDetailsTextArea.style.display = this.value === 'yes' ? 'block' : 'none';
            if (this.value === 'no') {
                accidentDetailsTextArea.value = '';
            }
        });
    }
});