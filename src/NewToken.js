import React, { Component} from 'react'
import {Card, Button, CardDeck, Row, Col, ButtonGroup} from 'react-bootstrap';
import {TwitterShareButton} from 'react-twitter-embed';
//import {Link} from 'react-router-dom';
import './ProjectGallery.css';


class NewToken extends Component {
  constructor(props) {
    super(props)
    this.state = {tokenURIInfo:'', token:this.props.token};

  }

  async componentDidMount() {
    const artBlocks = this.props.artBlocks;
    const projectId = await artBlocks.methods.tokenIdToProjectId(this.props.token).call();
    const projectTokens = await artBlocks.methods.projectShowAllTokens(projectId).call();
    const projectDescription = await artBlocks.methods.projectDetails(projectId).call();
    const projectTokenDetails = await artBlocks.methods.projectTokenInfo(projectId).call();
    const projectScriptDetails = await artBlocks.methods.projectScriptInfo(projectId).call();
    const projectURIInfo = await artBlocks.methods.projectURIInfo(projectId).call();
    this.setState({artBlocks, projectId, projectTokens, projectDescription, projectTokenDetails, projectScriptDetails, projectURIInfo});
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
      <button type="button" onClick={() => this.props.handleToggleView("off")} className="close" aria-label="Close">
      <span aria-hidden="true">&times;</span>
      </button>
      <Row>
      <Col xs={12} md={6} className="my-auto">


        <h1>Purchase complete!</h1>
        {this.state.projectDescription &&
          <div>

          <h3>You just minted {this.state.projectDescription[0]} #{Number(this.props.token)-Number(this.state.projectId && this.state.projectId)*1000000}</h3>
          <h3>by {this.state.projectDescription[1]}</h3>
          {this.state.projectDescription[3] &&
            <a href={"https://"+this.state.projectDescription[3]}>{this.state.projectDescription[3]}</a>
          }
          {this.state.projectDescription[2] &&
            <p>{this.state.projectDescription[2]}</p>
          }

          <p>Total Minted: {this.state.projectTokens && this.state.projectTokens.length} out of a maximum of {this.state.projectTokenDetails && this.state.projectTokenDetails[3]}</p>

          <br />
          <TwitterShareButton
            url={'https://staging.artblocks.io/token/'+this.state.token}
            options={{ text:"I just minted "+this.state.projectDescription[0]+" #"+(Number(this.props.token)-Number(this.state.projectId && this.state.projectId)*1000000)+" by "+this.state.projectDescription[1]+"!", via: 'artblocks_io' }}
            tag={'genArt'}
          />
          </div>
        }





        </Col>
        <Col xs={12} md={6}>
        <CardDeck className="col d-flex justify-content-center">

          <Card className='mt-4' style={{ width: '12rem' }} >

            <Card.Body>
            {this.props.token &&
            <Card.Img variant="top" src={tokenImage(this.props.token)}/>
          }
            <hr/>
            <div className="text-center">
            <div>

            <ButtonGroup size="md">
              <Button variant="light" onClick={()=> window.open(tokenImage(this.props.token), "_blank")}>View Image</Button>
              <Button variant="light" onClick={()=> window.open(tokenGenerator(this.props.token), "_blank")}>Visit Script</Button>
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

export default NewToken;
