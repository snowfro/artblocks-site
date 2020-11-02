import React, { Component} from 'react'
import {Card, Button, CardDeck, Spinner,Col, Row, Form, Tabs, Tab, ButtonGroup} from 'react-bootstrap';
import {Link} from 'react-router-dom';
//import {TwitterShareButton} from 'react-twitter-embed';


class Project extends Component {
  constructor(props) {
    super(props)
    this.state = {loadQueue:this.props.project*1000000, account:'', tokenURIInfo:'', purchase:false, ineraction:false, project:this.props.project, artistInterface:false, formValue:'', idValue:''};
    this.handleNextImage = this.handleNextImage.bind(this);
    this.handleToggleArtistInterface = this.handleToggleArtistInterface.bind(this);
    this.purchase = this.purchase.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleIdChange = this.handleIdChange.bind(this);

  }

  async componentDidMount() {

    //const web3 = this.props.web3;
    const artBlocks = this.props.artBlocks;
    const network = this.props.network;
    const projectTokens = await artBlocks.methods.projectShowAllTokens(this.props.project).call();
    const projectDescription = await artBlocks.methods.projectDetails(this.props.project).call();
    const projectTokenDetails = await artBlocks.methods.projectTokenInfo(this.props.project).call();
    const projectScriptDetails = await artBlocks.methods.projectScriptInfo(this.props.project).call();
    const projectURIInfo = await artBlocks.methods.projectURIInfo(this.props.project).call();
    const projectRoyaltyInfo = await artBlocks.methods.getRoyaltyData(this.props.project).call();
    this.setState({artBlocks, projectTokens, projectDescription, projectTokenDetails, projectScriptDetails, projectURIInfo, projectRoyaltyInfo, network});
  }

  async componentDidUpdate(oldProps){
    if (oldProps.project !== this.props.project){
      console.log('change');
      let artBlocks = this.props.artBlocks;
      const projectTokens = await artBlocks.methods.projectShowAllTokens(this.props.project).call();
      const projectDescription = await artBlocks.methods.projectDetails(this.props.project).call();
      const projectTokenDetails = await artBlocks.methods.projectTokenInfo(this.props.project).call();
      const projectScriptDetails = await artBlocks.methods.projectScriptInfo(this.props.project).call();
      const projectURIInfo = await artBlocks.methods.projectURIInfo(this.props.project).call();
      const projectRoyaltyInfo = await artBlocks.methods.getRoyaltyData(this.props.project).call();
      this.setState({loadQueue:this.props.project*1000000,projectTokens, projectDescription, projectTokenDetails, projectScriptDetails, projectURIInfo, projectRoyaltyInfo, project:this.props.project});
    } else if (oldProps.artBlocks !== this.props.artBlocks){
      let artBlocks = this.props.artBlocks;
      this.setState({artBlocks});
    }
  }

  async updateValues(){
    let artBlocks = this.props.artBlocks;
    const projectTokens = await artBlocks.methods.showAllTokens(this.props.project).call();
    const projectDescription = await artBlocks.methods.projectDetails(this.props.project).call();
    const projectTokenDetails = await artBlocks.methods.projectTokenInfo(this.props.project).call();
    const projectScriptDetails = await artBlocks.methods.projectScriptInfo(this.props.project).call();
    const projectURIInfo = await artBlocks.methods.projectURIInfo(this.props.project).call();
    const projectRoyaltyInfo = await artBlocks.methods.getRoyaltyData(this.props.project).call();
    this.setState({projectDescription, projectTokenDetails, projectScriptDetails, projectURIInfo, projectRoyaltyInfo, projectTokens, project:this.props.project});
  }

  handleToggleArtistInterface(){
    this.setState({artistInterface:!this.state.artistInterface});
  }

  handleValueChange(event) {
    this.setState({ formValue:event.target.value });
  }


  handleIdChange(event) {
    this.setState({ idValue:event.target.value });
  }

