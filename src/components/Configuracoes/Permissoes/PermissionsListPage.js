import React, { useState, useEffect, useContext } from "react";
import { BackendLIMSAxios } from "../../../utils/axiosInstances";
// import { AuthContext } from "../../../../../context/AuthContext";
import Header from "../../Layout/Header/Header";
import GlobalFilterTable from "../../Layout/Table/GlobalFilterTable";
import Table from "../../Layout/Table/Table";
import { ColumnFilter } from "../../Layout/Filter/ColumnFilter";
import * as XLSX from "xlsx";

function PermissionsListPage(props) {
	const page = `permissions` // nome da rota no backend
	const item = `Permisão` // nome do Tipo de item


	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	const [token, setToken] = useState(sessionStorage.getItem("token"));
	const [header, setHeader] = useState({headers: {'authorization': `${token}`}});
	// const { session } = useContext(AuthContext);

   	useEffect(() => {
		
		async function getItens() {
			const response = await BackendLIMSAxios.get(`${page}`, header);


			setData(response.data || []);
			setLoading(false);
		}
	
		setLoading(true);
		getItens();

	}, []);

	const handleNewRegisterButtonClick = () => {
		props.history.push(`/db/${page}/new`);
	};

	const handleExportButton = () => {
	
		var exports = {
			Objects: data.map(function(node) {
			  return {
				'ID': node._id,
				'Usuário': node.name,
				'E-mail': node.email,
				'Perfil': node.role.map(function(node){ return node.perfil}).join(","),
				'Criado_Por': node.createdBy,
				'Criado_Em': node.createdAt,
				'Atualizado_Por': node.updatedBy,
				'Atualizado_Em': node.updatedAt,
			  };
			})
		  }

		const wb = XLSX.utils.book_new();
		const ws = XLSX.utils.json_to_sheet(exports.Objects);
		XLSX.utils.book_append_sheet(wb, ws, "Usuários");
		XLSX.writeFile(wb, `Usuários.xlsx`);
};

	const columns = [
		{
			Header: "Id",
			accessor: "_id",
			Filter: ColumnFilter,
		},
		{
			Header: `Nome da Rota`,
			accessor: "page",
			Filter: ColumnFilter,
		},
		{
			Header: "Criado por",
			accessor: "createdBy",
			Filter: ColumnFilter,
		},
		{
			Header: "Atualizado por",
			accessor: "updatedBy",
			Filter: ColumnFilter,
		},
	
	];

	return (
		<>
			<Header
				title={item}
				showNewRegisterButton
				showReturnButton
				showNewExportButton
				handleExportButton={handleExportButton}
				handleNewRegisterButtonClick={handleNewRegisterButtonClick}
			/>

			<GlobalFilterTable
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

export default PermissionsListPage;
