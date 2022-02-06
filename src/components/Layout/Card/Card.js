import styled from "styled-components";

export default styled.div`
	display: flex;
	flex-flow: ${props => props.flexFlow || "row wrap"};
	justify-content: ${props => props.justifyContent};
	background: #ffffff;
	border-radius: 10px;
	box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.25);
	margin: 10px;
	padding: 30px;
`;
