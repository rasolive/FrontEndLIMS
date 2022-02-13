import React, { useState, useEffect} from "react";
import { Trash2, Search, Feather } from "react-feather";
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
import { InputText, Select,InputFile, InputNumber} from "../../Layout/Input/Input";
import FieldSet from "../../Layout/FieldSet/FieldSet";
import styled, { css } from "styled-components";
import Button from "../../Layout/Button/Button";
import ButtonGroup from "../../Layout/ButtonGroup/ButtonGroup";
import Loading from "../../Layout/Loading/Loading";
import { UpIcon, DownIcon } from "../../Layout/Icon/Icon";
import Hr from "../../Layout/Hr/Hr";


const StyledCard = styled(Card)`
	max-width: 500px;
	margin: auto;
	z-index: 0;
	overflow: hidden;
	//position: relative;
	width: 100%;
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

const Trash = styled(Trash2)`
	margin-left: 15px;
		:hover {
		cursor: pointer;
		stroke: #a71d2a;
	}
`;

const LabelFile = styled(Label)`
	background-color: ${(props) => props.theme.primary};
	border-radius: 10px;
	color: #fff;
	cursor: pointer;
	margin: 10px 0px;
	padding: 6px 0px;
	text-align: center;
	width: 100%;
	align-self: flex-end;

	:hover {
		background: ${(props) => props.theme.primaryDark};
	}
