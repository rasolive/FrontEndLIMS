import axios from "axios";

// const SELF_ENVIRONMENT = process.env.REACT_APP_SELF_ENVIRONMENT;

// TODO: use env vars for the URIs

// const sessionToken = () => {
// 	const session = JSON.parse(sessionStorage.getItem("session"));
// 	return session && session.token;
// };

// For common config
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.interceptors.request.use((config) => {
	config.params = config.params || {};
	// config.params["token"] = sessionToken();
	return config;
});

// Backend Node
const BackendLIMSAxios = axios.create({
	//baseURL: `http://localhost:8089/v1/`,
	baseURL: `http://192.168.1.93:8089/v1/`,
});

BackendLIMSAxios.interceptors.request.use((config) => {
	config.params = config.params || {};
	return config;
});

// Backend Node
const BackendPythonLIMSAxios = axios.create({
	//baseURL: `http://localhost:5000/`,
	baseURL: `http://192.168.1.93:5000/v1/`,
});

BackendPythonLIMSAxios.interceptors.request.use((config) => {
	config.params = config.params || {};
	return config;
});



export {
	BackendLIMSAxios,
	BackendPythonLIMSAxios,
};
