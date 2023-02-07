import React, { useState, useEffect, useContext } from "react";
import { BackendLIMSAxios } from "../../../utils/axiosInstances";
// import { AuthContext } from "../../../../../context/AuthContext";
import Header from "../../Layout/Header/Header";
import GlobalFilterTable from "../../Layout/Table/GlobalFilterTable";
import Table from "../../Layout/Table/Table";
import { ColumnFilter } from "../../Layout/Filter/ColumnFilter";
import * as XLSX from "xlsx";
import HasPermission from "../../Permission";


function ReagentsListPage(props) {
	const page = `materiais` // nome da rota no backend
	const item = `Materiais` // nome do Tipo de item


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
				'Código_Material': node.cod,
				'Material': node.name,
				'Armazenamento': node.armazenamento,
				'Unidade_Medida_Básica': node.umb,
				'Status_Material': node.statusMaterial,
				'Fornecedores': node.fornecedor.map(function(node) {return node}).join(", "),				
				'Criado_Por': node.createdBy,
				'Criado_Em': node.createdAt,
				'Atualizado_Por': node.updatedBy,
				'Atualizado_Em': node.updatedAt,
			  };
			})
		  }

		const wb = XLSX.utils.book_new();
		const ws = XLSX.utils.json_to_sheet(exports.Objects);
		XLSX.utils.book_append_sheet(wb, ws, "Materiais");
		XLSX.writeFile(wb, `Materiais.xlsx`);
};

	const columns = [
		{
			Header: "Id",
			accessor: "_id",
			Filter: ColumnFilter,
		},
		{
			Header: "Código do Material",
			accessor: "cod",
			Filter: ColumnFilter,
		},
		{
			Header: "Nome do Material",
			accessor: "name",
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
				showNewRegisterButton = {HasPermission(["S","AC","GC"])}
				showReturnButton
				showNewExportButton = {HasPermission(["S","AC","GC"])}
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

export default ReagentsListPage;
