function MomentumError() {
  return (
    <div className='rounded-xl border border-red-500/30 bg-linear-to-br from-red-500/10 to-transparent p-4'>
      <div className='mb-3 flex justify-between'>
        <p className='text-xs uppercase tracking-wider text-red-300/70'>momentum timeline</p>
        <p className='text-xs text-red-300/50'>—</p>
      </div>

      <div className='flex h-40 items-center justify-center'>
        <div className='space-y-3'>
          <p className='text-sm text-red-400'>Could not load momentum data</p>

          <p className='text-xs text-red-300/70'>Check if data is available or try again later.</p>
        </div>
      </div>
    </div>
  );
}

export default MomentumError;
