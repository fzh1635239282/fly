/**
 * //敌机击毁时的掉落物;作为构造函数接受三个参数;初始的位置x,y和类型
 * @param {Number} x 
 * @param {Number} y 
 * @param {String} type 
 */
function DropItem(x,y,type) {
    switch(type) {
        case 0 :this.type = 'dropD';break;
        case 1 :this.type = 'dropR';break;
        case 2 :this.type = 'dropB';break;
        case 3 :this.type = 'dropU';break;
    }
    this.elm = document.createElement('div');
    this.elm.className = this.type;
    this.elm.style.left = x + "px";
    this.elm.style.top = y + "px";
    document.getElementById('bg').appendChild(this.elm);
    this.x = x;
    this.y = y;
    this.w = this.elm.offsetWidth;                  //元素的宽高
    this.h = this.elm.offsetHeight;
    this.xMove = 1;
    this.xCount = 100;
    this.moveInterval = setInterval(()=>{
        this.move();
    },20);
}
DropItem.prototype = {
    constructor : DropItem,
    move : function(){//移动函数,左右摇晃下坠
        this.x += this.xMove;
        this.xCount += this.xMove;
        this.y += 0.5;
        if(this.xCount < 0) {
            this.xMove = -this.xMove;
        } else if(this.xCount > 200) {
            this.xMove = -this.xMove;
        }
        this.elm.style.left = this.x + "px";
        this.elm.style.top = this.y + "px";
    }
}