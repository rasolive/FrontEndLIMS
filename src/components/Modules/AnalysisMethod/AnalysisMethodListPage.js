import React, { useState, useEffect, useContext } from "react";
import { BackendLIMSAxios } from "../../../utils/axiosInstances";
// import { AuthContext } from "../../../../../context/AuthContext";
import Header from "../../Layout/Header/Header";
import GlobalFilterTable from "../../Layout/Table/GlobalFilterTable";
import Table from "../../Layout/Table/Table";
import { ColumnFilter } from "../../Layout/Filter/ColumnFilter";
import * as XLSX from "xlsx";
import HasPermission from "../../Permission";

function AnalysisMethodListPage(props) {
	const page = `analysisMethod` // nome da rota no backend
	const item = `Métodos de Análise` // nome do Tipo de item


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
					'Método': node.name,
					'Descrição': node.description,
					'Revisão': node.rev,
					'Referência': node.ref,
					'Criado_Por': node.createdBy,
					'Criado_Em': node.createdAt,
					'Atualizado_Por': node.updatedBy,
					'Atualizado_Em': node.updatedAt,
					'Processo': node.process,
				  };
				})
			  }
	
			const wb = XLSX.utils.book_new();
			const ws = XLSX.utils.json_to_sheet(exports.Objects);
			XLSX.utils.book_append_sheet(wb, ws, "MA's");
			XLSX.writeFile(wb, `MA's.xlsx`);
	};

	const columns = [
		{
			Header: "Id",
			accessor: "_id",
			Filter: ColumnFilter,
		},
		{
			Header: "Método de Análise",
			accessor: "name",
			Filter: ColumnFilter,
		},

		{
			Header: "Descrição",
			accessor: "description",
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
				showNewRegisterButton = {HasPermission(["S","AQ","GQ"])}
				showReturnButton
				showNewExportButton = {HasPermission(["S","AQ","GQ"])}
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

export default AnalysisMethodListPage;
