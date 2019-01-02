//常用函数
//三次贝塞尔曲线公式
function bezier(t, start, control1, control2, end) {
    return {x : start.x * (1 - t) * (1 - t) * (1 - t) + 3 * control1.x * t * (1 - t) * (1 - t) + 3 * control2.x * t * t * (1 - t) + end.x * t * t * t,
    y : start.y * (1 - t) * (1 - t) * (1 - t) + 3 * control1.y * t * (1 - t) * (1 - t) + 3 * control2.y * t * t * (1 - t) + end.y * t * t * t};
}
//线性公式
function bezier1(t, start, end) {
    return {x : start.x * (1 - t) + end.x * t, y : start.y * (1 - t) + end.y * t};
}
//二次贝塞尔曲线公式
function bezier2(t, start, control1, end) {
    return {x : start.x * (1 - t) * (1 - t) + 2 * control1.x * t * (1 - t) + end.x * t * t,
    y : start.y * (1 - t) * (1 - t) + 2 * control1.y * t * (1 - t) + end.y * t * t};
}
//矩形碰撞检测
function isCollide(rec1,rec2) {
    if(rec1.center.x - rec1.realDis.x > rec2.center.x + rec2.realDis.x || rec1.center.y - rec1.realDis.y > rec2.center.y + rec2.realDis.y || rec1.center.x + rec1.realDis.x < rec2.center.x - rec2.realDis.x || rec1.center.y + rec1.realDis.y < rec2.center.y - rec2.realDis.y) {
        return false;
    } else {
        return true;
    }
}
//两个矩形中心点的距离
function dis(rec1,rec2) {
    return Math.sqrt((rec1.x - rec2.x) * (rec1.x - rec2.x) + (rec1.y - rec2.y) * (rec1.y - rec2.y));
}
//显示页面帧率
var showFPS = (function(){ 
    var requestAnimationFrame =  
        window.requestAnimationFrame || //Chromium  
        window.webkitRequestAnimationFrame || //Webkit 
        window.mozRequestAnimationFrame || //Mozilla Geko 
        window.oRequestAnimationFrame || //Opera Presto 
        window.msRequestAnimationFrame || //IE Trident? 
        function(callback) { //Fallback function 
        window.setTimeout(callback, 1000/60); 
        }; 
    var e,pe,pid,fps,last,offset,step,appendFps; 
 
    fps = 0; 
    last = Date.now(); 
    step = function(){ 
        offset = Date.now() - last; 
        fps += 1; 
        if( offset >= 1000 ){ 
            last += offset; 
            appendFps(fps); 
            fps = 0; 
        } 
        requestAnimationFrame( step ); 
    }; 
    //显示fps; 如果未指定元素id，默认<body>标签 
    appendFps = function(fps){ 
        if(!e) e=document.createElement('span'); 
        pe=pid?document.getElementById(pid):document.getElementsByTagName('body')[0]; 
        e.innerHTML = "fps: " + fps; 
        e.style.position = "fixed";
        e.style.bottom = "0";
        e.style.color = "#FFF";
        pe.appendChild(e); 
    } 
    return { 
        setParentElementId :  function(id){pid=id;}, 
        go          :  function(){step();} 
    } 
})();