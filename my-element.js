import { LitElement, html, css } from 'lit';

class MyElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      border: 1px solid gray;
      padding: 16px;
      max-width: 800px;
    }
  `;

  render() {
    return html`
      <h1>Hello from MyElement!</h1>
      <p>This is a simple Lit component served by Vite.</p>
    `;
  }
}

customElements.define('my-element', MyElement); 