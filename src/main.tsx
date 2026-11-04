import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/reset.css';
import './styles/skin-showcase.css';
import App from './app';
import { bootSkin } from './lib/skin';

// 404-shim restore (see public/404.html), ported from climx: /?/<path>&<query>
// -> the real URL, replaced BEFORE React mounts so the router sees the intended
// path. Without this the shim's bounce leaves the query-encoded path visible.
const loc = window.location;
if (loc.search.startsWith('?/')) {
  const [path = '', ...rest] = loc.search.slice(2).split('&');
  const query = rest.length ? '?' + rest.join('&').replace(/~and~/g, '&') : '';
  window.history.replaceState(
    null,
    '',
    import.meta.env.BASE_URL + path.replace(/~and~/g, '&') + query + loc.hash,
  );
}

bootSkin();

const root = document.getElementById('root');
if (!root) throw new Error('missing #root');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Made with my soul - Swately <3
