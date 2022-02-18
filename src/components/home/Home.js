import React from "react";
import Button from "../Layout/Button/Button";
import ButtonGroup from "../Layout/ButtonGroup/ButtonGroup";


function Home(props) {

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
