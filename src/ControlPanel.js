import React, { Component} from 'react'
import {Button,Form} from 'react-bootstrap';


class ControlPanel extends Component {
  constructor(props) {
    super(props)
    this.state = {account:'', tokenURIInfo:'', ineraction:false, formValue:'', idValue:'', newProject:{name:'',artist:'',price:'',license:'',scriptType:'',dynamic:false}};



    this.handleChange = this.handleChange.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleIdChange = this.handleIdChange.bind(this);

  }

  async componentDidMount() {

    //const web3 = this.props.web3;
    const artBlocks = this.props.artBlocks;
    const network = this.props.network;

    this.setState({artBlocks, network});
  }







  handleValueChange(event) {
    this.setState({ formValue:event.target.value });
  }

  handleNewProjectValueChange(e, type){
    if (type==="projectName"){
      let newProject = this.state.newProject;
      newProject.name = e.target.value;
      this.setState({newProject})
    } else if (type==="artistName"){
      let newProject = this.state.newProject;
      newProject.artist = e.target.value;
      this.setState({newProject});
    } else if (type==="price"){
      let newProject = this.state.newProject;
      newProject.price = this.props.web3.utils.toWei(e.target.value,'ether');
      this.setState({newProject});
    } else if (type==="license"){
      let newProject = this.state.newProject;
      newProject.license = e.target.value;
      this.setState({newProject});
    } else if (type==="scriptType"){
      let newProject = this.state.newProject;
      newProject.scriptType = e.target.value;
      this.setState({newProject});
    } else if (type==="dynamic"){
      let newProject = this.state.newProject;
      newProject.dynamic = e.target.value;
      this.setState({newProject});
    }
  }

  handleIdChange(event) {
    this.setState({ idValue:event.target.value });
  }

  async handleChange(e,type){
    e.preventDefault();
    this.setState({interaction:true});

    if (type === "newProject"){
    await this.state.artBlocks.methods.addProject(this.state.newProject.name, this.state.newProject.artist,this.state.newProject.price, this.state.newProject.license, this.state.newProject.scriptType, this.state.newProject.dynamic).send({
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
    //newProject:{name:'',artist:'',price:'',license:'',scriptType:'',dynamic:false}
  }






  }






  render() {
    console.log(this.state.newProject);


    //console.log(queue);
    return (



<div>
<button type="button" onClick={() => this.props.handleToggleView("off")} className="close" aria-label="Close">
<span aria-hidden="true">&times;</span>
</button>

        <h3>Control Panel</h3>



            <div>
            <h3>Add new project</h3>
            <br/>
              <Form onSubmit={e => this.handleChange(e, "newProject")}>
                <Form.Group>
                  <Form.Label><b>Project Name</b></Form.Label>
                  <Form.Control onChange={e=>this.handleNewProjectValueChange(e,"projectName")} type="text" placeholder="Enter Project Name" />
                  <Form.Label><b>Artist Name</b></Form.Label>
                  <Form.Control onChange={e=>this.handleNewProjectValueChange(e,"artistName")} type="text" placeholder="Enter Artist Name" />
                  <Form.Label><b>Price in ETH</b></Form.Label>
                  <Form.Control onChange={e=>this.handleNewProjectValueChange(e,"price")} type="number" step="any" placeholder="Enter Price in ETH" />
                  <Form.Label><b>License</b></Form.Label>
                  <Form.Control onChange={e=>this.handleNewProjectValueChange(e,"license")} type="text" placeholder="Enter Project License" />
                  <Form.Label><b>Script Type</b></Form.Label>
                  <Form.Control onChange={e=>this.handleNewProjectValueChange(e,"scriptType")} as="select" >
                  <option>--- Select Script Type ---</option>
                    <option>p5js</option>
                    <option>processing</option>
                    <option>a-frame</option>
                    <option>threejs</option>
                    <option>vox</option>
                    <option>megavox</option>
                    <option>custom</option>
                  </Form.Control>
                  <Form.Label><b>Dynamic?</b></Form.Label>
                  <br/>
                  <Form.Check name="radioGroup" inline label="True" type="radio"  value={true} onChange={e=>this.handleNewProjectValueChange(e,"dynamic")}/>
                  <Form.Check name="radioGroup" inline label="False" type="radio" value={false} onChange={e=>this.handleNewProjectValueChange(e,"dynamic")}/>
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
              <br/>
            </div>

      </div>






    );
  }
}

export default ControlPanel;
