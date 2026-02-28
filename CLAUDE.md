# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based portfolio website with an interactive space-themed UI. The site features:
- 3D space backgrounds with Three.js/React Three Fiber
- Animated planetary skill visualization with realistic orbital physics
- Sanity CMS integration for content management
- Light/dark theme switching with audio controls
- Responsive design for mobile and desktop
- Deployment to GitHub Pages

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:3000)
npm start

# Build for production
npm run build

# Run tests
npm test

# Deploy to GitHub Pages
npm run deploy
```

## Architecture

### Entry Point & Main App Structure
- [src/index.js](src/index.js) - Application entry point
- [src/App.js](src/App.js) - Main app component that composes all sections
- Component hierarchy: `App → SimpleSpace + Navbar + Sections (Header, About, Work, Skills, Footer)`

### Content Management
- **Sanity CMS Integration**: [src/client.js](src/client.js) configures Sanity client
- Environment variables required:
  - `REACT_APP_SANITY_PROJECT_ID` - Sanity project ID
  - `REACT_APP_SANITY_TOKEN` - Sanity auth token
- Content types fetched from Sanity:
  - `works` - Portfolio projects with tags, images, links
  - `skills` - Skill icons and names
  - `experiences` - Work experience timeline

### Component Organization

**Containers** (`src/container/`) - Main page sections wrapped with AppWrap/MotionWrap HOCs:
- [Header](src/container/Header/Header.jsx) - Hero section with planetary skill visualization (1600+ lines of complex physics)
- [About](src/container/About/About.jsx) - About section
- [Work](src/container/Work/Work.jsx) - Portfolio with filterable projects
- [Skills](src/container/Skills/Skills.jsx) - Skills and experience timeline
- [Footer](src/container/Footer/Footer.jsx) - Contact section

**Components** (`src/components/`) - Reusable UI elements:
- [Navbar](src/components/Navbar/Navbar.jsx) - Navigation with theme toggle
- [SimpleSpace](src/components/SimpleSpace/SimpleSpace.jsx) - 3D space background with spaceships
- [DarkModeAudio](src/components/DarkModeAudio/DarkModeAudio.jsx) - Background music player (dark mode only)
- [CinemaTicket](src/components/CinemaTicket/) - Styled ticket component
- [MeteorEffect](src/components/MeteorEffect/) - Animated meteor effects
- NavigationDots, SocialMedia, ThemeToggle - UI utilities

**Wrappers** (`src/wrapper/`):
- [AppWrap.js](src/wrapper/AppWrap.js) - Adds navigation dots and social media links to sections
- [MotionWrap.js](src/wrapper/MotionWrap.js) - Adds Framer Motion animations

### Theme System
- Custom hook: [src/hooks/useTheme.js](src/hooks/useTheme.js)
- Persists theme in localStorage as `portfolio-theme`
- Sets `data-theme` attribute on document root (`dark` or `light`)
- All SCSS files use CSS custom properties that respond to `data-theme`
- Dark mode enables background music player

### 3D Graphics & Animation
- **Three.js/React Three Fiber** for 3D rendering
- SimpleSpace component renders:
  - Starfield background (React Three Drei Stars)
  - Animated spaceships with Moebius-inspired designs
  - Movement physics and respawning logic
- Header planetary system:
  - Kepler's orbital mechanics (eccentric anomaly, true anomaly)
  - 3D depth with Z-axis movement and perspective scaling
  - Collision detection with meteors
  - Supernova effects and flying guitar animations
  - Mobile vs desktop positioning strategies

### Styling
- **SASS** for styling (`.scss` files)
- Each component has its own SCSS file
- Global styles in [src/index.css](src/index.css) and [src/App.scss](src/App.scss)
- Theme-aware color variables
- Responsive breakpoints for mobile/tablet/desktop

### Dependencies
Key libraries:
- `react` (18.2.0), `react-dom` - Core framework
- `@react-three/fiber` (8.18.0), `@react-three/drei` (9.122.0), `three` (0.179.1) - 3D graphics
- `framer-motion` (10.9.2) - Animations
- `@sanity/client` (5.4.0), `@sanity/image-url` (1.0.2) - CMS
- `@mui/material` (7.3.1), `@emotion/react`, `@emotion/styled` - UI components
- `react-icons` (4.8.0) - Icon library
- `sass` (1.90.0) - CSS preprocessor
- `gh-pages` (6.0.0) - Deployment

## Working with This Codebase

### Adding New Portfolio Projects
Projects are managed in Sanity CMS. The [Work component](src/container/Work/Work.jsx) fetches projects with query `*[_type == "works"]` and displays them with filtering by tags.

Filter categories: Data Science, Web App, Mobile App, Flutter, Machine Learning, Data Analysis, Data Visualization, All

### Modifying Planetary Skills
The planetary visualization in [Header.jsx](src/container/Header/Header.jsx) has hardcoded skill data (lines 48-133) with properties:
- `image` - Skill icon
- `baseSize` - Base planet size
- `orbitalDistance` - Distance from center (affects size scaling)
- `color` - Planet color/glow
- `mass` - Affects physics
- `name`, `description`, `experience`, `proficiency`, `projects` - Modal data

To add/remove skills, modify the `skillsData` array and update corresponding assets in `src/assets/`.

### Theme Customization
1. Update CSS custom properties in SCSS files for each theme
2. Theme values respond to `[data-theme="dark"]` and `[data-theme="light"]`
3. Use the `useTheme` hook to access/toggle theme in components

### Responsive Design
- Desktop: > 1200px - Full planetary orbit system, desktop navbar
- Tablet: 768px - 1200px - Adjusted layouts
- Mobile: ≤ 768px - Simplified layouts, hamburger menu, touch interactions

### Important Notes
- The Header component is extremely complex (1600+ lines) with custom physics - modify with care
- Sanity credentials must be configured in environment variables
- 3D effects are performance-intensive - test on target devices
- Mobile interactions use touch events (`onTouchEnd`) instead of click handlers
- Images and 3D models are in `src/assets/` and `public/assets/`
- The space background and planetary system run on `requestAnimationFrame` loops

### Common Gotchas
- Planets use fixed positioning on mobile (high z-index 9998-9999) to stay above content
- Wrapper HOCs (AppWrap, MotionWrap) are applied to container components - order matters
- Image URLs from Sanity use `urlFor()` helper function
- Audio only plays in dark mode and requires user interaction to start
- GitHub Pages deployment requires `homepage` field in package.json
