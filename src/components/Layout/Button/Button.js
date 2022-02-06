import styled, { css } from "styled-components";

const defaultProps = `
    :disabled {
        background: #dddddd;
        cursor: not-allowed;
		pointer-events: none;
    }
`;

export default styled.button`
	background-color: ${(props) => props.theme.primary};
	border-radius: 10px;
	border: 0;
	display: inline-block;
	cursor: pointer;
	line-height: 50%;
	color: ${(props) => props.theme.secondary};
	font-family: Poppins;
	font-size: 1rem;
	text-decoration: none;
	width: ${(props) => (props.small ? "40px" : props.large ? "100%" : "95px")};
	height: 40px;
	margin: 5px 5px 5px 5px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);

	:hover {
		background: ${(props) => props.theme.primaryDark};
	}
	${defaultProps};

	${(props) =>
		props.primary &&
		css`
			background: ${(props) => props.theme.primary};
			color: ${(props) => props.theme.secondary};

			:hover {
				background: ${(props) => props.theme.primaryDark};
			}
			${defaultProps};
		`};

	${(props) =>
		props.secondary &&
		css`
			background: ${(props) => props.theme.secondary};
			color: ${(props) => props.theme.primary};

			:hover {
				background: ${(props) => props.theme.secondaryDark};
			}
			${defaultProps};
		`};

	${(props) =>
		props.cancel &&
		css`
			color: #888888;
			background: #efefef;

			:hover {
				background: #c9c9c9;
			}
			${defaultProps};
		`};

	${(props) =>
		props.danger &&
		css`
			background: #dc3545;

			:hover {
				background: #a71d2a;
			}
			${defaultProps};
		`}

	${(props) =>
		props.success &&
		css`
			background: #23c85d;

			:hover {
				background: #18873f;
			}
			${defaultProps};
		`}

	${(props) =>
		props.redirect && 
		css`
			background: #ffffff;
			color: #000000;
			border: 1px solid black;
			padding: 10px;
			width: 90%;
			height: 60px;
			align-items: center;
			text-align: left;
			display: flex;
			justify-content: space-between;
			margin-left: auto;
			margin-right: auto;
			margin-top: 15px;
			:hover {
				background: #cccccc;
			}		
			${defaultProps};
		`}

	${(props) =>
		props.info &&
		css`
			background: #3c7bff;

			:hover {
				background: #004def;
			}
			${defaultProps};
		`}

    :focus {
		outline: none;
	}
`;
