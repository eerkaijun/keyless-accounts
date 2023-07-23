import { LitAuthClient } from "@lit-protocol/lit-auth-client"; 
import { LitAccessControlConditionResource } from "@lit-protocol/auth-helpers";
import * as LitJsSdk from '@lit-protocol/lit-node-client-nodejs';
import { ethers } from 'ethers';
import { abi as accountFactoryAbi } from '../abis/AccountFactory';
import { abi as mockContractAbi } from '../abis/MockContract';

// Set up LitAuthClient
const litAuthClient = new LitAuthClient({
    litRelayConfig: {
        // Request a Lit Relay Server API key here: https://forms.gle/RNZYtGYTY9BcD9MEA
        relayApiKey: 'dee5da49d0725d402071439ab9544c0a',
    },
});

// Initialize Google provider
litAuthClient.initProvider('google', {
    // The URL of your web app where users will be redirected after authentication
    redirectUri: 'http://localhost:3000',
});

const socialLogin = async () => {
    console.log("Starting social login process!");

    const provider = litAuthClient.getProvider(
        'google'
    );

    // set local storage in order to handle redirect
    localStorage.setItem('redirectToApp', 'true');
    await provider.signIn();

    // const authData = await provider.authenticate(authData);
    // console.log("result: ", result);
}

const litActionCode = `
const go = async () => {  
  // this requests a signature share from the Lit Node
  // the signature share will be automatically returned in the HTTP response from the node
  // all the params (toSign, publicKey, sigName) are passed in from the LitJsSdk.executeJs() function
  const sigShare = await Lit.Actions.signEcdsa({ toSign, publicKey , sigName });
};

go();
`;

const runLitAction = async (publicKey, sessionSigs) => {
  const litNodeClient = new LitJsSdk.LitNodeClientNodeJs({ litNetwork: "serrano" });
  await litNodeClient.connect();
  const signatures = await litNodeClient.executeJs({
    code: litActionCode,
    sessionSigs,
    // all jsParams can be used anywhere in your litActionCode
    jsParams: {
      // this is the string "Hello World" for testing
      toSign: [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100],
      publicKey:
        publicKey,
      sigName: "sig1",
    },
  });
  return signatures;
};

const handleRedirect = async () => {
    localStorage.removeItem('redirectToApp'); // Remove the key after handling the redirect

    // Get the provider that was used to sign in
    const provider = litAuthClient.getProvider(
        'google',
    );
      
    // Get auth method object that has the OAuth token from redirect callback
    const authMethod = await provider.authenticate();
    console.log("authMethod: ", authMethod)

    let pkps = await provider.fetchPKPsThroughRelayer(authMethod);
    if (pkps.length === 0) {
        await provider.mintPKPThroughRelayer(authMethod);
        pkps = await provider.fetchPKPsThroughRelayer(authMethod);
    }
    const pkp = pkps[0]; // always use the defauly PKP

    console.log("pkp: ", pkp);

    // LitAbility.LitAbility.pkp signing
    // Create the Lit Resource using wildcard for all resources
    const litResource = new LitAccessControlConditionResource('*');    
    const sessionSigs = await provider.getSessionSigs({
        authMethod: authMethod,
        sessionSigsParams: {
          chain: 'ethereum',
          resourceAbilityRequests: [
            {
                resource: litResource,
                ability:'pkp-signing' // LitAbility.PKPSigning
            }
          ],
        },
    });
    console.log("sessionSigs: ", sessionSigs);

    const signatures = await runLitAction(pkp.publicKey, sessionSigs);
    console.log("signatures: ", signatures);

    const providerOnMantle = new ethers.providers.JsonRpcProvider("https://rpc.testnet.mantle.xyz");
    const accountFactoryAddress = "0x5Bc073B57038086BF294DC9594D9857247506D7C";
    const accountFactory = new ethers.Contract(accountFactoryAddress, accountFactoryAbi, providerOnMantle);
    const mockContractAddress = "0xb396232592CF383c62e8A5895B892d482500f3F0";
    const mockContract = new ethers.Contract(mockContractAddress, mockContractAbi, providerOnMantle);

    // this would usually be at a server
    const wallet = new ethers.Wallet("", providerOnMantle); // provide private key
    await accountFactory.connect(wallet).createAccount(pkp.ethAddress, 0);
    const accountAddress = await accountFactory.getAddress(pkp.ethAddress, 0);

    console.log("accountAddress: ", accountAddress);

    const randomTokenId = Math.floor(Math.random() * (999 - 0 + 1));
    await mockContract.connect(wallet).mint(accountAddress, randomTokenId);

    const balance = await mockContract.balanceOf(accountAddress);
    console.log("balance: ", balance.toString());

    return balance.toString();
};

export { socialLogin, handleRedirect }; 