document.addEventListener('DOMContentLoaded', function() {
    const carForm = document.getElementById('carForm');
    const imageLinksContainer = document.getElementById('imageLinksContainer');
    const imagePreviewFromLinksContainer = document.getElementById('imagePreviewFromLinksContainer');
    const pageTitleElement = document.getElementById('pageTitle');
    const submitButton = document.getElementById('submitButton');
    const editingCarIdInput = document.getElementById('editingCarId');
    const carStatusSelect = document.getElementById('carStatus');
    const conditionSelect = document.getElementById('condition');
    const accidentSelect = document.getElementById('accident');

    let base64ImageArray = [];
    let existingImageUrls = [];

    const urlParams = new URLSearchParams(window.location.search);
    const carIdToEdit = urlParams.get('editCarId');
    let isEditMode = !!carIdToEdit;

    function displayPreviewFromLink(linkUrl, index) {
        if (!imagePreviewFromLinksContainer || !linkUrl) return;
        const existingPreview = imagePreviewFromLinksContainer.querySelector(`.image-preview-item[data-index="${index}"]`);
        if (existingPreview) existingPreview.remove();

        const imgContainer = document.createElement('div');
        imgContainer.classList.add('image-preview-item');
        imgContainer.setAttribute('data-index', index);
        const img = document.createElement('img');
        img.src = linkUrl;
        img.alt = `Preview ảnh ${index + 1}`;
        img.onerror = function() {
            imgContainer.innerHTML = `<span style="font-size:0.8em; color:red; text-align:center; padding:5px; word-break:break-all;">Link ảnh lỗi</span>`;
        };
        imgContainer.appendChild(img);
        imagePreviewFromLinksContainer.appendChild(imgContainer);
    }

    if (imageLinksContainer) {
        const linkInputs = imageLinksContainer.querySelectorAll('.image-link-input');
        linkInputs.forEach((input, index) => {
            input.addEventListener('input', function() {
                const trimmedValue = this.value.trim();
                const existingPreview = imagePreviewFromLinksContainer.querySelector(`.image-preview-item[data-index="${index}"]`);
                if (trimmedValue !== "") {
                    displayPreviewFromLink(trimmedValue, index);
                } else {
                    if (existingPreview) existingPreview.remove();
                }
            });
        });
    }

    function populateFormForEdit(carData) {
        document.getElementById('brand').value = carData.brand || '';
        document.getElementById('model').value = carData.model || '';
        document.getElementById('year').value = carData.year || '';
        document.getElementById('seats').value = carData.seats || '';
        document.getElementById('color').value = carData.color || '';
        document.getElementById('mileage').value = carData.mileage || '';
        document.getElementById('price').value = carData.price || '';
        if (carStatusSelect) carStatusSelect.value = carData.status || 'available';
        if(conditionSelect) { conditionSelect.value = carData.condition || ''; conditionSelect.dispatchEvent(new Event('change')); }
        if (carData.condition === 'used') {
            const regPaper = document.getElementById('registrationPaper'); const inspExp = document.getElementById('inspectionExpiry'); const insExp = document.getElementById('insuranceExpiry');
            if(regPaper) regPaper.value = carData.registrationPaper || ''; if(inspExp) inspExp.value = carData.inspectionExpiry || ''; if(insExp) insExp.value = carData.insuranceExpiry || '';
        }
        if(accidentSelect) { accidentSelect.value = carData.accident || ''; accidentSelect.dispatchEvent(new Event('change')); }
        const accDetails = document.getElementById('accidentDetails'); if (carData.accident === 'yes' && accDetails) accDetails.value = carData.accidentDetails || '';
        document.getElementById('paymentMethods').value = carData.paymentMethods || '';
        document.getElementById('deliveryTime').value = carData.deliveryTime || '';
        document.getElementById('viewingLocation').value = carData.viewingLocation || '';
        document.getElementById('additionalInfo').value = carData.additionalInfo || '';
        document.getElementById('sellerName').value = carData.sellerName || '';
        document.getElementById('sellerPhone').value = carData.sellerPhone || '';
        document.getElementById('sellerAddress').value = carData.sellerAddress || '';
        document.getElementById('sellerEmail').value = carData.sellerEmail || '';

        if (imagePreviewFromLinksContainer) imagePreviewFromLinksContainer.innerHTML = '';
        base64ImageArray = [];
        existingImageUrls = [];

        if (carData.imageUrls && Array.isArray(carData.imageUrls)) {
            existingImageUrls = [...carData.imageUrls];
            existingImageUrls.forEach((url, index) => {
                const linkInputs = imageLinksContainer.querySelectorAll('.image-link-input');
                if (linkInputs[index]) {
                    linkInputs[index].value = url;
                    if (url) displayPreviewFromLink(url, index);
                }
            });
        }
    }

    function resetFormAndState() {
        base64ImageArray = [];
        existingImageUrls = [];
        if (imagePreviewFromLinksContainer) imagePreviewFromLinksContainer.innerHTML = '';
        if (carForm) carForm.reset();
        const linkInputs = imageLinksContainer ? imageLinksContainer.querySelectorAll('.image-link-input') : [];
        linkInputs.forEach(input => input.value = '');

        if (carStatusSelect) carStatusSelect.value = 'available';
        if (conditionSelect) { conditionSelect.value = ''; conditionSelect.dispatchEvent(new Event('change')); }
        if (accidentSelect) { accidentSelect.value = ''; accidentSelect.dispatchEvent(new Event('change')); }
        const accidentDetailsTextArea = document.getElementById('accidentDetails'); if(accidentDetailsTextArea) accidentDetailsTextArea.value = '';
        if(editingCarIdInput) editingCarIdInput.value = '';
        isEditMode = false;
        if (pageTitleElement) pageTitleElement.textContent = "Đăng tin bán xe";
        if (submitButton) submitButton.textContent = "Đăng Tin";
        if (window.history.replaceState) { const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname; window.history.replaceState({ path: cleanUrl }, '', cleanUrl); }
    }

    if (isEditMode) {
        if (pageTitleElement) pageTitleElement.textContent = "Chỉnh sửa tin đăng xe";
        if (submitButton) submitButton.textContent = "Cập Nhật Tin";
        if (editingCarIdInput) editingCarIdInput.value = carIdToEdit;
        const loggedInUserId = localStorage.getItem('loggedInUserId');
        if (!loggedInUserId) { alert('Vui lòng đăng nhập để chỉnh sửa tin!'); window.location.href = './login.html'; return; }
        const userSpecificData = JSON.parse(localStorage.getItem('userSpecificData')) || {};
        const userData = userSpecificData[loggedInUserId];
        if (userData && userData.carAds) {
            const carToEdit = userData.carAds.find(car => car.ID === carIdToEdit && car.userId === loggedInUserId);
            if (carToEdit) { populateFormForEdit(carToEdit); }
            else { alert('Không tìm thấy tin xe để chỉnh sửa hoặc bạn không có quyền.'); window.location.href = './3.html'; }
        } else { alert('Không tìm thấy dữ liệu người dùng hoặc tin đăng.'); window.location.href = './3.html'; }
    } else {
        resetFormAndState();
    }

    if (carForm) {
        carForm.addEventListener('submit', function(event) {
            event.preventDefault();
            console.log("Submit form triggered");

            const loggedInUserId = localStorage.getItem('loggedInUserId');
            if (!loggedInUserId) { alert('Vui lòng đăng nhập để thực hiện thao tác này!'); window.location.href = './login.html'; return; }
            console.log("User logged in:", loggedInUserId);

            const imageUrls = [];
            const linkInputs = imageLinksContainer ? imageLinksContainer.querySelectorAll('.image-link-input') : [];
            linkInputs.forEach(input => { if (input.value.trim() !== "") imageUrls.push(input.value.trim()); });

            if (imageUrls.length === 0) { alert('Vui lòng cung cấp ít nhất một link hình ảnh cho xe.'); if (linkInputs[0]) linkInputs[0].focus(); return; }
            if (imageUrls.length > 5) { alert('Bạn chỉ có thể nhập tối đa 5 link hình ảnh.'); return; }
            console.log("Image URLs:", imageUrls);

            let carInfo;
            try {
                carInfo = {
                    userId: loggedInUserId,
                    brand: document.getElementById('brand').value.trim(),
                    model: document.getElementById('model').value.trim(),
                    year: parseInt(document.getElementById('year').value),
                    seats: document.getElementById('seats').value,
                    color: document.getElementById('color').value.trim(),
                    mileage: parseInt(document.getElementById('mileage').value),
                    price: parseInt(document.getElementById('price').value),
                    imageUrls: imageUrls,
                    condition: conditionSelect ? conditionSelect.value : '',
                    registrationPaper: document.getElementById('registrationPaper') ? document.getElementById('registrationPaper').value : '',
                    inspectionExpiry: document.getElementById('inspectionExpiry') ? document.getElementById('inspectionExpiry').value : '',
                    insuranceExpiry: document.getElementById('insuranceExpiry') ? document.getElementById('insuranceExpiry').value : '',
                    accident: accidentSelect ? accidentSelect.value : '',
                    accidentDetails: document.getElementById('accidentDetails') ? document.getElementById('accidentDetails').value.trim() : '',
                    paymentMethods: document.getElementById('paymentMethods').value,
                    deliveryTime: document.getElementById('deliveryTime').value.trim(),
                    viewingLocation: document.getElementById('viewingLocation').value.trim(),
                    additionalInfo: document.getElementById('additionalInfo') ? document.getElementById('additionalInfo').value.trim() : '',
                    sellerName: document.getElementById('sellerName').value.trim(),
                    sellerPhone: document.getElementById('sellerPhone').value.trim(),
                    sellerAddress: document.getElementById('sellerAddress').value.trim(),
                    sellerEmail: document.getElementById('sellerEmail') ? document.getElementById('sellerEmail').value.trim() : '',
                    status: carStatusSelect ? carStatusSelect.value : 'available'
                };
            } catch (e) {
                console.error("Error collecting form data:", e);
                alert("Lỗi khi thu thập dữ liệu từ form.");
                return;
            }
            console.log("Car info collected:", carInfo);


            if (!carInfo.brand || !carInfo.model || !carInfo.year || !carInfo.seats || !carInfo.color || isNaN(carInfo.mileage) || isNaN(carInfo.price) || !carInfo.condition || !carInfo.accident || !carInfo.paymentMethods || !carInfo.viewingLocation || !carInfo.sellerName || !carInfo.sellerPhone || !carInfo.sellerAddress || !carInfo.status ) {
                alert("Vui lòng điền đầy đủ các trường bắt buộc (*)."); return;
            }
            console.log("Form validation passed.");

            let userSpecificData;
            try {
                userSpecificData = JSON.parse(localStorage.getItem('userSpecificData')) || {};
            } catch (e) {
                console.error("Error parsing userSpecificData from localStorage:", e);
                userSpecificData = {};
            }

            if (!userSpecificData[loggedInUserId]) { userSpecificData[loggedInUserId] = { carAds: [] }; }
            if (!Array.isArray(userSpecificData[loggedInUserId].carAds)) {
                console.warn(`userSpecificData[${loggedInUserId}].carAds was not an array. Reinitializing.`);
                userSpecificData[loggedInUserId].carAds = [];
            }
            console.log("User data structure prepared.");

            const carIdCurrentlyEditing = editingCarIdInput ? editingCarIdInput.value : null;
            let successMessage = '';

            if (isEditMode && carIdCurrentlyEditing) {
                const carIndex = userSpecificData[loggedInUserId].carAds.findIndex(car => car.ID === carIdCurrentlyEditing);
                if (carIndex > -1) {
                    userSpecificData[loggedInUserId].carAds[carIndex] = {
                        ...userSpecificData[loggedInUserId].carAds[carIndex], ...carInfo,
                        ID: carIdCurrentlyEditing, updatedDate: new Date().toISOString()
                    };
                    successMessage = 'Cập nhật tin thành công!';
                    console.log("Car ad updated:", carIdCurrentlyEditing);
                } else { alert('Lỗi: Không tìm thấy tin để cập nhật.'); console.error("Car to update not found:", carIdCurrentlyEditing); return; }
            } else {
                carInfo.ID = Date.now().toString() + "_" + Math.random().toString(36).substr(2, 5);
                carInfo.postedDate = new Date().toISOString();
                userSpecificData[loggedInUserId].carAds.push(carInfo);
                successMessage = 'Đăng tin thành công!';
                console.log("New car ad created:", carInfo.ID);
            }

            try {
                localStorage.setItem('userSpecificData', JSON.stringify(userSpecificData));
                console.log("Data successfully saved to localStorage.");
                alert(successMessage);
            } catch (e) {
                console.error("Error saving to localStorage (QuotaExceededError likely):", e);
                alert("Lỗi khi lưu dữ liệu: " + e.message + ". Dung lượng lưu trữ có thể đã đầy. Vui lòng thử giảm số lượng ảnh hoặc liên hệ hỗ trợ.");
                return;
            }

            console.log("Calling resetFormAndState after successful submission.");
            resetFormAndState();

            console.log("Redirecting to ./3.html#user-posted-cars");
            window.location.href = './3.html#user-posted-cars';
        });
    }

    const usedCarDetailsDiv = document.getElementById('usedCarDetails');
    if (conditionSelect && usedCarDetailsDiv) { conditionSelect.addEventListener('change', function() { usedCarDetailsDiv.style.display = this.value === 'used' ? 'block' : 'none'; if (this.value === 'new') { const regPaper = document.getElementById('registrationPaper'); const inspExp = document.getElementById('inspectionExpiry'); const insExp = document.getElementById('insuranceExpiry'); if(regPaper) regPaper.value = ''; if(inspExp) inspExp.value = ''; if(insExp) insExp.value = ''; } }); }
    const accidentDetailsTextArea = document.getElementById('accidentDetails');
    if (accidentSelect && accidentDetailsTextArea) { accidentSelect.addEventListener('change', function() { accidentDetailsTextArea.style.display = this.value === 'yes' ? 'block' : 'none'; if (this.value === 'no') { accidentDetailsTextArea.value = ''; } }); }

    console.log("salespage.js (using image URLs) initialized. Edit mode:", isEditMode);
});