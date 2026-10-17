/* ============================================
   SATELLITE WATCH — Main Application Logic
   ============================================ */

// ----- Tab / view switching -----
function setupTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const views = document.querySelectorAll('.view');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach((b) => b.classList.toggle('active', b === btn));
      views.forEach((v) => v.classList.toggle('active', v.id === 'view-' + target));
    });
  });
}

// ----- Layer toggle buttons -----
function setupLayerToggles() {
  const layerBtns = document.querySelectorAll('.layer-btn');
  layerBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      const isActive = btn.classList.contains('active');
      const layerKey = btn.dataset.layer;

      if (window.map && window.map[layerKey]) {
        if (isActive) {
          window.map[layerKey].addTo(window.leafletMap);
        } else {
          window.leafletMap.removeLayer(window.map[layerKey]);
        }
      }
    });
  });
}

// ----- Before/After slider -----
function setupCompareSlider() {
  const slider = document.getElementById('compareSlider');
  const afterImg = document.getElementById('afterImage');
  const beforeImg = document.getElementById('beforeImage');

  if (!slider || !afterImg || !beforeImg) return;

  slider.addEventListener('input', () => {
    const val = slider.value;
    afterImg.style.clipPath = `inset(0 ${100 - val}% 0 0)`;
  });
}

// ----- Chat / Ask Gemini -----
function setupChat() {
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  const messages = document.getElementById('chatMessages');
  const loading = document.getElementById('chatLoading');

  if (!form || !input || !messages) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const question = input.value.trim();
    if (!question) return;

    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-message user';
    userMsg.textContent = question;
    messages.appendChild(userMsg);

    // Show loading
    if (loading) loading.style.display = 'flex';
    input.value = '';

    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          context: window.lastAnalysisResult || '',
          layer: window.currentLayer || 'ndvi'
        })
      });

      const data = await response.json();

      const botMsg = document.createElement('div');
      botMsg.className = 'chat-message bot';
      if (data.error) {
        botMsg.textContent = 'Error: ' + data.error;
      } else {
        botMsg.innerHTML = formatMarkdown(data.reply || data.explanation || 'No response');
      }
      messages.appendChild(botMsg);
    } catch (err) {
      const botMsg = document.createElement('div');
      botMsg.className = 'chat-message bot';
      botMsg.textContent = 'Connection error. Please try again.';
      messages.appendChild(botMsg);
    } finally {
      if (loading) loading.style.display = 'none';
      messages.scrollTop = messages.scrollHeight;
    }
  });
}

// ----- Markdown to HTML formatter -----
function formatMarkdown(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

// ----- NDVI Legend -----
function updateNDVILegend(min, max) {
  const minLabel = document.getElementById('ndviMin');
  const maxLabel = document.getElementById('ndviMax');
  if (minLabel) minLabel.textContent = min.toFixed(2);
  if (maxLabel) maxLabel.textContent = max.toFixed(2);
}

// ----- Pixel value display -----
function setupPixelInspector() {
  const canvas = document.getElementById('analysisCanvas');
  const readout = document.getElementById('pixelReadout');
  if (!canvas || !readout) return;

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);
    readout.textContent = `x:${x} y:${y}`;
  });

  canvas.addEventListener('mouseleave', () => {
    readout.textContent = 'Hover over image';
  });
}

// ----- Export / Download -----
function setupExport() {
  const exportBtn = document.getElementById('exportBtn');
  const exportModal = document.getElementById('exportModal');
  const exportClose = document.getElementById('exportClose');

  if (exportBtn && exportModal) {
    exportBtn.addEventListener('click', () => {
      exportModal.classList.add('open');
    });
  }

  if (exportClose && exportModal) {
    exportClose.addEventListener('click', () => {
      exportModal.classList.remove('open');
    });
    exportModal.addEventListener('click', (e) => {
      if (e.target === exportModal) exportModal.classList.remove('open');
    });
  }
}

// ----- Setup everything on load -----
document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  setupLayerToggles();
  setupCompareSlider();
  setupChat();
  setupPixelInspector();
  setupExport();
});

// ----- Expose to global scope for Leaflet callbacks -----
window.showPixelValue = function(lat, lng, value) {
  const el = document.getElementById('pixelReadout');
  if (el) {
    const layer = window.currentLayer || 'ndvi';
    const label = layer.charAt(0).toUpperCase() + layer.slice(1);
    el.textContent = `${label}: ${value.toFixed(4)} (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  }
};

window.showLoading = function() {
  const el = document.getElementById('loadingOverlay');
  if (el) el.style.display = 'flex';
};

window.hideLoading = function() {
  const el = document.getElementById('loadingOverlay');
  if (el) el.style.display = 'none';
};

window.showError = function(msg) {
  const el = document.getElementById('errorMessage');
  if (el) {
    el.textContent = msg;
    el.style.display = 'flex';
    setTimeout(() => { el.style.display = 'none'; }, 5000);
  }
};
