# Design System: Save Up

## Color Palette

The app uses a clean, modern color scheme designed for clarity and trust in financial decision-making.

### Primary Colors

#### Background / Light
- **Hex**: `#fdfffc`
- **RGB**: `rgb(253, 255, 252)`
- **Use**: Primary background, cards, light surfaces
- **Description**: Off-white with a subtle cool tint for reduced eye strain

#### Dark / Text Primary
- **Hex**: `#011627`
- **RGB**: `rgb(1, 22, 39)`
- **Use**: Primary text, headers, dark backgrounds
- **Description**: Deep navy blue providing excellent contrast and readability

#### Accent / Primary Action
- **Hex**: `#2ec4b6`
- **RGB**: `rgb(46, 196, 182)`
- **Use**: Primary buttons, active states, positive actions, links
- **Description**: Vibrant teal/cyan for call-to-action elements

#### Alert / Destructive
- **Hex**: `#e71d36`
- **RGB**: `rgb(231, 29, 54)`
- **Use**: Error messages, destructive actions, important warnings
- **Description**: Bold red for attention-grabbing alerts

## Color Usage Guidelines

### Text Colors
```typescript
// Primary text on light backgrounds
textPrimary: '#011627'

// Light text on dark backgrounds
textLight: '#fdfffc'

// Muted/secondary text
textSecondary: '#011627' with 60% opacity
```

### Button Colors
```typescript
// Primary action button (Buy, Calculate, Save)
primaryButton: {
  background: '#2ec4b6',
  text: '#fdfffc'
}

// Destructive action button (Don't Buy, Delete)
destructiveButton: {
  background: '#e71d36',
  text: '#fdfffc'
}

// Secondary/outline button (Let Me Think, Cancel)
secondaryButton: {
  background: 'transparent',
  border: '#011627',
  text: '#011627'
}
```

### Background Colors
```typescript
// Main app background
background: '#fdfffc'

// Card/elevated surface
surface: '#ffffff' or '#fdfffc'

// Dark mode header/footer (if implemented)
darkSurface: '#011627'
```

### State Colors
```typescript
// Active tab, selected items
active: '#2ec4b6'

// Inactive tab, disabled items
inactive: '#011627' with 40% opacity

// Error states, validation
error: '#e71d36'

// Success states (future)
success: '#2ec4b6' (reuse accent)
```

## Typography (To Be Defined)

### Font Families
- **System Font**: Use default system fonts for optimal performance
  - iOS: San Francisco
  - Android: Roboto
  - Web: System UI fonts

### Font Sizes (Planned)
```typescript
// Headings
heading1: 32,
heading2: 28,
heading3: 24,

// Body
bodyLarge: 18,
body: 16,
bodySmall: 14,

// Labels
caption: 12,
label: 14,
```

### Font Weights
```typescript
regular: '400',
medium: '500',
semibold: '600',
bold: '700',
```

## Spacing System (Planned)

```typescript
spacing: {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
}
```

## Border Radius (Planned)

```typescript
borderRadius: {
  small: 4,
  medium: 8,
  large: 16,
  round: 999, // For circular elements
}
```

## Shadow/Elevation (Planned)

```typescript
shadow: {
  small: {
    shadowColor: '#011627',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Android
  },
  medium: {
    shadowColor: '#011627',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
}
```

## Implementation

### Theme Constants File
Create `src/constants/theme.ts` with all design tokens:

```typescript
export const colors = {
  background: '#fdfffc',
  dark: '#011627',
  accent: '#2ec4b6',
  alert: '#e71d36',
  
  // Text colors
  textPrimary: '#011627',
  textLight: '#fdfffc',
  textSecondary: 'rgba(1, 22, 39, 0.6)',
  
  // Button colors
  primaryButton: '#2ec4b6',
  alertButton: '#e71d36',
  
  // State colors
  active: '#2ec4b6',
  inactive: 'rgba(1, 22, 39, 0.4)',
  error: '#e71d36',
};
```

## Accessibility Considerations

### Contrast Ratios
- `#011627` on `#fdfffc`: **15.8:1** ✅ (AAA - Excellent)
- `#2ec4b6` on `#fdfffc`: **2.8:1** ⚠️ (Use for accents only, not body text)
- `#e71d36` on `#fdfffc`: **5.1:1** ✅ (AA - Good for UI elements)
- `#fdfffc` on `#011627`: **15.8:1** ✅ (AAA - Excellent)
- `#fdfffc` on `#2ec4b6`: **2.8:1** ⚠️ (Acceptable for buttons/large text)
- `#fdfffc` on `#e71d36`: **5.1:1** ✅ (AA - Good)

### Recommendations
- Use `#011627` (dark navy) for all body text on light backgrounds
- Use `#fdfffc` (off-white) for text on dark backgrounds
- `#2ec4b6` (teal) and `#e71d36` (red) are best for buttons and accent elements
- Ensure minimum touch target size of 44x44 points for buttons

## Color Psychology

- **Off-White (#fdfffc)**: Clean, minimal, trustworthy - perfect for financial apps
- **Navy Blue (#011627)**: Professional, reliable, stable - builds confidence
- **Teal (#2ec4b6)**: Calm, balanced, positive - encourages thoughtful decisions
- **Red (#e71d36)**: Urgent, important, attention - used sparingly for impact

## Future Enhancements

- [ ] Dark mode color variations
- [ ] Color blind accessibility modes
- [ ] Semantic color naming system
- [ ] Animation/transition specifications
- [ ] Icon library and style guide
