// salespage.js
document.addEventListener('DOMContentLoaded', function() {
    const carForm = document.getElementById('carForm');
    const imageUpload = document.getElementById('imageUpload');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    let base64ImageArray = [];

    function encodeImageFileAsURL(file, callback) {
        const reader = new FileReader();
        reader.onloadend = function() {
            callback(reader.result, file.name); // Pass filename for alt text or info
        }
        reader.readAsDataURL(file);
    }

    if (imageUpload && imagePreviewContainer) {
        imageUpload.addEventListener('change', function() {
            const files = this.files;
            if (files.length + base64ImageArray.length > 10) { // Giới hạn số lượng ảnh
                alert('Bạn chỉ có thể tải lên tối đa 10 hình ảnh.');
                // Clear the file input to allow re-selection
                this.value = ""; // Important for some browsers
                return;
            }

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file && file.type.startsWith('image/')) { // Check if it's an image
                    encodeImageFileAsURL(file, function(base64Img, fileName) {
                        const imgContainer = document.createElement('div');
                        imgContainer.style.position = 'relative';
                        imgContainer.style.marginRight = '10px';
                        imgContainer.style.marginBottom = '10px';
                        imgContainer.style.border = '1px solid #ddd';
                        imgContainer.style.padding = '2px';
                        imgContainer.style.display = 'inline-block'; // To line up horizontally

                        const img = document.createElement('img');
                        img.src = base64Img;
                        img.alt = fileName;
                        img.style.maxWidth = '100px';
                        img.style.maxHeight = '100px';
                        img.style.height = 'auto';
                        img.style.display = 'block';
                        img.style.objectFit = 'cover';


                        const removeBtn = document.createElement('button');
                        removeBtn.type = 'button'; // Prevent form submission
                        removeBtn.textContent = 'X';
                        removeBtn.title = 'Xóa ảnh này';
                        removeBtn.style.position = 'absolute';
                        removeBtn.style.top = '-5px';
                        removeBtn.style.right = '-5px';
                        removeBtn.style.background = 'rgba(255,0,0,0.7)';
                        removeBtn.style.color = 'white';
                        removeBtn.style.border = '1px solid white';
                        removeBtn.style.borderRadius = '50%';
                        removeBtn.style.cursor = 'pointer';
                        removeBtn.style.fontSize = '10px';
                        removeBtn.style.width = '18px';
                        removeBtn.style.height = '18px';
                        removeBtn.style.lineHeight = '15px'; // Adjust for vertical centering of 'X'
                        removeBtn.style.textAlign = 'center';
                        removeBtn.style.padding = '0';


                        removeBtn.onclick = function() {
                            const index = base64ImageArray.indexOf(base64Img);
                            if (index > -1) {
                                base64ImageArray.splice(index, 1);
                            }
                            imgContainer.remove();
                            // Re-enable file input if needed, or just allow adding more
                        };

                        imgContainer.appendChild(img);
                        imgContainer.appendChild(removeBtn);
                        imagePreviewContainer.appendChild(imgContainer);
                        base64ImageArray.push(base64Img);
                    });
                } else if (file) {
                    alert(`File ${file.name} không phải là hình ảnh và sẽ được bỏ qua.`);
                }
            }
             // Clear the file input to allow re-selection of the same file if removed
             this.value = "";
        });
    }

    if (carForm) {
        carForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const loggedInUserId = localStorage.getItem('loggedInUserId');
            if (!loggedInUserId) {
                alert('Vui lòng đăng nhập để đăng tin!');
                window.location.href = './login.html';
                return;
            }

            if (base64ImageArray.length === 0) {
                alert('Vui lòng tải lên ít nhất một hình ảnh cho xe.');
                imageUpload.focus();
                return;
            }


            const carID = Date.now().toString(); // Unique ID for the car

            const carInfo = {
                ID: carID,
                userId: loggedInUserId,
                brand: document.getElementById('brand').value,
                model: document.getElementById('model').value,
                year: parseInt(document.getElementById('year').value),
                seats: document.getElementById('seats').value,
                color: document.getElementById('color').value,
                mileage: parseInt(document.getElementById('mileage').value),
                price: parseInt(document.getElementById('price').value),
                imagesBase64: [...base64ImageArray], // Create a shallow copy
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
                sellerEmail: document.getElementById('sellerEmail') ? document.getElementById('sellerEmail').value : '',
                additionalInfo: document.getElementById('additionalInfo') ? document.getElementById('additionalInfo').value : '',
                postedDate: new Date().toISOString()
            };

            let userSpecificData = JSON.parse(localStorage.getItem('userSpecificData')) || {};
            if (!userSpecificData[loggedInUserId]) {
                userSpecificData[loggedInUserId] = { carAds: [], savedPosts: [], savedSearches: [], myReviews: [] };
            }
            if (!userSpecificData[loggedInUserId].carAds) {
                userSpecificData[loggedInUserId].carAds = [];
            }

            userSpecificData[loggedInUserId].carAds.push(carInfo);
            localStorage.setItem('userSpecificData', JSON.stringify(userSpecificData));

            alert('Đăng tin thành công!');
            base64ImageArray = []; // Reset for next ad
            if(imagePreviewContainer) imagePreviewContainer.innerHTML = ''; // Clear preview
            carForm.reset(); // Reset form fields

            // Reset display of conditional fields
            const usedCarDetailsDiv = document.getElementById('usedCarDetails');
            const accidentDetailsTextarea = document.getElementById('accidentDetails');
            if(usedCarDetailsDiv) usedCarDetailsDiv.style.display = 'none';
            if(accidentDetailsTextarea) accidentDetailsTextarea.style.display = 'none';


            window.location.href = './3.html'; // Redirect to the main page
        });
    }

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