function SkeletonBox({ className }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-md bg-white/10 ${className}`}
      data-testid='equity-skeleton-box'
    >
      <div className='absolute inset-0 animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent' />
    </div>
  );
}

function EquitySkeleton() {
  return (
    <div className='grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr] items-start'>
      <div
        className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'
        data-testid='equity-card'
      >
        <div className='mb-4 flex items-baseline justify-between' data-testid='equity-header'>
          <SkeletonBox className='h-3 w-24' />
          <SkeletonBox className='h-4 w-16' />
        </div>

        <div className='mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex gap-1' data-testid='equity-range-buttons'>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonBox key={i} className='h-5 w-8 rounded' />
            ))}
          </div>

          <div
            className='flex items-center justify-between gap-4 sm:justify-end'
            data-testid='equity-right-controls'
          >
            <SkeletonBox className='h-3 w-8' />
            <SkeletonBox className='h-3 w-10' />
            <SkeletonBox className='h-3 w-14' />
          </div>
        </div>

        <div data-testid='equity-chart-placeholder'>
          <SkeletonBox className='h-44 w-full rounded-lg' />
        </div>
      </div>

      <div
        className='rounded-xl border border-white/10 bg-linear-to-br from-white/5 to-white/0 p-4'
        data-testid='monthly-heatmap-card'
      >
        <div className='flex justify-start mb-4'>
          <SkeletonBox className='h-3 w-32' />
        </div>

        <div
          className='mb-2 grid grid-cols-[2rem_repeat(12,1fr)] gap-1'
          data-testid='heatmap-header-row'
        >
          <div />
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonBox key={i} className='h-3 w-full' />
          ))}
        </div>

        <div className='space-y-1'>
          {Array.from({ length: 4 }).map((_, row) => (
            <div
              key={row}
              className='grid grid-cols-[2rem_repeat(12,1fr)] gap-1 items-center'
              data-testid='heatmap-row-placeholder'
            >
              <SkeletonBox className='h-3 w-6' />
              {Array.from({ length: 12 }).map((_, col) => (
                <SkeletonBox key={col} className='h-5 w-full rounded-sm' />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EquitySkeleton;
