import React, { useState, useEffect} from "react";
import styled from "styled-components";
import Button from "../Layout/Button/Button";
import ButtonGroup from "../Layout/ButtonGroup/ButtonGroup";
import { BackendLIMSAxios } from "../../utils/axiosInstances";

// const token = sessionStorage.getItem("token")

// const header = {
//     headers: {
//       'authorization': `${token}` 
//     }}

const Button2 = styled(Button)`
	margin-top: 70px;
`;

function Configuracoes(props, req) {
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


    const handleRedirectListas= () => {
        props.history.push("/db/listas")
    };

    const handleRedirectUsuarios= () => {
        props.history.push("/db/users")
    };
     
    return (
        <>
            <ButtonGroup>
            <Button2
                    type="button"
                    style={{ width: "auto" }}
                    onClick={handleRedirectUsuarios}
                    info
                >
                    Usuários
                </Button2>

                <Button2
                    type="button"
                    style={{ width: "auto" }}
                    onClick={handleRedirectListas}
                    info
                >
                    Listas
                </Button2>
                
               
            </ButtonGroup>
        </>
    );
}

export default Configuracoes;
