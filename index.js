const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const textCanvas = document.getElementById('textCanvas');
const textCtx = textCanvas.getContext('2d');

let width = 0;
let height = 0;
let dpr = 1;

const textState = {
  x: 0,
  y: 0,
  actualWidth: 0,
  actualHeight: 0,
};

const TEXT_LABEL = 'zadesign';
const TEXT_PADDING = 12;

let isDraggingText = false;
let mouseX = 0;
let mouseY = 0;
let activePointerId = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let dragTargetX = 0;
let dragTargetY = 0;

function getFontSize() {
  return Math.round(Math.min(width, height) * 0.1);
}

function updateTextMetrics() {
  const fontSize = getFontSize();
  textCtx.font = `300 ${fontSize}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
  const textMetrics = textCtx.measureText(TEXT_LABEL);
  textState.actualWidth = textMetrics.width / 2;
  textState.actualHeight = fontSize * 0.6;
  return fontSize;
}

function applyClampedTextPosition(x, y) {
  const halfWidth = textState.actualWidth + TEXT_PADDING;
  const halfHeight = textState.actualHeight + TEXT_PADDING;
  textState.x = Math.max(halfWidth, Math.min(width - halfWidth, x));
  textState.y = Math.max(halfHeight, Math.min(height - halfHeight, y));
}

function resize() {
  dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  textCanvas.width = Math.floor(width * dpr);
  textCanvas.height = Math.floor(height * dpr);
  textCanvas.style.width = `${width}px`;
  textCanvas.style.height = `${height}px`;
  textCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

  textState.x = width * 0.75;
  textState.y = height / 2;
  updateTextMetrics();
  applyClampedTextPosition(textState.x, textState.y);
}

const TAU = Math.PI * 2;

function ringClearance(x, y, centerX, centerY, radius, rings, minRing) {
  const distance = Math.hypot(x - centerX, y - centerY);
  let minDiff = Infinity;

  for (let ring = minRing; ring <= rings; ring += 1) {
    const ringRadius = (radius * ring) / rings;
    const diff = Math.abs(distance - ringRadius);
    if (diff < minDiff) minDiff = diff;
  }

  return minDiff;
}

function findSafeTextPosition(centerX, centerY, radius, rings, minRing, textRadius) {
  const bandWidth = Math.max(16, radius * 0.02);
  const safeDistance = bandWidth + textRadius + 16;
  const margin = safeDistance + 32;
  const halfWidth = textState.actualWidth + TEXT_PADDING;
  const halfHeight = textState.actualHeight + TEXT_PADDING;
  const minX = Math.max(halfWidth, margin);
  const maxX = Math.min(width - halfWidth, width - margin);
  const minY = Math.max(halfHeight, margin);
  const maxY = Math.min(height - halfHeight, height - margin);
  const columns = 8;
  const rows = 5;

  let bestX = textState.x;
  let bestY = textState.y;
  let bestScore = -Infinity;

  for (let gy = 0; gy < rows; gy += 1) {
    for (let gx = 0; gx < columns; gx += 1) {
      const x = minX + (gx / Math.max(1, columns - 1)) * Math.max(0, maxX - minX);
      const y = minY + (gy / Math.max(1, rows - 1)) * Math.max(0, maxY - minY);

      const clearance = ringClearance(x, y, centerX, centerY, radius, rings, minRing);
      const isSafe = clearance > safeDistance;
      const distToCurrentPos = Math.hypot(x - textState.x, y - textState.y);
      const score = (isSafe ? 1000 : clearance) - distToCurrentPos * 0.1;

      if (score > bestScore) {
        bestScore = score;
        bestX = x;
        bestY = y;
      }
    }
  }

  textState.x = bestX;
  textState.y = bestY;
  applyClampedTextPosition(textState.x, textState.y);
}

function intersectsCross(textX, textY, halfWidth, halfHeight) {
  if (!lastCrossArmLength || !lastCrossThickness) return false;

  const textLeft = textX - halfWidth;
  const textRight = textX + halfWidth;
  const textTop = textY - halfHeight;
  const textBottom = textY + halfHeight;

  const verticalLeft = lastCenterX - lastCrossThickness / 2;
  const verticalRight = lastCenterX + lastCrossThickness / 2;
  const verticalTop = lastCenterY - lastCrossArmLength;
  const verticalBottom = lastCenterY + lastCrossArmLength;

  const horizontalLeft = lastCenterX - lastCrossArmLength;
  const horizontalRight = lastCenterX + lastCrossArmLength;
  const horizontalTop = lastCenterY - lastCrossThickness / 2;
  const horizontalBottom = lastCenterY + lastCrossThickness / 2;

  const intersectsVertical = !(textRight < verticalLeft || textLeft > verticalRight || textBottom < verticalTop || textTop > verticalBottom);
  const intersectsHorizontal = !(textRight < horizontalLeft || textLeft > horizontalRight || textBottom < horizontalTop || textTop > horizontalBottom);

  return intersectsVertical || intersectsHorizontal;
}

function ejectTextOutsideRing() {
  if (!lastRadius) return;

  let dirX = textState.x - lastCenterX;
  let dirY = textState.y - lastCenterY;
  if (dirX === 0 && dirY === 0) dirX = 1;
  const length = Math.hypot(dirX, dirY) || 1;
  dirX /= length;
  dirY /= length;

  const margin = Math.max(32, lastRadius * 0.05) + Math.max(textState.actualWidth, textState.actualHeight);
  const targetDistance = lastRadius + margin;
  textState.x = lastCenterX + dirX * targetDistance;
  textState.y = lastCenterY + dirY * targetDistance;

  applyClampedTextPosition(textState.x, textState.y);
  dragTargetX = textState.x;
  dragTargetY = textState.y;
}

function drawPattern(timeSeconds) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
  ctx.fillRect(0, 0, width, height);

  const wanderX = Math.cos(timeSeconds * 0.09 + Math.sin(timeSeconds * 0.05) * 0.6);
  const wanderY = Math.sin(timeSeconds * 0.08 + Math.cos(timeSeconds * 0.04) * 0.6);
  const centerX = width / 2 + wanderX * width * 0.24;
  const centerY = height / 2 + wanderY * height * 0.24;
  const radius = Math.min(width, height) * 0.45;
  const crossArmLength = radius * 0.18;
  const crossThickness = Math.max(8, radius * 0.015);

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const rings = 24;
  const segments = 420;
  const speed = 0.1;
  const drift = Math.sin(timeSeconds * 0.08) * 0.08;
  const shapePower = 2.2;
  const minRing = 20;

  // Layered parametric squares produce a geometric, generative pattern.
  for (let ring = minRing; ring <= rings; ring += 1) {
    const ringRadius = (radius * ring) / rings;
    ctx.beginPath();

    for (let i = 0; i <= segments; i += 1) {
      const a = (i / segments) * TAU + drift + Math.sin(timeSeconds * 0.05 + ring * 0.2) * 0.06;
      const wobble =
        Math.sin(a * 2.2 + timeSeconds * speed + ring) * 0.08 +
        Math.cos(a * 3.1 - timeSeconds * speed * 0.8) * 0.06 +
        Math.sin(a * 1.6 - timeSeconds * 0.4) * 0.04;
      const r = ringRadius * (1 + wobble);
      const cosA = Math.cos(a);
      const sinA = Math.sin(a);
      const scale = Math.pow(Math.abs(cosA), shapePower) + Math.pow(Math.abs(sinA), shapePower);
      const denom = Math.pow(scale, 1 / shapePower) || 1;
      const x = (cosA / denom) * r;
      const y = (sinA / denom) * r;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    const pulse = 0.85 + 0.15 * Math.sin(timeSeconds * 0.35 + ring * 0.35);
    const alpha = (0.015 + (ring / rings) * 0.14) * pulse;
    const hue = (timeSeconds * 18 + ring * 10) % 360;
    const smokeLight = 58 + 10 * Math.sin(timeSeconds * 0.1 + ring * 0.2);
    ctx.strokeStyle = `hsla(${hue}, 25%, ${smokeLight}%, ${alpha})`;
    ctx.shadowColor = `hsla(${hue}, 25%, ${smokeLight}%, ${alpha * 0.7})`;
    ctx.shadowBlur = 20 + (ring / rings) * 22;
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  // Invisible cross still updates geometry for collision logic.
  ctx.save();
  ctx.globalAlpha = 0;
  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0)';
  ctx.shadowBlur = 0;
  ctx.fillRect(-crossThickness / 2, -crossArmLength, crossThickness, crossArmLength * 2);
  ctx.fillRect(-crossArmLength, -crossThickness / 2, crossArmLength * 2, crossThickness);
  ctx.restore();

  ctx.restore();
}

function renderText(fontSize) {
  textCtx.clearRect(0, 0, width, height);

  const renderX = Math.max(textState.actualWidth + TEXT_PADDING, Math.min(width - textState.actualWidth - TEXT_PADDING, textState.x));
  const renderY = Math.max(textState.actualHeight + TEXT_PADDING, Math.min(height - textState.actualHeight - TEXT_PADDING, textState.y));

  textCtx.save();
  textCtx.font = `300 ${fontSize}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
  textCtx.fillStyle = 'rgba(255, 255, 255, 1)';
  textCtx.textAlign = 'center';
  textCtx.textBaseline = 'middle';
  textCtx.fillText(TEXT_LABEL, renderX, renderY);
  textCtx.restore();
}

