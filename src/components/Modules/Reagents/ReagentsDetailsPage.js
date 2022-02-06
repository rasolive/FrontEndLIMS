import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { BackendLIMSAxios } from "../../../utils/axiosInstances";
import useDynamicForm from "../../../hooks/useDynamicForm";
// import { AuthContext } from "../../../../../context/AuthContext";
import Header from "../../Layout/Header/Header";
import Modal from "../../Layout/Modal/Modal";
import Form from "../../Layout/Form/Form";
import Card from "../../Layout/Card/Card";
import FormGroup from "../../Layout/FormGroup/FormGroup";
import Label from "../../Layout/Label/Label";
import { InputText, Select, InputNumber } from "../../Layout/Input/Input";
import FieldSet from "../../Layout/FieldSet/FieldSet";
import styled, { css } from "styled-components";
import Button from "../../Layout/Button/Button";
import ButtonGroup from "../../Layout/ButtonGroup/ButtonGroup";
import Loading from "../../Layout/Loading/Loading";



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
	max-width: min-content;
	margin: auto;
	z-index: 0;
	overflow: hidden;
	position: relative;
	width: 100%;
	justify-content: center;
	align-items: center;
`;

function ReagentsDetailsPage(props) {
	const { fields, setFields, handleInputChange } = useDynamicForm();
	const [loading, setLoading] = useState(false);
	// const { session } = useContext(AuthContext);
	const [showModal, setShowModal] = useState(false);
	const [showSpec, setShowSpec] = useState(true);
	const [showEnvironmentalData, setShowEnvironmentalData] = useState(true);

	const reagentId = props.match.params.id;
	const newReagent = reagentId === "new";

		useEffect(() => {

		async function getReagent() {
			const response = await BackendLIMSAxios.get(
				`reagents/${reagentId}`
			);
			
			setFields(response.data || {});
	    	setLoading(false);
		}



		if (!newReagent) {
			setLoading(true);
			getReagent();
		}
	}, [reagentId, newReagent, setFields]);

	

	const createReagent = async () => {
		const body = Object.assign({}, fields)

		body.user = "Usuário de Criação" //session && session.email;

		const response = await BackendLIMSAxios.post("reagents",body);

		setLoading(false);

		const status = response.status || {};
		if (status === 200) {
			toast.success("Reagente Criado com sucesso");
			props.history.push("/db/reagents");
		}
	};

	const updateReagent = async () => {
		const body = Object.assign({}, fields)

		body.user = "Usuário de Alteração" //session && session.email;
		
		const response = await BackendLIMSAxios.put(`reagents/${reagentId}`, body);

		setLoading(false);

		const status = response.status || {};
		if (status === 200) {
			toast.success("Reagente Alterado com sucesso");
			props.history.push("/db/reagents");
		}
	};

	const deleteReagent = async () => {
		const body = {
			// token: session && session.token,
			cod_grupo: parseInt(fields.cod_grupo),
		};

        body.user = "Usuário de Alteração" //session && session.email;

		const response = await BackendLIMSAxios.delete(`reagents/${reagentId}`, body);
		const data = response.data || {};

		setLoading(false);
		if (data.success) {
			toast.success("Reagent Excluído com sucesso");
			props.history.push("/db/reagents");
		}
	};

	const handleFormSubmit = (e) => {
		e.preventDefault();
		setLoading(true);

		if (newReagent) {
			createReagent();
		} else {
			updateReagent();
		}
	};

	const handleToggleModal = () => {
		setShowModal(!showModal);
	};

	const handleConfirmModalButton = () => {
		setShowModal(false);
		setLoading(true);
		deleteReagent();
	};

	return (
		<>
			<Modal
				showModal={showModal}
				modalTitle="Tem certeza que deseja excluir este item?"
				modalBody="Caso continue, essas informações serão perdidas!"
				handleToggleModal={handleToggleModal}
				handleConfirmModalButton={handleConfirmModalButton}
			/>
				<Container showModal={showModal}>
				<Header
					title="Cadastro de Matéria-Prima Vegetal"
					showReturnButton
				/>
				<StyledCard>
					<Loading loading={loading} absolute />
					<Form flexFlow="row wrap">
						<FieldSet>
							<FormGroup>
								<Label htmlFor="cod">Código do Reagente</Label>
								<FieldSet alignItems="center">
									<InputNumber
										type="number"
										id="cod"
										defaultValue={fields.cod}
										onChange={handleInputChange}
									/>
								</FieldSet>
							</FormGroup>
							<FormGroup>
								<Label htmlFor="nome_mp">Nome do Reagente</Label>
								<InputText
									type="text"
									id="name"
									defaultValue={fields.name}
									onChange={handleInputChange}
								/>
							</FormGroup>
						</FieldSet>
						<FieldSet>
							<FormGroup>
								<Label htmlFor="createdBy">
									Criado Por
								</Label>
								<InputText
									type="text"
									id="createdBy"
									defaultValue={fields.createdBy}
									onChange={handleInputChange}
									disabled
								/>
							</FormGroup>
                            <FormGroup>
								<Label htmlFor="updatedBy">
									Atualizado Por
								</Label>
								<InputText
									type="text"
									id="updatedBy"
									defaultValue={fields.updatedBy}
									onChange={handleInputChange}
									disabled
								/>
							</FormGroup>
						</FieldSet>
						
						<FieldSet>
							<FormGroup>
								<Label htmlFor="aparencia">
									Aparência
								</Label>
								<Select
									id="aparencia"
									onChange={handleInputChange}
									value={fields.aparencia}
								>
									<option value="">Selecione</option>
									<option value="Sólido">Sólido</option>
									<option value="Liquido">Liquido</option>
									
								</Select>
							</FormGroup>
							
						</FieldSet>

						<FieldSet justifyContent="flex-end">
							<ButtonGroup>
								{!newReagent && (
									<Button
										type="button"
										onClick={handleToggleModal}
										danger
									>
										Excluir
									</Button>
								)}
								<Button
									type="button"
									success
									onClick={handleFormSubmit}
								>
									Salvar
								</Button>
							</ButtonGroup>
						</FieldSet>
					</Form>
				</StyledCard>
			</Container>
		</>
	);
}

export default ReagentsDetailsPage;
