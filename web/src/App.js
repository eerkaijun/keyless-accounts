import logo from './logo.svg';
import './App.css';

function socialLogin() {
  alert('Social Login!');
}

function App() {
  const handleButtonClick = () => {
    socialLogin();
  };

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
