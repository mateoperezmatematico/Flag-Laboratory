// --- 1. EXPLICIT FONT LOADING FOR CANVAS & DOM ---
const fontFlags = new FontFace('CatrinityFlags', 'url(./CatrinityFlags.otf)');
const fontText = new FontFace('Catrinity', 'url(./Catrinity.otf)');

Promise.all([fontFlags.load(), fontText.load()])
  .then(([loadedFlags, loadedText]) => {
    document.fonts.add(loadedFlags);
    document.fonts.add(loadedText);
    updateFlag();
  })
  .catch((err) => {
    console.warn('Font loading fallback:', err);
    updateFlag();
  });

document.body.innerHTML = `
  <style>
    @font-face {
      font-family: 'CatrinityFlags';
      src: url('./CatrinityFlags.otf') format('opentype');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'Catrinity';
      src: url('./Catrinity.otf') format('opentype');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 40px;
      background: #f4f4f9;
      margin: 0;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    input {
      font-size: 18px;
      padding: 10px;
      width: 100%;
      box-sizing: border-box;
      margin-top: 8px;
      margin-bottom: 20px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .flag-display {
      font-size: 140px;
      line-height: 1;
      text-align: center;
      min-height: 220px;
      border: 2px dashed #ccc;
      border-radius: 8px;
      padding: 30px;
      white-space: pre;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ffffff;
      overflow: hidden;
      image-rendering: pixelated;
      image-rendering: crisp-edges;
    }
    .flag-wrapper {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1em;
      height: 1em;
      position: relative;
    }
    .flag-node {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1em;
      height: 1em;
      transform-origin: 50% 50%;
      transition: transform 0.2s ease, color 0.2s ease;
      position: absolute;
      top: 0;
      left: 0;
    }
    .font-flag {
      font-family: 'CatrinityFlags', sans-serif;
    }
    .font-text {
      font-family: 'Catrinity', sans-serif;
      font-variant-emoji: text;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 12px;
      margin-top: 16px;
      margin-bottom: 20px;
    }
    .info-card {
      background: #f8f9fa;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 10px 12px;
      font-size: 12px;
      line-height: 1.4;
      color: #334155;
    }
    .info-card strong {
      display: block;
      color: #0f172a;
      font-size: 13px;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .info-card code {
      background: #e2e8f0;
      color: #0f172a;
      padding: 1px 4px;
      border-radius: 3px;
      font-family: monospace;
      font-size: 11px;
    }
    .button-group {
      display: flex;
      gap: 12px;
      justify-content: center;
      margin-top: 20px;
    }
    button {
      background-color: #2da44e;
      color: white;
      border: none;
      padding: 10px 18px;
      font-size: 14px;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.2s, transform 0.1s;
    }
    button:hover {
      background-color: #2c974b;
    }
    button:active {
      background-color: #298e46;
      transform: scale(0.98);
    }
  </style>
  <div class="container">
    <h2>Catrinity Multi-Font & Layer Lab</h2>
    
    <div class="info-grid">
      <div class="info-card">
        <strong>🚩 Font Routing & Ranges</strong>
        • Flags (<b>CatrinityFlags</b>): ISO-2 (<code>RU</code>), Tag Sequences (<code>gbeng</code>), PUA (<code>#FDE00</code>-<code>#FDEFF</code>)<br>
        • Symbols & Text (<b>Catrinity</b>): All non-flag glyphs (<code>#2605</code> star, <code>#2B24</code> circle)<br>
        • Text Emoji Override: Forced via <code>\\uFE0E</code> + <code>font-variant-emoji: text</code>
      </div>
      
      <div class="info-card">
        <strong>🎨 Color & Stroke Commands</strong>
        • Fill Color: <code>!c(#HEX)</code> or <code>!color(rgba)</code><br>
        • Stroke Color: <code>!bc(#HEX)</code> or <code>!border(color)</code><br>
        • Stroke Thickness: <code>!bw(2)</code> (default: 1px)
      </div>

      <div class="info-card">
        <strong>📐 Scaling & Position Modifiers</strong>
        • Scale: <code>!s30</code> (30% scale, original = 100%)<br>
        • Offset X: <code>!dx-10</code> / <code>!dx25</code> (horizontal px)<br>
        • Offset Y: <code>!dy-15</code> / <code>!dy30</code> (vertical px)
      </div>

      <div class="info-card">
        <strong>🔄 Rotation & Flip Controls</strong>
        • Rotation: <code>!r90</code>, <code>!r180</code>, <code>!r270</code><br>
        • Horizontal Flip: <code>!fh</code> (mirror left-right)<br>
        • Vertical Flip: <code>!fv</code> (mirror upside-down)
      </div>

      <div class="info-card">
        <strong>🥞 Layering & Matrix Rules</strong>
        • Stacking: <code>!layer</code> or <code>!stack</code> creates a new top element<br>
        • Reset Matrix: <code>!reset</code> clears transform/color stack<br>
        • Transform Chain: <code>scale</code> ➔ <code>flip</code> ➔ <code>rotate</code> ➔ <code>translate</code>
      </div>

      <div class="info-card">
        <strong>💡 Preset Recipes</strong>
        • Vojvodina: <code>!fv RU !layer !s18 !dy40 !c(gold) #2605 !layer !s18 !dx-60 !dy100 !c(gold) #2605 !layer !s18 !dx60 !dy100 !c(gold) #2605</code><br>
        • Belgian Congo: <code>AC !layer !s94 !dy-1 !c(darkblue) #2B24 !layer !s30 !c(gold) !s50 !dy-15 #2605</code>
      </div>
    </div>

    <input type="text" id="code" placeholder="e.g., AC !layer !s94 !dy-1 !c(darkblue) #2B24 !layer !s30 !c(gold) !s50 !dy-15 #2605" value="AC !layer !s94 !dy-1 !c(#009A49) #2B24 !layer !s120 !dx0 !dy0 !c(white) #2261 !layer !s60 !dx-17 !dy-40 !c(#D7141A) #25AC !layer !s14 !dx-70 !dy-200 !c(white) #270B !layer !s14 !dx-150 !dy-265 !c(white) #2605 !layer !s14 !dx-70 !dy-290 !c(white) #2605 !layer !s14 !dx30 !dy-265 !c(white) #2605" autofocus>
    <div class="flag-display" id="output"></div>
    <div class="button-group">
      <button id="downloadBtn">Download PNG</button>
      <button id="copyImgBtn">Copy Image to Clipboard</button>
    </div>
  </div>
`;

