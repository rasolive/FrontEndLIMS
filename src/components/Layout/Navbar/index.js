import React from "react";
import { Nav, NavLink, Bars, NavMenu, NavBtn, NavBtnLink } from "./Navbar";

const Navbar = ({toggle}) => {


   return ( <>
    <Nav>
        <NavLink to = {`/home?session=${sessionStorage.getItem('token')}`}>
            <h1>Inserir Logo</h1>
            {/* <img src="" alt=""/> */}
        </NavLink>
        <Bars onClick={toggle} />
          <NavMenu>
            <NavLink to="/about" activeStyle>
                About
            </NavLink>
            <NavLink to="/services" activeStyle>
                Servicecs
            </NavLink>
            <NavLink to="/contato" activeStyle>
                Contato
            </NavLink>
            <NavLink to="/sair" activeStyle>
                Sair
            </NavLink>
            <NavBtn>
                <NavBtnLink to="/login">Entrar</NavBtnLink>
            </NavBtn>
        </NavMenu>

    </Nav>
    </>
   )}

export default Navbar