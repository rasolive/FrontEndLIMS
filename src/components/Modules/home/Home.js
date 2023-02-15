import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "../../Layout/Button/Button";
import { BackendLIMSAxios } from "../../../utils/axiosInstances";
import {
	Layers,
	Truck,
	Package,
	Sliders,
	Search,
	BarChart2,
	Activity,
	Book
} from "react-feather";
import Card from "../../Layout/Card/Card";
import PermissionComponent from "../../PermissionComponent";

// const token = sessionStorage.getItem("token")

// const header = {
//     headers: {
//       'authorization': `${token}` 
//     }}

const Button2 = styled(Button)`
	margin-top: 70px;
`;
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
		transform: translate(3px, -3px);
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


const Return = styled.a`
	font-family: Poppins;
	font-style: normal;
	font-weight: 600;
	font-size: 14px;
	line-height: 21px;
	text-align: center;
	color: #888888;
	margin-top: 20px;

	vertical-align: center;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-self: center;
	align-items: center;

	:hover {
		cursor: pointer;
		color: #626262;
	}
`;


function Home(props, req) {
	const [loading, setLoading] = useState(false);
	const [token, setToken] = useState(sessionStorage.getItem("token"));
	const [header, setHeader] = useState({ headers: { 'authorization': `${token}` } });


	if(sessionStorage.getItem('load') === 'false'){    
        window.location.reload();
        sessionStorage.setItem('load', 'true')
    } 

	function handleModuleClick(module) {

		props.history.push(`/${module}`);
	}


	return (
		<>
			<Container>
				<Title>Selecione o Módulo</Title>
				<Cards>

					<PermissionComponent role={['S','V', 'AC', 'GC']}>
						<StyledCard
							onClick={() => handleModuleClick("db/fornecedores")}
						>
							<ModuleImg background="#7e86d6">
								<Truck size="32" />
							</ModuleImg>
							<Subtitle>Fornecedores</Subtitle>
						</StyledCard>
					</PermissionComponent>

					<PermissionComponent role={['S','V','AC', 'GC']}>
						<StyledCard
							onClick={() => handleModuleClick("db/materiais")}
						>
							<ModuleImg background="#30635f">
								<Package size="32" />
							</ModuleImg>
							<Subtitle>Materiais</Subtitle>
						</StyledCard>
					</PermissionComponent>

					<PermissionComponent role={['S','V', 'AQ', 'GQ', 'AC', 'GC']}>
						<StyledCard
							onClick={() => handleModuleClick("db/lotes")}
						>
							<ModuleImg background="#ff7d1a">
								<Layers size="32" />
							</ModuleImg>
							<Subtitle>Lotes</Subtitle>
						</StyledCard>
					</PermissionComponent>

					<PermissionComponent role={['S','V', 'AQ', 'GQ']}>
						<StyledCard
							onClick={() => handleModuleClick("db/analysisMethod")}
						>
							<ModuleImg background="#777766">
								<Book size="32" />
							</ModuleImg>
							<Subtitle>MA's</Subtitle>
						</StyledCard>
					</PermissionComponent>

					<PermissionComponent role={['S','V', 'AQ', 'GQ']}>
						<StyledCard onClick={() => handleModuleClick("db/analysis")}>
							<ModuleImg background="#8d5d6c">
								<Activity size="32" />
							</ModuleImg>
							<Subtitle>Análises</Subtitle>
						</StyledCard>
					</PermissionComponent>

					<PermissionComponent role={['S','V', 'AQ', 'GQ']}>
						<StyledCard onClick={() => handleModuleClick("db/specification")}>
							<ModuleImg background="#558888">
								<Sliders size="32" />
							</ModuleImg>
							<Subtitle>Especificação de Materiais</Subtitle>
						</StyledCard>
					</PermissionComponent>

					<PermissionComponent role={['S','V', 'AQ', 'GQ']}>
						<StyledCard onClick={() => handleModuleClick("db/qualitycontrol")}>
							<ModuleImg background="#E75656">
								<Search size="32" />
							</ModuleImg>
							<Subtitle>Controle de Qualidade</Subtitle>
						</StyledCard>
					</PermissionComponent>

					<PermissionComponent role={['S','V', 'V', 'AQ', 'GQ', 'AC', 'GC']}>
						<StyledCard onClick={() => handleModuleClick("db/Estatisticas")}>
							<ModuleImg background="#64D5A5">
								<BarChart2 size="32" />
							</ModuleImg>
							<Subtitle>Estatísticas do Sistema</Subtitle>
						</StyledCard>
					</PermissionComponent>


				</Cards>

			</Container>
		</>
	);
}

export default Home;