/**
 * TOKEN PARSER & FONT ROUTER
 * Flags (ISO Regional Sequences, ISO Tag Sequences, Catrinity PUA block FDE00–FDEFF) -> CatrinityFlags
 * Everything else -> Catrinity (forced text presentation via \uFE0E)
 */
function processToken(token) {
  if (!token) return { text: '', font: 'Catrinity' };

  // 1. ISO 3166-2 Tag Sequences (e.g. gbeng, usca, esct) -> CatrinityFlags
  if (/^[a-z0-9]{3,6}$/i.test(token) && !token.startsWith('#')) {
    let sequence = '\u{1F3F4}';
    for (const char of token.toLowerCase()) {
      sequence += String.fromCodePoint(0xE0000 + char.charCodeAt(0));
    }
    sequence += '\u{E007F}';
    return { text: sequence, font: 'CatrinityFlags' };
  }

  // 2. ISO 3166-1 Country Regional Indicator Sequences (e.g. RU, US, VE, JP) -> CatrinityFlags
  if (token.length === 2 && /^[A-Za-z]{2}$/.test(token)) {
    const upper = token.toUpperCase();
    const base = 0x1F1E6;
    const char1 = upper.charCodeAt(0) - 65 + base;
    const char2 = upper.charCodeAt(1) - 65 + base;
    return { text: String.fromCodePoint(char1, char2), font: 'CatrinityFlags' };
  }

  const hexClean = token.startsWith('#') ? token.slice(1) : token;

  // 3. Hex Codepoints Evaluation
  if (/^[0-9A-F]{4,6}$/i.test(hexClean)) {
    const codePoint = parseInt(hexClean, 16);

    // CatrinityFlags Specific PUA Block (FDE00–FDEFF) or Standard Flag Emoji Sequences
    const isCatrinityFlagPUA = (codePoint >= 0xFDE00 && codePoint <= 0xFDEFF);
    const isFlagSequenceChar = (codePoint >= 0x1F1E6 && codePoint <= 0x1F1FF) || codePoint === 0x1F3F4;

    if (isCatrinityFlagPUA || isFlagSequenceChar) {
      return { text: String.fromCodePoint(codePoint), font: 'CatrinityFlags' };
    } else {
      // NON-FLAG HEX GLYPHS -> Catrinity (append text selector \uFE0E)
      return { text: String.fromCodePoint(codePoint) + '\uFE0E', font: 'Catrinity' };
    }
  }

  // 4. Fallback Symbols / Plain Text -> Catrinity
  return { text: token, font: 'Catrinity' };
}

