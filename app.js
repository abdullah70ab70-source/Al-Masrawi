let toastTimeout;
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 2000);
}

function closeResumeBanner() { document.getElementById('resume-banner').classList.remove('show'); }
function resumePlayback() {
    closeResumeBanner();
    if(window.resumeData) playSurah(window.resumeData.id, window.resumeData.url);
}

function closeInstallBanner() { document.getElementById('install-banner').classList.remove('show'); }

const surahNamesEn = [
    "", "Al-Fatihah", "Al-Baqarah", "Ali 'Imran", "An-Nisa", "Al-Ma'idah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus", "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Taha",
    "Al-Anbiya", "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan", "Ash-Shu'ara", "An-Naml", "Al-Qasas", "Al-'Ankabut", "Ar-Rum", "Luqman", "As-Sajdah", "Al-Ahzab", "Saba", "Fatir", "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir",
    "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf", "Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid", "Al-Mujadila", "Al-Hashr", "Al-Mumtahanah",
    "As-Saff", "Al-Jumu'ah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij", "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba", "An-Nazi'at", "'Abasa",
    "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiyah", "Al-Fajr", "Al-Balad", "Ash-Shams", "Al-Layl", "Ad-Duhaa", "Ash-Sharh", "At-Tin", "Al-'Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-'Adiyat",
    "Al-Qari'ah", "At-Takathur", "Al-'Asr", "Al-Humazah", "Al-Fil", "Quraysh", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr", "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"
];

const translations = {
    ar: { langLabel: "EN", sheikhPrefix: "الشيخ", surahPrefix: "سورة", downloading: "جاري تحميل", downloadComplete: "تم التحميل بنجاح!", resumeBtn: "متابعة الاستماع", cancelBtn: "إلغاء", installTitle: "تثبيت تطبيق Egy Quran", installDesc: "تجربة استماع أسرع وتعمل بدون إنترنت", installBtn: "تثبيت" },
    en: { langLabel: "AR", sheikhPrefix: "Sheikh", surahPrefix: "Surah", downloading: "Downloading", downloadComplete: "Download Complete!", resumeBtn: "Resume Listening", cancelBtn: "Cancel", installTitle: "Install Egy Quran App", installDesc: "Faster experience with offline support", installBtn: "Install" }
};
let currentLang = 'ar';

const recitersList = [ { id: "maasarawi", nameAr: "أحمد عيسى المعصراوي", nameEn: "Ahmed Issa Al-Maasarawi", image: "maasarawi.jpg" } ];
const editionsConfig = { "maasarawi": { 1: { pillAr: "حفص عن عاصم", pillEn: "Hafs A'n Asim", file: "maasarawi_1.json", descAr: "المصحف المرتل", descEn: "Murattal" } } };

const icons = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>',
    loading: '<svg class="loading-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path></svg>',
    sun: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>',
    moon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>'
};

let audioInstance = new Audio(); audioInstance.crossOrigin = "anonymous"; 
let audioCtx, gainNode, audioSource;

function initAudioBoost() {
    try {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioCtx = new AudioContext(); audioSource = audioCtx.createMediaElementSource(audioInstance);
                gainNode = audioCtx.createGain(); gainNode.gain.value = 3.5;
                audioSource.connect(gainNode); gainNode.connect(audioCtx.destination);
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(e => console.log(e));
    } catch (e) { console.log("Audio API Init Error:", e); }
}

let currentTheme = 'light', currentSheikhId = "maasarawi", currentEdition = 1;
let activeSurahsData = [], playingSurahId = null, playingSheikhId = null, playingEditionId = null, isBuffering = false;
let isFocusMode = false;
let activeDownloads = {}; let savedReciterEditions = {}; let playbackMode = 'autonext'; let playbackMenuOpen = false;

// متغيرات التمرير التلقائي الناعم
let isUserScrolling = false;
let userInteractionTimeout;
let targetScroll = 0;
let currentScroll = 0;
let scrollRafId = null;

