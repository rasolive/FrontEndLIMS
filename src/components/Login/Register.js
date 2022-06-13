import React, { useState, useEffect} from "react";
import { toast } from "react-toastify";
import { BackendLIMSAxios } from "../../utils/axiosInstances";
import useDynamicForm from "../../hooks/useDynamicForm";
// import { AuthContext } from "../../../../../context/AuthContext";
import Header from "../Layout/Header/Header";
import Modal from "../Layout/Modal/Modal";
import Form from "../Layout/Form/Form";
import Card from "../Layout/Card/Card";
import FormGroup from "../Layout/FormGroup/FormGroup";
import Label from "../Layout/Label/Label";
import { InputText, Checkbox} from "../Layout/Input/Input";
import FieldSet from "../Layout/FieldSet/FieldSet";
import styled, { css } from "styled-components";
import Button from "../Layout/Button/Button";
import ButtonGroup from "../Layout/ButtonGroup/ButtonGroup";
import Loading from "../Layout/Loading/Loading";
import { UpIcon, DownIcon } from "../Layout/Icon/Icon";
import Hr from "../Layout/Hr/Hr";
//import { header } from "../../../utils/functions";
import AddListasTable from "../Configuracoes/Usuarios/AddListasTable";



const StyledCard = styled(Card)`
	max-width: 500px;
	margin: auto;
	z-index: 0;
	overflow: hidden;
	//position: relative;
	width: 80%;
	justify-content: center;
	align-items: center;
	margin-bottom: 1%;
`;

const Group = styled.div`
	flex-direction: row;
	display: flex;
`;

const Collapse = styled.div`
	flex-direction: column;
	overflow: hidden;
	transition: max-height 0.2s ease-in-out;
	height: auto;
	/* max-height: 800px; */
	width: 100%;
	&.collapsed {
		max-height: 0;
	}
`;

const SmallButton = styled(Button)`
	height: 25px;
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



const Container = styled.div`
	${(props) =>
		props.showModal &&
		css`
			opacity: ${(props) => (props.showModal ? "0.4" : "none")};
			cursor: ${(props) => props.showModal && "not-allowed"};
			pointer-events: ${(props) => props.showModal && "none"};
		`};
