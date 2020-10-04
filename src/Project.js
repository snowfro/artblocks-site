import React, { Component} from 'react'
import { ARTBLOCKS_CONTRACT_ABI, ARTBLOCKS_CONTRACT_ADDRESS } from './config'
import Web3 from 'web3'
import {Card, Button, CardDeck} from 'react-bootstrap';


class Project extends Component {
  constructor(props) {
    super(props)
    this.state = {loadQueue:this.props.project*1000000, account:'', tokenURIInfo:''};
    this.handleNextImage = this.handleNextImage.bind(this);
    this.updateTokens = this.updateTokens.bind(this);
    this.purchase = this.purchase.bind(this);
  }

  async componentDidMount() {

    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
    const artBlocks = new web3.eth.Contract(ARTBLOCKS_CONTRACT_ABI, ARTBLOCKS_CONTRACT_ADDRESS);
    const projectTokens = await artBlocks.methods.project_ShowAllTokens(this.props.project).call();
    const projectDescription = await artBlocks.methods.details_ProjectDescription(this.props.project).call();
    const projectTokenDetails = await artBlocks.methods.details_ProjectTokenInfo(this.props.project).call();
    const projectScriptDetails = await artBlocks.methods.details_ProjectScriptInfo(this.props.project).call();
    const projectURIInfo = await artBlocks.methods.details_ProjectURIInfo(this.props.project).call();
    this.setState({web3,artBlocks, projectTokens, projectDescription, projectTokenDetails, projectScriptDetails, projectURIInfo});

  }


  async updateTokens(){
    const projectTokens = await this.state.artBlocks.methods.project_ShowAllTokens(this.props.project).call();
    this.setState({projectTokens});
  }

  async purchase() {
    //this.setState({ loading: true })
    await this.state.artBlocks.methods.purchase(this.props.project).send({
      from:this.props.account,
      value:100000000000000000
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateTokens();
})

}

  handleNextImage(){
    console.log('clicked');
    let currentCard = this.state.loadQueue;
    let nextCard = currentCard+1;
    this.setState({loadQueue:nextCard});
  }

  render() {

    console.log(this.props);
    //console.log(this.state.web3);
    let queue = this.state.loadQueue;
    //const handleNext = this.handleNextImage;

    function tokenImage(token){
      return 'https://abtest-11808.nodechef.com/image/'+token;
      //return 'http://localhost:8080/image/'+token;
    }

    function tokenGenerator(token){
      return 'https://abtest-11808.nodechef.com/generator/'+token;
      //return 'http://localhost:8080/generator/'+token;
    }

    if (this.state.projectURIInfo){
      console.log('URI '+ this.state.projectURIInfo[0]);
    }



    console.log(queue);
    return (

      <div className="container-fluid">

        <h1>Project {this.props.project}</h1>
        <p>Total Minted: {this.state.projectTokens && this.state.projectTokens.length}</p>
        <p>Price per token: {this.state.projectTokenDetails && this.state.web3.utils.fromWei(this.state.projectTokenDetails[1],'ether')}Ξ</p>

        <br />
        <p> Displaying all generated tokens from project {this.props.project}...</p>


        <CardDeck className="col d-flex justify-content-center">
        {this.state.projectTokens && this.state.projectTokens.map((token,index)=>{
          return (
          <div key={index}>
          <Card className='mt-4' style={{ width: '12rem' }} >
            <Card.Header as="h5">{this.state.projectDescription && this.state.projectDescription[0]} #{token}</Card.Header>
            <Card.Body>
            {this.state.loadQueue<token?<div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
            </div>:<Card.Img variant="top" src={tokenImage(token)} onLoad={this.handleNextImage}/>}
            <div className="text-center">
            <Button variant="primary btn-block" onClick={()=> window.open(tokenGenerator(token), "_blank")}>Open</Button>
            </div>

            </Card.Body>
            </Card>
            </div>

        )})
        }
        </CardDeck>
        <br/>
        <button className='btn-block btn-info btn-lg' onClick={this.purchase}>Purchase!</button>


      </div>
    );
  }
}

export default Project;
