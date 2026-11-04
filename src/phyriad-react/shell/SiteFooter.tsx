import type { ComponentProps } from 'react';
import type { ReactNode } from 'react';
import Stack from '../layout/Stack';
import Text from '../text/Text';
import styles from './SiteFooter.module.css';

type SiteFooterProps = {
  children: ReactNode;
  className?: string;
} & Omit<ComponentProps<'div'>, 'children'>;

/** The site footer: a `contentinfo` landmark with a rule above it. */
export default function SiteFooter({ children, className, ...rest }: SiteFooterProps) {
  return (
    <Stack
      as="footer"
      gap="xs"
      className={[styles.footer, className].filter(Boolean).join(' ')}
      {...rest}
    >
      <Text as="span" size="sm" muted>
        {children}
      </Text>
    </Stack>
  );
}

// Made with my soul - Swately <3
