import React, { useState, useEffect} from "react";
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
import { InputText, Select, InputNumber, Checkbox} from "../../Layout/Input/Input";
import FieldSet from "../../Layout/FieldSet/FieldSet";
import styled, { css } from "styled-components";
import Button from "../../Layout/Button/Button";
import ButtonGroup from "../../Layout/ButtonGroup/ButtonGroup";
import Loading from "../../Layout/Loading/Loading";
import { UpIcon, DownIcon } from "../../Layout/Icon/Icon";
import Hr from "../../Layout/Hr/Hr";
//import { header } from "../../../utils/functions";
import AddListasTable from "./AddListasTable";



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


function UsuariosDetailsPage(props) {
	const page = `users`;
	const gcpPatch = `prd/anexos/${page}`
	const item = `Usuario`

	const { fields, setFields, handleInputChange } = useDynamicForm();
	const [loading, setLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const [showDocuments, setShowDocuments] = useState(true);
	const [files, setFiles] = useState([]);
	const [fileName, setFileName] = useState([]);
	const [image, setImage] = useState(null);
	const [token, setToken] = useState(sessionStorage.getItem("token"));
	const [header, setHeader] = useState({headers: {'authorization': `${token}`}});
	const [table, setTable] = useState([]);
	const [list, setList] = useState([]);
	const [userProfile, setUserProfile]= useState([]);
	const [checked, setChecked] = useState(false);


	const itemId = props.match.params.id;
	const newItem = itemId === "new";

    
	useEffect(() => {
		async function getItem(itemId) {
			const response = await BackendLIMSAxios.get(
				`${page}/${itemId}`,header);

			setFields(response.data || {});
			const table = response?.data?.role || [];
			setList([...list, ...table]);
			setLoading(false);
		}

		async function getUserProfile() {
			const body = {name:'UserProfile'}
			
			const response = await BackendLIMSAxios.post("listas/lista",body, header);
			const data = response.data[0]?.lista || [];

			setUserProfile(data);

			setLoading(false);
		}

		getUserProfile();

		if (!newItem) {
			setLoading(true);
			getItem(itemId);
		}
	}, [itemId, newItem, setFields, setFiles]);

	
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

		body.role = list;

		if (body.password) {body.validPass = false}
		

		const response = await BackendLIMSAxios.post(`${page}`,body,header);

		setLoading(false);

		const status = response.status || {};
		const id = response.data.message._id;
	
		if (status === 200) {
			handleUploadFiles(id);
			toast.success(`${item} Criado com sucesso`);
			props.history.push(`/db/${page}`);

		}}
		

		
	};


	const updateItem = async () => {
		const body = Object.assign({}, fields)

		table.map((dt) => {
			return delete dt.id;
		});

		body.role = list;

		if (body.password) {body.validPass = false}


		const response = await BackendLIMSAxios.put(`${page}/${itemId}`, body, header);

		setLoading(false);
		const id = response.data._id;

		const status = response.status || {};

		if (status === 200) {
			handleUploadFiles(id);
			toast.success(`${item} Atualizado com sucesso`);
			props.history.push(`/db/${page}`);
		}
		setLoading(false);		
	};

	const deleteItem = async () => {
	       
		const response = await BackendLIMSAxios.delete(`${page}/${itemId}`,header);
		const data = response.data || {};

		setLoading(false);
		if (data.success) {
			toast.success(`${item} Excluído com sucesso`);
			props.history.push(`/db/${page}`);
		}
	};

	
	const docExtras =
	uploadedFiles.find((uf) => uf.folder === "extras") || {};

	
	const handleShowDocuments = () => {
		setShowDocuments(!showDocuments);
	};

	const handleFileInput = (e, path) => {

		const hasPicture = e.target.files.length > 0 && path.includes("Foto"); // Boolean - comparativo
		hasPicture && setImage(URL.createObjectURL(e.target.files[0]));
	
		const newFiles = e.target.files;
		let newFilesDescription = [...files];
	
		for (let i = 0; i < newFiles.length; i++) {
			const sameFileAndFolder = newFilesDescription.find(
				(fileObj) =>
					fileObj.name === newFiles[i].name &&
					fileObj.size === newFiles[i].size &&
					fileObj.file.lastModified === newFiles[i].lastModified
			);
	
			if (sameFileAndFolder) {
				toast.error(`Arquivo ${newFiles[i].name} já foi inserido`);
				continue;
			}
	
			newFilesDescription.push({
				name: newFiles[i].name,
				size: newFiles[i].size,
				path: `${path}`,				
				file: newFiles[i],
			});
		}
	
		e.target.value = null;
		setFiles(newFilesDescription);

	};

	const handleFormSubmit = (e) => {
		e.preventDefault();
		setLoading(false);

		if (newItem) {

			const validate = [fields.name, fields.email, fields.password];

			if ( !validate.every(item => Boolean(item) === true) )  {
				toast.error("Preencha os campos obrigatórios \"Nome\", \"E-mail\" e \"Senha\"", {
					closeOnClick: true,
					autoClose: 7000,});
				return;
			}
			else{
			createItem();
		}} 
		else {
			updateItem();
		}
	};

	const removeFile = (fileObj) => {
		const filteredFiles = files.filter(
			(file) => file.name !== fileObj.name || file.path !== fileObj.path
		);

		setFiles(filteredFiles);
	};

	
	const handleToggleModal = () => {
		setShowModal(!showModal);
	};


	const handleConfirmModalButton = () => {
		setShowModal(false);
		setLoading(true);
		deleteItem();
	};


	const handleUploadFiles = async (id) => {
	
		if (files.length === 0) {
			return;
		}
	
		for (const [idx, fileObj] of files.entries()) {
			setLoading(true);
	
			const path = `${fileObj.path}/${id}`
			const archiveData = {
				path
			};
	
			const formData = new FormData();
			formData.append("archiveFullData", JSON.stringify(archiveData));
			formData.append("files", fileObj.file);
	
			await BackendLIMSAxios
				.post(`anexos/upload`, formData, {
					"Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
				})
				.then((response) => {
					setLoading(false);
					toast.success(`Arquivo ${fileObj.name} adicionado`, {
						closeOnClick: true,
						autoClose: true,
					});
					if (idx === files.length - 1) {
						toast.success("Anexo criado com sucesso");
						}
				})
				.catch((err) => {
					setLoading(false);
					toast.error(`Erro ao subir arquivo ${fileObj.name}`, {
						closeOnClick: true,
						autoClose: false,
					});
				});
		}
	};

	function handleAddLineButtonClick() {
		setList([
			...list,
			{
				id: Math.random().toString(36).substr(2, 9),
				perfil: "",
				},
		]);
	}

	function handleRemoveLineButtonClick(id) {
		const result = list.filter((dt) => dt.id !== id);
		setList(result);
	}

	function handleTableInputChange(e, key, id) {
		const result = list.find((dt) => dt.id === key);

		result[`${id}`] = e.target.value;
	}

	
	return (
		<>
			<Modal
				showModal={showModal}
				modalTitle={`Tem certeza que deseja excluir este ${item}?`}
				modalBody="Caso continue, essas informações serão perdidas!"
				handleToggleModal={handleToggleModal}
				handleConfirmModalButton={handleConfirmModalButton}
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
								<Label htmlFor="_id">ID do Usuário</Label>
								<FieldSet style={{
											flexWrap: "wrap",
											alignItems: "center",
										}}>
									<InputNumber
										type="number"
										id="_id"
										defaultValue={fields._id}
										onChange={handleInputChange}
										disabled
									/>
								</FieldSet>
							</FormGroup>
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
									disabled = {!newItem}/>
							</FormGroup>

							<FormGroup>
								<Label htmlFor="password">Senha:</Label>
								<InputText
									type="password"
									id="password"
									placeholder="****************"
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
												
								}}
									checked= {checked}
								/></Label>
								
								
							</FormGroup>
						</FieldSet>
						
						
						<AddListasTable
											data={list}
											UserProfile ={userProfile}
											handleAddLineButtonClick={
												handleAddLineButtonClick
											}
											handleRemoveLineButtonClick={
												handleRemoveLineButtonClick
											}
											handleTableInputChange={
												handleTableInputChange
											}
										/>

						<FieldSet style={{
											flexWrap: "wrap",
											alignItems: "center",
										}}>
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
						
						
																	

						<FieldSet justifyContent="flex-end">
							<ButtonGroup>
								{!newItem && (
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

export default UsuariosDetailsPage;
