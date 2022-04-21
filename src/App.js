import React from "react";

import { Switch, Route, withRouter, Redirect } from "react-router-dom";

import HomePage from "./components/Home/HomePage";
import Home from "./components/Modules/home/Home";
import Login from "./components/Login/Login";
// import HomeToLogin from "./components/Redirects/HomeToLogin.js";
// import Layout from "./components/Layout/Layout";
// import LoginPage from "./components/Login/LoginPage";
import NotFoundPage from "./components/Modules/NotFound/NotFoundPage";
import ReagentsListPage from "./components/Modules/Reagents/ReagentsListPage";
// import { AuthProvider } from "./context/AuthContext";
import ReagentsDetailsPage from "./components/Modules/Reagents/ReagentsDetailsPage";
import FornecedoresListPage from "./components/Modules/Fornecedores/FornecedoresListPage";
import FornecedoresDetailsPage from "./components/Modules/Fornecedores/FornecedoresDetailsPage";

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
                <Route path="/home" exact name="Home" component={Home} />
                <Route exact path="/db/reagents" name="ReagentsListPage" component={ReagentsListPage}/>
                <Route exact path="/db/reagents/:id" name="ReagentsDetailsPage" component={ReagentsDetailsPage}/>
				<Route exact path="/db/Fornecedores" name="FornecedoresListPage" component={FornecedoresListPage}/>
				<Route exact path="/db/Fornecedores/:id" name="FornecedoresDetailsPage" component={FornecedoresDetailsPage}/>

				<Route exact path="/db/lotes" name="LotesListPage" component={LotesListPage}/>
                <Route exact path="/db/lotes/:id" name="LotesDetailsPage" component={LotesDetailsPage}/>
				<Route exact path="/db/grafico" name="GraficoPage" component={GraficoPage}/>
				
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
