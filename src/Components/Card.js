
import React, {Component} from 'react'

class Card extends Component {

  render() {
    return(
      <div className="card" >
        {(this.props.data)?
          <div onClick={()=>this.props.onSelectCardClick(this.props.data)}>
            <img src={require(`../card-imgs/${this.props.data.Color}-${this.props.data.Number}.png`)} alt="card" id="test"/>
          </div>
          :
          <div >
            <img src={require(`../card-imgs/card-back.png`)} alt="card-back" />
          </div>
      }
      </div>
      )
  }

}

export default Card
