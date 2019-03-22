import React, {Component} from 'react'
import Card from '../Components/Card'

class CompHandContainer extends Component {

  render() {
    return (
      <div className="ui cards CompHandContainer">

          {this.props.comp.cards.map(c => <Card key={c.id} />)}
        
      </div>
    )
  }

}

export default CompHandContainer
