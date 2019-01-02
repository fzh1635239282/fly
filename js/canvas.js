/**
 * 画布对象,单例对象,所有的子弹由画布统一绘制,子弹的碰撞检测都在画布中进行
 */
function Cvs() {
    if(Cvs.this) return Cvs.this;
    this.drop_num = 100;                              //敌机掉落物的几率1/8
    this.elm = document.getElementById('cvs');
    this.elm.style.position = "fixed";
    this.elm.style.zIndex = 200;
    this.elm.width = innerWidth;
    this.elm.height = innerHeight;
    this.c = this.elm.getContext('2d');
    this.imgs = {                                   //所有的图片需要先加载再使用
        fly11 : new Image(),
        fly12 : new Image(),
        fly13 : new Image(),
        fly21 : new Image(),
        fly22 : new Image(),
        fly23 : new Image(),
        blue_1 : new Image(),
        blue_2 : new Image(),
        blue_11 : new Image(),
        blue_22 : new Image(),
        purple_1 : new Image(),
        purple_2 : new Image(),
        red_1 : new Image(),
        red_2 : new Image(),
        defence : new Image()
    }
    this.imgs.fly11.src = "../imgs/fly_blue_1.png";
    this.imgs.fly12.src = "../imgs/fly_blue_2.png";
    this.imgs.fly13.src = "../imgs/fly_blue_3.png";
    this.imgs.fly21.src = "../imgs/fly_red_1.png";
    this.imgs.fly22.src = "../imgs/fly_red_1.png";
    this.imgs.fly23.src = "../imgs/fly_red_1.png";
    this.imgs.blue_1.src = "../imgs/cut/blue_1.png";
    this.imgs.blue_2.src = "../imgs/cut/blue_2.png";
    this.imgs.blue_11.src = "../imgs/cut/blue_11.png";
    this.imgs.blue_22.src = "../imgs/cut/blue_22.png";
    this.imgs.purple_1.src = "../imgs/cut/purple_1.png";
    this.imgs.purple_2.src = "../imgs/cut/purple_2.png";
    this.imgs.red_1.src = "../imgs/cut/red_1.png";
    this.imgs.red_2.src = "../imgs/cut/red_2.png";
    this.imgs.defence.src = "../imgs/cut/defence.png";

    this.fly1 = null;                               //保存1号飞机和2号飞机
    this.fly2 = null;

    this.dropItems = [];                            //掉落物数组
    this.enemys = [];                               //敌机数组
    //需要绘制的 敌方子弹,玩家子弹
    this.enemyBullets = [];                         //敌机子弹数组
    this.fly1Bullets = [];                          //1号机子弹数组
    this.fly2Bullets = [];                          //2号机子弹数组

    this.isGameOver = false;                        //游戏结束标志

    setInterval(() => {
        this.draw();
    }, 5);

    Cvs.this = this;
    return Cvs.this;
}
Cvs.prototype = {
    constructor : Cvs,
    draw : function() { //掉落物,敌机子弹碰撞处理,玩家子弹处理,掉落物碰撞处理;敌机子弹,1号机子弹
        this.enemyOut();//2号机子弹绘制
        this.bulletManager(this.fly1Bullets,this.enemys,this.fly1);
        this.bulletManager(this.fly2Bullets,this.enemys,this.fly2);
        this.bulletManager(this.enemyBullets);
        for(var i = 0; i < this.dropItems.length; i++) {
            if(this.dropItemTouchFly(this.dropItems,i,this.fly1)) continue;
            if(this.dropItemTouchFly(this.dropItems,i,this.fly2)) continue;
            if(this.dropItems[i].y > innerHeight + 100) {
                var bg = document.getElementById('bg');
                clearInterval(this.dropItems[i].moveInterval);
                bg.removeChild(this.dropItems[i].elm);
                this.dropItems[i] = null;
                this.dropItems.splice(i,1);
            }
        }
        this.c.clearRect(0,0,this.elm.width,this.elm.height);
        for(i = 0; i < this.enemyBullets.length; i++) {
            this.c.drawImage(this.enemyBullets[i].img,this.enemyBullets[i].rec.x,this.enemyBullets[i].rec.y,this.enemyBullets[i].w,this.enemyBullets[i].h);
        }
        for(i = 0; i < this.fly1Bullets.length; i++) {
            this.c.drawImage(this.fly1Bullets[i].img,this.fly1Bullets[i].rec.x,this.fly1Bullets[i].rec.y,this.fly1Bullets[i].w,this.fly1Bullets[i].h);
        }
        for(i = 0; i < this.fly2Bullets.length; i++) {
            this.c.drawImage(this.fly2Bullets[i].img,this.fly2Bullets[i].rec.x,this.fly2Bullets[i].rec.y,this.fly2Bullets[i].w,this.fly2Bullets[i].h);
        }
    },
    bulletManager : function(b_arr,enemys,fly) {//子弹碰撞处理函数
        for(var i = 0; i < b_arr.length; i++) {//改变子弹位置
            b_arr[i].rec.x += b_arr[i].direc.x * b_arr[i].movePx;
            b_arr[i].rec.y += b_arr[i].direc.y * b_arr[i].movePx;
            b_arr[i].rec.center.x = b_arr[i].rec.x + b_arr[i].w / 2;
            b_arr[i].rec.center.y = b_arr[i].rec.y + b_arr[i].h / 2;
            //子弹飞出屏幕外时,销毁子弹
            if(b_arr[i].rec.x < -b_arr[i].w || b_arr[i].rec.x > innerWidth || b_arr[i].rec.y < -b_arr[i].h || b_arr[i].rec.y > innerHeight ) {
                clearInterval(b_arr[i].interval);
                b_arr[i] = null;
                b_arr.splice(i--,1);
            } else {//当玩家子弹与敌机碰撞时,玩家加分,敌机掉血,敌机死亡时播放爆炸图片
                    //当玩家与敌机子弹碰撞时,玩家掉血,玩家死亡时播放爆炸图片
                if(arguments.length === 3) {
                    for(var j = 0; j < enemys.length; j++) {
                        if(isCollide(b_arr[i].rec,enemys[j].rec)) {
                            fly.score += b_arr[i].atc;
                            fly.status_bar.children[3].firstElementChild.innerHTML = fly.score;
                            enemys[j].hp -= b_arr[i].atc;
                            clearInterval(b_arr[i].interval);
                            b_arr[i] = null;
                            b_arr.splice(i--,1);
                            if(enemys[j].hp <= 0) {
                                let t = Math.floor(Math.random()*this.drop_num);
                                if(t < 2 ) t = 0;
                                else if(t < 12) t = 3;
                                else if(t < 17) t = 1;
                                else if(t < 20) t = 2;
                                else t = -1;
                                if(t != -1) {
                                    this.dropItems.push(new DropItem(enemys[j].rec.center.x,enemys[j].rec.center.y,t));
                                }
                                var bg = document.getElementById('bg');
                                var boom = document.createElement('div');
                                if(enemys[j].type === "boss") {
                                    boom.className = 'bossboom-gif';
                                    boom.style.left = enemys[j].rec.center.x - 100 + "px";
                                    boom.style.top = enemys[j].rec.center.y - 100 + "px";
                                    setTimeout(() => {
                                        alert("你赢了!");
                                        location.reload();
                                    }, 2000);
                                } else {
                                    boom.className = 'boom-gif';
                                    boom.style.left = enemys[j].rec.center.x - 40 + "px";
                                    boom.style.top = enemys[j].rec.center.y - 40 + "px";
                                }
                                bg.appendChild(boom);
                                setTimeout(()=>{//一个偶尔出现的bug
                                    //console.log(boom);
                                    bg.removeChild(boom);
                                },500);
                                bg.removeChild(enemys[j].elm);
                                clearInterval(enemys[j].moveI);
                                clearInterval(enemys[j].createBulletsI);
                                enemys[j] = null;
                                enemys.splice(j--,1);
                            }
                            break;
                        }
                    }
                } else if(arguments.length === 1) {
                    if(this.hitFly(b_arr,i,this.fly1)) continue;
                    if(this.hitFly(b_arr,i,this.fly2)) continue;
                }
            }
        }
    },
    enemyOut : function() {//掉落物移动到屏幕外时销毁掉落物
        for(var i = 0; i < this.enemys.length; i++) {
            if(this.enemys[i].rec.center.x > innerWidth + 300 || this.enemys[i].rec.center.y > innerHeight + 300 || this.enemys[i].rec.center.x < -300 || this.enemys[i].rec.center.y < -300) {
                var bg = document.getElementById('bg');
                bg.removeChild(this.enemys[i].elm);
                clearInterval(this.enemys[i].moveI);
                clearInterval(this.enemys[i].createBulletsI);
                this.enemys[i] = null;
                this.enemys.splice(i--,1);
            }
        }
    },
    hitFly : function(b_arr,i,fly) {//玩家被击
        if(fly.isDie) return false;
        if(isCollide(b_arr[i].rec,fly.rec)) {
            if(!fly.isDefence) {
                fly.hp -= b_arr[i].atc;
                if(fly.hp - b_arr[i].atc < 0) {
                    this.deleteFly(fly);
                }
                fly.status_hp.style.width = fly.hp + "%";
            }
            clearInterval(b_arr[i].interval);
            b_arr[i] = null;
            b_arr.splice(i--,1);
            return true;
        }
    },
    deleteFly : function(fly) {//销毁玩家飞机
        var flybox = document.getElementById('flybox');
        var bg = document.getElementById('bg');
        var boom = document.createElement('div');
        boom.className = 'boom-gif';
        boom.style.left = fly.rec.center.x - 40 + "px";
        boom.style.top = fly.rec.center.y - 40 + "px";
        if(!fly.isDie) {
            fly.hp = 0;
            clearInterval(fly.moveI);
            clearInterval(fly.createBulletsI);
            flybox.removeChild(fly.elm);
            bg.appendChild(boom);
            setTimeout(()=>{bg.removeChild(boom)},500);
        }
        fly.isDie = true;
        if(this.fly1.isDie && this.fly2.isDie) {
            if(!this.isGameOver) {
                this.isGameOver = true;
                setTimeout(() => {
                    alert('你输了!');
                    location.reload();
                }, 1000);
            }
        }
    },
    dropItemTouchFly : function(dropItems,i,fly) {//掉落物与玩家碰撞
        if(fly.isDie) return false;
        if(!(dropItems[i].x > fly.rec.center.x + fly.rec.realDis.x || dropItems[i].x + dropItems[i].w < fly.rec.x || dropItems[i].y > fly.rec.center.y + fly.rec.realDis.y || dropItems[i].y + dropItems[i].h < fly.rec.y)) {
            var bg = document.getElementById('bg');
            fly.score += 100;
            fly.status_bar.children[3].firstElementChild.innerHTML = fly.score;
            switch(dropItems[i].type) {
                case 'dropD':
                    fly.status_defence.innerHTML++;
                    break;
                case 'dropR':
                    fly.hp = fly.hp + 30 > 100 ? 100 : fly.hp + 30;
                    fly.status_hp.style.width = fly.hp + "%";
                    break;
                case 'dropB':
                    fly.status_boom.innerHTML++;
                    break;
                case 'dropU':
                    fly.level++;
                    if(fly.level > 4) fly.level = 4;
                    fly.status_level.innerHTML = fly.level;
                    let t = fly.level > 3 ? 3 : fly.level;
                    fly.elm.style.backgroundImage = "url(../imgs/fly_" + fly.type + "_" + t + ".png)";
                    break;
            }
            clearInterval(dropItems[i].moveInterval);
            bg.removeChild(dropItems[i].elm);
            dropItems[i] = null;
            dropItems.splice(i,1);
            return true;
        }
    }
}