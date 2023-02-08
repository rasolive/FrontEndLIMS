import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { BackendLIMSAxios } from "../../../utils/axiosInstances";
import useDynamicForm from "../../../hooks/useDynamicForm";
import Header from "../../Layout/Header/Header";
import Modal from "../../Layout/Modal/Modal";
import Form from "../../Layout/Form/Form";
import Card from "../../Layout/Card/Card";
import FormGroup from "../../Layout/FormGroup/FormGroup";
import Label from "../../Layout/Label/Label";
import { InputText, Select } from "../../Layout/Input/Input";
import FieldSet from "../../Layout/FieldSet/FieldSet";
import styled, { css } from "styled-components";
import Button from "../../Layout/Button/Button";
import ButtonGroup from "../../Layout/ButtonGroup/ButtonGroup";
import Loading from "../../Layout/Loading/Loading";
import { UpIcon, DownIcon } from "../../Layout/Icon/Icon";
import Hr from "../../Layout/Hr/Hr";
import AnexosPage from "../Anexos/AnexosPage";
import AddSpecificationTable from "./AddSpecificationTable"
import HasPermission from "../../Permission";


const StyledCard = styled(Card)`
	max-width: 715px;
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

const AddButton = styled(Button)`
	margin: 0px;
	/* align-self: flex-end; */
