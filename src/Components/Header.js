import React from 'react'
import { Menu, Segment } from 'semantic-ui-react'

const Header = () => {

  return (
    <div className="ui nav">
    <Segment inverted>
        <Menu inverted secondary>
          <Menu.Menu position='center'>
            
          </Menu.Menu>
        </Menu>
      </Segment>
    </div>
  )
}

export default Header
