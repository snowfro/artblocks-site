//https://oneclickdapp.com/beast-powder/

import React, { Component } from 'react'
import { ARTBLOCKS_CONTRACT_ABI, ARTBLOCKS_CONTRACT_ADDRESS } from './config'
import Web3 from 'web3'
import Project from './Project';
import Highlight from './Highlight';
import NewToken from './NewToken';
import Navigation from './Nav';
import ProjectGallery from './ProjectGallery';
import {Col,Row} from 'react-bootstrap';
import './App.css'



const API_KEY = process.env.REACT_APP_INFURA_KEY;

class App extends Component {
  async componentDidMount() {
    if (typeof web3 !== "undefined"){
      const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
      const network = await web3.eth.net.getNetworkType()
      console.log(network);
      const artBlocks = new web3.eth.Contract(ARTBLOCKS_CONTRACT_ABI, ARTBLOCKS_CONTRACT_ADDRESS);
      if (network !== "rinkeby"){
        alert("please change network to Rinkeby and press OK");
        window.location.reload(false);
      } else {
      const activeProjects = await artBlocks.methods.platform_ShowAllProjectIds().call();
      const totalInvocations = await artBlocks.methods.totalSupply().call();
      this.setState({artBlocks, web3, activeProjects, totalInvocations, network, currentProject:Math.floor(Math.random()*activeProjects.length)});
    }
    } else {
      const web3 = new Web3(new Web3.providers.HttpProvider(`https://rinkeby.infura.io/v3/${API_KEY}`));
      const artBlocks = new web3.eth.Contract(ARTBLOCKS_CONTRACT_ABI, ARTBLOCKS_CONTRACT_ADDRESS);
      const activeProjects = await artBlocks.methods.platform_ShowAllProjectIds().call();
      const totalInvocations = await artBlocks.methods.totalSupply().call();
      this.setState({artBlocks, web3, activeProjects, totalInvocations, network:"none", currentProject:Math.floor(Math.random()*activeProjects.length)});
    }
  }

  async loadAccountData() {
    const accounts = await this.state.web3.eth.getAccounts();
    const tokensOfOwner = await this.state.artBlocks.methods.tokensOfOwner(accounts[0]).call();
    this.setState({ account: accounts[0], tokensOfOwner });
  }

  handleConnectToMetamask(){
    if (this.state.network==="rinkeby"){
    window.ethereum.request({method:'eth_requestAccounts'}).then(result=>{
      console.log(result);
      this.setState({connected:true});
      this.loadAccountData();
    });
  } else {
    alert("please switch to rinkeby network then press OK");
    window.location.reload(false);
  }
      //this.loadBlockchainData();
  }

  handleNextProject(){
    //let currentProject = this.state.currentProject;
    let newProject = Math.floor(Math.random()*this.state.activeProjects.length);
    this.setState({currentProject:newProject});
  }

  handleToggleView(input,project){
    console.log(input);
    if (input==="highlight"){
      this.setState({show:"highlight"})
    } else if (input==="gallery"){
      this.setState({show:"gallery", currentProject:project})
      console.log("newproject"+input);
    } else if (input==="project"){
      this.setState({show:"project", currentProject:project})
      console.log("newproject"+input);
    }
  }

  handleToggleTheaterView(input){
    console.log(input);
    if (input==="overview"){
      this.setState({theater:false})
    } else {
      this.setState({theater:true, currentToken:input})
    }
  }

  constructor(props) {
    super(props)
    this.state = { account: '', connected:false, show:"highlight", currentProject:0, theater:false, currenttoken:0}
    this.handleConnectToMetamask = this.handleConnectToMetamask.bind(this);
    this.handleToggleView = this.handleToggleView.bind(this);
    this.handleNextProject = this.handleNextProject.bind(this);
    this.handleToggleTheaterView = this.handleToggleTheaterView.bind(this);
  }

  render() {
    //console.log("Theater?:"+this.state.theater)
    console.log("currentProject"+this.state.currentProject);
    console.log(this.state.network && this.state.network);
    return (

      <div className="container">

      <div>
      {this.state.activeProjects &&
      <Navigation
      web3 = {this.state.web3}
      artBlocks = {this.state.artBlocks}
      handleToggleView = {this.handleToggleView}
      activeProjects = {this.state.activeProjects}
      handleConnectToMetamask = {this.handleConnectToMetamask}
      connected = {this.state.connected}
      network = {this.state.network}
      account = {this.state.account}
      />
      }
      </div>




      <div className="container mt-5">
      {this.state.theater &&
        <div>
        <NewToken
        project={this.state.currentProject}
        token ={this.state.currentToken}
        account = {this.state.account}
        tokensOfOwner = {this.state.tokensOfOwner}
        handleToggleTheaterView = {this.handleToggleTheaterView}
        />
        </div>
      }



      {!this.state.theater &&
        <div>

      {
/*
        this.state.show==="highlight" &&
      <div>
      <h6>There are a total of <b>{this.state.activeProjects && this.state.activeProjects.length}</b> projects currently listed on the platform.</h6>


      <h6><b>{this.state.totalInvocations && this.state.totalInvocations}</b> unique generative iterations have been minted to date.</h6>


      <h6>Each image on the right represents a snapshot of a previously purchased generative work of art. Click <b>next/previous</b> to see more examples or click <b>open</b> to access the live script directly. </h6>

      <h6>Generative outputs result from a script stored on the Art Blocks platform seeded by a unique injected hash that is stored on each purchased token. Artworks are determinsitic and the results are immutable.</h6>

      <h6>When you purchase an Art Blocks work of art you are minting a never before seen iteration resulting from an artist's generative script.</h6>
      {this.state.connected===true &&
        <div>
      <h6>You own the following tokens:</h6>
      <p><b> <small>{this.state.tokensOfOwner && this.state.tokensOfOwner.join(', ')}</small></b></p>
      </div>
    }
      </div>


*/}

      {this.state.activeProjects && this.state.show==="highlight" &&

      <Row className="align-items-center">

      <Col>

        <Highlight
        project ={this.state.currentProject}
        account = {this.state.account}
        tokensOfOwner = {this.state.tokensOfOwner}
        handleToggleView = {this.handleToggleView}
        web3 = {this.state.web3}
        artBlocks = {this.state.artBlocks}
        network = {this.state.network}
        handleNextProject = {this.handleNextProject}
        />

        </Col>
        </Row>


      }

        {this.state.activeProjects && this.state.show==="gallery" &&
          this.state.activeProjects.map((project,index)=>{
          return(
            <div key={index}>
          <ProjectGallery
          background={index%2===1?0:1}
          key={index}
          project ={project}
          account = {this.state.account}
          tokensOfOwner = {this.state.tokensOfOwner}
          handleToggleView = {this.handleToggleView}
          web3 = {this.state.web3}
          artBlocks = {this.state.artBlocks}
          network = {this.state.network}
          />
          </div>
        )
        })
      }

      {this.state.activeProjects && this.state.show==="project" &&

        <Project
        project ={this.state.currentProject}
        account = {this.state.account}
        handleToggleView = {this.handleToggleView}
        connected = {this.state.connected}
        handleToggleTheaterView = {this.handleToggleTheaterView}
        web3 = {this.state.web3}
        artBlocks = {this.state.artBlocks}
        network = {this.state.network}
        />
      }
      </div>
    }
    </div>
    </div>




    );
  }
}

export default App;
