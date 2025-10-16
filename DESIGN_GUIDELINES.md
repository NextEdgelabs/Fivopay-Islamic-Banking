# Stripe Design Guidelines for FivoPay Banking

This document outlines the design principles and guidelines inspired by Stripe's design system, adapted for the FivoPay Banking application.

## 🎨 Core Design Principles

### 1. **Clarity First**
- Use clear, concise language
- Prioritize readability and scannability
- Avoid jargon and complex terms
- Provide context and helpful hints

### 2. **Consistency**
- Maintain consistent spacing, colors, and typography
- Reuse components and patterns
- Follow established interaction patterns
- Keep navigation predictable

### 3. **Efficiency**
- Minimize clicks and cognitive load
- Provide shortcuts and quick actions
- Use smart defaults
- Enable bulk operations where applicable

### 4. **Trust & Security**
- Display security indicators clearly
- Use subtle animations for state changes
- Provide clear feedback for actions
- Show loading states and progress

## 🎭 Color System

### Primary Colors
```
Primary Blue: #635BFF
Dark Blue: #0A2540
Success Green: #00D924
Warning Orange: #FFA500
Error Red: #DF1B41
```

### Neutral Colors
```
Neutral 50: #F6F9FC (Backgrounds)
Neutral 100: #E3E8EF (Borders, dividers)
Neutral 400: #697386 (Secondary text)
Neutral 800: #0A2540 (Primary text)
```

### Usage Guidelines
- **Primary:** Main actions, links, active states
- **Success:** Positive actions, confirmations, success states
- **Warning:** Cautions, attention needed
- **Error:** Errors, destructive actions, alerts
- **Neutral:** Text, borders, backgrounds

## 📝 Typography

### Font Family
- **Primary:** Inter (Google Fonts)
- **Monospace:** Roboto Mono (for code, numbers)

### Font Sizes
```
xs: 12px (0.75rem)   - Captions, labels
sm: 14px (0.875rem)  - Body text, secondary
base: 16px (1rem)    - Primary body text
lg: 18px (1.125rem)  - Subheadings
xl: 20px (1.25rem)   - Card titles
2xl: 24px (1.5rem)   - Section headings
3xl: 30px (1.875rem) - Page titles
4xl: 36px (2.25rem)  - Hero text
```

### Font Weights
- **300:** Light (rarely used)
- **400:** Regular (body text)
- **500:** Medium (emphasis)
- **600:** Semibold (headings)
- **700:** Bold (strong emphasis)
- **800:** Extra bold (hero text)

## 📐 Spacing System

Use consistent spacing based on 4px base unit:

```
1 = 4px
2 = 8px
3 = 12px
4 = 16px
6 = 24px
8 = 32px
12 = 48px
16 = 64px
```

### Common Patterns
- **Component padding:** 16px (p-4)
- **Section spacing:** 24px - 48px (space-y-6 to space-y-12)
- **Form fields:** 16px vertical spacing
- **Card padding:** 24px (p-6)

## 🎯 Component Guidelines

