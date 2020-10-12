import React, { Component} from 'react'
import {Container, Row, Col, Image, Button} from 'react-bootstrap';
import './ProjectGallery.css';

class Highlight extends Component {
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

  async componentDidUpdate(oldProps){
    if (oldProps.project !== this.props.project){
      console.log('change');
    let artBlocks = this.state.artBlocks;
    const projectTokens = await artBlocks.methods.project_ShowAllTokens(this.props.project).call();
    const projectDescription = await artBlocks.methods.details_ProjectDescription(this.props.project).call();
    const projectTokenDetails = await artBlocks.methods.details_ProjectTokenInfo(this.props.project).call();
    const projectScriptDetails = await artBlocks.methods.details_ProjectScriptInfo(this.props.project).call();
    const projectURIInfo = await artBlocks.methods.details_ProjectURIInfo(this.props.project).call();
    const randomToken = projectTokens[Math.floor(Math.random()*projectTokens.length)];
    this.setState({projectTokens, projectDescription, projectTokenDetails, projectScriptDetails, projectURIInfo, randomToken});
  }
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




  render() {

    //console.log(this.props);
    //console.log(this.state.web3);
    //console.log("acct: "+this.props.account);

    console.log(this.state.randomToken && this.state.randomToken);
    console.log(this.props.tokensOfOwner && this.props.tokensOfOwner);

    let owned = this.state.randomToken && this.props.tokensOfOwner && this.props.tokensOfOwner.includes(this.state.randomToken.toString());

      console.log("owned? "+ owned);



    function tokenImage(token){
      return 'https://api.artblocks.io/image/'+token;

      //return 'http://localhost:8080/image/'+token;
    }

    function tokenGenerator(token){
      return 'https://api.artblocks.io/generator/'+token;
      //return 'http://localhost:8080/generator/'+token.toString();
    }

/*
    if (this.state.projectURIInfo){
      console.log('URI '+ this.state.projectURIInfo[0]);
    }
*/

    return (
      
  <Row className="align-items-center">

    <Col xs={12} md={6}>
    <a href={tokenGenerator(this.state.randomToken)} target="_blank" rel="noopener noreferrer">
      <Image style={{width:"100%"}} src={tokenImage(this.state.randomToken)} rounded />
      </a>
    </Col>
    <Col xs={10} md={5}>
    <Container style={{border:"1px solid gray", borderRadius:"2px"}}>
    <div className="mt-2 mb-2">
    <h5>{this.state.projectDescription && this.state.projectDescription[0]}</h5>
    <h6>{this.state.projectDescription && this.state.projectDescription[1]}</h6>
    <br/>
    <p>#{Number(this.state.randomToken)-Number(this.props.project)*1000000} of {this.state.projectTokens && this.state.projectTokens.length} minted ({this.state.projectTokenDetails && this.state.projectTokenDetails[3]} max)<span style={{"float":"right"}}>{this.state.projectTokenDetails && this.state.web3.utils.fromWei(this.state.projectTokenDetails[1],'ether')}Ξ</span></p>

    </div>
    </Container>
    </Col>
    <Col>
    <Button variant="outline" onClick={()=>{this.props.handleNextProject()}}>
    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-arrow-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
    </svg>
    </Button>
    </Col>
  </Row>
    );
  }
}

export default Highlight;