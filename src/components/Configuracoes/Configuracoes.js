import React, { useState, useEffect} from "react";
import styled from "styled-components";
import { BackendLIMSAxios } from "../../utils/axiosInstances";
import {
	Layers,
    List,
    Package,
    Sliders,
    Users
    
} from "react-feather";
import Card from "../Layout/Card/Card";

// const token = sessionStorage.getItem("token")

// const header = {
//     headers: {
//       'authorization': `${token}` 
//     }}

const Container = styled.div`
	margin-top: clamp(70px, 15%, 200px);;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	//height: 100vh;
`;

const Cards = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	max-width: 70%;
	flex-wrap: wrap;
`;

const StyledCard = styled(Card)`
	flex-flow: column;
	padding: 1rem;
	justify-content: center;
	align-items: center;
	width: 150px;
	min-width: 150px;
	height: 180px;
	border-radius: 10px;
	box-shadow: 6px 6px 5px rgba(0, 0, 0, 0.25);
	margin: 15px 15px;
	transition: 0.2s;

	:hover {
		transition: 0.2s;
		transform: translate(-3px, -3px);
		box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.25);
		cursor: pointer;
	}
`;

const Title = styled.span`
	font-family: Poppins;
	font-style: normal;
	font-weight: 600;
	font-size: 20px;
	line-height: 30px;
	text-align: center;
	color: #282828;
	margin-bottom: 20px;
`;

const Subtitle = styled.span`
	font-family: Poppins;
	font-style: normal;
	font-weight: 600;
	font-size: 14px;
	line-height: 21px;
	text-align: center;
	color: #000000;
`;

const ModuleImg = styled.div`
	background: ${(props) => props.background};
	color: ${(props) => props.theme.secondary};
	height: 60px;
	width: 60px;
	border-radius: 50%;
	text-align: center;
	vertical-align: center;
	line-height: 60px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-self: center;
	align-items: center;
	margin: 20px;
`;


function Configuracoes(props, req) {
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(sessionStorage.getItem("token"));
	const [header, setHeader] = useState({headers: {'authorization': `${token}`}});

    function handleModuleClick(module) {
		
		props.history.push(`/${module}`);
    }
     
    return (
  
           <>
        <Container>
			<Title>Selecione o Módulo</Title>
			<Cards>
				
					<StyledCard
						onClick={() => handleModuleClick("db/users")}
					>
						<ModuleImg background="#ff7d1a">
							<Users size="32" />
						</ModuleImg>
						<Subtitle>Usuários</Subtitle>
					</StyledCard>

					{/* <StyledCard
						onClick={() => handleModuleClick("db/permissions")}
					>
						<ModuleImg background="#ff7d1a">
							<Users size="32" />
						</ModuleImg>
						<Subtitle>Permissões</Subtitle>
					</StyledCard> */}
			
				<StyledCard
					onClick={() => handleModuleClick("db/listas")}
				>
					<ModuleImg background="#458e88">
						<List size="32" />
					</ModuleImg>
					<Subtitle>Listas</Subtitle>
				</StyledCard>
				
			</Cards>
		
		</Container>
     </>
    
    );
}

export default Configuracoes;
