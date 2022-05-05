import React, { useState } from "react";
import styled from "styled-components";

import Table from "../Table/Table";
import FieldSet from "../FieldSet/FieldSet";
import FormGroup from "../FormGroup/FormGroup";

function CellTable(props) {
	const [loading, setLoading] = useState(false);

	const Styles = styled.div`
		width: 100%;
	`;

	const TableFieldSet = styled(FieldSet)`
		/* overflow-x: auto; */

		table {
			tbody > tr:hover {
				cursor: default;
			}
		}
	`;

	const columns = props.columns;

	return (
		<Styles>
			<TableFieldSet>
				<FormGroup>
					<Table
						data={props.data}
						columns={columns}
						loading={loading}
						pageCount={props.pageCount}
					/>
				</FormGroup>
			</TableFieldSet>
		</Styles>
	);
}

export default CellTable;
