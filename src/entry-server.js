import { render } from '@lit-labs/ssr';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { html } from 'lit';

// Import your root component
// Adjust the path if my-element.js is not in the root
import '../my-element.js';

// This function will be called by the server script
export function renderApp(url) {
  // Simple render for now, just the custom element.
  // In a real app, you might use routing based on the `url`.
  const ssrContent = render(html`<my-element></my-element>`);

  // Wrap it in a basic structure or use your index.html as a template
  // For simplicity, we just return the rendered component string here.
  // The server script will need to inject this into the main HTML.
  return { html: ssrContent };
} 