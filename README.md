# 🚩 Flag-Laboratory

An interactive, browser-based flag font parsing and layering engine powered by OpenType font stacks, custom transform commands, and high-resolution PNG export capabilities.

---

## 🚀 Features

- **Dual-Font System:**
  - **`CatrinityFlags.otf`**: Renders ISO 3166-1 country flags, ISO 3166-2 tag sequences, and Private Use Area (PUA) flag blocks (`#FDE00`–`#FDEFF`).
  - **`Catrinity.otf`**: Renders all standard text, Unicode symbols, and non-flag characters.
- **Layering System (`!layer` / `!stack`):** Stack multiple glyphs or base flags on top of each other in a single display node.
- **Transform Commands:** Inline rotation, horizontal/vertical flipping, scaling, and $X$/$Y$ pixel offsets.
- **Color Customization:** Apply hex codes or CSS color keywords directly to individual layers.
- **High-Res Export & Copying:** Built-in `html2canvas` integration for downloading crisp PNGs and copying flag designs directly to the clipboard.

---

## 📖 Syntax & Parser Rules

### 1. Flag & Character Inputs

| Input Format | Description | Example |
| :--- | :--- | :--- |
| **Uppercase 2-Letter** | ISO 3166-1 Country Flags (Regional Indicators) | `US`, `YU`, `JP` |
| **Lowercase String** | ISO 3166-2 Subdivision Tag Sequences | `gbeng`, `usca` |
| **Hex / PUA Code** | Unicode Codepoint or PUA Flag Range (`#FDE00`–`#FDEFF`) | `#FDE00`, `1F3F4` |
| **Standard Text** | Rendered automatically using regular `Catrinity.otf` | `A`, `123`, `★` |

### 2. Transform Commands

Use exclamation mark (`!`) commands inline to transform the subsequent character or layer.

| Command | Action |
| :--- | :--- |
| `!layer` / `!stack` | Stacks the next token on top of the previous flag/character |
| `!r90` / `!r180` / `!r270` | Rotates the element clockwise by 90°, 180°, or 270° |
| `!fh` / `!fv` | Flips the element horizontally (`!fh`) or vertically (`!fv`) |
| `!s25` / `!s50` / `!s150` | Scales the layer relative to full size (`!s50` = 50% scale) |
| `!dx10` / `!dx-15` | Horizontal offset in pixels |
| `!dy20` / `!dy-5` | Vertical offset in pixels |
| `!c(#ff0000)` / `!color(gold)` | Applies custom color to the layer |
| `!reset` | Clears all active transforms and resets the layer stack |

---

## 💡 Example Compositions

```text
YU !layer !s50 CS
