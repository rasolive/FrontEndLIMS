import React, { useState, useEffect, useContext } from "react";
import { BackendLIMSAxios } from "../../../utils/axiosInstances";
// import { AuthContext } from "../../../../../context/AuthContext";
import Header from "../../Layout/Header/Header";
import Table from "../../Layout/Table/Table";

function ReagentsListPage(props) {
	const page = `reagents` // nome da rota no backend
	const item = `Reagentes` // nome do Tipo de item


	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	// const { session } = useContext(AuthContext);

	useEffect(() => {
		const token = localStorage.getItem("token")
		console.log(token)

		async function isAuthenticated() {
			const response = await BackendLIMSAxios.get(`auth/isAuthenticated`, {
				headers: {
				  'authorization': `${token}` 
				}
			  });


			console.log("10",response)

			if (response.data.isAuthenticated === "true"){

			  	console.log(response.data.isAuthenticated);

			}else {
				props.history.push(`/`);
			};

			setLoading(false);
		}
		
			isAuthenticated()
		

	}, []);


	useEffect(() => {
		const token = localStorage.getItem("token")
		console.log(token)

		async function getReagents() {
			const response = await BackendLIMSAxios.get(`${page}`, {
				headers: {
				  'authorization': `${token}` 
				}
			  });


			setData(response.data || []);
			setLoading(false);
		}
	
		setLoading(true);
		getReagents();

	}, []);

	const handleNewRegisterButtonClick = () => {
		props.history.push(`/db/${page}/new`);
	};

	const columns = [
		{
			Header: "Id",
			accessor: "_id",
		},
		{
			Header: "Código do Reagente",
			accessor: "cod",
		},
		{
			Header: "Nome do Reagente",
			accessor: "name",
		},
		{
			Header: "Criado por",
			accessor: "createdBy",
		},
		{
			Header: "Atualizado por",
			accessor: "updatedBy",
		},
	
	];

	return (
		<>
			<Header
				title={item}
				showNewRegisterButton
				handleNewRegisterButtonClick={handleNewRegisterButtonClick}
			/>

			<Table
				data={data}
				columns={columns}
				loading={loading}
				handleRowClick={(row) => {
					props.history.push(
						`/db/${page}/${row.original._id}`
					);
				}}
			/>
		</>
	);
}

export default ReagentsListPage;
