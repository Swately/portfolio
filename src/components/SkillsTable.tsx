import { Link, DescList, Text } from '../phyriad-react';
import type { SkillGroup } from '../content';
// Every row names the project that evidences it (graft from D3): a tools list is
// where an unsourced capability claim normally hides.
export default function SkillsTable({
  groups,
  nameOf,
}: {
  groups: SkillGroup[];
  nameOf: (slug: string) => string;
}) {
  return (
    <DescList
      termWidth="10rem"
      items={groups.map((group) => ({
        key: group.label,
        term: (
          <Text as="span" size="sm" mono muted>
            {group.label}
          </Text>
        ),
        desc: (
          <Text as="span" size="sm">
            {group.items}{' '}
            <Text as="span" size="xs" muted>
              — se comprueba en{' '}
              <Link to={`/proyecto/${group.evidencedBy}`}>{nameOf(group.evidencedBy)}</Link>
            </Text>
          </Text>
        ),
      }))}
    />
  );
}

// Made with my soul - Swately <3
