import React, { useState, useEffect} from "react";
import styled from "styled-components";
import Button from "../../Layout/Button/Button";
import ButtonGroup from "../../Layout/ButtonGroup/ButtonGroup";
import { BackendLIMSAxios } from "../../../utils/axiosInstances";

// const token = sessionStorage.getItem("token")

// const header = {
//     headers: {
//       'authorization': `${token}` 
//     }}

const Button2 = styled(Button)`
	margin-top: 70px;
`;

function Home(props, req) {
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(sessionStorage.getItem("token"));
	const [header, setHeader] = useState({headers: {'authorization': `${token}`}});

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

			setLoading(true);
		}
		
			isAuthenticated()		

	}, []);


    const handleRedirectMateriais= () => {
        props.history.push("/db/materiais")
    };

    const handleRedirectSpecification= () => {
        props.history.push("/db/specification")
    };

    const handleRedirectFornecedores= () => {
        props.history.push("/db/fornecedores")
    };

    
    const handleRedirectLotes= () => {
        props.history.push("/db/lotes")
    };
    
    const handleRedirectQualityControl = () => {
        props.history.push("/db/qualitycontrol")
    };


    const handleRedirectGrafico= () => {
        props.history.push("/db/grafico")
    };

    return (
        <>
            <ButtonGroup>
                <Button2
                    type="button"
                    style={{ width: "auto" }}
                    onClick={handleRedirectMateriais}
                    info
                >
                    Materiais
                </Button2>

                <Button2
                    type="button"
                    style={{ width: "auto" }}
                    onClick={handleRedirectSpecification}
                    info
                >
                    Especificações
                </Button2>

                <Button2
                    type="button"
                    style={{ width: "auto" }}
                    onClick={handleRedirectFornecedores}
                    info
                >
                    Fornecedores
                </Button2>
                               
                
                <Button2
                    type="button"
                    style={{ width: "auto" }}
                    onClick={handleRedirectLotes}
                    info
                >
                    Cadastro de Lotes
                </Button2>

                <Button2
                    type="button"
                    style={{ width: "auto" }}
                    onClick={handleRedirectQualityControl}
                    info
                >
                    Controle de Qualidade
                </Button2>

                <Button2
                    type="button"
                    style={{ width: "auto" }}
                    onClick={handleRedirectGrafico}
                    info
                >
                    Graficos
                </Button2>
            </ButtonGroup>
        </>
    );
}

export default Home;