  async handleChange(e,type){
    e.preventDefault();
    this.setState({interaction:true});

    if (type === "price"){
    await this.state.artBlocks.methods.updateProjectPricePerTokenInWei(this.props.project, this.props.web3.utils.toWei(this.state.formValue,'ether')).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "projectName"){
    await this.state.artBlocks.methods.updateProjectName(this.props.project, this.state.formValue).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "artistName"){
    await this.state.artBlocks.methods.updateProjectArtistName(this.props.project, this.state.formValue).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  }
  else if (type === "website"){
    await this.state.artBlocks.methods.updateProjectWebsite(this.props.project, this.state.formValue).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "description"){
    await this.state.artBlocks.methods.updateProjectDescription(this.props.project, this.state.formValue).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "license"){
    await this.state.artBlocks.methods.updateProjectLicense(this.props.project, this.state.formValue).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "maxInvocations"){
    await this.state.artBlocks.methods.updateProjectMaxInvocations(this.props.project, this.state.formValue).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "addScript"){
    await this.state.artBlocks.methods.addProjectScript(this.props.project, this.state.formValue).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "removeLastScript"){
    await this.state.artBlocks.methods.removeProjectLastScript(this.props.project).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "updateScript"){
    //alert(this.props.project, this.state.idValue, this.state.formValue);
    await this.state.artBlocks.methods.updateProjectScript(this.props.project, this.state.idValue, this.state.formValue).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "updateArtistAddress"){
    //alert(this.props.project, this.state.idValue, this.state.formValue);
    await this.state.artBlocks.methods.updateProjectArtistAddress(this.props.project, this.state.formValue).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
      //this.setState({loadQueue:this.props.project*1000000});
      this.setState({artistInterface:false})
    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "hashesPerToken"){
    //alert(this.props.project, this.state.idValue, this.state.formValue);
    await this.state.artBlocks.methods.updateProjectHashesGenerated(this.props.project, this.state.formValue).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
      //this.setState({loadQueue:this.props.project*1000000});

    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "updateAdditionalPayee"){
    //alert(this.props.project, this.state.idValue, this.state.formValue);
    await this.state.artBlocks.methods.updateProjectAdditionalPayee(this.props.project, this.state.formValue).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
      //this.setState({loadQueue:this.props.project*1000000});

    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "updateAdditionalPayeePercentage"){
    //alert(this.props.project, this.state.idValue, this.state.formValue);
    await this.state.artBlocks.methods.updateProjectAdditionalPayeePercentage(this.props.project, this.state.formValue).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
      //this.setState({loadQueue:this.props.project*1000000});

    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "updateSecondaryMarketRoyaltyPercentage"){
    //alert(this.props.project, this.state.idValue, this.state.formValue);
    await this.state.artBlocks.methods.updateProjectSecondaryMarketRoyaltyPercentage(this.props.project, this.state.formValue).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
      //this.setState({loadQueue:this.props.project*1000000});

    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "scriptType"){
    //alert(this.props.project, this.state.idValue, this.state.formValue);
    await this.state.artBlocks.methods.updateProjectScriptType(this.props.project, this.state.formValue).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
      //this.setState({loadQueue:this.props.project*1000000});

    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "updateProjectIpfsHash"){
    //alert(this.props.project, this.state.idValue, this.state.formValue);
    await this.state.artBlocks.methods.updateProjectIpfsHash(this.props.project, this.state.formValue).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
      //this.setState({loadQueue:this.props.project*1000000});

    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "updateProjectBaseURI"){
    //alert(this.props.project, this.state.idValue, this.state.formValue);
    await this.state.artBlocks.methods.updateProjectBaseURI(this.props.project, this.state.formValue).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
      //this.setState({loadQueue:this.props.project*1000000});

    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "updateProjectBaseIpfsURI"){
    //alert(this.props.project, this.state.idValue, this.state.formValue);
    await this.state.artBlocks.methods.updateProjectBaseIpfsURI(this.props.project, this.state.formValue).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
      //this.setState({loadQueue:this.props.project*1000000});

    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  }

  else if (type === "overrideTokenDynamicImageWithIpfsLink"){
    //alert(this.props.project, this.state.idValue, this.state.formValue);
    await this.state.artBlocks.methods.overrideTokenDynamicImageWithIpfsLink(this.state.idValue, this.state.formValue).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
      //this.setState({loadQueue:this.props.project*1000000});

    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  }

  else if (type === "clearTokenIpfsImageUri"){
    //alert(this.props.project, this.state.idValue, this.state.formValue);
    await this.state.artBlocks.methods.clearTokenIpfsImageUri(this.state.idValue).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
      //this.setState({loadQueue:this.props.project*1000000});

    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "useIpfsForStatic"){
    await this.state.artBlocks.methods.toggleProjectUseIpfsForStatic(this.props.project).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "isDynamic"){
    await this.state.artBlocks.methods.toggleProjectIsDynamic(this.props.project).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  } else if (type === "toggleActive"){
    await this.state.artBlocks.methods.toggleProjectStatus(this.props.project).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
  }  else if (type === "toggleLocked"){
    await this.state.artBlocks.methods.toggleProjectIsLocked(this.props.project).send({
      from:this.props.account
    })
    .once('receipt', (receipt) => {
      console.log(receipt);
      this.updateValues();
    })
    .catch(err => {
      //alert(err);
      this.setState({interaction:false});
    });
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
      this.props.handleToggleView("newToken",mintedToken);
    })
    .catch(err => {
      //alert(err);
      this.updateValues();
      this.setState({purchase:false});
    });
  }

  handleNextImage(){
    console.log('clicked');
    let currentCard = this.state.loadQueue;
    let nextCard = currentCard+1;
    this.setState({loadQueue:nextCard});
  }

  render() {
    console.log(this.props.project);

    let scriptCount = this.state.projectScriptDetails && this.state.projectScriptDetails[1];
    console.log("scriptCount"+scriptCount);
    function returnScriptIds(){
      let scripts=[];
      for (let i=0;i<scriptCount;i++){
      scripts.push(<option key={i}>{i}</option>)
    }
    return(scripts);

    }


    if (this.state.projectTokenDetails && this.state.projectTokenDetails[0]===this.props.account){
      console.log("Artist Logged In");
    }
    console.log("interface? "+this.state.artistInterface);
    let baseURL = this.props.baseURL;

    function tokenImage(token){
      return baseURL+'/image/'+token;
    }

    function tokenGenerator(token){
      return baseURL+'/generator/'+token;
    }

    console.log(this.state.projectScriptDetails && this.state.projectScriptDetails);




    //console.log(queue);
    return (


    <Row className={this.state.projectTokens && this.state.projectTokens.length<10 && !this.state.artistInterface?"align-items-center":""}>
      <Col xs={12} sm={6} md={3}>
        <div className="sticky-top">
        <div className="text-align-center">
        <br />
        <br />
        <br />
        {this.state.projectDescription &&
          <div>
          <h1>{this.state.projectDescription[0]}</h1>
          <h3>by {this.state.projectDescription[1]}</h3>
          <a href={this.state.projectDescription[3] && this.state.projectDescription[3]} target="_blank" rel="noopener noreferrer">{this.state.projectDescription[3] && this.state.projectDescription[3]}</a>
          <br/>
          <br/>
          <p>{this.state.projectDescription[2]}</p>
          <br/>
          <p>Total Minted: {this.state.projectTokens && this.state.projectTokens.length} / {this.state.projectTokenDetails && this.state.projectTokenDetails[3]} max</p>

          <p>License: {this.state.projectDescription && this.state.projectDescription[4]}</p>
          <p>Script: {this.state.projectScriptDetails && this.state.projectScriptDetails[0]}</p>
          </div>
        }

        {this.state.projectTokens && this.state.projectTokenDetails && this.state.projectTokens.length<this.state.projectTokenDetails[3] &&
          <div>
          <p>Price per token: {this.state.projectTokenDetails && this.props.web3.utils.fromWei(this.state.projectTokenDetails[1],'ether')}Ξ</p>
          <br />
        {!this.props.connected &&

          <p>Please connect to MetaMask to enable purchases.</p>
        }

        {this.props.connected &&
          <Button className='btn-primary btn-block' onClick={this.purchase}>{this.state.purchase?<div><Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            />
            <span className="sr-only">Pending...</span> Pending...</div>:"Purchase"}</Button>
          }
          </div>
        }
        <br />
        {this.state.projectTokenDetails &&
          <div>
          {(this.props.isWhitelisted || this.state.projectTokenDetails[0]===this.props.account) &&

          <Button onClick={this.handleToggleArtistInterface} className='btn-primary btn-block'>Toggle Artist Interface</Button>
        }
        </div>
        }

        {this.state.projectTokens && this.state.projectTokenDetails && this.state.projectTokens.length===Number(this.state.projectTokenDetails[3]) &&
          <p><b>This project is sold out.</b></p>
        }



        </div>
        </div>
      </Col>

      <Col xs={12} sm={6} md={9}>
      {!this.state.artistInterface &&
        <div>
        <CardDeck>
          {this.state.projectTokens && this.state.projectTokens.map((token,index)=>{
            return (
              <div key={index}>
              <Col>
                <Card border="light" className='mx-auto' style={{ width: '16rem' }} >

                <Card.Body>
                  {this.state.loadQueue<token?<div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                  </div>:<Card.Img variant="top" src={tokenImage(token)} onLoad={this.handleNextImage}/>}
                  <div className="text-center">

                  <ButtonGroup size="sm">
                    <Button variant="light" disabled>#{Number(token)-Number(this.state.project)*1000000}</Button>
                    <Button as={Link} to={'/token/'+token} variant="light" onClick={() => this.props.handleToggleView("viewToken",token)}>Details</Button>
                    <Button variant="light" onClick={()=> window.open(tokenImage(token), "_blank")}>Image</Button>
                    <Button variant="light" onClick={()=> window.open(tokenGenerator(token), "_blank")}>Script</Button>
                  </ButtonGroup>


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
        <Button className='btn-light btn-sm' onClick={() => this.props.handleToggleView("gallery",this.state.project)}>Back To Project List</Button>
        </div>
        </div>
      }

      {this.state.artistInterface &&
        <Col>

        <h3>Artist Dashboard</h3>
        <h5>Artist Address: {this.state.projectTokenDetails[0]}</h5>
        <p>Below you can control your project's representation on the blockchain. <b>Only adjust settings that you are comfortable with. </b></p>
        <p>Please be mindful of <i>which</i> fields that are modifable after a project is locked. Some are and some are not. Once a project is locked it is frozen permanently/immutably so choose wisely.</p>

        <Tabs defaultActiveKey="project" id="uncontrolled-tab-example">


          <Tab eventKey="project" title="Project">

          <div>
          <br/>
            <Form onSubmit={e => this.handleChange(e, "projectName")}>
              <Form.Group>
                <Form.Label><b>Update Project Name</b></Form.Label>
                <Form.Control onChange={this.handleValueChange} type="text" placeholder="Enter Name" />
                <Form.Text className="text-muted">
                  This <b>cannot</b> be changed once project is locked.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br/>
          </div>

          <div>
            <Form onSubmit={e => this.handleChange(e, "artistName")}>
              <Form.Group>
                <Form.Label><b>Update Artist Name</b></Form.Label>
                <Form.Control onChange={this.handleValueChange} type="text" placeholder="Enter Name" />
                <Form.Text className="text-muted">
                  This <b>cannot</b> be changed once project is locked.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br/>
          </div>

          <div>
            <Form onSubmit={e => this.handleChange(e, "website")}>
              <Form.Group>
                <Form.Label><b>Update Project Website</b></Form.Label>
                <Form.Control onChange={this.handleValueChange} type="url" placeholder="Enter your website here. Can be Instagram or Twitter link too." />
                <Form.Text className="text-muted">
                  This can be modified after a project is locked.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br/>
          </div>

          <div>
            <Form onSubmit={e => this.handleChange(e, "description")}>
              <Form.Group>
                <Form.Label><b>Update Project Description</b></Form.Label>
                <Form.Control onChange={this.handleValueChange} as="textarea" rows={3} type="text" placeholder="Enter your project description here. Include any details you would like for people to see about the project." />
                <Form.Text className="text-muted">
                  This can be modified after a project is locked.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br/>
          </div>

          <div>
            <Form onSubmit={e => this.handleChange(e, "license")}>
              <Form.Group>
                <Form.Label><b>Update License</b></Form.Label>
                <Form.Control onChange={this.handleValueChange} type="text" placeholder="Please specify a license for your content. Example: NIFTY License" />
                <Form.Text className="text-muted">
                  This <b>cannot</b> be changed once project is locked.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br/>
          </div>

          </Tab>
          <Tab eventKey="token" title="Token">
          <div>
          <br/>
            <Form onSubmit={e => this.handleChange(e, "price")}>
              <Form.Group>
                <Form.Label><b>Update Price per Token</b></Form.Label>
                <Form.Control onChange={this.handleValueChange} type="number" min="0" step="any" placeholder="Price for each purchase in ETH." />
                <Form.Text className="text-muted">
                  This can be modified after a project is locked.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br/>
          </div>

          <div>
            <Form onSubmit={e => this.handleChange(e, "maxInvocations")}>
              <Form.Group>
                <Form.Label><b>Update Maximum Invocations</b></Form.Label>
                <Form.Control onChange={this.handleValueChange} type="number" placeholder="The maximum number of iterations that can be purchased. Must be less than 1,000,000." />
                <Form.Text className="text-muted">
                  This <b>cannot</b> be changed once project is locked.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br/>
          </div>




          </Tab>
          <Tab eventKey="scripts" title="Scripts">

          <div>
          <br/>
            <Form onSubmit={e => this.handleChange(e, "scriptType")}>
              <Form.Group>
                <Form.Label><b>Update Script Type</b></Form.Label>
                <br />
                <Form.Label>Current setting: {this.state.projectScriptDetails && this.state.projectScriptDetails[0]}</Form.Label>
                <Form.Control onChange={this.handleValueChange} as="select" >
                <option>--- Select Script Type ---</option>
                  <option>p5js</option>
                  <option>processing</option>
                  <option>a-frame</option>
                  <option>threejs</option>
                  <option>custom</option>
                </Form.Control>
                <Form.Text className="text-muted">
                  This <b>cannot</b> be changed once project is locked. If custom please confirm feasibility with Art Blocks.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br/>
          </div>


          <div>
            <Form onSubmit={e => this.handleChange(e, "addScript")}>
              <Form.Group>
                <Form.Label><b>Add Project Script</b></Form.Label>
                <Form.Control onChange={this.handleValueChange} as="textarea" rows={3} type="text" placeholder="Enter your script here." />
                <Form.Text className="text-muted">
                  This <b>cannot</b> be changed once project is locked. Visit <a target="_blank" rel="noopener noreferrer" href={this.props.baseURL+"/project/"+this.state.project}>project dashboard </a>to see full script.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br/>
          </div>

          <div>
            <Form onSubmit={e => this.handleChange(e, "updateScript")}>
              <Form.Group>
                <Form.Label><b>Update Project Script</b></Form.Label>
                <Form.Control onChange={this.handleValueChange} as="textarea" rows={3} type="text" placeholder="Enter your update here and select which scriptId you are updating below." />
                <Form.Text className="text-muted">
                  This <b>cannot</b> be changed once project is locked. Visit <a target="_blank" rel="noopener noreferrer" href={this.props.baseURL+"/project/"+this.state.project}>project dashboard </a>to see full script.
                </Form.Text>
              </Form.Group>
              <Form.Group>
                <Form.Label>Script Id</Form.Label>
                <Form.Control onChange={this.handleIdChange} as="select" >
                <option>--- Select Script Id to Update ---</option>
                  {returnScriptIds()}
                </Form.Control>
              </Form.Group>

              <Button variant="primary" type="submit">
                Submit
              </Button>
              <Button variant="primary mx-1" onClick={e => this.handleChange(e, "removeLastScript")}>
                Remove Last Script
              </Button>
            </Form>
            <br/>
          </div>
          <br/>
          <div>
            <Form onSubmit={e => this.handleChange(e, "hashesPerToken")}>
              <Form.Group>
                <Form.Label><b>Update Hashes Minted per Token</b></Form.Label>
                <br/>
                <Form.Label>Current Hashes Minted per Token: {this.state.projectScriptDetails && this.state.projectScriptDetails[2]}</Form.Label>
                <Form.Control onChange={this.handleValueChange} type="number" placeholder="Choose wisely! More hashes means more random inputs but also more gas per purchase." />
                <Form.Text className="text-muted">
                  This <b>cannot</b> be changed once project is locked.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
              <Button variant="primary mx-1" onClick={e => this.handleChange(e, "isDynamic")}>
                {this.state.projectDescription && this.state.projectDescription[5]?"Project is dynamic. Click to set it to static.":"Project is static. Click to set it to dynamic."}
              </Button>
            </Form>
            <br/>
          </div>
          <div>

          </div>
          <br/>

          <div>
            <Form onSubmit={e => this.handleChange(e, "updateProjectIpfsHash")}>
              <Form.Group>
                <Form.Label><b>Update Project IPFS Hash</b></Form.Label>
                <br/>
                <Form.Label>Currently: {this.state.projectScriptDetails && this.state.projectScriptDetails[3]}</Form.Label>
                <Form.Control onChange={this.handleValueChange} type="text" placeholder="Enter asset IPFS hash." />
                <Form.Text className="text-muted">
                  This <b>cannot</b> be modified after a project is locked. Mostly used for static (non script based) projects with assets stored on IPFS.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
              <Button variant="primary mx-1" onClick={e => this.handleChange(e, "useIpfsForStatic")}>
                {this.state.projectURIInfo && this.state.projectURIInfo[2]?"Using IPFS URI for Static Images. Click to use a BaseURI.":"Using custom URI for static images. Click to use IPFS."}
              </Button>
            </Form>
            <br/>
          </div>

          </Tab>
          <Tab eventKey="royalties" title="Royalties/Payees" >
          <div>
          <br />
            <Form onSubmit={e => this.handleChange(e, "updateAdditionalPayee")}>
              <Form.Group>
                <Form.Label><b>Update AdditionalPayee</b></Form.Label>
                <br/>
                <Form.Label>Current Payee: {this.state.projectTokenDetails && this.state.projectTokenDetails[5]}</Form.Label>
                <Form.Control onChange={this.handleValueChange} type="text" placeholder="Enter payee address" />
                <Form.Text className="text-muted">
                  <b>This address will receive proceeds of each purchase based on the percentage specified below. Can be changed after project is locked.</b>
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br/>
          </div>

          <div>
            <Form onSubmit={e => this.handleChange(e, "updateAdditionalPayeePercentage")}>
              <Form.Group>
                <Form.Label><b>Additional Payee Percentage</b></Form.Label>
                <br/>
                <Form.Label>Currently: {this.state.projectTokenDetails && this.state.projectTokenDetails[6]}%</Form.Label>
                <Form.Control onChange={this.handleValueChange} type="number" placeholder="Enter whole number for percentage of funds to go to additional payee." />
                <Form.Text className="text-muted">
                  This can be modified after a project is locked.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br/>
          </div>

          <div>
            <Form onSubmit={e => this.handleChange(e, "updateSecondaryMarketRoyaltyPercentage")}>
              <Form.Group>
                <Form.Label><b>Update Secondary Market Royalty</b></Form.Label>
                <br/>
                <Form.Label>Currently: {this.state.projectRoyaltyInfo && this.state.projectRoyaltyInfo[3]}%</Form.Label>
                <Form.Control onChange={this.handleValueChange} type="number" placeholder="Enter whole number for percentage for your desired secondary market royalty." />
                <Form.Text className="text-muted">
                  Note this is not guaranteed. A platform must be willing to implement this feature specifically. This can be modified after a project is locked.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br/>
          </div>
          </Tab>
          <Tab eventKey="uri" title="URI" >

          <div>
          <br />
            <Form onSubmit={e => this.handleChange(e, "updateProjectBaseURI")}>
              <Form.Group>
                <Form.Label><b>Update Project BaseURI</b></Form.Label>
                <br/>
                <Form.Label>Current setting: {this.state.projectURIInfo[0]}</Form.Label>
                <Form.Control onChange={this.handleValueChange} type="url" placeholder="Enter your website here. Can be Instagram or Twitter link too." />
                <Form.Text className="text-muted">
                  This can be modified after a project is locked. Modifying this will change where the metadata for each project is retreived.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br/>
          </div>

          <div>
            <Form onSubmit={e => this.handleChange(e, "updateProjectBaseIpfsURI")}>
              <Form.Group>
                <Form.Label><b>Update Project BaseIPFS URI</b></Form.Label>
                <br />
                <Form.Label>Current setting: {this.state.projectURIInfo[1]}</Form.Label>
                <Form.Control onChange={this.handleValueChange} type="url" placeholder="Enter desired base IPFS URI." />
                <Form.Text className="text-muted">
                  This can be modified after a project is locked. Modifying this will change where the metadata for each project is retreived when stored on IPFS.
                </Form.Text>
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            <br/>
            </div>

            <div>
              <Form onSubmit={e => this.handleChange(e, "overrideTokenDynamicImageWithIpfsLink")}>
                <Form.Group>
                  <Form.Label><b>Override Token Dynamic Image with IPFS</b></Form.Label>
                  <Form.Control onChange={this.handleValueChange} type="text" placeholder="Enter token IPFS hash." />
                </Form.Group>
                <Form.Group>
                  <Form.Control onChange={this.handleIdChange} type="number" placeholder="Enter tokenId" >
                  </Form.Control>
                </Form.Group>
                <Form.Text className="text-muted">
                  This can be modified after a project is locked.
                </Form.Text>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
                <Button variant="primary mx-1" onClick={e => this.handleChange(e, "clearTokenIpfsImageUri")}>
                  Clear Token IPFS URI
                </Button>
              </Form>
              <br/>
              </div>




            <br/>


          </Tab>
          <Tab eventKey="danger" title="Danger">

          <div>
          <br />
            <Form onSubmit={e => this.handleChange(e, "updateArtistAddress")}>
              <Form.Group>
                <Form.Label><b>Update Artist Address</b></Form.Label>
                <Form.Control onChange={this.handleValueChange} type="text" placeholder="Enter new artist address" />
                <Form.Text className="text-muted">
                  <b>Caution! Once you change the artist address control of the project will immediately be transferred to the new address!</b>
                </Form.Text>
              </Form.Group>
              <Button variant="danger" type="submit">
                Submit
              </Button>
            </Form>
            <br/>
          </div>

          {this.props.isWhitelisted &&
            <div>
          <Button variant="danger mx-1 btn-block" onClick={e => this.handleChange(e, "toggleActive")}>
            {this.state.projectTokenDetails && this.state.projectTokenDetails[4]?"This project is active. Click here to deactivate.":"Click to activate project."}
          </Button>
          <Button variant="danger mx-1 btn-block" onClick={e => this.handleChange(e, "toggleLocked")}>
            {this.state.projectScriptDetails && !this.state.projectScriptDetails[4]?"This project is unlocked. Click here to lock it (permanently).":"Project is permanently locked."}
          </Button>
          </div>
        }

          </Tab>

        </Tabs>

        </Col>


      }
      </Col>
    </Row>
    );
  }
}

export default Project;
