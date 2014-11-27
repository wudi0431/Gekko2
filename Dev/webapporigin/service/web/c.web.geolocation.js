/**
 * @File c.web.geolocation
 * @Description: web环境下定位
 * @author ouxz@ctrip.com/shbzhang@ctrip.com
 * @date 2014-09-19 17:46:07
 * @version V1.0
 */
define(['cGeoHelper', 'cUtilPerformance', 'cModel', 'cCoreInherit'], function (cGeoHelper, cperformance, cModel, cCoreInherit) {
    var Geo = {}, KEY = '0b895f63ca21c9e82eb158f46fe7f502';
        //add by byl 记录当前设备所处位置，默认是在国内
        Geo.isInOverseas = false;
    
    var cityModel = cCoreInherit.Class(cModel, {
      __propertys__: function() {
        this.url = 'http://m.ctrip.com/restapi/soa2/10398/json/LBSLocateCity';
      }
    }).getInstance();
    
    /**
     * @description 待地图上显示单个POI
     * @param {JSON}
     * options.latitude, 纬度2567.
     * options.longitude, 经度2568.
     * options.title, 在地图上显示的点的主标题2569.
     * options.subtitle, 在地图上显示点的附标题
     * options.zoomCallBack  地图比例变化时的回调
     */
    Geo.showMapWithPOI = function (options) {
        //自定义Google view
        function NameOverlay(point, name, map, div) {

            // 初始化参数：坐标、文字、地图
            this.point_ = point;
            this.name_ = name;
            this.map_ = map;

            // 到onAdd时才需要创建div
            this.div_ = div;
            // 加入map
            this.setMap && this.setMap(map);
        }
        //此处WebMap 和 WebMapOverseas 需要合并，都包含了多个marker节点以及marker节点的点击回调事件
        var WebMap = function (config) {
            if (!config || !config.lat || !config.lng || !config.id) {
                config.error && config.error();
                return false;
            }
            var marekrViews = {
                    marekrs : [],
                    overlays : []
                },
                markers,
                isOverseasAndGoogle = false,
                google = window.google;
            var isDomestic = cGeoHelper.getCountry(config.lng, config.lat);
            // @description 在web环境中，如果缺少AMap对象和定位点信息，直接返回false，标记错误，无法加载地图,唉谷歌地图api加载不完全的情况，需要处理
            if ((isDomestic != 1 || Geo.isInOverseas) && google && google.maps && google.maps.LatLng) {
                isOverseasAndGoogle = true;
                if (google.maps.OverlayView) {
                    //在此处自定义一个Google View 用于展示和高德地图一样的view
                    NameOverlay.prototype = new google.maps.OverlayView();
                    // NameOverlay定义
                    NameOverlay.prototype.onAdd = function () {
                        var panes = this.getPanes();
                        panes.overlayImage.appendChild(this.div_);
                    }

                    NameOverlay.prototype.draw = function () {
                        // 利用projection获得当前视图的坐标
                        var overlayProjection = this.getProjection();
                        var center = overlayProjection.fromLatLngToDivPixel(this.point_);
                        // 为简单，长宽是固定的，实际应该根据文字改变
                        var div = this.div_;
                        if (div) {
                            div.style.left = center.x + 20 + 'px';
                            div.style.top = center.y - 50 + 'px';
                            div.style.position = 'absolute';
                            var children = div.children[0];
                            if (children) {
                                children.style.bottom = '0px';
                                children.style.left = '0px';
                            }
                        } else {
                            return;
                        }
                    }
                    NameOverlay.prototype.onRemove = function () {
                        this.div_.parentNode.removeChild(this.div_);
                        this.div_ = null;
                    }

                }
            } else {
                if (!AMap) {
                    config.error && config.error();
                    return false;
                }
            }
            var DEFAULT_LEVEL = 13;
            // @description 初始化地图信息
            var mapContainer;

            if (isOverseasAndGoogle) {
                mapContainer = new google.maps.Map(document.getElementById(config.id), {
                    // @description 地图中心点
                    center : new google.maps.LatLng(config.lat, config.lng),
                    zoom : config.level || DEFAULT_LEVEL, // @description 地图显示的比例尺级别
                    zoomControl : true
                });
            } else {
                mapContainer = new AMap.Map(config.id, {
                    // @description 地图中心点
                    center : new AMap.LngLat(config.lng, config.lat),
                    level : config.level || DEFAULT_LEVEL // @description 地图显示的比例尺级别
                });
                //增加Google的支持
                var googleGD = null;
                var addGoogle = function (mapObj) {
                    googleGD = new AMap.TileLayer({
                        tileUrl : "http://mt{1,2,3,0}.google.cn/vt/lyrs=m@142&hl=zh-CN&gl=cn&x=[x]&y=[y]&z=[z]&s=Galil" //图块取图地址
                    });
                    googleGD.setMap(mapObj);
                }
                //使用高德地图，如果定位的地址是国外，或者目前设备在国外，均要添加google地图支持
                if (isDomestic != 1 || Geo.isInOverseas) {
                    addGoogle(mapContainer);
                }
            }

            //绑定zoom事件
            if (config.zoomCallBack) {
                (!isOverseasAndGoogle) ? AMap.event.addListener(mapContainer, 'zoomchange', function () {
                    var newMarkers = config.zoomCallBack && config.zoomCallBack(this.getZoom());
                    if (newMarkers) {
                        this.clearMap();
                        createMarker(newMarkers, this, isOverseasAndGoogle);
                    }
                }) : google.maps.event.addListener(mapContainer, 'zoom_changed', function () {
                    var newMarkers = config.zoomCallBack && config.zoomCallBack(this.getZoom());
                    if (newMarkers) {
                        //删除原有的markers
                        if (marekrViews.marekrs && marekrViews.marekrs.length > 0) {
                            for (var i = 0; i < marekrViews.marekrs.length; i++) {
                                marekrViews.overlays[i].setMap && marekrViews.overlays[i].setMap(null);
                                marekrViews.marekrs[i].setMap && marekrViews.marekrs[i].setMap(null);
                            }
                            marekrViews = {
                                marekrs : [],
                                overlays : []
                            };
                        }
                        createMarker(newMarkers, this, isOverseasAndGoogle);
                    }
                });
            }
            if ((config.markers instanceof Array) && config.markers.length > 0) {
                markers = config.markers;
            } else {
                markers = config;
            }
            // @description 地图中心点
            createMarker(markers, mapContainer, isOverseasAndGoogle);
            //添加地图对象的返回，提供BU删除操作
            return mapContainer;
            //创建标记点
            function createMarker(params, mapObj, isDomestic) {
                if ((params instanceof Array) && params.length > 0) {
                    for (var i = 0; i < params.length; i++) {
                        var tempConfig = params[i];
                        if (!tempConfig || !tempConfig.lat || !tempConfig.lng) {
                            break;
                        }
                        createSingleMarekr(tempConfig, mapObj, isDomestic);
                    }
                } else {
                    createSingleMarekr(params, mapObj, isDomestic);
                }
                function createSingleMarekr(params, mapObj, isDomestic) {
                    var markerContent = $('<DIV/>').addClass('map-content');
                    if (!isDomestic) {
                        $('<IMG/>').attr({
                            src : 'http://res.m.ctrip.com/html5/Content/images/map_address.png'
                        }).appendTo(markerContent);
                    }
                    if (params.content) {
                        $('<SPAN/>').html(params.content).appendTo(markerContent);
                    }
                    var marker;
                    // @description 生成标记点，并且设置position
                    if (!isDomestic) {
                        marker = new AMap.Marker({
                            position : new AMap.LngLat(params.lng, params.lat),
                            map : mapObj,
                            id : params.markerId
                        });
                        //如果id存在设置为中心点
                        if (params.id && params.id != "") {
                            mapObj.setCenter(new AMap.LngLat(params.lng, params.lat));
                        }
                        marker.setContent(markerContent[0]);
                        if (params.callBack) {
                            AMap.event.addListener(marker,'click',function(){
                                params.callBack(params.markerId);
                            });
//                          mapObj.bind(marker, 'click',
//                              function () {
//                              });
                        }
                    } else {
                        marker = new google.maps.Marker({
                            position : new google.maps.LatLng(params.lat, params.lng),
                            map : mapObj,
                            icon : "http://res.m.ctrip.com/html5/Content/images/map_address.png",
                            id : params.markerId
                        });
                        //如果id存在设置为中心点
                        if (params.id && params.id != "") {
                            mapObj.setCenter(new google.maps.LatLng(params.lat, params.lng));
                        }
                        //此处 地图标记点说明用infowindow显示
                        var name1View = new NameOverlay(new google.maps.LatLng(params.lat, params.lng), params.content, mapObj, markerContent[0]);
                        marekrViews.marekrs.push(marker);
                        marekrViews.overlays.push(name1View);
                        if (params.callBack) {
                            //google marker的点击事件
                            google.maps.event.addListener(marker, 'click',
                                function () {
                                    params.callBack(params.markerId);
                                });
                        }
                    }
                };
            }
        }
        return WebMap(options);
    };

    /**
     * @description 在地图上显示多个POI位置点
     * @param {Array} poiList
     */
    Geo.showMapWithPOIList = function (poiList) {
    };

    /**
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
          url: 'Web function ' + i
        })
      }      
      var successCallback = function (pos) {
        //+1……2014-09-04……JIANGJing
        cperformance.groupEnd(uuidGeoRequest.number);

        var lng = pos.coords.longitude;
        var lat = pos.coords.latitude;
        posCallback && posCallback(lng, lat);
        var locateSuccessCallback = function (data) {
          //+1……2014-09-04……JIANGJing
          cperformance.groupEnd(uuidGeoRequest.detail);
          if (_.isFunction(cityCallBack))
          {          
            cityModel.setAttr('param', {Longitude: lng, Latitude: lat, CountryName: data.country, ProvinceName: data.province, L1CityName: data.city, L2CityName: data.district, TownName: '', Language: 'CN'});
            cityModel.excute(function(data){
              cperformance.groupEnd(uuidGeoRequest.city);
              cityCallBack(data);
            }, function(err){
              cperformance.groupTag(uuidGeoRequest.error, 'errno', '23');        
              cperformance.groupEnd(uuidGeoRequest.error);
              if (cityErrorCallBack) { cityErrorCallBack(err); }
            });
          }
          if (callback) {
            callback(data);
          }
        };

        var locateErrorCallback = function (err, msg) {
          //+……2014-09-12……JIANGJing……记录错误响应代码
          cperformance.groupTag(uuidGeoRequest.error, 'errno', '21');
          //+1……2014-09-04……JIANGJing
          cperformance.groupEnd(uuidGeoRequest.error);
          if (error) {
            error();
          }
        };
        if (!isAccurate) {
          Geo.requestAMapAddress(lng, lat, locateSuccessCallback, locateErrorCallback);
        } else {
          Geo.tansformLongitude(lng, lat, function (lng, lat) {
            Geo.requestAMapAddress(lng, lat, locateSuccessCallback, locateErrorCallback);
          }, function (err) {
            //-1……2014-09-12……JIANGJing……区分错误
            //locateErrorCallback(err);
            //+2……2014-09-12……JIANGJing……重新定义错误响应
            cperformance.groupTag(uuidGeoRequest.error, 'errno', '22');
            cperformance.groupEnd(uuidGeoRequest.error);
            if (error) {
              error();
            }
          });
        } 
      };

      var errorCallback = function (err, msg) {
        //-1……2014-09-04……JIANGJing
        //cperformance.groupEnd(uuidGeoService);

        //+……2014-09-12……JIANGJing……记录错误响应代码
        cperformance.groupTag(uuidGeoRequest.error, 'errno', '20');
        //+1……2014-09-04……JIANGJing
        cperformance.groupEnd(uuidGeoRequest.error);

        if (typeof posError === 'function') {
          posError(msg, err);
          return;
        }
        if (error) {
          error(msg);
        }
      };
      this.requestGeographic(successCallback, errorCallback);
    };
    
    /**
     * 获得设备经纬度
     * @param {function} callback 获得经纬度的回调
     * @param {function} error  发生错误时的回调
     * @param {timeout} 超时时间
     */
    Geo.requestGeographic = function (callback, error, timeout) {
      var uuidGeoService = cperformance.getUuid();
      cperformance.group(uuidGeoService, {
        name: "GeoRequest",
        url: "Google service",
        type: "Google service"
      });
            //add by byl 异步添加js，内部重写document.write，仅为下载google api使用
        var loadScript = function (url, inCallback, isWrite) {
            var script = document.createElement("script"),
                dw = document.write;
            script.type = "text/javascript";
            if (script.readyState) {
                script.onreadystatechange = function () {
                    if (script.readyState == "loaded" ||
                        script.readyState == "complete") {
                        script.onreadystatechange = null;
                        document.write = dw;
                        if (isWrite) {
                            inCallback && inCallback();
                        }
                    }
                };
            } else {
                script.onload = function () {
                    document.write = dw;
                    if (isWrite) {
                        inCallback && inCallback();
                    }
                };
                script.onerror = function(){
                    //下载失败，需要还原document.write
                    document.write = dw;
                };
            }
            script.src = url;
            document.write = function (ad) {
                var src = ad.match(/http(s)?:\/\/[A-Za-z0-9]+[\.\/=\?%\-&_~`@[\]\:+!]*([^<>])*(\.js)/);
                if (src) {
                    loadScript(src[0], function () {
                        document.write = dw;
                    }, true);
                }
            }
            document.body.appendChild(script);
        }
      var successCallback = function (position) {
        cperformance.groupEnd(uuidGeoService);
        if (callback) {
          callback(position);
        }
          //add by byl 在定位海外地址时，尝试下载google地图
          //此处可以考虑一个异步处理
          var lng = position.coords.longitude;
          var lat = position.coords.latitude;
          var isDomestic = cGeoHelper.getCountry(lng, lat);
          //add by byl  仅仅定位成功，并且在国外时，才为true,其余都是false
          if (isDomestic == 2) {
              Geo.isInOverseas = true;
              if (typeof google === 'undefined') {
                  loadScript('https://maps.googleapis.com/maps/api/js?v=3&region=zh-CN');
              }
          } else {
              Geo.isInOverseas = false;
          }
      };
      var errorCallback = function (err) {
        cperformance.groupEnd(uuidGeoService);
        var err_msg = '未能获取到您当前位置，请重试或选择城市'; // '获取经纬度失败!';
        switch (err.code) {
          case err.TIMEOUT:
            err_msg = "获取您当前位置超时，请重试或选择城市！";
            break;
          case err.PERMISSION_DENIED:
            err_msg = "您拒绝了使用位置共享服务，查询已取消，请开启位置共享或选择城市！";
            break;
          case err.POSITION_UNAVAILABLE:
            err_msg = "获取您当前位置信息失败，请重试或选择城市！";
            break;
        }
        if (error) {
          error(err, err_msg);
        }
      };

        //此处应该添加浏览器是否支持navigator的判断，并且enableHighAccuracy参数需要考虑，pc端不需要使用精确定位
        if (window.navigator && window.navigator.geolocation) {
            window.navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
                enableHighAccuracy : true,
                maximumAge : 5000,
                timeout : timeout || 20000
            });
        } else {
            if (error) {
                error("", "获取您当前位置信息失败，浏览器不支持定位！");
            }
        }
    };
    
    /**
     * @description: 获取转换过的经纬度
     * @param lng {Number} 经度
     * @param lat {Number} 维度
     * @param callback {Function} 成功回调
     * @param error {Function} 错误回调
     * @author: ouxz
     */
    Geo.tansformLongitude = function (lng, lat, callback, error, timeout) {
      var uuidGeoService = cperformance.getUuid();
      cperformance.group(uuidGeoService, {
        name : "GeoRequest",
        url : "http://restapi.amap.com/v3/assistant/coordinate/convert",
        type : "AMap service"
      });
      //add by byl  国外的地址 不需要进行详细定位
      var isDomestic = cGeoHelper.getCountry(lng, lat);
      if (isDomestic != 1) {
        cperformance.groupEnd(uuidGeoService);
        callback(lng, lat);
        return;
      }
      var param = $.param({
        locations : lng + ',' + lat,
        key : KEY,
        coordsys : 'gps'
      });
  
      timeout = timeout || 8000;
  
      $.ajax({
        url : "http://restapi.amap.com/v3/assistant/coordinate/convert?" + param,
        dataType : 'jsonp',
        success : function (data) {
          cperformance.groupEnd(uuidGeoService);
          if (data && data.status === '1') {
            var l = data.locations.split(',');
            callback && callback(l[0], l[1]);
          } else {
            error && error();
          }
        },
        error : function (e) {
          cperformance.groupEnd(uuidGeoService);
          error && error(e);
        },
        timeout : timeout
      });
    };

  /**
   * 高德api经纬度获得详细地址信息
   * @param lng {Number} 经度
   * @param lat {Number} 纬度
   * @param callback {Function} 完成时回调,回传参数为高德下发城市数据
   * @param error {Function} 超时回调
   * @param timeout {Number} 超时的时间长度，默认为8秒
   * @author ouxingzhi
   */
  Geo.requestAMapAddress = function (lng, lat, callback, error, timeout) {
    var uuidGeoService = cperformance.getUuid();
    cperformance.group(uuidGeoService, {
      name : "GeoRequest",
      url : "http://restapi.amap.com/v3/geocode/regeo",
      type : "AMap service"
    });
    var region = '121.473704,31.230393';
    var ret = 1; //默认的region地址是国内的，所以默认使用高德地图
    if (lng && lat) {
      region = lng + ',' + lat;
      //判断是否是国内的经纬度
      ret = cGeoHelper.getCountry(lng, lat);
    }

    timeout = timeout || 8000;

    var url = (ret == 1) ? ('http://restapi.amap.com/v3/geocode/regeo?' + $.param({
        'location' : region,
        'key' : KEY,
        'radius' : 0,
        'extensions' : 'all'
      })) : ('https://maps.googleapis.com/maps/api/geocode/json?' + $.param({
        latlng : lat + ',' + lng,
        sensor : false
      }));

    $.ajax({
      url : url,
      dataType : (ret == 1) ? 'jsonp' : 'json',
      success : function (data) {
        cperformance.groupEnd(uuidGeoService);
        var info = translateGeoResult(data, ret);
        if (_.isObject(info)) {
          callback && callback(translateGeoResult(data, ret));
        } else {
          error && error(data)
        }
      },
      error : function (e) {
        cperformance.groupEnd(uuidGeoService);
        error && error(e);
      },
      timeout : timeout
    });

    function translateGeoResult(data, type) {
      if (type == 1) {
        var addrs = (data && data.regeocode) || '',
        citys = addrs.addressComponent.city,
        province = addrs.addressComponent.province,
        district = addrs.addressComponent.district,
        city = '';
        if (_.isString(citys)) {
          city = citys;
        } else if (_.isString(province)) {
          city = province;
        }
        return {
          'address' : _.isString(addrs.formatted_address) ? addrs.formatted_address : '',
          'location' : region,
          'info' : addrs && addrs.addressComponent,
          'city' : city,
          'province' : province,
          'district' : district,
          'lng' : lng,
          'lat' : lat,
          'country' : '中国', //国内的固定传中国
          'countryShortName' : 'CHN'
        };
      } else {
        if (data && data.status === 'OK') {
          var district = '',
          city = '',
          country = '',
          province = '',
          countryShortName = '';
          if (!data.results) {
            return false;
          }
          //从第一个详细地址中获取国家省市区信息
          var detailAdress = data.results[0] || {};
          _.find(detailAdress.address_components, function (item) {
            var politicalName = item && item.long_name;
            if (item.types) {
              //国家
              if (item.types[0] == 'country' && item.types[1] == 'political') {
                country = politicalName;
                countryShortName = item.short_name;
              }
              //省级、州级
              if (item.types[0] === 'administrative_area_level_1' && item.types[1] === 'political') {
                province = politicalName;
              }
              //城市
              if (item.types[0] === 'locality' && item.types[1] === 'political') {
                city = politicalName;
              }
              //县级
              if (item.types[0] === 'administrative_area_level_2' && item.types[1] === 'political') {
                district = politicalName;
              }
              //区（此级别和上面的县级只能取一个，暂定取sublocality）
              if (item.types[0] === 'sublocality_level_1' && item.types[1] === 'sublocality') {
                district = politicalName;
              }
            }
          });
          if (country == '' && province == '' && city == '' && district == '') {
            return false;
          }
          return {
            'address' : _.isString(data.results[0].formatted_address) ? data.results[0].formatted_address : '',
            'location' : region,
            'info' : data.results[0].address_components,
            'lng' : lng,
            'lat' : lat,
            'country' : country,
            'province' : province,
            'city' : city,
            'district' : district,
            'countryShortName' : countryShortName
          };
        } else {
          return false;
        }
      }
    }
  };
  return Geo;
});
