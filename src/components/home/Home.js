import React from "react";
import Button from "../Layout/Button/Button";
import ButtonGroup from "../Layout/ButtonGroup/ButtonGroup";


function Home(props) {

    const handleRedirectReagents= () => {
        props.history.push("/db/reagents")
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

            </ButtonGroup>
        </>
    );
}

export default Home;
