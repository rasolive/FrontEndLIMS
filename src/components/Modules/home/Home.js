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



			console.log("10",response)

			if (response.data.isAuthenticated === "true"){

			  	console.log(response.data.isAuthenticated);

			}else {
				props.history.push(`/`);
                setLoading(true);
			};

			setLoading(true);
		}
		
			isAuthenticated()
		

	}, []);


    const handleRedirectReagents= () => {
        props.history.push("/db/reagents")
    };

    const handleRedirectFornecedores= () => {
        props.history.push("/db/fornecedores")
    };
     
    const handleRedirectLotes= () => {
        props.history.push("/db/lotes")
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
                    onClick={handleRedirectReagents}
                    info
                >
                    Reagentes
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
                    Lotes
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
