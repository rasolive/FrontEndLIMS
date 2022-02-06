import React, { useState, useEffect, useContext } from "react";
import { BackendLIMSAxios } from "../../../utils/axiosInstances";
// import { AuthContext } from "../../../../../context/AuthContext";
import Header from "../../Layout/Header/Header";
import Table from "../../Layout/Table/Table";

function ReagentsListPage(props) {
	const [loading, setLoading] = useState(false);
	const [reagents, setReagents] = useState([]);
	// const { session } = useContext(AuthContext);


	useEffect(() => {
		async function getReagents() {
			const response = await BackendLIMSAxios.get("reagents");


			setReagents(response.data || []);
			setLoading(false);
		}
	
		setLoading(true);
		getReagents();

	}, []);

	const handleNewRegisterButtonClick = () => {
		props.history.push("/db/reagents/new");
	};

	const columns = [
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
		{
			Header: "Id",
			accessor: "_id",
		},
	];

	return (
		<>
			<Header
				title="Reagentes"
				showNewRegisterButton
				handleNewRegisterButtonClick={handleNewRegisterButtonClick}
			/>

			<Table
				data={reagents}
				columns={columns}
				loading={loading}
				handleRowClick={(row) => {
					props.history.push(
						`/db/reagents/${row.original._id}`
					);
				}}
			/>
		</>
	);
}

export default ReagentsListPage;