`;

function SpecificationDetailsPage(props) {
	const page = `specification`
	const gcpPatch = `prd/anexos/${page}`
	const item = `Especificação`


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
	const [header, setHeader] = useState({ headers: { 'authorization': `${token}` } });
	const [materiais, setMateriais] = useState([]);
	const [analysis, setAnalysis] = useState([]);
	const [selectedAnalysis, setSelectedAnalysis] = useState([]);
	const [showAnalysis, setShowAnalysis] = useState([]);
	const [specification, setSpecification] = useState([]);
	const [spec, setSpec] = useState([]);


	const itemId = props.match.params.id;
	const newItem = itemId === "new";

	useEffect(() => {
		async function getItem(itemId) {
			const response = await BackendLIMSAxios.get(
				`${page}/${itemId}`, header);

			setFields(response.data || {});
			const table = response?.data?.specification || [];
			setSpecification([...specification, ...table]);
			setLoading(false);
		}


		async function getMateriais() {
			const response = await BackendLIMSAxios.get('materiais', header);

			setMateriais(response.data.filter(element => element.statusMaterial === 'L') || []);

			setLoading(false);

		}

		async function getAnalysis() {
			const response = await BackendLIMSAxios.get('analysis', header);


			setAnalysis(response.data || []);

			setLoading(false);

		}

		async function getSpec() {
			const response = await BackendLIMSAxios.get(`${page}`,header);


			setSpec(response.data || []);
			setLoading(false);
		}

		setLoading(true);
		getMateriais()
		getAnalysis()


		if (!newItem) {
			setLoading(true);
			getItem(itemId);
		}
		if (newItem) {
			getSpec(itemId);
		}

	}, []);

	useEffect(() => {
		/** @Describe: Controla a visualização dos analysis no Select e Tabela. */
		const analysisFiltered = analysis.filter((analysis) => {

			return !selectedAnalysis.find(
				(selectedAnalysis) => selectedAnalysis._id === Number(analysis._id)
			);
		});

		setShowAnalysis(analysisFiltered);

	}, [selectedAnalysis, setSelectedAnalysis, analysis])





	useEffect(() => {
		async function populateSelectedAnalysisTable() {
			try {
				const analysisIds = fields.specification.map(analysis => analysis._id);
				const getAnalysis = analysis.filter(item => analysisIds.includes(item._id));
				setSelectedAnalysis(fields.specification);
			} catch (error) { }
		}
		populateSelectedAnalysisTable()

	}, [fields.specification]);


	const createItem = async () => {	
		const body = Object.assign({}, fields)

		body.specification = specification;

		const newSpec = await BackendLIMSAxios.post(`${page}/findOne`,body,header);

		console.log('newSpec', body.material)

		if (newSpec.data.material === Number(body.material)){ 
			setLoading(false);
			toast.error("Especificação já cadastrada, altere o Material",
			{ closeOnClick: true, autoClose: 4000 });

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

		body.specification = specification;


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

			const validate = [fields.material];

			if ( !validate.every(item => Boolean(item) === true) )  {
				toast.error("Preencha os campos obrigatórios \"Material\"", {
					closeOnClick: true,
					autoClose: 4000,});
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

	const handleAddAnalysis = () => {
		if (!fields.analysis2) {
			toast.error("Nenhum Analysis selecionado");
			return;
		}

		const result = analysis.find(
			(analysis) => analysis._id === Number(fields.analysis2)
		);

		const JoinSelectedAnalysis = [...selectedAnalysis, result]
		setSelectedAnalysis(JoinSelectedAnalysis);

		setFields({ ...fields, analysis: "" });

		setSpecification([
			...JoinSelectedAnalysis
		]);

	};

	const handleRemoveAnalysis = (id) => {
		const result = specification.filter((dt) => dt._id !== id);
	
		setSelectedAnalysis(result);
		setSpecification(result);

	};


	function handleTableInputChange(e, key, id) {
		const result = specification.find((dt) => dt.id === key);

		result[`${id}`] = e.target.value;
	}


	async function handleSpec(itemId) {
		
			const response = await BackendLIMSAxios.get(
				`${page}/${itemId}`, header);

			const table = response?.data?.specification || [];
			setSelectedAnalysis(table)
			setSpecification([...table]);
			setLoading(false);
		
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
					title={`Cadastro de ${item}`}
					showReturnButton
				/>
				<StyledCard>
					<Loading loading={loading} absolute />
					<Form flexFlow="row wrap">
					{newItem &&
					<FieldSet
							style={{
								flexWrap: "wrap",
								alignItems: "center",
							}}>
							<FormGroup>
								<Label htmlFor="espec">
									Criar por cópia a partir de:
								</Label>
								<Select
									id="espec"
									onChange={(e)=>handleSpec(e.target.value)}
									disabled={!newItem}
								>
									<option value="">Selecione</option>
									{spec.map((value) => {
										return (
											<option
												key={value._id}
												value={value._id}
											>
												{value.material.name}
											</option>
										);
									})}
								</Select>
							</FormGroup>


						</FieldSet>}
						
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
									disabled={!newItem}
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


						</FieldSet>

						<FieldSet alignItems="flex-end">
							<FormGroup>
								<Label htmlFor="analysis2">Analysis</Label>
								<Select
									id="analysis2"
									onChange={handleInputChange}
								>
									<option value="">Selecione</option>
									{showAnalysis.map((analysis) => {
										return (
											<option
												key={analysis._id}
												value={analysis._id}
											>
												{analysis.name}
											</option>
										);
									})}
								</Select>
							</FormGroup>
							<FormGroup>
								<AddButton
									type="button"
									onClick={handleAddAnalysis}
								>
									Adicionar
								</AddButton>
							</FormGroup>
						</FieldSet>
						<FieldSet>

						</FieldSet>
						<FieldSet>

							<AddSpecificationTable
								data={specification}
								analysis={analysis}

								handleRemoveLineButtonClick={
									handleRemoveAnalysis
								}
								handleTableInputChange={
									handleTableInputChange
								}
								history={props.history}
							/>
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
										<SmallButton
											type="button"
											small
											onClick={handleShowDocuments}
										>
											{showDocuments ? (
												<DownIcon />
											) : (
												<UpIcon />
											)}
										</SmallButton>
									</RightPanel>
								</Group>
								<Hr />
							</FormGroup>
						</FieldSet>
						<Collapse className={`${showDocuments && "collapsed"}`}>
							<FieldSet>

								<AnexosPage
									fileName={fileName}
									newItem={newItem}
									docExtras={docExtras}
									itemtId={itemId}
									handleFileInput={handleFileInput}
									files={files}
									removeFile={removeFile}
									gcpPatch={gcpPatch}
									roles={HasPermission(["S","GQ"])}

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
										disabled={!newItem}
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
									disabled={!HasPermission(["S", "AQ", "GQ"])}
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

export default SpecificationDetailsPage;