function animate(now) {
  const timeSeconds = now * 0.001;
  drawPattern(timeSeconds);
  requestAnimationFrame(animate);
}

let lastWanderX = 0;
let lastWanderY = 0;
let lastCenterX = 0;
let lastCenterY = 0;
let lastRadius = 0;
let lastCrossArmLength = 0;
let lastCrossThickness = 0;

function updateTextCollision(timeSeconds) {
  const wanderX = Math.cos(timeSeconds * 0.09 + Math.sin(timeSeconds * 0.05) * 0.6);
  const wanderY = Math.sin(timeSeconds * 0.08 + Math.cos(timeSeconds * 0.04) * 0.6);
  const centerX = width / 2 + wanderX * width * 0.24;
  const centerY = height / 2 + wanderY * height * 0.24;
  const radius = Math.min(width, height) * 0.45;

  lastCenterX = centerX;
  lastCenterY = centerY;
  lastRadius = radius;
  lastCrossArmLength = radius * 0.18;
  lastCrossThickness = Math.max(8, radius * 0.015);

  const fontSize = updateTextMetrics();
  const textRadius = fontSize * 0.6;
  const bandWidth = Math.max(16, radius * 0.02);
  const textActualWidth = textState.actualWidth;
  const textActualHeight = textState.actualHeight;

  if (!isDraggingText) {
    const currentClearance = ringClearance(textState.x, textState.y, centerX, centerY, radius, 24, 20);
    const minSafeDistance = bandWidth + textRadius + 16;

    if (currentClearance < minSafeDistance) {
      findSafeTextPosition(centerX, centerY, radius, 24, 20, textRadius);
    }
  }

  if (isDraggingText) {
    applyClampedTextPosition(dragTargetX, dragTargetY);
  }

  if (intersectsCross(textState.x, textState.y, textActualWidth, textActualHeight)) {
    ejectTextOutsideRing();
    applyClampedTextPosition(textState.x, textState.y);
  }

  applyClampedTextPosition(textState.x, textState.y);
  renderText(fontSize);
}

