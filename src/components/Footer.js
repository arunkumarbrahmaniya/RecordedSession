// src/components/Footer.js
import React from 'react';
import styled from 'styled-components';

const Footer = () => (
  <FooterContainer>
    <p>© 2024 Your Company</p>
  </FooterContainer>
);

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.primary};
  color: #fff;
  text-align: center;
  padding: ${({ theme }) => theme.spacing(2)};
  position: fixed;
  width: 100%;
  bottom: 0;
`;

export default Footer;
