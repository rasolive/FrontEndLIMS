import React, { useState, useEffect} from "react";
import Button from "../../Layout/Button/Button";
import ButtonGroup from "../../Layout/ButtonGroup/ButtonGroup";
import { BackendLIMSAxios } from "../../../utils/axiosInstances";

// const token = sessionStorage.getItem("token")

// const header = {
//     headers: {
//       'authorization': `${token}` 
//     }}



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
     
    const handleRedirectLotes= () => {
        props.history.push("/db/lotes")
    };

    const handleRedirectGrafico= () => {
        props.history.push("/db/grafico")
    };

    return (
        <>
            <ButtonGroup>
                <Button
                    type="button"
                    style={{ width: "auto" }}
                    onClick={handleRedirectReagents}
                    info
                >
                    Reagentes
                </Button>
                
                <Button
                    type="button"
                    style={{ width: "auto" }}
                    onClick={handleRedirectLotes}
                    info
                >
                    Lotes
                </Button>

                <Button
                    type="button"
                    style={{ width: "auto" }}
                    onClick={handleRedirectGrafico}
                    info
                >
                    Graficos
                </Button>
            </ButtonGroup>
        </>
    );
}

export default Home;
