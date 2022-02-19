import React, { useState } from "react";
import styled, { css } from "styled-components";
import GoogleLogin from "react-google-login"
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import Card from "../Layout/Card/Card";
import Header from "../Layout/Header/Header";
import FieldSet from "../Layout/FieldSet/FieldSet";
import Form from "../Layout/Form/Form";
import FormGroup from "../Layout/FormGroup/FormGroup";
import Label from "../Layout/Label/Label";
import { InputText, Select, InputNumber} from "../Layout/Input/Input";
import useDynamicForm from "../../hooks/useDynamicForm";
import Button from "../Layout/Button/Button";
import ButtonGroup from "../Layout/ButtonGroup/ButtonGroup";
import { BackendLIMSAxios } from "../../utils/axiosInstances";
import Hr from "../Layout/Hr/Hr";
import './Login.css'

const Container = styled.div`
	${(props) =>
        props.showModal &&
        css`
			opacity: ${(props) => (props.showModal ? "0.4" : "none")};
			cursor: ${(props) => props.showModal && "not-allowed"};
			pointer-events: ${(props) => props.showModal && "none"};
		`};
`;

const StyledCard = styled(Card)`
	max-width: 350px;
    margin: auto;
	overflow: hidden;
	width: 70%;
	justify-content: center;
	align-items: center;
	margin-top: 10%;
`;

const StyledHr = styled(Hr)`
background: #ff9977;
	width: 45%;
	border: 0;
	height: 1px;
`;

const Hr2 = styled(Hr)`
background: #ffffff;
	width: 100%;
	border: 0;
	height: 1px;
`;







function Login(props) {
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [isLoggedIn, setisLoggedIn] = useState(false)
    const { fields, setFields, handleInputChange } = useDynamicForm();
    const [loading, setLoading] = useState(false);

    const responseGoogle = (response) => {
        console.log("google", response);
        const { profileObj: { name, email } } = response;
        setName(name)
        setEmail(email)
        setisLoggedIn(true)
    }

    const responseFacebook = (response) => {
        console.log(response.name);
        setName(response.name)
        setEmail(response.email)
        setisLoggedIn(true)
      }


    async function LoginDb(){
        const body = Object.assign({}, fields)
    
              
            const response = await BackendLIMSAxios.post("ssad",body);
    
            const status = response.status || {};
            const id = response.data.message._id;
            console.log(response)
            console.log(response.data)
            console.log(response.data.message._id)
            if (status === 200) {
                console.log("ok");
    
            }
    }

    const handleFormSubmit = (e) => {
		e.preventDefault();
		setLoading(true);

		LoginDb()
	};

    

    return (
        <>
            <StyledCard>
                <Header title="Faça login na sua conta" />
                <FormGroup>
								<Label htmlFor="email">Endereço de e-mail:</Label>
								<FieldSet style={{
											flexWrap: "wrap",
											alignItems: "center",
										}}>
									<InputText
										type="text"
										id="email"
										defaultValue={fields.email}
										onChange={handleInputChange}
									/>
								</FieldSet>
							</FormGroup>
							<FormGroup>
								<Label htmlFor="senha">Senha:</Label>
								<InputText
									type="text"
									id="senha"
                        defaultValue={fields.senha}
                        onChange={handleInputChange}
                    />
                </FormGroup>
                <ButtonGroup>
                    <Button
                        type="button"
                        success
                        onClick={handleFormSubmit}
                    >
                        Entrar
                    </Button>

                </ButtonGroup>
                <Hr2 />
                <StyledHr />
                ou
                <StyledHr />
                <GoogleLogin
                    clientId="740172199715-nbnl62219tbaq0vov9uekvj5ptcvjm62.apps.googleusercontent.com"
                    buttonText="Faça login com Google"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                    render={renderProps => (
                        <button class="loginBtn loginBtn--google" onClick={renderProps.onClick}  >  Faça login com Google   </button>
                      )} />
                <Hr2 />
                <FacebookLogin
                    appId="1784312231764830"
                    autoLoad={true}
                    fields="name,email,picture"
                    callback={responseFacebook}
                    render={renderProps => (
                        <button class="loginBtn loginBtn--facebook" onClick={renderProps.onClick}  >Faça login com Facebook</button>
                      )}
                                         />

                {isLoggedIn ? props.history.push("/home") : ""}

            </StyledCard>
        </>

    );
}

export default Login;
