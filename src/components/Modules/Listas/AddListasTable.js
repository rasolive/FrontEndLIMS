import React from "react";

import styled from "styled-components";

import { TrashIcon, PlusIcon } from "../../Layout/Icon/Icon";
import Table from "../../Layout/Table/Table";
import Button from "../../Layout/Button/Button";
import { InputText, Select, InputNumber } from "../../Layout/Input/Input";
import Tooltip from "../../Layout/Tooltip/Tooltip";




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

	const columns = [
		
		{
			Header: "Valor",
			accessor: "valor",
			Cell: ({ cell }) => {
				const { original } = cell.row;
				return (
					
					<InputText
						type="text"
						id={"valor_" + original.id}
						defaultValue={original.valor}
						onBlur={(e) =>
							handleTableInputChange(
								e,
								original.id,
								"valor"
							)
						}
					></InputText>
				
				);
			},
		},
		
		{
			Header: (
				<RowButton
					type="button"
					small
					onClick={props.handleAddLineButtonClick}
					secondary
				>
					<Tooltip top>Adicionar linha</Tooltip>
					<PlusIcon />
				</RowButton>
			),
			accessor: "x",
			width: 100,
			Cell: ({ cell }) => {
				const { original } = cell.row;

				return (
					<RowButton
						type="button"
						small
						onClick={() =>
							props.handleRemoveLineButtonClick(original.id)
						}
						secondary
					>
						<Tooltip top>Remover linha</Tooltip>
						<TrashIcon color="#E75656" />
					</RowButton>
				);
			},
		},
	];

	return (
		<Styles>
			<Table data={props.data} columns={columns} />
		</Styles>
	);
}
