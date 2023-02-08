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
import { InputText, Select, InputNumber} from "../../Layout/Input/Input";
import FieldSet from "../../Layout/FieldSet/FieldSet";
import styled, { css } from "styled-components";
import Button from "../../Layout/Button/Button";
import ButtonGroup from "../../Layout/ButtonGroup/ButtonGroup";
import Loading from "../../Layout/Loading/Loading";
import { UpIcon, DownIcon } from "../../Layout/Icon/Icon";
import Hr from "../../Layout/Hr/Hr";
import AnexosPage from "../Anexos/AnexosPage";
import CellTable from "../../Layout/CellTable/CellTable";
import { Trash2, Truck } from "react-feather";
import HasPermission from "../../Permission";


const StyledCard = styled(Card)`
	max-width: 600px;
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

const AddButton = styled(Button)`
	margin: 0px;
	/* align-self: flex-end; */
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


function ReagentsDetailsPage(props) {
	const page = `materiais`
	const gcpPatch = `prd/anexos/${page}`
	const item = `Material`

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
	const [armazenamento, setArmazenamento]= useState([]);
	const [statusMaterial, setStatusMaterial]= useState([]);
	const [colapseFornecedores, setColapseFornecedores] = useState(true);
	const [fornecedores, setFornecedores] = useState([]);
	const [selectedFornecedores, setSelectedFornecedores] = useState([]);
	const [showFornecedores, setShowFornecedores] = useState([]);
	const [unidadeMedidaBasica, setUnidadeMedidaBasica] = useState([]);

	const [settingsFlow,  setSettingsFlow] = useState({
		itemId: null,
		projectName: null,
		fornecedorId: null,
		fornecedorName: null,
		partPlant: null
	});

	const itemId = props.match.params.id;
	const newItem = itemId === "new";

    
	useEffect(() => {
		async function getItem(itemId) {
			const response = await BackendLIMSAxios.get(
				`${page}/${itemId}`,header);

			setFields(response.data || {});
			setLoading(false);
		}

		async function getStatusMaterial() {
			const body = {name:'Status Material'}
			
			const response = await BackendLIMSAxios.post("listas/lista",body, header);
			const data = response.data[0]?.lista || [];

			setStatusMaterial(data);
		
			setLoading(false);
		}

		async function getArmazenamento() {
			const body = {name:'Armazenamento'}
			
			const response = await BackendLIMSAxios.post("listas/lista",body, header);
			const data = response.data[0]?.lista || [];

			setArmazenamento(data);

			setLoading(false);
		}

		async function getFornecedores() {
			const response = await BackendLIMSAxios.get('fornecedores', header);	
			
			setFornecedores(response.data || []);
			
			setLoading(false);
			
		}

		async function getUnidadeMedidaBasica() {
			const body = {name:'Unidade Medida'}
			
			const response = await BackendLIMSAxios.post("listas/lista",body, header);
			const data = response.data[0]?.lista || [];

			setUnidadeMedidaBasica(data);
		
			setLoading(false);
		}
		
		setLoading(true);
		getArmazenamento()
		getStatusMaterial()
		getFornecedores()
		getUnidadeMedidaBasica()
	

		if (!newItem) {
			setLoading(true);
			getItem(itemId);
		}
		
	}, []);

	useEffect(() => {		
		/** @Describe: Controla a visualização dos fornecedores no Select e Tabela. */
		const fornecedoresFiltered = fornecedores.filter((fornecedor) => {			

			return !selectedFornecedores.find(
				(selectedFornecedor) => selectedFornecedor._id === Number(fornecedor._id)
				);
			});

			setShowFornecedores(fornecedoresFiltered);
			
	} ,[selectedFornecedores, setSelectedFornecedores, fornecedores])

	



	useEffect(() => {
		async function populateSelectedFornecedoresTable() {
			const fornecedoresIds = fields.fornecedor;

			try {
				const getFornecedores = fornecedores.filter(item => fornecedoresIds.includes(item._id));
			
				setSelectedFornecedores([...selectedFornecedores, ...getFornecedores]);
			} catch (error) { }
		}
		populateSelectedFornecedoresTable()

	}, [fornecedores, fields.fornecedor])



	

	const createItem = async () => {
		const body = Object.assign({}, fields)

		body.fornecedor = selectedFornecedores.map(item => item._id);

		const response = await BackendLIMSAxios.post(`${page}`,body,header);

		setLoading(false);

		const status = response.status || {};
		const id = response.data.message._id;

		if (status === 200) {
			handleUploadFiles(id);
			toast.success(`${item} Criado com sucesso`);
			props.history.push(`/db/${page}`);

		}
	};

	const updateItem = async () => {
		const body = Object.assign({}, fields)

		body.fornecedor = selectedFornecedores.map(item => item._id);

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

			const validate = [fields.name, fields.armazenamento, fields.statusMaterial, fields.umb];

			if ( !validate.every(item => Boolean(item) === true) )  {
				toast.error("Preencha os campos obrigatórios \"Nome\", \"Armazenamento\", \"Status Material\" e \"Unidade de Medida Básica\"", {
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

	const handleToggleCancelModal = () => {
		setShowCancelModal(!showCancelModal);
	};

	const handleConfirmCancelModalButton = () => {
		setShowCancelModal(false);
		toast.success(`Cadastro cancelado com sucesso`);
		props.history.push(`/db/${page}`);
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

	const handleShowFornecedores = () => {
		setColapseFornecedores(!colapseFornecedores);
	};


	const handleAddFornecedor = () => {
		if (!fields.fornecedor2) {
			toast.error("Nenhum Fornecedor selecionado");
			return;
		}

		const result = fornecedores.find(
			(fornecedor) => fornecedor._id === Number(fields.fornecedor2)
		);

		const JoinSelectedFornecedores = [...selectedFornecedores, result]
		setSelectedFornecedores(JoinSelectedFornecedores);

		setFields({ ...fields, fornecedor: "" });
	
	};

	const handleRemoveFornecedor = (id) => {
		const result = selectedFornecedores.filter((sele) => sele._id !== id);
		setSelectedFornecedores(result);
	};
	const fornecedoresColumns = [
		{
			Header: "ID",
			accessor: "_id",
		},
		{ Header: "Nome", accessor: "name" },
		{ Header: "Estado", accessor: "estado" },
		{ Header: "Cidade", accessor: "cidade" },
		{
			Header: "",
			accessor: "button",
			Cell: ({ cell }) => {
				const { original } = cell.row;
				return (
					<FieldSet>
						<Button
							small
							danger
							title="Remover Fornecedor"
							onClick={() => handleRemoveFornecedor(original._id)}
						>
							<Trash2 />
						</Button>
						<Button
							small
							title="Ir para Fornecedor"
							onClick={() =>
								props.history.push({
									pathname: `../../db/fornecedores/${original._id}`,
									
								})
							}
						>
							<Truck/>
						</Button>
					</FieldSet>
				);
			},
		},
	];
	
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
					title="Cadastro de Materiais"
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
								<Label htmlFor="cod">Código do Material</Label>
								<FieldSet style={{
											flexWrap: "wrap",
											alignItems: "center",
										}}>
									<InputText
										type="text"
										id="cod"
										defaultValue={fields.cod}
										onChange={handleInputChange}
										disabled
									/>
								</FieldSet>
							</FormGroup>
							<FormGroup>
								<Label htmlFor="nome_mp">Nome do Material</Label>
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
								<Label htmlFor="armazenamento">
									Armazenamento
								</Label>
								<Select
									id="armazenamento"
									onChange={handleInputChange}
									value={
										fields.armazenamento &&
										fields.armazenamento
									}
								>
									<option value="">Selecione</option>
									{armazenamento.map((value) => {
										return (
											<option
												key={value.chave}
												value={value.chave}
											>
												{value.valor}
											</option>
										);
									})}
								</Select>
							</FormGroup>

							<FormGroup>
								<Label htmlFor="umb">
									Unidade de Medida Básica
								</Label>
								<Select
									id="umb"
									onChange={handleInputChange}
									value={fields.umb}	
									disabled={!newItem}
								>
									<option value="">Selecione</option>
									{unidadeMedidaBasica.map((value) => {
										return (
											<option
												key={value.chave}
												value={value.chave}
											>
												{value.valor}
											</option>
										);
									})}
								</Select>
							</FormGroup>
							</FieldSet>

							<FieldSet>
						<FormGroup>
								<Label htmlFor="statusMaterial">
									Status Material
								</Label>
								<Select
									id="statusMaterial"
									onChange={handleInputChange}
									value={
										fields.statusMaterial &&
										fields.statusMaterial
									}
								>
									<option value="">Selecione</option>
									{statusMaterial.map((value) => {
										return (
											<option
												key={value.chave}
												value={value.chave}
											>
												{value.valor}
											</option>
										);
									})}
								</Select>
							</FormGroup>
							</FieldSet>
							
							<FieldSet>
							<FormGroup>
								<Group>
									<LeftPanel>
										Fornecedores
									</LeftPanel>
									<RightPanel>
									{colapseFornecedores ? (
										<SmallButton
											type="button"
											small
											onClick={handleShowFornecedores}
											title="Exibir Fornecedores"
										>
											<DownIcon />
										</SmallButton>
										) : 
										(
											<SmallButton
											type="button"
											small
											onClick={handleShowFornecedores}
											title="Esconder Fornecedores"
										>
											<UpIcon />
										</SmallButton>
										)}
									</RightPanel>
								</Group>
								<Hr />
							</FormGroup>
						</FieldSet>
						<Collapse className={`${colapseFornecedores && "collapsed"}`}>
							<FieldSet alignItems="flex-end">
								<FormGroup>
									<Label htmlFor="fornecedor2">Fornecedor</Label>
									<Select
										id="fornecedor2"
										onChange={handleInputChange}
									>
										<option value="">Selecione</option>
										{showFornecedores.map((fornecedor) => {											
											return (
												<option
													key={fornecedor._id}
													value={fornecedor._id}
												>
													{fornecedor.name}
												</option>
											);
										})}
									</Select>
								</FormGroup>
								<FormGroup>
									<AddButton
										type="button"
										onClick={handleAddFornecedor}
									>
										Adicionar
									</AddButton>
								</FormGroup>
							</FieldSet>
							<FieldSet>
								<CellTable
									columns={fornecedoresColumns}
									data={selectedFornecedores}
								/>
							</FieldSet>
						</Collapse>

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
								roles = {HasPermission(["S",,"GC"])}
															
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
										disabled= {true}
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

export default ReagentsDetailsPage;
