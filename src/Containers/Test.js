import React from 'react'
import {Transition } from 'semantic-ui-react'
import CompHandContainer from './CompHandContainer'


class Test extends React.Component {

  state = { visible: true,
            anime: "fly up",
            cardsDealt: 0,
            duration: 500,
            hand1:[],
            hand2:[],
            hand3:[],
            hand4:[]
          }

  handleClick = () =>{
    // let array = ["fly up", "fly down", "fly left", "fly right"]
    // let k = 0

    // for (let i = 0; i < 20000; i+=1000) {
    //   this.setState({anime: array[k]},()=>{
    //     setTimeout(()=>this.setState({ visible: !this.state.visible}), 1000)
      // })

      // setTimeout(()=>{this.setState({ visible: !this.state.visible,
      //                                 anime: array[k]
      //  })}, i)
    //   k++
    //   if(k === 4){
    //     k = 0
    //   }
    //
    // }
    // this.setState({ visible: !this.state.visible })
    let x = setInterval(()=>{this.dealCard()}, 400)
    setTimeout(()=>{clearInterval(x)
                    this.props.startGame()}, 16000)

  }

  dealCard = () => {

    let array = ["fly right", "jiggle", "fly down", "jiggle", "fly left", "jiggle", "fly up", "jiggle"]
    let index = this.state.cardsDealt % 8
    let visible = this.state.visible
    if (visible === false) {
      console.log("about to mount");
      this.setState({duration: 10})
    } else {
      console.log("about to unmount");
      this.setState({duration: 500})
    }
    switch(array[index]){
      case("jiggle"):
          console.log("jiggle");
          break;
      case("fly right"):
          console.log("left");
          this.setState({hand1: [...this.state.hand1, 1]})
          break;
      case("fly left"):
          console.log("right");
          this.setState({hand3: [...this.state.hand3, 1]})
          break;
      case("fly up"):
          console.log("down");
          this.setState({hand4: [...this.state.hand4, 1]})
          break;
      case("fly down"):
          console.log("up");
          this.setState({hand2: [...this.state.hand2, 1]})
          break;



    }
    this.setState({
      visible: !visible, anime:array[index] ,cardsDealt: this.state.cardsDealt + 1
    })
  }

render(){
  const { visible } = this.state
    return(
      <div className="grid-container">
        <div className="item1" id={`person-${1}`} >

            <CompHandContainer hand={this.state.hand1}/>
          </div>
        <div className="item2" id={`person-${2}`}>

          <CompHandContainer hand={this.state.hand2}/>
        </div>
        <div className="item3" id={`person-${3}`}>

          <CompHandContainer hand={this.state.hand3}/>
        </div>
        <div className="item4" onClick={this.handleClick}>
        <Transition animation={this.state.anime} duration={this.state.duration} visible={visible}>
          <img src={require(`../card-imgs/card-back.png`)} alt="card" />
        </Transition>
        </div>
        <div className="item5" id={`person-${0}`}>

          <CompHandContainer hand={this.state.hand4}/>
      </div>

    </div>
    )

  }
}
export default Test
