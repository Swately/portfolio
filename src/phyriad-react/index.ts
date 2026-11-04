// phyriad-react — the container's web UI substrate.
//
// One import surface. A consumer should never reach past this file into a
// subfolder: the layout of the substrate is not its contract, this is.

// The scale vocabulary every primitive speaks.
export {
  spaceVar,
  textVar,
  faceVar,
  type SpaceStep,
  type SpacePair,
  type TextStep,
  type FaceRole,
} from './scale';

// Layout primitives — relationships, never context. None of them contains a
// media query, by rule: a query inside a primitive makes it wrong in every slot
// that is not the one the query assumed.
export { default as Box } from './layout/Box';
// Fills the space it is given and can subdivide it. `span` = how much of the
// parent; `cols` = local subdivision; `subgrid` = inherit the parent's lines.
// `cols` and `subgrid` are mutually exclusive in the type.
export { default as Container } from './layout/Container';
export { default as Stack } from './layout/Stack';
export { default as Cluster } from './layout/Cluster';
export { default as Grid } from './layout/Grid';
export { default as DescList, type DescItem } from './layout/DescList';

// Accessibility primitives. Content for assistive tech only; the hiding
// recipe itself lives in the tokens base layer and is testbench-verified.
export { default as VisuallyHidden } from './a11y/VisuallyHidden';
// Live region for messages that do not take focus (WCAG 4.1.3). Mount empty,
// inject later — mounting it filled is the silent-failure case and warns in DEV.
export { default as Status } from './a11y/Status';

// Controls. A button acts, a link navigates — and here they also differ by
// colour system (links oxide, buttons ink), which is why Button has no as/href.
export { default as Button } from './controls/Button';
// Form fields: Field owns the invisible association work (label/for,
// aria-describedby, aria-invalid) and hands it to the control via context.
export { default as Field } from './controls/Field';
export { default as Input } from './controls/Input';
export { default as TextArea } from './controls/TextArea';
export { default as Select } from './controls/Select';
export { default as Checkbox } from './controls/Checkbox';
export { default as Radio } from './controls/Radio';
export { default as Fieldset } from './controls/Fieldset';
// The loud path of a failed submit: focus moves to the summary — that IS the
// announcement — and each item is a link that focuses its field.
export { default as ErrorSummary, type SummaryError } from './controls/ErrorSummary';

// States — what a happy-path mock never shows. Skeleton is aria-hidden by
// design: the ACCESSIBLE loading state is aria-busy + a Status announcement.
export { default as Skeleton } from './states/Skeleton';
export { default as SkeletonText } from './states/SkeletonText';
export { default as Skeletonize } from './states/Skeletonize';
export { default as Empty } from './states/Empty';
export { default as ErrorBoundary } from './states/ErrorBoundary';

// Content — adopted rich text, bound captions, portable tables.
export { default as Prose } from './content/Prose';
export { default as Figure } from './content/Figure';
export { default as Table } from './content/Table';

// Navigation surface — the accessible shell of wayfinding; engines, sorting
// and data stay with the consuming project (transferable by doctrine).
export { default as Breadcrumbs, type Crumb } from './nav/Breadcrumbs';
export { default as Pagination } from './nav/Pagination';
export { default as TableOfContents, type TocItem } from './nav/TableOfContents';
export { default as Search } from './nav/Search';

// Interaction — native-first: details/summary and dialog/showModal give the
// platform half; the components pay what authors still owe (focus restore,
// scroll lock, labelling, the close button, the ink-veil backdrop).
export { default as Disclosure } from './interaction/Disclosure';
export { default as Dialog } from './interaction/Dialog';

// Text.
export { default as Text } from './text/Text';

// Routing: hand-rolled over the History API, zero dependencies. Pages import
// only these five names. usePath is public because aria-current nav
// highlighting needs the live route; it is also what AppShell keys its
// route-change focus management on.
export { Router, Link, useParams, usePath, navigate, type Route } from './router/router';

// Page furniture.
// Colour scheme (0.17.0) — the theme is the palette (light-dark() tokens);
// this is only the override attribute, its persistence and one control.
export {
  useColorScheme,
  setColorScheme,
  THEME_BOOT_SCRIPT,
  THEME_STORAGE_KEY,
  THEME_CHANGE_EVENT,
  type SchemePreference,
  type Scheme,
  type ColorSchemeState,
} from './theme/colorScheme';
export { default as ThemeToggle } from './theme/ThemeToggle';
// Type settings (1.4.0, tokens 2.1.0) — the type theme attribute and the size multiplier.
export {
  useTypeSettings,
  setTypeTheme,
  setTypeScale,
  TYPE_THEMES,
  TYPE_SCALE_MIN,
  TYPE_SCALE_MAX,
  TYPE_BOOT_SCRIPT,
  TYPE_THEME_STORAGE_KEY,
  TYPE_SCALE_STORAGE_KEY,
  TYPE_CHANGE_EVENT,
  type TypeTheme,
  type TypeSettings,
} from './theme/typeSettings';
// Structure surfaces (0.22.0) — resizable panels, a data-driven tree, a tooltip in the top layer.
export { default as Splitter } from './window/Splitter';
export { default as TreeView, type TreeItemData } from './nav/TreeView';
export { default as Tooltip } from './interaction/Tooltip';
export { type Prefer } from './interaction/placement';
// Choice surfaces (0.21.0) — a menu in the platform's top layer, tabs with mounted panels.
export { default as MenuButton, MenuItem } from './interaction/MenuButton';
export { default as Tabs, TabList, Tab, TabPanel } from './interaction/Tabs';
export { placeMenu, type Placement } from './interaction/placement';
// Feedback (0.20.0) — notifications as state outside React, and native progress.
export { default as Toaster } from './feedback/Toaster';
export {
  toast,
  dismiss,
  dismissAll,
  useToasts,
  TOAST_CAP,
  type Toast,
  type ToastInput,
  type ToastKind,
} from './feedback/toasts';
export { default as Progress } from './feedback/Progress';
// Window surfaces (0.19.0) — an application frame that owns the viewport:
// mount WindowFrame as the page of a `window` route (AppShell renders no chrome).
export { default as WindowFrame } from './window/WindowFrame';
export { default as ScrollRegion } from './layout/ScrollRegion';
export { default as Panel } from './layout/Panel';
export { default as Toolbar } from './interaction/Toolbar';
export { default as AppShell } from './shell/AppShell';
export { default as SiteHeader, type NavItem } from './shell/SiteHeader';
export { default as SiteFooter } from './shell/SiteFooter';
export { default as Sidebar } from './shell/Sidebar';
export { default as NotFoundView } from './shell/NotFoundView';

// The standards lab: every section, primitive and scale on one page with the
// page's own measurements taken live from the DOM. A debugging instrument —
// mount it on a development-only route, not on a public one.
export { default as StandardsLab } from './lab/StandardsLab';
export { default as GridOverlay } from './lab/GridOverlay';
export { useLiveMetrics, contrast, type Metric } from './lab/useLiveMetrics';

// Made with my soul - Swately <3
