document.addEventListener('DOMContentLoaded', function() {
    const carForm = document.getElementById('carForm');
    const imageUpload = document.getElementById('imageUpload');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    let base64ImageArray = [];

    function encodeImageFileAsURL(file, callback) {
        const reader = new FileReader();
        reader.onloadend = function() {
            callback(reader.result);
        }
        reader.readAsDataURL(file);
    }

    imageUpload.addEventListener('change', function() {
        const files = this.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file) {
                encodeImageFileAsURL(file, function(base64Img) {
                    const img = document.createElement('img');
                    img.src = base64Img;
                    img.style.maxWidth = '100px';
                    img.style.height = 'auto';
                    img.style.marginRight = '5px';
                    imagePreviewContainer.appendChild(img);
                    base64ImageArray.push(base64Img);
                });
            }
        }
    });

    carForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const carID = Date.now();

        const carInfo = {
            ID: carID,
            brand: document.getElementById('brand').value,
            model: document.getElementById('model').value,
            year: parseInt(document.getElementById('year').value),
            seats: document.getElementById('seats').value,
            color: document.getElementById('color').value,
            mileage: parseInt(document.getElementById('mileage').value), // Lấy giá trị đã chạy
            price: parseInt(document.getElementById('price').value),     // Lấy giá bán
            imagesBase64: base64ImageArray,
            condition: document.getElementById('condition').value,
            registrationPaper: document.getElementById('registrationPaper') ? document.getElementById('registrationPaper').value : '',
            inspectionExpiry: document.getElementById('inspectionExpiry') ? document.getElementById('inspectionExpiry').value : '',
            insuranceExpiry: document.getElementById('insuranceExpiry') ? document.getElementById('insuranceExpiry').value : '',
            accident: document.getElementById('accident').value,
            accidentDetails: document.getElementById('accidentDetails') ? document.getElementById('accidentDetails').value : '',
            paymentMethods: document.getElementById('paymentMethods').value,
            deliveryTime: document.getElementById('deliveryTime').value,
            viewingLocation: document.getElementById('viewingLocation').value,
            sellerName: document.getElementById('sellerName').value,
            sellerPhone: document.getElementById('sellerPhone').value,
            sellerAddress: document.getElementById('sellerAddress').value,
            sellerEmail: document.getElementById('sellerEmail').value
        };
        const storedCars = localStorage.getItem('carAds');
        let carAdsArray = storedCars ? JSON.parse(storedCars) : [];
        carAdsArray.push(carInfo);
        localStorage.setItem('carAds', JSON.stringify(carAdsArray));

        window.location.href = './cardsalespage.html?newCarId=' + carID;
    });

    const conditionSelect = document.getElementById('condition');
    const usedCarDetailsDiv = document.getElementById('usedCarDetails');
    if (conditionSelect && usedCarDetailsDiv) {
        conditionSelect.addEventListener('change', function() {
            usedCarDetailsDiv.style.display = this.value === 'used' ? 'block' : 'none';
        });
    }

    const accidentSelect = document.getElementById('accident');
    const accidentDetailsTextarea = document.getElementById('accidentDetails');
    if (accidentSelect && accidentDetailsTextarea) {
        accidentSelect.addEventListener('change', function() {
            accidentDetailsTextarea.style.display = this.value === 'yes' ? 'block' : 'none';
        });
    }
});