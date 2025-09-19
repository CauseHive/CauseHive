# CauseHive Frontend Component Library

## Overview

This document provides comprehensive documentation for the CauseHive frontend component library, refactored with enterprise-grade patterns using shadcn/ui components and modern React practices.

## Architecture

### Design System
- **shadcn/ui Integration**: Radix UI primitives with class-variance-authority
- **CauseHive Brand Theme**: Custom color palette and design tokens
- **CSS Variables**: Consistent theming across all components
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Component Structure
```
src/components/
├── ui/                     # Core shadcn/ui components
│   ├── button.jsx         # Button with CauseHive variants
│   ├── input.jsx          # Form input components
│   ├── card.jsx           # Card layout components
│   ├── skeleton.jsx       # Loading skeletons
│   ├── toast.jsx          # Toast notifications
│   ├── label.jsx          # Form labels
│   ├── pagination.jsx     # Pagination controls
│   ├── use-toast.js       # Toast hook
│   └── index.js           # Barrel exports
├── common/                 # Complex business components
│   ├── CauseCard.jsx      # Cause display card
│   ├── CausesList.jsx     # Advanced list with search/filter
│   ├── VirtualizedTable.jsx # Performance-optimized tables
│   ├── SEO.jsx            # SEO meta management
│   ├── AccessibilityUtils.jsx # A11y components
│   ├── InteractiveComponents.jsx # Animations & feedback
│   ├── PerformanceUtils.jsx # Lazy loading utilities
│   └── index.js           # Barrel exports
└── routing/
    └── AppRoutes.jsx      # Optimized route configuration
```

---

## Core UI Components

### Button Component
**File**: `src/components/ui/button.jsx`

Versatile button component with CauseHive-specific variants and states.

#### Variants
- `default`: Primary CauseHive blue
- `destructive`: Error/danger states
- `outline`: Border-only variant
- `secondary`: Muted background
- `ghost`: No background
- `link`: Text-only link style
- `donate`: Special green variant for donations
- `request`: Orange variant for requests
- `warning`: Warning state

#### Usage
```jsx
import { Button } from '../components/ui';

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="donate">Donate Now</Button>
<Button variant="request" size="lg">Request Support</Button>

// With states
<Button disabled>Disabled</Button>
<Button loading>Processing...</Button>
```

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | string | 'default' | Button variant style |
| size | string | 'default' | Size: sm, default, lg, icon |
| asChild | boolean | false | Render as child component |
| disabled | boolean | false | Disable button |
| loading | boolean | false | Show loading state |

---

### Input Component
**File**: `src/components/ui/input.jsx`

Form input component with proper accessibility and validation support.

#### Features
- Built-in validation states
- Accessibility attributes
- Consistent styling
- Focus management

#### Usage
```jsx
import { Input } from '../components/ui';

<Input 
  type="email" 
  placeholder="Enter your email"
  required
  aria-describedby="email-error"
/>
```

---

### Card Component
**File**: `src/components/ui/card.jsx`

Flexible card container with header, content, and footer sections.

#### Subcomponents
- `Card`: Main container
- `CardHeader`: Header section
- `CardTitle`: Title text
- `CardDescription`: Subtitle/description
- `CardContent`: Main content area
- `CardFooter`: Footer section

#### Usage
```jsx
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui';

<Card>
  <CardHeader>
    <CardTitle>Campaign Title</CardTitle>
  </CardHeader>
  <CardContent>
    Campaign description and details
  </CardContent>
</Card>
```

---

## Business Components

### CauseCard Component
**File**: `src/components/common/CauseCard.jsx`

Enterprise-grade component for displaying cause information with progress tracking.

#### Features
- Progress bar with animations
- Donation tracking
- Status badges
- Category labels
- Responsive design
- Hover effects

#### Usage
```jsx
import { CauseCard } from '../components/common';

<CauseCard
  cause={{
    id: 1,
    title: "Support Local Education",
    description: "Help provide books and supplies...",
    target_amount: 10000,
    current_amount: 7500,
    category: "education",
    status: "active",
    image: "/images/cause1.jpg",
    creator: { name: "Jane Doe" },
    end_date: "2024-12-31"
  }}
  onDonate={(cause) => handleDonate(cause)}
  onShare={(cause) => handleShare(cause)}
/>
```

#### Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| cause | object | Yes | Cause data object |
| onDonate | function | No | Donation handler |
| onShare | function | No | Share handler |
| className | string | No | Additional CSS classes |

---

### CausesList Component
**File**: `src/components/common/CausesList.jsx`

Advanced list component with search, filtering, and pagination capabilities.

