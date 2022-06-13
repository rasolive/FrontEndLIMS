import styled from "styled-components";
import InputMask from "react-input-mask";

const defaultProps = `
	height: 40px;
	min-width: 200px;
	width: 100%;
	border: 1px solid transparent;
	background: #ffffff;
	border-radius: 10px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
	padding-left: 10px;
	box-sizing: border-box;
	-moz-box-sizing: border-box;
	-webkit-box-sizing: border-box;

	::placeholder {
		padding: 10px;
		color: #c4c4c4;
	}

	:disabled {
		background: #e8e8e8;
	}

	:focus {
		outline: none;
		border: 1px solid #ff9933;
	}
`;

const StyledInputMask = styled(InputMask)`
	${defaultProps};
	font-size: 12px;
`;

const InputText = styled.input`
	${defaultProps};
	font-size: 12px;
`;

const Checkbox = styled.input`
	align-items: center;	
	border: 1px solid transparent;
	background: #ffffff;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
	box-sizing: border-box;
`

const InputNumber = styled.input.attrs({
	type: "number",
})`
	${defaultProps};
	font-size: 12px;
	::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
`;

const Select = styled.select`
	${defaultProps};
`;

const TextArea = styled.textarea`
	${defaultProps};
	flex: 1;
	resize: none;
`;

const InputFile = styled.input`
	${defaultProps};
	display: none;
`;

export { InputText, Select, TextArea, InputFile, InputNumber, StyledInputMask, Checkbox };
