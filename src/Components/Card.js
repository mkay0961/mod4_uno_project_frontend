
import React, {Component} from 'react'

class Card extends Component {

  enterMouse(e){
    e.target.className = "highlight"
  }

  leaveMouse(e){
    e.target.className = ""
  }
  // processImge(){
  //   let color = this.props.data.Color
  //   let number = this.props.data.Number
  //   console.log(this.props.data.Color, this.props.data.Number);
  //   let tag = <img onMouseEnter={(e)=>this.enterMouse(e)} onMouseLeave={(e)=>this.leaveMouse(e)} src={require(`../card-imgs/green-reverse.png`)} alt="card" id="test"/>
  //
  //   if(number <= 9 && (color !== "random" || color !== "black")) {
  //     console.log("---");
  //     console.log("reg card");
  //     console.log(`../card-imgs/${color}-${number}.png`);
  //     console.log("---");
  //
  //   }else{
  //     console.log("---");
  //     console.log("WE GOT A SPECIAL");
  //     if(number >= 10 && number <= 12 ){
  //       console.log("we have a non +4 of randcolor", number, color);
  //       switch(number){
  //         case(10):
  //           console.log(`../card-imgs/${color}-${number}.png`);
  //           break;
  //         case(11):
  //           console.log(`../card-imgs/${color}-${number}.png`);
  //           break;
  //         case(12):
  //           console.log(`../card-imgs/${color}-${number}.png`);
  //           break;
  //
  //       }
  //
  //
  //     }else{
  //       console.log("we have a spec spec" , number, color);
  //
  //     }
  //     console.log("---");
  //
  //   }
  //   // console.log("hi");
  //   // console.log(this.props.data.Color, this.props.data.Number);
  //   // console.log("hi");
  // return tag
  // }

  render() {
    return(
      <div className="card" >
        {(this.props.data)?
          <div onClick={(e)=>this.props.onSelectCardClick(this.props.data, e)}>
            <img onMouseEnter={(e)=>this.enterMouse(e)} onMouseLeave={(e)=>this.leaveMouse(e)} src={require(`../card-imgs/${this.props.data.Color}-${this.props.data.Number}.png`)} alt="card" id="test"/>
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
