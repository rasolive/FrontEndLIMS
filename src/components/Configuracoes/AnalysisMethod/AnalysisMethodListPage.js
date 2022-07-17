import React, { useState, useEffect, useContext } from "react";
import { BackendLIMSAxios } from "../../../utils/axiosInstances";
// import { AuthContext } from "../../../../../context/AuthContext";
import Header from "../../Layout/Header/Header";
import GlobalFilterTable from "../../Layout/Table/GlobalFilterTable";
import Table from "../../Layout/Table/Table";
import { ColumnFilter } from "../../Layout/Filter/ColumnFilter";
import * as XLSX from "xlsx";

function AnalysisMethodListPage(props) {
	const page = `analysisMethod` // nome da rota no backend
	const item = `Métodos de Análise` // nome do Tipo de item


	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	const [token, setToken] = useState(sessionStorage.getItem("token"));
	const [header, setHeader] = useState({headers: {'authorization': `${token}`}});
	// const { session } = useContext(AuthContext);

    useEffect(() => {

		async function isAuthenticated() {
			const response = await BackendLIMSAxios.get(`auth/isAuthenticated`, header);

			if (response.data.isAuthenticated === "true" & response.data.validPass === "true"){

			  	console.log(response.data.isAuthenticated);

			}else {
                sessionStorage.removeItem('token')
				props.history.push(`/`);
                setLoading(true);
			};

			setLoading(true);
		}
		
			isAuthenticated()		

	}, []);


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
		const wb = XLSX.utils.book_new();
		const ws = XLSX.utils.json_to_sheet(data);
		XLSX.utils.book_append_sheet(wb, ws, "Fornecedores");
		XLSX.writeFile(wb, `${page}s.xlsx`);
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

export default AnalysisMethodListPage;
