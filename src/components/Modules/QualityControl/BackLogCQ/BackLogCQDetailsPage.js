import React, { useState, useEffect} from "react";
import { toast } from "react-toastify";
import { BackendLIMSAxios } from "../../../../utils/axiosInstances";
import useDynamicForm from "../../../../hooks/useDynamicForm";
// import { AuthContext } from "../../../../../context/AuthContext";
import Header from "../../../Layout/Header/Header";
import Modal from "../../../Layout/Modal/Modal";
import Form from "../../../Layout/Form/Form";
import Card from "../../../Layout/Card/Card";
import FormGroup from "../../../Layout/FormGroup/FormGroup";
import Label from "../../../Layout/Label/Label";
import { InputText, Select, InputNumber} from "../../../Layout/Input/Input";
import FieldSet from "../../../Layout/FieldSet/FieldSet";
import styled, { css } from "styled-components";
import Button from "../../../Layout/Button/Button";
import ButtonGroup from "../../../Layout/ButtonGroup/ButtonGroup";
import Loading from "../../../Layout/Loading/Loading";
import { UpIcon, DownIcon } from "../../../Layout/Icon/Icon";
import Hr from "../../../Layout/Hr/Hr";
import AnexosPage from "../../Anexos/AnexosPage";
import AddAnalysisTable from "./AddAnalysisTable";


