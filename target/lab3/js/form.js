const canvas = document.getElementById('areaCanvas');
const ctx = canvas.getContext('2d');
const xInput = document.getElementById('xInput');
const xError = document.getElementById('xError');
const rInput = document.getElementById('rInput');
const rError = document.getElementById('rError');
const yInput = document.getElementById('yInput');
const form = document.getElementById('pointForm');

let currentR = (typeof lastPoint !== 'undefined' && lastPoint) ? lastPoint.r : 2;
rInput.value = currentR;

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

function validateR() {
    const val = rInput.value.trim();
    if (val === '') { rError.textContent = ''; return false; }
    const num = parseFloat(val);
    if (isNaN(num) || num < 1 || num > 4) {
        rError.textContent = 'R должен быть числом от 1 до 4';
        return false;
    }
    rError.textContent = '';
    currentR = num;
    drawArea();
    return true;
}

rInput.addEventListener('input', function() {
    sanitizeInput(this);
    validateR();
});

form.addEventListener('submit', function (e) {
    const xOk = validateX();
    const rOk = validateR();
    if (!xOk || !rOk || xInput.value.trim() === '' || rInput.value.trim() === '') {
        e.preventDefault(); // Останавливаем отправку
        if (xInput.value.trim() === '') xError.textContent = 'Заполните X';
        if (rInput.value.trim() === '') rError.textContent = 'Заполните R';
    }
});

function drawArea() {
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const scale = Math.min(W, H) / 12;
    const rPx = currentR * scale;

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
    ctx.fillText('X', W - 15, cy + 18);
    ctx.fillText('Y', cx + 10, 15);

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

    // последняя проверенная точка, если есть
    if (typeof lastPoint !== 'undefined' && lastPoint) {
        const px = cx + lastPoint.x * scale;
        const py = cy - lastPoint.y * scale;
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fillStyle = lastPoint.hit ? '#27ae60' : '#e74c3c';
        ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
    }
}

canvas.addEventListener('click', function (e) {
    const rVal = parseFloat(rInput.value.trim().replace(',', '.'));
    if (rInput.value.trim() === '' || isNaN(rVal) || rVal < 1 || rVal > 4) {
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

    const xVal = ((pixelX - cx) / scale).toFixed(2);
    const yVal = ((cy - pixelY) / scale).toFixed(2);

    const base = (typeof contextPath !== 'undefined') ? contextPath : '';
    window.location.href = base + '/area?x=' + encodeURIComponent(xVal)
        + '&y=' + encodeURIComponent(yVal)
        + '&r=' + encodeURIComponent(rVal);
});

drawArea();