### Buttons
1. **Primary Button**
   - Background: Primary blue (#635BFF)
   - Text: White
   - Use for main actions
   - Include hover state (darker shade)

2. **Secondary Button**
   - Background: White
   - Border: Primary blue
   - Text: Primary blue
   - Use for secondary actions

3. **Danger Button**
   - Background: Error red (#DF1B41)
   - Text: White
   - Use for destructive actions
   - Always confirm before execution

4. **Ghost Button**
   - Background: Transparent
   - Text: Neutral 600
   - Hover: Light background
   - Use for tertiary actions

### Input Fields
- Height: 40px minimum
- Border: 1px solid Neutral 200
- Border radius: 6px (rounded-stripe)
- Focus: 2px ring in primary color
- Error state: Red border + error message
- Disabled: Gray background + cursor-not-allowed

### Cards
- Background: White
- Border: 1px solid Neutral 100
- Border radius: 6px (rounded-stripe)
- Shadow: Subtle (shadow-sm)
- Hover: Slightly larger shadow (shadow-md)
- Padding: 24px (p-6)

### Tables
- Header: Neutral 50 background
- Rows: Alternating white and neutral 50
- Borders: Neutral 100
- Hover: Subtle highlight
- Actions: Right-aligned

## 🎬 Animations & Transitions

### Duration
- **Fast:** 150ms (hover states, toggles)
- **Normal:** 200-300ms (modals, drawers)
- **Slow:** 400-500ms (page transitions)

### Easing
- **Default:** ease-in-out
- **Enter:** ease-out
- **Exit:** ease-in

### Common Animations
```css
Fade in: opacity 0 → 1 (200ms)
Slide in: translateX(-100%) → 0 (300ms)
Slide up: translateY(10px) → 0 (300ms)
Scale: scale(0.95) → 1 (200ms)
```

## 📱 Responsive Design

### Breakpoints
```
sm: 640px   - Mobile landscape
md: 768px   - Tablet
lg: 1024px  - Desktop
xl: 1280px  - Large desktop
2xl: 1536px - Extra large
```

### Mobile-First Approach
1. Design for mobile first
2. Progressively enhance for larger screens
3. Stack elements vertically on mobile
4. Use hamburger menu for navigation
5. Ensure touch targets are 44px minimum

## ♿ Accessibility

### Requirements
1. **Color Contrast:** Minimum 4.5:1 for text
2. **Focus Indicators:** Visible 2px ring
3. **Keyboard Navigation:** All interactive elements
4. **ARIA Labels:** For screen readers
5. **Alt Text:** For all images
6. **Form Labels:** Always associate with inputs

### Best Practices
- Use semantic HTML
- Provide skip links
- Announce dynamic content changes
- Support screen reader navigation
- Test with keyboard only

## 🎪 Interactive States

### Button States
```
Default: Normal appearance
Hover: Slightly darker, cursor pointer
Active: Even darker, slight scale down
Focus: 2px ring around button
Disabled: 50% opacity, cursor not-allowed
Loading: Show spinner, disable interaction
```

### Input States
```
Default: Normal border
Focus: Primary color ring
Error: Red border + error message
Success: Green border (optional)
Disabled: Gray background
```

## 📊 Data Visualization

### Charts
- Use consistent color palette
- Provide legends and labels
- Ensure charts are responsive
- Use tooltips for details
- Support dark mode if applicable

### Numbers & Stats
- Format large numbers (1,234,567)
- Use appropriate decimal places
- Show currency symbols
- Indicate trends with icons/colors
- Provide comparison data

## 🔔 Feedback & Notifications

### Toast Notifications
- Position: Top-right corner
- Duration: 3-5 seconds
- Include icon and message
- Dismissible
- Stack multiple toasts

### Alerts
- Inline: Within context
- Banner: Top of page
- Modal: For critical actions
- Use appropriate color (success, warning, error, info)

### Loading States
- Show skeleton loaders for content
- Use spinners for actions
- Provide progress bars for uploads
- Never leave user without feedback

## 📝 Form Design

### Best Practices
1. Group related fields
2. Use clear labels above inputs
3. Provide helpful placeholder text
4. Show validation inline
5. Use appropriate input types
6. Include helpful hints
7. Mark required fields
8. Show character limits

### Validation
- Real-time validation (after blur)
- Clear error messages
- Show what's wrong and how to fix
- Don't validate while typing (except passwords)
- Success indicators when appropriate

## 🎨 Iconography

### Icon Usage
- Size: 16px, 20px, 24px (most common)
- Style: Outline (consistent with Stripe)
- Color: Inherit from text or use theme colors
- Always provide accessible labels
- Use icons to support text, not replace it

### Common Icons
- Check: Success, completion
- X: Close, error, delete
- Arrow: Navigation, direction
- Plus: Add, create
- Pencil: Edit
- Trash: Delete
- Eye: View, show
- Settings: Configuration

## 📦 Component Library Structure

All components should:
1. Accept className prop for customization
2. Support all relevant HTML attributes
3. Be fully typed with TypeScript
4. Include loading and error states
5. Be keyboard accessible
6. Work in light mode (dark mode optional)
7. Be documented with examples

---

**Remember:** These guidelines are inspired by Stripe but adapted for FivoPay Banking. Always prioritize user experience and accessibility over aesthetics.
