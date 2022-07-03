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

function QualityControlPage(props, req) {
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


    const handleRedirectBackLog= () => {
        props.history.push("/db/QualityControl/BackLog")
    };

    

    return (
        <>
            <ButtonGroup>
                <Button2
                    type="button"
                    style={{ width: "auto" }}
                    onClick={handleRedirectBackLog}
                    info
                >
                    BackLog
                </Button2>

                
            </ButtonGroup>
        </>
    );
}

export default QualityControlPage;
