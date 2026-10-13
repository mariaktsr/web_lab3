const canvas = document.getElementById('areaCanvas');
const ctx = canvas.getContext('2d');
const xInput = document.getElementById('xInput');
const xError = document.getElementById('xError');
const rInput = document.getElementById('rInput');
const rError = document.getElementById('rError');
const yInput = document.getElementById('yInput');
const form = document.getElementById('pointForm');

const points = (typeof allPoints !== 'undefined') ? allPoints : [];
console.log('form.js (4 правки): точек для отрисовки = ' + points.length);

let currentR = points.length > 0 ? points[points.length - 1].r : 2;
rInput.value = currentR;

let busy = false;        

function checkHit(x, y, r) {
    if (x >= 0 && x <= r / 2 && y >= 0 && y <= r) return true;
    if (x >= -r / 2 && x <= 0 && y >= 0 && y <= (r / 2 + x)) return true;
    if (x >= 0 && y <= 0 && (x * x + y * y) <= (r / 2) * (r / 2)) return true;
    return false;
}

const MISS_SOUND_URL = (typeof contextPath !== 'undefined' ? contextPath : '') + '/sounds/miss.wav';

const MISS_DELAY = 1400;

const missSound = new Audio(MISS_SOUND_URL);
function playMissSound() {
    missSound.currentTime = 0;
    missSound.play().catch(function () { });
}

function runAfterCheck(x, y, r, action) {
    if (checkHit(x, y, r)) { action(); return; }
    busy = true;
    playMissSound();
    setTimeout(action, MISS_DELAY);
}
window.addEventListener('pageshow', function () { busy = false; });

document.querySelectorAll('#yButtons > button').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('#yButtons > button').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        yInput.value = this.dataset.y;
    });
});
 
function sanitizeInput(input) {
    let value = input.value;
    
    value = value.replace(',', '.');
    
    value = value.replace(/[^0-9.\-]/g, '');
   
    const minusCount = (value.match(/-/g) || []).length;
    if (minusCount > 1) {
        value = '-' + value.replace(/-/g, '');
    } else if (minusCount === 1 && value.indexOf('-') !== 0) {
        value = value.replace(/-/g, '');
    }

    const dotCount = (value.match(/\./g) || []).length;
    if (dotCount > 1) {
        const firstDot = value.indexOf('.');
        value = value.substring(0, firstDot + 1) + value.substring(firstDot + 1).replace(/\./g, '');
    }
    
    input.value = value;
}

function validateX() {
    const val = xInput.value.trim();
    if (val === '') { xError.textContent = ''; return false; }
    const num = parseFloat(val);
    if (isNaN(num) || num < -5 || num > 5) {
        xError.textContent = 'X должен быть числом от -5 до 5';
        return false;
    }
    xError.textContent = '';
    return true;
}

xInput.addEventListener('input', function() {
    sanitizeInput(this);
    validateX();
});

function getValidR() {
    const val = rInput.value.trim().replace(',', '.');
    if (val === '') return null;
    const num = Number(val);
    if (!isFinite(num) || num < 1 || num > 4) return null;
    return num;
}

function validateR() {
    const val = rInput.value.trim();
    currentR = getValidR();
    if (val !== '' && currentR === null) {
        rError.textContent = 'R должен быть числом от 1 до 4';
    } else {
        rError.textContent = '';
    }
    drawArea();               
    return currentR !== null;
}

rInput.addEventListener('input', function() {
    sanitizeInput(this);
    validateR();
});

form.addEventListener('submit', function (e) {
    if (busy) { e.preventDefault(); return; }
    const xOk = validateX();
    const rOk = validateR();
    if (xInput.value.trim() === '') xError.textContent = 'Заполните X';
    if (rInput.value.trim() === '') rError.textContent = 'Заполните R';
    if (!xOk || !rOk) {
        e.preventDefault();
        return;
    }
    const x = parseFloat(xInput.value.trim());
    const y = parseFloat(yInput.value);
    if (!checkHit(x, y, currentR)) {      
        e.preventDefault();
        runAfterCheck(x, y, currentR, function () { form.submit(); });
    }
});

