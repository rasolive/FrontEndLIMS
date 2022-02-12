import React, { useState, useEffect, useContext } from "react";
import { BackendLIMSAxios } from "../../../utils/axiosInstances";
import { toast } from "react-toastify";
import { Trash2, Search, Feather } from "react-feather";

import useDynamicForm from "../../../hooks/useDynamicForm";
//import { AuthContext } from "../../../../../context/AuthContext";
import Header from "../../Layout/Header/Header";
import Modal from "../../Layout/Modal/Modal";
import Form from "../../Layout/Form/Form";
import Card from "../../Layout/Card/Card";
import FormGroup from "../../Layout/FormGroup/FormGroup";
import Label from "../../Layout/Label/Label";
import {
	InputText,
	TextArea,
	Select,
	InputFile,
	InputNumber,
} from "../../Layout/Input/Input";
import FieldSet from "../../Layout/FieldSet/FieldSet";
import Subtitle from "../../Layout/Subtitle/Subtitle";
import styled, { css } from "styled-components";
import Button from "../../Layout/Button/Button";
import ButtonGroup from "../../Layout/ButtonGroup/ButtonGroup";
import Loading from "../../Layout/Loading/Loading";
import { UpIcon, DownIcon } from "../../Layout/Icon/Icon";
import Hr from "../../Layout/Hr/Hr";
import { object } from "prop-types";

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

const AddButton = styled(Button)`
	margin: 0px;
	/* align-self: flex-end; */
`;

const Trash = styled(Trash2)`
	margin-left: 5px;
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

const SearchButton = styled(Button)`
	margin: 0;
	margin-left: -40px;
	box-shadow: none;
`;

function UploadPage(props) {
	const [loading, setLoading] = useState(false);
	const { fields, setFields, handleInputChange } = useDynamicForm();
	//const { session, hasPermissionAdm } = useContext(AuthContext);
	const [showModal, setShowModal] = useState(false);
	const [projectEquipments, setProjectEquipments] = useState([]);
	const [projectUsers, setProjectUsers] = useState([]);
	const [projects, setProjects] = useState([]);
	const [users, setUsers] = useState([]);
	const [showSpecies, setShowSpecies] = useState(true);
	const [showRawMaterial, setShowRawMaterial] = useState(true);
	const [rawMaterials, setRawMaterials] = useState([]);
	const [showDocuments, setShowDocuments] = useState(true);
	const [species, setSpecies] = useState([]);
	const [selectedSpecies, setSelectedSpecies] = useState([]);
	const [files, setFiles] = useState([]);
	const [projectName, setProjectName] = useState(null);
	const [image, setImage] = useState(null);
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const [numberExtraFiles, setNumberExtraFiles] = useState(0);
	

	const location = props.location;

	const [settingsFlow,  setSettingsFlow] = useState({
		projectId: null,
		projectName: null,
		specieId: null,
		specieName: null,
		partPlant: null
	});
	
	const projectId = props.match.params.id;
	const newProject = projectId === "new";
	const path = window.location.pathname.split("/");
	const selectedModule = path[2];
	//const isAdmin = hasPermissionAdm();

	useEffect(() => {
		console.log('files',files)
		console.log('files length',files.length)
	}, [files, setFiles])

	useEffect(() => {
		setSettingsFlow(Object.assign({settingsFlow}, { 
			projectId: projectId || null,
			projectName: fields.projectName || null,
		 }))

		 async function populateSelectedSpeciesTable() {			
			const speciesIds = fields.species;
			
			const getSpecies = species.filter(item => speciesIds.includes(item._id));

			setSelectedSpecies([...selectedSpecies, ...getSpecies ]);			
		}
		populateSelectedSpeciesTable()
		
	}, [fields.species])
	
	// useEffect(() => {
	// 	console.log("selectedSpecies",selectedSpecies)
	// }, [setSelectedSpecies, selectedSpecies])
	
	// useEffect(() => {
	// 	console.log("species",species)
	// }, [setSpecies, species])

	
	const createProject = async () => {

		handleUploadFiles(1, 'teste');
		
		
		setLoading(false);

	};

	const handleFormSubmit = (e) => {
		e.preventDefault();
		setLoading(true);

		
		createProject();
	
	};

	const docExtras = []
		//uploadedFiles.find((uf) => uf.folder === "extras") || {};

	const selectedProject =
		!newProject &&
		projects.find((p) => p._id === parseInt(fields._id));

	const handleFileClick = (project) => {
		if (!project) {
			return;
		}

		props.history.push({
			pathname: `/db/intake/workflows/${project._id}`,
			state: {
				type: "Download",
				project: 'teste',
				equipment: `anexos/extras`,
			},
		});
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
		//deleteProject();

		const result = species.find(
			(specie) => specie._id === Number(fields.specie)
		);
		setSelectedSpecies([...selectedSpecies, result]);
		setFields({ ...fields, specie: "" });
	
	};


	const handleFileInput = (e, path) => {
		// if (!fields.projectId) {
		// 	toast.error("Selecione um projeto");
		// 	return;
		// }

		const project = projects.find(
			(p) => p._id === parseInt(fields.projectId)
		);

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

	const handleUploadFiles = async (id, project) => {
		if (files.length === 0) {
			toast.success("Aspecto legal criado com sucesso");			
			props.history.push({
				pathname: "/upload",
				state: { ...settingsFlow },
			});
			return;
		}

		for (const [idx, fileObj] of files.entries()) {
			setLoading(true);

			console.log(fileObj);
			const path = fileObj.path.replace(":id", id);

			const archiveData = {
				project,
				path,
			};

			const formData = new FormData();
			formData.append("Hostname", "frontend");
			formData.append("archiveFullData", JSON.stringify(archiveData));
			formData.append("files", fileObj.file);

			await BackendLIMSAxios
				.post(`/anexos/upload`, formData, {
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
							pathname: "/upload",
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
				<Header title="Cadastro de Projeto" showReturnButton />
				<StyledCard>
					<Loading loading={loading} absolute />
					<Form flexFlow="row wrap">
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
												"anexos/upload"
											)
										}
										multiple
									/>
									{docExtras.length === 0 &&
									files.length === 0 ? (
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
												{!newProject &&
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
						
						<FieldSet justifyContent="flex-end">
							<ButtonGroup>
								{!newProject &&  (
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
									onClick={handleFormSubmit}
									success
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

export default UploadPage;