import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    /* Add your default styles here for web apps */
  }

  /* Apply the following styles only for screens smaller than 768px (typical tablet size) */
  @media only screen and (max-width: 767px) {
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f0f0f0;
      color: #333;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    a {
      text-decoration: none;
      color: inherit;
    }

    ul {
      list-style: none;
    }
  }
`;

export default GlobalStyles;