import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'coverage'] },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,

      // Two accessibility rules genuinely collide here, and this resolves the
      // collision rather than silencing either.
      //
      // `no-noninteractive-tabindex` exists to stop tabindex being sprayed onto
      // decorative markup. But axe's `scrollable-region-focusable` REQUIRES a
      // horizontally scrollable region to be keyboard-reachable — a scroll
      // container a keyboard user cannot enter is a real barrier, and the
      // documented fix is exactly `role="region"` + `tabindex="0"`.
      //
      // The rule's default allowlist knows `tabpanel` and not `region`, so the
      // pattern reads as a violation. Adding `region` to the allowlist keeps the
      // rule doing its actual job everywhere else.
      'jsx-a11y/no-noninteractive-tabindex': [
        'error',
        { tags: [], roles: ['tabpanel', 'region'], allowExpressionValues: true },
      ],
    },
  },
);

// Made with my soul - Swately <3
