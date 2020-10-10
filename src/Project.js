import React, { Component} from 'react'
import { ARTBLOCKS_CONTRACT_ABI, ARTBLOCKS_CONTRACT_ADDRESS } from './config'
import Web3 from 'web3'
import {Card, Button, CardDeck, Alert,Spinner} from 'react-bootstrap';


class Project extends Component {
  constructor(props) {
    super(props)
    this.state = {loadQueue:this.props.project*1000000, account:'', tokenURIInfo:'', purchase:false};
    this.handleNextImage = this.handleNextImage.bind(this);
    this.updateTokens = this.updateTokens.bind(this);
    this.purchase = this.purchase.bind(this);
    //this.handleToggleTheaterView = handleToggleTheaterView.bind(this);
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
    this.setState({purchase:true});
    await this.state.artBlocks.methods.purchase(this.props.project).send({
      from:this.props.account,
      value:100000000000000000
    })
    .once('receipt', (receipt) => {
      const mintedToken = receipt.events.Mint.returnValues[1];
      console.log("mintedtoken:"+mintedToken);
      //this.updateTokens();
      this.props.handleToggleTheaterView(mintedToken);
})
.catch(err => this.setState({purchase:false}));

//this.props.handleToggleTheaterView(7000000);
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

      <div className="container mt-5">
      <button type="button" onClick={() => this.props.handleToggleView("overview")} class="close" aria-label="Close">
      <span aria-hidden="true">&times;</span>
      </button>

      <div className="row">
      <div className="col-3">
      <div className="sticky-top">
      <div className="text-align-center">
      <br />
      <br />
      <br />

      <h1>{this.state.projectDescription && this.state.projectDescription[0]}</h1>
      <h3>by {this.state.projectDescription && this.state.projectDescription[1]}</h3>
      <a href={this.state.projectDescription && this.state.projectDescription[2]}>{this.state.projectDescription && this.state.projectDescription[2]}</a>
      <p>Total Minted: {this.state.projectTokens && this.state.projectTokens.length} / {this.state.projectTokenDetails && this.state.projectTokenDetails[3]} max</p>
      <p>Price per token: {this.state.projectTokenDetails && this.state.web3.utils.fromWei(this.state.projectTokenDetails[1],'ether')}Ξ</p>
      <br />
      <br />
      {!this.props.connected &&

        <Alert variant='dark'>Please go back and click "Connect to Metamask" to enable purchases.</Alert>
      }
      {this.props.connected &&
      <button className='btn-primary btn-sm' onClick={this.purchase}>{this.state.purchase?<div><Spinner
      as="span"
      animation="border"
      size="sm"
      role="status"
      aria-hidden="true"
    />
    <span className="sr-only">Pending...</span> Pending...</div>:"Purchase!"}</button>
    }

</div>
</div>
</div>

  <div className="col">

        <CardDeck className="col d-flex justify-content-center">
        {this.state.projectTokens && this.state.projectTokens.map((token,index)=>{
          return (
          <div key={index}>
          <Card border="light" className='mt-4' style={{ width: '12rem' }} >
            <Card.Body>
            {this.state.loadQueue<token?<div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
            </div>:<Card.Img variant="top" src={tokenImage(token)} onLoad={this.handleNextImage}/>}
            <div className="text-center">
            <Button variant="light btn-block" onClick={()=> window.open(tokenGenerator(token), "_blank")}>#{Number(token)-Number(this.props.project)*1000000}</Button>
            </div>

            </Card.Body>
            </Card>
            </div>

        )})
        }
        </CardDeck>
        <br/>
        <div className="text-center">
        <button className='btn-light btn-sm' onClick={() => this.props.handleToggleView("overview")}>Go Back</button>
        </div>
        </div>


      </div>

      <br />
      <br />
      </div>


    );
  }
}

export default Project;