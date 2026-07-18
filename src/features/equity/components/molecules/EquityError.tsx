function EquityError() {
  return (
    <div className='grid grid-cols-1 gap-4 lg:grid-cols-[3fr_2fr] items-start'>
      <div className='rounded-xl border border-red-500/30 bg-linear-to-br from-red-500/10 to-transparent p-4'>
        <div className='mb-4 flex items-baseline justify-between'>
          <p className='text-xs uppercase tracking-wider text-red-300/70'>equity curve</p>
          <p className='text-xs text-red-300/50'>—</p>
        </div>
        <div className='flex h-52 flex-col items-center justify-center text-center'>
          <p className='text-sm text-red-400'>Could not load trade statistics</p>
          <p className='text-xs text-red-300/70 max-w-xs'>
            Check if data is available or try again later.
          </p>
        </div>
      </div>

      <div className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4 opacity-40'>
        <div className='mb-4'>
          <p className='text-xs uppercase tracking-wider text-white/40'>monthly performance</p>
        </div>
        <div className='space-y-1'>
          {Array.from({ length: 4 }).map((_, row) => (
            <div
              key={row}
              className='grid grid-cols-[2rem_repeat(12,1fr)] gap-1 items-center'
              data-testid={`skeleton-row-wrapper-${row}`}
            >
              <div
                className='h-3 w-6 rounded bg-white/10'
                data-testid={`skeleton-col-label-${row}`}
              />
              {Array.from({ length: 12 }).map((_, col) => (
                <div
                  key={col}
                  className='h-5 w-full rounded-sm bg-white/10'
                  data-testid={`skeleton-col-content-${row}`}
                />
              ))}
            </div>
          ))}
        </div>
        <p className='pt-3 text-xs text-white/30 text-center'>
          Not enough data to calculate monthly returns
        </p>
      </div>
    </div>
  );
}

export default EquityError;
