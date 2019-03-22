
import React, {Component} from 'react'

class Card extends Component {

  enterMouse(e){
    e.target.className = "highlight"
  }

  leaveMouse(e){
    e.target.className = ""
  }

  render() {
    return(
      <div className="card" >
        {(this.props.data)?
          <div onClick={()=>this.props.onSelectCardClick(this.props.data)}>
            <img onMouseEnter={(e)=>this.enterMouse(e)} onMouseLeave={(e)=>this.leaveMouse(e)} src={require(`../card-imgs/${this.props.data.Color}-${this.props.data.Number}.png`)} alt="card" id="test"/>
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
