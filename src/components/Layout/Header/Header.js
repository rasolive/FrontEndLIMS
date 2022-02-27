import React from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { ArrowLeft } from "react-feather";
import { FilterIcon } from "../Icon/Icon";
import { InputText, Select } from "../Input/Input";
import Button from "../Button/Button";
import Tooltip from "../Tooltip/Tooltip";

const Container = styled.div`
	display: flex;
	justify-content: space-between;
	margin-bottom: 15px;
	width: 100%;
`;

const LeftPanel = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 50%;
`;
const RightPanel = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	width: 50%;
`;

const HeaderButton = styled(Button)`
	margin-top: 70px;
	margin-left: 15px;
	text-align: center;
	line-height: 50%;
	position: relative;
	margin-bottom: 5px;
	justify-content: center;
	&:hover ${Tooltip} {
		visibility: visible;
	}
`;

const HeaderButtonG = styled(Button)`
	margin-left: 15px;
	text-align: center;
	line-height: 50%;
	position: relative;
	margin-bottom: 5px;
	justify-content: center;
	&:hover ${Tooltip} {
		visibility: visible;
	}
	background-color: #79ec7d;
	:hover {
		background-color: #6ed371;
	}
`;

const Title = styled.div`
	margin-top: 70px;
	font-family: Poppins;
	font-style: normal;
	font-weight: bold;
	font-size: 1.3rem;
	line-height: 30px;
	align-self: center;
`;

const Return = styled(ArrowLeft)`
	margin-top: 70px;
	color: #888888;
	margin-right: 10px;

	:hover {
		cursor: pointer;
		color: #626262;
	}
`;

const Search = styled(InputText)`
	width: 50%;
	margin: 5px 5px 0px 5px;
`;

function Header(props) {
	const handleReturnButton = () => {
		props.history.goBack();
	};

	return (
		<Container>
			<LeftPanel>
				{props.showReturnButton && (
					<Return onClick={handleReturnButton} />
				)}
				<Title>{props.title}</Title>
			</LeftPanel>

			<RightPanel>
				{props.showSearchButton && (
					<Search
						type="text"
						id="search"
						placeholder="Buscar"
						defaultValue={""}
					/>
				)}
				{props.showNewImportButton && (
					<HeaderButtonG
						type="button"
						onClick={props.handleImportButton}
					>
						Importar
					</HeaderButtonG>
				)}
				{props.showNewRegisterButton && (
					<HeaderButton
						type="button"
						onClick={props.handleNewRegisterButtonClick}
					>
						Cadastrar
					</HeaderButton>
				)}
				{props.showFilterButton && (
					<Button
						type="button"
						title="Abrir filtro"
						small
						secondary
						onClick={props.handleFilterButtonClick}
					>
						<FilterIcon />
					</Button>
				)}
			</RightPanel>
		</Container>
	);
}

export default withRouter(Header);