import type { Preview } from '@storybook/nextjs-vite'
import '../src/app/globals.css'

// Load Google Fonts for Storybook (Next.js handles this in the app)
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@400;500;600;700&family=Reenie+Beanie&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

// Set CSS variables that Next.js normally sets
const style = document.createElement('style');
style.textContent = `
  :root {
    --font-outfit: 'Outfit', sans-serif;
    --font-inter: 'Inter', sans-serif;
    --font-reenie: 'Reenie Beanie', cursive;
  }
`;
document.head.appendChild(style);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;