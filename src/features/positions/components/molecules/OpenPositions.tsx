import PositionRow from '@/features/positions/components/atoms/PositionRow';
import PositionsEmpty from '@/features/positions/components/molecules/PositionsEmpty';
import Card from '@/shared/components/atoms/Card';
import ShowMoreButton from '@/shared/components/atoms/ShowMoreButton';
import { useExpandable } from '@/shared/hooks/useExpandable';
import type { OpenStops } from '@/shared/types/stops';
import type { Trade } from '@/shared/types/trades';

interface IOpenPositions {
  stops: OpenStops;
  trades: Trade[];
}

const Divider = () => (
  <div
    className='bg-linear-to-r from-transparent via-white/20 to-transparent h-px'
    data-testid='divider'
  />
);

function OpenPositions({ stops, trades }: IOpenPositions) {
  const symbols = Object.keys(stops);
  const lastBuy = trades.reduce<Record<string, Trade>>((acc, t) => {
    if (t.action === 'buy') acc[t.symbol] = t;
    return acc;
  }, {});

  const { expanded, toggle, hasMore, hiddenCount, previewCount } = useExpandable(symbols.length, 2);

  if (symbols.length === 0) return <PositionsEmpty />;

  const preview = symbols.slice(0, previewCount);
  const extra = symbols.slice(previewCount);

  return (
    <Card title={`open positions (${symbols.length})`}>
      {preview.map((symbol, index) => (
        <div key={symbol}>
          <PositionRow
            symbol={symbol}
            stop={stops[symbol]}
            trade={lastBuy[symbol]}
            isLast={index === preview.length - 1 && extra.length === 0}
          />
          {index < preview.length - 1 && <Divider />}
        </div>
      ))}

      <div
        className={`grid transition-[grid-template-rows] duration-250 ease-in-out ${expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        data-testid='open-positions-grid-wrapper'
      >
        <div className='overflow-hidden'>
          {extra.map((symbol, index) => (
            <div key={symbol}>
              <Divider />
              <PositionRow
                symbol={symbol}
                stop={stops[symbol]}
                trade={lastBuy[symbol]}
                isLast={index === extra.length - 1}
              />
            </div>
          ))}
        </div>
      </div>

      {hasMore && <ShowMoreButton toggle={toggle} expanded={expanded} hiddenCount={hiddenCount} />}

      <div className='w-1 mb-1' />
    </Card>
  );
}

export default OpenPositions;
