define([Lizard.isHybrid?'cHybridApp':'cWebApp', 'cBusinessCommon'], function(lizard, readyFunc){
  var oHtml = $.fn.html;
  $.fn.html = function(html){
    if(html === undefined ){
      return (this.length > 0 ? this[0].innerHTML : null);
    } else {
      return  oHtml.call(this,html)
    }
  };
  
  function createLizardins()
  {
    if (Lizard.pdConfig)
    {
      require(Lizard.pdConfig, function(){
        _createLizardIns();                     
      }); 
    }
    else
    {
      _createLizardIns();    
    }
  }
  
  function _createLizardIns()
  {
    Lizard.instance = new lizard({});
    for (var n in Lizard.instance.interface()) {
      Lizard[n] = $.proxy(Lizard.instance.interface()[n], Lizard.instance);
    }
    readyFunc();
  }
  
  return createLizardins; 
})