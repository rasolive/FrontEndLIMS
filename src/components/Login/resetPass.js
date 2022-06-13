import React, { useState, useEffect} from "react";
import { toast } from "react-toastify";
import { BackendLIMSAxios } from "../../utils/axiosInstances";
import useDynamicForm from "../../hooks/useDynamicForm";
// import { AuthContext } from "../../../../../context/AuthContext";
import Header from "../Layout/Header/Header";
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


function ResetPassPage(props) {
	const page = `users`;
	const item = `Usuarios`

	const { fields, setFields, handleInputChange } = useDynamicForm();
	const [loading, setLoading] = useState(false);
	const [files, setFiles] = useState([]);
	const [token, setToken] = useState(sessionStorage.getItem("token"));
	const [header, setHeader] = useState({headers: {'authorization': `${token}`}});
	const [table, setTable] = useState([]);
	const [list, setList] = useState([]);
	const [itemId, setItemId] = useState(null);
	const [checked, setChecked] = useState(false);


	useEffect(() => {
		
		async function isAuthenticated() {
			const response = await BackendLIMSAxios.get(`auth/isAuthenticated`, header);			

			if (response.data.isAuthenticated === "true"){
			  	
			}else {
				props.history.push(`/`);
			};

			setLoading(false);
		}
		
			isAuthenticated()		

	}, []);


	useEffect(() => {

		async function getItem() {
			const body = Object.assign({}, fields)

			const response = await BackendLIMSAxios.post(
				`${page}/findOne`,body, header);
	
			setFields(response.data || {});
			setItemId(response.data._id);
			setLoading(false);
		}

		getItem();
	
	}, []);

	
	
	const updateItem = async () => {
		const body = Object.assign({}, fields)

		body.validPass = true;

		const response = await BackendLIMSAxios.put(`${page}/${itemId}`, body, header);

		setLoading(false);
		
		const status = response.status || {};
	
		if (status === 200) {
			sessionStorage.removeItem('token')
			toast.success(`Senha alterada com sucesso, faça login novamente.`, 
			{closeOnClick: true, autoClose: 5000});
			props.history.push(`/`);
		}
		setLoading(false);	
	};

	

	const handleFormSubmit = (e) => {
		e.preventDefault();
		setLoading(false);

		const body = Object.assign({}, fields)

		console.log("body", body);

		const validate = [fields.password, fields.repeatPassword];

			if ( !validate.every(item => Boolean(item) === true) )  {
				toast.error("Preencha os campos obrigatórios \"Nova Senha\" e \"Valide a Nova Senha\"", {
					closeOnClick: true,
					autoClose: 7000,});
				return;
			}
			else{

				if (fields.password !== fields.repeatPassword) {

					toast.error("As senhas não conferem",
					 {closeOnClick: true, autoClose: 7000,});}
				else{
			updateItem();
		}
		}
		;

	};

	
	return (
		<>
		
			<Container>
				<Header
					title="Recadastro de senha"
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
								<Label htmlFor="email">E-Mail:</Label>
								<InputText
									type="text"
									id="email"
									defaultValue={fields.email}
									onChange={handleInputChange}
									disabled/>
							</FormGroup>

							
						</FieldSet>

						<FieldSet
						style={{
							flexWrap: "wrap",
							alignItems: "center",
						}}>
							

							<FormGroup>
								<Label htmlFor="password">Nova Senha:</Label>
								<InputText
									type="password"
									id="password"
									placeholder="Digite a nova senha"
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
								<Label htmlFor="repeatPassword">Valide a Nova Senha:</Label>
								<InputText
									type="password"
									id="repeatPassword"
									placeholder="Digite a nova senha novamente"
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
									
																	

						<FieldSet justifyContent="flex-end">
							<ButtonGroup>
								<Button
									type="button"
									success
									onClick={handleFormSubmit}
								>
									Enviar
								</Button>
							
							</ButtonGroup>
						</FieldSet>
					</Form>
				</StyledCard>
			</Container>
		</>
	);
}

export default ResetPassPage;