#### Features
- Real-time search with debouncing
- Category filtering
- Sort options (newest, popular, ending soon)
- Server-side pagination
- Loading states
- Error handling
- Empty states

#### Usage
```jsx
import { CausesList } from '../components/common';

<CausesList
  apiEndpoint="/api/causes"
  pageSize={12}
  enableSearch={true}
  enableFilters={true}
  onCauseClick={(cause) => navigate(`/causes/${cause.id}`)}
/>
```

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| apiEndpoint | string | Required | API endpoint for causes |
| pageSize | number | 12 | Items per page |
| enableSearch | boolean | true | Enable search functionality |
| enableFilters | boolean | true | Enable category filters |
| onCauseClick | function | - | Click handler for causes |

---

### VirtualizedTable Component
**File**: `src/components/common/VirtualizedTable.jsx`

Performance-optimized table for large datasets using @tanstack/react-virtual.

#### Features
- Virtual scrolling for thousands of rows
- Configurable columns
- Sorting capabilities
- Loading states
- Empty states
- Responsive design

#### Usage
```jsx
import { VirtualizedTable } from '../components/common';

const columns = [
  { key: 'name', label: 'Name', width: '200px' },
  { key: 'amount', label: 'Amount', width: '100px' },
  { key: 'date', label: 'Date', width: '150px' }
];

<VirtualizedTable
  data={donations}
  columns={columns}
  height="400px"
  rowHeight={60}
  isLoading={loading}
  onRowClick={(row) => handleRowClick(row)}
/>
```

---

## Accessibility Components

### AccessibilityUtils
**File**: `src/components/common/AccessibilityUtils.jsx`

Collection of accessibility-focused components and utilities.

#### Components
- `ScreenReaderOnly`: Content visible only to screen readers
- `SkipToMain`: Skip navigation link
- `AccessibleHeading`: Semantic headings with visual control
- `AccessibleButton`: Button with proper ARIA attributes
- `AccessibleField`: Form field with proper labeling
- `LiveRegion`: Dynamic content announcements
- `AccessibleModal`: Modal with focus management
- `AccessibleProgress`: Progress indicator with labels

#### Usage
```jsx
import { 
  ScreenReaderOnly, 
  AccessibleHeading, 
  AccessibleProgress 
} from '../components/common/AccessibilityUtils';

// Screen reader only content
<ScreenReaderOnly>
  This content is only for screen readers
</ScreenReaderOnly>

// Semantic heading with visual control
<AccessibleHeading level={2} visualLevel={4}>
  H2 heading styled as H4
</AccessibleHeading>

// Progress with accessibility
<AccessibleProgress
  value={75}
  max={100}
  label="Upload progress"
  showPercentage={true}
/>
```

---

## Interactive Components

### InteractiveComponents
**File**: `src/components/common/InteractiveComponents.jsx`

Collection of components with enhanced animations and micro-interactions.

#### Components

##### LoadingButton
Button with loading states and animations.
```jsx
import { LoadingButton } from '../components/common/InteractiveComponents';

<LoadingButton
  isLoading={submitting}
  loadingText="Saving..."
  successText="Saved!"
  onClick={handleSubmit}
>
  Save Changes
</LoadingButton>
```

##### AnimatedHeart
Interactive heart icon for favorites/likes.
```jsx
import { AnimatedHeart } from '../components/common/InteractiveComponents';

<AnimatedHeart
  isLiked={isFavorite}
  onToggle={setIsFavorite}
  size={24}
/>
```

##### AnimatedProgress
Progress bar with smooth animations.
```jsx
import { AnimatedProgress } from '../components/common/InteractiveComponents';

<AnimatedProgress
  value={progress}
  max={100}
  label="Upload Progress"
  animate={true}
  color="bg-green-500"
/>
```

##### AnimatedCounter
Number counter with easing animation.
```jsx
import { AnimatedCounter } from '../components/common/InteractiveComponents';

<AnimatedCounter
  value={totalDonations}
  duration={2000}
  prefix="$"
/>
```

---

## Performance Utilities

### PerformanceUtils
**File**: `src/components/common/PerformanceUtils.jsx`

Collection of performance optimization utilities.

#### Components & Hooks

##### LazyComponent
Wrapper for code-split components.
```jsx
import { LazyComponent } from '../components/common/PerformanceUtils';

<LazyComponent
  importFunc={() => import('./HeavyComponent')}
  fallback={<ComponentSkeleton />}
/>
```

##### LazyImage
Image component with loading states.
```jsx
import { LazyImage } from '../components/common/PerformanceUtils';

<LazyImage
  src="/images/cause.jpg"
  alt="Cause description"
  fallbackSrc="/images/placeholder.jpg"
  className="w-full h-64 object-cover"
/>
```

