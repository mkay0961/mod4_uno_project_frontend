import React, {Component} from 'react'
import {Transition } from 'semantic-ui-react'

class Card extends Component {
  state = { visible: true }

  enterMouse(e){
    if(window.location.href !== "http://localhost:3001/games"){
      e.target.className = "highlight"
    }
  }

  leaveMouse(e){
    if(window.location.href !== "http://localhost:3001/games"){
      e.target.className = ""
    }
  }

  handleClick = (e) =>{
    this.setState({ visible: !this.state.visible })
    this.props.handleCardClick(this.props.data, e)

  }

  render() {

    const { visible } = this.state

    return(

      <div className="card" >
        {(this.props.data)?
          <div onClick={(e)=>this.handleClick(e)}>
            <Transition animation={"shake"} duration={500} visible={visible}>
              <img onMouseEnter={(e)=>this.enterMouse(e)} onMouseLeave={(e)=>this.leaveMouse(e)} src={require(`../card-imgs/${this.props.data.color}-${this.props.data.number}.png`)} alt="card" />
            </Transition>
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
