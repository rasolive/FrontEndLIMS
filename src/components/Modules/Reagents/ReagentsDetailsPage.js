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
import { InputText, Select, InputNumber, InputFile } from "../../Layout/Input/Input";
import FieldSet from "../../Layout/FieldSet/FieldSet";
import styled, { css } from "styled-components";
import Button from "../../Layout/Button/Button";
import ButtonGroup from "../../Layout/ButtonGroup/ButtonGroup";
import Loading from "../../Layout/Loading/Loading";
import { Trash2 } from "react-feather";





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
	max-width: 80%;
	margin: auto;
	z-index: 0;
	overflow: hidden;
	position: relative;
	width: 100%;
	justify-content: center;
	align-items: center;
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
	align-content: center;
	justify-content: center;

	&.hasFiles {
		font-size: 12px;
		:hover {
			cursor: pointer;
			color: #282828;
		}
	}
`;

const Trash = styled(Trash2)`
	margin-left: 5px;
	:hover {
		cursor: pointer;
		stroke: #a71d2a;
	}
`;

function ReagentsDetailsPage(props) {
	const { fields, setFields, handleInputChange } = useDynamicForm();
	const [loading, setLoading] = useState(false);
	// const { session } = useContext(AuthContext);
	const [showModal, setShowModal] = useState(false);
	const [files, setFiles] = useState([]);
	const [projects, setProjects] = useState([]);
	const [image, setImage] = useState(null);
	const [uploadedFiles, setUploadedFiles] = useState([]);


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
			handleUploadFiles(id, settingsFlow.projectName);
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

	const handleUploadFiles = async (id, project) => {
		if (files.length === 0) {
			toast.success("Aspecto legal criado com sucesso");			
			props.history.push({
				pathname: "/db/bioagriculture/deliveryspecies",
				state: { ...settingsFlow },
			});
			return;
		}

		for (const [idx, fileObj] of files.entries()) {
			setLoading(true);

			const path = fileObj.path.replace(":id", id);

			const archiveData = {
				project,
				path,
			};

			const formData = new FormData();
			formData.append("Hostname", "frontend");
			formData.append("archiveFullData", JSON.stringify(archiveData));
			formData.append("files", fileObj.file);

			await intakeAxios
				.post(`/workflows/upload`, formData, {
					"Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
				})
				.then((response) => {
					setLoading(false);
					toast.success(`Arquivo ${fileObj.name} adicionado`, {
						closeOnClick: true,
						autoClose: false,
					});
					if (idx === files.length - 1) {
						toast.success("Aspecto legal criado com sucesso");
						props.history.push({
							pathname: "/db/bioagriculture/deliveryspecies",
							state: { ...settingsFlow },
						});
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

	const handleFileInput = (e, path) => {

		const hasPicture = e.target.files.length > 0 && path.includes("Foto");
		hasPicture && setImage(URL.createObjectURL(e.target.files[0]));

		const newFiles = e.target.files;

		let newFilesDescription = [...files];

		for (let i = 0; i < newFiles.length; i++) {
			const sameFileAndFolder = newFilesDescription.find(
				(fileObj) =>
					fileObj.name === newFiles[i].name &&
					fileObj.size === newFiles[i].size &&
					fileObj.file.lastModified === newFiles[i].lastModified &&
					fileObj.path === `${path}`
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

	const handleFileClick = (project) => {
		if (!project) {
			return;
		}

		props.history.push({
			pathname: `/db/reagents/documents`,
			state: {
				type: "Download",
				project: "Reagentes",
				equipment: `anexos/reagentes`,
			},
		});
	};
	const removeFile = (fileObj) => {
		const filteredFiles = files.filter(
			(file) => file.name !== fileObj.name || file.path !== fileObj.path
		);

		setFiles(filteredFiles);
	};

	const documents =
		uploadedFiles.find((uf) => uf.folder === "Documentos") || {};
	
		

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
							<FormGroup>
									<LabelFile htmlFor="files">
										Inserir Documentos
									</LabelFile>
									<InputFile
										type="file"
										name="files"
										id="files"
										onChange={(e) =>
											handleFileInput(
												e,
												"anexos/Bioagricultura/Documentos CTA/:id/Documentos"
											)
										}
										multiple
									/>
									{documents.length === 0 &&
									files.length === 0 ? (
										<NoImgLabel>
											Nenhum arquivo selecionado
										</NoImgLabel>
									) : (
										<>
											<NoImgLabel
												className={"hasFiles"}
												onClick={() =>
													handleFileClick(
														"Reagentes"
													)
												}
											>
												{!newReagent &&
													documents.length > 0 &&
													`${documents.length} arquivo(s) salvo(s)`}
											</NoImgLabel>

											{files.map((file) => {
												const fileCheck =
													file.path.includes(
														"Documentos"
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
