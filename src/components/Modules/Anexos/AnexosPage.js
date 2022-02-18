import React, { useState, useEffect} from "react";
import { Trash2, DownloadCloud } from "react-feather";
import FormGroup from "../../Layout/FormGroup/FormGroup";
import Label from "../../Layout/Label/Label";
import FieldSet from "../../Layout/FieldSet/FieldSet";
import styled from "styled-components";
import {InputFile} from "../../Layout/Input/Input";
import Card from "../../Layout/Card/Card";
import { BackendLIMSAxios } from "../../../utils/axiosInstances";
import { toast } from "react-toastify";
import Modal from "../../Layout/Modal/Modal";


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

const Trash = styled(Trash2)`
	margin-left: 15px;
		:hover {
		cursor: pointer;
		stroke: #a71d2a;
	}
`;

const Download = styled(DownloadCloud)`
	margin-left: 15px;
		:hover {
		cursor: pointer;
		stroke: #246586;
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


export default function AnexosSPage(props) {

	const [fields, setFields] = useState();
	const [loading, setLoading] = useState(false);
	const [showFileModal, setShowFileModal] = useState(false);
	const [filesOnGcp, setFilesOnGcp] = useState([]);
	const [file, setFile] = useState([]);
	const [fileName, setFileName] = useState([]);
	
	useEffect(() => {
		const body = Object.assign({}, fields)

		body.gcpPatch = `${props.gcpPatch}/${props.itemtId}`

		async function getGcpDocuments() {
			const response = await BackendLIMSAxios.post(
				`anexos/list`, body
			);
			
			setFilesOnGcp(response.data || {});
			setLoading(false);
		}

		if (!props.newReagent) {
			setLoading(true);
			getGcpDocuments();
		}
	}, [fields, props.newReagent, props.itemtId]);

	
	const handleDownloadButtonClick = async (path, file) => {
		const body = Object.assign({}, fields)
		body.path = path
	
			await BackendLIMSAxios.post(`/anexos/download`,
				body// important
			)
				.then((response) => {
					const url = window.URL.createObjectURL(
						new Blob([response.data])
					);
					const link = document.createElement("a");
	
					link.href = url;
					link.setAttribute("download", `${file}`);
					document.body.appendChild(link);
					link.click();
	
					setLoading(false);
					toast.success(`Arquivo ${file} baixado`, {
						closeOnClick: true,
						autoClose: true,
					});
					
				})
				.catch((err) => {
					setLoading(false);
					toast.error(`Erro ao baixar arquivo ${file}`, {
						closeOnClick: true,
						autoClose: false,
					});
				});
		
	};

	const handleToggleFileModal = (file, fileName) => {
		setFileName(fileName)
		setFile(file)
		setShowFileModal(!showFileModal);
		
	};

	const handleConfirmFileModalButton = () => {
		setShowFileModal(false);
		setLoading(true);
		removeGcpFile();
	};

	const removeGcpFile = async () => {


		const body = Object.assign({}, fields)
		body.fileName = fileName

		const fileObj = file

	
		const response = await BackendLIMSAxios.post(
				`anexos/delete`, body
			);

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

	return (
		
		<>
		<Modal
				showModal={showFileModal}
				modalTitle={`Tem certeza que deseja excluir Arquivo?`}
				modalBody="Caso continue, essas informações serão perdidas!"
				handleToggleModal={handleToggleFileModal}
				handleConfirmModalButton={handleConfirmFileModalButton}
			/>
			<StyledCard>
			<FieldSet>
				<FormGroup>
					{filesOnGcp.length === 0 ? (
						<NoImgLabel>
							Nenhum arquivo anexo
						</NoImgLabel>
					) : (
						<>
							<NoImgLabel>
								{!props.newReagent &&
									props.docExtras.length > 0 &&
									`${props.docExtras.length} arquivo(s) salvo(s)`}
							</NoImgLabel>

							{filesOnGcp.map((file) => {
								return (
									<>
										<NoImgLabel>
											{file.name.replace(`${props.gcpPatch}/${props.itemtId}/`, "")}

											<Download
												color="#34b6c8"
												size={20}
												onClick={() =>
													handleDownloadButtonClick(file.name,
														file.name.replace(`${props.gcpPatch}/${props.itemtId}/`, "")
													)
												}
											/>
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
							props.handleFileInput(
								e,
								`${props.gcpPatch}`
							)
						}
						multiple
					/>
					{props.files.length === 0 ? (
						<NoImgLabel>

						</NoImgLabel>
					) : (
						<>
							<NoImgLabel>
								{!props.newReagent &&
									props.docExtras.length > 0 &&
									`${props.docExtras.length} arquivo(s) salvo(s)`}
							</NoImgLabel>

							{props.files.map((file) => {
								return (
									<>
										<NoImgLabel>
											{file.name}
											<Trash
												color="#dc3545"
												size={20}
												onClick={() =>
													props.removeFile(
														file
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
			</StyledCard>


		</>
	);
}

