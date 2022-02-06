import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Search } from "react-feather";
import { naturalIngredientsAxios } from "../../../../../utils/axiosInstances";

import useDynamicForm from "../../../../../hooks/useDynamicForm";
import { AuthContext } from "../../../../../context/AuthContext";
import Header from "../../../../Layout/Header/Header";
import Modal from "../../../../Layout/Modal/Modal";
import Form from "../../../../Layout/Form/Form";
import Card from "../../../../Layout/Card/Card";
import FormGroup from "../../../../Layout/FormGroup/FormGroup";
import Label from "../../../../Layout/Label/Label";
import { InputText, Select, InputNumber } from "../../../../Layout/Input/Input";
import FieldSet from "../../../../Layout/FieldSet/FieldSet";
import styled, { css } from "styled-components";
import Button from "../../../../Layout/Button/Button";
import ButtonGroup from "../../../../Layout/ButtonGroup/ButtonGroup";
import Loading from "../../../../Layout/Loading/Loading";
import CellTable from "../../../../Layout/CellTable/CellTable";
import { TrashIcon, PlusIcon } from "../../../../Layout/Icon/Icon";
import SpecificationModal from "./SpecificationModal";

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
	position: relative;
	width: 100%;
	justify-content: center;
	align-items: center;
`;

const DynamicFormGroup = styled(FormGroup)`
	flex-grow: ${(props) => props.flexGrow};
	justify-content: flex-end;
`;

const SearchButton = styled(Button)`
	margin: 0;
	margin-left: -40px;
	box-shadow: none;
`;

const RowButton = styled(Button)`
	margin-left: 15px;
	text-align: center;
	line-height: 50%;
	position: relative;
	margin-bottom: 5px;
	display: flex;
	justify-content: center;
