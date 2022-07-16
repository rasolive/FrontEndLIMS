import React, { useState, useEffect} from "react";

import styled from "styled-components";

import { Thermometer, Check, X } from "react-feather";
import Table from "../../../Layout/Table/SpecificationTable";
import Button from "../../../Layout/Button/Button";
import { InputText, Select, InputNumber } from "../../../Layout/Input/Input";
import FieldSet from "../../../Layout/FieldSet/FieldSet";
import Label from "../../../Layout/Label/Label";
import Tooltip from "../../../Layout/Tooltip/Tooltip";


const Styles = styled.div`
	overflow-x: auto;
	table {
		tbody > tr:hover {
			cursor: default;
		}
	}
`;

const HeaderButton = styled(Button)`
	height: 40px;
	width: 250px;
	margin-top: 70px;
	margin-left: 15px;
	text-align: center;
	line-height: 50%;
	position: relative;
	margin-bottom: 5px;
	justify-content: center;
	&:hover ${Tooltip} {
		visibility: visible;
	}
`;


export default function AddListasTable(props) {
	function handleTableInputChange(e, key, id) {
		props.handleTableInputChange(e, key, id);
	}

	function handleTableInputChange2(e, key, id) {
		props.handleTableInputChange2(e, key, id);
	}

	const [loading, setLoading] = useState(false);
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
					
					<InputNumber
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
						disabled
					></InputNumber>
				
				);
			},
		},

		{
			Header: "Máximo",
			accessor: "max",
			Cell: ({ cell }) => {
				const { original } = cell.row;
				return (
					
					<InputNumber
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
						disabled
					></InputNumber>
				
				);
			},
		},

		{
			Header: "Un",
			accessor: "unit",
		},

		{
			Header: "Resultado",
			accessor: "result",
			Cell: ({ cell }) => {
				const { original } = cell.row;
				if (original.AnalysisType === "Quantitativa") {

				return (
					
					<InputNumber
					style={{
						width: "100px",
						minWidth: "20px",
					}}
						type="number"
						id={"result_" + original.id}
						defaultValue={original.result}
						onBlur={(e) =>{
							handleTableInputChange(
								e,
								original.id,
								"result"
							);
							if (parseFloat(original.result) >= parseFloat(original.min) && parseFloat(original.result) <= parseFloat(original.max)) {
								document.getElementById("status_" + original.id).value = true;
								handleTableInputChange2(
								true,
								original.id,
								"status"
							);
							setLoading(!loading);
							}else{
								document.getElementById("status_" + original.id).value = false;
							handleTableInputChange2(
								false,
								original.id,
								"status"
							);
							setLoading(!loading);
							}
						}
						}
						
					></InputNumber>
				
				);
			}
			return (
					
				<Select
				style={{
					width: "100px",
					minWidth: "20px",
				}}
					type="text"
					id={"result_" + original.id}
					defaultValue={original.result}
					onChange={(e) =>{
						handleTableInputChange(
							e,
							original.id,
							"result"
						);
						if (original.result === "A") {
							document.getElementById("status_" + original.id).value = true;
							handleTableInputChange2(
								true,
								original.id,
								"status"
							);
							setLoading(!loading);
						}else{
							document.getElementById("status_" + original.id).value = false;
							handleTableInputChange2(
								false,
								original.id,
								"status"
							);
							setLoading(!loading);
						}
					}}
					
				>
					<option value="">Selecione</option>
					<option key= "A" value="A">Aprovado</option>
					<option key= "R" value="R">Reprovado</option>
									
				</Select>

			
			);},
		},

		{
			Header: "Status",
			accessor: "status",
			Cell: ({ cell }) => {
				const { original } = cell.row;

				if (original.status === true) {
					return (
						<Check 
						style={{color: "green"}}
						id={"status_" + original.id}
						value={original.status}
						defaultValue={false}
						disabled
						visible={false}/>
					);
				}else{

				return (
					<X style={{color: "red"}}
					id={"status_" + original.id}
					value={original.status}
					defaultValue={false}
					disabled
					visible={false}/>
				);}
			},

		},
		
		// {
		// 	Header: "Status",
		// 	accessor: "status",
		// 	Cell: ({ cell }) => {
		// 		const { original } = cell.row;
		// 		return (
		// 			<InputText
		// 				id={"status_" + original.id}
		// 				value={original.status}
		// 				disabled
		// 				visible={false}
		// 			></InputText>
					
				
		// 		);
		// 	},

		// },

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
							title="Ir para Analysis"
							onDoubleClick={() =>
								props.history.push({
									pathname: `../../analysis/${original._id}`,
									
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

	console.log('data', props.data.length)

	if (props.data.length === 0) {
		return (
			<div>
				<br></br>
				<Label
				style={{
					fontSize: "15px",
					color: "#de2d26",
				}}
				
				>				
					Especificação não encontrada
					
				</Label>

				<HeaderButton
						type="button"
						onClick={() =>
							props.history.push({
								pathname: `../../../db/specification/new`,
								
							})}
					>
						Cadastrar Especificação
				</HeaderButton>


				<br></br>
			</div>
		);
	}
	return (
		<Styles
		style={{
			maxWidth: "850px",
			flexWrap: "wrap",
			alignItems: "center",
		}}>
			<Table data={props.data} columns={columns} />
		</Styles>
	);
}
