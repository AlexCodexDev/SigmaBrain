import {} from "./screen";

// ==========================================================================
// 1. ENGINE PARTIKEL EMBER & KILATAN PETIR (NIGHTMARE)
// ==========================================================================
let emberCanvas, emberCtx;
let emberParticles = [];
let nightmareLoopId = null;
let lightningTimeout = null;

function initEmberStorm() {
    emberCanvas = document.getElementById('ember-canvas');
    if (!emberCanvas) return;
    emberCtx = emberCanvas.getContext('2d');

    function resize() {
        emberCanvas.width = window.innerWidth;
        emberCanvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    emberParticles = [];
    const colors = ['#ff2a00', '#ff7700', '#ffdd00', '#ff0055'];
    for (let i = 0; i < 120; i++) {
        emberParticles.push({
            x: Math.random() * emberCanvas.width,
            y: Math.random() * emberCanvas.height,
            size: Math.random() * 4 + 1.5,
            speedY: Math.random() * 3 + 2,
            speedX: (Math.random() - 0.5) * 2,
            opacity: Math.random() * 0.8 + 0.2,
            color: colors[Math.floor(Math.random() * colors.length)],
            wobble: Math.random() * Math.PI * 2
        });
    }
}

function renderEmberStorm() {
    if (!emberCtx) return;
    emberCtx.clearRect(0, 0, emberCanvas.width, emberCanvas.height);

    emberParticles.forEach(p => {
        p.y -= p.speedY;
        p.wobble += 0.04;
        p.x += Math.sin(p.wobble) * 1.5 + p.speedX;

        if (p.y < -10) {
            p.y = emberCanvas.height + 10;
            p.x = Math.random() * emberCanvas.width;
        }

        emberCtx.beginPath();
        emberCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        emberCtx.fillStyle = p.color;
        emberCtx.globalAlpha = p.opacity;
        emberCtx.shadowBlur = 12;
        emberCtx.shadowColor = p.color;
        emberCtx.fill();
    });

    nightmareLoopId = requestAnimationFrame(renderEmberStorm);
}

function scheduleLightning() {
    const delay = Math.random() * 4000 + 2000;
    lightningTimeout = setTimeout(() => {
        const flashEl = document.getElementById('lightning-flash');
        if (flashEl && document.body.classList.contains('nightmare-mode')) {
            flashEl.classList.add('flash-active');
            setTimeout(() => flashEl.classList.remove('flash-active'), 400);
            scheduleLightning();
        }
    }, delay);
}

window.addEventListener('mousemove', (e) => {
    if (document.body.classList.contains('nightmare-mode')) return;
    const moveX = (e.clientX - window.innerWidth / 2) * 0.015;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.015;

    document.querySelectorAll('.floating-item').forEach((item, index) => {
        const depth = (index + 1) * 0.6;
        item.style.transform = `translate(${moveX * depth}px, ${moveY * depth}px)`;
    });
});



// ==========================================================================
// 3. DATABASE LOKAL BROWSER (LOCALSTORAGE ENGINE)
// ==========================================================================
const LocalDB = {
    getUsers() {
        const data = localStorage.getItem('sigma_users_db');
        return data ? JSON.parse(data) : {};
    },

    saveUsers(users) {
        localStorage.setItem('sigma_users_db', JSON.stringify(users));
    },

    getCurrentSession() {
        return localStorage.getItem('sigma_session_user') || null;
    },

    setSession(username) {
        if (username) {
            localStorage.setItem('sigma_session_user', username);
        } else {
            localStorage.removeItem('sigma_session_user');
        }
    },

    register(username, password) {
        const users = this.getUsers();
        if (users[username]) {
            return { success: false, message: "Nama pengguna sudah terdaftar!" };
        }
        users[username] = {
            password: password,
            highScore: 0,
            unlockedLevels: {
                "Menghitung": 1,
                "Bahasa Indonesia": 1,
                "Bahasa Inggris": 1,
                "Menghitung Nightmare": 1
            },
            totalGames: 0,
            createdAt: new Date().toISOString()
        };
        this.saveUsers(users);
        return { success: true };
    },

    login(username, password) {
        const users = this.getUsers();
        if (!users[username]) {
            return { success: false, message: "Pengguna tidak ditemukan! Silakan daftar." };
        }
        if (users[username].password !== password) {
            return { success: false, message: "Kata sandi salah!" };
        }
        return { success: true, user: users[username] };
    },

    getUserData(username) {
        if (username === "Tamu") {
            return {
                highScore: 0,
                unlockedLevels: {
                    "Menghitung": 5,
                    "Bahasa Indonesia": 5,
                    "Bahasa Inggris": 5,
                    "Menghitung Nightmare": 2
                }
            };
        }
        const users = this.getUsers();
        return users[username] || null;
    },

    updateProgress(username, scoreGained, category, completedLevel) {
        if (username === "Tamu") return;

        const users = this.getUsers();
        if (!users[username]) return;

        const user = users[username];
        user.highScore = (user.highScore || 0) + scoreGained;
        user.totalGames = (user.totalGames || 0) + 1;

        if (!user.unlockedLevels) user.unlockedLevels = {};
        const currentUnlocked = user.unlockedLevels[category] || 1;
        if (completedLevel >= currentUnlocked) {
            user.unlockedLevels[category] = completedLevel + 1;
        }

        users[username] = user;
        this.saveUsers(users);
    },

    getLeaderboard() {
        const users = this.getUsers();
        const list = [];
        for (const [name, uData] of Object.entries(users)) {
            list.push({
                username: name,
                highScore: uData.highScore || 0,
                totalGames: uData.totalGames || 0
            });
        }
        list.sort((a, b) => b.highScore - a.highScore);
        return list;
    }
};

// ==========================================================================
// 4. DATABASE SOAL
// ==========================================================================
const databaseSoal = {
    "Menghitung": [
        { soal: "Berapa hasil dari 3 + 4 ?", pilihan: [7, 6, 8, 5], benar: 7 }, 
        { soal: "Berapa hasil dari 15 - 7 ?", pilihan: [9, 8, 7, 10], benar: 8 },
        { soal: "Berapa hasil dari 4 x 3 ?", pilihan: [12, 14, 10, 16], benar: 12 },
        { soal: "Berapa hasil dari 20 : 4 ?", pilihan: [4, 5, 6, 8], benar: 5 },
        { soal: "Berapa nilai 50 - 18 ?", pilihan: [32, 34, 28, 42], benar: 32 },
    ],
    "Bahasa Indonesia": [
        { 
            soal: "Benda apakah ini yang dipakai saat hujan?", 
            gambar: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=300&q=80", 
            pilihan: ["Payung", "Sepatu", "Topi", "Buku"], 
            benar: "Payung" 
        },
        { soal: "Lawan kata dari 'Panas' adalah?", pilihan: ["Dingin", "Hangat", "Mendung", "Cerah"], benar: "Dingin" },
        { soal: "Kata dasar dari kata 'Menulis' adalah?", pilihan: ["Tulis", "Nulis", "Surat", "Buku"], benar: "Tulis" },
    ],
    "Bahasa Inggris": [
        { 
            soal: "What animal is this?", 
            gambar: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&q=80", 
            pilihan: ["Cat", "Dog", "Fish", "Bird"], 
            benar: "Cat" 
        },
        { soal: "What is the English word for 'Merah'?", pilihan: ["Red", "Blue", "Green", "Yellow"], benar: "Red" },
    ],
    "Menghitung Nightmare": [
        { soal: "🔥 [NIGHTMARE] (16 x 4) - 25 = ?", pilihan: [39, 41, 35, 49], benar: 39 },
        { soal: "🔥 [NIGHTMARE] √144 + (7 x 3) = ?", pilihan: [33, 35, 31, 29], benar: 33 }
    ],
};

let currentUser = "Tamu";
let currentAuthMode = "login";
let currentCategory = "";
let currentLevel = 1;
let currentCorrectAnswer = "";
let score = 0;
let streak = 0;

// ==========================================================================
// 5. AUTENTIKASI UI & LOGIKA SESSION
// ==========================================================================


function handleAuthSubmit(event) {
    event.preventDefault();
    playSound('click');

    const usernameInput = document.getElementById('login-username').value.trim();
    const passwordInput = document.getElementById('login-password').value.trim();

    if (!usernameInput || !passwordInput) {
        alert("Silakan isi nama pemain dan kata sandi!");
        return;
    }

    if (currentAuthMode === 'register') {
        const res = LocalDB.register(usernameInput, passwordInput);
        if (!res.success) {
            alert("⚠️ " + res.message);
            return;
        }
        alert("🎉 Akun berhasil dibuat! Otomatis masuk...");
    } else {
        const res = LocalDB.login(usernameInput, passwordInput);
        if (!res.success) {
            alert("❌ " + res.message);
            return;
        }
    }

    currentUser = usernameInput;
    LocalDB.setSession(currentUser);
    updateUserUI();
    changeScreen('screen-home');
}









// ==========================================================================
// 6. SISTEM PERMAINAN & KONTROL SCREEN
// ==========================================================================

function goToLevels(category) {
    playSound('click');
    currentCategory = category;
    const judulLevel = document.getElementById('level-title');
    const teksBaru = `Level: ${category}`;

    judulLevel.innerText = teksBaru;
    judulLevel.setAttribute('data-text', teksBaru);
    
    const grid = document.getElementById('level-grid');
    grid.innerHTML = ""; 

    const uData = LocalDB.getUserData(currentUser);
    const maxUnlocked = (uData && uData.unlockedLevels && uData.unlockedLevels[category]) ? uData.unlockedLevels[category] : 1;

    for (let i = 1; i <= 20; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        btn.className = "btn-interactive btn-3d bg-white text-indigo-800 font-extrabold text-xl py-3 rounded-2xl shadow-[0_4px_0_#cbd5e1] hover:bg-indigo-50 border border-indigo-100";
        
        const arraySoal = databaseSoal[currentCategory];
        const isExists = arraySoal && i <= arraySoal.length;
        const isUnlocked = i <= maxUnlocked;

        if (!isExists || !isUnlocked) {
            btn.innerHTML = `${i} <span class="text-xs block text-gray-400">🔒</span>`;
            btn.classList.add('opacity-60', 'bg-gray-100');
            btn.onclick = () => {
                playSound('wrong');
                if (!isExists) alert("Level ini belum tersedia!");
                else alert("Level ini masih terkunci! Selesaikan level sebelumnya.");
            };
        } else {
            btn.onclick = () => {
                playSound('click');
                startGame(i);
            };
        }
        grid.appendChild(btn);
    }

    changeScreen('screen-levels');
}

function startGame(levelNumber) {
    currentLevel = levelNumber;
    const soalIndex = levelNumber - 1; 
    const dataLevelIni = databaseSoal[currentCategory][soalIndex];
    
    currentCorrectAnswer = dataLevelIni.benar;

    document.getElementById('game-header-title').innerText = `${currentCategory} • Lv.${levelNumber}`;
    document.getElementById('question-text').innerText = dataLevelIni.soal;

    const imgContainer = document.getElementById('question-image-container');
    const imgElement = document.getElementById('question-image');
    if (dataLevelIni.gambar) {
        imgElement.src = dataLevelIni.gambar;
        imgContainer.classList.remove('hidden');
    } else {
        imgContainer.classList.add('hidden');
    }

    const buttons = document.querySelectorAll('.btn-option');
    buttons.forEach((btn, index) => {
        const teksPilihan = dataLevelIni.pilihan[index];
        btn.innerText = teksPilihan;
        btn.onclick = () => checkAnswer(teksPilihan, btn);
    });

    changeScreen('screen-gameplay');
}

function checkAnswer(answer, btnElement) {
    const arena = document.getElementById('gameArena');
    const mascot = document.getElementById('mascot');

    if (answer.toString() === currentCorrectAnswer.toString()) {
        playSound('correct');
        streak++;
        const pointsGained = 100 + (streak * 10);
        score += pointsGained;
        document.getElementById('scoreText').innerText = score;
        updateStreakUI();

        // Simpan progress ke database lokal
        LocalDB.updateProgress(currentUser, pointsGained, currentCategory, currentLevel);

        mascot.src = "https://api.dicebear.com/7.x/bottts/svg?seed=Lucky&backgroundColor=transparent";
        mascot.style.transform = "scale(1.2) rotate(15deg)";

        triggerConfetti();

        setTimeout(() => {
            playSound('win');
            document.getElementById('gameArena').style.display = 'none';
            document.getElementById('winScreen').classList.remove('hidden');
            document.getElementById('winScreen').classList.add('flex');
        }, 350);

    } else {
        playSound('wrong');
        streak = 0;
        updateStreakUI();

        arena.classList.add('shake-animation');
        setTimeout(() => arena.classList.remove('shake-animation'), 450);

        btnElement.classList.add('opacity-40', 'pointer-events-none');
        btnElement.style.transform = 'translateY(5px)';

        mascot.src = "https://api.dicebear.com/7.x/bottts/svg?seed=Oops&backgroundColor=transparent";
        mascot.style.transform = "rotate(-20deg)";
        setTimeout(() => mascot.style.transform = "none", 400);
    }
}

function nextLevel() {
    playSound('click');
    const totalSoal = databaseSoal[currentCategory].length;
    if (currentLevel < totalSoal) {
        resetArena();
        startGame(currentLevel + 1);
    } else {
        alert("🎉 Luar biasa! Kamu berhasil menyelesaikan semua level kategori ini!");
        changeScreen('screen-levels');
    }
}

function updateStreakUI() {
    const badge = document.getElementById('streak-badge');
    const count = document.getElementById('streak-count');
    if (streak > 1) {
        badge.classList.remove('hidden');
        count.innerText = streak;
    } else {
        badge.classList.add('hidden');
    }
}

function pokeMascot() {
    playSound('click');
    const mascot = document.getElementById('mascot');
    mascot.style.transform = "scale(1.3) rotate(360deg)";
    setTimeout(() => mascot.style.transform = "none", 400);
}

function resetArena() {
    document.getElementById('gameArena').style.display = 'flex';
    document.getElementById('winScreen').classList.add('hidden');
    document.getElementById('winScreen').classList.remove('flex');
    
    document.getElementById('mascot').src = "https://api.dicebear.com/7.x/bottts/svg?seed=EduBot&backgroundColor=transparent";
    document.getElementById('mascot').style.transform = "none";
    
    document.querySelectorAll('.btn-option').forEach(btn => {
        btn.classList.remove('opacity-40', 'pointer-events-none');
        btn.style.transform = 'none';
    });
}

function openLeaderboard() {
    playSound('click');
    const tbody = document.getElementById('leaderboard-tbody');
    tbody.innerHTML = "";

    const list = LocalDB.getLeaderboard();
    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="p-4 text-center text-gray-400">Belum ada akun terdaftar!</td></tr>`;
    } else {
        list.forEach((user, index) => {
            const tr = document.createElement('tr');
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;
            tr.className = index % 2 === 0 ? 'bg-indigo-50/50' : 'bg-white';
            tr.innerHTML = `
                <td class="p-3 text-center font-black">${medal}</td>
                <td class="p-3 font-extrabold text-indigo-900">${user.username}</td>
                <td class="p-3 text-right font-black text-amber-500">⭐ ${user.highScore}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    changeScreen('screen-leaderboard');
}

// ==========================================================================
// 7. AKTIVASI NIGHTMARE
// ==========================================================================
function activateNightmare() {
    playSound('nightmare');
    document.body.classList.add('nightmare-mode');
    
    document.getElementById('normal-bg-container').style.opacity = '0';
    document.getElementById('nightmare-bg-container').classList.remove('hidden');
    document.getElementById('nightmare-portal').style.display = 'none';
    
    initEmberStorm();
    renderEmberStorm();
    scheduleLightning();

    goToLevels('Menghitung Nightmare');
}

function deactivateNightmare() {
    document.body.classList.remove('nightmare-mode');
    
    document.getElementById('normal-bg-container').style.opacity = '1';
    document.getElementById('nightmare-bg-container').classList.add('hidden');
    
    const portal = document.getElementById('nightmare-portal');
    if (portal) portal.style.display = 'flex';

    if (nightmareLoopId) cancelAnimationFrame(nightmareLoopId);
    if (lightningTimeout) clearTimeout(lightningTimeout);
}

// ==========================================================================
// 8. EFEK PERAYAAN (CONFETTI)
// ==========================================================================
function triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

    for (let i = 0; i < 60; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            r: Math.random() * 6 + 4,
            dx: (Math.random() - 0.5) * 16,
            dy: (Math.random() - 0.7) * 16,
            color: colors[Math.floor(Math.random() * colors.length)],
        });
    }

    let frame = 0;
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.dx;
            p.y += p.dy;
            p.dy += 0.4;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        });

        frame++;
        if (frame < 60) {
            requestAnimationFrame(render);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    render();
}