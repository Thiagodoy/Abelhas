export const environment = {
  production: true,

  environment: { url: 'https://abelhas.herokuapp.com/parse', appid: 'myAppId', masterKey: 'myMasterKey' },

  getEnvironment() {
    return this.environment;
  }
};


//parse-dashboard --dev --appId "myAppId" --masterKey "myMasterKey" --serverURL "https://abelhas.herokuapp.com/parse" 