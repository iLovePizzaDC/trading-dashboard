import type { TabType } from '@/features/summary/types/tab';

interface ITabButton {
	tab: TabType;
	label: string;
	activeTab: TabType;
	handleTabChange: (tab: TabType) => void;
}

function TabButton({ tab, label, activeTab, handleTabChange }: ITabButton) {
	return (
		<button
			onClick={() => handleTabChange(tab)}
			className={`
				flex-1 px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer
				${activeTab === tab ? 'text-purple-400' : 'text-white/60 hover:text-white/80'}
			`}
		>
			{label}
		</button>
	);
}

export default TabButton;