`;

function SpecificationVegetableRMDetailsPage(props) {
	const { fields, setFields, handleInputChange } = useDynamicForm();
	const [loading, setLoading] = useState(false);
	const { session } = useContext(AuthContext);
	const [showModal, setShowModal] = useState(false);
	const [showSpecModal, setShowSpecModal] = useState(false);
	const [species, setSpecies] = useState([]);

	const [list, setList] = useState([]);

	const rawMaterialId = props.match.params.id;
	const newRawMaterial = rawMaterialId === "new";

	useEffect(() => {
		async function getSpecies() {
			const response = await naturalIngredientsAxios.get("species");
			setLoading(false);
			setSpecies(response.data || []);
		}

		async function getRawMaterial() {
			const response = await naturalIngredientsAxios.get(
				`lims/Spec?limscode=11301`
			);
			const data = response.data || {};
			const columns = data.metaData.map((mt) => {
				return {
					[`${mt.name}`]: "",
				};
			});
			console.log(columns);

			const rows = data.rows.map((row, i) => {
				let obj = {};

				row.map((r, index) => {});
			});

			setLoading(false);

			if (data.length > 0) {
				setFields(data[0]);
			}
		}

		setLoading(true);
		//getSpecies();
		// getBotanicalReport();
		// getProjects();

		// if (!newRawMaterial) {
		setLoading(true);
		getRawMaterial();
		//}
	}, [session, rawMaterialId, newRawMaterial, setFields]);

	const createBotanicalReport = async () => {
		const body = {
			token: session && session.token,
			...fields,
		};

		body.id_laudo = parseInt(body.id_laudo);
		body.id_projeto = parseInt(body.id_projeto);

		const response = await axios.post(
			"setMpDesenvol",
			JSON.stringify(body)
		);
		const data = response.data || {};

		setLoading(false);
		if (data.success) {
			toast.success("Matéria-prima criada com sucesso");
			props.history.push("/db/ingredients/vegetablerawmaterial");
		}
	};

	const updateBotanicalReport = async () => {
		const body = {
			token: session && session.token,
			...fields,
		};

		body.id_laudo = parseInt(body.id_laudo);
		body.id_projeto = parseInt(body.id_projeto);

		const response = await axios.post(
			"updateMpDesenvol",
			JSON.stringify(body)
		);
		const data = response.data || {};
		setLoading(false);

		if (data.success) {
			toast.success("Matéria-prima alterada com sucesso");
			props.history.push("/db/ingredients/vegetablerawmaterial");
		}
	};

	const deleteBotanicalReport = async () => {
		const body = {
			token: session && session.token,
			cod_grupo: parseInt(fields.cod_grupo),
		};

		const response = await axios.post(
			"deleteMpDesenvol",
			JSON.stringify(body)
		);
		const data = response.data || {};

		setLoading(false);
		if (data.success) {
			toast.success("Matéria-prima excluída com sucesso");
			props.history.push("/db/ingredients/vegetablerawmaterial");
		}
	};

	const handleFormSubmit = (e) => {
		e.preventDefault();
		setLoading(true);

		if (newRawMaterial) {
			createBotanicalReport();
		} else {
			updateBotanicalReport();
		}
	};

	const handleToggleModal = () => {
		setShowModal(!showModal);
	};

	const handleToggleSpecModal = () => {
		setShowSpecModal(!showSpecModal);
	};

	const handleConfirmModalButton = () => {
		setShowModal(false);
		setLoading(true);
		deleteBotanicalReport();
	};

	function handleAddLineButtonClick() {
		setList([
			...list,
			{
				id: Math.random().toString(36).substr(2, 9),
				patente: "",
				num: "",
				status: "",
			},
		]);
	}

	function handleRemoveLineButtonClick(id) {
		const result = list.filter((dt) => dt.id !== id);
		setList(result);
	}

	const columns = [
		{
			Header: "Patente",
			accessor: "patente",
			Cell: ({ cell }) => {
				const { original } = cell.row;

				return (
					<InputText
						type="text"
						id="patent"
						defaultValue={fields.patent}
						onChange={handleInputChange}
					/>
				);
			},
		},
		{
			Header: "Número patente",
			accessor: "num",
			Cell: ({ cell }) => {
				const { original } = cell.row;

				return (
					<InputText
						type="text"
						id="num_pat"
						defaultValue={fields.num_pat}
						onChange={handleInputChange}
					/>
				);
			},
		},
		{
			Header: "Status",
			accessor: "status",
			Cell: ({ cell }) => {
				const { original } = cell.row;

				return (
					<Select
						id="status"
						onChange={handleInputChange}
						value={fields.status}
					>
						<option value="">Selecione</option>
						<option value="Concedida">Concedida</option>
						<option value="Depositada">Depositada</option>
						<option value="Em Construção">Em Construção</option>
						<option value="Solicitada">Solicitada</option>
					</Select>
				);
			},
		},
		{
			Header: (
				<RowButton
					type="button"
					small
					onClick={handleAddLineButtonClick}
					secondary
				>
					<PlusIcon />
				</RowButton>
			),
			accessor: "x",
			width: 100,
			Cell: ({ cell }) => {
				const { original } = cell.row;

				return (
					<RowButton
						type="button"
						small
						onClick={() => handleRemoveLineButtonClick(original.id)}
						secondary
					>
						<TrashIcon color="#E75656" />
					</RowButton>
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
			<SpecificationModal
				showModal={showSpecModal}
				handleToggleModal={handleToggleSpecModal}
			/>
			<Container showModal={showModal || showSpecModal}>
				<Header
					title="Cadastro de Matéria-Prima Vegetal"
					showReturnButton
				/>
				<StyledCard>
					<Loading loading={loading} absolute />
					<Form flexFlow="row wrap">
						<FieldSet>
							<FormGroup>
								<Label htmlFor="codLims">Código LIMS</Label>
								<FieldSet alignItems="center">
									<InputNumber
										type="number"
										id="codLims"
										defaultValue={fields.codLims}
										onChange={handleInputChange}
									/>
									<SearchButton small>
										<Search />
									</SearchButton>
								</FieldSet>
							</FormGroup>
							<FormGroup>
								<Label htmlFor="nome_mp">Nome</Label>
								<InputText
									type="text"
									id="nome_mp"
									defaultValue={fields.nome_mp}
									onChange={handleInputChange}
									disabled
								/>
							</FormGroup>
						</FieldSet>
						<FieldSet>
							<FormGroup>
								<Label htmlFor="projects">
									Projetos associados
								</Label>
								<InputText
									type="text"
									id="projects"
									defaultValue={fields.projects}
									onChange={handleInputChange}
									disabled
								/>
							</FormGroup>
						</FieldSet>
						<FieldSet>
							<FormGroup>
								<Label htmlFor="cod_sap">Código SAP</Label>
								<InputText
									type="number"
									id="cod_sap"
									defaultValue={fields.cod_sap}
									onChange={handleInputChange}
									disabled
								/>
							</FormGroup>
							<FormGroup>
								<Label htmlFor="nome_inci">INCI name</Label>
								<InputText
									type="number"
									id="nome_inci"
									defaultValue={fields.nome_inci}
									onChange={handleInputChange}
									disabled
								/>
							</FormGroup>
						</FieldSet>
						<FieldSet>
							<FormGroup>
								<Label htmlFor="status">Status</Label>
								<Select
									id="status"
									onChange={handleInputChange}
									value={fields.status}
								>
									<option value="">Selecione</option>
									<option value="Disponibilizado">
										Disponibilizado
									</option>
									<option value="Em desenvolvimento">
										Em desenvolvimento
									</option>
									<option value="inviavel">Inviável</option>
									<option value="Não estudado">
										Não estudado
									</option>
								</Select>
							</FormGroup>
							<FormGroup>
								<Label htmlFor="status_desenvolv">
									Status do Desenvolvimento
								</Label>
								<Select
									id="status_desenvolv"
									onChange={handleInputChange}
									value={fields.status_desenvolv}
								>
									<option value="">Selecione</option>
									<option value="Bancada">Bancada</option>
									<option value="Em Linha">Em Linha</option>
									<option value="Industrial">
										Industrial
									</option>
									<option value="Não estudado">
										Não estudado
									</option>
									<option value="Piloto">Piloto</option>
								</Select>
							</FormGroup>
							<FormGroup>
								<Label htmlFor="classificacao">
									Classificação
								</Label>
								<Select
									id="classificacao"
									onChange={handleInputChange}
									value={fields.classificacao}
								>
									<option value="">Selecione</option>
									<option value="Derivados de Óleos">
										Derivados de Óleos
									</option>
									<option value="Extrato Aromático">
										Extrato Aromático
									</option>
									<option value="Macromoléculas">
										Macromoléculas
									</option>
									<option value="Metabólitos Secundários">
										Metabólitos Secundários
									</option>
									<option value="Óleo Essencial">
										Óleo Essencial
									</option>
									<option value="Óleos Manteigas">
										Óleos Manteigas
									</option>
									<option value="Outros">Outros</option>
								</Select>
							</FormGroup>
						</FieldSet>
						<FieldSet>
							<FormGroup>
								<Label htmlFor="tipo_mp_veg">
									Tipo da MP Vegetal
								</Label>
								<Select
									id="tipo_mp_veg"
									onChange={handleInputChange}
									value={fields.tipo_mp_veg}
								>
									<option value="">Selecione</option>
									<option value="Amêndoa">Amêndoa</option>
									<option value="Caule">Caule</option>
									<option value="Flores">Flores</option>
									<option value="Folhas">Folhas</option>
									<option value="Galhos">Galhos</option>
									<option value="Partes Aéreas">
										Partes Aéreas
									</option>
									<option value="Polpa">Polpa</option>
									<option value="Raizes">Raizes</option>
									<option value="Resina">Resina</option>
									<option value="Seiva">Seiva</option>
									<option value="Sementes">Sementes</option>
								</Select>
							</FormGroup>
							<FormGroup>
								<Label htmlFor="aparencia">Aparência</Label>
								<InputText
									type="text"
									id="aparencia"
									defaultValue={fields.aparencia}
									onChange={handleInputChange}
								/>
							</FormGroup>
							<FormGroup>
								<Label htmlFor="descri_olfativa">
									Descrição Olfativa (Oléo
									Essencial/Aromático)
								</Label>
								<Select
									id="descri_olfativa"
									onChange={handleInputChange}
									value={fields.descri_olfativa}
								>
									<option value="">Selecione</option>
									<option value="Aromático">Aromático</option>
									<option value="Cítrico">Cítrico</option>
									<option value="Especiarias">
										Especiarias
									</option>
									<option value="Floral">Floral</option>
									<option value="Frutal">Frutal</option>
									<option value="Herbal">Herbal</option>
									<option value="Gourmand">Gourmand</option>
									<option value="Madeira">Madeira</option>
								</Select>
							</FormGroup>
						</FieldSet>
						<FieldSet>
							<FormGroup>
								<Label htmlFor="fornecedores">
									Fornecedores
								</Label>
								<InputText
									type="text"
									id="fornecedores"
									defaultValue={fields.fornecedores}
									onChange={handleInputChange}
								/>
							</FormGroup>
							<FormGroup>
								<Label htmlFor="custo">Custo</Label>
								<InputText
									type="number"
									id="custo"
									defaultValue={fields.custo}
									onChange={handleInputChange}
									disabled
								/>
							</FormGroup>
						</FieldSet>
						<FieldSet>
							<FormGroup>
								<Label htmlFor="rendimento">Rendimento</Label>
								<InputText
									type="text"
									id="rendimento"
									defaultValue={fields.rendimento}
									onChange={handleInputChange}
								/>
							</FormGroup>
							<FormGroup>
								<Label htmlFor="armazenamento">
									Armazenamento
								</Label>
								<InputText
									type="text"
									id="armazenamento"
									defaultValue={fields.armazenamento}
									onChange={handleInputChange}
								/>
							</FormGroup>
							<FormGroup>
								<Label htmlFor="validade">Validade</Label>
								<InputText
									type="text"
									id="validade"
									defaultValue={fields.validade}
									onChange={handleInputChange}
								/>
							</FormGroup>
						</FieldSet>
						<FieldSet>
							<FormGroup>
								<Label htmlFor="specieName">
									Nome da espécie
								</Label>
								<Select
									id="specie"
									onChange={handleInputChange}
									value={fields.specie}
								>
									<option value="">Selecione</option>
									{species.map((specie) => {
										return (
											<option value={specie._id}>
												{specie.popularName}
											</option>
										);
									})}
								</Select>
							</FormGroup>
							<FormGroup>
								<Label htmlFor="origem">Origem</Label>
								<InputText
									type="text"
									id="origem"
									defaultValue={fields.origem}
									onChange={handleInputChange}
									disabled
								/>
							</FormGroup>
							<FormGroup>
								<Label htmlFor="bda_bdb">BDB/BDA</Label>
								<Select
									id="bda_bdb"
									onChange={handleInputChange}
									value={fields.bda_bdb}
									disabled
								>
									<option value="">Selecione</option>
									<option value="BDA">BDA</option>
									<option value="BDB">BDB</option>
									<option value="Exótica">Exótica</option>
								</Select>
							</FormGroup>
							<FormGroup>
								<Label htmlFor="cta">CTA</Label>
								<Select
									id="cta"
									onChange={handleInputChange}
									value={fields.cta}
									disabled
								>
									<option value="">Selecione</option>
									<option value="Sim">Sim</option>
									<option value="Não">Não</option>
								</Select>
							</FormGroup>
						</FieldSet>

						<FieldSet>
							<CellTable columns={columns} data={list} />
						</FieldSet>
						<FieldSet justifyContent="flex-end">
							<ButtonGroup>
								<Button
									type="button"
									style={{ width: "auto" }}
									onClick={handleToggleModal}
									info
								>
									Eficácia
								</Button>
								<Button
									type="button"
									style={{ width: "auto" }}
									onClick={handleToggleSpecModal}
									info
								>
									Especificação
								</Button>
								<Button
									type="button"
									style={{ width: "auto" }}
									info
								>
									Dados Ambientais
								</Button>
								{!newRawMaterial && (
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

export default SpecificationVegetableRMDetailsPage;
