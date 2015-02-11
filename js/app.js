/*
 * Filename : 
 * =====================================
 * Created with WebStorm.
 * User: bens
 * Date: 13-12-27
 * Time: 上午10:12
 * Email:5878794@qq.com
 * =====================================
 * Desc:
 */

window.addEventListener("touchmove",function(e){
    e.stopPropagation();
    e.preventDefault();
},false);

var loadResources_src = [];



$(document).ready(function(){
    var setFn = function(){
        APP.resourceScale = window.innerWidth/APP.resourceWidth;
        APP.realHeight = APP.resourceScale*APP.resourceHeight;
        APP.realWidth = window.innerWidth;
        APP.width = window.innerWidth;
        APP.height = window.innerHeight;
        APP.fontSize = 50 * APP.resourceScale;
        APP.load = new DEVICE.loading(null,APP.resourceScale);
        APP.info.scale = APP.resourceScale*3;
        APP.run();
    };

    setTimeout(function(){
        $(window).resize(function(){
            setFn();
        });
        setFn();
        //加载loading显示界面所需资源
        APP.loadResources({
            resource_src:loadResources_src,
            resource:resources,
            success:function(){
                LOADPAGE.init();
            },
            error:function(file_name){
                alert(file_name+" 加载失败，请刷新重试！");
            },
            oneSuccess:function(){

            }
        });
    },500);

});


