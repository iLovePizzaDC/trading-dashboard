interface IEntryRowLayout {
	color: string;
	isLast: boolean;
	dotOpacity?: number;
	renderLeft: React.ReactNode;
	renderRight: React.ReactNode;
}

function EntryRowLayout({
	color,
	isLast,
	dotOpacity = 1,
	renderLeft,
	renderRight,
}: IEntryRowLayout) {
	return (
		<div className='flex gap-2.5'>
			<div className='flex flex-col items-center w-3 shrink-0'>
				<div
					className='w-2 h-2 rounded-full mt-1.75 shrink-0 z-10'
					style={{ backgroundColor: color, opacity: dotOpacity }}
					data-testid='entry-row-dot'
				/>
				{!isLast && (
					<div
						className='w-px flex-1 min-h-2'
						style={{ backgroundColor: color, opacity: 0.2 }}
						data-testid='entry-row-line'
					/>
				)}
			</div>

			<div
				className={`flex-1 flex items-start justify-between min-w-0 ${
					isLast ? '' : 'border-b border-white/5'
				}`}
			>
				<div className='min-w-0'>{renderLeft}</div>
				<div className='text-right shrink-0 ml-2'>{renderRight}</div>
			</div>
		</div>
	);
}

export default EntryRowLayout;
