import React from "react";
import styled from "styled-components"

import { NavLink as Link } from 'react-router-dom'

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

`

export const NavDiv = styled.div`
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
        window.location.reload()    
    }

   return ( 
   <>
    <Nav>
        <NavLink to = {`/home`}>
            <h1>Home page</h1>
            {/* <img src="" alt=""/> */}
        </NavLink>
        <Bars onClick={toggle} />
          <NavMenu>
          <NavLink to="/configuracoes" activeStyle>
                Configurações
            </NavLink>
            <NavLink to="/about" activeStyle>
                About
            </NavLink>
            <NavLink to="/services" activeStyle>
                Services
            </NavLink>
            <NavLink to="/contato" activeStyle>
                Contato
            </NavLink>
            <NavDiv style={{cursor: 'pointer'}}onClick={sair} >
                Sair
            </NavDiv>
            {/* <NavBtn>
                <NavBtnLink to="/login">Entrar</NavBtnLink>
            </NavBtn> */}
        </NavMenu>

    </Nav>
    </>
   )}

export default Navbar