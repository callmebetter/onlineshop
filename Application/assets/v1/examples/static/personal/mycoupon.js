define(function(require) {
  var main = require('/assets/v1/examples/modules/main.js?v=1.1');
  var m = new main();
  var type = 'Unused';
  var PageSize = 10;
  var canchange = true;
  var type = $_GET['coupontype'] ? $_GET['coupontype'] : type;
  var param = {
    'Unused': {
      PageNo: 1,
      isopen: true,
      CouponStatus: 100,
    },
    'Used': {
      PageNo: 1,
      isopen: true,
      CouponStatus: 200,
    },
    'Expired': {
      PageNo: 1,
      isopen: true,
      CouponStatus: 300,
    },
  }

  //获取优惠
  function getcouponlist() {
    canchange = false;
    $.AMUI.progress.start();
    $.ajax({
      url: m.baseUrl + '/personal/GetCouponList',
      type: 'post',
      data: { PageNo: param[type].PageNo, PageSize: PageSize, Type: type, CouponStatus: param[type].CouponStatus },
      dataType: 'jsonp',
      jsonp: 'callback'
    }).done(function(ret) {
      canchange = true;
      $.AMUI.progress.done();
      if (ret.status) {
        if (ret.data.Models && ret.data.Models.length > 0) {
          console.log(ret.data);
          var html = '';
          $.each(ret.data.Models, function(k, v) {
            // html += '<li>'
            // if (v.CouponStatus == 200 || v.CouponStatus == 300) {
            //   html += '<div class="active_info" style="background:#999;">'
            // } else {
            //   html += '<div class="active_info">'
            // }
            // html += '<div style="padding-top:14px;">\
            //              <div class="active_price">'
            // if (v.CouponType == 100) {
            //   html += '<p>' + v.FacePrice * 10 + '</p>'
            // } else {
            //   html += '<p>' + v.FacePrice + '</p>'
            // }
            // html += ' <div class="full">\
            //            <p>满' + v.FullPrice + '元使用</p>'
            // if (v.CouponType == 100) {
            //   html += '<p>折 折扣劵</p>'
            // } else {
            //   html += '<p>元 现金券</p>'
            // }
            // html += '</div>\
            //            </div>'
            // if (v.Description) {
            //   html += '<div style="font-size:11px;">\
            //               <span>使用说明：' + v.Description + '</span>\
            //                  </div>'
            // }
            // html += '<div class="active_num">\
            //            <span>有效期至：' + m.formatTimeAll(v.ExpireDate) + '</span>\
            //               </div>\
            //                 </div>'
            // if (v.CouponStatus == 100) {
            //   if (v.ActCouponLink) {
            //     html += ' <p class="nowUse skips" style="width:120px;" data-src="' + v.ActCouponLink + '">立即使用</p>'
            //   } else {
            //     html += ' <p class="nowUse skips" style="width:120px;" data-src="/site/index"  >立即使用</p>'
            //   }
            // } else if (v.CouponStatus == 200) {
            //   html += ' <p class="nowUse" >已使用</p>'
            // } else {
            //   html += ' <p class="nowUse" >已过期</p>'
            // }
            // html += ' <span class="circle_left"></span>\
            //                <span class="circle_right"></span>\
            //                  </div>\
            //
            var cls = '',
                faceValue,
                couponTypeName = '',
                dataSrc = '',
                useTxt,
                prefix = '',
                expireDate = '',
                cover = '',
                fullPrice ,
                caption = '',
                lineGap='',
                linkClass = '',
                suffix = '';
            if (v.CouponStatus == 200 || v.CouponStatus == 300){
              //优惠券过期 颜色
              cls = 'expire';
            }
            if (v.CouponType == 100){
              //折扣券 v.FacePrice * 10  折 折扣劵
              // 否则现金券 v.FacePrice   元 现金券
              faceValue = v.FacePrice * 10  ;
              couponTypeName = '折 折扣劵';
              suffix = '折';
            } else {
                prefix = '￥';
                faceValue = v.FacePrice;
                couponTypeName = '元 现金券';
            }
            if (v.Description){}
            if (v.CouponStatus == 100) {
               if (v.ActCouponLink){
                  dataSrc = v.ActCouponLink;
               } else{
                  dataSrc = '/site/index';
               }
               useTxt = '立即使用';
               linkClass = 'com-link';
            } else if(v.CouponStatus == 200) {
                useTxt = '已使用'
            } else {
              useTxt = '已过期'
            }
          expireDate =  m.formatYmd(v.ExpireDate) ;

          cover  = v.ProductScopeName;
          fullPrice = v.FullPrice;
          if(v.HotBrandName) {
            caption = v.HotBrandName;
            lineGap = '|';
          }
          html += `
             <li class="coupon-item ${cls}">
            <div class="tit">
              <span> ${cover} <i class="line-gap">${lineGap}</i>${caption}<i></i></span>
              <span class="${linkClass}" data-src="${dataSrc}">${useTxt}</span>
            </div>
            <div class="mid">
            </div>
            <div class="outline">
              <div class="clearfix ppgprice">
                <p class=" price">${prefix}
                  <span>${faceValue}</span>${suffix}
                  <span class="full">「满￥${fullPrice}元使用」</span>
                </p>
              </div>
              <div class="active_num">
                <span>有效期至：${expireDate}</span>
              </div>
            </div>
            <span class="half-circle circle-left"></span>
            <span class="half-circle circle-right"></span>
            <div class="dash"></div>
            <div class="pic"></div>
          </li>`
          })
          $("#coupon_" + type).append(html);
          param[type].PageNo++;
          param[type].isopen = true;
          couponlist.changeHeight("#coupon_" + type);
        }
        m.histauto("暂无优惠信息", 'icon-dingdanxinxi', "#coupon_" + type);
      }
    })
  }

  //下拉加载
  $(window).scroll(function() {
    if ($(this).scrollTop() + $(window).height() + 50 >= $(document).height() && $(this).scrollTop() > 100) {
      if (param[type].isopen) {
        param[type].isopen = false;
        getcouponlist();
      }
    }
  })

  //初始化页面
  var couponlist = {
    scW: $(window).width(),
    hei: $(window).height(),
    numLi: $('.coupon_list #wrapper ul li').length,
    setscrollers: function() {
      $('.coupon_list .cont').css({ 'width': this.scW })
      $('.coupon_list .cont > div').css({ 'width': this.numLi * this.scW })
      $('.coupon_list .cont > div > div').css({ 'width': this.scW, "min-height": this.hei - 85 });
    },
    init: function() {
        this.bindEvent();
        this.setscrollers();
    },
    //tab切换
    bindEvent: function() {
      $('.coupon_list #wrapper ul li').click(function() {
        if (!canchange) { return }
        var index = $(this).index();
        type = $(this).attr('type');
        $(this).addClass('or_active');
        $(this).siblings().removeClass('or_active');
        var leftOffset = $(this).position().left;
        $('.coupon_list #wrapper ul span').animate({
          'left': leftOffset + couponlist.scW*0.04,
        }, 300)
        $('.coupon_list .cont > div').animate({
          'left': -couponlist.scW * index,
        }, 300)
        var urls = window.location.pathname;
        url = urls + "?coupontype=" + type;
        history.pushState(null, null, url);
        if ($("#coupon_" + type).text().trim() == '') {
          getcouponlist();
        } else {
          couponlist.changeHeight("#coupon_" + type);
        }
      })
    },
    scrollTop: function() {
      $('body,html').scrollTop(0)
    },
    changeHeight: function(id) {
      var contentHeight = $(id).height();
      if (contentHeight < (couponlist.hei - 90)) {
        contentHeight = couponlist.hei - 90;
      }
      $('.coupon_list .cont').css({ height: contentHeight });
      $('.coupon_list .cont ').css({ height: contentHeight });
    },
  }
  couponlist.init();
  $("#thelist li").each(function() {
    if (type == $(this).attr("type")) {
      $(this).trigger('click');
    }
  })
})
