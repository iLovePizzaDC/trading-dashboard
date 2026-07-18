import StopEntry from '@/features/stops/components/atoms/StopEntry';
import type { StopHistoryGroup } from '@/features/stops/types/stop-history';
import GroupRowLayout from '@/shared/components/layouts/GroupRowLayout';
import { usd } from '@/shared/utils/currency';

interface IStopGroupRow {
  group: StopHistoryGroup;
}

function StopGroupRow({ group }: IStopGroupRow) {
  const firstEntry = group.entries[group.entries.length - 1];
  const overallChange = group.latestStop - (firstEntry?.old_stop ?? 0);
  const isUp = overallChange >= 0;

  return (
    <GroupRowLayout
      symbol={group.symbol}
      color={group.color}
      entries={group.entries}
      getEntryKey={(entry, i) => `${entry.date}-${i}`}
      renderBadge={() => (
        <span className={`text-[11px] font-medium ${isUp ? 'text-green-400' : 'text-red-400'}`}>
          {usd(group.latestStop)}
        </span>
      )}
      renderEntry={(entry, color, isLast) => (
        <StopEntry entry={entry} color={color} isLast={isLast} />
      )}
    />
  );
}

export default StopGroupRow;
