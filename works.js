const previewEntries = [...document.querySelectorAll('.work-entry-preview[data-preview-project]')];
const floatingPreview = document.querySelector('.work-floating-preview');
const floatingPreviewImage = floatingPreview?.querySelector('img');

const abletonPreviewImages = [
  './assets/work-hover/ableton-preview-1.png',
  './assets/work-hover/ableton-preview-2.png',
  './assets/work-hover/ableton-preview-3.png',
  './assets/work-hover/ableton-preview-4.png',
];

const pardonPreviewImages = [
  './assets/work-hover/pardon-preview-1.png?v=2',
  './assets/work-hover/pardon-preview-2.png?v=2',
  './assets/work-hover/pardon-preview-3.png?v=2',
  './assets/work-hover/pardon-preview-4.png?v=2',
  './assets/work-hover/pardon-preview-5.png?v=2',
  './assets/work-hover/pardon-preview-6.png?v=2',
  './assets/work-hover/pardon-preview-7.png?v=2',
];

const projectPreviewImages = {
  ableton: abletonPreviewImages,
  pardon: pardonPreviewImages,
};

let activePreviewEntry = null;
let activeProject = '';
let targetX = window.innerWidth / 2;
let targetY = window.innerHeight / 2;
let currentX = targetX;
let currentY = targetY;
let targetLineY = 50;
let currentLineY = targetLineY;
let frameId = 0;
let isHoveringPreview = false;
let isSuspendedForLink = false;
let activeImageIndex = 0;
let activePreviewImages = abletonPreviewImages;
let imageCycleTimeout = 0;

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

function setPreviewImage(index) {
  if (!floatingPreviewImage || index === activeImageIndex) return;

  activeImageIndex = index;
  floatingPreviewImage.src = activePreviewImages[index];
}

function getNextImageIndex() {
  if (activePreviewImages.length < 2) return 0;
  if (activeProject === 'pardon') return (activeImageIndex + 1) % activePreviewImages.length;

  let nextIndex = activeImageIndex;
  while (nextIndex === activeImageIndex) {
    nextIndex = Math.floor(Math.random() * activePreviewImages.length);
  }

  return nextIndex;
}

function clearImageCycle() {
  if (!imageCycleTimeout) return;
  window.clearTimeout(imageCycleTimeout);
  imageCycleTimeout = 0;
}

function scheduleImageCycle() {
  clearImageCycle();
  if (!isHoveringPreview || isSuspendedForLink) return;

  const delay = activeProject === 'pardon' ? 900 : 1000 + Math.random() * 1000;
  imageCycleTimeout = window.setTimeout(() => {
    setPreviewImage(getNextImageIndex());
    scheduleImageCycle();
  }, delay);
}

function isInteractiveTarget(target) {
  return Boolean(target.closest('a'));
}

function getPreviewDimensions() {
  if (activeProject === 'pardon') {
    const height = Math.min(window.innerHeight * 0.62, 640);
    return { width: height * 1170 / 2532, height };
  }

  const width = Math.min(window.innerWidth * 0.31, 560);
  return { width, height: width * 9 / 16 };
}

function showHoverEffect() {
  if (isSuspendedForLink || !activePreviewEntry) return;

  activePreviewEntry.classList.add('is-hovered');
  activePreviewEntry.style.setProperty('--hover-line-opacity', '0.92');
  floatingPreview?.classList.add('is-visible');
  scheduleImageCycle();
}

function hideHoverEffect() {
  activePreviewEntry?.classList.remove('is-hovered');
  activePreviewEntry?.style.setProperty('--hover-line-opacity', '0');
  floatingPreview?.classList.remove('is-visible');
  clearImageCycle();
}

function positionPreview(clientX, clientY) {
  const { width: previewWidth, height: previewHeight } = getPreviewDimensions();
  const margin = 32;
  const offsetX = clientX > window.innerWidth * 0.62 ? -previewWidth * 0.58 : previewWidth * 0.58;
  const offsetY = clientY > window.innerHeight * 0.58 ? -previewHeight * 0.5 : previewHeight * 0.5;

  targetX = clamp(clientX + offsetX, margin + previewWidth / 2, window.innerWidth - margin - previewWidth / 2);
  targetY = clamp(clientY + offsetY, margin + previewHeight / 2, window.innerHeight - margin - previewHeight / 2);
}

function animateHover() {
  frameId = 0;

  currentX += (targetX - currentX) * 0.18;
  currentY += (targetY - currentY) * 0.18;
  currentLineY += (targetLineY - currentLineY) * 0.24;

  floatingPreview?.style.setProperty('--preview-x', `${currentX.toFixed(2)}px`);
  floatingPreview?.style.setProperty('--preview-y', `${currentY.toFixed(2)}px`);
  activePreviewEntry?.style.setProperty('--hover-y', `${currentLineY.toFixed(2)}px`);

  if (
    isHoveringPreview ||
    Math.abs(targetX - currentX) > 0.5 ||
    Math.abs(targetY - currentY) > 0.5 ||
    Math.abs(targetLineY - currentLineY) > 0.5
  ) {
    frameId = window.requestAnimationFrame(animateHover);
  }
}

function requestHoverFrame() {
  if (!frameId) frameId = window.requestAnimationFrame(animateHover);
}

if (previewEntries.length && floatingPreview && floatingPreviewImage) {
  Object.values(projectPreviewImages).flat().forEach((src) => {
    const image = new Image();
    image.src = src;
  });

  previewEntries.forEach((entry) => {
    entry.addEventListener('pointerenter', (event) => {
      if (window.matchMedia('(max-width: 620px)').matches) return;

      activePreviewEntry = entry;
      activeProject = entry.dataset.previewProject;
      activePreviewImages = projectPreviewImages[activeProject] || abletonPreviewImages;
      activeImageIndex = 0;
      floatingPreviewImage.src = activePreviewImages[0];
      floatingPreview.classList.toggle('is-portrait', activeProject === 'pardon');
      isHoveringPreview = true;
      isSuspendedForLink = isInteractiveTarget(event.target);
      currentX = event.clientX;
      currentY = event.clientY;
      targetX = currentX;
      targetY = currentY;
      showHoverEffect();
      requestHoverFrame();
    });

    entry.addEventListener('pointermove', (event) => {
      if (!isHoveringPreview || activePreviewEntry !== entry) return;

      const shouldSuspend = isInteractiveTarget(event.target);
      if (shouldSuspend !== isSuspendedForLink) {
        isSuspendedForLink = shouldSuspend;
        if (isSuspendedForLink) hideHoverEffect();
        else showHoverEffect();
      }

      if (isSuspendedForLink) return;

      const rect = entry.getBoundingClientRect();
      targetLineY = clamp(event.clientY - rect.top, 22, rect.height - 22);
      positionPreview(event.clientX, event.clientY);
      requestHoverFrame();
    });

    entry.addEventListener('pointerleave', () => {
      if (activePreviewEntry !== entry) return;

      isHoveringPreview = false;
      isSuspendedForLink = false;
      hideHoverEffect();
      requestHoverFrame();
    });
  });
}
