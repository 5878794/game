/*
 * Filename : 
 * =====================================
 * Created with WebStorm.
 * User: bens
 * Date: 14-9-27
 * Time: 下午9:01
 * Email:5878794@qq.com
 * =====================================
 * Desc:
 */


//创建元素
//sheep = new ELEMENT({
//    width:width,              //@param:number     必须          元素宽、高
//    height:height,            //@param:number     必须
//    x:left,                   //@param:number     必须          元素坐标
//    y:top,                    //@param:number     必须
//    resource:resource,        //@param:obj        必须     　    元素资源　　<img />对象  或颜色值（画矩形）
//    canvas:this.canvas,       //@param:obj        必须          元素需要展现到的画布对象　　<canvas />
//    deg:0                     //@param:number     默认:0        元素旋转的角度
//    alpha:100                 //@param:number     默认:100      元素的透明度　　(0-100)
//    touchResource:res         //@param:obj        默认：无       元素点击时的资源图　　　<img />
//    clickFn:function          //@param:fn         默认：无       元素点击时执行的函数
//    flipHorizontal:false      //@param:bloom      默认：false   　元素是否水平翻转
//    flipVertical:false        //@param:bloom      默认：false    元素是否垂直翻转（水平或垂直翻转只能选一个执行）
//    canPlayResList:false      //@param:bloom      默认：false    是否播放元素的资源队列(需要playResList接口添加，添加后该参数自动变为ｔｒｕｅ)
//});


//元素开始动画（可以一次注册多个）
//sheep.animate(
//      {                               //动画的属性
//          width:width,                    //@param:number                     变换宽、高
//          height:height,
//          x:x,                            //@param:number                     变换坐标
//          y:y,
//          deg:deg,                        //@param:number                     旋转的角度
//          alpha:alpha,                    //@param:number                     元素的透明度变化
//          loop:loop,                      //@param:bloom（默认：ｆａｌｓｅ）      动画完成是否重复
//          flip:flip,                      //@param:bloom （默认：ｆａｌｓｅ）     动画完成后是否反转动画到原点
//          runEndFlipHorizontal:false,     //@param:bloom（默认：ｆａｌｓｅ）    　动画完成后是否水平翻转资源（水平或垂直翻转只能选一个执行）
//          runEndFlipVertical:false,       //@param:bloom（默认：ｆａｌｓｅ）      动画完成后是否垂直翻转资源
//
//      },
//      time,                           //@param:number   动画执行的时间（单位毫秒）
//      delay,                          //@param:number   动画延迟好多毫秒执行
//      callback                        //@param:fn       动画执行完成后调用的函数
// );


//元素自身资源图片切换(实现一些走路，等的动画)，执行后自动将　canPlayResList　设置为ｔｕｒｅ开始切换资源播放
//sheep.playResList(
//      res,                            //@param:array                  动画的资源图片数组，本身资源图片放在第一个
//      frame,                          //@param:number(默认１)          资源图片的切换速度（多少帧切换一次）（１秒６０帧）
//      loop,                           //@param:bloom（默认ｆａｌｓｅ）    资源是否重复播放
//      callback                        //@param:fn                     ｌｏｏｐ=true时无效，资源播放完一次后执行
// );



var ELEMENT = function(opt){
    this.width = opt.width;
    this.height = opt.height;
    this.x = opt.x || 0;
    this.y = opt.y || 0;
    this.resource = opt.resource;
    this.touchResource = opt.touchResource; //点击时的资源图
    this.clickFn = opt.clickFn || false;
    this.touchStartFn = opt.touchStartFn || function(){};     //按下时执行

    this.centerX = (opt.centerX || opt.centerX == 0)? opt.centerX : null;
    this.centerY = (opt.centerY || opt.centerY == 0)? opt.centerY : null;


//    this.resourceNumber = opt.resourceNumber;
    this.deg = opt.deg || 0;
    this.alpha = (!opt.alpha && opt.alpha!=0)? 100 : opt.alpha;

    this.canvas = opt.canvas;
    this.ctx = this.canvas.getContext("2d");

    this.clickState = false;            //是否被按下状态
    this.flipHorizontal = opt.flipHorizontal || false;   //水平翻转
    this.flipVertical = opt.flipVertical || false;     //垂直翻转


    this.resList = [];      //自身资源切换数组
    this.resFrame = 1;      //多少帧切换一次资源图片
    this.resFrameCount = 0; //帧　数统计
    this.nowRes = -1;       //当前资源切换到第几张
    this.canPlayResList = false;    //是否执行资源切换
    this.playResLoop = false;       //是否反复执行资源切换，ｔｒｕｅ时  playrescallback不会执行
    this.playResCallback = function(){};        //动画执行完一次后的回调


    this.list = [];         //动画队列

};

