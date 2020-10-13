//https://oneclickdapp.com/beast-powder/

import React, { Component } from 'react'
import {Navbar, Nav, NavDropdown} from 'react-bootstrap';

class Navigation extends Component {
  async componentDidMount() {
    const web3 = this.props.web3;
    const artBlocks = this.props.artBlocks;
    const activeProjects = this.props.activeProjects;
    let projects = [];
      for (let i=0;i<activeProjects.length;i++){
        let nameArtist = [];
        const projectDetails = await artBlocks.methods.details_ProjectDescription(i).call();
        nameArtist.push(i);
        nameArtist.push(projectDetails[0]);
        nameArtist.push(projectDetails[1]);
        projects.push(nameArtist);
        //console.log(nameArtist);
      }
      console.log(projects);

      this.setState({artBlocks, web3, activeProjects, projects});
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



  constructor(props) {
    super(props)
    this.state = { account: '', connected:false, currentProject:0, theater:false, currenttoken:0}
    //this.handleConnectToMetaMask = this.handleConnectToMetaMask.bind(this);
  }

  render() {
    /*
    function tokenImage(token){
      //return 'https://api.artblocks.io/image/'+token;
      return 'http://localhost:8080/image/'+token;
    }
    */

    let baseURL = this.props.baseURL;

    function tokenGenerator(token){
      return baseURL+'/generator/'+token;
    }
    //console.log("Theater?:"+this.state.theater)
    console.log(this.state.network && this.state.network);
    //let etherscanAddy = `https://etherscan.io/address/${this.props.account}`;
    return (


      <div>
      <Navbar fixed="top" bg="light">
      <Navbar.Brand href="#" onClick={()=>{this.props.handleToggleView("highlight")}}>Art Blocks [Rinkeby]</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#" onClick={()=>{this.props.handleToggleView("gallery",0)}}>Project Gallery</Nav.Link>
            <NavDropdown title="Projects" id="basic-nav-dropdown">
              {this.state.projects &&
                this.state.projects.map((projectInfo,index)=>{
                  return(
                    <NavDropdown.Item key={index} onClick={()=>{this.props.handleToggleView("project",index)}}>{projectInfo[1]} by {projectInfo[2]}</NavDropdown.Item>
                  )
                })
              }
      </NavDropdown>
      {/*<Nav.Link href="#" onClick={()=>{this.props.handleToggleView("gallery",0)}}>Info</Nav.Link>*/}
      </Nav>
      </Navbar.Collapse>
      {this.props.connected===false && this.props.network!=="none" &&
        <Nav.Link onClick={this.props.handleConnectToMetamask} href="#">Connect to Metamask</Nav.Link>
      }
      {this.props.account &&
        <NavDropdown title={this.props.account.slice(0,9)} id="basic-nav-dropdown">
          <NavDropdown.Item>{this.props.tokensOfOwner.length===0?"No Tokens":"Your Tokens"}</NavDropdown.Item>
            {this.props.tokensOfOwner &&
              this.props.tokensOfOwner.map((token, index)=>{
                return(
                  <NavDropdown.Item key={index} href={tokenGenerator(token)} target="_blank">{token}</NavDropdown.Item>
                )
              })}
        </NavDropdown>
      }
      {this.props.connected===false && this.props.network==="none" &&

      <Navbar.Brand>Powered by Ethereum. Get <a href="https://metamask.io">MetaMask</a> .</Navbar.Brand>

    }
      </Navbar>
      </div>

    );
  }
}

export default Navigation;
