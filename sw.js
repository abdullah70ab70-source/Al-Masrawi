const CACHE_NAME = 'egy-quran-v5'; // تم تغيير الإصدار ليتم تحديث الكاش عند المستخدمين

// قائمة بالملفات الأساسية
const ASSETS = [
    './',
    './index.html',
    './icon.png',
    './manifest.json',
    './style.css',
    './app.js',
    './maasarawi.jpg', // صورة الشيخ المعصراوي
    './maasarawi_1.json' // ملف بيانات السور الخاص بالشيخ المعصراوي
];

// حدث التثبيت: تخزين الملفات بشكل آمن لا يتأثر لو كان هناك ملف مفقود
self.addEventListener('install', (e) => {
    self.skipWaiting(); // إجبار المتصفح على تشغيل النسخة الجديدة فوراً
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return Promise.all(
                ASSETS.map(url => {
                    return cache.add(url).catch(err => console.log('تم تخطي هذا الملف:', url));
                })
            );
        })
    );
});

// حدث التفعيل: مسح الكاش القديم
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.map((key) => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim(); // السيطرة على الصفحة فوراً
});

// حدث الجلب (Fetch) 
self.addEventListener('fetch', (e) => {
    // 💡 (الحل) استثناء الصوتيات والبث المباشر (الراديو) تماماً من أوامر الحفظ
    if (e.request.url.includes('.mp3') || e.request.url.includes('stream') || e.request.url.includes('radio')) {
        return; // العودة فوراً وترك المتصفح يتعامل مع الرابط مباشرة من الإنترنت
    }

    // 1. معالجة "الريفريش" والسحب للأسفل عند انقطاع الإنترنت
    if (e.request.mode === 'navigate') {
        e.respondWith(
            fetch(e.request).catch(() => {
                // إذا كان النت فاصلاً، اعرض الصفحة المحفوظة إجبارياً
                return caches.match('./index.html') || caches.match('./');
            })
        );
        return;
    }

    // 2. معالجة باقي الملفات (الصور والأكواد)
    e.respondWith(
        caches.match(e.request, { ignoreSearch: true }).then((cachedResponse) => {
            return cachedResponse || fetch(e.request);
        })
    );
});