import React, { Component} from 'react'
import {Card, Button, CardDeck, Col, Row} from 'react-bootstrap';


class UserGallery extends Component {
  constructor(props) {
    super(props)
    this.state = {loadQueue:this.props.project*1000000, account:'', tokenURIInfo:'', purchase:false};
    //this.handleToggleTheaterView = handleToggleTheaterView.bind(this);
  }

  async componentDidMount() {

    const web3 = this.props.web3;
    const artBlocks = this.props.artBlocks;
    const network = this.props.network;
    const tokenData = await Promise.all(this.props.tokensOfOwner.map(async (token)=>{
      const projectId = await artBlocks.methods.tokenIdToProjectId(token).call();
      /*
      const projectDescription = await artBlocks.methods.details_ProjectDescription(projectId).call();
      const projectTokenDetails = await artBlocks.methods.details_ProjectTokenInfo(projectId).call();
      const projectScriptDetails = await artBlocks.methods.details_ProjectScriptInfo(projectId).call();
      const projectURIInfo = await artBlocks.methods.details_ProjectURIInfo(projectId).call();
      */
      return [token, projectId];
    }));
    let projectsOfOwner = new Set(await Promise.all(this.props.tokensOfOwner.map(async (token)=>{
      let projectId = await artBlocks.methods.tokenIdToProjectId(token).call();
      return projectId;
    })));
    this.setState({web3, artBlocks, tokenData, projectsOfOwner, network});
    this.buildUserTokenArray();
  }

  async buildUserTokenArray() {
    let projects ={};
    //const sortedProjects = new Set(this.state.projectsOfOwner);
    //console.log(this.state.tokenData);
    for (let project of this.state.projectsOfOwner) {
      const projectDescription = await this.state.artBlocks.methods.details_ProjectDescription(project).call();
      const projectTokenDetails = await this.state.artBlocks.methods.details_ProjectTokenInfo(project).call();
      const projectScriptDetails = await this.state.artBlocks.methods.details_ProjectScriptInfo(project).call();
      const projectURIInfo = await this.state.artBlocks.methods.details_ProjectURIInfo(project).call();

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


    let baseURL = this.props.baseURL;

    function tokenImage(token){
      return baseURL+'/image/'+token;
    }

    function tokenGenerator(token){
      return baseURL+'/generator/'+token;
    }




    console.log(this.state.projects);
    return (
  <div>

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
                  <a href={this.state.projects[project].projectDescription[2]} target="_blank" rel="noopener noreferrer">{this.state.projects[project].projectDescription[2]}</a>
                  <p>Total Minted: {this.state.projects[project].projectTokenDetails[2]} / {this.state.projects[project].projectTokenDetails[3]} max</p>
                  <br />
                  <p>Price per token: {this.state.web3.utils.fromWei(this.state.projects[project].projectTokenDetails[1] ,'ether')}Ξ</p>
                  <br />
                  <Button variant="dark" onClick={()=>this.props.handleToggleView("project",project)}>Visit Project</Button>
                  </div>
                  </div>
                </Col>

                <Col xs={12} sm={6} md={9}>
                  <CardDeck>
                    {this.state.projects[project].tokens.map((token,index)=>{
                      return (
                        <div key={index}>
                        <Col>
                          <Card border="light" className='mx-auto' style={{ width: '14rem' }} >
                          <Card.Body>
                            <Card.Img src={tokenImage(token)} />
                            <div className="text-center">
                            <Button variant="light btn-block mt-1" onClick={()=> window.open(tokenGenerator(token), "_blank")}>#{Number(token)-Number(project)*1000000}</Button>
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
