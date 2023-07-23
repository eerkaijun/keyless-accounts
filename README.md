## keyless-accounts

User onboarding for dApps is a pain. Users need to install a browser extension, create an account, and fund it with ETH. This is a huge barrier to entry for new users. Keyless Accounts is a solution to this problem. It allows users to create an account using social logins. Under the hood, we use Lit protocol threshold network to store shards on the private key on behalf of the users. Each time the user would like to make a transaction, they simply need to authenticate using social logins and the Lit nodes will sign the transactions on behalf of the users. 

The Lit protocol PKP is used to create a smart contract account, and we have a paymaster contract that subsidize the gas fees for the users, as long as the users are authenticated through social logins. The owner of the smart contract account is initially the PKP, but users can transfer ownership to their own address at any time. To make a transaction from the smart contract account, the Lit nodes will sign the UserOp (of ERC4337) and submit to the account abstraction mempool, which can then be verified.

### Getting Started

To compile Solidity contracts and run the test, execute the following:
1. `forge install`
2. `forge test`

To run the web app, where users are able to generate an in-browser account using social logins, execute the following:
1. `cd web`
2. `npm install`
3. `npm start`

### Architecture

![Architecture](./img/keyless-accounts.png)

### Deployed Contracts

We deploy the contracts on Mantle and Celo testnet

Mantle:
1. MockContract: `0xb396232592CF383c62e8A5895B892d482500f3F0`
2. AccountFactory: `0x5Bc073B57038086BF294DC9594D9857247506D7C`
3. Paymaster: `0x9FA4cfAB777274aedBD7a5C39b733c3E4534844F`

Celo:
1. MockContract: `0x89DfBDa1cdeBd97c1930da34fcC0fcc2F5B4e075`
2. AccountFactory: `0xfe5CD4EB9748C62B6B3edd36FA6c033c95D2f685`
3. Paymaster: `0x04D06f2b651B6732154b6b7d508d15f45dceea9F`