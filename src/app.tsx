import { AppShell, Link, SiteFooter, StandardsLab, ThemeToggle, type Route } from './phyriad-react';
import IndexPage from './pages/IndexPage';
import ProjectPage from './pages/ProjectPage';
import { lazyPage } from './lib/lazyPage';

// The project pages with prose are loaded on demand: the home page and the ledger do not pay for their text.
const PhyriadFGPage = lazyPage(() => import('./pages/projects/PhyriadFGPage'));
const PhyriagerPage = lazyPage(() => import('./pages/projects/PhyriagerPage'));
const PhynnedPage = lazyPage(() => import('./pages/projects/PhynnedPage'));
import EvidencePage from './pages/EvidencePage';
import NotFound from './pages/NotFound';
import Masthead from './components/Masthead';
import FiguresLab from './pages/FiguresLab';
// Dashboard.tsx is an empty stub (renders nothing); its route is parked until it has a
// purpose — kept, not deleted (container rule: reclassify, never delete invested work).
// import Dashboard from './pages/Dashboard';

const routes: Route[] = [
  { path: '/', page: IndexPage },
  // A project's own page goes BEFORE the generic one: the router takes the first match.
  { path: '/proyecto/phyriadfg', page: PhyriadFGPage },
  { path: '/proyecto/phyriager', page: PhyriagerPage },
  { path: '/proyecto/phynned', page: PhynnedPage },
  { path: '/proyecto/:slug', page: ProjectPage },
  { path: '/evidencia', page: EvidencePage },
  // { path: '/dashboard', page: Dashboard },
  // Development only. The lab is a debugging instrument, not public furniture:
  // Vite replaces import.meta.env.DEV statically, so this route and everything
  // it pulls in drop out of the production bundle entirely.
  ...(import.meta.env.DEV
    ? [
        { path: '/lab', page: StandardsLab },
        { path: '/figuras', page: FiguresLab },
      ]
    : []),
];

// Design v2, "the work first" (2026-09-02): the header is the name and nothing
// else; the foot carries the ledger link and the theme control; no sidebars.
// Pages return fragments of sections and take the shell's column grid.
const footer = (
  <SiteFooter>
    <Link to="/evidencia">Cómo se verifica este sitio</Link>
    {' · '}
    <ThemeToggle prefix="Tema" labels={{ system: 'Sistema', light: 'Claro', dark: 'Oscuro' }} />
  </SiteFooter>
);

export default function App() {
  return (
    <AppShell
      routes={routes}
      notFound={NotFound}
      header={<Masthead />}
      footer={footer}
      skipLabel="Saltar al contenido"
      layout="centered"
      className="page"
    />
  );
}

// Made with my soul - Swately <3
