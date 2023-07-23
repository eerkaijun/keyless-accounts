import logo from './logo.svg';
import './App.css';
import { socialLogin, handleRedirect } from './utils/auth';
import { useEffect, useState } from 'react';

function App() {
  const [displayText, setDisplayText] = useState('0');

  const handleButtonClick = async () => {
    socialLogin();
  };

  useEffect(() => {
    async function sync() {
      if (localStorage.getItem('redirectToApp') === 'true') {
        const balance = await handleRedirect();
        console.log("Updating balance...");
        setDisplayText(balance);
      }
    }
    sync();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="button-container">
          <button className="button" onClick={handleButtonClick}>Social Login (Mint Free NFT)</button>
        </div>
        <div className="text-container">
          <p>NFT Balance: {displayText}</p>
        </div>
      </header>
    </div>
  );
}

export default App;