`;

const NoImgLabel = styled(Label)`
	display: flex;
	align-items: center;
	align-content: left;
	justify-content: left;

	&.hasFiles {
		font-size: 12px;
		:hover {
			cursor: pointer;
			color: #282828;
		}
	}
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
	const { fields, setFields, handleInputChange } = useDynamicForm();
	const [loading, setLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [showFileModal, setShowFileModal] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const [showDocuments, setShowDocuments] = useState(true);
	const [filesOnGcp, setFilesOnGcp] = useState([]);
	const [files, setFiles] = useState([]);
	const [file, setFile] = useState([]);
	const [fileName, setFileName] = useState([]);
	const [image, setImage] = useState(null);

	const reagentId = props.match.params.id;
	const newReagent = reagentId === "new";

		useEffect(() => {
		const body = Object.assign({}, fields)

		body.gcpPatch = `anexos/reagents/${reagentId}`

		async function getGcpDocuments() {
			const response = await BackendLIMSAxios.post(
				`anexos/list`, body
			);
			
			setFilesOnGcp(response.data || {});
			setLoading(false);
		}

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
			getGcpDocuments();
		}
	}, [reagentId, newReagent, setFields, setFiles]);

	

	const createReagent = async () => {
		const body = Object.assign({}, fields)

		body.user = "Usuário de Criação" //session && session.email;

		const response = await BackendLIMSAxios.post("reagents",body);

		setLoading(false);

		const status = response.status || {};
		const id = response.data.message._id;
		console.log(response)
		console.log(response.data)
		console.log(response.data.message._id)
		if (status === 200) {
			handleUploadFiles(id);
			toast.success("Reagente Criado com sucesso");
			props.history.push("/db/reagents");

		}
	};

	const updateReagent = async () => {
		const body = Object.assign({}, fields)

		body.user = "Usuário de Alteração" //session && session.email;
		
		const response = await BackendLIMSAxios.put(`reagents/${reagentId}`, body);

		setLoading(false);
		const id = response.data._id;

		const status = response.status || {};
		if (status === 200) {
			handleUploadFiles(id);
			toast.success("Reagente Atualizado com sucesso");
			props.history.push("/db/reagents");
		}
		setLoading(false);		
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

	const handleDownload = async () => {

		const response = await BackendLIMSAxios.delete(`anexos/download`)
	
				new Blob([response.data])
		

	}

	const docExtras =
	uploadedFiles.find((uf) => uf.folder === "extras") || {};

	const handleFileClick = (project) => {
		if (!project) {
			return;
		}

		props.history.push({
			pathname: `/db/intake/workflows/${project._id}`,
			state: {
				type: "Download",
				project: project.projectName,
				equipment: `anexos/extras`,
			},
		});
	};

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

		if (newReagent) {
			createReagent();
		} else {
			updateReagent();
		}
	};

	const removeFile = (fileObj) => {
		const filteredFiles = files.filter(
			(file) => file.name !== fileObj.name || file.path !== fileObj.path
		);

		setFiles(filteredFiles);
	};

	const removeGcpFile = async () => {


		const body = Object.assign({}, fields)
		body.fileName = fileName

		const fileObj = file

	
		const response = await BackendLIMSAxios.post(
				`anexos/delete`, body
			);

			const data = response.data || {};
			const status = response.status || {};

			setLoading(false);
			if (status === 200) {
				toast.success(`Arquivo ${fileName} Excluído com sucesso`);
				const filteredFiles = filesOnGcp.filter(
					(file) => file.name !== fileObj.name || file.path !== fileObj.path
				);
		
				setFilesOnGcp(filteredFiles);
			}
	};

	const handleToggleModal = () => {
		setShowModal(!showModal);
	};

	const handleToggleFileModal = (file, fileName) => {
		setFileName(fileName)
		setFile(file)
		setShowFileModal(!showFileModal);
		
	};

	const handleConfirmModalButton = () => {
		setShowModal(false);
		setLoading(true);
		deleteReagent();
	};

	const handleConfirmFileModalButton = () => {
		setShowFileModal(false);
		setLoading(true);
		removeGcpFile();
	};

	const handleUploadFiles = async (id) => {
		if (files.length === 0) {
			// toast.success("Laudo Botânico criado com sucesso"); //
			// props.history.push({
			// 	pathname: "/db/bioagriculture/deliveryspecies",
			// 	state: { ...settingsFlow },
			// });
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

	const selectedProject =
	!newReagent &&
	files.find((p) => p._id === parseInt(fields._id));

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
				showModal={showFileModal}
				modalTitle={`Tem certeza que deseja excluir Arquivo?`}
				modalBody="Caso continue, essas informações serão perdidas!"
				handleToggleModal={handleToggleFileModal}
				handleConfirmModalButton={handleConfirmFileModalButton}
			/>
				<Container showModal={showModal}>
				<Header
					title="Cadastro de Reagentes"
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
								<Label htmlFor="cod">Código do Reagente</Label>
								<FieldSet style={{
											flexWrap: "wrap",
											alignItems: "center",
										}}>
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
								<Label htmlFor="aparence">
									Aparência
								</Label>
								<Select
									id="aparence"
									onChange={handleInputChange}
									value={fields.aparence}
								>
									<option value="">Selecione</option>
									<option value="Sólido">Sólido</option>
									<option value="Liquido">Liquido</option>
									
								</Select>
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
							<FormGroup>
									{filesOnGcp.length === 0 ? (
										<NoImgLabel>
											Nenhum arquivo anexo
										</NoImgLabel>
									) : (
										<>
											<NoImgLabel
												className={"hasFiles"}
												onClick={() =>
													handleFileClick(
														selectedProject
													)
												}
											>
												{!newReagent &&
													docExtras.length > 0 &&
													`${docExtras.length} arquivo(s) salvo(s)`}
											</NoImgLabel>

											{filesOnGcp.map((file) => {
												return (
													
														<>
															<NoImgLabel>
																{file.name}
																<Trash
																	color="#dc3545"
																	size={20}
																	onClick={() =>
																		handleToggleFileModal(file,
																			file.name
																		)
																	}
																/>
															</NoImgLabel>
														</>
													
												);
											})}
										</>
									)}
								</FormGroup>
							</FieldSet>
							<FieldSet>
							<FormGroup>
									<LabelFile htmlFor="files">
										Inserir Anexo
									</LabelFile>
									<InputFile
										type="file"
										name="files"
										id="files"
										onChange={(e) =>
											handleFileInput(
												e,
												`anexos/reagents`
											)
										}
										multiple
									/>
									{files.length === 0 ? (
										<NoImgLabel>
											
										</NoImgLabel>
									) : (
										<>
											<NoImgLabel
												className={"hasFiles"}
												onClick={() =>
													handleFileClick(
														selectedProject
													)
												}
											>
												{!newReagent &&
													docExtras.length > 0 &&
													`${docExtras.length} arquivo(s) salvo(s)`}
											</NoImgLabel>

											{files.map((file) => {
												const fileCheck =
													file.path.includes(
														"anexos"
													);
												return (
													fileCheck && (
														<>
															<NoImgLabel>
																{file.name}
																<Trash
																	color="#dc3545"
																	size={20}
																	onClick={() =>
																		removeFile(
																			file
																		)
																	}
																/>
															</NoImgLabel>
														</>
													)
												);
											})}
										</>
									)}
								</FormGroup>
							</FieldSet>
						</Collapse>
														

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

export default ReagentsDetailsPage;
