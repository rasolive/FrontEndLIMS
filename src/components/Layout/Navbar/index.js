import React from "react";
import styled from "styled-components"

import { NavLink as Link } from 'react-router-dom'
import PermissionComponent from "../../PermissionComponent";
import {
	Home
} from "react-feather";

import { FaBars } from 'react-icons/fa'

export const Nav = styled.nav`
    background: #8d8d8d;
    height: 50px;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
    z-index: 10;
`

export const NavLink = styled(Link)`
    color: #fff;
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 0 1rem;
    height: 100%;
    cursor: pointer;

    &.active {
        color: #15cdfc;
    }

    :hover {
		transition: 0.2s;
		transform: translate(3px, -3px);
		box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.25);
		cursor: pointer;
        color: #15cdfc;
	}

`

export const NavDiv = styled.div`
    color: #fff;
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 0 1rem;
    height: 100%;
    cursor: pointer;

    :hover {
		transition: 0.2s;
		transform: translate(3px, -3px);
		box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.25);
		cursor: pointer;
        color: #15cdfc;
	}

`
export const Bars = styled(FaBars)`
    color: #fff;
    display: none;

    @media screen and (max-width:768px){
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(-100%, 60%);
        font-size: 1.8rem;
        cursor: pointer;
    }    

`
export const NavMenu = styled.div`
    display: flex;
    align-items: center;
    margin-right: 10px;

    @media screen and (max-width:768px){
        display: none;
    }    

`
export const NavBtn= styled.div`
    display: flex;
    align-items: center;
    margin-right: 24px;

    @media screen and (max-width:768px){
        display: none;
    }    

`

export const NavBtnLink = styled(Link)`
    border-radius: 4px;
    background: #256ce1;
    padding: 10px 22px;
    color: #fff;
    border: none;
    outline: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    text-decoration: none;

    &:hover{
        transition: all 0.2s ease-in-out;
        background: #fff;
        color: #010606;
    }
`



const Navbar = ({toggle}) => {

    const sair = () => {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('load')
        window.location.reload()    
    }

   return ( 
   <>
            <Nav>
                <NavLink to={`/home`}>
                    <Home size="20" />
                    Home
                    {/* <img src="" alt=""/> */}
                </NavLink>
                <Bars onClick={toggle} />
                <NavMenu>
                    <PermissionComponent role={["S"]}>
                        <NavLink to="/configuracoes" activeStyle>
                            Configurações
                        </NavLink>
                    </PermissionComponent>
                    <NavLink to="/sobre" activeStyle>
                        Sobre a Página
                    </NavLink>
                    <NavLink to="/contato" activeStyle>
                        Contato
                    </NavLink>
                    <NavDiv onClick={sair} >
                        Sair
                    </NavDiv>
                    {/* <NavBtn>
                <NavBtnLink to="/login">Entrar</NavBtnLink>
            </NavBtn> */}
                </NavMenu>

            </Nav>
        </>
    )
}

export default Navbar