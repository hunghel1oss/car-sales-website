// file js/car-details.js
document.addEventListener('DOMContentLoaded', function() {
    const selectedCarId = localStorage.getItem('selectedCarIdToView');
    const selectedCarOwnerId = localStorage.getItem('selectedCarOwnerIdToView'); // ID của người đăng tin

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
        accidentDetailsGroup: document.getElementById('accidentDetailsGroup'),
        saveAdButton: document.getElementById('saveAdButton'),
        saveAdButtonText: document.getElementById('saveAdButtonText'),
        // Nút addToCartButton đã được xóa khỏi HTML, không cần selector ở đây nữa

        commentForm: document.getElementById('commentForm'),
        commentText: document.getElementById('commentText'),
        commentsList: document.getElementById('commentsList'),
        commentCount: document.getElementById('commentCount'),
        commentLoginPrompt: document.getElementById('commentLoginPrompt'),
        noCommentsMessage: document.querySelector('#commentsList .no-comments'),
        carCommentsSection: document.querySelector('.car-comments-section'),

        // SELECTORS CHO TRẠNG THÁI XE
        currentCarStatusText: document.getElementById('currentCarStatusText'),
        ownerEditStatusSection: document.getElementById('ownerEditStatusSection'),
        editCarStatusSelect: document.getElementById('editCarStatusSelect'),
        carStatusBar: document.querySelector('.car-status-bar')
    };

    const detailsContainer = document.querySelector('.card-details-container');

    if (!selectedCarId) {
        if(detailsContainer) detailsContainer.innerHTML = '<h1>Không có xe được chọn</h1><p>Vui lòng chọn một chiếc xe từ danh sách để xem chi tiết.</p><p><a href="3.html" class="back-link">« Quay lại trang chủ</a></p>';
        if(elements.saveAdButton) elements.saveAdButton.style.display = 'none';
        if(elements.carCommentsSection) elements.carCommentsSection.style.display = 'none';
        if(elements.carStatusBar) elements.carStatusBar.style.display = 'none';
        return;
    }

    // --- LOGIC LƯU TIN (Giữ nguyên) ---
    function updateSaveButtonState() {
        // ... (Code này giữ nguyên như bạn đã có)
        if (!elements.saveAdButton || !elements.saveAdButtonText || !selectedCarId) { if(elements.saveAdButton) elements.saveAdButton.style.display = 'none'; return; }
        elements.saveAdButton.style.display = 'inline-flex';
        const loggedInUserId = localStorage.getItem('loggedInUserId');
        const saveAdButtonIcon = elements.saveAdButton.querySelector('i');
        if (!loggedInUserId) { elements.saveAdButtonText.textContent = "Lưu tin"; if (saveAdButtonIcon) saveAdButtonIcon.className = 'bx bx-heart'; elements.saveAdButton.title = "Đăng nhập để lưu tin"; elements.saveAdButton.disabled = false; return; }
        elements.saveAdButton.disabled = false;
        if (window.HuanHungCarshopApp && typeof window.HuanHungCarshopApp.isCarSaved === 'function') {
            if (window.HuanHungCarshopApp.isCarSaved(selectedCarId)) { elements.saveAdButtonText.textContent = "Bỏ lưu tin"; if (saveAdButtonIcon) saveAdButtonIcon.className = 'bx bxs-heart'; elements.saveAdButton.title = "Bỏ lưu tin này"; }
            else { elements.saveAdButtonText.textContent = "Lưu tin"; if (saveAdButtonIcon) saveAdButtonIcon.className = 'bx bx-heart'; elements.saveAdButton.title = "Lưu tin này"; }
        } else { console.warn("HuanHungCarshopApp.isCarSaved function not available."); elements.saveAdButton.disabled = true; }
    }
    if (elements.saveAdButton) {
        elements.saveAdButton.addEventListener('click', () => {
            // ... (Code này giữ nguyên)
            if (!selectedCarId) return; const loggedInUserId = localStorage.getItem('loggedInUserId'); if (!loggedInUserId) { alert("Vui lòng đăng nhập để lưu tin!"); return; } if (window.HuanHungCarshopApp && typeof window.HuanHungCarshopApp.toggleSaveCar === 'function') { window.HuanHungCarshopApp.toggleSaveCar(selectedCarId, elements.saveAdButton, elements.saveAdButtonText); } else { console.error("HuanHungCarshopApp.toggleSaveCar function not available."); }
        });
    }

    // --- LOGIC BÌNH LUẬN (Giữ nguyên) ---
    // ... (Toàn bộ code cho getCarComments, saveCarComment, displayComments, handleCommentSubmit, checkLoginForCommenting giữ nguyên như bạn đã có)
    const getCurrentCarIdForComment = () => selectedCarId;
    function getCarComments(carId) { if (!carId) return []; const allComments = JSON.parse(localStorage.getItem('carComments')) || {}; return allComments[carId] || []; }
    function saveCarComment(carId, comment) { if (!carId || !comment) return; const allComments = JSON.parse(localStorage.getItem('carComments')) || {}; if (!allComments[carId]) { allComments[carId] = []; } allComments[carId].unshift(comment); localStorage.setItem('carComments', JSON.stringify(allComments)); }
    function displayComments() { const carId = getCurrentCarIdForComment(); if (!elements.commentsList || !carId) return; const comments = getCarComments(carId); elements.commentsList.innerHTML = ''; if (elements.commentCount) { elements.commentCount.textContent = comments.length; } if (comments.length === 0) { if (elements.noCommentsMessage) elements.noCommentsMessage.style.display = 'block'; return; } if (elements.noCommentsMessage) elements.noCommentsMessage.style.display = 'none'; comments.forEach(comment => { const commentDiv = document.createElement('div'); commentDiv.classList.add('comment-item'); const authorName = comment.authorName || 'Ẩn danh'; const avatarLetter = authorName.charAt(0).toUpperCase(); const commentTextHtml = comment.text.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/\n/g, '<br>'); commentDiv.innerHTML = ` <div class="comment-header"> <div class="comment-avatar">${avatarLetter}</div> <span class="comment-author">${authorName}</span> <span class="comment-meta">${new Date(comment.timestamp).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span> </div> <div class="comment-body">${commentTextHtml}</div>`; elements.commentsList.appendChild(commentDiv); }); }
    function handleCommentSubmit(event) { event.preventDefault(); const carId = getCurrentCarIdForComment(); const loggedInUserId = localStorage.getItem('loggedInUserId'); if (!loggedInUserId) return; if (!carId || !elements.commentText) return; const commentTextValue = elements.commentText.value.trim(); if (commentTextValue === "") { alert("Vui lòng nhập nội dung bình luận."); elements.commentText.focus(); return; } let authorName = 'Người dùng'; const users = JSON.parse(localStorage.getItem('users')) || []; const currentUser = users.find(user => user.id && user.id.toString() === loggedInUserId); if (currentUser && currentUser.fullname) authorName = currentUser.fullname; const newComment = { commentId: `cmt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, userId: loggedInUserId, authorName: authorName, text: commentTextValue, timestamp: new Date().toISOString() }; saveCarComment(carId, newComment); elements.commentText.value = ''; displayComments(); }
    function checkLoginForCommenting() { const loggedInUserId = localStorage.getItem('loggedInUserId'); const submitButton = elements.commentForm ? elements.commentForm.querySelector('button[type="submit"]') : null; if (elements.commentForm && elements.commentLoginPrompt && elements.commentText && submitButton) { if (loggedInUserId) { elements.commentForm.style.display = 'block'; elements.commentLoginPrompt.style.display = 'none'; elements.commentText.disabled = false; submitButton.disabled = false; } else { elements.commentForm.style.display = 'none'; elements.commentLoginPrompt.style.display = 'block'; elements.commentText.disabled = true; submitButton.disabled = true; } } }
    if (elements.commentForm) { elements.commentForm.addEventListener('submit', handleCommentSubmit); }


    // --- LOGIC HIỂN THỊ VÀ CHỈNH SỬA TRẠNG THÁI XE ---
    function updateCarStatusDisplay(status) {
        if (!elements.currentCarStatusText) return;
        let statusText = "Không rõ";
        let statusClass = "status-loading";

        switch (status) {
            case 'available': statusText = "Còn xe"; statusClass = "status-available"; break;
            case 'pending': statusText = "Đang giao dịch"; statusClass = "status-pending"; break;
            case 'sold': statusText = "Đã bán"; statusClass = "status-sold"; break;
        }
        elements.currentCarStatusText.textContent = statusText;
        elements.currentCarStatusText.className = 'status-text'; // Reset classes
        elements.currentCarStatusText.classList.add(statusClass);

        // Cập nhật giá trị cho select nếu người dùng là chủ xe và select đang hiển thị
        if (elements.editCarStatusSelect && elements.ownerEditStatusSection.style.display !== 'none') {
            elements.editCarStatusSelect.value = status || 'available';
        }
    }

    function handleStatusChange(event) {
        const newStatus = event.target.value;
        const loggedInUserId = localStorage.getItem('loggedInUserId');

        // selectedCarOwnerId được lấy từ localStorage ở đầu file
        if (!loggedInUserId || loggedInUserId !== selectedCarOwnerId) {
            alert("Bạn không có quyền thay đổi trạng thái này.");
            // Revert select về giá trị cũ
            const userSpecificData = JSON.parse(localStorage.getItem('userSpecificData')) || {};
            const ownerData = userSpecificData[selectedCarOwnerId]; // Cần selectedCarOwnerId ở đây
            if (ownerData && ownerData.carAds) {
                const carDetails = ownerData.carAds.find(car => car.ID === selectedCarId);
                if (carDetails && elements.editCarStatusSelect) {
                    elements.editCarStatusSelect.value = carDetails.status || 'available';
                }
            }
            return;
        }

        if (selectedCarId && selectedCarOwnerId) {
            let userSpecificData = JSON.parse(localStorage.getItem('userSpecificData')) || {};
            if (userSpecificData[selectedCarOwnerId] && userSpecificData[selectedCarOwnerId].carAds) {
                const carIndex = userSpecificData[selectedCarOwnerId].carAds.findIndex(car => car.ID === selectedCarId);
                if (carIndex > -1) {
                    userSpecificData[selectedCarOwnerId].carAds[carIndex].status = newStatus;
                    userSpecificData[selectedCarOwnerId].carAds[carIndex].updatedDate = new Date().toISOString();
                    localStorage.setItem('userSpecificData', JSON.stringify(userSpecificData));
                    updateCarStatusDisplay(newStatus);
                    alert("Đã cập nhật trạng thái xe!");
                } else {
                    alert("Lỗi: Không tìm thấy xe để cập nhật.");
                }
            }
        }
    }

    if (elements.editCarStatusSelect) {
        elements.editCarStatusSelect.addEventListener('change', handleStatusChange);
    }
    // --- KẾT THÚC LOGIC TRẠNG THÁI XE ---

    // --- TẢI VÀ HIỂN THỊ CHI TIẾT XE ---
    function loadAndDisplayCarDetails() {
        if (!selectedCarOwnerId) {
            if(detailsContainer) detailsContainer.innerHTML = '<h1>Lỗi</h1><p>Thiếu thông tin người đăng để tải chi tiết xe.</p><p><a href="3.html" class="back-link">« Quay lại trang chủ</a></p>';
            if(elements.saveAdButton) elements.saveAdButton.style.display = 'none';
            if(elements.carCommentsSection) elements.carCommentsSection.style.display = 'none';
            if(elements.carStatusBar) elements.carStatusBar.style.display = 'none';
            return;
        }

        const userSpecificData = JSON.parse(localStorage.getItem('userSpecificData')) || {};
        const ownerData = userSpecificData[selectedCarOwnerId];

        if (ownerData && ownerData.carAds) {
            const carDetails = ownerData.carAds.find(car => car.ID === selectedCarId);

            if (carDetails) {
                document.title = `${carDetails.brand || 'Xe'} ${carDetails.model || ''} - Chi Tiết`;
                elements.brand.textContent = carDetails.brand || 'N/A';
                elements.model.textContent = carDetails.model || 'N/A';
                elements.year.textContent = carDetails.year || 'N/A';
                elements.seats.textContent = carDetails.seats ? `${carDetails.seats} chỗ` : 'N/A';
                elements.color.textContent = carDetails.color || 'N/A';
                elements.mileage.textContent = carDetails.mileage != null ? `${carDetails.mileage.toLocaleString('vi-VN')} km` : 'N/A';
                elements.price.textContent = carDetails.price != null ? `${carDetails.price.toLocaleString('vi-VN')} VNĐ` : 'Thỏa thuận';

                if (elements.imagePreviewContainer) {
                    elements.imagePreviewContainer.innerHTML = '';
                    if (carDetails.imagesBase64 && carDetails.imagesBase64.length > 0) {
                        carDetails.imagesBase64.forEach(base64Img => {
                            const img = document.createElement('img');
                            img.src = base64Img;
                            img.alt = `Ảnh ${carDetails.brand || ''} ${carDetails.model || ''}`;
                            elements.imagePreviewContainer.appendChild(img);
                        });
                    } else {
                        elements.imagePreviewContainer.innerHTML = '<img src="./img/car-placeholder.png" alt="Không có ảnh" style="max-width:100%;height:auto;">';
                    }
                }

                elements.condition.textContent = carDetails.condition === 'new' ? 'Xe mới' : (carDetails.condition === 'used' ? 'Xe cũ (đã qua sử dụng)' : 'N/A');
                if (elements.usedCarSpecificDetailsDiv) {
                    if (carDetails.condition === 'used') {
                        elements.usedCarSpecificDetailsDiv.style.display = 'block';
                        elements.registrationPaper.textContent = carDetails.registrationPaper === 'yes' ? 'Đầy đủ, hợp lệ' : (carDetails.registrationPaper === 'no' ? 'Không đầy đủ/chưa hợp lệ' : 'Không rõ');
                        elements.inspectionExpiry.textContent = carDetails.inspectionExpiry ? new Date(carDetails.inspectionExpiry).toLocaleDateString('vi-VN') : 'Không có / Không rõ';
                        elements.insuranceExpiry.textContent = carDetails.insuranceExpiry ? new Date(carDetails.insuranceExpiry).toLocaleDateString('vi-VN') : 'Không có / Không rõ';
                    } else {
                        elements.usedCarSpecificDetailsDiv.style.display = 'none';
                    }
                }
                elements.accident.textContent = carDetails.accident === 'no' ? 'Chưa từng bị tai nạn/sửa chữa lớn' : (carDetails.accident === 'yes' ? 'Đã từng bị tai nạn/sửa chữa lớn' : 'N/A');
                if (elements.accidentDetailsGroup) {
                    if (carDetails.accident === 'yes' && carDetails.accidentDetails) {
                        elements.accidentDetails.textContent = carDetails.accidentDetails;
                        elements.accidentDetailsGroup.style.display = 'block';
                    } else {
                        elements.accidentDetailsGroup.style.display = 'none';
                    }
                }
                elements.additionalInfo.textContent = carDetails.additionalInfo || 'Không có mô tả thêm.';
                let paymentText = 'N/A';
                if (carDetails.paymentMethods) {
                    if (Array.isArray(carDetails.paymentMethods)) {
                         paymentText = carDetails.paymentMethods.map(method => {
                            switch (method.toLowerCase()) {
                                case "cash": return "Tiền mặt";
                                case "transfer": return "Chuyển khoản";
                                case "installment": return "Hỗ trợ trả góp";
                                default: return method;
                            }
                        }).join(', ');
                    } else {
                         switch (carDetails.paymentMethods.toLowerCase()) {
                            case "cash": paymentText = "Tiền mặt"; break;
                            case "transfer": paymentText = "Chuyển khoản"; break;
                            case "installment": paymentText = "Hỗ trợ trả góp"; break;
                            case "all": paymentText = "Tất cả các phương thức trên"; break;
                            default: paymentText = carDetails.paymentMethods;
                        }
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

                // Hiển thị và thiết lập trạng thái xe
                if(elements.carStatusBar) elements.carStatusBar.style.display = 'flex';
                const currentCarStatus = carDetails.status || 'available';
                updateCarStatusDisplay(currentCarStatus);

                const loggedInUserId = localStorage.getItem('loggedInUserId');
                // selectedCarOwnerId đã được lấy từ localStorage ở đầu file
                if (loggedInUserId && selectedCarOwnerId && loggedInUserId === selectedCarOwnerId) {
                    if (elements.ownerEditStatusSection) elements.ownerEditStatusSection.style.display = 'flex';
                    if (elements.editCarStatusSelect) elements.editCarStatusSelect.value = currentCarStatus;
                } else {
                    if (elements.ownerEditStatusSection) elements.ownerEditStatusSection.style.display = 'none';
                }

                if(elements.carCommentsSection) elements.carCommentsSection.style.display = 'block';
                updateSaveButtonState();
                checkLoginForCommenting();
                displayComments();

            } else {
                if(detailsContainer) detailsContainer.innerHTML = '<h1>Lỗi</h1><p>Không tìm thấy thông tin chi tiết cho chiếc xe này.</p>';
                if(elements.saveAdButton) elements.saveAdButton.style.display = 'none';
                if(elements.carCommentsSection) elements.carCommentsSection.style.display = 'none';
                if(elements.carStatusBar) elements.carStatusBar.style.display = 'none';
            }
        } else {
            if(detailsContainer) detailsContainer.innerHTML = '<h1>Lỗi</h1><p>Không tìm thấy dữ liệu của người đăng tin.</p>';
            if(elements.saveAdButton) elements.saveAdButton.style.display = 'none';
            if(elements.carCommentsSection) elements.carCommentsSection.style.display = 'none';
            if(elements.carStatusBar) elements.carStatusBar.style.display = 'none';
        }
    }
    loadAndDisplayCarDetails();

    if (!window.HuanHungCarshopApp || typeof window.HuanHungCarshopApp.isCarSaved !== 'function') {
        setTimeout(() => {
            if (window.HuanHungCarshopApp && typeof window.HuanHungCarshopApp.isCarSaved === 'function') {
                 updateSaveButtonState();
            } else {
                console.error("HuanHungCarshopApp is still not available after delay for save button state.");
            }
            checkLoginForCommenting();
        }, 300);
    }
    const currentYearDetailsSpan = document.getElementById('currentYearDetails');
    if (currentYearDetailsSpan) currentYearDetailsSpan.textContent = new Date().getFullYear();
});