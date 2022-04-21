import React from "react";
import PropTypes from "prop-types";

import { useTable, usePagination, useSortBy, useFilters, useGlobalFilter } from "react-table";

import styled from "styled-components";

import Button from "../../Layout/Button/Button";
import Tooltip from "../../Layout/Tooltip/Tooltip";
import Loading from "../../Layout/Loading/Loading";
import Subtitle from "../../Layout/Subtitle/Subtitle";
import { LeftIcon, RightIcon, UpIcon, DownIcon } from "../Icon/Icon";
import { GlobalFilter } from "../Filter/GlobalFilter";


const Styles = styled.div`
	overflow-x: auto;
	padding: 5px;

	table {
		background: #f9f9f9;
		border-radius: 15px;
		width: 100%;
		border-spacing: 0;
		text-align: left;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);

		tr {
			height: 60px;

			:last-child {
				td {
					border-bottom: 0;
				}
			}
		}

		tbody > tr:hover {
			background: #ffffff;
			box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.25);
			cursor: pointer;
		}

		th {
			color: #888888;
		}

		td {
			color: #282828;
		}

		th,
		td {
			font-family: Poppins;
			font-style: normal;
			font-weight: 600;
			font-size: 0.8rem;
			padding: 0 1rem;
			margin: 0;

			:last-child {
				border-right: 0;
			}
		}
	}

	table tr:last-child {
		border-bottom-left-radius: 15px;
		border-bottom-right-radius: 15px;
	}

	table tr:last-child:hover td:first-child {
		background: #ffffff;
		border-bottom-left-radius: 15px;
		box-shadow: none;
	}

	table tr:last-child:hover td:last-child {
		background: #ffffff;
		border-bottom-right-radius: 15px;
		box-shadow: none;
	}
`;

const Head = styled.th`
	display: flex;
	align-items: flex-end;
`;

const PaginationButton = styled(Button)`
	text-align: center;
	line-height: 50%;
	box-shadow: none;
	display: flex;
	position: relative;
	justify-content: center;

	&:hover ${Tooltip} {
		visibility: visible;
	}
`;

const Pagination = styled.div`
	font-family: Poppins;
	font-style: normal;
	font-size: 1rem;
	display: flex;
	justify-content: flex-end;
	margin-top: 15px;
	align-items: center;

	span {
		margin-right: 5px;
	}
`;

const NoDataMsg = styled(Subtitle)`
	font-size: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
`;

const defaultPropGetter = () => ({});

function GlobalFilterTable({
	columns,
	data,
	getHeaderProps = defaultPropGetter,
	getColumnProps = defaultPropGetter,
	getRowProps = defaultPropGetter,
	getCellProps = defaultPropGetter,
	loading,
	handleRowClick,
	disabledRowClick,
	hideSort,
	pageCount,
}) {
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		page,
		canPreviousPage,
		canNextPage,
		pageOptions,
		nextPage,
		previousPage,
		state: { pageIndex },
		state,
		setGlobalFilter,
	} = useTable(
		{
			columns,
			data,
			initialState: {
				pageIndex: 0,
				pageSize: pageCount ? 25 : 10,
			},
			loading,
			pageCount,
			disabledRowClick,
			hideSort,
		},
		useGlobalFilter,
		useFilters,
		useSortBy,
		usePagination
	);

	const {globalFilter} = state;

	return (
		<>
		<GlobalFilter filter={globalFilter} setFilter = {setGlobalFilter}/>
		<Styles>
			<table {...getTableProps()}>
				<thead>
					{headerGroups.map((headerGroup) => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column) => (
								<th
									{...column.getHeaderProps()}
								>
									<Head>
										{column.render("Header")}
										
									</Head>
									<div>{column.canFilter ? column.render('Filter') : null}</div>
								</th>
							))}
						</tr>
					))}
				</thead>

				<tbody {...getTableBodyProps()}>
					{loading ? (
						<tr>
							<td colSpan="100%">
								<Loading loading={true} />
							</td>
						</tr>
					) : page.length > 0 ? (
						page.map(
							(row, i) =>
								prepareRow(row) || (
									<tr
										{...row.getRowProps(getRowProps(row))}
										onClick={(e) => {
											if (!disabledRowClick) {
												e.preventDefault();
												handleRowClick &&
													handleRowClick(row);
											}
										}}
									>
										{row.cells.map((cell) => {
											return (
												<td {...cell.getCellProps()}>
													{cell.render("Cell")}
												</td>
											);
										})}
									</tr>
								)
						)
					) : (
						<tr>
							<td colSpan="100%">
								<NoDataMsg>Sem dados</NoDataMsg>
							</td>
						</tr>
					)}
				</tbody>
			</table>
			{page.length > 0 && (
				<Pagination>
					{pageOptions.length > 1 && (
						<>
							<PaginationButton
								onClick={() => previousPage()}
								disabled={!canPreviousPage}
								small
							>
								<LeftIcon />
								{canPreviousPage && (
									<Tooltip top>Anterior</Tooltip>
								)}
							</PaginationButton>

							<PaginationButton
								onClick={() => nextPage()}
								disabled={!canNextPage}
								small
							>
								<RightIcon />
								{canNextPage && <Tooltip top>Próxima</Tooltip>}
							</PaginationButton>
						</>
					)}

					<span>
						Página <strong>{pageIndex + 1}</strong>{" "}
					</span>
				</Pagination>
			)}
		</Styles>
		</>
	);
}

GlobalFilterTable.propTypes = {
	handleRowClick: PropTypes.func,
};

export default GlobalFilterTable;
