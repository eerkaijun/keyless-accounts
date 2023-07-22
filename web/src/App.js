import logo from './logo.svg';
import './App.css';
import { socialLogin, handleRedirect } from './utils/auth';
import { useEffect } from 'react';

function App() {
  const handleButtonClick = () => {
    socialLogin();
  };

  useEffect(() => {
    if (localStorage.getItem('redirectToApp') === 'true') {
      handleRedirect();
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button className="button" onClick={handleButtonClick}>Click Me!</button>
      </header>
    </div>
  );
}

export default App;
