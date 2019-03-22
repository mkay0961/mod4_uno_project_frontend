import React, {Component} from 'react'
import Card from '../Components/Card'

class CompHandContainer extends Component {

  render() {
    return (
      <div className="ui five column grid">
        <div className="row">
          {this.props.comp.cards.map(c => <Card key={c.id} />)}
        </div>
      </div>
    )
  }

}

export default CompHandContainer
