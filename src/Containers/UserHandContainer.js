import React, {Component} from 'react'
import Card from '../Components/Card'


class UserHandContainer extends Component {

  render() {
    return(
      <div className="ui cards UserHandContainer">
          {this.props.userhand.map((c,inx) =><Card onSelectCardClick={this.props.onSelectCardClick} key={inx} data={c} />)}
      </div>
    )
  }

}

export default UserHandContainer