var APP = {
    click:{
        state:false,
        x:0,
        y:0
    },
    resourceWidth:640,
    resourceHeight:1136,
    realHeight:640,
    resourceScale:1,
    fontSize:10,
    canvasScale:1,
    width:window.innerWidth,
    height:window.innerHeight,
    keyState:{
        up:false,       //上
        down:false,     //下
        left:false,     //左
        right:false,    //右
        fire:false      //开火
    },
    ready:function(callback){
        var is_ie = navigator.userAgent.match(/MSIE 10.0/i)?true:false;
        if (document.readyState === "complete" || document.readyState === "loaded"||(!is_ie && document.readyState==="interactive")) //IE10 fires interactive too early
            callback();
        else
            document.addEventListener("DOMContentLoaded", callback, false);
        return this;
    },
    //创建画布
    createCanvas:function(body,width,height,z_index){
        var win_width = window.innerWidth,
            win_height = window.innerHeight;

        this.width = win_width;
        this.height = win_height;

        width = width || win_width;
        height = height || win_height;
        width = width * APP.canvasScale;
        height = height * APP.canvasScale;

        var canvas = document.createElement("canvas"),
            ctx = canvas.getContext("2d"),
            left = (width)? (win_width-width)/2 : 0,
            top = (height)? (win_height-height)/2 : 0;

        canvas.width = width || win_width;
        canvas.height = height || win_height;


        body.style.cssText += "position:relative;";
        canvas.style.cssText = "position:absolute;z-index:"+z_index+";left:"+left+"px;top:"+top+"px;";
        canvas.style.cssText += "-webkit-transform:scale("+1/APP.canvasScale+");transform:scale("+1/APP.canvasScale+");";
        body.appendChild(canvas);


        //处理canvas画布渲染图片模糊的问题
        (function (canvas, ctx) {
            var devicePixelRatio = window.devicePixelRatio || 1;
            var backingStorePixelRatio = ctx.webkitBackingStorePixelRatio ||
                ctx.mozBackingStorePixelRatio ||
                ctx.msBackingStorePixelRatio ||
                ctx.oBackingStorePixelRatio ||
                ctx.backingStorePixelRatio || 1;

            var ratio = devicePixelRatio / backingStorePixelRatio;

            if (devicePixelRatio !== backingStorePixelRatio) {
                var oldWidth = canvas.width;
                var oldHeight = canvas.height;

                canvas.width = oldWidth * ratio;
                canvas.height = oldHeight * ratio;

                canvas.style.width = oldWidth + 'px';
                canvas.style.height = oldHeight + 'px';

                ctx.scale(ratio, ratio);
            }

        })(canvas, ctx);



        return canvas;
    },
    //清除画布
    clearCanvas:function(canvas,color){
        var ctx = canvas.getContext("2d");
        color = color || "rgba(0,0,0,0)";
        ctx.fillStyle = color;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        canvas.style.display = "none";// Detach from DOM
        canvas.offsetHeight; // Force the detach
        canvas.style.display = "inherit"; // Reattach to DOM
    },
    //判断val是否大于a否则a 小于b否则b
    fixMedian:function(val,a,b){
        val = (val<a)? a : val;
        val = (val>b)? b : val;
        return val;
    },
    //按键事件
    keyEventBind:function(){
        //监听的键及对应动作
        var key = {
                37:"left",          //左  小键盘
                38:"up",            //上
                39:"right",         //右
                40:"down",          //下
                87:"up",            //w
                65:"left",          //a
                83:"down",          //s
                68:"right",         //d
                32:"fire"           //空格
            },
            _this = this;


        document.addEventListener("keydown",function(e){
            var code = e.keyCode,
                now_key = key[code];

            if(now_key){
                _this.keyState[now_key] = true;
            }
        },false);
        document.addEventListener("keyup",function(e){
            var code = e.keyCode,
                now_key = key[code];
            if(now_key){
                _this.keyState[now_key] = false;
            }
        },false);




        //当前方向键按下状态
        this.keyState = {
            up:false,       //上
            down:false,     //下
            left:false,     //左
            right:false,    //右
            fire:false      //开火
        };



        var x = 0,
            y = 0;
        document.addEventListener("touchstart",function(e){
            var point = (e.touches)? e.touches[0] : e;
            x = point.pageX;
            y = point.pageY;
        },false);
        document.addEventListener("touchmove",function(e){
            var point = (e.touches)? e.touches[0] : e;
            var t_x = point.pageX;
            var t_y = point.pageY;

            if(t_x - x > 30){
                _this.keyState.right = true;
                _this.keyState.left = false;
            }else if(x - t_x > 30){
                _this.keyState.right = false;
                _this.keyState.left = true;
            }else{
                _this.keyState.right = false;
                _this.keyState.left = false;
            }
            if(t_y - y> 30){
                _this.keyState.down = true;
                _this.keyState.up = false;
            }else if(y - t_y > 30){
                _this.keyState.down = false;
                _this.keyState.up = true;
            }else{
                _this.keyState.down = false;
                _this.keyState.up = false;
            }
        },false);
        document.addEventListener("touchend",function(e){
            _this.keyState.right = false;
            _this.keyState.left = false;
            _this.keyState.down = false;
            _this.keyState.up = false;
        },false);

    },
    //加载图片资源
    loadImage:function(src,success,error){
        var temp_img = new Image();

        temp_img.onload = function(){
            success(temp_img);
        };
        temp_img.onerror = function(){
            var file_name = src.substr(src.lastIndexOf("/")+1);
            error(file_name);
        };
        temp_img.src =src;
    },
    AUDIO:(function(){
        window.AudioContext = window.AudioContext ||
            window.webkitAudioContext ||
            window.mozAudioContext ||
            window.msAudioContext;

        var audioTag = !!(document.createElement("audio").canPlayType),
            audio;



        //audio api
        if(!!window.AudioContext){
            //支持
            audio = function(data){
                this.src = data.src;                      //文件地址
                this.ready = data.ready || function(){};  //预加载完使用
                this.error = data.error || function(){};  //出错回调
                this.fileName = this.src.substr(this.src.lastIndexOf("/")+1);

                this.ac = new AudioContext();
                this.buffer = null;                       //buffer缓存
                this.source = null;                       //声音源

                this.playedTime = 0;
                this.startPlayTime = 0;


                this.cache();
            };

            audio.prototype = {
                cache:function(){
                    var request = new XMLHttpRequest(),
                        _this = this;

                    request.open('GET', this.src, true);
                    request.responseType = 'arraybuffer';

                    //下载声音文件
                    request.onreadystatechange = function(){
                        if(request.readyState == 4){
                            if(request.status >= 200 && request.status < 300){
                                _this.bufferData(request.response);
                            }else{
                                _this.error(_this.fileName);
                            }
                        }
                    };

                    request.send();
                },
                bufferData:function(rs){
                    var _this = this;
                    //解码
                    this.ac.decodeAudioData(rs, function(buffer) {
                        _this.buffer = buffer;
                        _this.ready();
                    }, function(){
                        _this.error(_this.fileName);
                    });
                },
                play:function(data){
                    data = data || {};
                    //是否循环播放
                    var loop = data.loop || false,
                    //延迟多久开始播放（秒）
                        delay = data.delay || 0,
                    //开始播放时间（秒）
                        start = data.start || this.playedTime,
                    //播放多久（秒）
                        continued = data.continued || this.buffer.duration - this.playedTime;
                    //记录开始播放时间
                    this.startPlayTime = this.ac.currentTime;
                    // 创建一个声音源
                    this.source = this.ac.createBufferSource();
                    // 告诉该源播放何物
                    this.source.buffer = this.buffer;
                    //循环
                    this.source.loop = loop;
                    //将该源与硬件相连
                    this.source.connect(this.ac.destination);
                    //现在播放该实例
                    this.source.start(delay,start,continued);

                },
                stop:function(){
                    this.playedTime += this.ac.currentTime - this.startPlayTime;

                    this.source.stop();
                }
            };

        }


        //audio tag
        if(!window.AudioContext && audioTag){
            //支持audio标签
            audio = function(data){
                this.src = data.src;                      //文件地址
                this.ready = data.ready || function(){};  //预加载完使用
                this.error = data.error || function(){};  //出错回调
                this.fileName = this.src.substr(this.src.lastIndexOf("/")+1);

                //audio标签
                this.tag = null;


                this.delayTimeOut = null;
                this.playTimeOut = null;

                this.canPlayFn = null;
                this.loadErrorFn = null;


                this.createTag();
                this.cache();
            };

            audio.prototype = {
                createTag:function(){
                    var tag = document.createElement("audio");
                    tag.src = this.src;

//                    var tag = new Audio(this.src);
                    tag.preload = "auto";
//                    tag.controls = true;
                    tag.style.cssText = "display:none;";

                    this.tag = tag;
                    document.body.appendChild(tag);
                },
                cache:function(){
                    var _this = this;
                    _this.tag.addEventListener("canplaythrough",_this.canPlayFn = function(){
                        _this.tag.removeEventListener("canplaythrough",_this.canPlayFn,false);
                        _this.ready();
                    },false);

                    _this.tag.addEventListener("error", _this.loadErrorFn = function(){
                        _this.tag.removeEventListener("error",_this.loadErrorFn,false);
                        _this.error(_this.fileName);
                    },false);
                },
                play:function(data){
                    clearTimeout(this.delayTimeOut);
                    clearTimeout(this.playTimeOut);
                    this.stop();
                    data = data || {};

                    var loop = data.loop || false,
                    //延迟多久开始播放（秒）
                        delay = (parseInt(data.delay))? parseInt(data.delay) : 0,
                    //开始播放时间（秒）
                        start = (parseInt(data.start) || parseInt(data.start) == 0 )? parseInt(data.start) : this.tag.currentTime,
                    //播放多久（秒）
                        continued = parseInt(data.continued) + delay,
                        _this = this;

                    this.tag.loop = loop;
                    this.tag.currentTime = start;
                    if(delay != 0){
                        this.delayTimeOut = setTimeout(function(){
                            _this.tag.play();
                        },delay*1000);
                    }else{
                        _this.tag.play();
                    }

                    if(continued){
                        this.playTimeOut = setTimeout(function(){
                            _this.tag.pause();
                        },continued*1000)
                    }
                },
                stop:function(){
                    clearTimeout(this.delayTimeOut);
                    clearTimeout(this.playTimeOut);
                    this.tag.pause();
                }
            };

        }



        return audio;
    })(),
    loadResources:function(rs){
        var obj = rs.resource_src || {},
            backObj = rs.resource || {},
            success = rs.success || function(){},
            error = rs.error || function(){},
            progress = rs.oneSuccess || function(){},
            image = ",jpg,jpeg,png,gif,",
            resources = [],
            _this = this;

        //对象转数组
        for(var key in obj){
            if(obj.hasOwnProperty(key)){
                var src = obj[key],
                    extension = src.substr(src.lastIndexOf(".")+1),
                    isImage = (image.indexOf(","+extension+",")>-1);

                resources.push({
                    name:key,
                    isImage:isImage,
                    src:src
                })
            }
        }

        //队列加载
        var load = function(res){
            var src = res.src,
                name = res.name,
                isImage = res.isImage;

            if(isImage){
                _this.loadImage(src,function(b_obj){
                    backObj[name] = b_obj;
                    progress();
                    go();
                },function(file_name){
                    error(file_name);
                });
            }else{
                backObj[name] = new _this.AUDIO({
                    src:src,
                    ready:function(){
                        progress();
                        go();
                    },
                    error:function(file_name){
                        error(file_name);
                    }
                });
            }
        };


        var go = function(){
            if(resources.length == 0){
                success();
            }else{
                var this_res = resources.shift();
                load(this_res);
            }
        };

        go();
    },
    //浏览器窗口是否激活
    isFocus:true,
    pageChange:function(pageA,pageB){
        pageA.style.display = "none";
        pageB.style.display = "block";
    },
    clickEventBind:function(obj){
        var _this = this,
            point = function(e){
                if(e.touchs){
                    e = e.touchs[0];
                }

                return {
                    x: e.mytarget.clickX,
                    y: e.mytarget.clickY
                }
            };

        $$(obj).myclickdown(function(e){
            _this.click.state = "down";
            var p = point(e);
            _this.click.x = p.x;
            _this.click.y = p.y;
        });
        $$(obj).myclickok(function(e){
            _this.click.state = "ok";
            var p = point(e);
            _this.click.x = p.x;
            _this.click.y = p.y;
        });
        $$(obj).myclickup(function(e){
            _this.click.state = "up";
            var p = point(e);
            _this.click.x = p.x;
            _this.click.y = p.y;
        });
    },
    clickEventUnBind:function(obj){
        $$(obj).unbind(true);
    },
    clearClickParam:function(){
        this.click = {
            state:false,
            x:0,
            y:0
        };
    },


    canRun:true,
    play:null,
    runFn:function(){},
    run:function(){
        var _this = this;
        var fn = function(){
            if(_this.canRun){
                _this.runFn();
            }

            _this.clearClickParam();
            _this.play = requestAnimationFrame(fn);

        };

        fn();
    },

    load:null,
    info:DEVICE.info,
    //本地存储
    localData :{
        userData: null,
        name: location.hostname,
        init: function () {
            if (!this.userData) {
                try {
                    this.userData = document.createElement('INPUT');
                    this.userData.type = "hidden";
                    this.userData.style.display = "none";
                    this.userData.addBehavior("#default#userData");
                    document.body.appendChild(this.userData);
                    var expires = new Date();
                    expires.setDate(expires.getDate() + 365);
                    this.userData.expires = expires.toUTCString();
                } catch (e) {
                    return false;
                }
            }
            return true;

        },
        setItem: function (key, value) {
            if (window.localStorage) {
                window.localStorage[key] = value;
            } else {
                if (this.init()) {
                    this.userData.load(this.name);
                    this.userData.setAttribute(key, value);
                    this.userData.save(this.name);
                }
            }

        },
        getItem: function (key) {
            if (window.localStorage) {
                return window.localStorage[key];
            } else {
                if (this.init()) {
                    this.userData.load(this.name);
                    return this.userData.getAttribute(key)
                }
            }

        },
        removeItem: function (key) {
            if (window.localStorage) {
                window.localStorage.removeItem(key);
            } else {
                if (this.init()) {
                    this.userData.load(this.name);
                    this.userData.removeAttribute(key);
                    this.userData.save(this.name);
                }
            }
        }
    },
    background:(function(){
        var bg = function(opt){
            this.bg = opt.res;
            this.x = opt.x || 0;
            this.y = opt.y || 0;
            this.repeat = $.isBoolean(opt.repeat)? opt.repeat : true;

            this.canvas = null;
            this.ctx = null;

            this.canvasWidth = 0;
            this.canvasHeight = 0;
            this.resWidth = this.bg.width;
            this.resHeight = this.bg.height;

            this.cacheData = [];




            this.init();
        };
        bg.prototype = {
            init:function(){
                this.canvas = APP.createCanvas($("body"),null,null,1);
                this.ctx = this.canvas.getContext("2d");

                this.canvasWidth = this.canvas.width;
                this.canvasHeight = this.canvas.height;

                this.draw();
            },
            animate:function(){

            },
            clearCacheData:function(){

            },
            getParam:function(){

            },
            draw:function(){
                this.getParam();

                var temp = 0;

                while(temp<=this.canvasWidth){
                    this.ctx.drawImage(
                        this.bg,
                        0,
                        0,
                        this.resWidth,
                        this.resHeight,
                        temp,
                        0,
                        this.resWidth * APP.resourceScale,
                        this.resHeight * APP.resourceScale
                    );

                    temp += this.resWidth;
                }


            }

        };

        return bg;
    })()



};




//监听窗口是否激活
(function(){
    if(window.addEventListener){
        window.addEventListener("focus",function(){
            APP.isFocus = true;

        });
        window.addEventListener("blur",function(){
            APP.isFocus = false;

        });
    }
})();



//动画函数
window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {  setTimeout(callback, 100/6)};



window.cancelRequestAnimationFrame =
    window.cancelAnimationFrame ||
    window.cancelRequestAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.webkitCancelRequestAnimationFrame ||
    window.mozCancelRequestAnimationFrame ||
    window.oCancelRequestAnimationFrame ||
    window.msCancelRequestAnimationFrame ||
    clearTimeout;







