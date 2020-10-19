//https://oneclickdapp.com/beast-powder/

import React, { Component } from 'react'
import { ARTBLOCKS_CONTRACT_ABI, ARTBLOCKS_CONTRACT_ADDRESS } from './config'
import Web3 from 'web3'
import Project from './Project';
import Highlight from './Highlight';
import NewToken from './NewToken';
import Navigation from './Nav';
import Intro from './Intro';
import ProjectGallery from './ProjectGallery';
import UserGallery from './UserGallery';
import Learn from './Learn';
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

  handleToggleView(view,input){
    console.log(view,input);
    if (view==="highlight"){
      this.setState({show:"highlight"})
    } else if (view==="gallery"){
      this.setState({show:"gallery", currentProject:input})
      console.log("newproject"+input);
    } else if (view==="project"){
      this.setState({show:"project", currentProject:input})
      console.log("newproject"+input);
    } else if (view==="theater"){
      this.setState({show:"theater", currentToken:input})
    } else if (view==="usergallery"){
      this.setState({show:"usergallery", currentToken:input})
    } else if (view==="learn"){
      this.setState({show:"learn", currentToken:input})
    }
  }



  constructor(props) {
    super(props)
    this.state = { account: '', connected:false, show:"highlight", currentProject:0, currenttoken:0}
    this.handleConnectToMetamask = this.handleConnectToMetamask.bind(this);
    this.handleToggleView = this.handleToggleView.bind(this);
    this.handleNextProject = this.handleNextProject.bind(this);

  }

  render() {

    let baseURL = "https://api.artblocks.io";

    //let baseURL = "http://localhost:8080"

    //console.log("currentProject"+this.state.currentProject);
    //console.log(this.state.network && this.state.network);
    return (

      <div className="container-fluid">

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
      tokensOfOwner={this.state.tokensOfOwner}
      baseURL ={baseURL}
      />
      }
      </div>




      <div className="container-fluid">
      {this.state.show==="theater" &&
        <div>
        <NewToken
        project={this.state.currentProject}
        token ={this.state.currentToken}
        account = {this.state.account}
        tokensOfOwner = {this.state.tokensOfOwner}
        handleToggleView = {this.handleToggleView}
        baseURL ={baseURL}
        />
        </div>
      }






      {this.state.activeProjects && this.state.show==="highlight" &&
        <div className="container-fluid mt-5">
          <Intro
            activeProjects={this.state.activeProjects}
            totalInvocations={this.state.totalInvocations}
          />
        <div className="container mt-5">
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
              baseURL ={baseURL}
            />
          </Col>
          </Row>
        </div>
        </div>
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
          baseURL ={baseURL}
          />
          </div>
        )
        })
      }

      {this.state.activeProjects && this.state.show==="project" &&
      <div >
        <Project
        project ={this.state.currentProject}
        account = {this.state.account}
        handleToggleView = {this.handleToggleView}
        connected = {this.state.connected}
        web3 = {this.state.web3}
        artBlocks = {this.state.artBlocks}
        network = {this.state.network}
        baseURL ={baseURL}
        />
        </div>
      }

      {this.state.activeProjects && this.state.show==="usergallery" &&
      <div >
        <UserGallery
        project ={this.state.currentProject}
        account = {this.state.account}
        handleToggleView = {this.handleToggleView}
        connected = {this.state.connected}
        web3 = {this.state.web3}
        artBlocks = {this.state.artBlocks}
        network = {this.state.network}
        baseURL ={baseURL}
        tokensOfOwner = {this.state.tokensOfOwner}
        />
        </div>
      }

      {this.state.activeProjects && this.state.show==="learn" &&
      <div >
        <Learn
        project ={this.state.currentProject}
        account = {this.state.account}
        handleToggleView = {this.handleToggleView}
        connected = {this.state.connected}
        web3 = {this.state.web3}
        artBlocks = {this.state.artBlocks}
        network = {this.state.network}
        baseURL ={baseURL}
        tokensOfOwner = {this.state.tokensOfOwner}
        />
        </div>
      }

      </div>

    </div>





    );
  }
}

export default App;
