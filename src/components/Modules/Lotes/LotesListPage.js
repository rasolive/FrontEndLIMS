import React, { useState, useEffect, useContext } from "react";
import { BackendLIMSAxios } from "../../../utils/axiosInstances";
import Header from "../../Layout/Header/Header";
import Table from "../../Layout/Table/Table";

function LotesListPage(props) {

	const page = `lotes`
	const item = `Lotes`


	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	const [token, setToken] = useState(sessionStorage.getItem("token"));
	const [header, setHeader] = useState({headers: {'authorization': `${token}`}});
	// const { session } = useContext(AuthContext);

	useEffect(() => {
		
		async function isAuthenticated() {
			const response = await BackendLIMSAxios.get(`auth/isAuthenticated`, header);


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
		async function getItens() {
			const response = await BackendLIMSAxios.get(`${page}`,header);


			setData(response.data || []);
			setLoading(false);
		}
	
		setLoading(true);
		getItens();

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
				showReturnButton
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

export default LotesListPage;
