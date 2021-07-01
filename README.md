# paypi-js

PayPI makes API creators' lives easier by handling API keys, user accounts, payments and more.
API users have one account to access all APIs using PayPI.

We worry about API authentication and payments so you can focus on making awesome APIs!

[More info @ paypi.dev](paypi.dev)
# Setup
Install paypi from npm or yarn:
```node
  yarn add paypi
```
```node
  npm install paypi
```


# Example Usage
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
