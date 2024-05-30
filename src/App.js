// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components'; // Add this line
import GlobalStyles from './styles/GlobalStyles';
import { theme } from './styles/theme';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import 'primeicons/primeicons.css';
import CameraRecorder from './pages/Contact';

const App = () => (
  <ThemeProvider theme={theme}>
    <GlobalStyles />
    <Router>
      <Header />
      <MainContent>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<CameraRecorder/>} />
          {/* <Route path="/contact" element={<Contact />} /> */}
        </Routes>
      </MainContent>
      <Footer />
    </Router>
  </ThemeProvider>
);

const MainContent = styled.main`
  padding-bottom: 50px; /* to ensure content is not hidden behind the fixed footer */
`;

export default App;
