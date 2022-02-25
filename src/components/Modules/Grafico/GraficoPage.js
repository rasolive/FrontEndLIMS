import React, { useState, useEffect} from "react";
import Plotly from 'plotly.js';
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
	max-width: 800px;
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



const Container = styled.div`
	${(props) =>
		props.showModal &&
		css`
			opacity: ${(props) => (props.showModal ? "0.4" : "none")};
			cursor: ${(props) => props.showModal && "not-allowed"};
			pointer-events: ${(props) => props.showModal && "none"};
		`};
`;


function GraficoPage(props) {
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
    const [plot_2, setPlot_2] = useState();
    const [layout, setLayout] = useState();

	const itemId = props.match.params.id;
	const newItem = itemId === "new";

	useEffect(() => {
		
		async function isAuthenticated() {
			const response = await BackendLIMSAxios.get(`auth/isAuthenticated`, header);


			console.log("10",response)

			if (response.data.isAuthenticated === "true"){

			  	console.log(response.data.isAuthenticated);

			}else {
				props.history.push(`/`);
			};

			setLoading(false);
		}
		
			isAuthenticated()
		

	}, []);

    useEffect(() => {
		
		const plot_2 = async () => {
            const body = Object.assign({}, fields)
            const response = await BackendPythonLIMSAxios.post("plot_2",body);
    
            setLoading(false);
            console.log("15",response)
            console.log("16",response.data.data)
            console.log("17",response.data.layout)
            setPlot_2(response.data.data)
            setLayout(response.data.layout)
            
        
        };
		
        plot_2()

	}, []);



	

	const gerarGrafico = async () => {
		const body = Object.assign({}, fields)
		const response = await BackendPythonLIMSAxios.post("Grafico",body);

		setLoading(false);
		console.log("15",response)
		console.log("25",response.data.data[0])
	    setGraph(response.data.data[0])
        	
	};

	

	const handleFormSubmit = (e) => {
		e.preventDefault();
		setLoading(true);

		gerarGrafico();
	};

	
	
	return (
		<>
			<Modal
				showModal={showModal}
				modalTitle="Tem certeza que deseja excluir este item?"
				modalBody="Caso continue, essas informações serão perdidas!"
					/>
			<Container showModal={showModal}>
				<Header
					title="Grafico"
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



                        </FieldSet>
                        <Hr />
                        <FieldSet>

                            <Plot
                                data={plot_2}
                                layout={layout}
                            />


                        </FieldSet>
                        <FieldSet>

                            <img src ="http://localhost:5000//matplot.png/10"></img>



                        </FieldSet>



                        <FieldSet justifyContent="flex-end">
                            <ButtonGroup>

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

export default GraficoPage;
