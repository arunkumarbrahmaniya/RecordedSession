// src/pages/Contact.js
import React from 'react';
import styled from 'styled-components';

const Contact = () => (
  <ContactPage>
    <h1>Contact Us</h1>
    <p>This is the contact page.</p>
  </ContactPage>
);

const ContactPage = styled.div`
  padding: ${({ theme }) => theme.spacing(4)};
  text-align: center;
`;

export default Contact;
