import React, { Component} from 'react'
import {Card, Button, CardDeck, Row, Col, ButtonGroup} from 'react-bootstrap';
import {TwitterShareButton} from 'react-twitter-embed';
import {Link} from 'react-router-dom';
import './ProjectGallery.css';


class ViewToken extends Component {
  constructor(props) {
    super(props)
    this.state = {tokenURIInfo:'', token:this.props.token};

  }

  async componentDidMount() {
    console.log(this.props);
    const artBlocks = this.props.artBlocks;
    const projectId = await artBlocks.methods.tokenIdToProjectId(this.props.token).call();
    const projectTokens = await artBlocks.methods.projectShowAllTokens(projectId).call();
    const projectDescription = await artBlocks.methods.projectDetails(projectId).call();
    const projectTokenDetails = await artBlocks.methods.projectTokenInfo(projectId).call();
    const projectScriptDetails = await artBlocks.methods.projectScriptInfo(projectId).call();
    const projectURIInfo = await artBlocks.methods.projectURIInfo(projectId).call();
    const ownerOfToken = await artBlocks.methods.ownerOf(this.props.token).call();
    const tokenHashes = await artBlocks.methods.showTokenHashes(this.props.token).call();
    this.setState({artBlocks, projectTokens, projectDescription, projectTokenDetails, projectScriptDetails, projectURIInfo, projectId, ownerOfToken, tokenHashes});
  }

  render() {



    let baseURL = this.props.baseURL;

    function tokenImage(token){
      return baseURL+'/image/'+token;
    }

    function tokenGenerator(token){
      return baseURL+'/generator/'+token;
    }

    return (

      <div className="container">




      <Row>
      <Col xs={12} md={6} className="my-auto">



        {this.state.projectDescription &&
          <div>

          <h3>{this.state.projectDescription[0]} #{Number(this.state.token)-Number(this.state.projectId)*1000000}</h3>
          <h3>by {this.state.projectDescription[1]}</h3>
          {this.state.projectDescription[3] &&
            <a href={"https://"+this.state.projectDescription[3]}>{this.state.projectDescription[3]}</a>
          }
          {this.state.projectDescription[2] &&
            <p>{this.state.projectDescription[2]}</p>
          }
          <br />
          <br />
          {this.state.ownerOfToken &&
            <p>Owned by <Link to={"/user/"+this.state.ownerOfToken}>{this.state.ownerOfToken.slice(0,10)}</Link></p>
          }
          <br />
          <p style={{"fontSize":"12px"}}>{this.state.tokenHashes && this.state.tokenHashes.length===1?"Token hash:":"Token hashes:"} {this.state.tokenHashes && this.state.tokenHashes}</p>
          <br />
          <p>Total Minted: {this.state.projectTokens && this.state.projectTokens.length} out of a maximum of {this.state.projectTokenDetails && this.state.projectTokenDetails[3]}</p>

          <br />
          <TwitterShareButton
            url={'https://staging.artblocks.io/token/'+this.state.token}
            options={{ text:this.state.projectDescription[0]+" #"+(Number(this.state.token)-Number(this.state.projectId)*1000000)+" by "+this.state.projectDescription[1], via: 'artblocks_io' }}
            tag={'genArt'}
          />
          </div>
        }





        </Col>
        <Col xs={12} md={6}>
        <CardDeck className="col d-flex justify-content-center">

          <Card className='mt-4' style={{ width: '12rem' }} >

            <Card.Body>
            {this.state.token &&
            <Card.Img variant="top" src={tokenImage(this.state.token)}/>
          }
            <hr/>
            <div className="text-center">
            <div >

            <ButtonGroup size="md">
              <Button variant="light" onClick={()=> window.open(tokenImage(this.state.token), "_blank")}>View Image</Button>
              <Button variant="light" onClick={()=> window.open(tokenGenerator(this.state.token), "_blank")}>Visit Script</Button>
              <Button variant="light" as={Link} to={'/project/'+this.state.projectId}>{this.state.projectDescription && this.state.projectDescription[0]} Gallery</Button>
            </ButtonGroup>


            </div>
            </div>

            </Card.Body>
            </Card>
        </CardDeck>
        </Col>

        </Row>
        <hr/>
      </div>
    );
  }
}

export default ViewToken;