function updateFlag() {
  const inputVal = document.getElementById('code').value.trim();
  const outputEl = document.getElementById('output');
  outputEl.innerHTML = '';

  if (!inputVal) return;

  const tokens = inputVal.split(/\s+/);
  
  let currentWrapper = null;
  let isLayering = false;

  let rotation = 0;
  let scale = 1.0;
  let flipH = false;
  let flipV = false;
  let dx = 0;
  let dy = 0;
  let color = '';
  let borderColor = '';
  let borderWidth = 1;

  function resetTransforms() {
    rotation = 0;
    scale = 1.0;
    flipH = false;
    flipV = false;
    dx = 0;
    dy = 0;
    color = '';
    borderColor = '';
    borderWidth = 1;
  }

  for (const token of tokens) {
    if (token.startsWith('!')) {
      const cmd = token.toLowerCase();

      if (cmd === '!layer' || cmd === '!stack') {
        isLayering = true;
        resetTransforms();
      } else if (cmd === '!r90') {
        rotation = (rotation + 90) % 360;
      } else if (cmd === '!r180') {
        rotation = (rotation + 180) % 360;
      } else if (cmd === '!r270') {
        rotation = (rotation + 270) % 360;
      } else if (cmd === '!fh') {
        flipH = !flipH;
      } else if (cmd === '!fv') {
        flipV = !flipV;
      } else if (cmd.startsWith('!s')) {
        const percent = parseFloat(cmd.slice(2));
        if (!isNaN(percent)) scale = percent / 100;
      } else if (cmd.startsWith('!dx')) {
        const val = parseFloat(cmd.slice(3));
        if (!isNaN(val)) dx = val;
      } else if (cmd.startsWith('!dy')) {
        const val = parseFloat(cmd.slice(4));
        if (!isNaN(val)) dy = val;
      } else if (cmd.startsWith('!c(') || cmd.startsWith('!color(')) {
        const match = token.match(/!(?:c|color)\(([^)]+)\)/i);
        if (match) color = match[1];
      } else if (cmd.startsWith('!bc(') || cmd.startsWith('!border(')) {
        const match = token.match(/!(?:bc|border)\(([^)]+)\)/i);
        if (match) borderColor = match[1];
      } else if (cmd.startsWith('!bw')) {
        const match = token.match(/!bw(?:\(([^)]+)\)|(-?\d+(?:\.\d+)?))/i);
        if (match) {
          const val = parseFloat(match[1] || match[2]);
          if (!isNaN(val)) borderWidth = val;
        }
      } else if (cmd === '!reset') {
        resetTransforms();
        isLayering = false;
      }
      continue;
    }

    const { text, font } = processToken(token);
    if (!text) continue;

    if (!isLayering || !currentWrapper) {
      currentWrapper = document.createElement('span');
      currentWrapper.className = 'flag-wrapper';
      outputEl.appendChild(currentWrapper);
    }

    const span = document.createElement('span');
    span.className = `flag-node ${font === 'CatrinityFlags' ? 'font-flag' : 'font-text'}`;
    span.textContent = text;

    const transforms = [];
    if (scale !== 1.0) transforms.push(`scale(${scale})`);
    if (flipH || flipV) transforms.push(`scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})`);
    if (rotation !== 0) transforms.push(`rotate(${rotation}deg)`);
    if (dx !== 0 || dy !== 0) transforms.push(`translate(${dx}px, ${dy}px)`);

    if (transforms.length > 0) {
      span.style.transform = transforms.join(' ');
    }

    if (color) {
      span.style.color = color;
      span.style.webkitTextFillColor = color;
    }

    if (borderColor) {
      span.style.webkitTextStroke = `${borderWidth}px ${borderColor}`;
    }

    currentWrapper.appendChild(span);

    resetTransforms();
    isLayering = false;
  }
}

/**
 * OFFSCREEN CANVAS HIGH-DPI RASTERIZER
 * Direct font routing + Nearest Neighbor downsampling + Alpha binarization
 */