function updateText() {
  const timeSeconds = performance.now() * 0.001;
  updateTextCollision(timeSeconds);
  requestAnimationFrame(updateText);
}

resize();
window.addEventListener('resize', resize);
requestAnimationFrame(animate);
requestAnimationFrame(updateText);

textCanvas.addEventListener('pointerdown', (e) => {
  const rect = textCanvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
  const withinX = Math.abs(mouseX - textState.x) <= textState.actualWidth + 12;
  const withinY = Math.abs(mouseY - textState.y) <= textState.actualHeight + 12;
  if (withinX && withinY) {
    isDraggingText = true;
    activePointerId = e.pointerId;
    dragOffsetX = textState.x - mouseX;
    dragOffsetY = textState.y - mouseY;
    dragTargetX = textState.x;
    dragTargetY = textState.y;
    textCanvas.setPointerCapture(e.pointerId);
  }
});

textCanvas.addEventListener('pointermove', (e) => {
  if (!isDraggingText || e.pointerId !== activePointerId) return;
  const rect = textCanvas.getBoundingClientRect();
  const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
  const lastEvent = events[events.length - 1];
  mouseX = lastEvent.clientX - rect.left;
  mouseY = lastEvent.clientY - rect.top;
  dragTargetX = mouseX + dragOffsetX;
  dragTargetY = mouseY + dragOffsetY;
});

const stopDrag = (e) => {
  if (e.pointerId !== activePointerId) return;
  isDraggingText = false;
  activePointerId = null;
};

textCanvas.addEventListener('pointerup', stopDrag);
textCanvas.addEventListener('pointercancel', stopDrag);
textCanvas.addEventListener('pointerleave', stopDrag);

const menuToggle = document.querySelector('.menu-toggle');
const menuOverlay = document.querySelector('.menu-overlay');
const menuDialog = document.querySelector('.menu-dialog');
const menuClose = document.querySelector('.menu-close');
const menuSearch = document.querySelector('.menu-search');
const menuItems = [...document.querySelectorAll('.menu-item')];
const menuEmpty = document.querySelector('.menu-empty');

function setMenuOpen(isOpen) {
  document.body.classList.toggle('menu-open', isOpen);
  menuOverlay.classList.toggle('is-open', isOpen);
  menuOverlay.setAttribute('aria-hidden', String(!isOpen));
  menuToggle.setAttribute('aria-expanded', String(isOpen));

  if (isOpen) {
    window.setTimeout(() => menuSearch.focus(), 500);
    return;
  }

  menuSearch.value = '';
  filterMenu('');
  menuToggle.focus();
}

function filterMenu(query) {
  const normalizedQuery = query.trim().toLowerCase();
  let visibleItems = 0;

  menuItems.forEach((item) => {
    const isMatch = item.dataset.menuLabel.includes(normalizedQuery);
    item.hidden = !isMatch;
    if (isMatch) visibleItems += 1;
  });

  menuEmpty.classList.toggle('is-visible', visibleItems === 0);
}

menuToggle.addEventListener('click', () => setMenuOpen(true));
menuClose.addEventListener('click', () => setMenuOpen(false));
menuSearch.addEventListener('input', (event) => filterMenu(event.target.value));

menuOverlay.addEventListener('click', (event) => {
  if (!menuDialog.contains(event.target)) setMenuOpen(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuOverlay.classList.contains('is-open')) {
    setMenuOpen(false);
  }
});
