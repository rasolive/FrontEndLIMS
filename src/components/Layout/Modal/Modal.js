import React from "react";
import styled from "styled-components";

import Button from "../Button/Button";
import ButtonGroup from "../ButtonGroup/ButtonGroup";

export default function Modal(props) {
	const Dialog = styled.dialog`
		position: absolute;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		max-width: 50%;
		display: ${props.showModal ? "flex" : "none"};
		background: #ffffff;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
		border-radius: 20px;
		border: 0;
		z-index: 2;
	`;

	const Title = styled.span`
		font-family: Poppins;
		font-style: normal;
		font-weight: 600;
		font-size: 16px;
		line-height: 24px;
		text-align: center;
		color: #282828;
		margin: 10px;
	`;

	const Subtitle = styled.span`
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		font-family: Poppins;
		font-style: normal;
		font-weight: 500;
		font-size: 12px;
		line-height: 18px;
		text-align: center;
		color: #888888;
		margin-bottom: 20px;
	`;

	return (
		<Dialog className="dialog">
			<Title>{props.modalTitle}</Title>
			<Subtitle>{props.modalBody}</Subtitle>

			<ButtonGroup>
				{!props.hideFirstButton && (
					<Button
						type="button"
						onClick={props.handleToggleModal}
						cancel
					>
						Cancelar
					</Button>
				)}
				{!props.hideSecondButton && (
					<Button
						type="button"
						onClick={props.handleConfirmModalButton}
						danger
					>
						Excluir
					</Button>
				)}
			</ButtonGroup>
		</Dialog>
	);
}
