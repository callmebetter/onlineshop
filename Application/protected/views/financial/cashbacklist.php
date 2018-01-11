<script>
;
(function() { $('meta[name="viewport"]').remove(); }())

</script>
<script src="/assets/v2/js/flexible.js"></script>
<style>
#head_tit {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  position: fixed;
  height: 1.1133rem;
  line-height: 1.1133rem;
}

#head_tit .head_tit_left {
  font-size: 0.40rem;
  padding: 0;
  width: 1.1133rem;
  text-align: center;
}

#head_tit .head_tit_center {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  height: 1.1133rem;
  line-height: 1.1133rem;
  font-size: 0.45rem;
}

#head_tit .head_tit_right {
  font-size: 0.45rem;
  padding: 0;
  width: 1.1133rem;
  text-align: center;
}

#head_tit .head_tit_right span {
  font-size: 0.38rem;
}

.HT_45 {
  height: 1.1133rem;
}

.goto_top {
  display: none;
  position: fixed;
  bottom: 1.0667rem;
  right: .32rem;
  width: 1.0667rem;
  height: 1.0667rem;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEoAAABKCAMAAAArDjJDAAAA0lBMVEX///8AAAAEBAQAAAD6+voFBQbf4OKGiJOsrrW1triDhYgNDQ2DhYjn6OjIycra29vi4+ODhYh2d3oAAAC6u7y/wMOBg4aAgoWWmJqcnaaeoKKsra+ztLa7vL+AgoWChIeAgoWAgoV6fH99f4FXWFplZ2m+v8GDhYjz8/PDxMV9f4GAgoVwcXRBQkNtb3I2Nzi3uLrd3t9/gYSChIdKTE1GR0l6fH93eXx/gYRydHdvcXN8foFmZ2p1d3lMTU8mJifq6+uBg4Z9f4J8foCBg46EhomFSlKbAAAARHRSTlPmAAUN6Ajs/vb1+RX06/Ht7O95EfTz2b77+fn39fPPy8icnHA4GvPq6PKflS4oJSL07cO6Egukh3d2alxNQi8c6qyygT6QzDQAAAM2SURBVFjDrdjncrJAFAbgky1+YQELir333ntL0/u/pQ9Dko0aWGB9x5/OM+gcZs574Mkli0OtMku2tPNZayVnldph4fZtRwr11zMtmw9H9DYBIG09Es5ntdm6j3xSjVopnYgQuAmJJNKlWsMHNawwJQoOiSqsMvRINSqsQ8AlpMMqDQ8UWseaBAQhprZGImpYUl7BQ16V0tCVQrtYBzymE9shZwr1chHwnEmuR52oxZtCwEeI8rb4m5qnxuAz49T8L2qRSoDvJKbze4q+jQECWDN6S6GeAoGi9NA1hXY5EowiuR26ovpaCAImqvV/U7QUhsAJlyinUC0PEsnX0A/ViOkylB5rfFOo0gSpNCvoixoyIkcRNrQp1DPhOpmTIBm4jtlDn1SDEVmKsMaFQjXhnGcywpmvIYuipSi45/l0ehbNqTVbgPppsSS20n0E6KMgkv6drI/AKnwgoOWQSAqdTiGRFSpTmDMikuB0ApFF2BwOWaF0oYRW9gCGIpJsSmQpBnTDAsmmhFa4C6mIQLIpoRVJQVIXSDYltPQktNoCyaaEVrsFGnGROCW0iAZnh+m1JU5xy+HtODtRpi1xilumE6W5DTunhCEa/9slqXaLD4MkpSetEZWk+Ih2w5IUf3EMRZLir/M++xgquweVkUdQhKmAy6FHUKEyBrwqPIIqrDDQevoRVLpOAeFiVJ6KFjGyKEORpxTDop7oiBFZirARvawfuGrKUmYVI4t6okdG5CjCjtRe1XC3KbcUNbsY2QskHciutQP6vdbijdyyvcHoe9mmalGmAhRVyisArmvR4MWkjtGvYoK3wevSFvNicrHi1aAlrhqn1yWOqu+BquX4XaXoplril2mgwvuCebX8sUblhG+pPLIkTvHnSvk9DqQ+n4lT3FKruYmfk0VV/ZI4xa2t5v2Qom25dH9IofF6Ma97gfR8sR6nyOW8Q7G68XJ0asY2KuYSp65+ZHywZCZxhUy2HMQxhzh192DHqvuBrnrkj+RAcWxgFNOFyf3ZcFJIF40Bh5wpjsXV+qrMsop9zCTkVY+ElSwrr+pq3IaEFMcsbbQ3ltPLiZXFksnp0tiPLIdDN/kPpkhloZKaE0EAAAAASUVORK5CYII=);
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: 100%;
  z-index: 99;
  -webkit-tap-highlight-color: transparent;
}

