import React from "react";
import { Switch, Route, withRouter, Redirect } from "react-router-dom";

import Home from "./components/home/Home";
// import HomeToLogin from "./components/Redirects/HomeToLogin.js";
// import Layout from "./components/Layout/Layout";
// import LoginPage from "./components/Login/LoginPage";
import NotFoundPage from "./components/Modules/NotFound/NotFoundPage";
import ReagentsListPage from "./components/Modules/Reagents/ReagentsListPage";
// import { AuthProvider } from "./context/AuthContext";
import ReagentsDetailsPage from "./components/Modules/Reagents/ReagentsDetailsPage";


function App() {
	return (
		// <AuthProvider>
			<Switch>
                <Route path="/" exact name="Home" component={Home} />
                <Route exact path="/db/reagents" name="ReagentsListPage" component={ReagentsListPage}/>
                <Route exact path="/db/reagents/:id" name="ReagentsDetailsPage" component={ReagentsDetailsPage}/>
                <Route component={NotFoundPage} />
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
