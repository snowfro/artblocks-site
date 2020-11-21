import React, { Component} from 'react'
import {Card, Button, CardDeck, Col, Row, ButtonGroup} from 'react-bootstrap';
import {Link} from 'react-router-dom';


class UserGallery extends Component {
  constructor(props) {
    super(props)
    this.state = {};

  }

  async componentDidMount() {
    const artBlocks = this.props.artBlocks;
    const network = this.props.network;
    console.log("lua"+this.props.lookupAcct);
    const tokensOfAccount = await artBlocks.methods.tokensOfOwner(this.props.lookupAcct).call();
    const tokenData = await Promise.all(tokensOfAccount.map(async (token)=>{
      const projectId = await artBlocks.methods.tokenIdToProjectId(token).call();
      return [token, projectId];
    }));
    let projectsOfAccount = new Set(await Promise.all(tokensOfAccount.map(async (token)=>{
      let projectId = await artBlocks.methods.tokenIdToProjectId(token).call();
      return projectId;
    })));
    this.setState({artBlocks, tokenData, projectsOfAccount, network, tokensOfAccount});
    this.buildUserTokenArray();
  }

  async componentDidUpdate(oldProps){
    if (oldProps.lookupAcct !== this.props.lookupAcct){
      console.log('acctchange');
    const artBlocks = this.props.artBlocks;
    const network = this.props.network;
    const tokensOfAccount = await artBlocks.methods.tokensOfOwner(this.props.lookupAcct).call();
    const tokenData = await Promise.all(tokensOfAccount.map(async (token)=>{
      const projectId = await artBlocks.methods.tokenIdToProjectId(token).call();
      return [token, projectId];
    }));
    let projectsOfAccount = new Set(await Promise.all(tokensOfAccount.map(async (token)=>{
      let projectId = await artBlocks.methods.tokenIdToProjectId(token).call();
      return projectId;
    })));
    this.setState({artBlocks, tokenData, projectsOfAccount, network, tokensOfAccount});
    this.buildUserTokenArray();
    }
  }

  async buildUserTokenArray() {
    let projects ={};

    for (let project of this.state.projectsOfAccount) {
      const projectDescription = await this.state.artBlocks.methods.projectDetails(project).call();
      const projectTokenDetails = await this.state.artBlocks.methods.projectTokenInfo(project).call();
      const projectScriptDetails = await this.state.artBlocks.methods.projectScriptInfo(project).call();
      const projectURIInfo = await this.state.artBlocks.methods.projectURIInfo(project).call();

      let tokens = [];
      for (let i=0;i<this.state.tokenData.length;i++){
        if (this.state.tokenData[i][1]===project){
          tokens.push(this.state.tokenData[i][0]);
        }
      }
      projects[project]={tokens,projectDescription,projectTokenDetails,projectScriptDetails,projectURIInfo}
      };
    this.setState({projects});
  }

  render() {


    console.log(this.props);
    let baseURL = this.props.baseURL;

    function tokenImage(token){
      return baseURL+'/image/'+token;
    }

    function tokenGenerator(token){
      return baseURL+'/generator/'+token;
    }

    return (
      <div className="mt-4">
      <h5>User <a href={"https://rinkeby.etherscan.io/address/"+this.props.lookupAcct} target="_blank" rel="noopener noreferrer">{this.props.lookupAcct.slice(0,10)}'s</a> Collection</h5>
      <p>Total works purchased or minted: {this.state.tokensOfAccount && this.state.tokensOfAccount.length}</p>
      <br/>
      {this.state.projects &&

            Object.keys(this.state.projects).map((project,index) => {
              return(
              <div key={index}>
              <Row >
                <Col xs={12} sm={6} md={3}>
                  <div className="sticky-top">
                  <div className="text-align-center">
                  <br />
                  <br />
                  <br />

                  <h1>{this.state.projects[project].projectDescription[0]}</h1>
                  <h3>by {this.state.projects[project].projectDescription[1]}</h3>
                  <a href={this.state.projects[project].projectDescription[3]} target="_blank" rel="noopener noreferrer">{this.state.projects[project].projectDescription[3]}</a>
                  <p>Total Minted: {this.state.projects[project].projectTokenDetails[2]} / {this.state.projects[project].projectTokenDetails[3]} max</p>
                  <br />
                  <p>{this.state.projects[project].projectDescription[2]}</p>
                  <br/>
                  <p>Price per token: {this.props.web3.utils.fromWei(this.state.projects[project].projectTokenDetails[1] ,'ether')}Ξ</p>
                  <br />
                  <Button variant="dark btn-sm" as={Link} to={'/project/'+project} >Visit Project</Button>
                  </div>
                  </div>
                </Col>

                <Col xs={12} sm={6} md={9}>
                  <CardDeck>
                    {this.state.projects[project].tokens.map((token,index)=>{
                      return (
                        <div key={index}>
                        <Col>
                          <Card border="light" className='mx-auto' style={{ width: '16rem' }} >
                          <Card.Body>
                            <Card.Img src={tokenImage(token)} />
                            <div className="text-center">
                            <ButtonGroup size="sm">
                              <Button variant="light" disabled>#{Number(token)-Number(project)*1000000}</Button>
                              <Button as={Link} to={"/token/"+token} variant="light" onClick={() => this.props.handleToggleView("viewToken",token)}>Details</Button>
                              <Button variant="light" onClick={()=> window.open(tokenImage(token), "_blank")}>Image</Button>
                              <Button variant="light" onClick={()=> window.open(tokenGenerator(token), "_blank")}>Live</Button>
                            </ButtonGroup>
                            </div>
                          </Card.Body>
                          </Card>
                        </Col>
                        </div>
                      )})}

                  </CardDeck>
                </Col>
              </Row>
              <hr />
              </div>

            )
          })
    }
</div>
    );
  }
}

export default UserGallery;
