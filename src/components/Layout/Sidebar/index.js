import React from "react";

import styled from "styled-components"

import { Link as LinkS } from 'react-router-dom'
import { Link as LinkR } from 'react-router-dom'

import { FaTimes } from 'react-icons/fa'

import PermissionComponent from "../../PermissionComponent";

export const SidebarContainer = styled.aside`
    position: fixed;
    z-index: 999;
    width: 100%;
    height: 100%;
    background: #8d8d8d;    
    display: grid;
    align-items: center;
    top: 0;
    right: 0;
    transition: 0.3s ease-in-out;
    opacity: ${({ isOpen }) => (isOpen ? '100%' : '0')};
    top: ${({ isOpen }) => (isOpen ? '0' : '-100%')};
`

export const CloseIcon = styled(FaTimes)`
    color: #fff;
    `


export const Icon = styled.div`
    position: absolute;
    top: 1.2rem;
    right: 1.5rem;
    background: transparent;  
    font-size: 2rem;
    cursor: pointer;
    outline: none;

`
export const SidebarWrapper = styled.div`
    color: #fff;

`
export const SidebarMenu = styled.ul`
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(6, 80px);
    text-align: center;
    padding-inline-start: 0px;

    @media screen and (max-width: 480px){
        grid-template-rows: repeat(6, 60px);
    }    


`
export const SidebarLink = styled(LinkS)`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    text-decoration: none;
    list-style: none;
    transition: 0.2s ease-in-out;
    text-decoration: none;
    color: #fff;
    cursor: pointer;

    &:hover{
        color: #01bf71;
        transition: 0.2s ease-in-out;
     }


`

export const SideBtnWrap = styled.div`
    display: flex;
    justify-content: center;
`
export const SidebarRoute = styled(LinkR)`
    border-radius: 50px;
    background: #01bf71; 
    white-space: nowrap;
    padding: 16px 64px;
    color: #010606;
    font-size: 16px;
    outline: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    text-decoration: none;

    &:hover{
        transition: 0.2s ease-in-out;
        background: #fff; 
        color: #010606;
     }


`

export const NavDiv = styled.div`
display: flex;
align-items: center;
justify-content: center;
font-size: 1.5rem;
text-decoration: none;
list-style: none;
transition: 0.2s ease-in-out;
text-decoration: none;
color: #fff;
cursor: pointer;

&:hover{
    color: #01bf71;
    transition: 0.2s ease-in-out;
 }


`

const Sidebar = ({ isOpen, toggle }) => {

    const sair = () => {
        sessionStorage.removeItem('token')
        window.location.reload()
    }
    return (
        <>
            <SidebarContainer isOpen={isOpen}
                onClick={toggle}>
                <Icon onClick={toggle}>
                    <CloseIcon />
                </Icon>
                <SidebarWrapper>
                    <SidebarMenu>
                        <PermissionComponent role={["S"]}>
                            <SidebarLink to="/configuracoes" onClick={toggle}>
                                Configurações
                            </SidebarLink>
                        </PermissionComponent>
                        <SidebarLink to="/sobre" onClick={toggle}>
                            Sobre a Página
                        </SidebarLink>
                        <SidebarLink to="/contato" onClick={toggle}>
                            Contato
                        </SidebarLink>

                    </SidebarMenu>
                    <SideBtnWrap>
                        <PermissionComponent role={['S', 'V', 'AQ', 'GQ', 'AC', 'GC']}>
                            <SidebarRoute style={{ cursor: 'pointer' }} onClick={sair}>
                                Sair
                            </SidebarRoute>
                        </PermissionComponent>
                    </SideBtnWrap>
                </SidebarWrapper>
            </SidebarContainer>
        </>
    )
}

export default Sidebar