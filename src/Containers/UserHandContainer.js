import React, {Component} from 'react'
import Card from '../Components/Card'


class UserHandContainer extends Component {

  render() {
    return(
      <div className="ui five column grid hand">
        <div className="row">
          {this.props.user.cards.map(c => <Card key={c.id} data={c} />)}
        </div>
      </div>
    )
  }

}

export default UserHandContainer
