import React, { useState, useEffect, useContext } from "react";
import { BackendLIMSAxios } from "../../../utils/axiosInstances";
import Header from "../../Layout/Header/Header";
import Table from "../../Layout/Table/Table";

function LotesListPage(props) {

	const page = `lotes`
	const item = `Lotes`


	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	// const { session } = useContext(AuthContext);


	useEffect(() => {
		async function getReagents() {
			const response = await BackendLIMSAxios.get(`${page}`);


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

export default LotesListPage;
