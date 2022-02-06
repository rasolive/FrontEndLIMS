import React from "react";
import styled from "styled-components";

function notFoundPage() {
	const Container = styled.div`
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
	`;

	return (
		<Container>
			<h1>Ops!</h1>
			<h2>Página não encontrada...</h2>
		</Container>
	);
}

export default notFoundPage;
