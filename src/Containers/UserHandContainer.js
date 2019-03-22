import React, {Component} from 'react'
import Card from '../Components/Card'


class UserHandContainer extends Component {

  render() {
    return(
      <div className="ui cards UserHandContainer">

          {this.props.user.cards.map(c => <Card key={c.id} data={c} />)}
        
      </div>
    )
  }

}

export default UserHandContainer
