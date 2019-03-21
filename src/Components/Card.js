
import React, {Component} from 'react'

class Card extends Component {

  render() {
    return(
      <div>
        Card
        {(this.props.data)?
          `Number: ${this.props.data.Number} Color:  ${this.props.data.Color}`
          :
          "SHOW BACK OF CARD"
        }
      </div>
      )
  }

}

export default Card
