import React, { Component} from 'react'
import {Card, Button, CardDeck, Row, Col} from 'react-bootstrap';
import './ProjectGallery.css';

class ProjectGallery extends Component {
  constructor(props) {
    super(props)
    this.state = {tokenURIInfo:''};
    this.handleNextToken = this.handleNextToken.bind(this);
    this.handlePreviousToken = this.handlePreviousToken.bind(this);
  }

  async componentDidMount() {
    const web3 = this.props.web3;
    const artBlocks = this.props.artBlocks;
    const projectTokens = await artBlocks.methods.project_ShowAllTokens(this.props.project).call();
    const projectDescription = await artBlocks.methods.details_ProjectDescription(this.props.project).call();
    const projectTokenDetails = await artBlocks.methods.details_ProjectTokenInfo(this.props.project).call();
    const projectScriptDetails = await artBlocks.methods.details_ProjectScriptInfo(this.props.project).call();
    const projectURIInfo = await artBlocks.methods.details_ProjectURIInfo(this.props.project).call();
    const randomToken = projectTokens[Math.floor(Math.random()*projectTokens.length)];
    this.setState({web3,artBlocks, projectTokens, projectDescription, projectTokenDetails, projectScriptDetails, projectURIInfo, randomToken});
  }

handleNextToken(){
  const currentToken = Number(this.state.randomToken);
  const maxToken = this.props.project*1000000+this.state.projectTokens.length;
  console.log('current '+currentToken);
  console.log('maxTokens '+maxToken);
  if (currentToken<maxToken-1){
    const nextToken = currentToken+1;
    this.setState({randomToken:nextToken});
  } else {
    const nextToken = this.props.project*1000000;
    console.log(nextToken);
    this.setState({randomToken:nextToken.toString()});
  }

}

handlePreviousToken(){
  const currentToken = Number(this.state.randomToken);
  const maxToken = this.state.projectTokens.length;
  console.log('current '+currentToken);
  console.log('maxTokens '+maxToken);
  if (currentToken>this.props.project*1000000){
    const nextToken = (currentToken-1).toString();
    this.setState({randomToken:nextToken});
  } else {
    const nextToken = (this.props.project*1000000)+maxToken-1;
    console.log(nextToken);
    this.setState({randomToken:nextToken.toString()});
  }

}

async updateTokens(){

  const projectTokens = await this.state.artBlocks.methods.project_ShowAllTokens(this.props.project).call();
  this.setState({projectTokens:projectTokens});
}



  render() {

    //console.log(this.props);
    //console.log(this.state.web3);
    //console.log("acct: "+this.props.account);

    console.log(this.state.randomToken && this.state.randomToken);
    console.log(this.props.tokensOfOwner && this.props.tokensOfOwner);

    let owned = this.state.randomToken && this.props.tokensOfOwner && this.props.tokensOfOwner.includes(this.state.randomToken.toString());

      console.log("owned? "+ owned);



      let baseURL = this.props.baseURL;

      function tokenImage(token){
        return baseURL+'/image/'+token;
      }

      function tokenGenerator(token){
        return baseURL+'/generator/'+token;
      }

/*
    if (this.state.projectURIInfo){
      console.log('URI '+ this.state.projectURIInfo[0]);
    }
*/



    return (

      <div className="container">
      {this.state.randomToken &&
      <div>
      <Row>
      <Col className="my-auto">

        <p>Project {this.props.project}</p>
        <h1>{this.state.projectDescription && this.state.projectDescription[0]}</h1>
        <h3>by {this.state.projectDescription && this.state.projectDescription[1]}</h3>
        <a href={this.state.projectDescription && this.state.projectDescription[2]}>{this.state.projectDescription && this.state.projectDescription[2]}</a>
        <p>Total Minted: {this.state.projectTokens && this.state.projectTokens.length} / {this.state.projectTokenDetails && this.state.projectTokenDetails[3]}</p>
        <p>Price per token: {this.state.projectTokenDetails && this.state.web3.utils.fromWei(this.state.projectTokenDetails[1],'ether')}Ξ</p>
        <br />
        <p> Displaying token #{this.state.randomToken && this.state.randomToken}</p>
        <br/>
        <button className='btn-light btn-sm' onClick={() => this.props.handleToggleView("project",this.props.project)}>Visit Gallery</button>

        </Col>
        <Col>
        <CardDeck className="col d-flex justify-content-center">

          <Card className='mt-4' style={{ width: '20rem' }} >
            <Card.Header as="h5">{this.state.projectDescription && this.state.projectDescription[0]} #{Number(this.state.randomToken)-Number(this.props.project)*1000000} {owned?"(yours)":""}</Card.Header>
            <Card.Body>
            {this.state.randomToken &&
            <Card.Img variant="top" src={tokenImage(this.state.randomToken)}/>
          }
            <hr/>
            <div className="text-center">
            <div className="btn-group special">
            <Button variant="dark" onClick={this.handlePreviousToken}>Previous</Button>
            <Button variant="dark" onClick={()=> window.open(tokenGenerator(this.state.randomToken), "_blank")}>Open</Button>
            <Button variant="dark" onClick={this.handleNextToken}>Next</Button>
            </div>
            </div>

            </Card.Body>
            </Card>
        </CardDeck>
        </Col>

        </Row>
        <br/>
        <hr/>
        </div>
      }
      </div>

    );
  }
}

export default ProjectGallery;
