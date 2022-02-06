import styled, { css } from "styled-components";

export default styled.span`
	visibility: hidden;
	background-color: #282828;
	color: white;
	text-align: center;
	padding: 5px 12px;
	border-radius: 5px;
	position: absolute;
	z-index: 1000;
	font-family: Poppins;
	font-style: normal;
	font-weight: 500;
	font-size: 10px;
	line-height: 15px;
	display: flex;
	justify-content: center;

	${(props) =>
		props.right &&
		css`
			left: 105%;
			&:after {
				content: " ";
				position: absolute;
				top: 50%;
				right: 100%;
				margin-top: -5px;
				border-width: 5px;
				border-style: solid;
				border-color: transparent #282828 transparent transparent;
			}
		`};

	${(props) =>
		props.left &&
		css`
			right: 105%;
			&:after {
				content: " ";
				position: absolute;
				top: 50%;
				right: 100%;
				margin-top: -5px;
				border-width: 5px;
				border-style: solid;
				border-color: transparent #282828 transparent transparent;
			}
		`};

	${(props) =>
		props.top &&
		css`
			bottom: 120%;
			&:after {
				content: " ";
				position: absolute;
				top: 100%;
				left: 50%;
				margin-left: -5px;
				border-width: 5px;
				border-style: solid;
				border-color: #282828 transparent transparent transparent;
			}
		`};

	${(props) =>
		props.bottom &&
		css`
			top: 120%;
			&:after {
				content: " ";
				position: absolute;
				bottom: 100%;
				left: 50%;
				margin-left: -5px;
				border-width: 5px;
				border-style: solid;
				border-color: transparent transparent #282828 transparent;
			}
		`};
`;
