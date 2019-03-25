import React, {Component} from 'react'
import  {Link} from 'react-router-dom'

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

  render() {
    return(
      <div >
        {this.state.allGames.map((game)=>{
          return <li><Link to={`/games/${game.id}`}><button>Open Game {game.id}</button></Link></li>
        })}
      </div>
      )
  }

}

export default AllGames
