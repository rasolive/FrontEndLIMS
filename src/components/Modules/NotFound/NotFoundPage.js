import React from "react";
import styled from "styled-components";

function notFoundPage() {
	const Container = styled.div`
		margin-top: clamp(70px, 15%, 200px);;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
	`;

	return (
		<Container>
			<h1>Aguarde!</h1>
			<h2>Esta página está em Construção.........</h2>
		</Container>
	);
}

export default notFoundPage;
