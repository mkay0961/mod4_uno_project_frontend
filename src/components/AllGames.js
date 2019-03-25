import React, {Component} from 'react'
import  {Link} from 'react-router-dom'
import NewGame from './NewGame'

class AllGames extends Component {
  constructor(){
    super()
    this.state = {
      allGames: []
    }
  }
  componentDidMount(){
    fetch("http://localhost:3000/games")
    .then(res => res.json())
    .then(json => this.setState({allGames: json}))
  }

  newGame = () => {
    console.log("new game")

    let data = {name: "Phil"}

    fetch("http://localhost:3000/games",{
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(json =>{
          this.props.history.push(`/games/${json.id}`)
          // <Redirect to={`/games/${json.id}`}/>
          console.log(json);
        })
    }

  render() {
    return(
    <div>
      <div className="allGames">All Games</div>
      <div className="newGame"><NewGame newGame={this.newGame} /></div>
      <div className="ui cards">
        {this.state.allGames.map((game)=>{
          return <div className="card"><Link to={`/games/${game.id}`}><button className="game-card">Open Game {game.id}</button></Link></div>
        })}
      </div>
    </div>
      )
  }

}

export default AllGames
