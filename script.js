// === ข้อมูลผู้ใช้ + รหัสผ่าน (แก้ไขได้) ===
const users = {
    "talos blackagency": "001",
    "noelle blackagency": "002",
    "zenzey ziminine": "003",
    "maki eneos": "004",
    "mitsuki miho": "005",
    "sammy vet": "006",
    "river lily": "007",
    "tofu shiroibara": "008"
    "tofu": "008"
};

let currentUser = null;
let shiftLog = JSON.parse(localStorage.getItem('shiftLog')) || {};

// Login
document.getElementById('btnLogin').addEventListener('click', () => {
    const username = document.getElementById('usernameInput').value.trim();
    const password = document.getElementById('passwordInput').value;

    if (!username || !password) {
        alert("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
        return;
    }

    if (users[username] && users[username] === password) {
        currentUser = username;
        
        document.getElementById('loginPage').classList.add('hidden');
        document.getElementById('mainPage').classList.remove('hidden');
        
        document.getElementById('currentUser').textContent = currentUser;
        document.getElementById('userLogName').textContent = currentUser;
        
        updateButtonState();
        renderLog();
    } else {
        alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }
});

// ปุ่มกรอกเวลา
document.getElementById('btnManual').addEventListener('click', () => {
    window.open('https://docs.google.com/spreadsheets/d/1vGjzD5YZiiBs65yBodjtxsoUPQVr_EMMnfqRXWbOZrI/edit?gid=749978115#gid=749978115', '_blank');
});
document.getElementById('btnManualTop').addEventListener('click', () => {
    window.open('https://docs.google.com/spreadsheets/d/1vGjzD5YZiiBs65yBodjtxsoUPQVr_EMMnfqRXWbOZrI/edit?gid=749978115#gid=749978115', '_blank');
});

// Logout
document.getElementById('btnLogout').addEventListener('click', () => {
    document.getElementById('mainPage').classList.add('hidden');
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('usernameInput').value = '';
    document.getElementById('passwordInput').value = '';
    currentUser = null;
});

// เวลาเรียลไทม์
function updateTime() {
    document.getElementById('currentTime').textContent = 
        new Date().toLocaleTimeString('th-TH', { hour12: false });
}
setInterval(updateTime, 1000);
updateTime();

// ควบคุมปุ่มเข้า-ออก
function updateButtonState() {
    const btnIn = document.getElementById('btnIn');
    const btnOut = document.getElementById('btnOut');
    
    if (!currentUser || !shiftLog[currentUser]) {
        btnIn.disabled = false;
        btnOut.disabled = true;
        return;
    }
    
    const logs = shiftLog[currentUser];
    const lastLog = logs[logs.length - 1];
    
    if (lastLog && lastLog.type === 'เข้าเวร' && !lastLog.duration) {
        btnIn.disabled = true;
        btnOut.disabled = false;
    } else {
        btnIn.disabled = false;
        btnOut.disabled = true;
    }
}

// เข้าเวร / ออกเวร / renderLog  (เหมือนเดิม)
document.getElementById('btnIn').addEventListener('click', () => { /* ... เหมือนโค้ดเก่า */ 
    if (!currentUser) return;
    const now = new Date();
    const entry = { type: 'เข้าเวร', time: now.toLocaleTimeString('th-TH'), datetime: now.toISOString(), date: now.toLocaleDateString('th-TH') };
    if (!shiftLog[currentUser]) shiftLog[currentUser] = [];
    shiftLog[currentUser].push(entry);
    localStorage.setItem('shiftLog', JSON.stringify(shiftLog));
    updateButtonState();
    renderLog();
    alert(`✅ ${currentUser} เข้าเวรเรียบร้อย`);
});

document.getElementById('btnOut').addEventListener('click', () => { /* ... เหมือนโค้ดเก่า */ 
    if (!currentUser) return;
    const now = new Date();
    const logs = shiftLog[currentUser] || [];
    const lastIn = logs.slice().reverse().find(log => log.type === 'เข้าเวร' && !log.duration);
    let durationText = 'ไม่พบเวลาเข้าเวร';
    if (lastIn) {
        const inTime = new Date(lastIn.datetime);
        const diffMs = now - inTime;
        const diffMinutes = Math.floor(diffMs / 60000);
        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;
        durationText = hours > 0 ? `${hours} ชม. ${minutes} นาที` : `${minutes} นาที`;
        lastIn.duration = durationText;
        lastIn.outTime = now.toLocaleTimeString('th-TH');
    }
    const entry = { type: 'ออกเวร', time: now.toLocaleTimeString('th-TH'), date: now.toLocaleDateString('th-TH'), duration: durationText };
    shiftLog[currentUser].push(entry);
    localStorage.setItem('shiftLog', JSON.stringify(shiftLog));
    updateButtonState();
    renderLog();
    alert(`🚪 ${currentUser} ออกเวรเรียบร้อย\nเวลาทำงาน: ${durationText}`);
});

function renderLog() {
    const logList = document.getElementById('logList');
    logList.innerHTML = '';
    if (!currentUser || !shiftLog[currentUser]) return;
    shiftLog[currentUser].slice().reverse().forEach(log => {
        const div = document.createElement('div');
        div.className = 'log-item';
        if (log.type === 'เข้าเวร') {
            div.innerHTML = `<strong>✅ เข้าเวร</strong> ${log.date} <span>${log.time}</span>`;
        } else {
            div.innerHTML = `<strong>🚪 ออกเวร</strong> ${log.date} <span>${log.time} ${log.duration ? `(${log.duration})` : ''}</span>`;
        }
        logList.appendChild(div);
    });
}
