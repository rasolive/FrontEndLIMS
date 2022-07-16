import axios from "axios";


// For common config
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.interceptors.request.use((config) => {
	config.params = config.params || {};
	// config.params["token"] = sessionToken();
	return config;
});


// Backend Node
const BackendLIMSAxios = axios.create({
	baseURL: process.env.REACT_APP_BACKEND_NODE_URI,
	
});

BackendLIMSAxios.interceptors.request.use((config) => {
	config.params = config.params || {};
	return config;
});

// Backend Node
const BackendPythonLIMSAxios = axios.create({
	baseURL: process.env.REACT_APP_BACKEND_PYTHON_URI,
});

BackendPythonLIMSAxios.interceptors.request.use((config) => {
	config.params = config.params || {};
	return config;
});



export {
	BackendLIMSAxios,
	BackendPythonLIMSAxios,
};
