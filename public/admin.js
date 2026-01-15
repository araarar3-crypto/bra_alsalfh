// API Base URL
const API_URL = '/api';

// تسجيل الدخول
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('token', data.token);
            showDashboard();
            loadStats();
            loadUsers();
            loadAds();
        } else {
            showError(data.error || 'خطأ في تسجيل الدخول');
        }
    } catch (error) {
        showError('خطأ في الاتصال بالخادم');
        console.error(error);
    }
});

// عرض لوحة التحكم
function showDashboard() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
}

// إخفاء لوحة التحكم
function hideDashboard() {
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('dashboard').style.display = 'none';
}

// تسجيل الخروج
function logout() {
    localStorage.removeItem('token');
    hideDashboard();
    document.getElementById('loginForm').reset();
}

// الحصول على التوكن
function getToken() {
    return localStorage.getItem('token');
}

// عرض الأخطاء
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// عرض الرسائل الناجحة
function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 5000);
}

// تحميل الإحصائيات
async function loadStats() {
    try {
        const response = await fetch(`${API_URL}/stats/general`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('onlineUsers').textContent = data.stats.onlineUsers;
            document.getElementById('totalVisits').textContent = data.stats.totalVisits;
            document.getElementById('avgPlaytime').textContent = data.stats.avgPlaytime + ' دقيقة';
            document.getElementById('totalUsers').textContent = data.stats.totalUsers;
        }
    } catch (error) {
        console.error('خطأ في تحميل الإحصائيات:', error);
    }
}

// تحميل الإعلانات
async function loadAds() {
    try {
        const response = await fetch(`${API_URL}/ads`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        
        const data = await response.json();
        
        if (data.success) {
            const adsList = document.getElementById('adsList');
            adsList.innerHTML = '';
            
            data.ads.forEach(ad => {
                const adDiv = document.createElement('div');
                adDiv.style.cssText = 'background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 15px;';
                adDiv.innerHTML = `
                    <h3>${ad.title}</h3>
                    <p>${ad.description}</p>
                    <img src="${ad.image_url}" style="max-width: 200px; border-radius: 8px; margin: 10px 0;">
                    <p>المشاهدات: ${ad.views} | الضغطات: ${ad.clicks}</p>
                    <button class="btn-danger" onclick="deleteAd(${ad.id})">حذف</button>
                `;
                adsList.appendChild(adDiv);
            });
        }
    } catch (error) {
        console.error('خطأ في تحميل الإعلانات:', error);
    }
}

// إضافة إعلان
document.getElementById('adForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', document.getElementById('adTitle').value);
    formData.append('description', document.getElementById('adDescription').value);
    formData.append('image', document.getElementById('adImage').files[0]);
    formData.append('link_url', document.getElementById('adLink').value);
    formData.append('start_date', document.getElementById('startDate').value);
    formData.append('end_date', document.getElementById('endDate').value);
    
    try {
        const response = await fetch(`${API_URL}/ads`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${getToken()}` },
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            showSuccess('تم إضافة الإعلان بنجاح');
            document.getElementById('adForm').reset();
            loadAds();
        } else {
            showError(data.error || 'خطأ في إضافة الإعلان');
        }
    } catch (error) {
        showError('خطأ في الاتصال بالخادم');
        console.error(error);
    }
});

// حذف إعلان
async function deleteAd(id) {
    if (!confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;
    
    try {
        const response = await fetch(`${API_URL}/ads/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        
        const data = await response.json();
        
        if (data.success) {
            showSuccess('تم حذف الإعلان بنجاح');
            loadAds();
        } else {
            showError(data.error || 'خطأ في حذف الإعلان');
        }
    } catch (error) {
        showError('خطأ في الاتصال بالخادم');
        console.error(error);
    }
}

// تحميل المستخدمين
async function loadUsers() {
    try {
        const response = await fetch(`${API_URL}/users`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        
        const data = await response.json();
        
        if (data.success) {
            const usersList = document.getElementById('usersList');
            usersList.innerHTML = '';
            
            data.users.forEach(user => {
                const li = document.createElement('li');
                li.className = 'user-item';
                li.innerHTML = `
                    <div>
                        <strong>${user.username || user.user_id}</strong>
                        <p style="color: #999; font-size: 12px;">من: ${user.country || 'غير معروف'}</p>
                    </div>
                    <button class="btn-danger" onclick="banUser('${user.user_id}')">حظر</button>
                `;
                usersList.appendChild(li);
            });
        }
    } catch (error) {
        console.error('خطأ في تحميل المستخدمين:', error);
    }
}

// حظر مستخدم
async function banUser(userId) {
    const reason = prompt('سبب الحظر:');
    if (!reason) return;
    
    try {
        const response = await fetch(`${API_URL}/users/${userId}/ban`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reason })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showSuccess('تم حظر المستخدم بنجاح');
            loadUsers();
        } else {
            showError(data.error || 'خطأ في حظر المستخدم');
        }
    } catch (error) {
        showError('خطأ في الاتصال بالخادم');
        console.error(error);
    }
}

// تبديل التبويبات
function switchTab(tabName) {
    // إخفاء جميع التبويبات
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // إزالة active من جميع الأزرار
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // عرض التبويب المختار
    document.getElementById(tabName).classList.add('active');
    
    // إضافة active للزر المختار
    event.target.classList.add('active');
}

// التحقق من تسجيل الدخول عند تحميل الصفحة
window.addEventListener('load', () => {
    const token = getToken();
    if (token) {
        showDashboard();
        loadStats();
        loadUsers();
        loadAds();
        
        // تحديث الإحصائيات كل 30 ثانية
        setInterval(loadStats, 30000);
    }
});
