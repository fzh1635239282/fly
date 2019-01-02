/**
 * 子弹的构造函数接受9个参数;类型,初始点x,y,目标点x,y,最大移动距离,缩放x,y,画布
 * @param {String} type 
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} targetX 
 * @param {Number} targetY 
 * @param {Number} moveDis 
 * @param {Number} scaleX 
 * @param {Number} scaleY 
 * @param {Object} cvs 
 */
function Bullet(type,x,y,targetX,targetY,moveDis,scaleX,scaleY,cvs) {
    const MOVE_DELAY = 4;
    const ATC = 10;
    const MOVE_SPEED = 4;
    const SCALE = 0.6;
    switch(type) {
        case 'blue_1':
            this.img = cvs.imgs.blue_1;
            this.w = 14 * scaleX;
            this.h = 31 * scaleY;
            break;
        case 'blue_11':
            this.img = cvs.imgs.blue_11;
            this.w = 14 * scaleX;
            this.h = 31 * scaleY;
            break;
        case 'red_1':
            this.img = cvs.imgs.red_1;
            this.w = 14 * scaleX;
            this.h = 31 * scaleY;
            break;
        case 'purple_1':
            this.img = cvs.imgs.purple_1;
            this.w = 14 * scaleX;
            this.h = 31 * scaleY;
            break;
        case 'blue_2':
            this.img = cvs.imgs.blue_2;
            this.w = 20 * scaleX;
            this.h = 20 * scaleY;
            break;
        case 'blue_22':
            this.img = cvs.imgs.blue_22;
            this.w = 20 * scaleX;
            this.h = 20 * scaleY;
            break;
        case 'red_2':
            this.img = cvs.imgs.red_2;
            this.w = 20 * scaleX;
            this.h = 20 * scaleY;
            break;
        case 'purple_2':
            this.img = cvs.imgs.purple_2;
            this.w = 20 * scaleX;
            this.h = 20 * scaleY;
            break;
    }
    this.cvs = cvs;
    this.type = type;
    //附加参数,调整子弹的移动速度和攻击力
    this.movePx = arguments.length > 9 ? arguments[9] : MOVE_SPEED;
    this.atc = arguments.length > 10 ? arguments[10] : ATC;//子弹的攻击
    this.moveDis = moveDis;
    this.disable = false;
    this.originPos = {
        x : x - this.w / 2,
        y : y - this.h / 2
    }
    this.direc = {
        x : (targetX - x) / Math.sqrt(Math.pow(targetX - x,2) + Math.pow(targetY - y,2)),
        y : (targetY - y) / Math.sqrt(Math.pow(targetX - x,2) + Math.pow(targetY - y,2))
    }
    this.rec = {                                    //子弹的位置
        x : x - this.w / 2,
        y : y - this.h / 2,
        realDis : {                                 //子弹的真实碰撞大小
            x : this.w / 2,
            y : this.h / 2
        },
        center : {                                  //子弹中心点的位置
            x : x + this.w / 2,
            y : y + this.h / 2,
        }
    }
}
