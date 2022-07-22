import React, { useState } from "react";
import { BackendLIMSAxios } from "../utils/axiosInstances";
import { toast } from "react-toastify";

const AuthContext = React.createContext();



function AuthProvider(props) {

	const [header, setHeader] = useState();

	const [token, setToken] = useState(() => {
		const token = sessionStorage.getItem('token');
		console.log('token', token)		
		if (token) {
		  setHeader({headers: {'authorization': `${token}`}});
		}
	  });
	
	const handleLogin = React.useCallback(async (email, password) => {
		
		const body = Object.assign({})
		body.email = email
		body.password = password
		console.log(body)

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
					console.log('vali',response.data.user.validPass)

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
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
}



export { AuthContext, AuthProvider };