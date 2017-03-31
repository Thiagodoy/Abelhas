// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: true,

  environments: [
    {url:'https://parsedevabelhas.herokuapp.com/parse',appid:'myAppId',masterKey:'myMasterKey'},
    {url:'http://localhost:1337/parse', appid:'myAppDebug'}],

    getEnvironment(){
      return this.production ? this.environments[0] : this.environments[1] 
    }

};
