import React, { useMemo, useState } from "react";
import { useTable, usePagination, useGlobalFilter, useSortBy } from "react-table";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import {Button} from '@geist-ui/react'
import { RefreshCw, Plus, Filter } from '@geist-ui/icons'

// design source: https://chat.openai.com/chat/915d25ba-27a5-41ec-ac49-7ffa1044d1eb

const SortIcon = styled.span`
  display: inline-block;
  margin-left: 0.5rem;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-${(props) => (props.isSorted ? (props.isDesc ? "top" : "bottom") : "none")}: 4px solid #888;
  opacity: ${(props) => (props.isSorted ? 1 : 0.3)};
`;

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  font-size: 0.875rem;
  color: #444;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Add box-shadow to the table */

  thead {
    background-color: #fafbfc;
    font-weight: 600;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Add box-shadow to the thead */
    border-radius: 5px; /* optional: add if you want to round corners */
  }

  tbody {
    background-color: #fff;
  }

  th,
  td {
    padding: 0.75rem 1rem;
    text-align: left;
    word-wrap: break-word;
    white-space: pre-wrap;
    width: 100%; /* Add width: 100% to table cells */
    max-width: 300px;
  }
  td {
    max-height: 60px; /* Set the maximum height for the rows */
    overflow-y: auto; /* Enable scrolling for overflowing content */
  }

  th {
    position: relative;
    cursor: pointer;
    text-transform: uppercase; /* Make header font uppercase */
    width: 100%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add box-shadow to the th */
  }
`;

const SearchBar = styled.input`
  width: 200px;
  height: 40px;
  padding: 0.25rem 0.5rem;
  font-size: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  background-color: #fff;
  color: #444;
  &:focus {
    outline: none;
    border-color: #0052cc;
  }
  margin-right: 1rem;
`;


const Pagination = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem 0;

  button {
    background-color: #fafbfc;
    color: #444;
    border: 1px solid #e0e0e0;
    padding: 0.5rem 1rem;
    margin: 0 0.25rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;

    &:disabled {
      background-color: #fafbfc;
      color: #ccc;
      cursor: not-allowed;
      border-color: #e0e0e0;
    }

    &:not(:disabled):hover {
      background-color: #f0f2f7;
    }
  }
`;
const Toolbar = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: #fafbfc;
  padding: 0.5rem 1rem;
  // border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); /* Add box-shadow to the toolbar */
`;

const ToolbarItems = styled.div`
  display: flex;
  align-items: center;
  cursor:pointer;
`;


const RefreshButton = styled.button`
  margin-left: 0.5rem;
  background-color: #0052cc;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  &:hover {
    background-color: #0046a3;
  }
  &:active {
    background-color: #003380;
  }
  &:disabled {
    background-color: #a2a2a2;
    cursor: not-allowed;
  }
`;



const TableComponent = ({ columns, data, refreshTable }) => {
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      prepareRow,
      page,
      canPreviousPage,
      canNextPage,
      nextPage,
      previousPage,
      state,
      setGlobalFilter,
    } = useTable(
      {
        columns,
        data,
        initialState: { pageIndex: 0, pageSize: 6, sortBy: [{ id: "created_at", desc: true }] },
      },
      useGlobalFilter,
      useSortBy,
      usePagination
    );
  
    const { globalFilter } = state;
  
    const handleFilterChange = (event) => {
      setGlobalFilter(event.target.value || undefined);
    };
    const handleRefresh = () => {
        refreshTable();
      };
    
    return (
      <div>
        <Toolbar>
          <SearchBar
            type="text"
            placeholder="Search..."
            value={globalFilter || ""}
            onChange={handleFilterChange}
          />
            <ToolbarItems>
                <RefreshCw style={{ marginRight: "1rem", "curosor": "pointer" }} onClick={handleRefresh}/>
                {/* <FontAwesomeIcon icon={faFilter} style={{ marginRight: "1rem" }} /> */}
            </ToolbarItems>
          {/* <Button onClick={handleRefresh} variant="primary">Refresh</Button> */}
          {/* Add more toolbar items here */}
        </Toolbar>
        <Table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    <SortIcon isSorted={column.isSorted} isDesc={column.isSortedDesc} />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
        <Pagination>
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            Previous
          </button>
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            Next
          </button>
        </Pagination>
      </div>
    );
  };
  export default TableComponent;