`;


function RegisterPage(props) {
	const page = `auth`;
	const item = `Usuario`

	const { fields, setFields, handleInputChange } = useDynamicForm();
	const [loading, setLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [token, setToken] = useState(sessionStorage.getItem("token"));
	const [header, setHeader] = useState({headers: {'authorization': `${token}`}});
	const [table, setTable] = useState([]);
	const [list, setList] = useState([]);
	const [checked, setChecked] = useState(false);


	const itemId = props.match.params.id;
	const newItem = itemId === "new";

    	
	const createItem = async () => {

		const body = Object.assign({}, fields)

		const newUser = await BackendLIMSAxios.post(`${page}/findOne`,body,header);

		//setLoading(false);

		if (newUser.data.email === body.email){ 
			setLoading(false);
			toast.error("Usuário já cadastrado, altere o E-mail",
			{ closeOnClick: true, autoClose: 6000 });

		}
		else{ table.map((dt) => {
			return delete dt.id;
		});

		if (body.password) {body.validPass = true}		

		const response = await BackendLIMSAxios.post(`${page}/createUser`,body,header);

		setLoading(false);

		const status = response.status || {};
		const id = response.data.message._id;
	
		if (status === 200) {
			toast.success(`${item} Cadastrado com sucesso`, {closeOnClick: true, autoClose: 6000});
			props.history.push(`/`);

		}}
		

		
	};

	const cancelRegister = async () => {
			props.history.push(`/`);
	};


	const handleFormSubmit = (e) => {
		e.preventDefault();
		setLoading(false);

		

			const validate = [fields.name, fields.email, fields.password, fields.repeatPassword];	

			if ( !validate.every(item => Boolean(item) === true) )  {
				toast.error("Preencha os campos obrigatórios \"Nome\", \"E-mail\", \"Senha\" e \"Confirme a senha\"", {
					closeOnClick: true,
					autoClose: 7000,});
				return;
			}
			else{
				if (fields.password !== fields.repeatPassword) {

					toast.error("As senhas não conferem",
					 {closeOnClick: true, autoClose: 7000,});}
				else{
					createItem();
		}
			
		}} 
		
	;

	
	const handleToggleModal = () => {
		setShowModal(!showModal);
	};


	const handleConfirmModalButton = () => {
		setShowModal(false);
		setLoading(true);
		cancelRegister();
	};


	

		
	return (
		<>
			<Modal
				showModal={showModal}
				modalTitle="Tem certeza que deseja excluir os dados?"
				modalBody="Caso continue, as informações preenchidas serão excluídas!"
				handleToggleModal={handleToggleModal}
				handleConfirmModalButton={handleConfirmModalButton}
				item = {item}
			/>
			<Container showModal={showModal}>
				<Header
					title="Cadastro de Usuários"
					showReturnButton
				/>
				<StyledCard>
					<Loading loading={loading} absolute />
					<Form flexFlow="row wrap">
						<FieldSet
						style={{
							flexWrap: "wrap",
							alignItems: "center",
						}}>
							
							<FormGroup>
								<Label htmlFor="name">Nome:</Label>
								<InputText
									type="text"
									id="name"
									defaultValue={fields.name}
									onChange={handleInputChange}
								/>
							</FormGroup>

							
						</FieldSet>
						<FieldSet
						style={{
							flexWrap: "wrap",
							alignItems: "center",
						}}>
							<FormGroup>
								<Label htmlFor="email">E-Mail:</Label>
								<InputText
									type="text"
									id="email"
									defaultValue={fields.email}
									onChange={handleInputChange}
									/>
							</FormGroup>
						</FieldSet>

						<FieldSet
						style={{
							flexWrap: "wrap",
							alignItems: "center",
						}}>
							<FormGroup>
								<Label htmlFor="password">Senha:</Label>
								<InputText
									type="password"
									id="password"
									placeholder="**************"
									onChange={handleInputChange}
								/>
							</FormGroup>
						</FieldSet>
						<FieldSet
						style={{
							flexWrap: "wrap",
							alignItems: "center",
						}}>
							<FormGroup>
								<Label htmlFor="repeatPassword">Confirme a Senha:</Label>
								<InputText
									type="password"
									id="repeatPassword"
									placeholder="**************"
									onChange={handleInputChange}
								/>
							</FormGroup>
						</FieldSet>

						<FieldSet
						style={{
							flexWrap: "wrap",
							alignItems: "center",
						}}>
							
							<FormGroup>
								<Label htmlFor="showPass">Mostrar senha:
								<Checkbox
									type= 'checkbox'
									id="showPass"
									onClick={()=>{setChecked(!checked);
										if(checked === true){document.getElementById('password').setAttribute('type', 'password')}
									else{document.getElementById('password').setAttribute('type', 'text')}
								
									if(checked === true){document.getElementById('repeatPassword').setAttribute('type', 'password')}
									else{document.getElementById('repeatPassword').setAttribute('type', 'text')}
								
								}}
									checked= {checked}
								/></Label>
								
								
							</FormGroup>
						</FieldSet>
						<FieldSet
						style={{
							flexWrap: "wrap",
							alignItems: "center",
						}}>
							<FormGroup>
								<Label htmlFor="perfil">Perfil:</Label>
								<InputText
									type="text"
									id="perfil"
									defaultValue="Visitante"
									onChange={handleInputChange}
									disabled
								/>
							</FormGroup>
						</FieldSet>
						<FieldSet
						style={{
							flexWrap: "wrap",
							alignItems: "center",
						}}>
							<FormGroup>
								<Label>O Perfil "Visitante" será atribuído à sua conta, para realizar alteração entre em contato com o administrtador do sistema:</Label>
								
							</FormGroup>
						</FieldSet>
						
						
						<FieldSet justifyContent="flex-end">
							<ButtonGroup>
								{!newItem && (
									<Button
										type="button"
										onClick={handleToggleModal}
										danger
									>
										Cancelar
									</Button>
								)}
								<Button
									type="button"
									success
									onClick={handleFormSubmit}
								>
									Enviar
								</Button>
								{/* <Button
									type="button"
									success
									onClick={handleDownload}
								>
									Download
								</Button> */}
							</ButtonGroup>
						</FieldSet>
					</Form>
				</StyledCard>
			</Container>
		</>
	);
}

export default RegisterPage;
