import styled from "styled-components";

export default styled.div`
	display: flex;
	width: 100%;
	max-width: 100%;
	justify-content: ${(props) => props.justifyContent};
	align-items: ${(props) => props.alignItems};
	flex-direction: row;
`;