function resetUserInteraction() {
    isUserScrolling = true;
    clearTimeout(userInteractionTimeout);
    userInteractionTimeout = setTimeout(() => { 
        isUserScrolling = false; 
        if (isFocusMode) currentScroll = window.scrollY; 
    }, 3500); 
}

window.addEventListener('touchstart', resetUserInteraction, {passive: true});
window.addEventListener('touchmove', resetUserInteraction, {passive: true});
window.addEventListener('wheel', resetUserInteraction, {passive: true});
window.addEventListener('mousedown', resetUserInteraction, {passive: true});

function updateScrollLoop() {
    if (isFocusMode) {
        if (!isUserScrolling) {
            currentScroll += (targetScroll - currentScroll) * 0.03; 
            if (Math.abs(targetScroll - currentScroll) > 0.5) {
                window.scrollTo(0, currentScroll);
            }
        } else {
            currentScroll = window.scrollY;
        }
        scrollRafId = requestAnimationFrame(updateScrollLoop);
    }
}

const quranTextCache = {};

// التعديل الجديد والأقوى لدالة جلب النص القرآني
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
            let ayahText = ayah.text;
            let introHTML = '';
            
            // فصل الجملة الاستهلالية من الآية الأولى (باستثناء الفاتحة 1 والتوبة 9)
            if (surahId !== 1 && surahId !== 9 && ayah.numberInSurah === 1) {
                // تقسيم النص لأجزاء بناءً على أي مسافة أو سطر جديد
                let words = ayahText.trim().split(/\s+/);
                
                // البسملة تتكون دائماً من أول 4 كلمات
                if (words.length > 4) {
                    let basmalaText = words.slice(0, 4).join(' '); // أول 4 كلمات
                    let remainingText = words.slice(4).join(' ');  // باقي الآية
                    
                    introHTML = `<div class="api-intro-line" style="display: block; width: 100%; text-align: center; margin-bottom: 20px; font-size: 1.2em; color: var(--accent-gold); font-weight: bold;">${basmalaText}</div>`;
                    ayahText = remainingText;
                } else if (words.length === 4) {
                    // في الحالات النادرة التي تكون فيها الآية الأولى هي البسملة فقط
                    introHTML = `<div class="api-intro-line" style="display: block; width: 100%; text-align: center; margin-bottom: 20px; font-size: 1.2em; color: var(--accent-gold); font-weight: bold;">${ayahText}</div>`;
                    ayahText = ''; 
                }
            }

            // إضافة الجملة الاستهلالية ثم الآية إن وجدت
            if (ayahText.trim() !== '') {
                textHTML += `${introHTML}<span>${ayahText} <span class="verse-end">﴿${ayah.numberInSurah}﴾</span> </span>`;
            } else {
                textHTML += `${introHTML}`;
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

function getSurahName(id, nameAr) { return currentLang === 'ar' ? nameAr : surahNamesEn[id]; }

function updateHeaderUI() {
    const s = recitersList.find(r => r.id === currentSheikhId);
    if (s) {
        document.getElementById('header-avatar-img').src = s.image;
        document.getElementById('main-title').innerHTML = `${translations[currentLang].sheikhPrefix} <strong>${currentLang === 'ar' ? s.nameAr : s.nameEn}</strong>`;
        const editionDesc = editionsConfig[currentSheikhId] && editionsConfig[currentSheikhId][currentEdition] ? (currentLang === 'ar' ? editionsConfig[currentSheikhId][currentEdition].descAr : editionsConfig[currentSheikhId][currentEdition].descEn) : "";
        document.getElementById('header-subtitle').innerText = editionDesc;
    }
}

function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr'; document.documentElement.lang = currentLang;
    document.documentElement.style.setProperty('--dir', document.documentElement.dir);
    document.getElementById('lang-label').innerText = translations[currentLang].langLabel;
    document.getElementById('resume-btn-yes').innerText = translations[currentLang].resumeBtn; document.getElementById('resume-btn-no').innerText = translations[currentLang].cancelBtn;
    document.getElementById('install-title').innerText = translations[currentLang].installTitle; document.getElementById('install-desc').innerText = translations[currentLang].installDesc; document.getElementById('install-action-btn').innerText = translations[currentLang].installBtn;
    updateHeaderUI(); setPlaybackMode(playbackMode);
    if (playingSurahId) { const sData = activeSurahsData.find(s => s.id === playingSurahId); if(sData) document.getElementById('player-track-title').innerText = `${translations[currentLang].surahPrefix} ${getSurahName(sData.id, sData.name)}`; }
    renderEditionDropdown(); if (activeSurahsData && activeSurahsData.length > 0) renderSurahsList();
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.className = currentTheme === 'dark' ? 'dark-theme' : '';
    document.getElementById('theme-toggle-btn').innerHTML = currentTheme === 'dark' ? icons.moon : icons.sun;
}

