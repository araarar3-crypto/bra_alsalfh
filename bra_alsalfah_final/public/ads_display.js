// نظام عرض الإعلانات الذكي
(function() {
    const API_URL = '/api';
    
    async function loadAds() {
        try {
            const response = await fetch(`${API_URL}/ads`);
            const data = await response.json();
            
            if (data.success && data.ads.length > 0) {
                displayAd(data.ads[0]); // عرض أول إعلان نشط
            }
        } catch (error) {
            console.error('خطأ في تحميل الإعلانات:', error);
        }
    }

    function displayAd(ad) {
        const adContainer = document.createElement('div');
        adContainer.id = 'smart-ad-container';
        adContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            font-family: sans-serif;
            box-shadow: 0 2px 10px rgba(0,0,0,0.5);
        `;

        adContainer.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px; max-width: 1200px; width: 100%;">
                <img src="${ad.image_url}" style="height: 40px; border-radius: 5px;">
                <div style="flex-grow: 1;">
                    <strong style="display: block; font-size: 14px;">${ad.title}</strong>
                    <p style="margin: 0; font-size: 12px; opacity: 0.9;">${ad.description}</p>
                </div>
                ${ad.link_url ? `<a href="${ad.link_url}" target="_blank" style="background: #667eea; color: white; padding: 5px 15px; border-radius: 5px; text-decoration: none; font-size: 12px; font-weight: bold;">زيارة</a>` : ''}
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; font-size: 20px;">&times;</button>
            </div>
        `;

        document.body.prepend(adContainer);
        
        // تتبع المشاهدة
        fetch(`${API_URL}/ads/track/view`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ adId: ad.id })
        });
    }

    // تتبع الزيارة العامة
    function trackVisit() {
        const userId = localStorage.getItem('userId') || 'guest_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('userId', userId);
        
        fetch(`${API_URL}/stats/track/visit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, country: 'SA' })
        });
    }

    window.addEventListener('load', () => {
        loadAds();
        trackVisit();
    });
})();
