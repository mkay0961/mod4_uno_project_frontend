import React, {Component} from 'react'

class Deck extends Component {

  enterMouse(e){
    e.target.className = "highlight"
  }

  leaveMouse(e){
    e.target.className = ""
  }

  render() {
    return(
      <div className="card" onClick={this.props.handleDeckClick}>
        <img onMouseEnter={(e)=>this.enterMouse(e)} onMouseLeave={(e)=>this.leaveMouse(e)} src={require(`../card-imgs/card-back.png`)} alt="card-back" />
      </div>
      )
  }

}

export default Deck
