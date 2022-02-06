import {
	Trash,
	Plus,
	Copy,
	Wind,
	ChevronDown,
	ChevronUp,
	ChevronLeft,
	ChevronRight,
	Filter,
	ArrowLeft,
	ArrowRight,
	Info,
	Check,
	X,
	DollarSign,
	Clock,
	Percent,
	Calendar,
	Minus,
	CornerRightDown,
	HelpCircle,
	Camera,
	Search,
} from "react-feather";
import styled from "styled-components";

const defaultProps = `
		flex-direction: row;
		justify-content: center;
		align-self: center;
		align-items: center;
		width: 100%;
		text-align: center;
	`;

const PlusIcon = styled(Plus)`
	${defaultProps};
`;

const TrashIcon = styled(Trash)`
	${defaultProps};
`;

const CopyIcon = styled(Copy)`
	${defaultProps};
`;

const HairIcon = styled(Wind)`
	${defaultProps};
	transform: rotate(90deg);
`;

const UpIcon = styled(ChevronUp)`
	${defaultProps};
`;

const DownIcon = styled(ChevronDown)`
	${defaultProps};
`;

const LeftIcon = styled(ChevronLeft)`
	${defaultProps};
`;

const RightIcon = styled(ChevronRight)`
	${defaultProps};
`;

const FilterIcon = styled(Filter)`
	${defaultProps};
`;

const ArrowLeftIcon = styled(ArrowLeft)`
	${defaultProps};
`;

const ArrowRightIcon = styled(ArrowRight)`
	${defaultProps};
`;

const InfoIcon = styled(Info)`
	${defaultProps};
`;

const CheckIcon = styled(Check)`
	${defaultProps};
`;

const XIcon = styled(X)`
	${defaultProps};
`;

const DollarSignIcon = styled(DollarSign)`
	${defaultProps};
`;

const ClockIcon = styled(Clock)`
	${defaultProps};
`;

const PercentIcon = styled(Percent)`
	${defaultProps};
`;

const CalendarIcon = styled(Calendar)`
	${defaultProps};
`;

const MinusIcon = styled(Minus)`
	${defaultProps};
`;

const CornerRightDownIcon = styled(CornerRightDown)`
	${defaultProps};
`;

const HelpCircleIcon = styled(HelpCircle)`
	${defaultProps};
`;

const CameraIcon = styled(Camera)`
	${defaultProps};
`;

const SearchIcon = styled(Search)`
	${defaultProps};
`;

export {
	PlusIcon,
	TrashIcon,
	CopyIcon,
	HairIcon,
	UpIcon,
	DownIcon,
	LeftIcon,
	RightIcon,
	ArrowLeftIcon,
	ArrowRightIcon,
	FilterIcon,
	InfoIcon,
	CheckIcon,
	XIcon,
	DollarSignIcon,
	ClockIcon,
	PercentIcon,
	CalendarIcon,
	MinusIcon,
	CornerRightDownIcon,
	HelpCircleIcon,
	CameraIcon,
	SearchIcon,
};
