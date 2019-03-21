import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import GameContainer from './Containers/GameContainer'

class App extends Component {
  render() {
    return (
      <div className="App">
        <GameContainer />
      </div>
    );
  }
}

export default App;
