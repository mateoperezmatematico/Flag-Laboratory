// Dynamic load for html2canvas to bypass export blocks and font rendering issues
if (!window.html2canvas) {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
  document.head.appendChild(script);
}

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
      max-width: 850px;
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
      font-family: 'Catrinity', system-ui, sans-serif;
      font-variant-emoji: text;
    }
    .hint {
      font-size: 13px;
      color: #666;
      margin-bottom: 12px;
      line-height: 1.5;
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
    <div class="hint">
      • <b>Flags Range:</b> ISO 3166-1 (<code>RU</code>), Tag Sequences (<code>gbeng</code>), PUA (<code>#FDE00</code>-<code>#FDEFF</code>)<br>
      • <b>Standard Text / Non-Flags:</b> Uses hex codepoints (e.g. <code>#2605</code>) rendered with regular <b>Catrinity</b> font<br>
      • <b>Modifiers (Pre-token):</b> <code>!fv</code>, <code>!s30</code>, <code>!dx10</code>, <code>!dy-5</code>, <code>!c(#FFD700)</code>, <code>!bc(#000)</code>, <code>!bw(2)</code>
    </div>
    <input type="text" id="code" placeholder="e.g., #FDE00 !layer !s95 !c(#002B7F) #2B24 !layer !s30 !c(#FFD700) !bc(#000000) !bw(2) #2605" value="#FDE00 !layer !s95 !c(#002B7F) #2B24 !layer !s30 !c(#FFD700) !bc(#000000) !bw(2) #2605" autofocus>
    <div class="flag-display" id="output"></div>
    <div class="button-group">
      <button id="downloadBtn">Download PNG</button>
      <button id="copyImgBtn">Copy Image to Clipboard</button>
    </div>
  </div>
`;

function processToken(token) {
  if (!token) return { text: '', isFlag: false };

  // 1. ISO 3166-2 Subdivision Tag Sequences (gbeng, usca) -> CatrinityFlags
  if (/^[a-z0-9]+$/.test(token)) {
    let sequence = '\u{1F3F4}';
    for (const char of token) {
      sequence += String.fromCodePoint(0xE0000 + char.charCodeAt(0));
    }
    sequence += '\u{E007F}';
    return { text: sequence, isFlag: true };
  }

  // 2. ISO 3166-1 Country Flags (RU, US) -> CatrinityFlags
  if (token.length === 2 && /^[A-Z]{2}$/.test(token)) {
    const base = 0x1F1E6;
    const char1 = token.charCodeAt(0) - 65 + base;
    const char2 = token.charCodeAt(1) - 65 + base;
    return { text: String.fromCodePoint(char1, char2), isFlag: true };
  }

  const hexClean = token.startsWith('#') ? token.slice(1) : token;

  // 3. Hex Codepoints (PUA vs Standard Text)
  if (/^[0-9A-F]{4,6}$/i.test(hexClean)) {
    const codePoint = parseInt(hexClean, 16);

    // Dynamic PUA & Flag Ranges: FDE00–FDEFF, 1F1E6–1F1FF, 1F3F4
    const isFlagRange = (codePoint >= 0xFDE00 && codePoint <= 0xFDEFF) ||
                        (codePoint >= 0x1F1E6 && codePoint <= 0x1F1FF) ||
                        codePoint === 0x1F3F4;

    // \uFE0E is ONLY appended to non-flag codepoints
    const textChar = isFlagRange 
      ? String.fromCodePoint(codePoint) 
      : String.fromCodePoint(codePoint) + '\uFE0E';

    return { text: textChar, isFlag: isFlagRange };
  }

  // 4. Fallback: Plain text
  return { text: token, isFlag: false };
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
        const val = parseFloat(cmd.slice(3));
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

    const { text, isFlag } = processToken(token);
    if (!text) continue;

    if (!isLayering || !currentWrapper) {
      currentWrapper = document.createElement('span');
      currentWrapper.className = 'flag-wrapper';
      outputEl.appendChild(currentWrapper);
    }

    const span = document.createElement('span');
    span.className = `flag-node ${isFlag ? 'font-flag' : 'font-text'}`;
    span.textContent = text;

    // Scale -> Flip -> Rotate -> Translate
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

async function captureDisplayCanvas() {
  const outputEl = document.getElementById('output');
  if (window.html2canvas) {
    return await html2canvas(outputEl, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      logging: false
    });
  }
  throw new Error('Capture library is loading. Please try again.');
}

document.getElementById('downloadBtn').addEventListener('click', async () => {
  try {
    const canvas = await captureDisplayCanvas();
    const link = document.createElement('a');
    link.download = 'flag-composition.png';
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

  const item = new ClipboardItem({
    'image/png': (async () => {
      const canvas = await captureDisplayCanvas();
      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create image blob'));
        }, 'image/png');
      });
    })()
  });

  navigator.clipboard.write([item])
    .then(() => alert('Flag image copied to clipboard!'))
    .catch((err) => {
      console.error('Clipboard copy error:', err);
      alert('Clipboard copy failed. Try using Download PNG instead.');
    });
});

const inputEl = document.getElementById('code');
inputEl.addEventListener('input', updateFlag);
updateFlag();