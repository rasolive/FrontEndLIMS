import React, { useState, useContext, useCallback } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { NavLink as Link } from 'react-router-dom'
import { toast } from "react-toastify";
import styled, { css } from "styled-components";
import Card from "../../Layout/Card/Card";
import Header from "../../Layout/Header/Header";
import FieldSet from "../../Layout/FieldSet/FieldSet";
import Form from "../../Layout/Form/Form";
import FormGroup from "../../Layout/FormGroup/FormGroup";
import Label from "../../Layout/Label/Label";
import { InputText, TextArea } from "../../Layout/Input/Input";
import useDynamicForm from "../../../hooks/useDynamicForm";
import Button from "../../Layout/Button/Button";
import ButtonGroup from "../../Layout/ButtonGroup/ButtonGroup";
import { BackendLIMSAxios } from "../../../utils/axiosInstances";
import Hr from "../../Layout/Hr/Hr";
import '../../Login/Login.css'
import LinkedinIcon from "../../Layout/Icon/linkedin.png"

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
    
	max-width: 700px;
    margin: auto;
	overflow: hidden;
	width: 70%;
	justify-content: center;
	align-items: center;
	margin-top: 80px;
`;

const LabelHeader = styled(Label)`
        font-size: 16px;
        color: #010606;

`;

const StyledHr = styled(Hr)`
background: #ff9977;
	width: 45%;
	border: 0;
	height: 1px;
`;

const Hr2 = styled(Hr)`
background: #ffffff;
	width: 100%;
	border: 0;
	height: 1px;
`;

export const NavLink = styled(Link)`
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


function ContactPage(props) {
	const { fields, setFields, handleInputChange } = useDynamicForm();
	const [loading, setLoading] = useState(false);

	const handleFormSubmit = async () => {
		const body = Object.assign({}, fields)

		const validate = [fields.name, fields.email, fields.msg];

		if (!validate.every(item => Boolean(item) === true)) {
			toast.error("Preencha os campos obrigatórios \"Nome\", \"E-mail\", e \"Mensagem\"", {
				closeOnClick: true,
				autoClose: 7000,
			});
			return;
		}
		else {
			if (ValidateEmail(fields.email) === false) {
				toast.error("Digite um E-mail inválido",
					{ closeOnClick: true, autoClose: 7000, });
			}

			else {
				const response = await BackendLIMSAxios.post(`contato`, body);

				setLoading(false);

				const status = response.status || {};

				if (status === 200) {
					toast.success(`Formulário enviado com sucesso com sucesso`);
					props.history.push(`/`);

				}


			}
		}


	};

	const handleTextAreaChange = (e) => {
		const id = e.target.id;
		const tx = document.getElementById(id);

		tx.setAttribute(
			"style",
			"min-height: 79px; height:" +
			tx.scrollHeight +
			"px;overflow-y:hidden; flex: none;"
		);

		handleInputChange(e);
	};

	function ValidateEmail(input) {

		var validRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		if (input.match(validRegex)) {

			return true;

		} else {

			return false;

		}

	}


	return (
		<>
			<StyledCard>
				<FieldSet style={{
					flexWrap: "wrap",
					textAlign: "center",
				}}>
					<FormGroup>
						<LabelHeader>Entre em contato com o Administrador</LabelHeader>
					</FormGroup>
				</FieldSet>
				<FieldSet style={{
					flexWrap: "wrap",
					textAlign: "center",
				}}>
					<FormGroup>
						<InputText
							style={{
								minWidth: '200px'
							}}
							type="text"
							id="name"
							placeholder="Seu nome"
							onChange={handleInputChange}
						/>
					</FormGroup>

					<FormGroup>
						<FieldSet style={{
							flexWrap: "wrap",
							alignItems: "center",
						}}>
							<InputText
								style={{
									minWidth: '200px'
								}}
								type="email"
								id="email"
								placeholder="Seu E-mail"
								onChange={handleInputChange}
							/>
						</FieldSet>
					</FormGroup>
				</FieldSet>
				<FieldSet style={{
					flexWrap: "wrap",
					textAlign: "center",
				}}>
					<FormGroup>
						<Label htmlFor="msg">Sua mensagem</Label>
						<FieldSet style={{
							flexWrap: "wrap",
							alignItems: "center",
						}}>
							<TextArea
								style={{ minHeight: 79 }}
								type="text"
								id="msg"
								defaultValue={fields.msg}
								onChange={handleTextAreaChange}
								onMouseEnter={handleTextAreaChange}
							/>
						</FieldSet>
					</FormGroup>
				</FieldSet>

				<ButtonGroup>
					<Button
						type="button"
						success
						onClick={handleFormSubmit}
					>
						Enviar
					</Button>

				</ButtonGroup>
				<Hr2 />
				<Hr2 />
				<StyledHr />
				Ou
				<StyledHr />
				<Hr2 />
				<a href="mailto:rasolive@hotmail.com?subject=Formulário de Contato APP LIMS">Envie um E-mail </a>
				<Hr2 />
				<a href="https://www.linkedin.com/in/rasolive" target="_blank"><img src={LinkedinIcon} width="20px" align="center" />Ricardo Oliveira</a>


			</StyledCard>
		</>

	);
}

export default ContactPage;
