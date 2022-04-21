import React from "react";
import { InputText } from "../Input/Input";
import Label from "../Label/Label";
import styled from "styled-components";

const FilterLabel = styled(Label)`
font-size: 14px;
`;

export const GlobalFilter = ({filter, setFilter}) => {
    return (
        <span>
            <FilterLabel htmlFor="busca">Busca:</FilterLabel>{''}
            <InputText
                value={filter || ''}
                onChange={(e)=>setFilter(e.target.value)}
            />
        </span>
    )
}