function toggleFocusMode() {
    isFocusMode = !isFocusMode;
    const focusBtn = document.getElementById('focus-toggle-btn');
    
    if (isFocusMode) {
        document.body.classList.add('focus-mode-active');
        if (focusBtn) focusBtn.classList.add('active-feature');
        showToast(currentLang === 'ar' ? 'تم تفعيل وضع الاستماع الهادئ' : 'Focus Mode Enabled');
        
        if(!playingSurahId) {
            document.getElementById('quran-text-content').innerHTML = '<div style="margin-top:50px; font-size:1.2rem; color:var(--text-muted); font-family: Cairo, sans-serif;">الرجاء تشغيل سورة أولاً للقراءة...</div>';
        } else {
            window.scrollTo({ top: 0, behavior: 'auto' });
            currentScroll = 0; targetScroll = 0;
        }
        
        if (!scrollRafId) updateScrollLoop();

    } else {
        document.body.classList.remove('focus-mode-active');
        if (focusBtn) focusBtn.classList.remove('active-feature');
        showToast(currentLang === 'ar' ? 'تم إيقاف وضع الاستماع الهادئ' : 'Focus Mode Disabled');
        
        if (scrollRafId) { cancelAnimationFrame(scrollRafId); scrollRafId = null; }
    }
    syncUIWithAudioState(); 
}

function togglePlaybackMenu(event) {
    if(event) event.stopPropagation();
    playbackMenuOpen = !playbackMenuOpen;
    const menu = document.getElementById('playback-menu');
    if (playbackMenuOpen) { menu.classList.add('show'); } else { menu.classList.remove('show'); }
}

document.addEventListener('click', (e) => { if (playbackMenuOpen && !e.target.closest('#playback-wrapper')) togglePlaybackMenu(); });

function setPlaybackMode(mode, event) {
    if(event) event.stopPropagation(); playbackMode = mode; audioInstance.loop = (mode === 'loop');
    const btn = document.getElementById('btn-playback-mode'); const textSpan = document.getElementById('playback-text'); const iconSvg = document.getElementById('playback-icon');
    if (mode === 'autonext') {
        btn.classList.add('active-feature'); textSpan.innerText = currentLang === 'ar' ? 'تلقائي' : 'Auto'; iconSvg.innerHTML = '<path d="M8 6h13"></path><path d="M8 12h13"></path><path d="M8 18h13"></path><path d="M3 6h.01"></path><path d="M3 12h.01"></path><path d="M3 18h.01"></path>';
    } else if (mode === 'loop') {
        btn.classList.add('active-feature'); textSpan.innerText = currentLang === 'ar' ? 'تكرار' : 'Loop'; iconSvg.innerHTML = '<polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path>';
    } else {
        btn.classList.remove('active-feature'); textSpan.innerText = currentLang === 'ar' ? 'إيقاف' : 'Off'; iconSvg.innerHTML = '<circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>';
    }
    renderPlaybackMenu(); if (playbackMenuOpen) togglePlaybackMenu();
}

