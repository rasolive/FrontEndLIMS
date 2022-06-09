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
				<Route exact path="/db/grafico" name="GraficoPage" component={GraficoPage}/>
				<Route exact path="/configuracoes" name="Configuracoes" component={Configuracoes}/>
				<Route exact path="/db/users" name="UsuariosListPage" component={UsuariosListPage}/>
				<Route exact path="/db/users/:id" name="UsuariosDetailsPage" component={UsuariosDetailsPage}/>
				
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
