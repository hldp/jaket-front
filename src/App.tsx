import React from 'react';
import logo from './logo.svg';
import './App.css';
import Timer from './modules/Timer';

class App extends React.Component {

  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <Timer defaultTimer={10}></Timer>
        </header>
      </div>
    );
  }
}

export default App;