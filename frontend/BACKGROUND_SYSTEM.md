# CauseHive Background System

## Overview
The CauseHive application uses a consistent background image system throughout the entire application to maintain visual coherence and brand identity.

## Background Image
- **Location**: `src/assets/app-background.png`
- **Source**: Originally from `media/background/Screenshot 2025-09-19 140604.png`
- **Usage**: Applied across all pages and components

## CSS Classes

### Main Background Classes
- `.app-background` - Primary background with fixed attachment
- `.app-background-overlay` - Semi-transparent white overlay for readability
- `.app-background-overlay-gradient` - Gradient overlay variant
- `.app-background-light` - Lighter background variant
- `.app-background-light-overlay` - Light overlay for subtle effect

### Content Classes
- `.content-container` - Semi-transparent container for content cards
- `.card-with-background` - Cards with background blur effect
- `.modal-background-blur` - Blurred background for modals

## Implementation

### 1. AppLayout (Automatic)
The main `AppLayout` component automatically applies the background to all pages that use it:

```jsx
// Already implemented in AppLayout.jsx
<div className="app-background">
  <div className="app-background-overlay">
    {/* App content */}
  </div>
</div>
```

### 2. Auth Pages (Login/Signup)
Auth pages have been updated to use the background system:

```jsx
// LoginPage.jsx and SignupPage.jsx
<div className="app-background">
  <div className="app-background-overlay min-h-screen flex">
    {/* Auth form with content-container class */}
    <div className="content-container p-8">
      {/* Form content */}
    </div>
  </div>
</div>
```

### 3. BackgroundWrapper Component
For pages needing custom background implementation:

```jsx
import { BackgroundWrapper, ContentCard } from '../components/ui/BackgroundWrapper';

// Basic usage
<BackgroundWrapper>
  <div>Your content</div>
</BackgroundWrapper>

// With variants
<BackgroundWrapper variant="light" fullHeight={false}>
  <ContentCard>
    <h1>Card Content</h1>
  </ContentCard>
</BackgroundWrapper>

// Without overlay
<BackgroundWrapper withOverlay={false}>
  <div>Direct background content</div>
</BackgroundWrapper>
```

## Variants

### Default Variant (`variant="default"`)
- Uses `app-background` and `app-background-overlay`
- Best for most pages
- 92% white overlay for good readability

### Light Variant (`variant="light"`)
- Uses `app-background-light` and `app-background-light-overlay`
- 85% white overlay for more background visibility
- Good for landing pages or showcase content

### Gradient Variant (`variant="gradient"`)
- Uses gradient overlay instead of solid
- Creates depth and visual interest
- Good for hero sections

## Responsive Behavior

### Mobile Considerations
- Background attachment changes from `fixed` to `scroll` on mobile
- Ensures proper scrolling behavior on touch devices
- Maintains visual consistency across screen sizes

### Performance
- Background image is optimized and cached
- CSS uses efficient backdrop-filter for blur effects
- Minimal impact on application performance

## Customization

### Changing Background Image
1. Replace `src/assets/app-background.png` with your new image
2. Update CSS if needed for different aspect ratios
3. Test across different screen sizes

### Adjusting Overlay Opacity
Edit the background values in `src/styles/background.css`:

```css
.app-background-overlay {
  background: rgba(255, 255, 255, 0.92); /* Adjust alpha value */
}
```

### Adding New Variants
1. Add new CSS classes in `background.css`
2. Update `BackgroundWrapper` component with new variant
3. Document the new variant usage

## Best Practices

1. **Always use overlay** for text readability
2. **Use ContentCard** for important content that needs to stand out
3. **Test contrast** to ensure accessibility compliance
4. **Consider performance** when adding multiple background layers
5. **Maintain consistency** across all pages

## Files Modified

### CSS Files
- `src/index.css` - Added background.css import
- `src/styles/background.css` - Background system styles

### Components
- `src/components/layout/AppLayout.jsx` - Main app background
- `src/components/ui/BackgroundWrapper.jsx` - Utility component

### Pages
- `src/pages/auth/LoginPage.jsx` - Auth background implementation
- `src/pages/auth/SignupPage.jsx` - Auth background implementation

## Accessibility

- Maintains proper contrast ratios
- Readable text with overlay system
- Works with screen readers
- Follows WCAG guidelines

## Browser Support

- Modern browsers with backdrop-filter support
- Graceful degradation for older browsers
- Tested on Chrome, Firefox, Safari, Edge