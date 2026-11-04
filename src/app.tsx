import { AppShell, Link, SiteFooter, ThemeToggle, type Route } from './phyriad-react';
import IndexPage from './pages/IndexPage';
import ProjectPage from './pages/ProjectPage';
import { lazyPage } from './lib/lazyPage';

// The project pages with prose are loaded on demand: the home page and the ledger do not pay for their text.
const PhyriadFGPage = lazyPage(() => import('./pages/projects/PhyriadFGPage'));
const PhyriagerPage = lazyPage(() => import('./pages/projects/PhyriagerPage'));
const PhynnedPage = lazyPage(() => import('./pages/projects/PhynnedPage'));
// The substrate section (/sustrato-web): its page, its isolated demonstration document and the laboratory.
const SustratoWebPage = lazyPage(() => import('./pages/SustratoWebPage'));
const SustratoDemo = lazyPage(() => import('./pages/SustratoDemo'));
const SustratoLabPage = lazyPage(() => import('./pages/SustratoLabPage'));
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
  { path: '/sustrato-web', page: SustratoWebPage },
  // The demonstration is a window route (no site chrome) shown in an iframe by the page above: a palette
  // is an attribute of the root element, so a second document is how one box changes and the page does not.
  { path: '/sustrato-web/demo', page: SustratoDemo, window: true },
  { path: '/sustrato-web/laboratorio', page: SustratoLabPage },
  // { path: '/dashboard', page: Dashboard },
  // Development only: the figures lab uses invented numbers. Vite replaces import.meta.env.DEV statically, so
  // this route and everything it pulls in drop out of the production bundle entirely. The substrate's own
  // laboratory used to be a /lab route here; it is public now (/sustrato-web/laboratorio), and importing it in
  // this file as well kept it in the entry's graph: the home page was loading it (measured: +9 kB of JS).
  ...(import.meta.env.DEV ? [{ path: '/figuras', page: FiguresLab }] : []),
];

// Design v2, "the work first" (2026-09-02): the header is the name and nothing
// else; the foot carries the ledger link and the theme control; no sidebars.
// Pages return fragments of sections and take the shell's column grid.
const footer = (
  <SiteFooter>
    <Link to="/evidencia">Cómo se verifica este sitio</Link>
    {' · '}
    <Link to="/sustrato-web">El sustrato web</Link>
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
