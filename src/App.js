import React from "react";

import { Switch, Route, withRouter, Redirect } from "react-router-dom";

import HomePage from "./components/Home/HomePage";
import Home from "./components/Modules/home/Home";
import Configuracoes from "./components/Configuracoes/Configuracoes";
import Login from "./components/Login/Login";
// import HomeToLogin from "./components/Redirects/HomeToLogin.js";
// import Layout from "./components/Layout/Layout";
// import LoginPage from "./components/Login/LoginPage";
import NotFoundPage from "./components/Modules/NotFound/NotFoundPage";
import MateriaisListPage from "./components/Modules/Materiais/MateriaisListPage";
// import { AuthProvider } from "./context/AuthContext";
import MateriaisDetailsPage from "./components/Modules/Materiais/MateriaisDetailsPage";
import FornecedoresListPage from "./components/Modules/Fornecedores/FornecedoresListPage";
import FornecedoresDetailsPage from "./components/Modules/Fornecedores/FornecedoresDetailsPage";
import ListasDetailsPage from "./components/Configuracoes/Listas/ListasDetailsPage";
import ListasListPage from "./components/Configuracoes/Listas/ListasListPage";
import UsuariosListPage from "./components/Configuracoes/Usuarios/UsuariosListPage";
import UsuariosDetailsPage from "./components/Configuracoes/Usuarios/UsuariosDetailsPage";
import ResetPassPage from "./components/Login/resetPass";
import RegisterPage from "./components/Login/Register";
import AnalysisListPage from "./components/Configuracoes/Analysis/AnalysisListPage";
import AnalysisDetailsPage from	"./components/Configuracoes/Analysis/AnalysisDetailsPage";
import AnalysisMethodDetailsPage from "./components/Configuracoes/AnalysisMethod/AnalysisMethodDetailsPage";
import AnalysisMethodListPage from "./components/Configuracoes/AnalysisMethod/AnalysisMethodListPage";
import SpecificationListPage from "./components/Modules/Specification/SpecificationListPage";
import SpecificationDetailsPage from "./components/Modules/Specification/SpecificationDetailsPage";
import BackLogListPage from "./components/Modules/QualityControl/BackLogCQ/BackLogCQListPage";
import BackLogDetailsPage from "./components/Modules/QualityControl/BackLogCQ/BackLogCQDetailsPage";
import QualityControlPage from "./components/Modules/QualityControl/Home";



import LotesListPage from "./components/Modules/Lotes/LotesListPage";
// import { AuthProvider } from "./context/AuthContext";
import LotesDetailsPage from "./components/Modules/Lotes/LotesDetailsPage";
import GraficoPage from "./components/Modules/Grafico/GraficoPage";



function App() {
	return (
		// <AuthProvider>
			<Switch>
				<Route path="/" exact name="HomePage" component={HomePage} />
				<Route path="/login" exact name="Login" component={Login} />
				<Route path="/register" exact name="Register" component={RegisterPage} />
				<Route path="/resetPass" exact name="resetPass" component={ResetPassPage} />
                <Route path="/home" exact name="Home" component={Home} />
                <Route exact path="/db/materiais" name="MateriaisListPage" component={MateriaisListPage}/>
                <Route exact path="/db/materiais/:id" name="MateriaisDetailsPage" component={MateriaisDetailsPage}/>
				<Route exact path="/db/Fornecedores" name="FornecedoresListPage" component={FornecedoresListPage}/>
				<Route exact path="/db/Fornecedores/:id" name="FornecedoresDetailsPage" component={FornecedoresDetailsPage}/>
				<Route exact path="/db/Listas" name="ListasListPage" component={ListasListPage}/>
				<Route exact path="/db/Listas/:id" name="ListasDetailsPage" component={ListasDetailsPage}/>
				<Route exact path="/db/lotes" name="LotesListPage" component={LotesListPage}/>
                <Route exact path="/db/lotes/:id" name="LotesDetailsPage" component={LotesDetailsPage}/>
				<Route exact path="/db/backlog" name="BackLogListPage" component={BackLogListPage}/>
				<Route exact path="/db/backlog/:id" name="BackLogDetailsPage" component={BackLogDetailsPage}/>
				<Route exact path="/db/grafico" name="GraficoPage" component={GraficoPage}/>
				<Route exact path="/configuracoes" name="Configuracoes" component={Configuracoes}/>
				<Route exact path="/db/users" name="UsuariosListPage" component={UsuariosListPage}/>
				<Route exact path="/db/users/:id" name="UsuariosDetailsPage" component={UsuariosDetailsPage}/>
				<Route exact path="/db/analysis" name="AnalysisListPage" component={AnalysisListPage}/>
				<Route exact path="/db/analysis/:id" name="AnalysisDetailsPage" component={AnalysisDetailsPage}/>
				<Route exact path="/db/analysisMethod" name="AnalysisMethodListPage" component={AnalysisMethodListPage}/>
				<Route exact path="/db/analysisMethod/:id" name="AnalysisMethodDetailsPage" component={AnalysisMethodDetailsPage}/>
				<Route exact path="/db/specification" name="SpecificationListPage" component={SpecificationListPage}/>
				<Route exact path="/db/specification/:id" name="SpecificationDetailsPage" component={SpecificationDetailsPage}/>
				<Route exact path= "/db/qualityControl" name="QualityControlPage" component={QualityControlPage}/>
				<Route exact path="/db/qualityControl/backlog" name="BackLogListPage" component={BackLogListPage}/>
				<Route exact path="/db/qualityControl/backlog/:id" name="BackLogDetailsPage" component={BackLogDetailsPage}/>


			    <Route component={NotFoundPage} />
				//<Redirect push from="/" exact to="/login"/>
				{/* <Route path="/login" name="LoginPage" component={LoginPage} />
				
				<Redirect push from="/db/settings" exact to="/db/settings/computers"/>

				<Layout>
					<Switch>
						<Route
							exact
							path="/db/settings/computers"
							name="ComputersListPage"
							component={ComputersListPage}
						/>
						<Route component={NotFoundPage} />
					</Switch>
				</Layout> */}
			</Switch>
		// </AuthProvider>
	);
}

export default withRouter(App);
