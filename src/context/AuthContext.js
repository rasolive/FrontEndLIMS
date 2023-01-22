import React, { useState } from "react";
import { BackendLIMSAxios } from "../utils/axiosInstances";
import { toast } from "react-toastify";

const AuthContext = React.createContext();



function AuthProvider(props) {

	const [header, setHeader] = useState();

	const [token, setToken] = useState(() => {
		const token = sessionStorage.getItem('token');
		
		if (token) {
		  setHeader({headers: {'authorization': `${token}`}});
		}
	  });
	
	const handleLogin = React.useCallback(async (email, password) => {
		
		const body = Object.assign({})
		body.email = email
		body.password = password
	

		try {
            const response = await BackendLIMSAxios.post("auth/finduser", body);
            if (!body.password)
                toast.error(`preencha a senha`, {
                    closeOnClick: true,
                    autoClose: true,
                });
            else
                try {
                    const response = await BackendLIMSAxios.post("auth/authenticate", body);
					
                    sessionStorage.setItem('token', response.data.token)
                    
                    if(!response.data.user.validPass){
                        return "/resetPass";
                    }else{
						return "/home";
                    }

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
                    
		
	}, []);

	const handleForgotPass = React.useCallback(async (email) => {
		
		const body = Object.assign({})
		body.email = email
	
		try {
            const response = await BackendLIMSAxios.post("auth/finduser", body);
			if(response){
				const response = await BackendLIMSAxios.post("email/forgotPassword", body);
				if(response.status === 200){
					toast.success("Senha alterada com sucesso, verifique sua caixa de e-mail", {
						closeOnClick: true,
						autoClose: 7000,
					});
					return "/";
				}
				else{
					toast.error("Algo deu errado, entre em contato com o administrador do sistema", {
						closeOnClick: true,
						autoClose: 7000,
					});
					return "/";

				}
			}
			else{

				toast.error("Algo deu errado, entre em contato com o administrador do sistema", {
					closeOnClick: true,
					autoClose: 7000,
				});
				return "/";
			}
			
		}
		catch (err) {
            toast.error(`Usuário não encontrado`, {
                closeOnClick: true,
                autoClose: true,
            });
        }                 
     
		
	}, []);

	const userLogged = React.useCallback(() => {
		const token = sessionStorage.getItem('token');
		if (token) {
		  return true;
		}
		return false;
	  }, []);

	return (
		<AuthContext.Provider
			value={{
				handleLogin,
				userLogged,
				header,
				handleForgotPass,
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
}



export { AuthContext, AuthProvider };