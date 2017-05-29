export const environment = {
  production: true,

  environment: { url: 'https://abelhas.herokuapp.com/parse', appid: 'myAppId', masterKey: 'myMasterKey' },

  getEnvironment() {
    return this.environment;
  }
};
