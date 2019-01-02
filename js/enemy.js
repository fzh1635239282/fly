/**
 * //敌机的构造函数接受4个参数或更多;类型,画布,初始位置
 * @param {String} type 
 * @param {Object} cvs 
 * @param {Number} x 
 * @param {Number} y 
 */
function Enemy(type,cvs,x,y) {
    const MOVE_DELAY = 2;
    const CREATE_BULLET_DELAY = 1000;
    const BULLET_MOVE_DIS = 3000;
    const HP_MAX = 100;
    const MOVE_SPEED = 1.5;
    const FLY_BOUND_Y = 30;
    let real_dis_x = 25,
        real_dis_y = 25;
    this.elm = document.createElement('div');
    this.elm.className = 'enemy';
    document.getElementById('bg').appendChild(this.elm);
    this.direcModify = 90;                          //敌机图片素材的朝向不同,需要调整角度
    this.isCanAtc = true;                           //有些种类的敌机不能攻击
    this.createBulletDelay = CREATE_BULLET_DELAY;
    this.isDirecChange = true;                      //有些种类的敌机不能改变朝向
    switch(type) {
        case 'blue':
            this.elm.style.backgroundImage = "url(../imgs/ep_12.png)";
            this.elm.style.width = "100px";
            this.elm.style.height = "100px";
            this.isCanAtc = false;
            break;
        case 'blue+':
            this.elm.style.backgroundImage = "url(../imgs/my_1.png)";
            this.elm.style.width = "100px";
            this.elm.style.height = "100px";
            break;
        case 'blue++':
            this.elm.style.backgroundImage = "url(../imgs/my_2.png)";
            this.elm.style.width = "200px";
            this.elm.style.height = "200px";
            real_dis_x = 100;
            real_dis_y = 50;
            break;
        case 'purple':
            this.elm.style.backgroundImage = "url(../imgs/ep_15.png)";
            this.elm.style.width = "200px";
            this.elm.style.height = "200px";
            real_dis_x = 100;
            real_dis_y = 50;
            break;
        case 'green':
            this.elm.style.backgroundImage = "url(../imgs/ep_13.png)";
            this.elm.style.width = "200px";
            this.elm.style.height = "200px";
            this.createBulletDelay = 200;
            real_dis_x = 100;
            real_dis_y = 30;
            break;
        case 'boss':
            this.elm.style.backgroundImage = "url(../imgs/boss.png)";
            this.elm.style.width = "600px";
            this.elm.style.height = "600px";
            this.createBulletDelay = 200;
            real_dis_x = 280;
            real_dis_y = 40;
            this.isDirecChange = false;
            break;
    }
    this.beziers = arguments.length > 4 ? arguments[4] : [];//敌机移动的贝塞尔曲线数组
    this.hp = arguments.length > 5 ? arguments[5] : HP_MAX;//敌人的血量
    this.cvs = cvs;
    this.type = type;                               //敌人的类型
    this.w = this.elm.offsetWidth;                  //元素的宽高
    this.h = this.elm.offsetHeight;
    this.isCanMove = true;                          //敌人的移动使能
    this.t = 0;                                     //贝塞尔曲线时间比率
    this.beziersIndex = 0;                          //当前运动在哪条贝塞尔曲线上
    this.drop = Math.floor(Math.random()*20) > 1 ? -1 : Math.floor(Math.random()*3);
    this.b_b_t = {
        x1 : 0,
        x2 : 0,
        t : 0,
        count : 1,
        type : 0,
        flag : true
    }
    this.origin = {                                 //记录敌人初始位置
        x : x,
        y : y
    }
    this.rec = {                                    //敌人的位置
        x : x,
        y : y,
        realDis : {                                 //敌人的真实碰撞大小
            x : real_dis_x,
            y : real_dis_y
        },
        center : {                                  //敌人中心点的位置
            x : x + this.w / 2,
            y : y + this.h / 2,
        }
    }
    this.elm.style.left = this.rec.x + "px";     //初始化敌人的位置
    this.elm.style.top = this.rec.y + "px";
    this.moveI = setInterval(()=>{                               //这里需要用箭头函数让定时器里的this指向当前对象
        this.move();                                            //否则会指向window
    },MOVE_DELAY);
    this.createBulletsI = setInterval(()=>{
        this.createBullet();
    },this.createBulletDelay);
}
Enemy.prototype = {
    constructor : Enemy,
    move : function() {//敌机的移动函数,有贝塞尔曲线数组的敌机移动时会遍历贝塞尔曲线数组移动
        if(this.isCanMove) {
            var pos = bezier(
                this.t / 1000,{
                    x : this.beziersIndex === 0 ? this.origin.x : this.beziers[this.beziersIndex-1].end.x,
                    y : this.beziersIndex === 0 ? this.origin.y : this.beziers[this.beziersIndex-1].end.y
                },{
                    x : this.beziers[this.beziersIndex].control1.x,
                    y : this.beziers[this.beziersIndex].control1.y
                },{
                    x : this.beziers[this.beziersIndex].control2.x,
                    y : this.beziers[this.beziersIndex].control2.y
                },{
                    x : this.beziers[this.beziersIndex].end.x,
                    y : this.beziers[this.beziersIndex].end.y
                });
            //下面计算敌机沿贝塞尔曲线移动时的朝向(朝向与贝塞尔曲线相切)
            if(this.isDirecChange) {
                var p1 = bezier1(this.t / 1000,{
                        x : this.beziersIndex === 0 ? this.origin.x : this.beziers[this.beziersIndex-1].end.x,
                        y : this.beziersIndex === 0 ? this.origin.y : this.beziers[this.beziersIndex-1].end.y
                    },{
                        x : this.beziers[this.beziersIndex].control1.x,
                        y : this.beziers[this.beziersIndex].control1.y
                    }),
                    p2 = bezier1(this.t / 1000,{
                        x : this.beziers[this.beziersIndex].control1.x,
                        y : this.beziers[this.beziersIndex].control1.y
                    },{
                        x : this.beziers[this.beziersIndex].control2.x,
                        y : this.beziers[this.beziersIndex].control2.y
                    }),
                    p3 = bezier1(this.t / 1000,{
                        x : this.beziers[this.beziersIndex].control2.x,
                        y : this.beziers[this.beziersIndex].control2.y
                    },{
                        x : this.beziers[this.beziersIndex].end.x,
                        y : this.beziers[this.beziersIndex].end.y
                    }),
                    p4 = bezier1(this.t / 1000,{
                        x : p1.x,
                        y : p1.y
                    },{
                        x : p2.x,
                        y : p2.y
                    }),
                    p5 = bezier1(this.t / 1000,{
                        x : p2.x,
                        y : p2.y
                    },{
                        x : p3.x,
                        y : p3.y
                    });
                this.elm.style.transform = "rotateZ(" + ((Math.atan2((p5.y-p4.y), (p5.x-p4.x)) * 180 / Math.PI) + this.direcModify)  +"deg)";
            }
            this.t++;
            //除boss外的敌机都只遍历一次贝塞尔曲线数组移动
            if(this.t >= 1000) {
                this.t = 0;
                this.beziersIndex++;
                if(this.beziersIndex > this.beziers.length - 1) {
                    if(this.type === "boss") {
                        this.beziersIndex = 1;
                    } else {
                        clearInterval(this.moveI);
                    }
                }
            }
            this.rec.x = pos.x;
            this.rec.y = pos.y;
            this.rec.center.x = this.rec.x + this.w / 2;
            this.rec.center.y = this.rec.y + this.h / 2;
            this.elm.style.left = pos.x + "px";
            this.elm.style.top = pos.y + "px";
            //玩家飞机被撞销毁
            if(isCollide(this.rec,this.cvs.fly1.rec) && !this.cvs.fly1.isDefence) {
                this.cvs.fly1.hp = 0;
                this.cvs.fly1.status_hp.style.width = this.cvs.fly1.hp + "%";
                this.cvs.deleteFly(this.cvs.fly1);
            }
            if(isCollide(this.rec,this.cvs.fly2.rec) && !this.cvs.fly2.isDefence) {
                this.cvs.fly2.hp = 0;
                this.cvs.fly2.status_hp.style.width = this.cvs.fly2.hp + "%";
                this.cvs.deleteFly(this.cvs.fly2);
            }
        }
    },
    createBullet : function() {
        if(this.isCanAtc) {//不同类型的敌机创建不同的子弹
            switch(this.type) {
                case 'blue+':
                    dis(this.cvs.fly1.rec,this.rec) < dis(this.cvs.fly2.rec,this.rec) ? 
                    this.cvs.enemyBullets.push(new Bullet("blue_2",this.rec.center.x,this.rec.center.y,this.cvs.fly1.rec.center.x,this.cvs.fly1.rec.center.y,BULLET_MOVE_DIS,0.6,0.6,this.cvs,1)) :
                    this.cvs.enemyBullets.push(new Bullet("blue_2",this.rec.center.x,this.rec.center.y,this.cvs.fly2.rec.center.x,this.cvs.fly2.rec.center.y,BULLET_MOVE_DIS,0.6,0.6,this.cvs,1));
                    break;
                case 'blue++':
                    for(let i = 0; i < 3; i++) {
                        this.cvs.enemyBullets.push(new Bullet("red_2",this.rec.center.x,this.rec.center.y + 30,this.rec.center.x - i * 50,this.rec.center.y + 200,BULLET_MOVE_DIS,0.6,0.6,this.cvs,1));
                        this.cvs.enemyBullets.push(new Bullet("red_2",this.rec.center.x,this.rec.center.y + 30,this.rec.center.x + i * 50,this.rec.center.y + 200,BULLET_MOVE_DIS,0.6,0.6,this.cvs,1));
                    }
                    setTimeout(()=>{
                        for(let i = 0; i < 3; i++) {
                            this.cvs.enemyBullets.push(new Bullet("blue_2",this.rec.center.x,this.rec.center.y + 30,this.rec.center.x - i * 50,this.rec.center.y + 200,BULLET_MOVE_DIS,0.6,0.6,this.cvs,1));
                            this.cvs.enemyBullets.push(new Bullet("blue_2",this.rec.center.x,this.rec.center.y + 30,this.rec.center.x + i * 50,this.rec.center.y + 200,BULLET_MOVE_DIS,0.6,0.6,this.cvs,1));
                        }
                    },800);
                    break;
                case 'green':
                    this.cvs.enemyBullets.push(new Bullet("purple_2",this.rec.center.x - 50,this.rec.center.y + 40,this.rec.center.x - 50,this.rec.center.y + 200,BULLET_MOVE_DIS,0.4,0.4,this.cvs,1));
                    this.cvs.enemyBullets.push(new Bullet("purple_2",this.rec.center.x + 50,this.rec.center.y + 40,this.rec.center.x + 50,this.rec.center.y + 200,BULLET_MOVE_DIS,0.4,0.4,this.cvs,1));
                    break;
                case 'purple':
                    this.cvs.enemyBullets.push(new Bullet("red_2",this.rec.center.x + 50,this.rec.center.y + 40,this.cvs.fly1.rec.center.x,this.cvs.fly1.rec.center.y,BULLET_MOVE_DIS,1,1,this.cvs,3,25));
                    this.cvs.enemyBullets.push(new Bullet("red_2",this.rec.center.x - 50,this.rec.center.y + 40,this.cvs.fly2.rec.center.x,this.cvs.fly2.rec.center.y,BULLET_MOVE_DIS,1,1,this.cvs,3,25));
                    break;
                case 'boss':
                    switch(this.b_b_t.type) {
                        case 0 :
                            this.b_b_t.x1 = this.rec.center.x + 260 + this.b_b_t.t * 60;
                            this.b_b_t.x2 = this.rec.center.x - 260 - this.b_b_t.t * 60;
                            this.b_b_t.t += this.b_b_t.count;
                            if(this.b_b_t.t > 8 || this.b_b_t.t < -8) {
                                this.b_b_t.count = -this.b_b_t.count;
                            }
                            this.cvs.enemyBullets.push(new Bullet("red_2",this.rec.center.x + 260,this.rec.center.y + 100,this.b_b_t.x1,this.rec.center.y + 500,BULLET_MOVE_DIS,0.8,0.8,this.cvs,1.8));
                            this.cvs.enemyBullets.push(new Bullet("red_2",this.rec.center.x - 260,this.rec.center.y + 100,this.b_b_t.x2,this.rec.center.y + 500,BULLET_MOVE_DIS,0.8,0.8,this.cvs,1.8));
                            break;
                        case 1 :
                            this.b_b_t.x1 = Math.floor(Math.floor(Math.random() * 3) * 60);
                            this.b_b_t.x2 = Math.floor(Math.floor(Math.random() * 3) * 60);
                            this.cvs.enemyBullets.push(new Bullet("red_2",this.rec.center.x + 260,this.rec.center.y + 100,this.b_b_t.x1 + this.rec.center.x + 260,this.rec.center.y + 500,BULLET_MOVE_DIS,0.6,0.6,this.cvs,1.8));
                            this.cvs.enemyBullets.push(new Bullet("red_2",this.rec.center.x - 260,this.rec.center.y + 100,this.b_b_t.x2 + this.rec.center.x - 260,this.rec.center.y + 500,BULLET_MOVE_DIS,0.6,0.6,this.cvs,1.8));
                            this.cvs.enemyBullets.push(new Bullet("blue_2",this.rec.center.x + 80,this.rec.center.y + 80,this.b_b_t.x1 + this.rec.center.x + 80,this.rec.center.y + 500,BULLET_MOVE_DIS,0.6,0.6,this.cvs,1));
                            this.cvs.enemyBullets.push(new Bullet("blue_2",this.rec.center.x - 80,this.rec.center.y + 80,this.b_b_t.x2  + this.rec.center.x - 80,this.rec.center.y + 500,BULLET_MOVE_DIS,0.6,0.6,this.cvs,1));
                            if(this.hp > 25000) break;
                        case 2 :
                            this.cvs.enemyBullets.push(new Bullet("purple_2",this.rec.center.x + 40,this.rec.center.y + 30,this.rec.center.x + 250,this.rec.center.y + 500,BULLET_MOVE_DIS,0.6,0.6,this.cvs,1.8));
                            this.cvs.enemyBullets.push(new Bullet("purple_2",this.rec.center.x - 40,this.rec.center.y + 30,this.rec.center.x - 250,this.rec.center.y + 500,BULLET_MOVE_DIS,0.6,0.6,this.cvs,1.8));
                            this.cvs.enemyBullets.push(new Bullet("purple_2",this.rec.center.x + 40,this.rec.center.y + 30,this.rec.center.x + 250,this.rec.center.y - 500,BULLET_MOVE_DIS,0.6,0.6,this.cvs,1.8));
                            this.cvs.enemyBullets.push(new Bullet("purple_2",this.rec.center.x - 40,this.rec.center.y + 30,this.rec.center.x - 250,this.rec.center.y - 500,BULLET_MOVE_DIS,0.6,0.6,this.cvs,1.8));
                            this.cvs.enemyBullets.push(new Bullet("purple_2",this.rec.center.x + 40,this.rec.center.y + 30,this.rec.center.x + 510,this.rec.center.y + 500,BULLET_MOVE_DIS,0.6,0.6,this.cvs,1.8));
                            this.cvs.enemyBullets.push(new Bullet("purple_2",this.rec.center.x - 40,this.rec.center.y + 30,this.rec.center.x - 510,this.rec.center.y + 500,BULLET_MOVE_DIS,0.6,0.6,this.cvs,1.8));
                            this.cvs.enemyBullets.push(new Bullet("purple_2",this.rec.center.x + 40,this.rec.center.y + 30,this.rec.center.x + 510,this.rec.center.y - 500,BULLET_MOVE_DIS,0.6,0.6,this.cvs,1.8));
                            this.cvs.enemyBullets.push(new Bullet("purple_2",this.rec.center.x - 40,this.rec.center.y + 30,this.rec.center.x - 510,this.rec.center.y - 500,BULLET_MOVE_DIS,0.6,0.6,this.cvs,1.8));
                            this.cvs.enemyBullets.push(new Bullet("purple_2",this.rec.center.x + 40,this.rec.center.y + 30,this.rec.center.x + 40,this.rec.center.y + 500,BULLET_MOVE_DIS,0.6,0.6,this.cvs,1.8));
                            this.cvs.enemyBullets.push(new Bullet("purple_2",this.rec.center.x - 40,this.rec.center.y + 30,this.rec.center.x - 40,this.rec.center.y + 500,BULLET_MOVE_DIS,0.6,0.6,this.cvs,1.8));
                            this.cvs.enemyBullets.push(new Bullet("purple_2",this.rec.center.x + 40,this.rec.center.y + 30,this.rec.center.x + 40,this.rec.center.y - 500,BULLET_MOVE_DIS,0.6,0.6,this.cvs,1.8));
                            this.cvs.enemyBullets.push(new Bullet("purple_2",this.rec.center.x - 40,this.rec.center.y + 30,this.rec.center.x - 40,this.rec.center.y - 500,BULLET_MOVE_DIS,0.6,0.6,this.cvs,1.8));
                            this.cvs.enemyBullets.push(new Bullet("purple_2",this.rec.center.x + 40,this.rec.center.y + 30,this.rec.center.x + 100,this.rec.center.y + 30,BULLET_MOVE_DIS,0.6,0.6,this.cvs,1.8));
                            this.cvs.enemyBullets.push(new Bullet("purple_2",this.rec.center.x - 40,this.rec.center.y + 30,this.rec.center.x - 100,this.rec.center.y + 30,BULLET_MOVE_DIS,0.6,0.6,this.cvs,1.8));
                            this.cvs.enemyBullets.push(new Bullet("purple_2",this.rec.center.x + 40,this.rec.center.y + 30,this.rec.center.x + 100,this.rec.center.y + 30,BULLET_MOVE_DIS,0.6,0.6,this.cvs,1.8));
                            this.cvs.enemyBullets.push(new Bullet("purple_2",this.rec.center.x - 40,this.rec.center.y + 30,this.rec.center.x - 100,this.rec.center.y + 30,BULLET_MOVE_DIS,0.6,0.6,this.cvs,1.8));
                            break;
                    }
                    if(this.b_b_t.flag) {
                        this.b_b_t.flag = false;
                        setTimeout(() => {
                            this.b_b_t.type = Math.floor(Math.random()*3);
                            this.b_b_t.flag = true;
                        }, 10000);
                    }
                    break;
            }
        }
    }
}