import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import GameContainer from './Containers/GameContainer'
import Header from './Components/Header'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <GameContainer/>
      </div>
    );
  }
}

export default App;