function renderPlaybackMenu() {
    const menu = document.getElementById('playback-menu');
    const items = [ { id: 'autonext', textAr: 'تشغيل تلقائي', textEn: 'Auto-Next' }, { id: 'loop', textAr: 'تكرار السورة', textEn: 'Loop Surah' }, { id: 'off', textAr: 'إيقاف', textEn: 'Off' } ];
    menu.innerHTML = items.map(item => `<div class="playback-menu-item ${playbackMode === item.id ? 'active' : ''}" onclick="setPlaybackMode('${item.id}', event)">${currentLang === 'ar' ? item.textAr : item.textEn}</div>`).join('');
}

function syncUIWithAudioState() {
    const isPlaying = !audioInstance.paused;
    const statusIcon = isBuffering ? icons.loading : (isPlaying ? icons.pause : icons.play);
    document.getElementById('player-play-btn').innerHTML = statusIcon;

    const isHeaderMatchingPlaying = isFocusMode || (currentSheikhId === playingSheikhId && currentEdition == playingEditionId);
    const headerEq = document.getElementById('header-equalizer');
    if (headerEq) { if (isPlaying && !isBuffering && isHeaderMatchingPlaying) { headerEq.classList.add('playing'); } else { headerEq.classList.remove('playing'); } }

    document.querySelectorAll('.surah-row').forEach(row => {
        const sId = parseInt(row.getAttribute('data-id')); const playBtn = row.querySelector('.play-cell');
        const isCurrentActive = (sId === playingSurahId && currentSheikhId === playingSheikhId && currentEdition === playingEditionId);
        if (isCurrentActive) { row.classList.add('active-row'); playBtn.innerHTML = isBuffering ? icons.loading : (isPlaying ? icons.pause : icons.play); } else { row.classList.remove('active-row'); playBtn.innerHTML = icons.play; }
    });

    document.querySelectorAll('.edition-pill').forEach(pill => {
        const pillKey = pill.getAttribute('data-key'); const isPlayingThisEdition = (currentSheikhId === playingSheikhId && pillKey == playingEditionId && isPlaying && !isBuffering);
        let dot = pill.querySelector('.active-dot');
        if (isPlayingThisEdition) { if (!dot) pill.insertAdjacentHTML('beforeend', `<span class="active-dot"></span>`); } else { if (dot) dot.remove(); }
    });
}

async function loadEditionData(sheikhId, editionNum) {
    const config = editionsConfig[sheikhId][editionNum]; if (!config) return; 
    const cacheKey = `cache_${config.file}`; const cached = localStorage.getItem(cacheKey);
    if (cached) { activeSurahsData = JSON.parse(cached); renderSurahsList(); }
    try { const res = await fetch(config.file); const data = await res.json(); activeSurahsData = data; localStorage.setItem(cacheKey, JSON.stringify(data)); renderSurahsList(); } catch (e) { console.error("Error loading JSON"); }
}

function renderSurahsList() {
    document.getElementById('main-surah-list').innerHTML = activeSurahsData.map(s => {
        return `<div class="surah-row" data-id="${s.id}">
                    <div class="surah-info"><span class="surah-number">${String(s.id).padStart(3, '0')}</span><span class="surah-name">${translations[currentLang].surahPrefix} ${getSurahName(s.id, s.name)}</span></div>
                    <div class="surah-actions" style="flex-direction: ${currentLang === 'ar' ? 'row' : 'row-reverse'};">
                        <button class="surah-action-btn play-cell" onclick="playSurah(${s.id}, '${s.url}')">${icons.play}</button>
                        <button class="surah-action-btn" onclick="startDownload(${s.id}, '${s.url}')" title="تحميل">${icons.download}</button>
                    </div>
                </div>`;
    }).join('');
    syncUIWithAudioState();
}

