import React, { Component} from 'react'
import { ARTBLOCKS_CONTRACT_ABI, ARTBLOCKS_CONTRACT_ADDRESS } from './config'
import Web3 from 'web3'
import {Card, Button, CardDeck, Row, Col} from 'react-bootstrap';
import './ProjectGallery.css';


class Project extends Component {
  constructor(props) {
    super(props)
    this.state = {tokenURIInfo:'', token:this.props.token};

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

  render() {

    console.log(this.props.tokensOfOwner && this.props.tokensOfOwner);


    function tokenImage(token){
      return 'https://api.artblocks.io/image/'+token;

      //return 'http://localhost:8080/image/'+token;
    }

    function tokenGenerator(token){
      return 'https://api.artblocks.io/generator/'+token;
      //return 'http://localhost:8080/generator/'+token.toString();
    }





    return (

      <div className="container">
      <button type="button" onClick={() => this.props.handleToggleTheaterView("overview")} class="close" aria-label="Close">
      <span aria-hidden="true">&times;</span>
      </button>
      <Row>
      <Col className="my-auto">


        <h1>Purchase complete!</h1>
        <h3>You just minted {this.state.projectDescription && this.state.projectDescription[0]} #{Number(this.state.token)-Number(this.props.project)*1000000}</h3>
        <h3>by {this.state.projectDescription && this.state.projectDescription[1]}</h3>
        {this.state.projectDescription && this.state.projectDescription[2] &&
        <a href={this.state.projectDescription && "https://"+this.state.projectDescription[2]}>{this.state.projectDescription && this.state.projectDescription[2]}</a>
      }
        <p>Total Minted: {this.state.projectTokens && this.state.projectTokens.length} out of a maximum of {this.state.projectTokenDetails && this.state.projectTokenDetails[3]}</p>

        <br />



        </Col>
        <Col xs={9}>
        <CardDeck className="col d-flex justify-content-center">

          <Card className='mt-4' style={{ width: '12rem' }} >

            <Card.Body>
            {this.state.token &&
            <Card.Img variant="top" src={tokenImage(this.state.token)}/>
          }
            <hr/>
            <div className="text-center">
            <div className="btn-group special">

            <Button variant="dark" onClick={()=> window.open(tokenGenerator(this.state.token), "_blank")}>Open</Button>

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

export default Project;
