import React from "react";
import ReactDOM from "react-dom";

import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { ThemeProvider } from "styled-components";
import axios from "axios";

import App from "./App";

import "react-toastify/dist/ReactToastify.css";
import "./index.css";

import { toast, ToastContainer } from "react-toastify";

const history = createBrowserHistory();

axios.defaults.baseURL = process.env.REACT_APP_DATA_BACK_END_URL;
//axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
axios.defaults.headers.post["Content-Type"] = "application/json";

axios.interceptors.response.use(
	(response) => {
		const { data } = response;

		if (data && Object.keys(data).indexOf("success") !== -1) {
			if (!data.success) {
				toast.error(
					data.message || "Ocorreu um erro ao carregar os dados."
				);
			}
		} else if (
			typeof data === "string" &&
			data.includes("Acesso não autorizado")
		) {
			sessionStorage.removeItem("session");
			history.push("/login");
		}

		return response;
	},
	(error) => {
		let message = "Ocorreu um erro na resposta";

		if (error.response) {
			console.error("Ocorreu um erro na resposta.");
			console.error(error.response.data);
			console.error(error.response.status);
			console.error(error.response.headers);
			const pathname = history.location.pathname;
			const fromLogin = pathname === "/login";

			if (error.response.status === 401) {
				message = "Usuário e/ou senha inválidos";
				fromLogin
					? history.push("/initial-page")
					: history.push("/login");
			}
		} else if (error.request) {
			message = "Ocorreu um erro com a requisição";
			console.error("Ocorreu um erro com a requisição.", error.request);
		} else {
			console.log("Error", error.message);
		}

		toast.error(message);

		return Promise.reject(error);
	}
);

const theme = {
	primary: "#ff9933",
	secondary: "#FFFFFF",
	primaryDark: "#e67300",
	secondaryDark: "#d9d9d9",
};

ReactDOM.render(
	<Router history={history}>
		<ThemeProvider theme={theme}>
			<App />
		</ThemeProvider>
		<ToastContainer autoClose={3000} />
	</Router>,
	document.getElementById("root")
);