.clearfix::after {
  display: table;
  content: '';
}
.container {
  background-color: #fff
}
.layout {
  display: block;
}

.balance {
  height: 1.3333rem;
  line-height: 1.3333rem;
  text-align: center;
  font-size: .3733rem;
}

.balance .basebalance {
  width: 50%;
  border-right: 1px solid #fff;
  background-color: #ededed;
  box-sizing: border-box;
  height: 100%;
  text-overflow: ellipsis;
  overflow:hidden;
  white-space: nowrap;
}

.balance .cashback {
  width: 50%;
  border-left: 1px solid #fff;
  background-color: #ededed;
  box-sizing: border-box;
  height: 100%;
  text-overflow: ellipsis;
  overflow:hidden;
  white-space: nowrap;
}

.cashback_wrap {
  margin-top: .32rem;
}

.tab {
  height: 1.0667rem;
  line-height: 1.0667rem;
  overflow: hidden;
}

.tab>ul {
  border-top: 1px solid #e1e1e1;
  width: 13.3333rem;
  height: 100%;
  color: #333;
  font-size: .4rem;
  padding-left: 4.2933rem;
  -webkit-transition-property: -webkit-transform;
  transition-property: -webkit-transform;
  -o-transition-property: transform;
  transition-property: transform;
  transition-property: transform, -webkit-transform;
  -webkit-transition-timing-function: ease-out;
  -o-transition-timing-function: ease-out;
  transition-timing-function: ease-out;
  /*-webkit-transition-timing-function: .2s;*/
  /*transition-timing-function: .2s;*/
}

.tab>ul>li {
  width: 3.7333rem;
}

#cashback_wrap .content {
  overflow: hidden;
  width: 100%;
  color: #111;
  font-size: .3733rem;
}

.content .inner {
  width: 200%;
}

.content .inner>ul {
  float: left;
  width: 50%;
  border-bottom: 1px solid #e1e1e1;
}

.content .inner>ul>li .list-item {
  border: 1px solid #e1e1e1;
  border-bottom-width: 0;
  height: 1.0667rem;
  line-height: 1.0667rem;
}

.content .inner>ul>li .list-item::after {
  display: table;
  content: '';
}

.content .inner>ul>li .list-item>div:first-child {
  float: left;
  width: 1.6533rem;
  border-right: 1px solid #e1e1e1;
  text-align: center;
}

.content .inner>ul>li .list-item>div:nth-child(2) {
  overflow: hidden;
  padding: 0 .4rem;
}

.content .inner>ul>li .list-item>div:nth-child(2)>span:nth-child(1) {
  float: left;
}

.content .inner>ul>li .list-item>div:nth-child(2)>span:nth-child(2) {
  float: right;
  color: #999
}

.content .inner>ul>li .list-item>div:nth-child(2)>span:nth-child(2) i {
  margin-left: .2667rem;
  display: inline-block;
}



/*展开后的内容*/

.inner {
  -webkit-transition-property: -webkit-transform;
  transition-property: -webkit-transform;
  -o-transition-property: transform;
  transition-property: transform;
  transition-property: transform, -webkit-transform;
  -webkit-transition-timing-function: ease-out;
  -o-transition-timing-function: ease-out;
  transition-timing-function: ease-out;
  /*-webkit-transition-timing-function: .2s;*/
  /*transition-timing-function: .2s;*/
  /*background-color: #999*/
}
.inner>ul{
  /*background-color: gold;*/
}
.inner>ul>li>ul {
  display: none;
  border-top: 1px solid #e1e1e1;
  font-size: .32rem;
}

.inner>ul>li>ul>li {
  height: 1.0667rem;
  line-height: 1.0667rem;
}

