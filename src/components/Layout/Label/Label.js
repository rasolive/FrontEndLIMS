import styled from "styled-components";

export default styled.label.attrs((props) => ({
	style: {
		margin: props.margin,
	},
}))`
	font-family: Poppins;
	font-style: normal;
	font-weight: 600;
	font-size: 11px;
	line-height: 15px;
	margin-bottom: 3px;
	color: #888888;
`;
