import type { ComponentProps } from 'react';
import { Link } from '../router/router';
import Stack from '../layout/Stack';
import Text from '../text/Text';

type NotFoundViewProps = {
  title?: string;
  message?: string;
  homeTo?: string;
  homeLabel?: string;
  className?: string;
} & Omit<ComponentProps<'div'>, 'children' | 'title'>;

/**
 * The 404 view, with its copy as props because the substrate does not know the
 * site's language.
 *
 * Exported as a VIEW rather than as the route's fallback directly: `Router`
 * takes a `ComponentType` with no props, so a site writes its own one-line
 * wrapper (`const NotFound = () => <NotFoundView title="…" />`) instead of the
 * substrate guessing at wording it cannot know.
 */
export default function NotFoundView({
  title = 'Page not found',
  message = 'That address does not match any section of this site.',
  homeTo = '/',
  homeLabel = 'Back to the start',
  className,
  ...rest
}: NotFoundViewProps) {
  return (
    <Stack gap="s" align="start" className={className} {...rest}>
      {/* The 404 is a page like any other and WCAG 2.4.2 applies to it: the
          title prop feeds BOTH the heading and the document title (React 19
          hoists <title> to <head> from anywhere in the tree). One string, one
          prop — a consumer wanting a "page — site" tab title passes it here. */}
      <title>{title}</title>
      {/* h2, not h1: under AppShell the brand in SiteHeader IS the page h1,
          and this view used to add a second one — every 404 had two (roster
          finding 1.6, operator-delegated fix 2026-08-29). */}
      <Text as="h2" size="lg">
        {title}
      </Text>
      <Text muted>{message}</Text>
      <Link to={homeTo} className="phy-target">
        {homeLabel}
      </Link>
    </Stack>
  );
}

// Made with my soul - Swately <3
