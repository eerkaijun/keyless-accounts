import { LitAuthClient } from "@lit-protocol/lit-auth-client"; 

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

const handleRedirect = async () => {
    localStorage.removeItem('redirectToApp'); // Remove the key after handling the redirect

    // Get the provider that was used to sign in
    const provider = litAuthClient.getProvider(
        'google',
    );
      
    // Get auth method object that has the OAuth token from redirect callback
    const authMethod = await provider.authenticate();
    console.log("authMethod: ", authMethod);

};

export { socialLogin, handleRedirect }; 