function captureCrispCanvas(targetWidth = 280, targetHeight = 280) {
  const inputVal = document.getElementById('code').value.trim();
  if (!inputVal) return null;

  const scaleFactor = 4;
  const highResCanvas = document.createElement('canvas');
  highResCanvas.width = targetWidth * scaleFactor;
  highResCanvas.height = targetHeight * scaleFactor;
  const highCtx = highResCanvas.getContext('2d');

  highCtx.imageSmoothingEnabled = true;
  highCtx.imageSmoothingQuality = 'high';

  const tokens = inputVal.split(/\s+/);
  const centerX = highResCanvas.width / 2;
  const centerY = highResCanvas.height / 2;

  let rotation = 0;
  let scale = 1.0;
  let flipH = false;
  let flipV = false;
  let dx = 0;
  let dy = 0;
  let color = '#000000';
  let borderColor = null;
  let borderWidth = 1;

  function resetTransforms() {
    rotation = 0;
    scale = 1.0;
    flipH = false;
    flipV = false;
    dx = 0;
    dy = 0;
    color = '#000000';
    borderColor = null;
    borderWidth = 1;
  }

  for (const token of tokens) {
    if (token.startsWith('!')) {
      const cmd = token.toLowerCase();

      if (cmd === '!layer' || cmd === '!stack') {
        resetTransforms();
      } else if (cmd === '!r90') {
        rotation = (rotation + 90) % 360;
      } else if (cmd === '!r180') {
        rotation = (rotation + 180) % 360;
      } else if (cmd === '!r270') {
        rotation = (rotation + 270) % 360;
      } else if (cmd === '!fh') {
        flipH = !flipH;
      } else if (cmd === '!fv') {
        flipV = !flipV;
      } else if (cmd.startsWith('!s')) {
        const percent = parseFloat(cmd.slice(2));
        if (!isNaN(percent)) scale = percent / 100;
      } else if (cmd.startsWith('!dx')) {
        const val = parseFloat(cmd.slice(3));
        if (!isNaN(val)) dx = val;
      } else if (cmd.startsWith('!dy')) {
        const val = parseFloat(cmd.slice(4));
        if (!isNaN(val)) dy = val;
      } else if (cmd.startsWith('!c(') || cmd.startsWith('!color(')) {
        const match = token.match(/!(?:c|color)\(([^)]+)\)/i);
        if (match) color = match[1];
      } else if (cmd.startsWith('!bc(') || cmd.startsWith('!border(')) {
        const match = token.match(/!(?:bc|border)\(([^)]+)\)/i);
        if (match) borderColor = match[1];
      } else if (cmd.startsWith('!bw')) {
        const match = token.match(/!bw(?:\(([^)]+)\)|(-?\d+(?:\.\d+)?))/i);
        if (match) {
          const val = parseFloat(match[1] || match[2]);
          if (!isNaN(val)) borderWidth = val;
        }
      } else if (cmd === '!reset') {
        resetTransforms();
      }
      continue;
    }

    const { text, font } = processToken(token);
    if (!text) continue;

    highCtx.save();
    
    // Scale -> Flip -> Rotate -> Translate
    const pxOffsetScale = (highResCanvas.width / 140);
    highCtx.translate(centerX + (dx * pxOffsetScale), centerY + (dy * pxOffsetScale));
    highCtx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    if (rotation !== 0) highCtx.rotate((rotation * Math.PI) / 180);
    highCtx.scale(scale, scale);

    const baseFontSize = 140 * scaleFactor;
    
    // Explicit font assignment per token type
    const fontFamily = font === 'CatrinityFlags' ? 'CatrinityFlags' : 'Catrinity';
    highCtx.font = `${baseFontSize}px "${fontFamily}"`;
    highCtx.textAlign = 'center';
    highCtx.textBaseline = 'middle';

    if (borderColor && borderWidth > 0) {
      highCtx.strokeStyle = borderColor;
      highCtx.lineWidth = borderWidth * scaleFactor;
      highCtx.strokeText(text, 0, 0);
    }

    highCtx.fillStyle = color || '#000000';
    highCtx.fillText(text, 0, 0);

    highCtx.restore();
    resetTransforms();
  }

  // Downsample using Nearest Neighbor
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = targetWidth;
  exportCanvas.height = targetHeight;
  const exportCtx = exportCanvas.getContext('2d');

  exportCtx.imageSmoothingEnabled = false;
  exportCtx.drawImage(
    highResCanvas,
    0, 0, highResCanvas.width, highResCanvas.height,
    0, 0, targetWidth, targetHeight
  );

  // Alpha Channel Binarization
  const imgData = exportCtx.getImageData(0, 0, targetWidth, targetHeight);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i + 3] = data[i + 3] >= 128 ? 255 : 0;
  }
  exportCtx.putImageData(imgData, 0, 0);

  return exportCanvas;
}

document.getElementById('downloadBtn').addEventListener('click', () => {
  try {
    const canvas = captureCrispCanvas(280, 280);
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'flag-crisp.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (err) {
    console.error('Download error:', err);
    alert(err.message || 'Export failed.');
  }
});

document.getElementById('copyImgBtn').addEventListener('click', () => {
  if (!navigator.clipboard || !window.ClipboardItem) {
    alert('Clipboard API not supported in this browser environment.');
    return;
  }

  const canvas = captureCrispCanvas(280, 280);
  if (!canvas) return;

  canvas.toBlob((blob) => {
    if (!blob) {
      alert('Failed to generate image blob');
      return;
    }
    const item = new ClipboardItem({ 'image/png': blob });
    navigator.clipboard.write([item])
      .then(() => alert('Crisp flag image copied to clipboard!'))
      .catch((err) => {
        console.error('Clipboard copy error:', err);
        alert('Clipboard copy failed. Use Download PNG instead.');
      });
  }, 'image/png');
});

const inputEl = document.getElementById('code');
inputEl.addEventListener('input', updateFlag);