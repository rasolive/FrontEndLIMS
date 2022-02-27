import React from "react";

import { SidebarContainer, Icon, CloseIcon, SidebarWrapper, SidebarMenu, SidebarLink, SideBtnWrap, SidebarRoute } from "./Sidebar";

const Sidebar = ({isOpen, toggle}) => {
    return (
        <>
            <SidebarContainer  isOpen = {isOpen}
            onClick= {toggle}>
                <Icon onClick= {toggle}>
                    <CloseIcon />
                </Icon>
                <SidebarWrapper>
                    <SidebarMenu>
                        <SidebarLink to="/about" onClick= {toggle}>
                            About
                        </SidebarLink>
                        <SidebarLink to="/services" onClick= {toggle}>
                            Servicecs
                        </SidebarLink>
                        <SidebarLink to="/contato" onClick= {toggle}>
                            Contato
                        </SidebarLink>
                        <SidebarLink to="/sair" onClick= {toggle}>
                            Sair
                        </SidebarLink>
                    </SidebarMenu>
                    <SideBtnWrap>
                        <SidebarRoute to="/login" onClick= {toggle}>
                            Entrar
                        </SidebarRoute>
                    </SideBtnWrap>
                </SidebarWrapper>
            </SidebarContainer>
        </>
    )
}

export default Sidebar