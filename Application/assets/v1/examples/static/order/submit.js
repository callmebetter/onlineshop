define(function(require) {
    var main = require('/assets/v1/examples/modules/main.js');
    var m = new main();
    var isopen = true;
    var OrderSkuList = [];
    var hasqqg = false;
    var hasht = false;
    var IsExistUserIdentity = false;
    var ordertotalprice = 0;
    var totalIntegral = 0; //总积分
    var tmpTotalOrderPrice = 0;
    var tmpTotalIntegral = 0;
    var tmpTotalIntegralOrderPrice = 0;
    var userIntegral = 0;
    var isOriginalPrice = false;
    var isZheKou = false;
    var integralProductLevel = 1;
    var userLevel = 1;
    var IsIntegralmallUse = false;
    var isZeroProduct = false;
    var isIntegralProduct = false;
    var donateInfo = '';
    var canGetGift = false;
    var log ='';
    var discount = 0;
    var CouponCode = '';
    var UserIdentityInfo;
    var IdentityId;
    var hasfullinfo = false;
    var productSaleLimitConfig = void 0;//包邮条件
    var ishaslimitproduct = false; //是否包含限购商品
    var IsExistComplimentary = void 0;  //初始是否包含赠品，不考虑使用积分，优惠券， 优惠券码
    var canUseIntegralPrice = 0;
    var UseIntegralPrice = 0;
    var fullRetunnConf = [];//专场满返
    var isshowcangetintegral = false;
    var hasshangou = false;
    var BitCouponId='';
    var BitDiscount = 0;
    var hasBit = false;
    var isdeadline = false;//限时活动
    var timeinterval = null;//限时活动定时器
    var unReturnedCash = 0;//待满返金额
    var upto500Back500List = [];//参与满500返500商品集

    // SeckillProductId + ProductId   针对秒杀活动
    if ($_GET['seckillproductid'] && $_GET['productid']) {
        var SeckillProductId = $_GET['seckillproductid'];
        var ProductId = $_GET['productid'];
    }
    var addressid = $_GET['addressid'];
    var IdentityId = $_GET['IdentityId'];
    if (localStorage.cartInfo) {
        OrderSkuList = JSON.parse(localStorage.cartInfo);
    } else {
        $(".back").trigger('click');
    }
    window.localStorage.removeItem('paramAboutGift');
    //localstorage 优惠券码，当使用券码选择赠品回来，记录券码使用状态
    try {
        var  couponCodeInfo = JSON.parse(localStorage.getItem('couponCode'))||{};
        CouponCode = couponCodeInfo.couponCode ?  couponCodeInfo.couponCode : CouponCode;
    } catch(e){
      console.log(e);
    }
    var util = {
        saveParamAboutGift: function(name, value){
          /**
          *把赠品页面所需要的参数存储在本地，
          *name -required {String}
          *value-required {any}
          */
          try{
            var paramAboutGift = JSON.parse(localStorage.getItem('paramAboutGift')) || {};
            paramAboutGift[name] = value;
            localStorage.setItem('paramAboutGift', JSON.stringify(paramAboutGift))
          } catch(e){

          }
        },
        verifyDate: function(startTime, endTime){
                /*
           * @param {startTime} - required 合法格式:2017-10-30 00:00:00
           * @param  {endTime}  - option
           * by-ouyang
           */
          var nowTime = new Date().getTime()
          var startTime = new Date(startTime).getTime() || nowTime;
          var endTime = undefined == endTime ? nowTime : new Date(endTime).getTime()
          if (nowTime >= startTime && nowTime <= endTime) return true
          return false
        }
    }
     var datetimeFormat = {
        //日期时间格式化处理
         timer: function(dom) {
          var nowtime = Date.parse(new Date());
          var $this = $('.activity_time')
          var  starttime = m.substrTime($this.data('starttime'));
          var  endtime = m.substrTime($this.data('endtime'));
          var tplHtml = '';
          var times = 0;
          var day = 0;
          var hours = 0;
          if (nowtime < starttime) {
            times = starttime - nowtime; //计算剩余的毫秒数
          } else if (nowtime < endtime) {
            times = endtime - nowtime; //计算剩余的毫秒数
          }
          var hh = parseInt(times / 1000 / 60 / 60, 10); //计算剩余的小时数
          var mm = parseInt(times / 1000 / 60 % 60, 10); //计算剩余的分钟数
          var ss = parseInt(times / 1000 % 60, 10); //计算剩余的秒数
          if (hh <= 0 && mm <= 0 && ss < 0) {
            clearInterval(log);
            return false;
          }
          day = datetimeFormat.timePipe(Math.floor(hh / 24));
          hours = datetimeFormat.timePipe(hh % 24);
          mm = datetimeFormat.timePipe(mm);
          ss = datetimeFormat.timePipe(ss);
          if (nowtime < starttime) {
            tplHtml = '距离活动开始 '+ day +'天 '+hours+'</span>:<span  class="act_time">'+mm+'</span>:<span  class="act_time">'+ss;
          } else if (nowtime < endtime) {
            tplHtml = '距离活动结束 '+ day +'天 '+hours+'</span>:<span  class="act_time">'+mm+'</span>:<span  class="act_time">'+ss;
          } else {
            tplHtml = '活动已结束';
          }
          $this.html(tplHtml)
        },
         timePipe: function(num) {
          return num < 10 ? '0' + num : '' + num;
        }
    }
    var OrderDetial = {
        shopInfo: {
            OrderSkuList: OrderSkuList,
            SeckillProductId: SeckillProductId,
            ProductId: ProductId,
        },
        UserAddressId: '',
        AddressProvinceId:'',
        UserCouponId: '',
        DonateInfo: '', // 赠品
        exchangeGoods: '',
        exchangePrice: 0,
        init: function() {
            this.getDefult();
            this.getLogistics();
            this.getDefultIdentity();
            this.goPayEvent();
            this.getList();
            this.fullBack();
            $('#LogisticsList').change(function() {
                OrderDetial.getPostFee();
                OrderDetial.totalMoney();
            })

        },
        getList: function() {
            var ret = m.ajax({ url: m.baseUrl + '/order/OrderDetailsGet', data: { data: OrderDetial.shopInfo } });
            $(".detail").fadeIn();
            if (ret.status == 1) {
                var OrderProductHtml = '';
                var SeckillProductHtml = '';
                var OrderProductMain = ret.data.OrderProductMain;
                var SeckillProductMain = ret.data.SeckillProductMain;
                var HtProductListHtml = '';
                var OayepProductHtml = '';
                var OayepProductMain = ret.data.OayepProductMain;
                var LuckyBagMain = ret.data.LuckyBagMain;
                LuckyBagHtml = '';
                var HtProductMain = ret.data.HtProductMain;
                var PrefectureProductHtml = '';
                var PrefectureMain = ret.data.PrefectureMain;
                UserLevel = ret.data.UserLevel;
                var SnapUpActivitiesMain = ret.data.SnapUpActivitiesMain;
                var SnapUpActivitiesHtml ='';

                // 积分商城
                var IntegralmallProductHtml = '';
                var IntegralmallPrdMain = ret.data.IntegralmallPrdMain;
                var ExchangeActivitiesId = ret.data.ExchangeActivitiesId ? ret.data.ExchangeActivitiesId : '';//换购id
                var ActBrandId = ret.data.ActBrandId || [];
                //满300返300
                unReturnedCash = ret.data.WaitingReturnAmount;
                var FullReturnProductList = ret.data.FullReturnProductList || [];
                //包邮条件
                productSaleLimitConfig = ret.data.ProductSaleLimitConfig;
                IsExistComplimentary = ret.data.IsExistComplimentary;//初始赠品条件，控制选择赠品按钮显示隐藏
                if(!IsExistComplimentary){
                       $('#pickGift').remove();
                }
                if(ExchangeActivitiesId && ExchangeActivitiesId > 0){
                      $('#exchangeGood').removeClass('hidden');
                      var seckillProductId = OrderDetial.shopInfo.SeckillProductId || '';
                      $('#skip_link').attr('data-src', '/order/coudan?exchangeid=' + ExchangeActivitiesId+"&seckillProductId="+seckillProductId);
                }

                if(ret.data.IsExistIntegralOrder){
                       isshowcangetintegral =true;
                }
                 userIntegral = ret.data.Integral;
                //积分商城商品
                if (IntegralmallPrdMain.FOrderProductList && IntegralmallPrdMain.FOrderProductList.length > 0) {
                    isIntegralProduct = true;
                    IntegralmallProductHtml += '<div class="d_submit_item">\
                    <div class="pad4"><p class="d_order_head shopName">积分商城商品<span></span></p></div>\
                    <div class="getList">'
                    $.each(IntegralmallPrdMain.FOrderProductList, function(k, v) {
                        v.isFullbackFiveHundred = FullReturnProductList.indexOf(v.ProductId) >= 0 ;//满500送500，随机变量模拟
                        var upto500Back500Html = v.isFullbackFiveHundred ? '<i class="z_qqg">满300送300</i>' : '';
                        var discount = ((v.Price / v.MarketPrice) * 10).toFixed(1);
                        var DisCount = v.DistributorDisCount ? (1 - v.DistributorDisCount) : 1;
                        IntegralmallProductHtml += '<div class="d_order_product pad4 product_d"  data-DisCount="' + DisCount + '" data-SalesPrice="' + v.Price + '" data-Count="' + v.Count + '">\
                        <div><span><img src="' + v.Src + '"></span></div>\
                        <div class="d_order_name">\
                        <p class="d_order_tit"><span>' +  upto500Back500Html;
                        IntegralmallProductHtml += v.SkuName + '</span></p>\
                        <p class="d_order_sku">尺码:' + v.Specs + '</p>\
                        <p class="d_order_discount"><span>' + discount + '折</span></p>\
                        </div>\
                        <div class="d_order_price">\
                        <p class="d_order_saleprice">¥ ' + v.Price.toFixed(2) + '</p>\
                        <p class="d_order_marketprice"><del>¥' + v.MarketPrice.toFixed(2) + '</del></p>\
                        <p class="d_order_count">x' + v.Count + '</p>\
                        </div>\
                        </div>';
                        if(v.IsFullReturnActivity && v.BrandId != 636 && v.BrandId != 712 && v.FromType != 1100 ){
                            fullRetunnConf.push({
                                SkuId: v.SkuId,
                                TotalPrice: v.TotalPrice
                            })
                        }
                       //满500 送 500
                       if(v.isFullbackFiveHundred) {
                         upto500Back500List.push({
                            SkuId: v.SkuId,
                            TotalPrice: v.TotalPrice
                         })
                       }
                    });
                    IntegralmallProductHtml += '</div><div class=""><p class="d_order_footer pad4">';

                    $.each(IntegralmallPrdMain.FOrderProductList, function(k, v) {
                        tmpTotalOrderPrice += v.Price * v.Count;
                        tmpTotalIntegral += v.IntegralmallInteger * v.Count;
                        tmpTotalIntegralOrderPrice += v.IntegralmallPrice * v.Count;
                        integralProductLevel = v.IntegralMallLevel;
                        IsIntegralmallUse = v.IsIntegralmallUse;
                        if (v.IntegralMallZone == 2) {
                            isZheKou = true;
                        } else if (v.IntegralMallZone == 3) {
                            isZeroProduct = true;
                        }
                    });

                    // 原价购买
                    if (userIntegral < tmpTotalIntegral) {
                        ordertotalprice += tmpTotalOrderPrice;
                        totalIntegral += 0;
                        IntegralmallProductHtml += '<span style="float:left; color:#d72d83;font-size: 12px;">积分不足，需原价购买</span>';
                        IntegralmallProductHtml += '<span>共<span class="d_order_sumcount">' + IntegralmallPrdMain.TotalCount + '</span>件商品';
                        IntegralmallProductHtml += '合计：&yen; <span class="d_order_sumprice">' + IntegralmallPrdMain.PaidPrice + '</span></span></p></div></div>';
                        isOriginalPrice = true;
                    } else if (!IsIntegralmallUse) {
                        ordertotalprice += tmpTotalOrderPrice;
                        totalIntegral += 0;
                        IntegralmallProductHtml += '<span style="float:left; color:#d72d83;font-size: 12px;">等级不足，需原价购买</span>';
                        IntegralmallProductHtml += '<span>共<span class="d_order_sumcount">' + IntegralmallPrdMain.TotalCount + '</span>件商品';
                        IntegralmallProductHtml += '合计：&yen; <span class="d_order_sumprice">' + IntegralmallPrdMain.PaidPrice + '</span></span></p></div></div>';
                        isOriginalPrice = true;
                    } else {
                        ordertotalprice += tmpTotalIntegralOrderPrice;
                        totalIntegral += tmpTotalIntegral;
                        IntegralmallProductHtml += '<span>共<span class="d_order_sumcount">' + IntegralmallPrdMain.TotalCount + '</span>件商品';
                        IntegralmallProductHtml += '合计：&yen; <span class="d_order_sumprice">' + IntegralmallPrdMain.PaidPrice + '</span></span></p></div></div>';
                    }
                    // $('.postcast').hide();
                    $('.choose_discount').hide();
                    $('#use_code').hide();
                    var IntegralStr = '';
                    if (isZheKou) {
                        IntegralStr += '<div class="d_other_item pad4 use-integral" style="display:none">';
                        IntegralStr += '<span>是否使用积分购买满100</span>';
                        IntegralStr += '<p  class="use-integral-wrap false" id="useIntegral">';
                        IntegralStr += '<i class="use-integral-button" data-use-integral="true"></i>';
                        IntegralStr += '</p></div>';
                    } else {
                        IntegralStr += '<div class="d_other_item pad4 use-integral" >';
                        IntegralStr += '<span>是否使用积分购买</span>';
                        IntegralStr += '<p  class="use-integral-wrap false" id="useIntegral">';
                        IntegralStr += '<i class="use-integral-button" data-use-integral="false"></i>';
                        IntegralStr += '</p></div>';
                    }
                    $('.d_order_other').prepend(IntegralStr);
                }
                //普通商品
                if (OrderProductMain.FOrderProductList && OrderProductMain.FOrderProductList.length > 0) {
                    OrderProductHtml += '<div class="d_submit_item">\
                    <div class="pad4"><p class="d_order_head shopName">普通商品<span></span></p></div>\
                    <div class="getList">'
                    $.each(OrderProductMain.FOrderProductList, function(k, v) {
                        v.isFullbackFiveHundred = FullReturnProductList.indexOf(v.ProductId) >= 0 ;//满500送500，随机变量模拟
                        console.log(v.isFullbackFiveHundred)
                        var upto500Back500Html = v.isFullbackFiveHundred ? '<i class="z_qqg">满300送300</i>' : '';
                        var discount = ((v.Price / v.MarketPrice) * 10).toFixed(1);
                        var DisCount = v.DistributorDisCount ? (1 - v.DistributorDisCount) : 1;
                        OrderProductHtml += '<div class="d_order_product pad4 product_d"  data-DisCount="' + DisCount + '" data-SalesPrice="' + v.Price + '" data-Count="' + v.Count + '">\
                        <div><span><img src="' + v.Src + '"></span></div>\
                        <div class="d_order_name">\
                        <p class="d_order_tit"><span>' +  upto500Back500Html;
                        OrderProductHtml += v.SkuName + '</span></p>\
                        <p class="d_order_sku">尺码:' + v.Specs + '</p>\
                        <p class="d_order_discount"><span>' + discount + '折</span></p>\
                        </div>\
                        <div class="d_order_price">\
                        <p class="d_order_saleprice">¥ ' + v.Price.toFixed(2) + '</p>\
                        <p class="d_order_marketprice"><del>¥' + v.MarketPrice.toFixed(2) + '</del></p>\
                        <p class="d_order_count">x' + v.Count + '</p>\
                        </div>\
                        </div>'
                        if (v.ProductType == 200) { hasqqg = true; }
                        if (v.ProductType == 300) { hasht = true; }
                        if (v.ProductType == 500 || v.ProductType == 400) { ishaslimitproduct = true;}

                        if(!v.IsFullReturnActivity && v.BrandId != 636 && v.BrandId != 712 && v.FromType != 1100){
                            canUseIntegralPrice += v.Price * v.Count;
                        }
                        if(v.IsFullReturnActivity && v.BrandId != 636 && v.BrandId != 712 && v.FromType != 1100 ){
                          fullRetunnConf.push({
                            SkuId: v.SkuId,
                            TotalPrice: v.TotalPrice
                          })
                        }
                        //满500 送 500
                       if(v.isFullbackFiveHundred) {
                         upto500Back500List.push({
                            SkuId: v.SkuId,
                            TotalPrice: v.TotalPrice
                         })
                       }

                    });
                    ordertotalprice += OrderProductMain.PaidPrice;
                    OrderProductHtml += '</div><div class="">\
                    <p class="d_order_footer pad4"><span>共<span class="d_order_sumcount">' + OrderProductMain.TotalCount + '</span>件商品　合计：&yen; <span class="d_order_sumprice">' + OrderProductMain.PaidPrice + '</span></span></p>\
                    </div></div>'
                }

                //秒杀商品
                if (SeckillProductMain.FOrderProductList && SeckillProductMain.FOrderProductList.length > 0) {
                    SeckillProductHtml += '<div class="d_submit_item">\
                        <div class="pad4"><p class="d_order_head shopName">秒杀商品<span></span></p></div>\
                        <div class="getList">'
                    $.each(SeckillProductMain.FOrderProductList, function(k, v) {
                        v.isFullbackFiveHundred = FullReturnProductList.indexOf(v.ProductId) >= 0 ;//满500送500，随机变量模拟
                        var upto500Back500Html = v.isFullbackFiveHundred ? '<i class="z_qqg">满300送300</i>' : '';
                        var discount = ((v.Price / v.MarketPrice) * 10).toFixed(1);
                        var DisCount = v.DistributorDisCount ? (1 - v.DistributorDisCount) : 1;
                        SeckillProductHtml += '<div class="d_order_product pad4 product_d"  data-DisCount="' + DisCount + '" data-SalesPrice="' + v.Price + '" data-Count="' + v.Count + '">\
                                             <div><span><img src="' + v.Src + '"></span></div>\
                                             <div class="d_order_name">\
                                                 <p class="d_order_tit"><span>' +  upto500Back500Html;
                        SeckillProductHtml += v.SkuName + '</span></p>\
                                                <p class="d_order_sku">尺码:' + v.Specs + '</p>\
                                                <p class="d_order_discount"><span>' + discount + '折</span></p>\
                                             </div>\
                                             <div class="d_order_price">\
                                                <p class="d_order_saleprice">¥ ' + v.Price.toFixed(2) + '</p>\
                                                <p class="d_order_marketprice"><del>¥' + v.MarketPrice.toFixed(2) + '</del></p>\
                                                <p class="d_order_count">x' + v.Count + '</p>\
                                             </div>\
                                           </div>'
                        if (v.ProductType == 200) { hasqqg = true; }
                        if (v.ProductType == 300) { hasht = true; }
                        if (v.ProductType == 500 || v.ProductType == 400) { ishaslimitproduct = true;}
                        if(!v.IsFullReturnActivity && v.BrandId != 636 && v.BrandId != 712 && v.FromType != 1100){
                            canUseIntegralPrice += v.Price * v.Count;
                        }
                        if(v.IsFullReturnActivity && v.BrandId != 636 && v.BrandId != 712 && v.FromType != 1100){
                          fullRetunnConf.push({
                                SkuId: v.SkuId,
                                TotalPrice: v.TotalPrice
                          })
                        }
                        //满500 送 500
                       if(v.isFullbackFiveHundred) {
                         upto500Back500List.push({
                            SkuId: v.SkuId,
                            TotalPrice: v.TotalPrice
                         })
                       }
                    });
                    SeckillProductHtml += '</div><div class="">\
                        <p class="d_order_footer pad4"><span>共<span class="d_order_sumcount">' + SeckillProductMain.TotalCount + '</span>件商品　合计：&yen; <span class="d_order_sumprice">' + SeckillProductMain.PaidPrice + '</span></span></p>\
                        </div></div>'
                    ordertotalprice += SeckillProductMain.PaidPrice;
                    var seckillProductId = OrderDetial.shopInfo.SeckillProductId || '';
                    util.saveParamAboutGift('SeckillProductId', seckillProductId);

                }

                //全球购商品
                if (OayepProductMain.FOrderProductList && OayepProductMain.FOrderProductList.length > 0) {
                    OayepProductHtml += '<div class="d_submit_item">\
                        <div class="pad4"><p class="d_order_head shopName">全球购<span></span></p></div>\
                        <div class="getList">'
                    $.each(OayepProductMain.FOrderProductList, function(k, v) {
                        v.isFullbackFiveHundred = FullReturnProductList.indexOf(v.ProductId) >= 0 ;//满500送500，随机变量模拟
                        var upto500Back500Html = v.isFullbackFiveHundred ? '<i class="z_qqg">满300送300</i>' : '';
                        var discount = ((v.Price / v.MarketPrice) * 10).toFixed(1);
                        var DisCount = v.DistributorDisCount ? (1 - v.DistributorDisCount) : 1;
                        hasqqg = true;
                        OayepProductHtml += '<div class="d_order_product pad4 product_d"  data-DisCount="' + DisCount + '" data-SalesPrice="' + v.Price + '" data-Count="' + v.Count + '">\
                                             <div><span><img src="' + v.Src + '"></span></div>\
                                             <div class="d_order_name">\
                                                 <p class="d_order_tit"><span><span class="z_qqg">全球购</span>' +  upto500Back500Html;
                        OayepProductHtml += v.SkuName + '</span></p>\
                                                <p class="d_order_sku">尺码:' + v.Specs + '</p>\
                                                <p class="d_order_discount"><span>' + discount + '折</span></p>\
                                             </div>\
                                             <div class="d_order_price">\
                                                <p class="d_order_saleprice">¥ ' + v.Price.toFixed(2) + '</p>\
                                                <p class="d_order_marketprice"><del>¥' + v.MarketPrice.toFixed(2) + '</del></p>\
                                                <p class="d_order_count">x' + v.Count + '</p>\
                                             </div>\
                                           </div>'
                        if (v.ProductType == 200) { hasqqg = true; }
                        if (v.ProductType == 300) { hasht = true; }
                        if (v.ProductType == 500 || v.ProductType == 400) { ishaslimitproduct = true;}
                        if(!v.IsFullReturnActivity && v.BrandId != 636 && v.BrandId != 712 && v.FromType != 1100){
                            canUseIntegralPrice += v.Price * v.Count;
                        }
                         if(v.IsFullReturnActivity && v.BrandId != 636 && v.BrandId != 712 && v.FromType != 1100){
                          fullRetunnConf.push({
                                SkuId: v.SkuId,
                                TotalPrice: v.TotalPrice
                          })
                        }
                        //满500 送 500
                       if(v.isFullbackFiveHundred) {
                         upto500Back500List.push({
                            SkuId: v.SkuId,
                            TotalPrice: v.TotalPrice
                         })
                       }
                    });
                    OayepProductHtml += '</div><div class="">\
                        <p class="d_order_footer pad4"><span>共<span class="d_order_sumcount">' + OayepProductMain.TotalCount + '</span>件商品　合计：&yen; <span class="d_order_sumprice">' + OayepProductMain.PaidPrice + '</span></span></p>\
                        </div></div>'
                    ordertotalprice += OayepProductMain.PaidPrice;
                }

                //海淘商品
                if (HtProductMain.FOrderProductList && HtProductMain.FOrderProductList.length > 0) {
                    HtProductListHtml += '<div class="d_submit_item">\
                        <div class="pad4"><p class="d_order_head shopName">海淘<span></span></p></div>\
                        <div class="getList">'
                    $.each(HtProductMain.FOrderProductList, function(k, v) {
                        v.isFullbackFiveHundred = FullReturnProductList.indexOf(v.ProductId) >= 0 ;//满500送500，随机变量模拟
                        var upto500Back500Html = v.isFullbackFiveHundred ? '<i class="z_qqg">满300送300</i>' : '';
                        var discount = ((v.Price / v.MarketPrice) * 10).toFixed(1);
                        var DisCount = v.DistributorDisCount ? (1 - v.DistributorDisCount) : 1;
                        hasht = true;
                        HtProductListHtml += '<div class="d_order_product pad4 product_d"  data-DisCount="' + DisCount + '" data-SalesPrice="' + v.Price + '" data-Count="' + v.Count + '">\
                                             <div><span><img src="' + v.Src + '"></span></div>\
                                             <div class="d_order_name">\
                                                 <p class="d_order_tit"><span><span class="z_qqg">海淘</span>' +  upto500Back500Html;
                        HtProductListHtml += v.SkuName + '</span></p>\
                                                <p class="d_order_sku">尺码:' + v.Specs + '</p>\
                                                <p class="d_order_discount"><span>' + discount + '折</span></p>\
                                             </div>\
                                             <div class="d_order_price">\
                                                <p class="d_order_saleprice">¥ ' + v.Price.toFixed(2) + '</p>\
                                                <p class="d_order_marketprice"><del>¥' + v.MarketPrice.toFixed(2) + '</del></p>\
                                                <p class="d_order_count">x' + v.Count + '</p>\
                                             </div>\
                                           </div>'
                        if (v.ProductType == 200) { hasqqg = true; }
                        if (v.ProductType == 300) { hasht = true; }
                        if (v.ProductType == 500 || v.ProductType == 400) { ishaslimitproduct = true;}
                        if(!v.IsFullReturnActivity && v.BrandId != 636 && v.BrandId != 712 && v.FromType != 1100){
                            canUseIntegralPrice += v.Price * v.Count;
                        }
                         if(v.IsFullReturnActivity && v.BrandId != 636 && v.BrandId != 712 && v.FromType != 1100){
                          fullRetunnConf.push({
                                SkuId: v.SkuId,
                                TotalPrice: v.TotalPrice
                          })
                        }
                        //满500 送 500
                       if(v.isFullbackFiveHundred) {
                         upto500Back500List.push({
                            SkuId: v.SkuId,
                            TotalPrice: v.TotalPrice
                         })
                       }
                    });

                    HtProductListHtml += '</div><div class="">\
                        <p class="d_order_footer pad4"><span>共<span class="d_order_sumcount">' + HtProductMain.TotalCount + '</span>件商品　合计：&yen; <span class="d_order_sumprice">' + HtProductMain.PaidPrice + '</span></span></p>\
                        </div></div>'
                    ordertotalprice += HtProductMain.PaidPrice;
                }


                //福袋商品
                if (LuckyBagMain && LuckyBagMain.length > 0) {
                    $.each(LuckyBagMain, function(key, val) {
                        if(val.HotBrandRule == 200 )  {hasBit = true}
                        LuckyBagHtml += '<div class="d_submit_item">\
                    <div class="pad4"><p class="d_order_head shopName">' + val.BrandCoverName + '<span></span></p></div>\
                    <div class="getList">'
                        $.each(val.FOrderProductList, function(k, v) {
                            v.isFullbackFiveHundred = FullReturnProductList.indexOf(v.ProductId) >= 0 ;//满500送500，随机变量模拟
                            var upto500Back500Html = v.isFullbackFiveHundred ? '<i class="z_qqg">满300送300</i>' : '';
                            var discount = ((v.Price / v.MarketPrice) * 10).toFixed(1);
                            var DisCount = v.DistributorDisCount ? (1 - v.DistributorDisCount) : 1;
                            LuckyBagHtml += '<div class="d_order_product pad4 product_d"  data-DisCount="' + DisCount + '" data-SalesPrice="' + v.Price + '" data-Count="' + v.Count + '">\
                                                 <div><span><img src="' + v.Src + '"></span></div>\
                                                 <div class="d_order_name">\
                                                     <p class="d_order_tit"><span>' +  upto500Back500Html;
                            LuckyBagHtml += v.SkuName + '</span></p>\
                                                    <p class="d_order_sku">尺码:' + v.Specs + '</p>\
                                                    <p class="d_order_discount"><span>' + discount + '折</span></p>\
                                                 </div>\
                                                 <div class="d_order_price">\
                                                    <p class="d_order_saleprice">¥ ' + v.Price.toFixed(2) + '</p>\
                                                    <p class="d_order_marketprice"><del>¥' + v.MarketPrice.toFixed(2) + '</del></p>\
                                                    <p class="d_order_count">x' + v.Count + '</p>\
                                                 </div>\
                                               </div>'
                            if (v.ProductType == 200) { hasqqg = true; }
                            if (v.ProductType == 300) { hasht = true; }
                            if (v.ProductType == 500 || v.ProductType == 400) { ishaslimitproduct = true;}
                            if(!v.IsFullReturnActivity && v.BrandId != 636 && v.BrandId != 712 && v.FromType != 1100){
                                canUseIntegralPrice += v.Price * v.Count;
                            }
                            if(v.IsFullReturnActivity && v.BrandId != 636 && v.BrandId != 712 && v.FromType != 1100){
                              fullRetunnConf.push({
                                SkuId: v.SkuId,
                                TotalPrice: v.TotalPrice
                              })
                            }
                            //满500 送 500
                           if(v.isFullbackFiveHundred) {
                             upto500Back500List.push({
                                SkuId: v.SkuId,
                                TotalPrice: v.TotalPrice
                             })
                           }
                        });

                        LuckyBagHtml += '</div><div class="">\
                            <p class="d_order_footer pad4"><span>共<span class="d_order_sumcount">' + val.TotalCount + '</span>件商品　合计：&yen; <span class="d_order_sumprice">' + val.PaidPrice + '</span></span></p>\
                            </div></div>'
                        ordertotalprice += val.PaidPrice;

                    })
                }

                //专区商品
                if (PrefectureMain && PrefectureMain.length > 0) {
                    $.each(PrefectureMain, function(key, val) {
                         if(val.HotBrandRule == 200 )  {hasBit = true}
                        PrefectureProductHtml += '<div class="d_submit_item">\
                    <div class="pad4"><p class="d_order_head shopName">' + val.BrandCoverName + '<span></span></p></div>\
                    <div class="getList">'
                        $.each(val.FOrderProductList, function(k, v) {
                            v.isFullbackFiveHundred = FullReturnProductList.indexOf(v.ProductId) >= 0 ;//满500送500，随机变量模拟
                            var upto500Back500Html = v.isFullbackFiveHundred ? '<i class="z_qqg">满300送300</i>' : '';
                            var discount = v.Price == v.MarketPrice ? '原价':((v.Price / v.MarketPrice) * 10).toFixed(1) + '折';
                            var DisCount = v.DistributorDisCount ? (1 - v.DistributorDisCount) : 1;
                            PrefectureProductHtml += '<div class="d_order_product pad4 product_d"  data-DisCount="' + DisCount + '" data-SalesPrice="' + v.Price + '" data-Count="' + v.Count + '">\
                                                 <div><span><img src="' + v.Src + '"></span></div>\
                                                 <div class="d_order_name">\
                                                     <p class="d_order_tit"><span>' + upto500Back500Html;
                            PrefectureProductHtml += v.SkuName + '</span></p>\
                                                    <p class="d_order_sku">尺码:' + v.Specs + '</p>\
                                                    <p class="d_order_discount"><span>' + discount + '</span></p>\
                                                 </div>\
                                                 <div class="d_order_price">\
                                                    <p class="d_order_saleprice">¥ ' + v.Price.toFixed(2) + '</p>\
                                                    <p class="d_order_marketprice"><del>¥' + v.MarketPrice.toFixed(2) + '</del></p>\
                                                    <p class="d_order_count">x' + v.Count + '</p>\
                                                 </div>\
                                               </div>'
                            if (v.ProductType == 200) { hasqqg = true; }
                            if (v.ProductType == 300) { hasht = true; }
                            if (v.ProductType == 500 || v.ProductType == 400) { ishaslimitproduct = true;}
                            if(!v.IsFullReturnActivity && v.BrandId != 636 && v.BrandId != 712 && v.FromType != 1100){
                                canUseIntegralPrice += v.Price * v.Count;
                            }
                             if(v.IsFullReturnActivity && v.BrandId != 636 && v.BrandId != 712 && v.FromType != 1100){
                                fullRetunnConf.push({
                                      SkuId: v.SkuId,
                                      TotalPrice: v.TotalPrice
                                })
                             }
                             //满500 送 500
                           if(v.isFullbackFiveHundred) {
                             upto500Back500List.push({
                                SkuId: v.SkuId,
                                TotalPrice: v.TotalPrice
                             })
                           }

                        });
                        PrefectureProductHtml += '</div><div class="">\
                            <p class="d_order_footer pad4"><span>共<span class="d_order_sumcount">' + val.TotalCount + '</span>件商品　合计：&yen; <span class="d_order_sumprice">' + val.PaidPrice + '</span></span></p>\
                            </div></div>'
                        ordertotalprice += val.PaidPrice;
                        // if(val.HotBrandId && ActBrandId.indexOf(val.HotBrandId + '') >= 0){
                        // fullRetunnConf.push({
                        //   hotBrandId: val.HotBrandId,
                        //   paidPrice: val.PaidPrice
                        // })
                        // }
                    })
                }

                //抢购商品
                if (SnapUpActivitiesMain && SnapUpActivitiesMain.length > 0) {
                    $.each(SnapUpActivitiesMain, function(key, val) {
                        SnapUpActivitiesHtml += '<div class="d_submit_item">\
                    <div class="pad4"><p class="d_order_head shopName"><span style="display:block;overflow:hidden; text-overflow:ellipsis; white-space:nowrap; ">' + val.ActSeckillName + '</span><label style="text-align:right;color:#d72d83;font-weight:500" class="activity_time" data-endtime="'+val.EndTime+'" data-starttime="'+val.StartTime+'"></label></p></div>\
                    <div class="getList">'
                        $.each(val.FOrderProductList, function(k, v) {
                            v.isFullbackFiveHundred = FullReturnProductList.indexOf(v.ProductId) >= 0 ;//满500送500，随机变量模拟
                            var upto500Back500Html = v.isFullbackFiveHundred ? '<i class="z_qqg">满300送300</i>' : '';
                            var discount = ((v.Price / v.MarketPrice) * 10).toFixed(1);
                            var DisCount = v.DistributorDisCount ? (1 - v.DistributorDisCount) : 1;
                            SnapUpActivitiesHtml += '<div class="d_order_product pad4 product_d"  data-DisCount="' + DisCount + '" data-SalesPrice="' + v.Price + '" data-Count="' + v.Count + '">\
                                                 <div><span><img src="' + v.Src + '"></span></div>\
                                                 <div class="d_order_name">\
                                                     <p class="d_order_tit"><span>' +  upto500Back500Html;
                            SnapUpActivitiesHtml += v.SkuName + '</span></p>\
                                                    <p class="d_order_sku">尺码:' + v.Specs + '</p>\
                                                    <p class="d_order_discount"><span>' + discount + '折</span></p>\
                                                 </div>\
                                                 <div class="d_order_price">\
                                                    <p class="d_order_saleprice">¥ ' + v.Price.toFixed(2) + '</p>\
                                                    <p class="d_order_marketprice"><del>¥' + v.MarketPrice.toFixed(2) + '</del></p>\
                                                    <p class="d_order_count">x' + v.Count + '</p>\
                                                 </div>\
                                               </div>'
                            if (v.ProductType == 200) { hasqqg = true; }
                            if (v.ProductType == 300) { hasht = true; }
                            if (v.ProductType == 500 || v.ProductType == 400) { ishaslimitproduct = true;}
                            if(!v.IsFullReturnActivity && v.BrandId != 636 && v.BrandId != 712 && v.FromType != 1100 && v.FromType !=800 ){
                                canUseIntegralPrice += v.Price * v.Count;
                            }
                             if(v.IsFullReturnActivity && v.BrandId != 636 && v.BrandId != 712 && v.FromType != 1100 && v.FromType !=800 ){
                              fullRetunnConf.push({
                                    SkuId: v.SkuId,
                                    TotalPrice: v.TotalPrice
                              })
                            }
                            //满500 送 500
                           if(v.isFullbackFiveHundred) {
                             upto500Back500List.push({
                                SkuId: v.SkuId,
                                TotalPrice: v.TotalPrice
                             })
                           }
                            if( v.FromType == 1100){ hasshangou= true }
                            if(v.FromType == 800 ){ isdeadline = true}

                        });
                        SnapUpActivitiesHtml += '</div><div class="">\
                            <p class="d_order_footer pad4"><span>共<span class="d_order_sumcount">' + val.TotalCount + '</span>件商品　合计：&yen; <span class="d_order_sumprice">' + val.PaidPrice + '</span></span></p>\
                            </div></div>'
                        ordertotalprice += val.PaidPrice;
                    })

                }
                var canUseintegral = true;
                // if(util.verifyDate('2017-12-03')){
                //         canUseintegral = true;
                // }else{
                //     var ret = m.ajax({ url: m.baseUrl + '/member/DecodeUid', data: { 'ppgid': m.getCookie('ppgid') } });
                //     if (1 == ret.status) {
                //       var oauthArr = [80455,4, 107600, 101380, 107892, 113107, 105865, 100815, 98174, 67220, 15, 107134, 109805, 107576, 35565, 73197, 67786, 99183, 10, 74281, 54936, 7, 25, 2, 20723, 80459, 7807, 73149];
                //         if (oauthArr.indexOf(ret.data.uid) >= 0 ) {
                //             canUseintegral = true;
                //         }
                //      }
                // }

                //复星专区商品不能使用优惠券或优惠券码
                if(hasBit){

                        $(".choose_discount").hide(); $("#use_code").hide();
                }
                if(util.verifyDate('2018-01-01 00:00:00')){
                        canUseintegral = false;
                }
                if ((!IntegralmallPrdMain.FOrderProductList || IntegralmallPrdMain.FOrderProductList.length <= 0)   && canUseintegral ) {
                    //非积分商城的积分使用
                    var IntegralStr = '';
                    if(userIntegral > canUseIntegralPrice*100){

                        var IntegralPrice = (canUseIntegralPrice *100).toFixed(0);
                    }else{
                        var IntegralPrice = userIntegral.toFixed(0);
                    }
                    IntegralStr += '<div class="d_other_item pad4 use-integral" >';
                    IntegralStr += '<span>是否使用积分<span style="color:#bcbcbc;margin-left:5px" class="iwantkonw">满1000可用<span style="font-size: 14px;color:#bcbcbc;margin-left:5px" class="icon-wen"></span></span></span>';
                    IntegralStr += '<p  class="use-integral-wrap false" id="integral_use">';
                    IntegralStr += '<i class="use-integral-button" data-use-integral="false"></i>';
                    IntegralStr += '</p></div><div class="d_other_item pad4 use-integral" style="color:#d72d83">本次可使用：'+IntegralPrice+'积分</div>';
                    if(canUseIntegralPrice>0){
                        $('.d_order_other').prepend(IntegralStr);
                    }
                }


                if (hasht || hasqqg) {
                    $(".submit_global").show();
                }
                if(ishaslimitproduct){
                    $(".choose_discount").hide();
                }

                var html = IntegralmallProductHtml + OrderProductHtml + OayepProductHtml + HtProductListHtml + SeckillProductHtml + LuckyBagHtml + PrefectureProductHtml +SnapUpActivitiesHtml;
                $('#ordercon').html(html);
                if(hasshangou){
                    $(".choose_discount").hide(); $("#use_code").hide();
                    if(!log){timer();log= setInterval(timer,1000);}
                }
                if(isdeadline){
                   $(".choose_discount").remove();
                   $("#use_code").remove();
                   if(!timeinterval){
                      datetimeFormat.timer();
                      timeinterval = setInterval(datetimeFormat.timer,1000);
                     }
                     $('#exchangeGood').removeClass('hidden');
                     var seckillProductId = OrderDetial.shopInfo.SeckillProductId || '';
                     $('#skip_link').attr('data-src', '/order/coudan?exchangeid=' + ExchangeActivitiesId+"&seckillProductId="+seckillProductId);
                }


                chooseCoupon();
                function chooseCoupon() {
                    if (isIntegralProduct) return
                    // 选择优惠券
                    if (localStorage.couponInfo) {
                        var v = JSON.parse(localStorage.couponInfo);
                        if($.isEmptyObject(v)){ return;}
                        OrderDetial.UserCouponId = v.UserCouponId;
                        var isBitCoupon = false;
                        if(v.ActCouponType ==300){isBitCoupon = true;$("#fusuncou").show();};
                        if (v.CouponType == '100') {
                            var totalprice = 0;
                            totalcouponprice = 0;
                            $(".product_d").each(function() {
                                var DisCount = $(this).attr("data-DisCount");
                                var SalesPrice = $(this).attr("data-SalesPrice");
                                var Count = $(this).attr("data-Count");
                                var realDisCount = DisCount > v.FacePrice ? DisCount : v.FacePrice;
                                var price = (SalesPrice * Count * realDisCount).toFixed(2);
                                var couponprice = SalesPrice * Count - price;
                                totalprice += price;
                                totalcouponprice += couponprice;
                            })
                            var reduce = totalcouponprice.toFixed(2);

                            if(isBitCoupon){
                                BitCouponId = v.UserCouponId; BitDiscount  =  reduce;
                            }else{
                                $('.choose_discount m').html((v.FacePrice * 10).toFixed(2) + "折折扣券 ");
                            }
                        } else {
                            var reduce = v.FacePrice;
                            if(isBitCoupon){
                                BitCouponId = v.UserCouponId; BitDiscount  =  reduce;
                            }else{
                                $('.choose_discount m').html('-￥' + v.FacePrice.toFixed(2));
                            }
                        }
                        //$('.choose_discount info r').html('-' + reduce);
                        discount = reduce;
                        $('.choose_discount info').show();
                    } else if (ret.data.UserCoupon) {
                        //如果用户选择券码、赠品，此时不应该使用默认的优惠券
                        if(window.localStorage.couponCode){ return false;  }
                        // 不是积分商品，使用优惠券
                        if (!isIntegralProduct) {
                            var v = ret.data.UserCoupon;
                            OrderDetial.UserCouponId = v.UserCouponId;
                            var isBitCoupon = false;
                            if(v.ActCouponType == 300){isBitCoupon = true ;$("#fusuncou").show();};
                            if (v.CouponType == '100') {
                                var totalprice = 0;
                                totalcouponprice = 0;
                                $(".product_d").each(function() {
                                    var DisCount = $(this).attr("data-DisCount");
                                    var SalesPrice = $(this).attr("data-SalesPrice");
                                    var Count = $(this).attr("data-Count");
                                    var realDisCount = DisCount > v.FacePrice ? DisCount : v.FacePrice;
                                    var price = (SalesPrice * Count * realDisCount).toFixed(2);
                                    var couponprice = SalesPrice * Count - price;
                                    totalprice += price;
                                    totalcouponprice += couponprice;
                                })
                                var reduce = totalcouponprice.toFixed(2);
                                if(isBitCoupon){
                                    BitCouponId = v.UserCouponId; BitDiscount  =  reduce;
                                }else{
                                    $('.choose_discount m').html((v.FacePrice * 10).toFixed(2) + "折折扣券 ");
                                }

                            } else {
                                var reduce = v.FacePrice;
                                if(isBitCoupon){
                                    BitCouponId = v.UserCouponId; BitDiscount  =  reduce;
                                }else{
                                    $('.choose_discount m').html('-￥' + v.FacePrice.toFixed(2));
                                }
                            }
                            var couponInfo = {
                                UserCouponId: v.UserCouponId,
                                FacePrice: v.FacePrice
                            }
                            if(isBitCoupon){
                                couponInfo.ActCouponType = 300;
                            }
                            localStorage.setItem('couponInfo', JSON.stringify(couponInfo))
                            localStorage.removeItem('couponCode');
                            //$('.choose_discount info r').html('-' + reduce);

                            discount = reduce;
                            $('.choose_discount info').show();
                        }
                    }
                }
                this.getPostFee();
                // this.totalMoney();
                // 显示赠品
                var gift = '';
                if (localStorage.donateInfo) {
                    OrderDetial.DonateInfo = JSON.parse(localStorage.donateInfo);
                    // localStorage.removeItem('donateInfo')
                    $.each(OrderDetial.DonateInfo, function(k, v) {
                        gift += '<div class="d_order_product pad4">\
                                <div>\
                                    <span><img src="' + v.Src + '"></span></div>\
                                <div class="d_order_name">\
                                    <p class="d_order_tit"><span>' + v.SkuName + '</span></p>\
                                    <p class="d_order_sku">尺码:' + v.Size + '</p>\
                                    <p class="d_order_discount"></p>\
                                </div>\
                                <div class="d_order_price">\
                                    <p class="d_order_saleprice">¥ ' + v.Price + '</p>\
                                    <p class="d_order_marketprice"><del>¥' + v.MarketPrice + '</del></p>\
                                    <p class="d_order_count">x1</p>\
                                </div>\
                            </div>';
                        var data = {
                            IsGift: true,
                            SkuId: v.SkuId,
                            Count: 1,
                            RelateId: v.ActivityId
                        }
                        OrderDetial.shopInfo.OrderSkuList.push(data);
                        $('.showGift').html(gift);
                    })
                } else {
                      // var isUseIntegralBoolen = $('.use-integral-button').attr('data-use-integral') == 'true' ? true : false;
                      //   var options = {
                      //       CouponCode: CouponCode,
                      //       OrderSkuList: OrderDetial.shopInfo.OrderSkuList,
                      //       SeckillProductId: OrderDetial.shopInfo.SeckillProductId || '',
                      //       UserCouponId: OrderDetial.UserCouponId || '',
                      //       IsUseIntegral: isUseIntegralBoolen
                      //   }
                      //   var giftAbout = {
                      //       hasData: '', // 是否有数据 0 没 1 有
                      //       OrderSkuList: JSON.parse(localStorage.cartInfo),
                      //       init: function() {
                      //           this.getList();
                      //       },
                      //       getList: function() {
                      //           var ret = m.ajax({ url: m.baseUrl + '/order/GetOrderGift', data: options })
                      //           if (ret.status == 1) {
                      //               if (ret.data.FActivityWagProductList.length <= 0) {
                      //                   giftAbout.hasData = 0;
                      //                   $('.showGift').html('');
                      //                   $('.d_submit_item .donationInfo').text('暂无赠品信息');

                      //                   return;
                      //               } else {
                      //                   giftAbout.hasData = 1;
                      //                   var str = '';
                      //                   var sizeList = [];
                      //                   var result = ret.data.FActivityWagProductList
                      //                   result = result.sort(function(a, b) { return b.FullPrice - a.FullPrice })
                      //                   var ActivityId = result[0].ActivityId
                      //                   var v = result[0].FProductList[0].SkuInfos[0]
                      //                   gift += '<div class="d_order_product pad4">\
                      //                     <div>\
                      //                         <span><img src="' + v.Src + '"></span></div>\
                      //                     <div class="d_order_name">\
                      //                         <p class="d_order_tit"><span>' + v.SkuName + '</span></p>\
                      //                         <p class="d_order_sku">尺码:' + v.Size + '</p>\
                      //                         <p class="d_order_discount"></p>\
                      //                     </div>\
                      //                     <div class="d_order_price">\
                      //                         <p class="d_order_saleprice">¥ ' + v.Price + '</p>\
                      //                         <p class="d_order_marketprice"><del>¥' + v.MarketPrice + '</del></p>\
                      //                         <p class="d_order_count">x1</p>\
                      //                     </div>\
                      //                 </div>';
                      //                   var data = {
                      //                       IsGift: true,
                      //                       SkuId: v.SkuId,
                      //                       Count: 1,
                      //                       RelateId: ActivityId
                      //                   }
                      //                   OrderDetial.DonateInfo = data;

                      //                   OrderDetial.shopInfo.OrderSkuList.push(data);
                      //                   $('.d_submit_item .donationInfo').html('赠品信息');
                      //               }
                      //           }
                      //       },
                      //   }
                      //   giftAbout.init()
                      //   $('.showGift').html(gift);
                }

                //显示换购商品
                if(window.localStorage.coudan){
                   OrderDetial.exchangeGoods = JSON.parse(localStorage.getItem('coudan'));
                   var html = '';
                   $.each( OrderDetial.exchangeGoods, function(k, v){
                     html += '<div class="d_order_product pad4">\
                                <div>\
                                    <span><img src="' + v.Src + '"></span></div>\
                                <div class="d_order_name">\
                                    <p class="d_order_tit"><span>' + v.SkuName + '</span></p>\
                                    <p class="d_order_sku">尺码:' + v.Size + '</p>\
                                    <p class="d_order_discount"></p>\
                                </div>\
                                <div class="d_order_price">\
                                    <p class="d_order_saleprice">¥ ' + v.Price + '</p>\
                                    <p class="d_order_marketprice"><del>¥' + v.MarketPrice + '</del></p>\
                                    <p class="d_order_count">x1</p>\
                                </div>\
                            </div>';
                   var data = {
                    FromType: 900,
                     SkuId: v.SkuId,
                     Count: 1,
                     RelateId: v.RelatedId
                   }
                    OrderDetial.shopInfo.OrderSkuList.push(data);
                    OrderDetial.exchangePrice += +v.Price.toFixed(2);
                   })
                   $('#show_exchangegood').html(html);
                }
                //如果用户已经选择券码再回到提交页面
                if(window.localStorage.couponCode){
                 var  couponCodeInfo = JSON.parse(localStorage.getItem('couponCode'))||{};
                     discount = +couponCodeInfo.discount;
                     var discountTxt = couponCodeInfo.discountTxt;
                    $("#coupon").html("￥" + discount);
                    $('#use_code info r').text(discountTxt).css('color', '#d72d83');
                    $("#use_code").attr("data-status", "true");
                    $('#use_code info').show();
                }
                this.totalMoney();
            }
        },
        getDefult: function() {
            var url = '/order/GetDefault';
            if (addressid) { url = '/Personal/AjaxAddressGet'; }
            var JsonData = { UserAddressId: addressid };
            $.ajax({
                url: m.baseUrl + url,
                data: JsonData,
                type: 'post',
                dataType: 'jsonp',
                jsonp: 'callback',
                async: false,
            }).done(function(ret) {
                if (ret.status == 1) {
                    var v = ret.data;
                    var html = '<div class="submit_user_info">\
                          <p>收件人:  ' + v.Name + '</p>\
                          <p>电话:  ' + v.Phone + '</p>\
                      </div>\
                      <p class="submit_address_info">收件地址:  ' + v.Address + '</p>'
                    OrderDetial.UserAddressId = v.UserAddressId;
                    OrderDetial.AddressProvinceId = v.Province;
                    $('.getAddress').html(html);
                } else {
                    $('.getAddress').html('请添加地址');
                }
            });
        },
        getDefultIdentity: function() {
            var url = '/order/GetDefaultIdentity';
            if (IdentityId) { url = '/Personal/AjaxIdentityGet'; }
            var JsonData = { IdentityId: IdentityId };
            $.ajax({
                url: m.baseUrl + url,
                data: JsonData,
                type: 'post',
                dataType: 'jsonp',
                jsonp: 'callback',
                async: false,
            }).done(function(ret) {
                var identityinfohtml = '';
                if (ret.status == 1) {
                    var identityinfo;
                    if (IdentityId) {
                        identityinfo = ret.data.Model;
                    } else {
                        identityinfo = ret.data;
                    }
                    identityinfohtml += '<span>' + identityinfo.RealName + '</span>\
                        <span>' + identityinfo.IDNumber.substring(0, 3) + '***********' + identityinfo.IDNumber.substring(14, 18) + '</span>\
                        <span class="icon-bright"></span>'
                    $("#identityinfo").html(identityinfohtml);
                    IdentityId = identityinfo.IdentityId;
                    if (identityinfo.IdCardContrary && identityinfo.IdCardFront) {
                        hasfullinfo = true;
                    }
                } else {
                    identityinfohtml += '<span style="width:80%">请选择身份认证信息</span>\
                    <span style="width:5%"></span>\
                    <span class="icon-bright"></span>'
                    $("#identityinfo").html(identityinfohtml);
                }
            })
        },
        getLogistics: function() {

            // var ret = m.ajax({ url: m.baseUrl + '/order/getLogistics' });
            // if (ret.status == 1) {
            //     var v = ret.data;
            //     var html = '';
            //     if (v && v.ExpressList) {
            //         $.each(v.ExpressList, function() {
            //             html += '<option data-ExpressId="' + this.ExpressId + '">' + this.Subheading + '</option>';
            //         })
            //     }
            //     $('#LogisticsList').html(html);
            // }
            var html = '<option data-ExpressId=5 selected > 普通快递</option>';
            $('#LogisticsList').html(html);
        },
        getPostFee: function() {
            var UserAddressId = parseInt(OrderDetial.UserAddressId);
            if (!UserAddressId) { return };
            var isUseIntegralBoolen = $('.use-integral-button').attr('data-use-integral') == 'true' ? true : false;
            var isUseIntegralBoolen = ($("#integral_use").hasClass("true") || isUseIntegralBoolen) ? true :false;

            var ExpressId = $("#LogisticsList").find("option:selected").data('expressid');
            var ret = m.ajax({
                url: m.baseUrl + '/order/GetPostFee',
                data: {
                    ExpressId: ExpressId,
                    CouponCode: CouponCode,
                    UserAddressId: UserAddressId,
                    OrderSkuList: OrderDetial.shopInfo.OrderSkuList,
                    SeckillProductId: OrderDetial.shopInfo.SeckillProductId,
                    UserCouponId: OrderDetial.UserCouponId,
                    IsUseIntegral: isUseIntegralBoolen
                }
            });
            if (ret.status == 1) {
                var talPostFee = ret.data.PostFeePrices.toFixed(2)
                $('.postFee post').html(talPostFee);
                $('.postcast span').html(talPostFee);
            } else {
                /* m.AlertMessage(ret.msg);*/
                return;
            }
        },
        totalMoney: function() {
            // 总价等于 = 上面的小合计 - 优惠券 + 邮费 - 积分抵扣
            // console.log(ordertotalprice);
            // console.log(discount);
            var postFee = parseFloat($('.postFee post').html());
            var totalPri = ordertotalprice - discount + this.exchangePrice - UseIntegralPrice;
            var fullbackintegral = ((canUseIntegralPrice - UseIntegralPrice - discount)*100).toFixed(0);
            if(util.verifyDate('2018-01-01 00:00:00')){
                        fullbackintegral = 0;
            }
            fullbackintegral = parseInt(fullbackintegral/1000)*1000;
            $(".cangetintegral").html(fullbackintegral);
            if((isshowcangetintegral && fullbackintegral>0) || fullbackintegral >=10000 ){
                    $(".showcangetintegral").slideDown(400);
            }else{
                    $(".showcangetintegral").slideUp(400);
            }
             //判断包邮条件,null没有包邮限制，有限制时返回限制条件

            if(productSaleLimitConfig){
                var fullPrice = productSaleLimitConfig.FullPrice;
                var delta = (totalPri  - fullPrice).toFixed(2);
                $('#fullprice').text(fullPrice);
                if(postFee>0 && delta<0){
                    $('#tips #mustache').text("还差"+(0 - delta)+"元免邮费");
                    $('#tips').slideDown();
                }else{
                    $('#tips #mustache').text("已达满包邮条件");
                }

            }
            if (totalPri <= 0 && UseIntegralPrice ==0) {
                totalPri = postFee > 0 ? 0 : 0.01;
            }
            totalPri = totalPri + postFee;
            if(UseIntegralPrice>0){

                $('.total_all span').html(totalPri.toFixed(2));

            }else if (userIntegral < tmpTotalIntegral || (isZheKou && integralProductLevel <= userLevel) || (!IsIntegralmallUse)) {
                $('.total_all span').html(totalPri.toFixed(2));
            } else {
                if (tmpTotalOrderPrice <= 0) {
                    tmpTotalOrderPrice = postFee > 0 ? 0 : 0.01;
                }
                tmpTotalOrderPrice = tmpTotalOrderPrice + postFee;
                $('.total_all span').html(tmpTotalOrderPrice.toFixed(2));
                var a = "<i class='isShow' style='display:none;'> + <i id='IuseIntegral'>0</i>积分</i>";
                $('.total_all').append(a);
            }

            var productprice = $(".d_order_sumprice").html();
        },
        goPayEvent: function() {
            $('.gopay').click(function() {
                // 判断是否登录
                if (!m.getCookie('ppgid')) {
                    m.Wislogin();
                    return;
                }
                //判断是否绑定手机号
                $.ajax({
                    url: m.baseUrl + '/personal/AjaxFVerifyBindPhone',
                    dataType: 'jsonp',
                    jsonp: 'callback',
                    type: 'post',
                    async: false,
                }).done(function(ret) {
                    if (ret.status) {
                        if (!ret.data.IsBindPhone) {
                            isopen = false;
                            m.UrltoStorage();
                            window.location.href = "/personal/bindphone";
                        }
                    }
                })
                if (!isopen) { return };
                if (hasht || hasqqg) {
                    if (!IdentityId) { m.AlertMessage('请填写认证信息'); return; }
                }
                if (hasht) {
                    if (!hasfullinfo) { m.AlertMessage('请完善认证信息'); return; }
                }
                if ($_GET['iscartorder']) {
                    var IsCartFrom = true;
                } else {
                    var IsCartFrom = false;
                }
                // if(ishaslimitproduct){
                //     if(OrderDetial.AddressProvinceId !=890){
                //         m.AlertMessage('有机农产品仅限上海地区购买'); return;
                //     }
                // }
                var TotalPaidAmount = parseFloat($('.total_all span').html());
                var Remark = $('.Remark').val();
                var ExpressId = $("#LogisticsList").find("option:selected").attr("data-ExpressId");
                var isUseIntegralBoolen = $('.use-integral-button').attr('data-use-integral') == 'true' ? true : false;
                var totalPayIntegral = isUseIntegralBoolen ? tmpTotalIntegral : 0;
                if(UseIntegralPrice >0){ totalPayIntegral = (UseIntegralPrice*100).toFixed(0); isUseIntegralBoolen = true}
                donateInfo = OrderDetial.DonateInfo
                var data = {
                    ExpressId: ExpressId,
                    UserAddressId: OrderDetial.UserAddressId,
                    TotalPaidAmount: TotalPaidAmount,
                    OrderSkuList: OrderDetial.shopInfo.OrderSkuList,
                    SeckillProductId: OrderDetial.shopInfo.SeckillProductId,
                    ProductId: OrderDetial.shopInfo.ProductId,
                    IsPaidPostfee: true,
                    Remark: Remark,
                    Channel: 30, // 订单渠道     Other  0  Android  10  IOS 20   H5 30
                    UserCouponId: OrderDetial.UserCouponId,
                    IsCartFrom: IsCartFrom, //是否来源购物车
                    CouponCode: CouponCode, //优惠券码
                    isweb: isWeb,
                    IdentityId: IdentityId,
                    IsUseIntegral: isUseIntegralBoolen,
                    TotalPaidIntegral: totalPayIntegral,
                }
                var ret = m.ajax({ url: m.baseUrl + '/order/CreateOrder', data: { data: data } });
                if (ret.status == 1) {
                    if (localStorage.donateInfo) {
                        localStorage.removeItem('donateInfo');
                    }
                    localStorage.removeItem('cartInfo');
                    localStorage.removeItem('couponInfo');
                    localStorage.removeItem('couponCode');
                    localStorage.removeItem('paramAboutGift');
                    localStorage.removeItem('coudan');
                    if (isZeroProduct && totalPayIntegral > 0 && tmpTotalIntegralOrderPrice.toFixed(2) <= 0) {
                        var retInfo = m.ajax({ url: m.baseUrl + '/order/GetZeroBak', data: { OrderId: ret.data.OrderId } });
                        if (retInfo.status == 1) {
                            window.location.href = "/pay/Success";
                        } else {
                            isopen = true;
                            m.AlertMessage(retInfo.msg);
                            return;
                        }
                    } else if(TotalPaidAmount == 0 && UseIntegralPrice>0 ){
                        var retInfo = m.ajax({ url: m.baseUrl + '/order/GetZeroBak', data: { OrderId: ret.data.OrderId } });
                        if (retInfo.status == 1) {
                            window.location.href = "/pay/Success";
                        } else {
                            isopen = true;
                            m.AlertMessage(retInfo.msg);
                            return;
                        }
                    }else{

                        window.location.href = "/cart/pay?OrderId=" + ret.data.OrderId;
                    }

                } else {
                    isopen = true;
                    m.AlertMessage(ret.msg);
                    return;
                }
            })
        },

        fullBack: function(tPrice) {
            var fullPrice = 0;
            var $fullback = $('.fullback').find('.txt');
            var txt = '';
            var PERCENTAGE = .1;
            fullRetunnConf.map(function(v, k){
              v.discount = (v.TotalPrice / ordertotalprice * discount).toFixed(2);
              v.discountedFee = (v.TotalPrice - v.discount).toFixed(2);
            })
            $.each(fullRetunnConf, function(k, v){
               fullPrice += +v.discountedFee;
            })
            if (fullPrice > 0 && util.verifyDate('2017-12-1', '2018-01-01')) {
             $('.fullback').show();
              txt = (fullPrice * PERCENTAGE).toFixed(2);
            }
            else {
                txt = 0;
                $('.fullback').hide();
            }
            $fullback.text('￥' + txt);
            //满500送500活动
            var upto500Back500Sum = 0; //满500送500商品金额
            var html = ''; //展示信息
            var $order_fullback = $('#order_fullback');
            upto500Back500List.map(function(v, k) {
                v.discount = (v.TotalPrice / ordertotalprice * discount).toFixed(2);
                v.discountedFee = (v.TotalPrice - v.discount).toFixed(2);
            })
            $.each(upto500Back500List, function(k, v) {
                upto500Back500Sum += +v.discountedFee;
            })
            console.log(upto500Back500Sum)
            var attached = upto500Back500Sum + unReturnedCash; //待满返金额+订单总价
            if (attached >= 300) {
                html = ' <span>已可参与返现300元活动</span><span id="dropdown"><i class="icon icon-right"></i></span>';
            } else if (attached >= 0) {
                var fullback_delta = 300 - attached;
                html = ' <span> 再买<i id="order_delta" >' + fullback_delta.toFixed(2) + '</i>可返' +
                                     '现金300</span><span id="dropdown"><i class="icon icon-right"></i></span>';
            } else {}
            $order_fullback.html(html);
            $('#fb_amount').text(upto500Back500Sum);
            // $('#upto500back').slideDown(400);
        },
        clearGiftInfo: function(){
          /**
           *  使用积分，优惠券，优惠券码要重置赠品信息，让用户重新去选择赠品
          */
          //如果初始赠品不存在，就没有清除赠品信息的必要
           if(!IsExistComplimentary) return  false;
           $('.showGift').slideUp().empty();
           localStorage.removeItem('paramAboutGift');
        }, clearExchangeInfo: function(){
          /**
           *  使用积分，优惠券，优惠券码要重置赠品信息，让用户重新去选择换购商品
          */
             $('.showexchangegood').slideUp().empty();
             OrderDetial.exchangePrice = 0;
             localStorage.removeItem('coudan');
           }

    }
    OrderDetial.init();
    //使用优惠券码
    $(document).on("click", "#use_code", function() {
        if (isIntegralProduct || isdeadline) return //积分商品、限时活动不能使用优惠券码
        if ($(this).attr("data-status") == 'true') {
            $(".code_con").slideDown();
            $(this).attr("data-status", "false");
            $(this).find('.icon').addClass("xunzhuan");
        } else {
            $(".code_con").slideUp();
            $(this).attr("data-status", "true");
            $(this).find('.icon').removeClass("xunzhuan");
        }
    })

    $(document).on("input", "#CouponCode", function() {
        var CouponCode = $(this).val();
        if (CouponCode.trim() != '') {
            $("#code_submit").addClass('active');
            $("#code_submit").attr("data-canuse", 'true');
        } else {
            $("#code_submit").removeClass('active');
            $("#code_submit").attr("data-canuse", 'false');

        }
    })

    //检测优惠券码
    $("#code_submit").click(function() {
        if (isIntegralProduct) return //积分商品不能使用优惠券码
        if ($(this).attr("data-canuse") == 'false') { return };
        var RCouponCode = $('#CouponCode').val();
        if (RCouponCode.trim() == '') {
            m.AlertMessage('优惠券码不能为空!');
            return;
        }

        $.ajax({
            url: m.baseUrl + '/order/ActCouponCodeVerify',
            data: { CouponCode: RCouponCode, OrderSkuList: OrderSkuList },
            type: 'post',
            dataType: 'jsonp',
            jsonp: 'callback',
            async: false,
        }).done(function(ret) {
            if (ret.status == 1) {
                var discountTxt = '';
                var totalPrice = 0;
                var coupon =  ret.data.CanCouponMoney ;
                if(0 == +ret.data.CanCouponMoney) {
                  //优惠券不符合返回值为0，不改变原来状态
                  $("#command_con").slideUp(400);
                  $(".code_con").slideUp();
                  m.AlertMessage('券码暂时不符合使用条件');
                  $('#CouponCode').val('');
                  return;
                };
                if(200 == +ret.data.CouponCodeType){
                  coupon = coupon - 1 < 0 ? (1 - coupon) : coupon;
                  $.each($('.d_order_sumprice'), function(k, v){
                    totalPrice += +$(this).text();
                  })
                  discount = (totalPrice * ret.data.CanCouponMoney).toFixed(2);
                  discountTxt = '满立折活动(' + coupon *10 + ')折' + '￥-' + discount ;
                } else if( 100 == +ret.data.CouponCodeType){
                  //CouponCodeType 其他直减券
                 discount = ret.data.CanCouponMoney;
                 discountTxt =  '满立减活动：'+'￥-' + discount;
                } else {
                  $("#command_con").slideUp(400);
                  $(".code_con").slideUp();
                  m.AlertMessage('券码暂时不符合使用条件');
                  $('#CouponCode').val('');
                  return;
                }
                var couponCodeInfo = {
                  couponCode: RCouponCode,
                  discount: discount,
                  discountTxt: discountTxt
                }
                $('#use_code info r').css('color', '#d72d83');
                // localStorage.setItem('couponCode', RCouponCode);
                window.localStorage.setItem('couponCode', JSON.stringify(couponCodeInfo));
                localStorage.removeItem('couponInfo');
                UseIntegralPrice = 0;
                $("#integral_use").removeClass('true').addClass('false');
                $('.total_all').find('.integral_tag').remove();
                // OrderDetial.saveParamAboutGift('couponCode', RCouponCode);
                $("#coupon").html("￥" + discount);
                $("#command_con").slideUp(400);
                $('#CouponCode').val('');
                $("#usecommand").attr("data-value", "false");
                OrderDetial.UserCouponId = '';
                $('.choose_discount m').html('');
                //$('.choose_discount info r').html('');
                $('#use_code info r').html(discountTxt);
                $(".code_con").slideUp();
                $("#use_code").attr("data-status", "true");
                $("#use_code").find('.icon').removeClass("xunzhuan");
                $('#use_code info').show();
                CouponCode = RCouponCode;
                OrderDetial.getPostFee();
                OrderDetial.totalMoney();
                // OrderDetial.verifyGift();
                OrderDetial.clearExchangeInfo();
                OrderDetial.clearGiftInfo();
                OrderDetial.fullBack();
            } else {

                m.AlertMessage(ret.msg);
                return;
            }
        })

    })

    $("#globalinfo").click(function() {
        cancelBoxIdentity.init();

    })

    //确认去认证
    $(document).on("click", "#promptBox_submit", function() {
        $('#promptBox').html('');
        cancelBoxIdentity.init();
    })

    //提交认证信息
    $(document).on("click", "#cancelBox_submit", function() {
        var RealName = $("#RealName").val();
        var IDNumber = $("#IDNumber").val();
        if (RealName.trim() == '') {
            m.AlertMessage('真实姓名不能为空!');
            return;
        }
        if (!m.checkEnergyCard(IDNumber)) {
            m.AlertMessage('身份信息不合法!');
            return;
        }
        if (IDNumber.trim() == '') {
            m.AlertMessage('证件信息不合法');
            return;
        }
        $.AMUI.progress.start();
        $.ajax({
            url: URL + '/personal/ajaxUserIdentitySave',
            data: { RealName: RealName, IDNumber: IDNumber, IdentityId: IdentityId },
            dataType: 'jsonp',
            jsonp: 'callback',
            type: 'post',
        }).done(function(ret) {
            $.AMUI.progress.done();
            if (ret.status) {
                IsExistUserIdentity = true;
                $('#promptBox').html('');
                UserIdentityInfo.RealName = RealName;
                UserIdentityInfo.IDNumber = IDNumber;
                m.AlertMessage('认证成功,您可以下单了！');
            } else {
                m.AlertMessage(ret.msg);
            }
        })

    })


    // 使用积分
    $("#useIntegral").click(function() {

        if (userIntegral < tmpTotalIntegral) {
            m.AlertMessage('积分不足，需原价购买');
            return false;
        } else if (!IsIntegralmallUse) {
            m.AlertMessage('等级不足，需原价购买');
            return false;
        }
        var tPrice = 0;
        var useBtn = $('.use-integral-button');
        if (useBtn.attr('data-use-integral') == 'false') {
            useBtn.attr('data-use-integral', 'true');
            $(this).removeClass('false')
            $(this).addClass('true');
            $('#IuseIntegral').html(tmpTotalIntegral);
            $('.total_all span').html(tmpTotalIntegralOrderPrice.toFixed(2));
            tPrice = tmpTotalIntegralOrderPrice;
            $('.isShow').show();
        } else {
            useBtn.attr('data-use-integral', 'false');
            $(this).removeClass('true');
            $(this).addClass('false');
            $('#IuseIntegral').html(0);
            $('.total_all span').html(tmpTotalOrderPrice.toFixed(2));
            tPrice = tmpTotalOrderPrice
            $('.isShow').hide();
        }
        OrderDetial.getPostFee();
        util.saveParamAboutGift('IsUseIntegral', true);
        // OrderDetial.verifyGift();
        localStorage.setItem('IsUseIntegral', true)
        OrderDetial.clearGiftInfo();
        OrderDetial.clearExchangeInfo();
        OrderDetial.fullBack(tPrice);
    })




    //非积分商城的积分使用
    $("#integral_use").click(function() {
        if ($(this).hasClass('true')) {
            $(this).removeClass('true').addClass('false');
            UseIntegralPrice = 0;
            $('.total_all').find(".integral_tag").remove();

        } else {
            var totalPri = canUseIntegralPrice ;
            if(userIntegral<1000 || totalPri<20 ){return;}
            //如果用户使用了优惠券，判断此优惠券是否满足优惠要求
            if(OrderDetial.UserCouponId && OrderDetial.UserCouponId!='' && OrderDetial.UserCouponId!=0){
                OrderDetial.UserCouponId = '';    localStorage.removeItem('couponInfo'); discount = 0;
                $('.choose_discount m').html('');
                OrderDetial.clearExchangeInfo();
            }
            //如果用户使用了优惠券码，判断此优惠券是否满足优惠要求
            if(CouponCode && CouponCode!='' && CouponCode!=0){
                CouponCode = '';
                discount = 0;
                localStorage.removeItem('couponCode');
                $("#coupon").html("￥" + 0);
                $('#use_code info r').html('');
                $("#CouponCode").val('');
                OrderDetial.clearExchangeInfo();
            }

            $(this).removeClass('false').addClass('true');
            if(userIntegral > canUseIntegralPrice *100){
                UseIntegralPrice = canUseIntegralPrice;
            }else{
                UseIntegralPrice = userIntegral/100;
            }
            var a = "<i  class='integral_tag'> + <i >"+(UseIntegralPrice*100).toFixed(0)+"</i>积分</i>";
            $('.total_all').append(a);

        }
        OrderDetial.getPostFee();
        OrderDetial.clearGiftInfo();
        OrderDetial.totalMoney();
        OrderDetial.fullBack();
    })



    var nexttype = 0;
    function timer(){
        var nowtime = Date.parse(new Date());
        $(".activity_time").each(function(){
            var  starttime = m.substrTime($(this).attr('data-starttime'));
            var  endtime = m.substrTime($(this).attr('data-endtime'));
            if(nowtime<starttime){
                 var ts =  starttime - nowtime;//计算剩余的毫秒数
             }else if(nowtime<endtime){
                 var ts =  endtime - nowtime;//计算剩余的毫秒数
             }
            var hh = parseInt(ts / 1000 / 60 / 60 , 10);//计算剩余的小时数
            var mm = parseInt(ts / 1000 / 60 % 60, 10);//计算剩余的分钟数
            var ss = parseInt(ts / 1000 % 60, 10);//计算剩余的秒数
            if(hh <= 0 && mm <= 0 && ss <0){
                clearInterval(log);
                return false;
            }
            hh = checkTime(hh);
            mm = checkTime(mm);
            ss = checkTime(ss);
            if(nowtime<starttime){
                nexttype = 2;
                $(this).html('距离活动开始 '+hh+'</span>:<span  class="act_time">'+mm+'</span>:<span  class="act_time">'+ss)
            }else if(nowtime<endtime){
                if(nexttype == 2){
                    orderinfoinit();
                }
                nexttype = 3;
                $(this).html('距离活动结束 '+hh+'</span>:<span  class="act_time">'+mm+'</span>:<span  class="act_time">'+ss)
            } else{
                if(nexttype == 3){
                    m.back();
                }
                clearInterval(log);
                $(this).html('活动已结束 ')
            }
        })
    }
    function checkTime(i){
        if (i < 10) {
            i = "0" + i;
        }else{
            i = "" + i;
        }
        return (i);
    }


    //抢购活动  初始化  优惠券 ，运费，优惠券码，优惠券
    function  orderinfoinit(){
            //如果用户使用了优惠券，判断此优惠券是否满足优惠要求
            if(OrderDetial.UserCouponId && OrderDetial.UserCouponId!='' && OrderDetial.UserCouponId!=0){
                    localStorage.removeItem('couponInfo');
            }
            //如果用户使用了优惠券码，判断此优惠券是否满足优惠要求
            if(CouponCode && CouponCode!='' && CouponCode!=0){
                CouponCode = ''; discount = 0;
                localStorage.removeItem('couponCode');
                $("#coupon").html("￥" + 0);
                $('#use_code info r').html('');
                $("#CouponCode").val('');
            }
            $("#integral_use").removeClass('true').addClass('false');
            $('.total_all').find('.integral_tag').remove();
            ordertotalprice = 0; UseIntegralPrice = 0;
            OrderDetial.clearExchangeInfo();
            OrderDetial.clearGiftInfo();
            OrderDetial.fullBack();
            setTimeout(function(){
                OrderDetial.getList();
            },200)

    }


    $(".ikonw").click(function(){
        $(".integral_alert").fadeOut();
    })

    $(".iwantkonw").click(function(){
        $(".integral_alert").fadeIn();
    })




    // 复星活动


    //复星优惠券使用
    $("#fusuncou_use").click(function(){
        if($(this).hasClass('icon-nochoice')){
            OrderDetial.UserCouponId = BitCouponId; discount = BitDiscount;
            $(this).removeClass('icon-nochoice').addClass('icon-choice');
        }else{
             OrderDetial.UserCouponId = ''; discount = 0;
            $(this).removeClass('icon-choice').addClass('icon-nochoice');
        }
        OrderDetial.clearExchangeInfo();
        OrderDetial.getPostFee();
        OrderDetial.clearGiftInfo();
        OrderDetial.totalMoney();
        OrderDetial.fullBack();
    })

    //查看满500送500活动规则,纯dom操作
    function getfullback(src, target){
      $('#' + src).click(function(){
        $('#' + target).slideToggle(400)
        $(this).find('.icon').toggleClass('icon-right icon-bottom');
      })
    }
    getfullback('dropdown', 'upto500back');

})

