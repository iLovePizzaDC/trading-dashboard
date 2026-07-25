export type DropdownItem = {
	key: string;
	label: string;
	icon?: React.ReactNode;
	active?: boolean;
	onClick: () => void;
};