##### useIntersectionObserver
Hook for lazy loading based on visibility.
```jsx
import { useIntersectionObserver } from '../components/common/PerformanceUtils';

const { elementRef, hasBeenVisible } = useIntersectionObserver();

<div ref={elementRef}>
  {hasBeenVisible && <ExpensiveComponent />}
</div>
```

---

## SEO & Meta Management

### SEO Component
**File**: `src/components/common/SEO.jsx`

Comprehensive SEO management with React Helmet.

#### Features
- Dynamic meta tags
- Open Graph support
- Twitter Cards
- JSON-LD structured data
- Canonical URLs
- Favicon management

#### Usage
```jsx
import SEO from '../components/common/SEO';

<SEO
  title="Support Local Education - CauseHive"
  description="Help provide books and supplies to local schools"
  keywords="education, charity, fundraising"
  image="/images/cause-education.jpg"
  url="https://causehive.com/causes/123"
  type="article"
  cause={causeData}
/>
```

---

## Routing & Code Splitting

### AppRoutes
**File**: `src/components/routing/AppRoutes.jsx`

Optimized routing configuration with lazy loading.

#### Features
- Critical routes loaded immediately
- Non-critical routes lazy loaded
- Consistent loading states
- Error boundaries
- Performance monitoring

#### Structure
```jsx
// Critical routes (eager loading)
- Landing Page
- Sign In
- Sign Up

// Lazy loaded routes
- Dashboard
- Cause pages
- Profile pages
- Admin pages
```

---

## Styling & Theming

### CSS Variables
**File**: `src/index.css`

#### Theme Variables
```css
:root {
  /* CauseHive Brand Colors */
  --causehive-primary: #2563eb;
  --causehive-secondary: #10b981;
  --causehive-accent: #f59e0b;
  
  /* Semantic Colors */
  --primary: 214 100% 59%;
  --secondary: 160 65% 54%;
  --accent: 43 96% 56%;
  --destructive: 0 100% 50%;
  
  /* Surface Colors */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  
  /* Interactive Elements */
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 214 100% 59%;
}
```

### Custom Animations
Enhanced animations for micro-interactions:
- `shimmer`: Loading effect
- `float`: Gentle floating motion
- `pulse-soft`: Subtle pulsing
- `bounce-soft`: Gentle bounce
- `shake`: Error indication
- `scale-in`: Entrance animation
- `slide-in-*`: Directional slides

---

## Development Guidelines

### Component Creation
1. Use functional components with hooks
2. Implement proper TypeScript props (if using TS)
3. Include comprehensive JSDoc comments
4. Follow accessibility best practices
5. Implement error boundaries where needed
6. Use proper semantic HTML

### Performance Best Practices
1. Implement lazy loading for heavy components
2. Use React.memo for expensive renders
3. Implement proper dependency arrays in hooks
4. Use virtualization for large lists
5. Optimize images with lazy loading
6. Implement proper error boundaries

### Accessibility Requirements
1. Proper ARIA attributes
2. Keyboard navigation support
3. Screen reader compatibility
4. Color contrast compliance
5. Focus management
6. Semantic HTML structure

### Testing Strategy
1. Unit tests for individual components
2. Integration tests for complex interactions
3. Accessibility testing with axe-core
4. Performance testing with Lighthouse
5. Cross-browser compatibility testing

---

## Migration Guide

### From Old Components
1. Replace custom CSS modules with shadcn/ui components
2. Update color references to use CSS variables
3. Implement new accessibility patterns
4. Add performance optimizations
5. Update imports to use barrel exports

### Breaking Changes
1. Button variants have changed
2. Color classes now use semantic names
3. Toast system requires provider wrapper
4. Form components require proper labeling
5. Navigation structure updated for accessibility

---

## Contributing

### Code Style
- Use 2 spaces for indentation
- Follow ESLint configuration
- Use Prettier for formatting
- Include comprehensive JSDoc comments
- Follow component naming conventions

### Pull Request Guidelines
1. Include component documentation updates
2. Add accessibility testing
3. Include performance impact assessment
4. Update migration guide if needed
5. Include visual regression tests

---

## Support & Resources

### Documentation
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Radix UI Primitives](https://radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Accessibility](https://reactjs.org/docs/accessibility.html)

### Team Contacts
- Frontend Lead: [Contact Information]
- Design System: [Contact Information]
- Accessibility: [Contact Information]

---

*Last Updated: December 2024*
*Version: 1.0.0*