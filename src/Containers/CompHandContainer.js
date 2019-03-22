import React, {Component} from 'react'
import Card from '../Components/Card'

class CompHandContainer extends Component {

  render() {
    return (
      <div className="ui cards CompHandContainer">

          {this.props.comphand.map((c,inx) => <Card key={inx} />)}

      </div>
    )
  }

}

export default CompHandContainer
