import React, { useState, useContext, useCallback } from "react";
import { AuthContext } from "../../context/AuthContext";
import { NavLink as Link } from 'react-router-dom'
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
import { InputText, Checkbox} from "../Layout/Input/Input";
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
	margin-top: 80px;
`;

const LabelHeader = styled(Label)`
        font-size: 16px;
        color: #010606;

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

export const NavLink = styled(Link)`
    color: black;
    font-size: 14px;
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 0 1rem;
    height: 100%;
    cursor: pointer;

    &.active {
        color: #15cdfc;
    }

`


function Login(props) {
    const [name, setName] = useState()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoggedIn, setisLoggedIn] = useState(false)
    const { fields, setFields, handleInputChange } = useDynamicForm();
    const [loading, setLoading] = useState(false);
    const { handleLogin, handleForgotPass } = useContext(AuthContext);
    const [token, setToken] = useState(sessionStorage.getItem("token"));
	const [header, setHeader] = useState({headers: {'authorization': `${token}`}});
    const [showPass, setShowPass] = useState(false);
    const [forgotPass, setForgotPass] = useState(false);

   async function responseGoogle(response) {
       
        const body = Object.assign({}, fields)
        body.tokenId = response.tokenId  
        const token = await BackendLIMSAxios.post("auth/authenticateGoogleUser", body);
        sessionStorage.setItem('token', token.data.token)
        sessionStorage.setItem('load', false)
        setisLoggedIn(true)
        props.history.push(`/home?session=${token.data.token}`)}

     

    async function responseFacebook(response) {
    
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

 
    const handleFormSubmit = useCallback( async (e) => {
		e.preventDefault();
		setLoading(true);

        const response = await handleLogin(email, password)

        props.history.push(response)     
        
    },[email, password]
    )
    
    const handleFormForgotPass = useCallback( async (e) => {
		e.preventDefault();
		setLoading(true);

        const validate = [email];

		if (!validate.every(item => Boolean(item) === true)) {
			toast.error("Preencha Campo \"E-mail\"", {
				closeOnClick: true,
				autoClose: 7000,
			});
			return;
		}
		else {
			if (ValidateEmail(email) === false) {
				toast.error("E-mail inválido",
					{ closeOnClick: true, autoClose: 7000, });
			}
			else {
				    const response = await handleForgotPass(email)

                    props.history.push(response)
				}
		}
             
        
    },[email]
    )
    
    function ValidateEmail(input) {

		var validRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		if (input.match(validRegex)) {

			return true;

		} else {

			return false;

		}

	}

    return (
        <>
            <StyledCard>
                <LabelHeader>Entre com seu E-mail e senha para acessar</LabelHeader>
                <FormGroup>
                    <Label htmlFor="email">Endereço de e-mail:</Label>
                    <FieldSet style={{
                        flexWrap: "wrap",
                        alignItems: "center",
                    }}>
                        <InputText
                            style={{
                                minWidth:'200px'
                            }}
                            type="email"
                            id="email"
                            placeholder="Digite seu e-mail"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </FieldSet>
                </FormGroup>
                {!forgotPass && (
                <FormGroup>
                    <Label htmlFor="password">Senha:</Label>
                    <InputText
                            style={{
                                minWidth:'200px'
                            }}
                        type="password"
                        id="password"
                        placeholder="Digite sua senha"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </FormGroup>
              )}
              {!forgotPass && (
                <ButtonGroup>
                    <Button
                        type="button"
                        success
                        onClick={handleFormSubmit}
                    >
                        Entrar
                    </Button>

                </ButtonGroup>
                )}
                {forgotPass && (
                <ButtonGroup>
                    <Button
                        type="button"
                        success
                        onClick={handleFormForgotPass}
                        large = {true}
                    >
                        Solicitar nova senha
                    </Button>

                </ButtonGroup>
                )}
                {!forgotPass && (
                <FormGroup>
								<Label htmlFor="showPass">Mostrar senha:
								<Checkbox
									type= 'checkbox'
									id="showPass"
									onClick={()=>{setShowPass(!showPass);
										if(showPass === true){document.getElementById('password').setAttribute('type', 'password')}
									else{document.getElementById('password').setAttribute('type', 'text')}
								
								}}
									checked= {showPass}
								/></Label>
								
								
							</FormGroup>
                )}

                            <FormGroup>
								<Label htmlFor="forgotPass">Esqueci a senha:
								<Checkbox
									type= 'checkbox'
									id="forgotPass"
									onClick={()=>{setForgotPass(!forgotPass)}}
									checked= {forgotPass}
								/></Label>
								
								
							</FormGroup>
                <Hr2 />
                {!forgotPass && (
                <NavLink to={`/register`}>
                    Não tem uma conta? cadastre-se
                </NavLink>)}

                {!forgotPass && (
                <Hr2 />)}
                {!forgotPass && (
                <StyledHr /> )}
                {!forgotPass && <label>ou</label> }
                    {!forgotPass && (<StyledHr />
                )}
                {!forgotPass && (
                <GoogleLogin
                    clientId= {process.env.REACT_APP_GOOGLE_CLIENT_ID}
                    buttonText="Faça login com Google"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                    render={renderProps => (
                        <button class="loginBtn loginBtn--google" onClick={renderProps.onClick}  >  Faça login com Google </button>
                    )} />)}
                <Hr2 />
                {/* <FacebookLogin
                    appId=""
                    autoLoad={true}
                    fields="name,email,picture"
                    callback={responseFacebook}
                    render={renderProps => (
                        <button class="loginBtn loginBtn--facebook" onClick={renderProps.onClick}  >Faça login com Facebook</button>
                      )}
                                         /> */}


            </StyledCard>
        </>

    );
}

export default Login;
