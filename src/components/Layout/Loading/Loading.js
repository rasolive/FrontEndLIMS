import React from "react";

import styled from "styled-components";

const Container = styled.div`
	background: #f3f5f9b8;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	cursor: not-allowed;
	position: ${(props) => props.absolute && "absolute"};
	z-index: 9999;
`;

function Loading(props) {
	const LoadingSvg = ({
		width = "40px",
		height = "40px",
		viewBox = "0 0 50 50",
		fill = "#FF6700",
	}) => (
		<svg
			width={width}
			height={height}
			fill={fill}
			viewBox={viewBox}
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fill="#FF6700"
				d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"
			>
				<animateTransform
					attributeType="xml"
					attributeName="transform"
					type="rotate"
					from="0 25 25"
					to="360 25 25"
					dur="0.6s"
					repeatCount="indefinite"
				/>
			</path>
		</svg>
	);

	return (
		<>
			{props.loading && (
				<Container absolute={props.absolute}>
					<LoadingSvg />
				</Container>
			)}
		</>
	);
}

export default Loading;
