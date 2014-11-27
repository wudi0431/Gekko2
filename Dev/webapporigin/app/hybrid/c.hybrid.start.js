(function () {
  var mutileLoad = Lizard.mutileLoad;
  delete Lizard.mutileLoad;
  window.appInstance = false;
  window.localStorage.setItem('ISINAPP', '1');
  window.app = {};

  window.app.callback = function (options) {
    var methods = {
      'web_view_finished_load': function () {
        if (window.localStorage) {
          var appInfo = options.param;
          if (appInfo)
            window.localStorage.setItem('APPINFO', JSON.stringify(appInfo));
        }
        CtripBar.app_set_navbar_hidden(true);
        CtripUtil.app_init_member_H5_info();
      },

      'init_member_H5_info': function (params) {
        define("_", function () {
        });
        define("$", function () {
        });
        define("B", function () {
        });
        define("F", function () {
        });
        require(['libs', 'cCommonStore'],
          function (libs, CommonStore) {
            window.appInstance = true;
            var wStore = window.localStorage;
            if (wStore && params) {
              var headStore = CommonStore.HeadStore.getInstance();
              var userStore = CommonStore.UserStore.getInstance();
              var unionStore = CommonStore.UnionStore.getInstance();
              var headInfo = headStore.get();

              //用户信息
              if (params.userInfo) {
                try {
                  var userInfo = userStore.getUser();
                  params.userInfo.data.BMobile = params.userInfo.data.BindMobile;
                  userStore.setUser(params.userInfo.data);
                  headInfo.auth = params.userInfo.data.Auth;
                } catch (e) {
                  alert('set data error');
                }
              } else {
                userStore.removeUser();
              }

              if (params.device) {
                var deviceInfo = {
                  device: params.device
                }
                wStore.setItem('DEVICEINFO', JSON.stringify(deviceInfo));
              }

              if (params.appId) {
                var appInfo = {
                  version: params.version,
                  appId: params.appId,
                  serverVersion: params.serverVersion,
                  platform: params.platform
                }
                wStore.setItem('APPINFO', JSON.stringify(appInfo));
              }

              if (params.timestamp) {
                var date = new Date();
                var serverdate = {
                  server: params.timestamp,
                  local: date.getTime()
                }
                wStore.setItem('SERVERDATE', JSON.stringify(serverdate));
              }

              if (params.sourceId) {
                headInfo.sid = params.sourceId;
                wStore.setItem('SOURCEID', params.sourceId);
              }

              if (params.isPreProduction) {
                wStore.setItem('isPreProduction', params.isPreProduction);
              }

              //接受clientId,供UBT使用
              if (params.clientID) {
                headInfo.cid = params.clientID;
                wStore.setItem('GUID', params.clientID);
              }
              //外部渠道号
              if (params.extSouceID) {
                headInfo.xsid = params.extSouceID;
              }
              //soa2.0 syscode 可以接受非09的值, restful 待定
              if (params.platform) {
                headInfo.syscode = params.platform == '1' ? 12 : 32;
              }
              if (params.version) {
                headInfo.cver = params.version;
              }

              //分销联盟参数
              //ctrip://wireless/allianceID=123&ouID=456&sID=789&extendSourceID=11111
              if (params.allianceID && params.sID) {
                var union = {
                  "AllianceID": params.allianceID,
                  "SID": params.sID,
                  "OUID": params.ouID ? params.ouID : ""
                }
                unionStore.set(union);
              }

              headStore.set(headInfo);

              //保存原始参数值
              wStore.setItem('CINFO',JSON.stringify(params));
            }

            if (Lizard.isInCtripApp)
              mutileLoad();
          });
      },

      'app_h5_need_refresh': function () {
        mutileLoad();
      }
    }
    if (options && typeof methods[options.tagname] === 'function') {
      methods[options.tagname](options.param);
    }
  };
  if (!Lizard.isInCtripApp)
    mutileLoad();
})();
