import React, {Component} from 'react'

class Deck extends Component {

  render() {
    return(
      <div className="card" onClick={this.props.handleDeckClick}>
        <img src={require(`../card-imgs/card-back.png`)} alt="card-back" />
      </div>
      )
  }

}

export default Deck
