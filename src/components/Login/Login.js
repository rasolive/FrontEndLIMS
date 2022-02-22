import React, { useState } from "react";
import { toast } from "react-toastify";
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

   async function responseGoogle(response) {
        console.log("google", response);
        const { profileObj: { name, email } } = response;
        setName(name)
        setEmail(email)
        const body = Object.assign({}, fields)
        body.name = name
        body.email = email
        body.role = "visitante"
        const token = await BackendLIMSAxios.post("auth/authenticatevisitant", body);

        sessionStorage.setItem('token', token.data.token)
        setisLoggedIn(true)
        props.history.push(`/home?session=${token.data.token}`)
    }

    async function responseFacebook(response) {
        console.log(response.name);
        setName(response.name)
        setEmail(response.email)
        const body = Object.assign({}, fields)
        body.name = response.name
        body.email = response.email
        body.role = "visitante"
        const token = await BackendLIMSAxios.post("auth/authenticatevisitant", body);

        sessionStorage.setItem('token', token.data.token)
        setisLoggedIn(true)
        props.history.push(`/home?session=${token.data.token}`)
      }


    async function LoginDb() {
        const body = Object.assign({}, fields)

        try {
            const response = await BackendLIMSAxios.post("auth/finduser", body);
            console.log("1", body)
            if (!body.password)
                toast.error(`preencha a senha`, {
                    closeOnClick: true,
                    autoClose: true,
                });
            else
                try {
                    const response = await BackendLIMSAxios.post("auth/authenticate", body);

                    sessionStorage.setItem('token', response.data.token)
                    props.history.push(`/home?session=${response.data.token}`)
                }
                catch (err) {
                    toast.error(`Senha inválida`, {
                        closeOnClick: true,
                        autoClose: true,
                    });
                }

        }
        catch (err) {
            toast.error(`Usuário não encontrado`, {
                closeOnClick: true,
                autoClose: true,
            });
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
								<Label htmlFor="password">Senha:</Label>
								<InputText
									type="text"
									id="password"
                        defaultValue={fields.password}
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


            </StyledCard>
        </>

    );
}

export default Login;
