import React, { useState, useEffect, useContext } from "react";
import { BackendLIMSAxios } from "../../../../utils/axiosInstances";
import Header from "../../../Layout/Header/Header";
import GlobalFilterTable from "../../../Layout/Table/GlobalFilterTable";
import Table from "../../../Layout/Table/Table";
import { ColumnFilter } from "../../../Layout/Filter/ColumnFilter";

function AprovadosListPage(props) {

	const page = `lotes`
	const item = `Lotes em Qualidade`


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

			const response = await BackendLIMSAxios.get(`lotes?statusLote=L`,header);


			setData(response.data || []);
			setLoading(false);
		}
	
		setLoading(true);
		getItens();

	}, []);

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
				showReturnButton
			/>

			<GlobalFilterTable
				data={data}
				columns={columns}
				loading={loading}
				handleRowClick={(row) => {
					props.history.push(
						`/db/qualityControl/backlog/${row.original._id}`
					);
				}}
			/>
		</>
	);
}

export default AprovadosListPage;
