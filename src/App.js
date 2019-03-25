import React, { Component } from 'react'
import './App.css';
import GameContainer from './containers/GameContainer'
import Header from './components/Header'
import AllGames from './components/AllGames'
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom'

class App extends Component {


  render() {
    return (
      <div className="App">
        <Header />

        <Route path="/games/:id" render={(props)=> {
            let gameId = props.match.params.id
            return <GameContainer {...props} gameId={gameId} />
          }}/>

        <Route exact path="/games" render={(props)=> {
            return <AllGames {...props}/>
          }}/>

        <Route exact path="/" render={(props)=> {
              return <AllGames {...props}/>
          }}/>

      </div>
    );
  }
}

export default App;
