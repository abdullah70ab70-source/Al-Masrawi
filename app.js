// دالة جلب النص القرآني وإظهاره
async function loadSurahText(surahId) {
    const container = document.getElementById('quran-text-content');
    
    if (quranTextCache[surahId]) {
        container.innerHTML = quranTextCache[surahId];
        if(isFocusMode) {
            window.scrollTo({ top: 0, behavior: 'auto' });
            currentScroll = 0; targetScroll = 0;
        }
        return;
    }

    container.innerHTML = '<div style="margin: 50px auto; display: flex; justify-content: center; color: var(--accent-gold);">' + icons.loading + '</div>';
    
    try {
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahId}`);
        const data = await response.json();
        
        let textHTML = ''; 
        
        data.data.ayahs.forEach(ayah => {
            let text = ayah.text;
            
            // التحقق من وجود البسملة في أول آية
            if (surahId !== 1 && surahId !== 9 && ayah.numberInSurah === 1) {
                // الكشف عن البسملة أياً كان تشكيلها
                const bismillahRegex = /^(بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ|بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ|بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ)\s*/;
                const match = text.match(bismillahRegex);
                
                if (match) {
                    // وضع البسملة في سطر منفصل وموسع
                    textHTML += `<div style="font-size: 1.8rem; margin: 20px 0; color: var(--text-main); display: block; width: 100%; text-align: center; border-bottom: 1px solid var(--glass-border); padding-bottom: 20px;">${match[0].trim()}</div>`;
                    // إزالة البسملة من نص الآية الأولى
                    text = text.replace(match[0], '');
                }
            }
            
            // إضافة نص الآية (بدون البسملة إذا كانت قد حُذفت)
            if (text.trim().length > 0) {
                textHTML += `<span>${text} <span class="verse-end">﴿${ayah.numberInSurah}﴾</span> </span>`;
            }
        });

        quranTextCache[surahId] = textHTML;
        container.innerHTML = textHTML;
        if(isFocusMode) {
            window.scrollTo({ top: 0, behavior: 'auto' });
            currentScroll = 0; targetScroll = 0;
        }
    } catch (error) {
        container.innerHTML = '<div style="color: var(--text-muted); font-family: Cairo, sans-serif; margin-top: 50px; font-size: 1rem;">يرجى الاتصال بالإنترنت لعرض النص القرآني.</div>';
    }
}