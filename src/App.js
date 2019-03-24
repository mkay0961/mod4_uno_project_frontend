import React, { Component } from 'react'
import './App.css';
import GameContainer from './containers/GameContainer'
import Header from './components/Header'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <GameContainer />
      </div>
    );
  }
}

export default App;
