define(['cBaseInit', 'cWebMember'], function(initFunc, Member){
  Member.autoLogin({
    callback: function(){
      require(['cStatic'], function(){
        initFunc();
      });     
    }
  });
})