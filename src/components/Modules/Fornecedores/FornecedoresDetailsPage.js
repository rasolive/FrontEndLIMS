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
import { InputText, Select, InputNumber, StyledInputMask} from "../../Layout/Input/Input";
import FieldSet from "../../Layout/FieldSet/FieldSet";
import styled, { css } from "styled-components";
import Button from "../../Layout/Button/Button";
import ButtonGroup from "../../Layout/ButtonGroup/ButtonGroup";
import Loading from "../../Layout/Loading/Loading";
import { UpIcon, DownIcon } from "../../Layout/Icon/Icon";
import Hr from "../../Layout/Hr/Hr";
import AnexosPage from "../Anexos/AnexosPage";
import HasPermission from "../../Permission";


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


function FornecedoresDetailsPage(props) {
	const page = `fornecedores`;
	const gcpPatch = `prd/anexos/${page}`
	const item = `Fornecedor`

	const { fields, setFields, handleInputChange } = useDynamicForm();
	const [loading, setLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [showCancelModal, setShowCancelModal] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const [showDocuments, setShowDocuments] = useState(true);
	const [files, setFiles] = useState([]);
	const [fileName, setFileName] = useState([]);
	const [image, setImage] = useState(null);
	const [token, setToken] = useState(sessionStorage.getItem("token"));
	const [header, setHeader] = useState({headers: {'authorization': `${token}`}});

	const itemId = props.match.params.id;
	const newItem = itemId === "new";

	useEffect(() => {
		async function getItem(itemId) {
			const response = await BackendLIMSAxios.get(
				`${page}/${itemId}`,header);

			setFields(response.data || {});
			setLoading(false);
		}

		if (!newItem) {
			setLoading(true);
			getItem(itemId);
		}

	}, [itemId, newItem, setFields, setFiles]);

	

	const createItem = async () => {
		const body = Object.assign({}, fields)

		const newSupplier = await BackendLIMSAxios.post(`${page}/findOne`,body,header);

		if (newSupplier.data.cnpj === body.cnpj){ 
			setLoading(false);
			toast.error("Fornecedor já cadastrado, altere o CNPJ",
			{ closeOnClick: true, autoClose: 6000 });

		}
		else{
	
		const response = await BackendLIMSAxios.post(`${page}`,body,header);

		setLoading(false);

		const status = response.status || {};
		const id = response.data.message._id;

		if (status === 200) {
			handleUploadFiles(id);
			toast.success(`${item} Criado com sucesso`);
			props.history.push(`/db/${page}`);

		}
	}
	};

	const updateItem = async () => {
		const body = Object.assign({}, fields)

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

			if (Math.round(newFiles[i].size / 1024 /1024) >= 5) {
				toast.error(`O Arquivo ${newFiles[i].name} contem mais de 5MB e não será anexado`);
				continue;
			}
	
	
			if (Math.round(newFiles[i].size / 1024 /1024) >= 5) {
				toast.error(`O Arquivo ${newFiles[i].name} contem mais de 5MB e não será anexado`);
				continue;
			}
	
	
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

			const validate = [fields.name, fields.cnpj];

			if ( !validate.every(item => Boolean(item) === true) )  {
				toast.error("Preencha os campos obrigatórios \"Nome\" e \"CNPJ\"", {
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

	const handleToggleCancelModal = () => {
		setShowCancelModal(!showCancelModal);
	};

	const handleConfirmCancelModalButton = () => {
		setShowCancelModal(false);
		toast.success(`Cadastro cancelado com sucesso`);
		props.history.push(`/db/${page}`);
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

	const estados = [{
		"_id": 2,
		"Estado": "Acre",
		"Longitude": -9.49865,
		"Latitude": -69.629581,
		"Sigla": "AC",
		"active": true
	  },{
		"_id": 14,
		"Estado": "Alagoas",
		"Longitude": -9.521841,
		"Latitude": -36.039082,
		"Sigla": "AL",
		"active": true
	  },{
		"_id": 6,
		"Estado": "Amapá",
		"Longitude": 2.406605,
		"Latitude": -51.428199,
		"Sigla": "AP",
		"active": true
	  },{
		"_id": 3,
		"Estado": "Amazonas",
		"Longitude": -3.976318,
		"Latitude": -64.399382,
		"Sigla": "AM",
		"active": true
	  },{
		"_id": 16,
		"Estado": "Bahia",
		"Longitude": -12.197327,
		"Latitude": -40.191427,
		"Sigla": "BA",
		"active": true
	  },{
		"_id": 10,
		"Estado": "Ceará",
		"Longitude": -4.354732,
		"Latitude": -39.712723,
		"Sigla": "CE",
		"active": true
	  },{
		"_id": 27,
		"Estado": "Distrito Federal",
		"Longitude": -15.858437,
		"Latitude": -47.596956,
		"Sigla": "DF",
		"active": true
	  },{
		"_id": 18,
		"Estado": "Espírito Santo",
		"Longitude": -19.768337,
		"Latitude": -40.3565,
		"Sigla": "ES",
		"active": true
	  },{
		"_id": 26,
		"Estado": "Goiás",
		"Longitude": -16.8529,
		"Latitude": -51.105,
		"Sigla": "GO",
		"active": true
	  },{
		"_id": 8,
		"Estado": "Maranhão",
		"Longitude": -4.042,
		"Latitude": -45.107216,
		"Sigla": "MA",
		"active": true
	  },{
		"_id": 25,
		"Estado": "Mato Grosso",
		"Longitude": -13.434091,
		"Latitude": -55.501919,
		"Sigla": "MT",
		"active": true
	  },{
		"_id": 24,
		"Estado": "Mato Grosso do Sul",
		"Longitude": -20.616023,
		"Latitude": -55.095124,
		"Sigla": "MS",
		"active": true
	  },{
		"_id": 17,
		"Estado": "Minas Gerais",
		"Longitude": -18.824095,
		"Latitude": -44.0345,
		"Sigla": "MG",
		"active": true
	  },{
		"_id": 21,
		"Estado": "Paraná",
		"Longitude": -24.722653,
		"Latitude": -51.09548,
		"Sigla": "PR",
		"active": true
	  },{
		"_id": 12,
		"Estado": "Paraíba",
		"Longitude": -6.950165,
		"Latitude": -35.588089,
		"Sigla": "PB",
		"active": true
	  },{
		"_id": 5,
		"Estado": "Pará",
		"Longitude": -4.239015,
		"Latitude": -52.218322,
		"Sigla": "PA",
		"active": true
	  },{
		"_id": 13,
		"Estado": "Pernambuco",
		"Longitude": -8.140122,
		"Latitude": -37.779227,
		"Sigla": "PE",
		"active": true
	  },{
		"_id": 9,
		"Estado": "Piauí",
		"Longitude": -6.995318,
		"Latitude": -41.807852,
		"Sigla": "PI",
		"active": true
	  },{
		"_id": 11,
		"Estado": "Rio Grande do Norte",
		"Longitude": -5.607038,
		"Latitude": -36.8261,
		"Sigla": "RN",
		"active": true
	  },{
		"_id": 23,
		"Estado": "Rio Grande do Sul",
		"Longitude": -30.055067,
		"Latitude": -52.387882,
		"Sigla": "RS",
		"active": true
	  },{
		"_id": 19,
		"Estado": "Rio de Janeiro",
		"Longitude": -22.7641,
		"Latitude": -42.1726,
		"Sigla": "RJ",
		"active": true
	  },{
		"_id": 1,
		"Estado": "Rondônia",
		"Longitude": -11.474053,
		"Latitude": -62.226545,
		"Sigla": "RO",
		"active": true
	  },{
		"_id": 4,
		"Estado": "Roraima",
		"Longitude": 2.148823,
		"Latitude": -61.412437,
		"Sigla": "RR",
		"active": true
	  },{
		"_id": 22,
		"Estado": "Santa Catarina",
		"Longitude": -27.257104,
		"Latitude": -49.879454,
		"Sigla": "SC",
		"active": true
	  },{
		"_id": 15,
		"Estado": "Sergipe",
		"Longitude": -8.263146,
		"Latitude": -35.510823,
		"Sigla": "SE",
		"active": true
	  },{
		"_id": 20,
		"Estado": "São Paulo",
		"Longitude": -22.763116,
		"Latitude": -47.9046,
		"Sigla": "SP",
		"active": true
	  },{
		"_id": 7,
		"Estado": "Tocantins",
		"Longitude": -9.596869,
		"Latitude": -48.201864,
		"Sigla": "TO",
		"active": true
	  }]
	
	return (
		<>
			<Modal
				showModal={showModal}
				modalTitle="Tem certeza que deseja excluir este item?"
				modalBody="Caso continue, essas informações serão perdidas!"
				handleToggleModal={handleToggleModal}
				handleConfirmModalButton={handleConfirmModalButton}
			/>
			
			<Modal
				showModal={showCancelModal}
				modalTitle="Tem certeza que deseja Excluir o cadastro?"
				modalBody="Caso continue, as informações preenchidas serão perdidas!"
				handleToggleModal={handleToggleCancelModal}
				handleConfirmModalButton={handleConfirmCancelModalButton}
				item={item}
			/>

			<Container showModal={showModal}>
				<Header
					title="Cadastro de Fornecedores"
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
								<Label htmlFor="name">Nome do Fornecedor</Label>
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
								<Label htmlFor="_id">ID do Fornecedor</Label>
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
								<Label htmlFor="cnpj">CNPJ:</Label>
								<StyledInputMask
									mask = {!fields.cnpj ? "" : "99.999.999/9999-99"}
									type="text"
									id="cnpj"
									defaultValue={fields.cnpj}
									placeholder = "00.000.000/0000-00"
									onChange={handleInputChange}
									disabled ={!newItem}
								/>
							</FormGroup>
						</FieldSet>
						
						<FieldSet
						style={{
							flexWrap: "wrap",
							alignItems: "center",
						}}>
							<FormGroup>
								<Label htmlFor="rua">Rua:</Label>
								<FieldSet style={{
											flexWrap: "wrap",
											alignItems: "center",
										}}>
									<InputText
										type="text"
										id="rua"
										defaultValue={fields.rua}
										onChange={handleInputChange}
									/>
								</FieldSet>
							</FormGroup>
							<FormGroup>
								<Label htmlFor="numero">Numero:</Label>
								<InputNumber
									type="number"
									id="numero"
									defaultValue={fields.numero}
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
								<Label htmlFor="bairro">Bairro:</Label>
								<FieldSet style={{
											flexWrap: "wrap",
											alignItems: "center",
										}}>
									<InputText
										type="text"
										id="bairro"
										defaultValue={fields.bairro}
										onChange={handleInputChange}
									/>
								</FieldSet>
							</FormGroup>
							<FormGroup>
								<Label htmlFor="cidade">Cidade:</Label>
								<InputText
									type="text"
									id="cidade"
									defaultValue={fields.cidade}
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
								<Label htmlFor="estado">Estado:</Label>
								<FieldSet style={{
											flexWrap: "wrap",
											alignItems: "center",
										}}>
									<Select
									id="estado"
									onChange={handleInputChange}
									value={
										fields.estado &&
										fields.estado
									}
								>
									<option value="">Selecione</option>
									{estados.map((value) => {
										return (
											<option
												key={value.Sigla}
												value={value.Sigla}
											>
												{value.Estado}
											</option>
										);
									})}
								</Select>
								</FieldSet>
							</FormGroup>
							<FormGroup>
								<Label htmlFor="cep">CEP:</Label>
								<StyledInputMask
									mask = {!fields.cep ? "" : "99999-999"}
									type="text"
									id="cep"
									defaultValue={fields.cep}
									placeholder = "00000-000"
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
								<Label htmlFor="telefone">Telefone:</Label>
								<FieldSet style={{
											flexWrap: "wrap",
											alignItems: "center",
										}}>
									<StyledInputMask
										mask = {!fields.telefone ? '' : '(99) 9 9999-9999'}
										type="text"
										id="telefone"
										defaultValue={fields.telefone}
										placeholder = "(99) 9 9999-9999"
										onChange={handleInputChange}
									/>
								</FieldSet>
							</FormGroup>
							<FormGroup>
								<Label htmlFor="email">E-mail:</Label>
								<InputText
									type="text"
									id="email"
									defaultValue={fields.email}
									onChange={handleInputChange}
								/>
							</FormGroup>
						</FieldSet>	

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
						
						
							<FieldSet>
							
							<FormGroup>
								<Group>
									<LeftPanel>Anexos</LeftPanel>
									<RightPanel>
										{showDocuments ? (
										<SmallButton
											type="button"
											small
											onClick={handleShowDocuments}
											title="Exibir Anexos"
										>
											<DownIcon />
										</SmallButton>
										) : 
										(
											<SmallButton
											type="button"
											small
											onClick={handleShowDocuments}
											title="Esconder Anexos"
										>
											<UpIcon />
										</SmallButton>
										)}
									</RightPanel>
								</Group>
								<Hr />
							</FormGroup>
						</FieldSet>
						<Collapse className={`${showDocuments && "collapsed"}`}>
						<FieldSet>

							<AnexosPage
								fileName = {fileName}
								newItem = {newItem}
								docExtras = {docExtras}
								itemtId = {itemId}
								handleFileInput = {handleFileInput}
								files = {files}
								removeFile = {removeFile}
								gcpPatch = {gcpPatch}
								rolesRemove = {HasPermission(["S","GC"])}
								rolesAdd = {HasPermission(["S","GC", "AC"])}
								rolesDownload = {HasPermission(["S","GC", "AC"])}
															
							/>
						
						</FieldSet>
						</Collapse>
														

						<FieldSet justifyContent="flex-end">
							<ButtonGroup>
								{!newItem && (
									<Button
										type="button"
										onClick={handleToggleModal}
										danger
										disabled= {!HasPermission(["S","GC"])}
									>
										Excluir
									</Button>
								)}
								{newItem && (
									<Button
										type="button"
										onClick={handleToggleCancelModal}
										cancel
									>
										Cancelar
									</Button>
								)}
								<Button
									type="button"
									success
									onClick={handleFormSubmit}
									disabled= {!HasPermission(["S","AC","GC"])}
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

export default FornecedoresDetailsPage;
