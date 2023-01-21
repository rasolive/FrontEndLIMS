import React from "react";
import styled, { css } from "styled-components";
import { NavLink as Link } from 'react-router-dom';
import Header from "../../Layout/Header/Header"
import Card from "../../Layout/Card/Card";

function AboutPage() {
	const Container = styled.div`
	${(props) =>
			props.showModal &&
			css`
			opacity: ${(props) => (props.showModal ? "0.4" : "none")};
			cursor: ${(props) => props.showModal && "not-allowed"};
			pointer-events: ${(props) => props.showModal && "none"};
		`};
`;

	const StyledCard = styled(Card)`
	max-width: 900px;
	margin: auto;
	z-index: 0;
	overflow: hidden;
	width: 80%;
	justify-content: center;
	align-items: center;
	margin-bottom: 1%;
`;

const NavLink = styled(Link)`
    color: black;
    font-size: 14px;
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 0 1rem;
    height: 100%;
    cursor: pointer;

    &.active {
        color: #15cdfc;
    }

`


	return (
		<Container>
			<Header
				title="Sobre a Página"

			/>
			<StyledCard>

				<h3>Contexto</h3>
				<p>O sistema proposto nessa página trata-se de um sistema LIMS (laboratory information management system) 
				e tem como objetivo realizar
					o gerenciamento do fluxo de cadastro, recebimento e avaliação de
					matérias primas em um laboratório de empresa química. </p>


				<h3>Público alvo</h3>
				<p>O sistema tem como objetivo alcançar trabalhadores de um laboratório
					químico com diferentes responsabilidades, porem com o mesmo objetivo,
					disponibilizar matérias primas aptas para consumo em produtos cosméticos
					ou alimentícios. O sistema conta com seis perfis, o “visitante” que pode
					visualizar todos dados, mas sem poder realizar qualquer tipo de edição,
					o “administrador” que possui acesso a todas as funcionalidades, além de
					realizar o controle de usuários e configurações, o “analista de cadastro”
					que realizará cadastro de fornecedores, materiais e lotes de materiais,
					o “gerente de cadastro” que além das funcionalidades do analista de cadastro
					pode realizar modificações no cadastro de lotes, o “analista de qualidade”
					que realizará cadastro de métodos de análises, especificações de materiais
					e efetuará análise dos materiais e por fim o “gerente de qualidade” que além
					das funcionalidades do analista de qualidade tem o poder de editar resultados
					de análises.</p>

				<h3>Como acecssar</h3>
				<p>Para acessar <a href="/register">faça um cadastro </a>ou utilize sua conta Google, você receberá o perfil 
				de visitante e conseguirá visualizar a maioria dos dados cadastrados, para testar 
				todas funcionalidades e perfis <a href="/contato">entre em contato com o administrador do sistema.</a></p>
			</StyledCard>
		</Container>
	);
}

export default AboutPage;
