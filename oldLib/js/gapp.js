/**
 * Created by beens on 16/3/31.
 */




var GAPP = {
    init:function(opt){
        this.shieldTouchMove();



        this.resourceWidth = opt.resourceWidth || 640;
        this.resourceHeight = opt.resourceHeight || 1136;
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
        this.scaling = this.getScreenScalingSize();


    },
    //屏蔽touchMove事件
    shieldTouchMove:function(){
        window.addEventListener("touchmove",function(e){
            e.stopPropagation();
            e.preventDefault();
        },false);
    },
    getScreenScalingSize:function(){
        if(this.resourceWidth/this.resourceHeight >= this.screenWidth/this.screenHeight){

        }else{

        }
    }
};