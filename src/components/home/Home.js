import React from "react";
import Button from "../Layout/Button/Button";
import ButtonGroup from "../Layout/ButtonGroup/ButtonGroup";


function Home(props) {

    const handleRedirectReagents= () => {
        props.history.push("/db/reagents")
    };
    const handleRedirectUploadFile= () => {
        props.history.push("/upload")
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
                    onClick={handleRedirectUploadFile}
                    info
                >
                    uploadFile
                </Button>
            </ButtonGroup>
        </>
    );
}

export default Home;
