import React, { useState, useEffect, useContext } from "react";
import { BackendLIMSAxios } from "../../../utils/axiosInstances";
import Header from "../../Layout/Header/Header";
import GlobalFilterTable from "../../Layout/Table/GlobalFilterTable";
import Table from "../../Layout/Table/Table";
import { ColumnFilter } from "../../Layout/Filter/ColumnFilter";
import * as XLSX from "xlsx";
import HasPermission from "../../Permission";

function LotesListPage(props) {

	const page = `lotes`
	const item = `Lotes`


	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	const [token, setToken] = useState(sessionStorage.getItem("token"));
	const [header, setHeader] = useState({headers: {'authorization': `${token}`}});
	// const { session } = useContext(AuthContext);

    
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

	const handleExportButton = () => {
	
		var exports = {
			Objects: data.map(function(node) {
			  return {
				'ID': node._id,
				'Material': node.material.name,
				'Lote': node.lote,
				'Fornecedor': node.fornecedor.name,
				'Lote_Fornecedor': node.loteFornecedor,
				'Quantidade': node.qtdInicial,
				'Validade': node.validade,
				'Status_Lote': node.statusLote,				
				'Criado_Por': node.createdBy,
				'Criado_Em': node.createdAt,
				'Atualizado_Por': node.updatedBy,
				'Atualizado_Em': node.updatedAt,
			  };
			})
		  }

		const wb = XLSX.utils.book_new();
		const ws = XLSX.utils.json_to_sheet(exports.Objects);
		XLSX.utils.book_append_sheet(wb, ws, "Lotes");
		XLSX.writeFile(wb, `Lotes.xlsx`);
};

	const columns = [
		{
			Header: "Id",
			accessor: "_id",
			Filter: ColumnFilter,
		},
		{
			Header: "Material",
			accessor: "material.name",
			Filter: ColumnFilter,
		},
		{
			Header: "Lote",
			accessor: "lote",
			Filter: ColumnFilter,
		},
		{
			Header: "Fornecedor",
			accessor: "fornecedor.name",
			Filter: ColumnFilter,
		},
		{
			Header: "Validade",
			accessor: "validade",
			Filter: ColumnFilter,
		},
	
	];

	return (
		<>
			<Header
				title={item}
				showNewRegisterButton = {HasPermission(["S","AC","GC"])}
				showReturnButton
				showNewExportButton = {HasPermission(["S","AC",'AQ','GQ',"GC"])}
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

export default LotesListPage;
