/**
 * @File
 * @Description: (用一句话描述该文件做什么)
 * @author shbzhang
 * @date 2014-09-19 16:28:20
 * @version V1.0
 */
define(['cUtilPerformance', 'cHybridFacade'], function (cperformance, Facade) {
  var Geo = {};
  /**
   * @description 待地图上显示单个POI
   * @param {JSON}
   * options.latitude, 纬度2567.
   * options.longitude, 经度2568.
   * options.title, 在地图上显示的点的主标题2569.
   * options.subtitle, 在地图上显示点的附标题
   */
  Geo.showMapWithPOI = function (poi) {
    if (!options) {
      throw new Error('function show_map error is "param is null"');
    }
    options.name = Facade.METHOD_SHOW_MAP;
    Facade.request(poi);
  };

  /**
   * @description 在地图上显示多个POI位置点
   * @param {Array} poiList
   */
  Geo.showMapWithPOIList = function (poiList) {
    Facade.request({
      name: Facade.METHOD_APP_SHOW_MAP_WITH_POI_LIST,
      poiList: poiList
    });
  };

  /*
   * 获得城市信息
   * @param callback {Function} 成功时的回调
   * @param erro {Function} 失败时的回调
   * @param posCallback {Function} 获取经纬度成功的回调
   * @param posError {Function} 获取经纬度失败的回调
   * @param isAccurate {Boolean} 是否通过高精度查询 (如果使用高精度定位会发起两次请求，定位会需要更多时间，如只需定位城市，不需开启此开关，此开关在app中无效)
   */
  Geo.requestCityInfo = function (callback, error, posCallback, posError, isAccurate, cityCallBack, cityErrorCallBack) {
    var uuidGeoRequest = {
      number: cperformance.getUuid(),
      detail: cperformance.getUuid(),
      city: cperformance.getUuid(),
      error: cperformance.getUuid()
    };

    //+……2014-09-04……JIANGJing
    for (var i in uuidGeoRequest) {
      cperformance.group(uuidGeoRequest[i], {
        name: 'GeoRequest',
        url: 'Native function ' + i
      });     
    }
    var matchLocateInfo = function (info) {
      return (info.type == 'geo' || info.type == 'address' || info.type == 'CtripCity');
    };

    //+…2014-09-03……JIANGJing
    // 根据是否使用缓存数据的情形，Native 提供的 API 会回调一次（使用缓存）或两次（不使用缓存，第一次返回经纬度，第二次返回完整信息）。
    var firstCalled = true;

    //+…2014-09-03……JIANGJing
    var successCallback = function (info,error_code) {
      var ERR_INFOs = {
        1: '网络不通，当前无法定位',
        2: '定位没有开启'
      };
      // 定义当获取的定位信息不合规时的错误代码
      var DEFAULT_ERR_NUM = 1,
        errNum = 0;
      if (!matchLocateInfo(info)) {
        errNum = DEFAULT_ERR_NUM;
      } else if (info.locateStatus > 0) {
        errNum = window.Math.abs(info.locateStatus);
      }

      if (errNum) {
        //+……2014-09-12……JIANGJing……记录错误响应代码
        cperformance.groupTag(uuidGeoRequest.error, 'errno', '10' + errNum.toString());
        cperformance.groupEnd(uuidGeoRequest.error);
        if (typeof errorCallback == 'function') {
	        errorCallback(info, error_code);
        }
      } else {
        var v = info.value,
          detailed = (typeof v.addrs != 'undefined');
        if (detailed) {
          cperformance.groupEnd(uuidGeoRequest.detail);
        }

        if (firstCalled) {
          cperformance.groupEnd(uuidGeoRequest.number);
        }
        
        if ('CityEntities' in v) {
          cperformance.groupEnd(uuidGeoRequest.city);
          if (_.isFunction(cityCallBack)) {
            cityCallBack(v);
          }
        }

        if (firstCalled && typeof posCallback == 'function') {
          posCallback(v.lng, v.lat);
        }

        if (detailed && typeof callback == 'function') {
          callback({
            lng: v.lng,
            lat: v.lat,
            city: v.city || v.ctyName || v.province,
            province: v.province,
            district: v.district,
            //+2……2014-09-04……JIANGJing
            country: v.country,
            countryShortName: v.countryShortName,
            address: v.addrs
          });
        }
      }
      firstCalled = false;
    };

    var errorCallback = function (err, error_code) {
      //+……2014-09-12……JIANGJing……记录错误响应代码
      cperformance.groupTag(uuidGeoRequest.error, 'errno', '10');
      cperformance.groupEnd(uuidGeoRequest.error);
	    var errCode = (err && err.error_code) || error_code;
      if (errCode)
      {
        if (errCode.indexOf('201') > -1)
          posError(errCode);
        else if (errCode.indexOf('202') > -1)
          posError(errCode);
        else if (errCode.indexOf('203') > -1)
          posError(errCode);
        else if (errCode.indexOf('204') > -1)
          error(errCode);
        else if (errCode.indexOf('205') > -1)
          cityErrorCallBack && cityErrorCallBack(errCode);
      } else {
	      console.log("(-201)定位未开启");
	      posError("(-201)定位未开启");
      }
    };

    Facade.request({
      name: Facade.METHOD_LOCATE,
      success: successCallback,
      error: errorCallback
    });
  };


  return Geo;

});