import React, { useState, useEffect} from "react";
import Plot from 'react-plotly.js';
import { toast } from "react-toastify";
import { BackendLIMSAxios, BackendPythonLIMSAxios } from "../../../utils/axiosInstances";
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
//import { header } from "../../../utils/functions";


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


function EstatisticasPage(props) {
	const page = `reagents`
	const gcpPatch = `prd/anexos/${page}`
	const item = `Reagente`

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
    const [graph, setGraph] = useState();
    const [statusLotes, setStatusLotes] = useState();
	const [statusMateriais, setStatusMateriais] = useState();
	const [fornecedoresMap, setFornecedoresMap] = useState();
    const [layoutLotes, setLayoutLotes] = useState();
	const [layoutMateriais, setLayoutMateriais] = useState();
	const [layoutFornecedores, setLayoutFornecedores] = useState();

	const itemId = props.match.params.id;
	const newItem = itemId === "new";

	
    useEffect(() => {
		
		const statusLotes = async () => {
            const body = Object.assign({}, fields)

            const statusLotes = await BackendPythonLIMSAxios.post("statusLotes",body);
			setStatusLotes(statusLotes.data.data)
			setLayoutLotes(statusLotes.data.layout)

			const statusMateriais = await BackendPythonLIMSAxios.post("statusMateriais",body);
			setStatusMateriais(statusMateriais.data.data)
			setLayoutMateriais(statusMateriais.data.layout)

			const fornecedoresMap = await BackendPythonLIMSAxios.post("fornecedoresMap",body);
			setFornecedoresMap(fornecedoresMap.data.data)
			setLayoutFornecedores(fornecedoresMap.data.layout)
    
            //setLoading(false);

            
        
        };
		
        statusLotes()

	}, []);



	

	// const gerarGrafico = async () => {
	// 	const body = Object.assign({}, fields)
	// 	const response = await BackendPythonLIMSAxios.post("Grafico",body);

	// 	setLoading(false);

	//     setGraph(response.data.data[0])
        	
	// };

	

	// const handleFormSubmit = (e) => {
	// 	e.preventDefault();
	// 	setLoading(true);

	// 	gerarGrafico();
	// };

	
	
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
						{/* <FieldSet
						style={{
							flexWrap: "wrap",
							alignItems: "center",
						}}>
							<FormGroup>
								<Label htmlFor="name">Empresa</Label>
								<FieldSet style={{
											flexWrap: "wrap",
											alignItems: "center",
										}}>
									<InputText
										type="text"
										id="name"
										defaultValue={fields.name}
										onChange={handleInputChange}
									/>
								</FieldSet>
							</FormGroup>
                            <FormGroup>
                                <Label htmlFor="ano">Ano Inicial</Label>
                                <InputText
                                    type="text"
                                    id="ano"
                                    defaultValue={fields.ano}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                        </FieldSet>

                        
                        <FieldSet>

                            <Plot
                                data={[graph]}


                            />



                        </FieldSet> */}
                        {/* <Hr /> */}
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
								autosize = {true}
								config={{displayModeBar: false}}
								style={{width: "100%", height: "350px", minWidth: "320px", maxWidth: "400px"}}
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
								autosize = {true}
								config={{displayModeBar: false}}
								style={{width: "100%", height: "350px", minWidth: "320px", maxWidth: "400px"}}
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
                       
							{fornecedoresMap && 
                            <Plot
                                data={fornecedoresMap}
                                layout={layoutFornecedores}
								useResizeHandler={true}
								autosize = {true}
								config={{displayModeBar: false}}
								style={{width: "100%", height: "350px", minWidth: "300px", maxWidth: "800px"}}
                            />}                      
							</FormGroup>
								
							
		
						</FieldSet>



                        {/* <FieldSet>

                            <img src ="http://localhost:5000//matplot.png/10"></img>



                        </FieldSet> */}



                        <FieldSet justifyContent="flex-end">
                            <ButtonGroup>

                                {/* <Button
                                    type="button"
                                    success
                                    onClick={handleFormSubmit}
                                >
                                    Salvar
                                </Button> */}
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

export default EstatisticasPage;
