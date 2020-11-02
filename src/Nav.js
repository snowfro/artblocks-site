//https://oneclickdapp.com/beast-powder/

import React, { Component } from 'react'
import {Navbar, Nav, NavDropdown, Image} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import './Nav.css'

class Navigation extends Component {
  async componentDidMount() {
    const artBlocks = this.props.artBlocks;
    const activeProjects = this.props.activeProjects;
    let activeProjectsDetails = [];
      for (let i=0;i<activeProjects.length;i++){
        let nameArtist = [];
        const projectDetails = await artBlocks.methods.projectDetails(i).call();
        nameArtist.push(i);
        nameArtist.push(projectDetails[0]);
        nameArtist.push(projectDetails[1]);
        activeProjectsDetails.push(nameArtist);
      }

      const allProjects = this.props.allProjects;
      let allProjectsDetails = [];
        for (let i=0;i<allProjects.length;i++){
          let nameArtist = [];
          const projectDetails = await artBlocks.methods.projectDetails(i).call();
          nameArtist.push(i);
          nameArtist.push(projectDetails[0]);
          nameArtist.push(projectDetails[1]);
          allProjectsDetails.push(nameArtist);
        }
      //console.log(activeProjectsDetails);

      this.setState({artBlocks, activeProjects, activeProjectsDetails, allProjectsDetails});
    }


  constructor(props) {
    super(props)
    this.state = {}
    //this.handleConnectToMetaMask = this.handleConnectToMetaMask.bind(this);
  }

  render() {
    //console.log("whitlisted?:" + this.props.isWhitelisted);
    //console.log(this.props.projectsOfArtist);
    //console.log(this.props.web3);
    //console.log(this.state.network);
    let baseURL = this.props.baseURL;
/*
    function tokenGenerator(token){
      return baseURL+'/generator/'+token;
    }
    */


    function tokenImage(token){
      //return 'https://api.artblocks.io/image/'+token;
      return baseURL+'/image/'+token;
    }

    //console.log("Theater?:"+this.state.theater)
    //console.log(this.state.web3 && this.state.network);
    //let etherscanAddy = `https://etherscan.io/address/${this.props.account}`;
    return (


      <div>

      <Navbar className="navBar" fixed="top" bg="light" expand="lg">

      <Navbar.Brand as={Link} to="/">Art Blocks [Rinkeby]</Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">

          <Nav.Link as={Link} to="/gallery">Gallery</Nav.Link>

            <NavDropdown title="Projects" id="basic-nav-dropdown">
              {this.state.activeProjectsDetails &&
                this.state.activeProjectsDetails.map((projectInfo,index)=>{
                  return(

                    <NavDropdown.Item key={index} as={Link} to={"/project/"+index}>{projectInfo[1]} by {projectInfo[2]}</NavDropdown.Item>

                  )
                })
              }
      </NavDropdown>

      {<Nav.Link as={Link} to={'/learn'}>Learn</Nav.Link>}

      </Nav>
      <Nav className="ml-auto">
      {this.props.isWhitelisted && <Nav.Link  href="#" onClick={()=>{this.props.handleToggleView("controlPanel",0)}}>Control Panel</Nav.Link>}
      {this.props.tokensOfOwner &&

              <Nav.Link  as={Link} to={"/user/"+this.props.account}>Your Items</Nav.Link>

        }
      </Nav>
      </Navbar.Collapse>

      {this.props.projectsOfArtist && this.props.projectsOfArtist.length>0 &&

        <NavDropdown title="Your Projects" id="basic-nav-dropdown" >
              {this.props.projectsOfArtist.map((project, index)=>{
                return(
                      <NavDropdown.Item   as={Link} to={"/project/"+project} className="text-center" key={index}>
                        {this.state.allProjectsDetails[project][1]}

                        </NavDropdown.Item>
                )
              })
            }


        </NavDropdown>
      }

      {this.props.connected===false &&
        <Nav.Link onClick={this.props.handleConnectToMetamask} href="#">Connect to Metamask</Nav.Link>
      }
      {this.props.account &&

        <NavDropdown title={this.props.account.slice(0,9)} id="basic-nav-dropdown" >

            {this.props.tokensOfOwner &&

              this.props.tokensOfOwner.map((token, index)=>{
                return(
                      <NavDropdown.Item   as={Link} to={"/token/"+token} className="text-center" key={index}>
                        <Image  className="d-block mx-auto img-fluid" alt="token" src={tokenImage(token)} fluid/>
                        </NavDropdown.Item>
                )
              })

            }

        </NavDropdown>
      }

      </Navbar>
      </div>

    );
  }
}

export default Navigation;
