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

    useEffect(() => {
		console.log("36", props.history.location.search.session)
        const session = props.history.location.search.replace("?session=","")
		async function isAuthenticated() {
			const response = await BackendLIMSAxios.get(`auth/isAuthenticated`, {
                headers: {
                  'authorization': `${session}` 
                }});


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
            </ButtonGroup>
        </>
    );
}

export default Home;
