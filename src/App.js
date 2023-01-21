import React, { useState, useEffect} from "react";
import { BackendLIMSAxios } from "./utils/axiosInstances";

import { Switch, Route, withRouter, Redirect } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import AboutPage from "./components/Modules/About/AboutPage";
import ContactPage from "./components/Modules/About/ContactPage";
import PrivateRoutes from "./routes/PrivateRoutes"
import HomePage from "./components/Home/HomePage";
import Home from "./components/Modules/home/Home";
import Configuracoes from "./components/Configuracoes/Configuracoes";
import Login from "./components/Login/Login";
import NotFoundPage from "./components/Modules/NotFound/NotFoundPage";
import MateriaisListPage from "./components/Modules/Materiais/MateriaisListPage";
import MateriaisDetailsPage from "./components/Modules/Materiais/MateriaisDetailsPage";
import FornecedoresListPage from "./components/Modules/Fornecedores/FornecedoresListPage";
import FornecedoresDetailsPage from "./components/Modules/Fornecedores/FornecedoresDetailsPage";
import ListasDetailsPage from "./components/Configuracoes/Listas/ListasDetailsPage";
import ListasListPage from "./components/Configuracoes/Listas/ListasListPage";
import UsuariosListPage from "./components/Configuracoes/Usuarios/UsuariosListPage";
import UsuariosDetailsPage from "./components/Configuracoes/Usuarios/UsuariosDetailsPage";
import PermissionsListPage from "./components/Configuracoes/Permissoes/PermissionsListPage";
import PermissionsDetailsPage from "./components/Configuracoes/Permissoes/PermissionsDetailsPage";
import ResetPassPage from "./components/Login/resetPass";
import RegisterPage from "./components/Login/Register";
import AnalysisListPage from "./components/Modules/Analysis/AnalysisListPage";
import AnalysisDetailsPage from	"./components/Modules/Analysis/AnalysisDetailsPage";
import AnalysisMethodDetailsPage from "./components/Modules/AnalysisMethod/AnalysisMethodDetailsPage";
import AnalysisMethodListPage from "./components/Modules/AnalysisMethod/AnalysisMethodListPage";
import SpecificationListPage from "./components/Modules/Specification/SpecificationListPage";
import SpecificationDetailsPage from "./components/Modules/Specification/SpecificationDetailsPage";
import QualityControlPage from "./components/Modules/QualityControl/Home";
import BackLogListPage from "./components/Modules/QualityControl/BackLogCQ/BackLogCQListPage";
import BackLogDetailsPage from "./components/Modules/QualityControl/BackLogCQ/BackLogCQDetailsPage";
import AprovadosListPage from "./components/Modules/QualityControl/BackLogCQ/AprovadosCQListPage";
import ReprovadosListPage from "./components/Modules/QualityControl/BackLogCQ/ReprovadosCQListPage";
import LotesListPage from "./components/Modules/Lotes/LotesListPage";
import LotesDetailsPage from "./components/Modules/Lotes/LotesDetailsPage";
import EstatisticasPage from "./components/Modules/Estatisticas/EstatisticasPage";



