[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/Paypi/paypi-node">
    <img src="images/logo.png" alt="Logo" height="80">
  </a>

  <h3 align="center">PayPI Node Client</h3>

  <p align="center">
    Sell your API, today.
    <br />
    <a href="https://partner.paypi.dev/"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://paypi.dev/">Homepage</a>
    ·
    <a href="https://github.com/Paypi/paypi-node/issues">Report Bug</a>
    ·
    <a href="https://github.com/Paypi/paypi-node/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)
* [Acknowledgements](#acknowledgements)



<!-- ABOUT THE PROJECT -->
## About The Project

[![PayPI Screenshot][product-screenshot]](https://paypi.dev)

PayPI makes API creators' lives easier by handling API keys, user accounts, payments and more.
API users have one account to access all APIs using PayPI.

We worry about API authentication and payments so you can focus on making awesome APIs!  This library enables you to interact with PayPI from a NodeJS project.


<!-- GETTING STARTED -->
## Getting Started

> <a href="https://partner.paypi.dev/"><strong>See full documentation here</strong></a>

1. Install PayPI:

Install paypi from npm or yarn:
```sh
yarn add paypi
```
```sh
npm install paypi
```

Then import it, create an instance with your private key and use it to authenticate and make charges against users:
```node
import PayPI from 'paypi';
import express from 'express'

const app = express()
const port = 3000
const paypi = new PayPI("<YOUR API SECRET>")

app.get('/', async (req, res) => {
  const subscriberSecret = req.get("Authentication")
  const user = await paypi.authenticate(subscriberSecret)
  
  // Do some processing, fetch response data, etc
  
  // Once request is going to go through, charge the user using a ChargeID.
  await user.makeCharge("cid-R4tfSt4")
  await user.makeCharge("cid-U7dhaf3", 34) // Dynamic charges need to be given unitsUsed.
  
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
```


<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/Paypi/paypi-node/issues) for a list of proposed features (and known issues).



<!-- CONTRIBUTING -->
## Contributing

All contributions are welcome.  Please follow this workflow:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



<!-- LICENSE -->
## License

All rights reserved.



<!-- CONTACT -->
## Contact

Alex - alex@paypi.dev
Tom - tom@paypi.dev

Project Link: [https://github.com/Paypi/paypi-node](https://github.com/Paypi/paypi-node)



<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
* [Img Shields](https://shields.io)
* [Choose an Open Source License](https://choosealicense.com)


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/Paypi/paypi-node.svg?style=flat-square
[contributors-url]: https://github.com/Paypi/paypi-node/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Paypi/paypi-node.svg?style=flat-square
[forks-url]: https://github.com/Paypi/paypi-node/network/members
[stars-shield]: https://img.shields.io/github/stars/Paypi/paypi-node.svg?style=flat-square
[stars-url]: https://github.com/Paypi/paypi-node/stargazers
[issues-shield]: https://img.shields.io/github/issues/Paypi/paypi-node.svg?style=flat-square
[issues-url]: https://github.com/Paypi/paypi-node/issues
[license-shield]: https://img.shields.io/github/license/Paypi/paypi-node.svg?style=flat-square
[license-url]: https://github.com/Paypi/paypi-node/blob/master/LICENSE.txt
[product-screenshot]: images/product.png