const dlModal = document.getElementById('download-modal'), dlFill = document.getElementById('dl-progress-fill'), dlPct = document.getElementById('dl-modal-pct'), dlTitle = document.getElementById('dl-modal-title');
async function startDownload(id, url) {
    if (activeDownloads[id]) return; activeDownloads[id] = true;
    const sData = activeSurahsData.find(s => s.id === id); const sName = getSurahName(id, sData.name);
    dlModal.style.display = 'flex'; dlFill.style.width = '0%'; dlPct.innerText = '0%'; dlTitle.innerText = `${translations[currentLang].downloading} ${sName}...`;
    try {
        const response = await fetch(url, { mode: 'cors' }); if (!response.ok) throw new Error("Network Error");
        const total = parseInt(response.headers.get('content-length'), 10); const reader = response.body.getReader(); let received = 0; let chunks = [];
        while(true) {
            const {done, value} = await reader.read(); if (done) break; chunks.push(value); received += value.length;
            if (total) { const pct = Math.round((received / total) * 100); dlFill.style.width = pct + '%'; dlPct.innerText = pct + '%'; } else { dlPct.innerHTML = '<span class="loading-spin" style="display:inline-block; width:15px; height:15px;">⏳</span>'; }
        }
        const blob = new Blob(chunks, { type: 'audio/mpeg' }); const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = objectUrl; a.download = `${translations[currentLang].surahPrefix}_${sName}.mp3`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(objectUrl);
        finishDownloadUI(id);
    } catch (err) {
        const a = document.createElement('a'); a.href = url; a.download = `${translations[currentLang].surahPrefix}_${sName}.mp3`; a.target = '_blank'; document.body.appendChild(a); a.click(); document.body.removeChild(a);
        finishDownloadUI(id);
    }
}
function finishDownloadUI(id) { dlTitle.innerText = translations[currentLang].downloadComplete; dlFill.style.width = '100%'; dlPct.innerText = '100%'; setTimeout(() => { dlModal.style.display = 'none'; delete activeDownloads[id]; }, 1500); }

async function selectSheikh(id) {
    currentSheikhId = id;
    if (id === playingSheikhId && playingEditionId && editionsConfig[id][playingEditionId]) currentEdition = playingEditionId; else currentEdition = savedReciterEditions[id] || 1;
    updateHeaderUI(); renderEditionDropdown(); await loadEditionData(id, currentEdition);
    
    if (playingSurahId && playingSheikhId === id && playingEditionId === currentEdition) {
        const sData = activeSurahsData.find(sur => sur.id === playingSurahId);
        if(sData && audioInstance.src === "") {
            audioInstance.src = sData.url; document.getElementById('global-player').style.display = 'block';
            document.getElementById('player-track-title').innerText = `${translations[currentLang].surahPrefix} ${getSurahName(sData.id, sData.name)}`;
            syncUIWithAudioState();
        }
    }
}

function renderEditionDropdown() {
    const configs = editionsConfig[currentSheikhId]; const keys = Object.keys(configs);
    const pills = keys.map(key => `<div class="edition-pill ${currentEdition == key ? 'active' : ''}" data-key="${key}" onclick="selectEditionDropdown(${key}, event)">${currentLang === 'ar' ? configs[key].pillAr : configs[key].pillEn}</div>`).join('');
    document.getElementById('edition-dropdown-wrapper').innerHTML = `<div class="edition-list-wrapper"><div class="edition-list">${pills}</div></div>`;
    syncUIWithAudioState(); 
}

async function selectEditionDropdown(num, event) {
    if(event) event.stopPropagation(); if(currentEdition == num) return; 
    currentEdition = num; savedReciterEditions[currentSheikhId] = num; 
    updateHeaderUI(); renderEditionDropdown(); await loadEditionData(currentSheikhId, num);
}

