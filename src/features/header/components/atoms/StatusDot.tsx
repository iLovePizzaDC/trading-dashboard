import { STATUS_DOT_CONFIG } from '@/features/header/constants/status-dot';
import type { StatusDotVariant } from '@/features/header/types/status-dot';

interface IStatusDot {
	variant: StatusDotVariant;
}

function StatusDot({ variant }: IStatusDot) {
	const { core, ring, animation } = STATUS_DOT_CONFIG[variant];

	return (
		<span className='relative flex h-1.5 w-1.5 shrink-0'>
			{variant !== 'inactive' && (
				<span
					className={`absolute inline-flex h-full w-full rounded-full opacity-60 ${ring} ${animation}`}
					data-testid='status-dot-ring'
				/>
			)}
			<span
				className={`relative inline-flex h-1.5 w-1.5 rounded-full ${core}`}
				data-testid='status-dot-core'
			/>
		</span>
	);
}

export default StatusDot;
