import React from "react";
import { InputText } from "../Input/Input";

export const ColumnFilter = ({column})=>{
    const {filterValue, setFilter}=column;
    return (
        <span>
            {''}
            <InputText
                value={filterValue || ''}
                onChange={(e)=>setFilter(e.target.value)}
            />
        </span>
    )
}