.inner>ul>li>ul>li>div:first-child {
  float: left;
  width: 1.6533rem;
  text-align: center;
}

.inner>ul>li>ul>li>div:nth-child(2) {
  overflow: hidden;
  padding-right: .4rem;
}

.inner>ul>li>ul>li>div:nth-child(2)>span:nth-child(1) {
  float: left;
}

.inner>ul>li>ul>li>div:nth-child(2)>span:nth-child(2) {
  float: right;
  color: #999;
}


/*箭头展开*/

.expand {
  transform: rotate(90deg);
  transition: transform .2s;
}
.hidden {
  display: none;
}
.p_Blankpages {
    margin-top: 10%;
    width: 50%;
    float: left;
    /*background-color: #38f*/
  }
.p_Blankpages2 {
  width: 3.2rem;
  margin: 0 auto;
}
.p_blank_ico {
  border:1px solid #E5DFE1;
  height: 3.2rem;
  width: 3.2rem;
  border-radius: 3.2rem;
  text-align: center;
  line-height: 4rem;
  font-size:1.4667rem;
  color:#fff;
}
.p_blank_hist {
  color: #666666;
  font-size: .3733rem;
  margin-top: .6667rem;
  text-align: center;
}
.p_blank_ico > span{
  color:#cccccc;
  margin-left: .0533rem;
  vertical-align: .3467rem;
}
</style>
<header id="head_tit">
  <div class="head_tit_left back">
    <span class="icon-left"></span>
  </div>
  <div class="head_tit_center">返现明细</div>
  <div class="head_tit_right ">
    <span class="skips" data-src="/financial/cashbackhelp" style="color:#d72d83">规则</span>
  </div>
</header>
<div class="HT_45"></div>
<div class="container hidden" id="container">
  <article class="layout">
    <div class="balance clearfix">
      <p class="basebalance fl">待返现金额：￥ <span> 599</span></p>
      <p class="cashback fl">已返现金额：￥ <span> 599</span> </p>
    </div>
  </article>
  <article class="cashback_wrap" id="cashback_wrap">
    <section class=" " id="record">
      <div class="tab">
        <ul class="clearfix">
          <li class="fl" data-year="2018">2018年</li>
          <li class="fl" data-year="2019">2019年</li>
        </ul>
      </div>
      <div class="content clearfix">
        <div class="inner" id="fullbackdetail">

        </div>
      </div>
    </section>
  </article>
