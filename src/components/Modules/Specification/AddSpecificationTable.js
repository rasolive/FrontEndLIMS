import React from "react";

import styled from "styled-components";

import { Trash2, Thermometer } from "react-feather";
import Table from "../../Layout/Table/SpecificationTable";
import Button from "../../Layout/Button/Button";
import { InputText } from "../../Layout/Input/Input";
import FieldSet from "../../Layout/FieldSet/FieldSet";


const Styles = styled.div`
	table {
		tbody > tr:hover {
			cursor: default;
		}
	}
`;


export default function AddListasTable(props) {
	function handleTableInputChange(e, key, id) {
		props.handleTableInputChange(e, key, id);
	}

	const analysis = props.analysis;

	const columns = [

		{
			Header: "Nome",
			accessor: "name",
		},
		
		{
			Header: "Tipo",
			accessor: "AnalysisType",
		},

		{
			Header: "Mínimo",
			accessor: "min",
			
			Cell: ({ cell }) => {
				const { original } = cell.row;
				return (
					
					<InputText
					style={{
						width: "100px",
						minWidth: "20px",
					}}
						type="number"
						id={"min_" + original.id}
						defaultValue={original.min}
						onBlur={(e) =>
							handleTableInputChange(
								e,
								original.id,
								"min"
							)
						}
						disabled={original.AnalysisType === "Qualitativa"}
					></InputText>
				
				);
			},
		},

		{
			Header: "Máximo",
			accessor: "max",
			Cell: ({ cell }) => {
				const { original } = cell.row;
				return (
					
					<InputText
					style={{
						width: "100px",
						minWidth: "20px",
					}}
						type="number"
						id={"max_" + original.id}
						defaultValue={original.max}
						onBlur={(e) =>
							handleTableInputChange(
								e,
								original.id,
								"max"
							)
						}
						disabled={original.AnalysisType === "Qualitativa"}
					></InputText>
				
				);
			},
		},

		{
			Header: "Unidade",
			accessor: "unit",
		},

		{
			Header: "Método",
			accessor: "AnalysisMethod",
		},

		{
			Header: "",
			accessor: "button",
			Cell: ({ cell }) => {
				const { original } = cell.row;
				return (
					<FieldSet>
						<Button
							small
							danger
							title="Remover Analysis"
							onClick={() => props.handleRemoveLineButtonClick(original._id)}
						>
							<Trash2 />
						</Button>
						<Button
							small
							title="Ir para Analysis"
							onClick={() =>
								props.history.push({
									pathname: `../../db/analysis/${original._id}`,
									
								})
							}
						>
							<Thermometer/>
						</Button>
					</FieldSet>
				);
			},
		},
	];

	return (
		<Styles
		style={{
			maxWidth: "800px",
			flexWrap: "wrap",
			alignItems: "center",
		}}>
			<Table data={props.data} columns={columns} />
		</Styles>
	);
}