ELEMENT.prototype = {
    //增加动画队列
    animate:function(opt,time,delay,callback){
        delay = delay || 0;
        time = time || 1000;
        var _this = this;




        setTimeout(function(){
            var start_time = new Date().getTime();

            _this.list.push({
                startTime : start_time,
                endTime : start_time + time,
                time: time,

                e_x:(opt.x == 0 || opt.x)? opt.x : _this.x,
                e_y:(opt.y == 0 || opt.y)? opt.y : _this.y,
                s_x:_this.x,
                s_y:_this.y,

                e_w:(opt.width == 0 || opt.width)? opt.width : _this.width,
                e_h:(opt.height == 0 || opt.height)? opt.height : _this.height,
                s_w:_this.width,
                s_h:_this.height,

                e_deg:(opt.deg == 0 || opt.deg)? opt.deg : _this.deg,
                s_deg:_this.deg,

                e_alpha:(opt.alpha == 0 || opt.alpha)? opt.alpha : _this.alpha,
                s_alpha:_this.alpha,

                loop:opt.loop || false,
                flip:opt.flip || false,
                runEndFlipHorizontal:opt.runEndFlipHorizontal || false,
                runEndFlipVertical: opt.runEndFlipVertical || false,
                callback:callback || function(){}
            })
        },delay);




    },
    //获取当前参数
    getParam:function(){
        this.clearList();

        var now_time = new Date().getTime(),
            data = this.list;

        for(var i= 0,l=data.length;i<l;i++){
            var this_data = data[i];

            //是否未到动画时间
            if(now_time < this_data.startTime){
                continue;
            }

            var m_t = this_data.time,

                //需要变动的总量
                m_x = this_data.e_x - this_data.s_x,    //x
                m_y = this_data.e_y - this_data.s_y,    //y

                m_w = this_data.e_w - this_data.s_w,    //width
                m_h = this_data.e_h - this_data.s_h,    //height

                m_deg = this_data.e_deg - this_data.s_deg,  //rotate deg

                m_alpha = this_data.e_alpha - this_data.s_alpha, //alpha

                //过去的时间
                u_t = now_time - this_data.startTime;

            if(m_x !=0){
                this.x = this_data.s_x + (m_x/m_t)*u_t;
            }
            if(m_y !=0){
                this.y = this_data.s_y + (m_y/m_t)*u_t;
            }
            if(m_w !=0){
                this.width = this_data.s_w + (m_w/m_t)*u_t;
            }
            if(m_h !=0){
                this.height = this_data.s_h + (m_h/m_t)*u_t;
            }
            if(m_deg !=0){
                this.deg = this_data.s_deg + (m_deg/m_t)*u_t;
            }
            if(m_alpha !=0){
                this.alpha = this_data.s_alpha + (m_alpha/m_t)*u_t;
                this.alpha = (this.alpha < 0)? 0 : (this.alpha>100)? 100 : this.alpha;
            }
        }



    },
    //清理队列
    clearList:function(){
        var data = this.list,
            now_time = new Date().getTime(),
            array = [];

        for(var i= 0,l=data.length;i<l;i++){
            var this_data = data[i];
            if(now_time >= this_data.endTime){
                if(this_data.loop){
                    array.push({
                        startTime : now_time,
                        endTime : now_time + this_data.time,
                        time: this_data.time,

                        e_x:(this_data.flip)? this_data.s_x : this_data.e_x,
                        e_y:(this_data.flip)? this_data.s_y : this_data.e_y,
                        s_x:(this_data.flip)? this_data.e_x : this_data.s_x,
                        s_y:(this_data.flip)? this_data.e_y : this_data.s_y,

                        e_w:(this_data.flip)? this_data.s_w : this_data.e_w,
                        e_h:(this_data.flip)? this_data.s_h : this_data.e_h,
                        s_w:(this_data.flip)? this_data.e_w : this_data.s_w,
                        s_h:(this_data.flip)? this_data.e_h : this_data.s_h,

                        s_deg:(this_data.flip)? this_data.e_deg : this_data.s_deg,
                        e_deg:(this_data.flip)? this_data.s_deg : this_data.e_deg,

                        s_alpha:(this_data.flip)? this_data.e_alpha : this_data.s_alpha,
                        e_alpha:(this_data.flip)? this_data.s_alpha : this_data.e_alpha,

                        loop:true,
                        flip:this_data.flip,
                        runEndFlipHorizontal:this_data.runEndFlipHorizontal,
                        runEndFlipVertical : this_data.runEndFlipVertical

                    });
                    if(this_data.runEndFlipHorizontal){
                        this.flipHorizontal = (this.flipHorizontal)? false : true;
                    }
                    if(this_data.runEndFlipVertical){
                        this.flipVertical = (this.flipVertical)? false : true;
                    }
                }else{
                    if(this_data.e_x != this_data.s_x){
                        this.x = this_data.e_x;
                    }
                    if(this_data.e_y != this_data.s_y){
                        this.y = this_data.e_y;
                    }
                    if(this_data.s_deg != this_data.e_deg){
                        this.deg = this_data.e_deg;
                    }
                    if(this_data.e_w != this_data.s_w){
                        this.width = this_data.e_w;
                    }
                    if(this_data.e_h != this_data.s_h){
                        this.height = this_data.e_h;
                    }
                    if(this_data.e_alpha != this_data.s_alpha){
                        this.alpha = this_data.e_alpha;
                    }

                    this_data.callback();
                }
            }else{
                array.push(this_data);
            }
        }

        this.list = array;

    },
    //判断是否被点击（矩形判断）  需要APP.js　　同时需要执行ｃａｎｖａｓ的监听，刷完后要执行ＡＰＰ.js里清除当前事件的方法
    isClick:function(){
        if(!this.clickFn && !this.touchStartFn){
            this.clickState = false;
            return;
        }

        var click_state = APP.click;

        if(!click_state.state && !this.clickState){
            this.clickState = false;
            return;
        }

        var min_x = this.x,
            max_x = this.x + this.width,
            min_y = this.y,
            max_y = this.y + this.height,
            is_in = (click_state.x > min_x && click_state.x < max_x &&click_state.y > min_y && click_state.y < max_y);

        if(click_state.state == "down" && is_in){
            this.clickState = true;
            if(this.touchStartFn){
                this.touchStartFn();
            }

        }

        if(click_state.state == "up"){
            this.clickState = false;
        }


        if(click_state.state == "ok" && is_in){
            this.clickState = false;
            if(this.clickFn){
                this.clickFn();
            }

        }



    },
    //增加自身资源切换动画
    playResList:function(res,frame,loop,callback){
        this.resList = res;
        this.resFrame = frame || 1;
        this.playResLoop = loop || false;
        this.playResCallback = callback || function(){};
        this.canPlayResList = true;
        this.nowRes = -1;
    },
    //获取当前需要播放的资源
    getFromResList:function(){
        var _this = this;

        //判断是否到需要切换资源的帧了
        this.resFrameCount ++;
        if(this.resFrameCount%this.resFrame == 0){
            this.resFrameCount = 0;
        }else{
            return this.resource;
        }

        //切换资源
        this.nowRes ++;
        if(this.nowRes >= this.resList.length){
            if(this.playResLoop){
                this.nowRes = 0;
            }else{
                this.canPlayResList = false;
                setTimeout(function(){_this.playResCallback();},0);
                return this.resource;
            }
        }
        this.resource = this.resList[this.nowRes];
        return this.resource;
    },
    //元素渲染
    draw:function(){

        this.getParam();
        this.isClick();
        var resource = (this.clickState && this.touchResource)? this.touchResource : this.resource;
        if(this.canPlayResList){
            resource = this.getFromResList();
        }




        this.ctx.save();
        //设置画笔透明度
        this.ctx.globalAlpha = this.alpha/100;

        //水平或垂直翻转画布
        var translate_x = (this.flipHorizontal)? this.canvas.width : 0,
            translate_y = (this.flipVertical)? this.canvas.height : 0,
            scale_x = (this.flipHorizontal)? -1 : 1,
            scale_y = (this.flipVertical)? -1 : 1;

        this.ctx.translate(translate_x,translate_y);
        this.ctx.scale(scale_x,scale_y);


        //中心点移至画布翻转后元素的中心点
        var center_x = (this.centerX == 0 || this.centerX)? this.x + this.centerX : this.x+this.width/ 2,
            center_y = (this.centerY == 0 || this.centerY)? this.y + this.centerY : this.y+this.height/ 2,
            x = (this.flipHorizontal)? this.canvas.width - center_x : center_x,
            y = (this.flipVertical)? this.canvas.height - center_y : center_y;

        this.ctx.translate(x,y);
        this.ctx.rotate(Math.PI*this.deg/180);
        //画布旋转后还原到翻转后的顶点（左上角）
        this.ctx.translate(-x,-y);

        //画元素　　坐标是画布翻转后的位置，需要计算
        if(typeof(resource) == "object"){
            //是图片资源
            this.ctx.drawImage(
                resource,
                0,
                0,
                this.resource.width,
                this.resource.height,
                (this.flipHorizontal)? this.canvas.width - this.width - this.x : this.x,
                (this.flipVertical)? this.canvas.height - this.height - this.y : this.y,
                this.width,
                this.height
            );
        }else{
            //是颜色
            this.ctx.fillStyle = resource;

            this.ctx.fillRect(
                (this.flipHorizontal)? this.canvas.width - this.width - this.x : this.x,
                (this.flipVertical)? this.canvas.height - this.height - this.y : this.y,
                this.width,
                this.height
            )

        }


        this.ctx.globalAlpha = 1;
        this.ctx.restore();

    }
};