import React from "react";

import styled from "styled-components";

import { TrashIcon, PlusIcon,  } from "../../Layout/Icon/Icon";
import { Trash2, Thermometer } from "react-feather";
import Table from "../../Layout/Table/SpecificationTable";
import Button from "../../Layout/Button/Button";
import { InputText, Select, InputNumber } from "../../Layout/Input/Input";
import Tooltip from "../../Layout/Tooltip/Tooltip";
import FieldSet from "../../Layout/FieldSet/FieldSet";


const RowButton = styled(Button)`
	margin-left: 15px;
	text-align: center;
	line-height: 50%;
	//position: relative;
	margin-bottom: 5px;
	display: flex;
	justify-content: center;
	&:hover ${Tooltip} {
		visibility: visible;
	}
`;

const Styles = styled.div`
	table {
		tbody > tr:hover {
			cursor: default;
		}
	}
`;

const Row = styled.div`
	display: flex;
	align-items: center;
`;

const Text = styled.span`
	font-family: Poppins;
	font-size: 12.8px;
	color: #282828;
	margin: 0px 5px;
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
						type="text"
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
						type="text"
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
		
		// {
		// 	Header: (
		// 		<RowButton
		// 			type="button"
		// 			small
		// 			onClick={props.handleAddLineButtonClick}
		// 			secondary
		// 		>
		// 			<Tooltip top>Adicionar linha</Tooltip>
		// 			<PlusIcon />
		// 		</RowButton>
		// 	),
		// 	accessor: "x",
		// 	width: 100,
		// 	Cell: ({ cell }) => {
		// 		const { original } = cell.row;

		// 		return (
		// 			<RowButton
		// 				type="button"
		// 				small
		// 				onClick={() =>
		// 					props.handleRemoveLineButtonClick(original._id)
		// 				}
		// 				secondary
		// 			>
		// 				<Tooltip top>Remover linha</Tooltip>
		// 				<TrashIcon color="#E75656" />
		// 			</RowButton>
		// 		);
		// 	},
		// },
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
