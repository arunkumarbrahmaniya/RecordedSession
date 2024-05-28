// src/pages/About.js
import React from 'react';
import styled from 'styled-components';

const About = () => (
  <AboutPage>
    <h1>About Us</h1>
    <p>This is the about page.</p>
  </AboutPage>
);

const AboutPage = styled.div`
  padding: ${({ theme }) => theme.spacing(4)};
  text-align: center;
`;

export default About;