const StyledCard = styled(Card)`
	max-width: 820px;
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


function BackLogDetailsPage(props) {
	const page = `lotes`
	const gcpPatch = `prd/anexos/qualityControl`
	const item = `Lote`


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
	const [statusLote, setStatusLote]= useState([]);
	const [materiais, setMateriais] = useState([]);
	const [fornecedores, setFornecedores] = useState([]);
	const [materialSupplier, setMaterialSupplier] = useState([]);
	const [unidadesMedida, setUnidadesMedida] = useState([]);
	const [umb, setUmb] = useState([]);
	const [analysisResult, setAnalysisResult] = useState([]);

	const itemId = props.match.params.id;
	const newItem = itemId === "new";

    useEffect(() => {

		async function isAuthenticated() {
			const response = await BackendLIMSAxios.get(`auth/isAuthenticated`, header);

			if (response.data.isAuthenticated === "true" & response.data.validPass === "true"){

			  	console.log(response.data.isAuthenticated);

			}else {
                sessionStorage.removeItem('token')
				props.history.push(`/`);
                setLoading(true);
			};

			setLoading(false);
		}
		
			isAuthenticated()		

	}, []);


	useEffect(() => {
		async function getItem(itemId) {
			const response = await BackendLIMSAxios.get(
				`${page}/${itemId}`,header);

			setFields(response.data || {});
			setLoading(false);
		}

		async function getStatusLote() {
			const body = {name:'Status Lote'}
			
			const response = await BackendLIMSAxios.post("listas/lista",body, header);
			const data = response.data[0]?.lista || [];

			setStatusLote(data);
		
			setLoading(false);
		}

		async function getUnidadesMedida() {
			const body = {name:'Unidade Medida'}
			
			const response = await BackendLIMSAxios.post("listas/lista",body, header);
			const data = response.data[0]?.lista || [];

			setUnidadesMedida(data);
		
			setLoading(false);
		}

		async function getMateriais() {
			const response = await BackendLIMSAxios.get('materiais', header);

			console.log("1",response)			
			
			setMateriais(response.data.filter( element => element.statusMaterial === 'L') || []);
			
			setLoading(false);
			
		}
		
		setLoading(true);
		getStatusLote()
		getMateriais()
		getUnidadesMedida()
	

		if (!newItem) {
			setLoading(true);
			getItem(itemId);
		}
		
	}, []);

	useEffect(() => {
		async function getMaterial(material) {
			const response = await BackendLIMSAxios.get(
				`materiais/${material}`,header);
				
			setFornecedores(response.data.fornecedor || []);
			console.log('umb',response.data.umb)
			var umb = response.data.umb
			setUmb(unidadesMedida.filter( element => element.chave === umb)[0] || []);
			console.log('umb2', umb?.valor)

			setLoading(false);
		}

		async function getSpecification(material) {

			if (fields.startedAnalysis) {
					const response = await BackendLIMSAxios.get(
						`${page}/${itemId}`,header);

				const table = response?.data?.analysisResult || [];
				setAnalysisResult([...analysisResult, ...table]);
				setLoading(false);

			}else {
			console.log('material',material)
			const response = await BackendLIMSAxios.get(
				`specification/material/${material}`,header);

			//setFields(response.data || {});
			const table = response?.data?.specification || [];
			setAnalysisResult([...analysisResult, ...table]);
			setLoading(false);}
		}


		getSpecification(fields.material)
		getMaterial(fields.material);
	
	}, [fields.material, fields.startedAnalysis]);

	useEffect(() => {
		
		async function setFornecedores() {
			const response = await BackendLIMSAxios.get(`fornecedores`, header);

			const materialSupplier = response.data.filter(fornecedor => fornecedores.includes(fornecedor._id));

			setMaterialSupplier(materialSupplier);


			setLoading(false);
		}
	
		setLoading(true);
		setFornecedores();

	}, [fornecedores]);


	const updateItem = async () => {
		const body = Object.assign({}, fields)

		body.analysisResult = analysisResult;
		body.startedAnalysis = true

		const validateStatus = analysisResult.map(element => element.status);
		console.log('validateStatus', validateStatus)
		if (validateStatus.includes(undefined)) { console.log('status', 'undefined')}
		else if (validateStatus.includes(false)) { body.statusLote = "R"; console.log('status', 'Reprovado')}
		else{body.statusLote = "L";console.log('status', 'Aprovado')}
		


		const response = await BackendLIMSAxios.put(`${page}/${itemId}`, body, header);

		setLoading(false);
		const id = response.data._id;

		const status = response.status || {};
		console.log("10",files)
		if (status === 200) {
			handleUploadFiles(id);
			toast.success(`${item} Atualizado com sucesso`);
			props.history.push(`/db/qualityControl`);
		}
		setLoading(false);		
	};

	const deleteItem = async () => {
	
		const response = await BackendLIMSAxios.delete(`${page}/${itemId}`, header);
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
		console.log("50",newFilesDescription)
	};

	const handleFormSubmit = (e) => {
		e.preventDefault();
		setLoading(true);

			updateItem();
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
		console.log(files)
		if (files.length === 0) {
			return;
		}
	
		for (const [idx, fileObj] of files.entries()) {
			setLoading(true);
	
			const path = `${fileObj.path}/${id}`
			console.log('fileObj',fileObj)
			console.log('fileObj path',path)
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

	function handleTableInputChange(e, key, id) {
		
		const result = analysisResult.find((dt) => dt.id === key);
		
		result[`${id}`] = e.target.value;

		console.log("e.target.value",id)
		
	}

	function handleTableInputChange2(e, key, id) {
		
		const result = analysisResult.find((dt) => dt.id === key);
		
		result[`${id}`] = e;

		console.log("e.target.value",e)
		
	}
	
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
					title={`Controle de Qualidade de lote`}
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
								<Label htmlFor="material">
									Material
								</Label>
								<Select
									id="material"
									onChange={handleInputChange}
									value={
										fields.material
									}
									disabled = {!newItem}
								>
									<option value="">Selecione</option>
									{materiais.map((value) => {
										return (
											<option
												key={value._id}
												value={value._id}
											>
												{value.name}
											</option>
										);
									})}
								</Select>
							</FormGroup>
							
							<FormGroup>
								<Label htmlFor="lote">Lote</Label>
								<InputText
									type="text"
									id="lote"
									defaultValue={fields.lote}
									onChange={handleInputChange}
									disabled
								/>
							</FormGroup>
							<FormGroup>
								<Label htmlFor="statusLote">Status do Lote</Label>
								<Select
									id="statusLote"
									onChange={handleInputChange}
									value={fields.statusLote}
									disabled
								>
									<option value="">Qualidade</option>
									{statusLote.map((value) => {
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

						<FieldSet
						style={{
							flexWrap: "wrap",
							alignItems: "center",
						}}>
							<FormGroup>
								<Label htmlFor="fornecedor">
									Fornecedor
								</Label>
								<Select
									id="fornecedor"
									onChange={handleInputChange}
									value={
										fields.fornecedor
									}
									disabled = {!newItem}
								>
									<option value="">Selecione</option>
									{materialSupplier.map((value) => {
										return (
											<option
												key={value._id}
												value={value._id}
											>
												{value.name}
											</option>
										);
									})}
								</Select>
							</FormGroup>
							<FormGroup>
								<Label htmlFor="loteFornecedor">Lote do Fornecedor</Label>
								<InputText
									type="text"
									id="loteFornecedor"
									defaultValue={fields.loteFornecedor}
									onChange={handleInputChange}
									disabled = {!newItem}
								/>
							</FormGroup>
						</FieldSet>

						<FieldSet
						style={{
							flexWrap: "wrap",
							alignItems: "center",
						}}>
							<FormGroup>
								<Label htmlFor="qtdInicial">Quantidade</Label>
								<InputText
									type="number"
									id="qtdInicial"
									defaultValue={fields.qtdInicial}
									onChange={handleInputChange}
									disabled = {!newItem}
								/>
							</FormGroup>
							<FormGroup>
								<Label htmlFor="umb">Unidade</Label>
								<InputText
									type="text"
									id="umb"
									defaultValue={umb?.valor}
									onChange={handleInputChange}
									disabled
								/>
							</FormGroup>
							<FormGroup>
								<Label htmlFor="validade">Validade</Label>
								<FieldSet style={{
											flexWrap: "wrap",
											alignItems: "center",
										}}>
									<InputText
										type="date"
										id="validade"
										defaultValue={fields.validade}
										onChange={handleInputChange}
										disabled = {!newItem}
									/>
								</FieldSet>
							</FormGroup>
						</FieldSet>

						<FieldSet
						style={{
							flexWrap: "wrap",
							alignItems: "center",
						}}>
							
							
						</FieldSet>


						<FieldSet>
								
								<AddAnalysisTable
											data={analysisResult}
											handleTableInputChange={
												handleTableInputChange
											}
											history={props.history}
											handleTableInputChange2={handleTableInputChange2}
										/>
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
															
							/>
						
						</FieldSet>
						</Collapse>
														

						<FieldSet justifyContent="flex-end">
							<ButtonGroup>
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

export default BackLogDetailsPage;