function playSurah(id, url) {
    initAudioBoost(); 
    if (playingSurahId === id && playingSheikhId === currentSheikhId && playingEditionId === currentEdition) { togglePlayPause(); return; }
    
    playingSurahId = id; playingSheikhId = currentSheikhId; playingEditionId = currentEdition;
    isBuffering = true; 
    
    audioInstance.pause(); audioInstance.src = url; audioInstance.loop = (playbackMode === 'loop'); audioInstance.load();
    audioInstance.play().catch(e => { console.log("Audio Play Error:", e); isBuffering = false; syncUIWithAudioState(); });
    
    localStorage.setItem('lastPlayedQuran', JSON.stringify({ sheikh: playingSheikhId, edition: playingEditionId, surah: playingSurahId }));
    const sData = activeSurahsData.find(s => s.id === id); const sName = getSurahName(id, sData.name);
    
    document.getElementById('global-player').style.display = 'block'; 
    document.getElementById('player-track-title').innerText = `${translations[currentLang].surahPrefix} ${sName}`;
    document.getElementById('progress-thumb').style.display = 'block'; document.getElementById('time-separator').style.display = 'inline';

    loadSurahText(id);

    updateHeaderUI(); syncUIWithAudioState();
    
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({ title: `${translations[currentLang].surahPrefix} ${sName}`, artist: "الشيخ أحمد عيسى المعصراوي", album: 'مصحف كبار القراء', artwork: [ { src: 'maasarawi.jpg', sizes: '512x512', type: 'image/jpeg' } ] });
        navigator.mediaSession.setActionHandler('play', () => togglePlayPause()); navigator.mediaSession.setActionHandler('pause', () => togglePlayPause());
        navigator.mediaSession.setActionHandler('previoustrack', () => playPrevious()); navigator.mediaSession.setActionHandler('nexttrack', () => playNext());
        navigator.mediaSession.setActionHandler('seekto', (details) => { audioInstance.currentTime = details.seekTime; });
    }
}

function togglePlayPause() { 
    initAudioBoost(); 
    if (audioInstance.paused && audioInstance.src) {
        isBuffering = true; syncUIWithAudioState();
        audioInstance.play().catch(e => { console.log("Audio Play Error:", e); isBuffering = false; syncUIWithAudioState(); });
    } else { audioInstance.pause(); }
}
function playNext() { const idx = activeSurahsData.findIndex(s => s.id === playingSurahId); if (idx < activeSurahsData.length - 1) { const next = activeSurahsData[idx + 1]; playSurah(next.id, next.url); } }
function playPrevious() { const idx = activeSurahsData.findIndex(s => s.id === playingSurahId); if (idx > 0) { const prev = activeSurahsData[idx - 1]; playSurah(prev.id, prev.url); } }

audioInstance.addEventListener('waiting', () => { isBuffering = true; syncUIWithAudioState(); });
audioInstance.addEventListener('playing', () => { isBuffering = false; syncUIWithAudioState(); });
audioInstance.addEventListener('play', () => { isBuffering = true; syncUIWithAudioState(); });
audioInstance.addEventListener('pause', () => { isBuffering = false; syncUIWithAudioState(); });

audioInstance.addEventListener('error', () => {
    isBuffering = !navigator.onLine; syncUIWithAudioState();
    showToast(currentLang === 'ar' ? "خطأ في الاتصال، يرجى التحقق من الإنترنت" : "Network error, please check connection");
});

window.addEventListener('online', () => {
    if (isBuffering && playingSurahId && !audioInstance.paused) {
        audioInstance.load(); audioInstance.play().catch(e => console.log(e)); showToast(currentLang === 'ar' ? "تمت استعادة الاتصال، جاري التشغيل..." : "Connection restored, playing...");
    }
});

window.addEventListener('offline', () => { if (!audioInstance.paused || isBuffering) { isBuffering = true; syncUIWithAudioState(); showToast(currentLang === 'ar' ? "انقطع الاتصال بالإنترنت" : "Internet connection lost"); } });

audioInstance.onended = () => { if (playbackMode === 'autonext') playNext(); };

audioInstance.ontimeupdate = () => {
    if (audioInstance.duration && !isDragging) {
        const pct = audioInstance.currentTime / audioInstance.duration;
        document.getElementById('progress-bar-fill').style.width = (pct * 100) + '%';
        document.getElementById('curr-time').innerText = formatTime(audioInstance.currentTime);
        document.getElementById('total-time').innerText = formatTime(audioInstance.duration);

        if (isFocusMode && !isUserScrolling) {
            const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollableHeight > 0) {
                targetScroll = pct * scrollableHeight;
            }
        }
    }
};

