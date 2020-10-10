//https://oneclickdapp.com/beast-powder/

import React, { Component } from 'react'
import { ARTBLOCKS_CONTRACT_ABI, ARTBLOCKS_CONTRACT_ADDRESS } from './config'
import Web3 from 'web3'
import Project from './Project';
import NewToken from './NewToken';
import ProjectThumb from './ProjectThumb';
import {Col} from 'react-bootstrap';
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
      this.setState({artBlocks, web3, activeProjects, totalInvocations, network});
    }
    } else {
      const web3 = new Web3(new Web3.providers.HttpProvider(`https://rinkeby.infura.io/v3/${API_KEY}`));
      const artBlocks = new web3.eth.Contract(ARTBLOCKS_CONTRACT_ABI, ARTBLOCKS_CONTRACT_ADDRESS);
      const activeProjects = await artBlocks.methods.platform_ShowAllProjectIds().call();
      const totalInvocations = await artBlocks.methods.totalSupply().call();
      this.setState({artBlocks, web3, activeProjects, totalInvocations, network:"none"});
    }
  }

  async loadAccountData() {
    const accounts = await this.state.web3.eth.getAccounts();
    const tokensOfOwner = await this.state.artBlocks.methods.tokensOfOwner(accounts[0]).call();
    this.setState({ account: accounts[0], tokensOfOwner });
  }

  handleConnectToMetaMask(){
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

  handleToggleView(input){
    console.log(input);
    if (input==="overview"){
      this.setState({overview:true})
    } else {
      this.setState({overview:false, currentProject:input})
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
    this.state = { account: '', connected:false, overview:true, currentProject:0, theater:false, currenttoken:0}
    this.handleConnectToMetaMask = this.handleConnectToMetaMask.bind(this);
    this.handleToggleView = this.handleToggleView.bind(this);
    this.handleToggleTheaterView = this.handleToggleTheaterView.bind(this);
  }

  render() {
    //console.log("Theater?:"+this.state.theater)
    console.log(this.state.network && this.state.network);
    return (


      <div className="container-fluid mt-3">
      <div>
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
      </div>

      <div>
      {!this.state.theater &&


      <div className="row">
      {this.state.overview &&


      <Col sm={3}>
      <div className="sticky-top">
      <div className="text-align-center">
      <br/>
      <br/>
      <br/>

      <h1 className="text-center">Art Blocks [Rinkeby]</h1>
      </div>
      {this.state.connected===false && this.state.network!=="none" &&
      <button className="btn btn-primary btn-xsmall btn-block" onClick={this.handleConnectToMetaMask}> Connect to Metamask </button>
    }
    {this.state.connected===false && this.state.network==="none" &&
    <div>
    <p>This is a project powered by Ethereum. Please install <a href="https://metamask.io">MetaMask</a> for the full experience.</p>
    </div>
  }
    {this.state.connected===true &&
      <div>
    <p className="text-center"><small>Acct: {this.state.account}</small></p>

    </div>
  }
      <hr/>
      <br />
      <h6>There are a total of <b>{this.state.activeProjects && this.state.activeProjects.length}</b> projects currently listed on the platform.</h6>

      <br/>
      <h6><b>{this.state.totalInvocations && this.state.totalInvocations}</b> unique generative iterations have been minted to date.</h6>

      <br/>
      <h6>Each image on the right represents a snapshot of a previously purchased generative work of art. Click <b>next/previous</b> to see more examples or click <b>open</b> to access the live script directly. </h6>
      <br/>
      <h6>Generative outputs result from a script stored on the Art Blocks platform seeded by a unique injected hash that is stored on each purchased token. Artworks are determinsitic and the results are immutable.</h6>
      <br/>
      <h6>When you purchase an Art Blocks work of art you are minting a never before seen iteration resulting from an artist's generative script.</h6>
      <br/>
      {this.state.connected===true &&
        <div>
      <h6>You own the following tokens:</h6>
      <p><b> <small>{this.state.tokensOfOwner && this.state.tokensOfOwner.join(', ')}</small></b></p>
      </div>
    }
      </div>

</Col>
}

      <div className="col">


        {this.state.activeProjects && this.state.overview &&
          this.state.activeProjects.map((project,index)=>{
          return(
            <div key={index}>
          <ProjectThumb
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

      {this.state.activeProjects && !this.state.overview &&

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
      </div>
    }
    </div>
      </div>



    );
  }
}

export default App;
