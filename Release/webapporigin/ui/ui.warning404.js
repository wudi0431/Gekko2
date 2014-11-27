define(['UIView', getAppUITemplatePath('ui.warning404'), 'cGuiderService'], function (UIView, template, Guider) {

  return _.inherit(UIView, {
    propertys: function ($super) {
      $super();
      this.resetDefaultProperty();

    },

    resetDefaultProperty: function () {

      //html模板
      this.template = template;
      this.datamodel = {
        tel: '4000086666',
        loadFail: '加载失败，请稍后再试试吧',
        telText: '或者拨打携程客服电话',
        tryAgain: '重试',
        contact: '联系客服',
        showContact: true
      };

      this.events = {
        'click .cui-btns-tel': 'callTelAction',
        'click .cui-btns-retry': 'retryAction'
      };

      this.retryAction = function (e) {
        console.log('override retryAction');
      };

      this.callTelAction = function (e) {
        //      window.location.href = 'tel:' + self.tel;

        Guider.apply({
          hybridCallback: function () {
            Guider.callService();
          },
          callback: function () {
            window.location.href = 'tel:' + self.tel;
          }
        });

      };

    },


    //重新父类创建根节点方法
    createRoot: function (html) {
      this.$el = $(html).hide().attr('id', this.id);
    },

    setDatamodel: function (datamodel, retryAction, telAction) {
      if (!datamodel) datamodel = {};
      _.extend(this.datamodel, datamodel);
      this.retryAction = retryAction;
      this.callTelAction = telAction;
      this.refresh();
    },

    initialize: function ($super, opts) {
      $super(opts);
    }

  });

});
