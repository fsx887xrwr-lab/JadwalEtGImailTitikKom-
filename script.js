const KEY = 'db_elite_vDualSlide';
let db = JSON.parse(localStorage.getItem(KEY)) || {"Senin":[], "Selasa":[], "Rabu":[], "Kamis":[], "Jumat":[]};
const audio = document.getElementById('bgMusic');

function updateTime() { 
    document.getElementById('clock').innerText = new Date().toLocaleTimeString('en-GB'); 
}
setInterval(updateTime, 1000); 
updateTime();

function togglePop() { 
    document.getElementById('dockMenu').classList.toggle('active'); 
}

function openDrawer(id) {
    closeAll();
    document.getElementById('overlay').classList.add('active');
    document.getElementById(id).classList.add('active');
    togglePop();
}

function closeAll() {
    document.getElementById('overlay').classList.remove('active');
    document.querySelectorAll('.drawer').forEach(d => d.classList.remove('active'));
}

// FUNGSI SET THEME DENGAN FIX AUDIO
function setTheme(color, file) {
    // Update Warna UI
    document.documentElement.style.setProperty('--neon', color);
    document.documentElement.style.setProperty('--neon-glow', color + '44');
    
    if(file) {
        // Reset audio agar tidak bentrok saat ganti lagu
        audio.pause();
        audio.currentTime = 0; 
        audio.src = file; 
        
        // Memaksa browser me-load file baru sebelum diputar
        audio.load(); 
        
        // Gunakan promise untuk memastikan play berjalan setelah load
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                console.log("Playing: " + file);
            }).catch(error => {
                console.log("Interaksi user diperlukan untuk memutar: " + file);
                // Opsional: tampilkan notifikasi kecil ke user jika gagal
            });
        }
    }
    render();
}

function pauseMusic() { 
    audio.pause(); 
    // Kembalikan warna ke default saat pause jika mau
    document.documentElement.style.setProperty('--neon', '#a855f7');
    document.documentElement.style.setProperty('--neon-glow', 'rgba(168, 85, 247, 0.3)');
}

function render() {
    const wrapper = document.getElementById('mainWrapper');
    wrapper.innerHTML = Object.keys(db).map((day, index) => `
        <div class="card" style="animation-delay: ${index * 0.1}s">
            <div class="day-label" style="font-size:0.7rem; margin-bottom:15px; letter-spacing:3px; border-bottom:1px solid var(--border); padding-bottom:10px;">${day.toUpperCase()}</div>
            ${db[day].map(it => `
                <div style="padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.02); display:flex; justify-content:space-between; align-items:center;">
                    <div><b>${it.mapel}</b><br><small style="opacity:0.4;">${it.jam}</small></div>
                    <i class="fa-solid fa-trash-can trash-btn" onclick="hapus('${day}', ${it.id})"></i>
                </div>
            `).join('') || '<p style="opacity:0.2; font-size:0.8rem;">Kosong</p>'}
        </div>
    `).join('');
}

function save() {
    const m = document.getElementById('fMapel').value, 
          j = document.getElementById('fJam').value, 
          h = document.getElementById('fHari').value;
    if(m && j) {
        db[h].push({ id: Date.now(), mapel: m, jam: j });
        localStorage.setItem(KEY, JSON.stringify(db));
        render(); 
        closeAll();
        document.getElementById('fMapel').value = ""; 
        document.getElementById('fJam').value = "";
    }
}

function hapus(day, id) {
    if(confirm("Hapus?")) {
        db[day] = db[day].filter(x => x.id !== id);
        localStorage.setItem(KEY, JSON.stringify(db));
        render();
    }
}

function exportData() {
    const blob = new Blob([JSON.stringify(db)], {type: 'application/json'});
    const a = document.createElement('a'); 
    a.href = URL.createObjectURL(blob); 
    a.download = 'archive.json'; 
    a.click();
}

function importData(e) {
    const reader = new FileReader();
    reader.onload = (ev) => {
        try {
            db = JSON.parse(ev.target.result);
            localStorage.setItem(KEY, JSON.stringify(db));
            render(); 
            alert("Import Berhasil!"); 
            closeAll();
        } catch(err) {
            alert("File JSON tidak valid!");
        }
    };
    reader.readAsText(e.target.files[0]);
}

render();
