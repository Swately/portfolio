import { useEffect } from 'react';
import { navigate, Link, Text } from '../phyriad-react';

/**
 * /sustrato-web used to be a page of its own; it is now the dossier at /proyecto/sustrato-web, so there is one
 * page and not two. The old address keeps working (a link, a bookmark, the first publication) by replacing
 * itself with the new one, so the back button does not return to a page that only redirects. The link below is
 * for a reader without JavaScript running yet, and gives the page a title while it happens.
 */
export const SUSTRATO_DOSSIER = '/proyecto/sustrato-web';

export default function SustratoRedirect() {
  useEffect(() => {
    navigate(SUSTRATO_DOSSIER, { replace: true });
  }, []);
  return (
    <>
      <title>El sustrato web — Eduardo Ramos Mendoza</title>
      <Text size="sm" role="status">
        Esta página ahora es un proyecto:{' '}
        <Link to={SUSTRATO_DOSSIER} className="phy-target">
          El sustrato web
        </Link>
        .
      </Text>
    </>
  );
}

// Made with my soul - Swately <3
