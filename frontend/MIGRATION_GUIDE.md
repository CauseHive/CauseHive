# CauseHive Frontend Migration Guide

## Overview
This guide helps migrate from the legacy CauseHive frontend to the new enterprise-grade implementation with shadcn/ui components.

## Key Changes

### 1. Component Library Migration
- **Old**: Custom CSS modules and inline styles
- **New**: shadcn/ui components with Tailwind CSS
- **Action**: Replace custom components with standardized UI library

### 2. Design System Updates
- **Old**: Hardcoded colors and spacing
- **New**: CSS variables and design tokens
- **Action**: Update all color references to use semantic variables

### 3. Performance Optimizations
- **Old**: All routes loaded eagerly
- **New**: Lazy loading with React.lazy and Suspense
- **Action**: Update imports and add Suspense boundaries

### 4. Accessibility Enhancements
- **Old**: Basic HTML structure
- **New**: ARIA attributes, semantic HTML, keyboard navigation
- **Action**: Update components with accessibility features

## Step-by-Step Migration

### Phase 1: Setup and Dependencies
```bash
# Install new dependencies
npm install @radix-ui/react-* class-variance-authority clsx tailwind-merge
npm install react-helmet-async @tanstack/react-virtual
npm install lucide-react
```

### Phase 2: Update Configuration Files
1. Replace `tailwind.config.js` with new configuration
2. Update `src/index.css` with design system variables
3. Add `src/utils/cn.js` utility function

### Phase 3: Component Migration Priority
1. **Critical Path**: Button, Input, Card components
2. **Business Logic**: CauseCard, CausesList components  
3. **Performance**: VirtualizedTable, lazy loading
4. **Enhancement**: SEO, accessibility, animations

### Phase 4: Route Optimization
1. Implement lazy loading for non-critical routes
2. Add Suspense boundaries with proper fallbacks
3. Update App.js to use optimized routing

## Breaking Changes

### Button Component
```jsx
// Old
<button className="btn btn-primary">Click me</button>

// New
<Button variant="default">Click me</Button>
<Button variant="donate">Donate Now</Button>
```

### Form Components
```jsx
// Old
<input type="email" className="form-input" />

// New
<Input type="email" className="..." />
```

### Card Layout
```jsx
// Old
<div className="card">
  <div className="card-header">Title</div>
  <div className="card-body">Content</div>
</div>

// New
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Color Classes
```jsx
// Old
className="bg-blue-600 text-white"

// New  
className="bg-primary text-primary-foreground"
```

## Component Mapping

| Old Component | New Component | Location |
|---------------|---------------|----------|
| Custom buttons | `Button` | `components/ui/button.jsx` |
| Form inputs | `Input` | `components/ui/input.jsx` |
| Card layouts | `Card` | `components/ui/card.jsx` |
| Loading states | `Skeleton` | `components/ui/skeleton.jsx` |
| Notifications | `Toast` | `components/ui/toast.jsx` |
| Cause displays | `CauseCard` | `components/common/CauseCard.jsx` |
| Data tables | `VirtualizedTable` | `components/common/VirtualizedTable.jsx` |

## Testing Migration

### 1. Visual Regression Testing
- Compare old vs new component renders
- Verify responsive behavior
- Check accessibility features

### 2. Functionality Testing  
- Ensure all interactive elements work
- Verify form submissions
- Test navigation and routing

### 3. Performance Testing
- Measure bundle size reduction
- Check loading performance
- Verify lazy loading works

## Rollback Plan

### Emergency Rollback
1. Keep old components in `components/legacy/`
2. Maintain parallel import paths
3. Feature flags for component switching

### Gradual Migration
1. Implement new components alongside old ones
2. A/B testing for critical paths
3. Progressive rollout by user segment

## Validation Checklist

- [ ] All components render correctly
- [ ] Responsive design works on all breakpoints
- [ ] Accessibility features are functional
- [ ] Performance metrics show improvement
- [ ] SEO meta tags are working
- [ ] Interactive animations are smooth
- [ ] Form validation works correctly
- [ ] Navigation and routing work
- [ ] Error boundaries handle failures
- [ ] Loading states display properly

## Support Resources

### Documentation
- [Component Library Guide](./COMPONENT_LIBRARY.md)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Accessibility Guidelines](./ACCESSIBILITY.md)

### Common Issues
1. **Styling conflicts**: Use `cn()` utility for class merging
2. **Missing props**: Check component prop interfaces
3. **Animation issues**: Verify Tailwind animations are working
4. **SEO problems**: Ensure HelmetProvider is configured

### Getting Help
- Check component examples in documentation
- Review existing implementations in codebase
- Ask team for code review on complex migrations

---

*Migration Timeline: 2-3 weeks for full implementation*  
*Priority: Critical path components first, enhancements second*