import React, { Component} from 'react'
import {Card, Button, CardDeck, Alert,Spinner,Col, Row} from 'react-bootstrap';


class Project extends Component {
  constructor(props) {
    super(props)
    this.state = {loadQueue:this.props.project*1000000, account:'', tokenURIInfo:'', purchase:false, project:this.props.project};
    this.handleNextImage = this.handleNextImage.bind(this);
    this.purchase = this.purchase.bind(this);
    //this.handleToggleTheaterView = handleToggleTheaterView.bind(this);
  }

  async componentDidMount() {

    const web3 = this.props.web3;
    const artBlocks = this.props.artBlocks;
    const network = this.props.network;
    const projectTokens = await artBlocks.methods.project_ShowAllTokens(this.props.project).call();
    const projectDescription = await artBlocks.methods.details_ProjectDescription(this.props.project).call();
    const projectTokenDetails = await artBlocks.methods.details_ProjectTokenInfo(this.props.project).call();
    const projectScriptDetails = await artBlocks.methods.details_ProjectScriptInfo(this.props.project).call();
    const projectURIInfo = await artBlocks.methods.details_ProjectURIInfo(this.props.project).call();
    this.setState({web3,artBlocks, projectTokens, projectDescription, projectTokenDetails, projectScriptDetails, projectURIInfo, network});
  }

  async componentDidUpdate(oldProps){
    if (oldProps.project !== this.props.project){
      console.log('change');
      let artBlocks = this.state.artBlocks;
      const projectTokens = await artBlocks.methods.project_ShowAllTokens(this.props.project).call();
      const projectDescription = await artBlocks.methods.details_ProjectDescription(this.props.project).call();
      const projectTokenDetails = await artBlocks.methods.details_ProjectTokenInfo(this.props.project).call();
      const projectScriptDetails = await artBlocks.methods.details_ProjectScriptInfo(this.props.project).call();
      const projectURIInfo = await artBlocks.methods.details_ProjectURIInfo(this.props.project).call();
      this.setState({loadQueue:this.props.project*1000000,projectTokens, projectDescription, projectTokenDetails, projectScriptDetails, projectURIInfo, project:this.props.project});

    }
  }



  async purchase() {
    this.setState({purchase:true});
    await this.state.artBlocks.methods.purchase(this.props.project).send({
      from:this.props.account,
      value:this.state.projectTokenDetails[1]
    })
    .once('receipt', (receipt) => {
      const mintedToken = receipt.events.Mint.returnValues[1];
      console.log("mintedtoken:"+mintedToken);
      //this.updateTokens();
      this.props.handleToggleView("theater",mintedToken);
})
.catch(err => this.setState({purchase:false}));
}

  handleNextImage(){
    console.log('clicked');
    let currentCard = this.state.loadQueue;
    let nextCard = currentCard+1;
    this.setState({loadQueue:nextCard});
  }

  render() {


    let baseURL = this.props.baseURL;

    function tokenImage(token){
      return baseURL+'/image/'+token;
    }

    function tokenGenerator(token){
      return baseURL+'/generator/'+token;
    }




    //console.log(queue);
    return (


    <Row className={this.state.projectTokens && this.state.projectTokens.length<10?"align-items-center":""}>
      <Col xs={12} sm={6} md={3}>
        <div className="sticky-top">
        <div className="text-align-center">
        <br />
        <br />
        <br />

        <h1>{this.state.projectDescription && this.state.projectDescription[0]}</h1>
        <h3>by {this.state.projectDescription && this.state.projectDescription[1]}</h3>
        <a href={this.state.projectDescription && this.state.projectDescription[2]} target="_blank" rel="noopener noreferrer">{this.state.projectDescription && this.state.projectDescription[2]}</a>
        <p>Total Minted: {this.state.projectTokens && this.state.projectTokens.length} / {this.state.projectTokenDetails && this.state.projectTokenDetails[3]} max</p>
        <p>Each image represents a unique work that combines the generative script created by the artist with a randomly generated string of characters stored on the NFT/token.
          These images are static and generated upon minting of the token. Click the button below each image to access the live script where the output is generated in real time in your browser!</p>
        <p>When you purchase an iteration of this project you are minting a new token with it's own randomly generated string which will produce your own unique version of the work.</p>
        <p>Price per token: {this.state.projectTokenDetails && this.state.web3.utils.fromWei(this.state.projectTokenDetails[1],'ether')}Ξ</p>
        <br />
        <br />
      {!this.props.connected && this.state.network!=="none" &&

        <Alert variant='dark'>Please click "Connect to Metamask" to enable purchases.</Alert>
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
      </Col>

      <Col xs={12} sm={6} md={9}>
        <CardDeck>
          {this.state.projectTokens && this.state.projectTokens.map((token,index)=>{
            return (
              <div key={index}>
              <Col>
                <Card border="light" className='mx-auto' style={{ width: '14rem' }} >
                <Card.Body>
                  {this.state.loadQueue<token?<div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                  </div>:<Card.Img src={tokenImage(token)} onLoad={this.handleNextImage}/>}
                  <div className="text-center">
                  <Button variant="light btn-block mt-1" onClick={()=> window.open(tokenGenerator(token), "_blank")}>#{Number(token)-Number(this.state.project)*1000000}</Button>
                  </div>
                </Card.Body>
                </Card>
              </Col>
              </div>
            )})
          }
        </CardDeck>
        <br/>
        <div className="text-center">
        <button className='btn-light btn-sm' onClick={() => this.props.handleToggleView("overview")}>Go Back</button>
        </div>
      </Col>
    </Row>
    );
  }
}

export default Project;