function drawArea() {
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const scale = Math.min(W, H) / 12;
    const hasR = currentR !== null;
    const rPx = hasR ? currentR * scale : 0;
    canvas.style.cursor = hasR ? 'crosshair' : 'not-allowed';

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, W, H);

    // сетка
    ctx.strokeStyle = '#e0e0e0'; ctx.lineWidth = 0.5;
    for (let i = -6; i <= 6; i++) {
        ctx.beginPath(); ctx.moveTo(cx + i * scale, 0); ctx.lineTo(cx + i * scale, H); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, cy - i * scale); ctx.lineTo(W, cy - i * scale); ctx.stroke();
    }

    // оси
    ctx.strokeStyle = '#333'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W - 15, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W - 15, cy); ctx.lineTo(W - 25, cy - 5); ctx.lineTo(W - 25, cy + 5); ctx.closePath();
    ctx.fillStyle = '#333'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx, H); ctx.lineTo(cx, 15); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 15); ctx.lineTo(cx - 5, 25); ctx.lineTo(cx + 5, 25); ctx.closePath(); ctx.fill();

    ctx.font = '14px Arial'; ctx.fillStyle = '#333';
    ctx.textAlign = 'left';
    ctx.fillText('X', W - 15, cy + 18);
    ctx.fillText('Y', cx + 10, 15);

    if (hasR) {
        ctx.font = '12px Arial'; ctx.fillStyle = '#555';
        ctx.textAlign = 'center';
        ctx.fillText('R', cx + rPx, cy + 18);
        ctx.fillText('R/2', cx + rPx / 2, cy + 18);
        ctx.fillText('-R/2', cx - rPx / 2, cy + 18);
        ctx.fillText('-R', cx - rPx, cy + 18);
        ctx.textAlign = 'right';
        ctx.fillText('R', cx - 8, cy - rPx + 4);
        ctx.fillText('R/2', cx - 8, cy - rPx / 2 + 4);
        ctx.fillText('-R/2', cx - 8, cy + rPx / 2 + 4);
        ctx.fillText('-R', cx - 8, cy + rPx + 4);

        ctx.fillStyle = 'rgba(52, 152, 219, 0.55)';
        ctx.strokeStyle = 'rgba(41, 128, 185, 0.9)';
        ctx.lineWidth = 2;

        // прямоугольник
        ctx.beginPath();
        ctx.rect(cx, cy - rPx, rPx / 2, rPx);
        ctx.fill(); ctx.stroke();

        // треугольник
        ctx.beginPath();
        ctx.moveTo(cx, cy);              
        ctx.lineTo(cx, cy - rPx / 2);    
        ctx.lineTo(cx - rPx / 2, cy);    
        ctx.closePath();
        ctx.fill(); ctx.stroke();

        // четверть круга 
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, rPx / 2, 0, Math.PI / 2, false);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
    } else {
        ctx.font = 'bold 15px Arial';
        ctx.fillStyle = '#e74c3c';
        ctx.textAlign = 'center';
        ctx.fillText('Задайте R (от 1 до 4), чтобы увидеть область', cx, 50);
    }

    points.forEach(function (p, i) {
        const px = cx + p.x * scale;
        const py = cy - p.y * scale;
        let color = '#95a5a6';                      
        if (hasR) color = checkHit(p.x, p.y, currentR) ? '#27ae60' : '#e74c3c';
        const isLast = (i === points.length - 1);
        ctx.beginPath();
        ctx.arc(px, py, isLast ? 7 : 6, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = isLast ? '#2c3e50' : '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}

canvas.addEventListener('click', function (e) {
    if (busy) return;

    const rVal = getValidR();               
    if (rVal === null) {
        rError.textContent = 'Сначала задайте R (от 1 до 4)';
        alert('Сначала задайте корректный радиус R (от 1 до 4) — иначе невозможно определить координаты.');
        return;
    }

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const pixelX = (e.clientX - rect.left) * scaleX;
    const pixelY = (e.clientY - rect.top) * scaleY;

    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const scale = Math.min(W, H) / 12;

    const x = Number(((pixelX - cx) / scale).toFixed(2));
    const y = Number(((cy - pixelY) / scale).toFixed(2));

    if (x < -5 || x > 5 || y < -5 || y > 3) {
        alert('Точка вне допустимых значений: X от -5 до 5, Y от -5 до 3.');
        return;
    }

    const base = (typeof contextPath !== 'undefined') ? contextPath : '';
    const url = base + '/area?x=' + encodeURIComponent(x)
        + '&y=' + encodeURIComponent(y)
        + '&r=' + encodeURIComponent(rVal);

    runAfterCheck(x, y, rVal, function () { window.location.href = url; });
});

drawArea();