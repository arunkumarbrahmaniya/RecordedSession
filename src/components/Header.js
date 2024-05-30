// src/components/Header.js
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Header = () => (
  <HeaderContainer>
    <NavBar>
      <NavItem to="/">Home</NavItem>
      <NavItem to="/about">About</NavItem>
      {/* <NavItem to="/contact">Contact</NavItem> */}
    </NavBar>
  </HeaderContainer>
);

const HeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing(2)};
`;

const NavBar = styled.nav`
  display: flex;
  justify-content: left;
`;

const NavItem = styled(Link)`
  color: #fff;
  font-size: 1.2em;
`;

export default Header;
