define(['cSeoEntendUtil'], function (ParserUtil) {
  LizardUrlMapping = function (env, url) {
    var objUrl = ParserUtil.urlParse(url);
    objUrl.pathname = objUrl.pathname.replace(/^\/html5\//i, '/webapp/');
    var ret = ParserUtil.urlFormat(objUrl);
    ret = ParserUtil.hostMapping(env, ret);
    return ret;
  }; 
});