</div>
<div class="goto_top"></div>
<script type="text/template">
   <!--   <ul>
            <li>
              <div class="list-item">
                <div>1月</div>
                <div><span>￥58.9</span><span>已返现 <i class="icon icon-right"></i></span></div>
              </div>
              <ul>
                <li>
                  <div>3-12</div>
                  <div>
                    <span> 返现编号：1092875390 ￥41.62 3/12</span>
                    <span>已返现</span>
                  </div>
                </li>
                <li>
                  <div>3-24</div>
                  <div>
                    <span> 返现编号：1092875390 ￥41.62 3/12</span>
                    <span>已返现</span>
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <div class="list-item">
                <div>1月</div>
                <div><span>￥58.9</span><span>已返现 <i class="icon icon-right"></i></span></div>
              </div>
              <ul>
                <li>
                  <div>3-12</div>
                  <div>
                    <span> 返现编号：1092875390 ￥41.62 3/12</span>
                    <span>已返现</span>
                  </div>
                </li>
                <li>
                  <div>3-24</div>
                  <div>
                    <span> 返现编号：1092875390 ￥41.62 3/12</span>
                    <span>已返现</span>
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <div class="list-item">
                <div>1月</div>
                <div><span>￥58.9</span><span>已返现 <i class="icon icon-right"></i></span></div>
              </div>
              <ul>
                <li>
                  <div>3-12</div>
                  <div>
                    <span> 返现编号：1092875390 ￥41.62 3/12</span>
                    <span>已返现</span>
                  </div>
                </li>
                <li>
                  <div>3-24</div>
                  <div>
                    <span> 返现编号：1092875390 ￥41.62 3/12</span>
                    <span>已返现</span>
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <div class="list-item">
                <div>1月</div>
                <div><span>￥58.9</span><span>已返现 <i class="icon icon-right"></i></span></div>
              </div>
              <ul>
                <li>
                  <div>3-12</div>
                  <div>
                    <span> 返现编号：1092875390 ￥41.62 3/12</span>
                    <span>已返现</span>
                  </div>
                </li>
                <li>
                  <div>3-24</div>
                  <div>
                    <span> 返现编号：1092875390 ￥41.62 3/12</span>
                    <span>已返现</span>
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <div class="list-item">
                <div>1月</div>
                <div><span>￥58.9</span><span>已返现 <i class="icon icon-right"></i></span></div>
              </div>
              <ul>
                <li>
                  <div>3-12</div>
                  <div>
                    <span> 返现编号：1092875390 ￥41.62 3/12</span>
                    <span>已返现</span>
                  </div>
                </li>
                <li>
                  <div>3-24</div>
                  <div>
                    <span> 返现编号：1092875390 ￥41.62 3/12</span>
                    <span>已返现</span>
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <div class="list-item">
                <div>1月</div>
                <div><span>￥58.9</span><span>已返现 <i class="icon icon-right"></i></span></div>
              </div>
              <ul>
                <li>
                  <div>3-12</div>
                  <div>
                    <span> 返现编号：1092875390 ￥41.62 3/12</span>
                    <span>已返现</span>
                  </div>
                </li>
                <li>
                  <div>3-24</div>
                  <div>
                    <span> 返现编号：1092875390 ￥41.62 3/12</span>
                    <span>已返现</span>
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <div class="list-item">
                <div>1月</div>
                <div><span>￥58.9</span><span>已返现 <i class="icon icon-right"></i></span></div>
              </div>
              <ul>
                <li>
                  <div>3-12</div>
                  <div>
                    <span> 返现编号：1092875390 ￥41.62 3/12</span>
                    <span>已返现</span>
                  </div>
                </li>
                <li>
                  <div>3-24</div>
                  <div>
                    <span> 返现编号：1092875390 ￥41.62 3/12</span>
                    <span>已返现</span>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
          <ul>
            <li>
              <div class="list-item">
                <div>1月</div>
                <div><span>￥58.9</span><span>已返现 <i class="icon icon-right"></i></span></div>
              </div>
              <ul>
                <li>
                  <div>3-12</div>
                  <div>
                    <span> 返现编号：1092875390 ￥41.62 3/12</span>
                    <span>已返现</span>
                  </div>
                </li>
                <li>
                  <div>3-24</div>
                  <div>
                    <span> 返现编号：1092875390 ￥41.62 3/12</span>
                    <span>已返现</span>
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <div class="list-item">
                <div>1月</div>
                <div><span>￥58.9</span><span>已返现 <i class="icon icon-right"></i></span></div>
              </div>
              <ul>
                <li>
                  <div>3-12</div>
                  <div>
                    <span> 返现编号：1092875390 ￥41.62 3/12</span>
                    <span>已返现</span>
                  </div>
                </li>
                <li>
                  <div>3-24</div>
                  <div>
                    <span> 返现编号：1092875390 ￥41.62 3/12</span>
                    <span>已返现</span>
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <div class="list-item">
                <div>1月</div>
                <div><span>￥58.9</span><span>已返现 <i class="icon icon-right"></i></span></div>
              </div>
              <ul>
                <li>
                  <div>3-12</div>
                  <div>
                    <span> 返现编号：1092875390 ￥41.62 3/12</span>
                    <span>已返现</span>
                  </div>
                </li>
                <li>
                  <div>3-24</div>
                  <div>
                    <span> 返现编号：1092875390 ￥41.62 3/12</span>
                    <span>已返现</span>
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <div class="list-item">
                <div>1月</div>
                <div><span>￥58.9</span><span>已返现 <i class="icon icon-right"></i></span></div>
              </div>
              <ul>
                <li>
                  <div>3-12</div>
                  <div>
                    <span> 返现编号：1092875390 ￥41.62 3/12</span>
                    <span>已返现</span>
                  </div>
                </li>
                <li>
                  <div>3-24</div>
                  <div>
                    <span> 返现编号：1092875390 ￥41.62 3/12</span>
                    <span>已返现</span>
                  </div>
                </li>
              </ul>
            </li>
          </ul> -->
</script>
<script>
seajs.config({
  base: '/assets/v2/js/finance/'
});
seajs.use('cashbacklist');

</script>