function App() {
	const [token, setToken] = useState(sessionStorage.getItem("token"));
	const [header, setHeader] = useState({headers: {'authorization': `${token}`}});

	useEffect(() => {
		async function getStatusMaterial() {
			const body = {name:'Status Material'}
			
			const response = await BackendLIMSAxios.post("listas/lista",body, header);
			const data = response.data[0]?.lista || [];
			console.log('data55', data)
	
		}

		
		getStatusMaterial()
	
		
	}, []);

	const role = {"FornecedoresListPage":['S', 'V', 'AC']
					}
	console.log('role1',role.FornecedoresListPage)

	return (
		
		<AuthProvider>
			<Switch>
				<Route exact path="/sobre" name="AboutPage" component={AboutPage} />
				<Route exact path="/contato" name="ContactPage" component={ContactPage} />
				<Route exact path="/" name="HomePage" component={HomePage} />
				<Route exact path="/login" name="Login" component={Login} />
				<Route exact path="/register" name="Register" component={RegisterPage} />
				<Route exact path="/resetPass" name="resetPass" component={ResetPassPage} />
                <PrivateRoutes role={['S', 'V', 'AQ', 'GQ', 'AC']} exact path="/home" component={Home} />
				<PrivateRoutes role={['S', 'V', 'AQ', 'GQ', 'AC']} exact path="/db/estatisticas" name="EstatisticasPage" component={EstatisticasPage}/>
				<PrivateRoutes role={['S', 'V', 'AC', 'AQ', 'GQ']} exact path="/db/lotes" name="LotesListPage" component={LotesListPage}/>
                <PrivateRoutes role={['S', 'V', 'AC', 'AQ', 'GQ']} exact path="/db/lotes/:id" name="LotesDetailsPage" component={LotesDetailsPage}/>
                <PrivateRoutes role={['S', 'V', 'AC']} exact path="/db/materiais" name="MateriaisListPage" component={MateriaisListPage}/>
				<PrivateRoutes role={['S', 'V', 'AQ', 'GQ']} exact path="/db/backlog" name="BackLogListPage" component={BackLogListPage}/>
                <PrivateRoutes role={['S', 'V', 'AC']} exact path="/db/materiais/:id" name="MateriaisDetailsPage" component={MateriaisDetailsPage}/>
				<PrivateRoutes role={role.FornecedoresListPage} exact path="/db/Fornecedores" name="FornecedoresListPage" component={FornecedoresListPage}/>
				<PrivateRoutes role={['S', 'V', 'AC']} exact path="/db/Fornecedores/:id" name="FornecedoresDetailsPage" component={FornecedoresDetailsPage}/>
				<PrivateRoutes role={['S', 'V', 'AQ', 'GQ']} exact path="/db/backlog/:id" name="BackLogDetailsPage" component={BackLogDetailsPage}/>
				<PrivateRoutes role={['S', 'V', 'AQ', 'GQ']} exact path="/db/analysis" name="AnalysisListPage" component={AnalysisListPage}/>
				<PrivateRoutes role={['S', 'V', 'AQ', 'GQ']} exact path="/db/analysis/:id" name="AnalysisDetailsPage" component={AnalysisDetailsPage}/>
				<PrivateRoutes role={['S', 'V', 'AQ', 'GQ']} exact path="/db/analysisMethod" name="AnalysisMethodListPage" component={AnalysisMethodListPage}/>
				<PrivateRoutes role={['S', 'V', 'AQ', 'GQ']} exact path="/db/analysisMethod/:id" name="AnalysisMethodDetailsPage" component={AnalysisMethodDetailsPage}/>
				<PrivateRoutes role={['S', 'V', 'AQ', 'GQ']} exact path="/db/specification" name="SpecificationListPage" component={SpecificationListPage}/>
				<PrivateRoutes role={['S', 'V', 'AQ', 'GQ']} exact path="/db/specification/:id" name="SpecificationDetailsPage" component={SpecificationDetailsPage}/>
				<PrivateRoutes role={['S', 'V', 'AQ', 'GQ']} exact path= "/db/qualityControl" name="QualityControlPage" component={QualityControlPage}/>
				<PrivateRoutes role={['S', 'V', 'AQ', 'GQ']} exact path="/db/qualityControl/backlog" name="BackLogListPage" component={BackLogListPage}/>
				<PrivateRoutes role={['S', 'V', 'AQ', 'GQ']} exact path="/db/qualityControl/backlog/:id" name="BackLogDetailsPage" component={BackLogDetailsPage}/>
				<PrivateRoutes role={['S', 'V', 'AQ', 'GQ']} exact path="/db/qualityControl/aprovados" name="AprovadosListPage" component={AprovadosListPage}/>
				<PrivateRoutes role={['S', 'V', 'AQ', 'GQ']} exact path="/db/qualityControl/reprovados" name="ReprovadosListPage" component={ReprovadosListPage}/>
				<PrivateRoutes role={['S']} exact path="/configuracoes" name="Configuracoes" component={Configuracoes}/>
				<PrivateRoutes role={['S']} exact path="/db/Listas" name="ListasListPage" component={ListasListPage}/>
				<PrivateRoutes role={['S']} exact path="/db/Listas/:id" name="ListasDetailsPage" component={ListasDetailsPage}/>
				<PrivateRoutes role={['S']} exact path="/db/users" name="UsuariosListPage" component={UsuariosListPage}/>
				<PrivateRoutes role={['S']} exact path="/db/users/:id" name="UsuariosDetailsPage" component={UsuariosDetailsPage}/>
				<PrivateRoutes role={['S']} exact path="/db/permissions" name="UsuariosListPage" component={PermissionsListPage}/>
				<PrivateRoutes role={['S']} exact path="/db/permissions/:id" name="UsuariosDetailsPage" component={PermissionsDetailsPage}/>


			    <Route component={NotFoundPage} />
				//<Redirect push from="/" exact to="/login"/>
			</Switch>
		</AuthProvider>
		
	);
}

export default withRouter(App);
