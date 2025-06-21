# 🎨 `theme.md` — NeoFin Admin Theme

A comprehensive theme guide inspired by the **DoLab Admin Dashboard** with support for **both Light and Dark modes**. This theme suits financial, analytics, SaaS, and admin platforms.

---

## 🌟 Theme Overview

* **Design Type**: Dual Mode (Light & Dark)
* **Use Case**: Finance, Banking, CRM, Analytics, SaaS
* **Style**: Futuristic, Modular, Clean, Neon Accents
* **Modes Supported**: `Light` and `Dark`

---

## 🌈 Color Palette

### 🌙 Dark Mode

| Name               | Hex                                                 | Usage                                  |
| ------------------ | --------------------------------------------------- | -------------------------------------- |
| Background Dark    | `#0A0F2C`                                           | Main background                        |
| Card Background    | `#141D46`                                           | Card containers                        |
| Sidebar Gradient   | `linear-gradient(180deg, #1E1B45 0%, #2E1B69 100%)` | Sidebar background                     |
| Border             | `#2F3C7E`                                           | Dividers, outlines                     |
| Scrollbar BG       | `#1F2756`                                           | Scroll track                           |
| Accent Blue        | `#5D6DFF`                                           | Primary action, active state           |
| Accent Purple      | `#E14EFF`                                           | Chart lines, buttons, glowing elements |
| Accent Yellow      | `#F2C94C`                                           | Pie chart, warnings                    |
| Accent Green       | `#00D09C`                                           | Success states                         |
| Accent Red         | `#FF3B3B`                                           | Errors, danger                         |
| Primary Text       | `#FFFFFF`                                           | Headings and Labels                    |
| Secondary Text     | `#A1B3D1`                                           | Paragraph, labels                      |
| Disabled Text      | `#6B7B99`                                           | Muted and placeholders                 |
| Widget Border Glow | `#865DFF` (blur-glow)                               | Around cards/widgets                   |

### ☀️ Light Mode

| Name             | Hex       | Usage                        |
| ---------------- | --------- | ---------------------------- |
| Background Light | `#F4F6FA` | Page background              |
| Card Background  | `#FFFFFF` | Card containers              |
| Border           | `#E0E6F1` | Dividers, outlines           |
| Sidebar BG       | `#EDF2F7` | Sidebar navigation           |
| Scrollbar BG     | `#D6E0EF` | Scroll track                 |
| Accent Blue      | `#375DFB` | Primary action, active state |
| Accent Purple    | `#9C27B0` | Chart lines, tags            |
| Accent Yellow    | `#F9A826` | Highlights, alerts           |
| Accent Green     | `#00B894` | Success states               |
| Accent Red       | `#E53935` | Errors, decrease indicators  |
| Primary Text     | `#0A0F2C` | Headings and Labels          |
| Secondary Text   | `#4B5563` | Paragraph, labels            |
| Disabled Text    | `#A0AEC0` | Muted and placeholders       |

---

## 🖋 Typography

* **Font Family**: `Poppins`, sans-serif
* **Weights**: 300 (Light), 400 (Regular), 600 (Semi-bold), 700 (Bold)

| Element        | Size       |
| -------------- | ---------- |
| Page Title     | `2rem`     |
| Section Header | `1.5rem`   |
| Card Title     | `1.25rem`  |
| Body Text      | `1rem`     |
| Caption        | `0.875rem` |

---

## 🧩 Component Styling

### Buttons

* Border-radius: `8px`
* Padding: `10px 20px`
* Primary: Accent Blue background
* Hover: Slight brightness/glow (dark mode) or border shadow (light mode)
* Icon buttons: Circle, minimal shadow

### Cards

* Radius: `16px`
* Padding: `20px`
* Shadow:

  * Dark: neon-glow style (soft blue/purple outer spread)
  * Light: subtle box-shadow
* Background: Follows mode

### Charts

* Curved lines with glowing strokes
* Consistent color coding for data lines (Income: Blue, Expense: Purple)
* Bar Charts: vibrant solid fills with hover animation
* Tooltips:

  * Dark: Frosted glass effect with neon border
  * Light: Soft shadow with subtle border

### Sidebar Navigation

* Background Gradient (dark mode)
* Active item: Glow ring or bold bar (dark) / colored border (light)
* Hover: Scale effect and semi-glow background
* Icons: Lucide/Heroicons filled version with tint based on section

---

## 🧱 Layout & Spacing

| Property       | Value     |
| -------------- | --------- |
| Grid           | 12-column |
| Page Padding   | `24px`    |
| Card Gap       | `24px`    |
| Section Margin | `32px`    |
| Sidebar Width  | `260px`   |
| Card Radius    | `16px`    |

---

## 🔮 Background & Animation Details

### Background

* **Dark Mode**:

  * Gradient base: `linear-gradient(145deg, #0A0F2C, #141D46)`
  * Overlay: Animated polygonal mesh (light purple lines, nodes)
  * Secondary glow layer with subtle particle motion

* **Light Mode**:

  * Soft gradient or light blue shade base
  * Subtle animated curves or blob SVG as background overlays

### Animations

* **Sidebar Icons**: Pulse glow on active
* **Graphs**: Line drawing animation on load
* **Widgets**: Hover bounce or scale up with shadow
* **Loader / Transitions**: Fade-in slide from bottom
* **Interaction Feedback**: Button click ripple, input focus glow

---

## 🔍 UI Patterns

* **Search**: Top-right bar, neon-blue glow border (dark), soft outline (light)
* **Notifications**: Bell icon pulse with count badge
* **User Panel**: Avatar dropdown with card-style menu
* **Tooltips**:

  * Dark: blur-glow with shadow
  * Light: card shadow, rounded corners