function formatTime(s) { if(isNaN(s) || s === Infinity) return "00:00"; const m = Math.floor(s/60), sec = Math.floor(s%60); return `${m}:${sec < 10 ? '0'+sec : sec}`; }

let isDragging = false; let currentSeekPct = 0; const progressContainer = document.getElementById('progress-container');
const seek = (e) => { 
    const rect = progressContainer.getBoundingClientRect(); let clientX = 0;
    if (e.type.includes('touch')) { if (e.touches && e.touches.length > 0) clientX = e.touches[0].clientX; else if (e.changedTouches && e.changedTouches.length > 0) clientX = e.changedTouches[0].clientX; } else { clientX = e.clientX; }
    let pct = (clientX - rect.left) / rect.width; pct = Math.max(0, Math.min(1, pct)); 
    document.getElementById('progress-bar-fill').style.width = (pct * 100) + '%'; currentSeekPct = pct; return pct; 
};

progressContainer.addEventListener('mousedown', (e) => { isDragging = true; seek(e); }); window.addEventListener('mousemove', (e) => { if (isDragging) seek(e); }); window.addEventListener('mouseup', (e) => { if (isDragging) { isDragging = false; if(audioInstance.duration && audioInstance.duration !== Infinity) audioInstance.currentTime = currentSeekPct * audioInstance.duration; } });
progressContainer.addEventListener('touchstart', (e) => { isDragging = true; seek(e); }, {passive: false}); window.addEventListener('touchmove', (e) => { if (isDragging) seek(e); }, {passive: false}); window.addEventListener('touchend', (e) => { if (isDragging) { isDragging = false; if (e.changedTouches) seek(e); if(audioInstance.duration && audioInstance.duration !== Infinity) audioInstance.currentTime = currentSeekPct * audioInstance.duration; } }); 
progressContainer.addEventListener('click', (e) => { if(audioInstance.duration && audioInstance.duration !== Infinity) audioInstance.currentTime = seek(e) * audioInstance.duration; });

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); deferredPrompt = e;
    setTimeout(() => { document.getElementById('install-banner').classList.add('show'); }, 2000); 
});

document.getElementById('install-action-btn').addEventListener('click', async () => {
    if (deferredPrompt) { document.getElementById('install-banner').classList.remove('show'); deferredPrompt.prompt(); const { outcome } = await deferredPrompt.userChoice; deferredPrompt = null; }
});
window.addEventListener('appinstalled', () => { document.getElementById('install-banner').classList.remove('show'); showToast(currentLang === 'ar' ? 'تم تثبيت التطبيق بنجاح!' : 'App installed successfully!'); });
if ('serviceWorker' in navigator) { window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(err => console.log('SW failed')); }); }

(async () => {
    document.getElementById('theme-toggle-btn').innerHTML = currentTheme === 'dark' ? icons.moon : icons.sun; setPlaybackMode('autonext'); 
    currentSheikhId = 'maasarawi'; const savedState = JSON.parse(localStorage.getItem('lastPlayedQuran'));
    if (savedState && savedState.sheikh === 'maasarawi') { savedReciterEditions['maasarawi'] = savedState.edition || 1; playingSheikhId = 'maasarawi'; playingEditionId = savedState.edition || 1; playingSurahId = savedState.surah; } else { localStorage.removeItem('lastPlayedQuran'); }
    
    await selectSheikh('maasarawi');

    if(savedState && savedState.surah && savedState.sheikh === 'maasarawi') {
        const sData = activeSurahsData.find(s => s.id === savedState.surah);
        if(sData && audioInstance.src === "") {
            const sName = getSurahName(sData.id, sData.name);
            const promptText = currentLang === 'ar' ? `هل تود إكمال الاستماع إلى سورة ${sName}؟` : `Resume listening to Surah ${sName}?`;
            document.getElementById('resume-text').innerText = promptText; document.getElementById('resume-banner').classList.add('show');
            window.resumeData = { id: sData.id, url: sData.url }; setTimeout(() => closeResumeBanner(), 15000);
        }
    }
})();
