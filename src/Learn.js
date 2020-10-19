import React, { Component} from 'react'
import {Image, Container, Figure} from 'react-bootstrap';

class Learn extends Component {

  render(){

    return(
      <div>
      <h1 className="text-center"><b>Creativity in Generative Design</b></h1>
      <h3 className="text-center">Hosted immutably on the Ethereum Blockchain</h3>

      <hr />
      <Container>
      <div className="text-center">
      <Image src="https://api.artblocks.io/image/7000009" width="300px"/>
      <Image src="https://api.artblocks.io/image/7000010" width="300px"/>
      <Image src="https://api.artblocks.io/image/7000011" width="300px"/>
      </div>
      <h5>ELI5</h5>
      <h6>Art Blocks enables you to purchase unique generative content, such as works of art, on demand. You pick a style that you like, pay for the work, and a randomly generated version of the content will be created automatically and sent to you.</h6>
      <br/>
      <h5>In Depth</h5>
      <p>The Art Blocks platform hosts generarative projects for the production of verifiably deterministic outputs. A generative script (using <a rel="noopener noreferrer" href="https://p5js.org" target="_blank">p5js</a> for example)
      is stored immutably on the Ethereum blockchain for each project. When a user wants to purchase an iteration of a project hosted on the platform, they purchase an ERC721 compliant "non-fungible" token, also stored on the Ethereum blockchain,
      containing a provably unique "seed" which controls variables in the generative script. These variables, in turn, control the way the output looks and operates.</p>
      <br />
      <p>As an example consider the Chromie Squiggle project:</p>
      <div className="text-center">
      <Figure>
        <Figure.Image
          width={300}
          alt="Squiggle #6"
          src="https://api.artblocks.io/image/2000006"
        />
        <Figure.Caption>
          Chromie Squiggle #6 with. Token "seed" is 0x405a4924eb833a0ffddc09383b0718b8408ff6c4d28e34c1f2c665b092fb208c
        </Figure.Caption>
      </Figure>
      </div>
      <p>Each "seed", also known as a "hash string" is a hexadecimal string generated in a pseudo-random manner at the time the token is minted. Each character (0-9, a-f) represents a value from 0-15
      and each pair of characters ("aa", or "f2") represents a value from 0-255.</p>
      <p>For example, the y-coordinate of each point in a squiggle is dictated by the value of a hex pair in the seed. Hex pairs in the seed also control the starting color, rate of change of the gradient,
      amount of points in each squiggle, plus some surprise features that make some squiggles more rare than others.</p>
      <p>Every time a squiggle is drawn using a specific "seed" the result will be identical. This means the project is "deterministic". Art Blocks projects are required to have a deterministic initial state and
      therefore your token, which represents a specific output of the algorithm stored for that particular project, is guaranteed to be unique.</p>
      <br />
      <p>When a project is deployed on the Art Blocks platform, the artist has the ability to tweak and modify the script and settings until he or she is comfortable and ready to "lock" the project. Once a project is
      locked, attributes like max iterations (the maximum number of iterations that will be allowed to be minted), scripts, project name, artist name, and number of hashes generated will be permanently frozen. The artist will be unable to
      alter the state of the project and therefore you are guaranteed to get the same resulting output from your token's stored "seed".</p>
      <p>After a project is locked, an artist can still modify the description and price per iteration in case they want to adjust the price of a work to accomodate variance in the price of Ethereum.</p>
      <br />
      <h5>API</h5>
      <p>Art Blocks provides an API to retreive information about the platform, each project, as well as each individual token.</p>
      <ul>
        <li><a href="https://api.artblocks.io/platform" rel="noopener noreferrer" target="_blank">https://api.artblocks.io/platform</a> provides overall metrics on the platform.</li>
        <li><a href="https://api.artblocks.io/project/0" rel="noopener noreferrer" target="_blank">https://api.artblocks.io/[projectId]</a> provides details about a specific project including cost per token, number of iterations, and the stored scripts and script type.</li>
        <li><a href="https://api.artblocks.io/token/0" rel="noopener noreferrer" target="_blank">https://api.artblocks.io/[tokenId]</a> serves an ERC721 compliant TokenURI which provides metadata about the project the token belongs to as well as a link to the token image.</li>
        <li><a href="https://api.artblocks.io/image/0" rel="noopener noreferrer" target="_blank">https://api.artblocks.io/image/[tokenId]</a> returns a static image to represent the token. This is stored on the server but can be forced to re-render by appending '/refresh' to the URL.</li>
        <li><a href="https://api.artblocks.io/generator/0" rel="noopener noreferrer" target="_blank">https://api.artblocks.io/generator[tokenId]</a> serves the live script for the token. This represents a live output of the project's script and the token seed combined and run in the user's browser.
            This is the most valuable part of the platform as by running the script live you can interact with the script (if the project is interactive). If the project is built with <a href="https://aframe.io" rel="noopener noreferrer" target="_blank">A-Frame</a> you can visit this URL
            from a browser running on a VR headset and interact with the script in 3D. Or the project might be a game where you interact with seed-generated enemies or obstacles.</li>
      </ul>
      <br/>
      <h5>License</h5>
      <p>The creator of each project will select a license type that is granted to the purchaser of a token for that project. These licenses can range from "unrestricted" allowing full commercial use of the generative content to more restrictive license type that might only allow a token holder to print the
      work for personal use. The license is fully at the discretion of the project creator.</p>
      <br/>
      <h5>Platform Fees and Additional Payees</h5>
      <p>The Art Blocks platform charges a fee for projects listed on the platform of 10%. At the time a token is purchased, 10% of the purchase price is transferred to the Art Blocks address with the balance immediately transferred to the project creator.</p>
      <p>Project creators can optionally designate an additional payee for each project. The creator will indicate the receiving address and % of the purchase price that will be sent to this additional payee instanly at the time of purchase. This feature will
      enable established platforms to monetize representation of a creator on their platform or create an automatic method for a collaboration of creators to split the proceeds of a sale.</p>
      <br />
      <h5>Curation</h5>
      <p>While the processes for generating and viewing unique generative content on the Art Blocks platform are decentralized, the organiztion and operation of the Art Blocks platofrm itself is not decentralized. Artists/creators are selected to deploy projects at the sole discretion of the Art Blocks
      team. We reserve the right to curate the content on the platform without explanation. That said, no content which could be considered even remotely offensive to anyone will be considered.</p>
      <p>The onboarding process for a new project is extensive. Each project will be required to deploy on testnet and be tested thoroughly before migrating and deploying on mainnet. All new projects will be deployed by the Art Blocks team with subsequent modifications managed by the creator. Once the project is ready
      to go live the Art Blocks team will lock it and set it to "active" to enable purchases. </p>
      <br />
      <h5>More Info</h5>
      <p>For more information please reach out to us at info at artblocks dot io or join the conversation in <a href="https://discord.gg/pA4hbkb" rel="noopener noreferrer" target="_blank">Discord</a>.</p>





      </Container>
      </div>
    )

  }
}

export default Learn;
