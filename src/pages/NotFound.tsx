import { NotFoundView } from '../phyriad-react';

// The substrate ships the view; the site supplies the language. That split is
// why NotFoundView takes its copy as props rather than guessing at wording it
// cannot know.
export default function NotFound() {
  return (
    <NotFoundView
      title="Página no encontrada"
      message="Esa dirección no corresponde a ninguna sección de este sitio."
      homeLabel="Volver al inicio"
    />
  );
}

// Made with my soul - Swately <3
