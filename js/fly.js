const MOVE_DELAY = 2;
const CREATE_BULLET_DELAY = 80;
const BULLET_MOVE_DIS = 1000;
const CHARGE_DELAY = 16;
const CHARGE_MAX = 100;
const HP_MAX = 100;
const MOVE_SPEED = 1.5;
const FLY_LEVEL = 1;
const REAL_DIS_X = 20;
const REAL_DIS_Y = 12;
const FLY_BOUND_Y = 30;
/**
 * //玩家飞机的构造函数,接受三个值,飞机的类型,飞机的初始坐标x,y,画布对象
 * @param {String} type 红蓝飞机的选择
 * @param {Number} x 
 * @param {Number} y 
 * @param {Object} cvs 
 */
function Fly(type,x,y,cvs) {
    this.elm = document.createElement('div');
    this.elm.className = 'fly';
    document.getElementById('flybox').appendChild(this.elm);
    this.defence = document.createElement('div');
    this.defence.className = 'defence';
    this.defence.style.transform = "scale(0)";
    this.defence.style.backgroundImage = "url(../imgs/cut/defence.png)";
    document.getElementById('flybox').appendChild(this.defence);
    switch(type) {
        case 'blue':
            this.elm.style.backgroundImage = "url(../imgs/fly_blue_1.png)";
            this.status_bar = document.getElementsByClassName("p1")[0];
            cvs.fly1 = this;
            break;
        case 'red':
            this.elm.style.backgroundImage = "url(../imgs/fly_red_1.png)";
            this.status_bar = document.getElementsByClassName("p2")[0];
            cvs.fly2 = this;
            break;
    }
    this.cvs = cvs;
    this.status_bar.style.display = "block";
    this.type = type;                               //飞机的类型
    this.w = this.elm.offsetWidth;                  //元素的宽高
    this.h = this.elm.offsetHeight;                 //飞机绑定的状态栏的hp元素
    this.status_defence = this.status_bar.children[4].firstElementChild;
    this.status_defence.innerHTML = 1;
    this.status_boom = this.status_bar.children[4].children[1];
    this.status_boom.innerHTML = 1;
    this.status_hp = this.status_bar.children[2].firstElementChild;
    this.status_level = this.status_bar.children[1];
    this.hp = HP_MAX;                               //飞机的血量
    this.level = FLY_LEVEL;                         //飞机的等级
    this.status_bar.children[1].innerHTML = this.level;
    this.score = 0;                                 //飞机的得分
    this.movePx = MOVE_SPEED;                       //飞机的移动速度
    this.moveL = false;                             //飞机移动方向上的使能
    this.moveU = false;
    this.moveD = false;
    this.moveR = false;
    this.isAttack = false;                          //飞机攻击的使能
    this.isCharge = false;                          //飞机蓄力的使能
    this.isDefence = false;                         //飞机护盾的使能
    this.chargePower = 0;                           //飞机蓄力的能量
    this.isDie = false;                             //飞机死亡状态
    this.rec = {                                    //飞机的位置
        x : x,
        y : y,
        realDis : {                                 //飞机的真实碰撞大小
            x : REAL_DIS_X,
            y : REAL_DIS_Y
        },
        center : {                                  //飞机中心点的位置
            x : x + this.w / 2,
            y : y + this.h / 2,
        }
    }
    this.elm.style.left = this.rec.x + "px";        //初始化飞机的位置
    this.elm.style.top = this.rec.y + "px";
    this.init(this);                                //飞机初始化函数,飞机的键盘事件绑定
    this.moveI = setInterval(()=>{                               //这里需要用箭头函数让定时器里的this指向当前对象
        this.move();                                //否则会指向window
    },MOVE_DELAY);
    // setInterval(()=>{
    //     this.chargeAttack();
    // },CHARGE_DELAY);
    this.createBulletsI = setInterval(()=>{
        this.createBullet();
    },CREATE_BULLET_DELAY);
}
Fly.prototype = {
    constructor : Fly,
    move : function() {//飞机的移动方法,限定在可视界面中移动,更新飞机的位置和飞机中心点的位置
        if(this.moveL) {
            this.rec.x = (this.rec.x - this.movePx) < (this.rec.realDis.x - this.w / 2) ? (this.rec.realDis.x - this.w / 2) : (this.rec.x - this.movePx);
            this.elm.style.transform = "perspective(1000px) rotateY(-45deg)";
        }
        if(this.moveR) {
            this.rec.x = (this.rec.x + this.movePx) > (innerWidth - this.rec.realDis.x - this.w / 2) ? (innerWidth - this.rec.realDis.x - this.w / 2) : (this.rec.x + this.movePx);
            this.elm.style.transform = "perspective(1000px) rotateY(45deg)";
        }
        if(!this.moveL && !this.moveR) {
            this.elm.style.transform = "perspective(1000px) rotateY(0deg)";
        }
        if(this.moveD) {
            this.rec.y = (this.rec.y + this.movePx) > (innerHeight - this.rec.realDis.y - this.h / 2) ? (innerHeight - this.rec.realDis.y - this.h / 2) : (this.rec.y + this.movePx);
        }
        if(this.moveU) {
            this.rec.y = (this.rec.y - this.movePx) < (this.rec.realDis.y - this.h / 2) ? (this.rec.realDis.y - this.h / 2) : (this.rec.y - this.movePx);
        }
        this.rec.center.x = this.rec.x + this.w / 2;
        this.rec.center.y = this.rec.y + this.h / 2;
        this.elm.style.left = this.rec.x + "px";
        this.elm.style.top = this.rec.y + "px";
        this.defence.style.left = this.rec.x + 20 + "px";
        this.defence.style.top = this.rec.y + 20 + "px";
    },
    // chargeAttack : function() {//蓄力攻击
    //     if(this.isCharge) {
    //         this.chargePower = this.chargePower >= CHARGE_MAX ? CHARGE_MAX : ++this.chargePower;
    //     } else {
    //         this.chargePower = 0;
    //     }
    // },
    createBullet : function() { //根据飞机的类型创建颜色不同的子弹,同时将子弹的引用加入画布的子弹数组中
        if(this.isAttack) {     //由画布统一更新子弹的位置,以及绘制子弹
            switch(this.level) {//根据飞机等级发射不同的子弹
                case 1:
                    this.type === "blue" ?
                    this.cvs.fly1Bullets.push(new Bullet("blue_2",this.rec.center.x,this.rec.center.y - FLY_BOUND_Y,this.rec.center.x,this.rec.center.y - 100,BULLET_MOVE_DIS,0.4,1.2,this.cvs)) :
                    this.cvs.fly2Bullets.push(new Bullet("red_2",this.rec.center.x,this.rec.center.y - FLY_BOUND_Y,this.rec.center.x,this.rec.center.y - 100,BULLET_MOVE_DIS,0.4,1.2,this.cvs));
                    break;
                case 2:
                    if(this.type === "blue") {
                        this.cvs.fly1Bullets.push(new Bullet("blue_1",this.rec.center.x - 5,this.rec.center.y - FLY_BOUND_Y,this.rec.center.x - 5,this.rec.center.y - 100,BULLET_MOVE_DIS,0.4,1,this.cvs));
                        this.cvs.fly1Bullets.push(new Bullet("blue_1",this.rec.center.x + 5,this.rec.center.y - FLY_BOUND_Y,this.rec.center.x + 5,this.rec.center.y - 100,BULLET_MOVE_DIS,0.4,1,this.cvs));
                    } else {
                        this.cvs.fly2Bullets.push(new Bullet("red_1",this.rec.center.x - 5,this.rec.center.y - FLY_BOUND_Y,this.rec.center.x - 5,this.rec.center.y - 100,BULLET_MOVE_DIS,0.4,1,this.cvs));
                        this.cvs.fly2Bullets.push(new Bullet("red_1",this.rec.center.x + 5,this.rec.center.y - FLY_BOUND_Y,this.rec.center.x + 5,this.rec.center.y - 100,BULLET_MOVE_DIS,0.4,1,this.cvs));
                    }break;
                case 3:
                    if(this.type === "blue") {
                        this.cvs.fly1Bullets.push(new Bullet("blue_1",this.rec.center.x - 10,this.rec.center.y - FLY_BOUND_Y + 5,this.rec.center.x - 10,this.rec.center.y - 100,BULLET_MOVE_DIS,0.6,1,this.cvs));
                        this.cvs.fly1Bullets.push(new Bullet("blue_11",this.rec.center.x,this.rec.center.y - FLY_BOUND_Y,this.rec.center.x,this.rec.center.y - 100,BULLET_MOVE_DIS,0.4,1.2,this.cvs));
                        this.cvs.fly1Bullets.push(new Bullet("blue_1",this.rec.center.x + 10,this.rec.center.y - FLY_BOUND_Y + 5,this.rec.center.x + 10,this.rec.center.y - 100,BULLET_MOVE_DIS,0.5,1,this.cvs));
                    } else {
                        this.cvs.fly2Bullets.push(new Bullet("red_1",this.rec.center.x - 10,this.rec.center.y - FLY_BOUND_Y + 5,this.rec.center.x - 10,this.rec.center.y - 100,BULLET_MOVE_DIS,0.6,1,this.cvs));
                        this.cvs.fly2Bullets.push(new Bullet("purple_1",this.rec.center.x,this.rec.center.y - FLY_BOUND_Y,this.rec.center.x,this.rec.center.y - 100,BULLET_MOVE_DIS,0.4,1.2,this.cvs));
                        this.cvs.fly2Bullets.push(new Bullet("red_1",this.rec.center.x + 10,this.rec.center.y - FLY_BOUND_Y + 5,this.rec.center.x + 10,this.rec.center.y - 100,BULLET_MOVE_DIS,0.5,1,this.cvs));
                    }break;
                case 4:
                    if(this.type === "blue") {
                        this.cvs.fly1Bullets.push(new Bullet("purple_1",this.rec.center.x - 20,this.rec.center.y - FLY_BOUND_Y + 20,this.rec.center.x - 20,this.rec.center.y - 100,BULLET_MOVE_DIS,0.5,1.2,this.cvs));
                        this.cvs.fly1Bullets.push(new Bullet("blue_1",this.rec.center.x - 10,this.rec.center.y - FLY_BOUND_Y + 5,this.rec.center.x - 10,this.rec.center.y - 100,BULLET_MOVE_DIS,0.6,1,this.cvs));
                        this.cvs.fly1Bullets.push(new Bullet("blue_11",this.rec.center.x,this.rec.center.y - FLY_BOUND_Y,this.rec.center.x,this.rec.center.y - 100,BULLET_MOVE_DIS,0.4,1.2,this.cvs));
                        this.cvs.fly1Bullets.push(new Bullet("blue_1",this.rec.center.x + 10,this.rec.center.y - FLY_BOUND_Y + 5,this.rec.center.x + 10,this.rec.center.y - 100,BULLET_MOVE_DIS,0.6,1,this.cvs));
                        this.cvs.fly1Bullets.push(new Bullet("purple_1",this.rec.center.x + 20,this.rec.center.y - FLY_BOUND_Y + 20,this.rec.center.x + 20,this.rec.center.y - 100,BULLET_MOVE_DIS,0.5,1.2,this.cvs));
                    } else {
                        this.cvs.fly2Bullets.push(new Bullet("blue_1",this.rec.center.x - 20,this.rec.center.y - FLY_BOUND_Y + 20,this.rec.center.x - 20,this.rec.center.y - 100,BULLET_MOVE_DIS,0.5,1.2,this.cvs));
                        this.cvs.fly2Bullets.push(new Bullet("red_1",this.rec.center.x - 10,this.rec.center.y - FLY_BOUND_Y + 5,this.rec.center.x - 10,this.rec.center.y - 100,BULLET_MOVE_DIS,0.6,1,this.cvs));
                        this.cvs.fly2Bullets.push(new Bullet("purple_1",this.rec.center.x,this.rec.center.y - FLY_BOUND_Y,this.rec.center.x,this.rec.center.y - 100,BULLET_MOVE_DIS,0.4,1.2,this.cvs));
                        this.cvs.fly2Bullets.push(new Bullet("red_1",this.rec.center.x + 10,this.rec.center.y - FLY_BOUND_Y + 5,this.rec.center.x + 10,this.rec.center.y - 100,BULLET_MOVE_DIS,0.6,1,this.cvs));
                        this.cvs.fly2Bullets.push(new Bullet("blue_1",this.rec.center.x + 20,this.rec.center.y - FLY_BOUND_Y + 20,this.rec.center.x + 20,this.rec.center.y - 100,BULLET_MOVE_DIS,0.5,1.2,this.cvs));
                    }break;
            }
        }
    },
    init : function(this_) {//为红蓝飞机添加键盘事件
        switch(this_.type) {
            case 'blue':
                document.addEventListener('keydown', function(ev) {
                    switch(ev.keyCode) {
                        case 65:this_.moveL = true;break;
                        case 68:this_.moveR = true;break;
                        case 83:this_.moveD = true;break;
                        case 87:this_.moveU = true;break;
                        case 74:this_.isAttack = true;break;
                        case 75:this_.isCharge = true;break;
                        case 76:
                            if(!this_.isDefence && !this_.isDie) {
                                if(this_.status_defence.innerHTML - 1 < 0) return;
                                else this_.status_defence.innerHTML -= 1;
                                this_.isDefence = true;
                                this_.defence.style.transform = "scale(1)";
                                setTimeout(()=>{
                                    this_.defence.style.transform = "scale(0)";
                                    this_.isDefence = false;
                                },5000);
                            }break;
                    }
                });
                document.addEventListener('keyup', function(ev) {
                    switch(ev.keyCode) {
                        case 65:this_.moveL = false;break;
                        case 68:this_.moveR = false;break;
                        case 83:this_.moveD = false;break;
                        case 87:this_.moveU = false;break;
                        case 74:this_.isAttack = false;break;
                        case 75:this_.isCharge = false;break;
                    }
                });
                break;
            case 'red':
                document.addEventListener('keydown', function(ev) {
                    switch(ev.keyCode) {
                        case 37:this_.moveL = true;break;
                        case 39:this_.moveR = true;break;
                        case 40:this_.moveD = true;break;
                        case 38:this_.moveU = true;break;
                        case 97:this_.isAttack = true;break;
                        case 98:this_.isCharge = true;break;
                        case 99:
                            if(!this_.isDefence && !this_.isDie) {
                                if(this_.status_defence.innerHTML - 1 < 0) return;
                                else this_.status_defence.innerHTML -= 1;
                                this_.isDefence = true;
                                this_.defence.style.transform = "scale(1)";
                                setTimeout(()=>{
                                    this_.defence.style.transform = "scale(0)";
                                    this_.isDefence = false;
                                },5000);
                            }break;
                    }
                });
                document.addEventListener('keyup', function(ev) {
                    switch(ev.keyCode) {
                        case 37:this_.moveL = false;break;
                        case 39:this_.moveR = false;break;
                        case 40:this_.moveD = false;break;
                        case 38:this_.moveU = false;break;
                        case 97:this_.isAttack = false;break;
                        case 97:this_.isCharge = false;break;
                    }
                });
                break;
        }
    }
}