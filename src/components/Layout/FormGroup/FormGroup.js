import styled from "styled-components";

export default styled.div`
	display: flex;
	flex-direction: column;
	margin: 10px;
	flex: 1;
	max-width: 100%;
	align-items: ${(props) => props.alignItems};
`;
