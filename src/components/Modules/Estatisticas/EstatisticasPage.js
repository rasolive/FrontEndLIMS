import React, { useState, useEffect } from "react";
import Plot from 'react-plotly.js';
import { BackendPythonLIMSAxios } from "../../../utils/axiosInstances";
import useDynamicForm from "../../../hooks/useDynamicForm";
import Header from "../../Layout/Header/Header";
import Modal from "../../Layout/Modal/Modal";
import Form from "../../Layout/Form/Form";
import Card from "../../Layout/Card/Card";
import FormGroup from "../../Layout/FormGroup/FormGroup";
import FieldSet from "../../Layout/FieldSet/FieldSet";
import styled, { css } from "styled-components";
import Loading from "../../Layout/Loading/Loading";

const StyledCard = styled(Card)`
	max-width: 900px;
	margin: auto;
	z-index: 0;
	overflow: hidden;
	//position: relative;
	width: 80%;
	justify-content: center;
	align-items: center;
	margin-bottom: 1%;
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


function EstatisticasPage(props) {

	const { fields, setFields, handleInputChange } = useDynamicForm();
	const [loading, setLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [statusLotes, setStatusLotes] = useState();
	const [statusMateriais, setStatusMateriais] = useState();
	const [layoutLotes, setLayoutLotes] = useState();
	const [layoutMateriais, setLayoutMateriais] = useState();
	const [userProfiles, setUserProfiles] = useState();
	const [layoutUserProfiles, setLayoutUserProfiles] = useState();
	const [prazoValidade, setPrazoValidade] = useState();
	const [layoutPrazoValidade, setLayoutPrazoValidade] = useState();
	const [suppliersMaterials, setSuppliersMaterials] = useState();
	const [layoutSuppliersMaterials, setLayoutSuppliersMaterials] = useState();

	useEffect(() => {

		const statusLotes = async () => {
			const body = Object.assign({}, fields)

			const suppliersMaterials = await BackendPythonLIMSAxios.post("suppliersMaterials", body);
			setSuppliersMaterials(suppliersMaterials.data.data)
			setLayoutSuppliersMaterials(suppliersMaterials.data.layout)

			const statusMateriais = await BackendPythonLIMSAxios.post("statusMateriais", body);
			setStatusMateriais(statusMateriais.data.data)
			setLayoutMateriais(statusMateriais.data.layout)

			const statusLotes = await BackendPythonLIMSAxios.post("statusLotes", body);
			setStatusLotes(statusLotes.data.data)
			setLayoutLotes(statusLotes.data.layout)

			const prazoValidade = await BackendPythonLIMSAxios.post("prazoValidade", body);
			setPrazoValidade(prazoValidade.data.data)
			setLayoutPrazoValidade(prazoValidade.data.layout)

			const userProfiles = await BackendPythonLIMSAxios.post("userProfiles", body);
			setUserProfiles(userProfiles.data.data)
			setLayoutUserProfiles(userProfiles.data.layout)

		};

		statusLotes()

	}, []);



	return (
		<>
			<Modal
				showModal={showModal}
				modalTitle="Tem certeza que deseja excluir este item?"
				modalBody="Caso continue, essas informações serão perdidas!"
			/>
			<Container showModal={showModal}>
				<Header
					title="Estatísticas do sistema"
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
							<FormGroup
								style={{
									flexWrap: "wrap",
									alignItems: "center",
								}}>

								{suppliersMaterials &&
									<Plot
										data={suppliersMaterials}
										layout={layoutSuppliersMaterials}
										useResizeHandler={true}
										autosize={true}
										config={{ displayModeBar: false }}
										style={{ width: "100%", height: "350px", minWidth: "300px", maxWidth: "800px" }}
									/>}
							</FormGroup>
							<FormGroup
								style={{
									flexWrap: "wrap",
									alignItems: "center",
								}}>
								{statusMateriais &&
									<Plot
										data={statusMateriais}
										layout={layoutMateriais}
										useResizeHandler={true}
										autosize={true}
										config={{ displayModeBar: false }}
										style={{ width: "100%", height: "350px", minWidth: "320px", maxWidth: "400px" }}
									/>}


							</FormGroup>

						</FieldSet>
						<FieldSet
							style={{
								flexWrap: "wrap",
								alignItems: "center",
							}}>
							<FormGroup
								style={{
									flexWrap: "wrap",
									alignItems: "center",
								}}>

								{statusLotes &&
									<Plot
										data={statusLotes}
										layout={layoutLotes}
										useResizeHandler={true}
										autosize={true}
										config={{ displayModeBar: false }}
										style={{ width: "100%", height: "350px", minWidth: "320px", maxWidth: "400px" }}
									/>}



							</FormGroup>
							<FormGroup
								style={{
									flexWrap: "wrap",
									alignItems: "center",
								}}>

								{prazoValidade &&
									<Plot
										data={prazoValidade}
										layout={layoutPrazoValidade}
										useResizeHandler={true}
										autosize={true}
										config={{ displayModeBar: false }}
										style={{ width: "100%", height: "350px", minWidth: "300px", maxWidth: "800px" }}
									/>}
							</FormGroup>

						</FieldSet>

						<FieldSet
							style={{
								flexWrap: "wrap",
								alignItems: "center",
							}}>
							<FormGroup
								style={{
									flexWrap: "wrap",
									alignItems: "center",
								}}>

								{userProfiles &&
									<Plot
										data={userProfiles}
										layout={layoutUserProfiles}
										useResizeHandler={true}
										autosize={true}
										config={{ displayModeBar: false }}
										style={{ width: "100%", height: "350px", minWidth: "300px", maxWidth: "800px" }}
									/>}
							</FormGroup>

						</FieldSet>

						<FieldSet justifyContent="flex-end">
						</FieldSet>
					</Form>
				</StyledCard>
			</Container>
		</>
	);
}

export default EstatisticasPage;
