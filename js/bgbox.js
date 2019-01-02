const BG_MOVE_DELAY = 10;
const BG_MOVE_SPEED = 0.2;
/**
 * HTML文件中存放敌机,掉落物的容器,同时也是背景图接受一个参数:画布
 * @param {Object} cvs 
 */
function Bgbox(cvs) {
    if(Bgbox.this_) return Bgbox.this_;
    this.elm = document.getElementById('bg');
    this.y = 0;
    this.cvs = cvs;
    this.elm.style.bottom = this.y + "px";
    this.map = [//地图关卡,按照背景图的位置,慢慢加入设计好的敌机
        {
            posY : -30,
            enemyType : 'blue',
            originX : -100,
            originY : 0,
            beziers : [{control1 : {x : -100, y : 500},control2 : {x : innerWidth + 500, y : 500},end : {x : innerWidth + 500, y : 500}}],
            count : 8,
            yModify : -10,
            hp : 20
        },
        {
            posY : -200,
            enemyType : 'blue',
            originX : innerWidth + 100,
            originY : 0,
            beziers : [{control1 : {x : innerWidth + 100, y : 500},control2 : {x : -500, y : 500},end : {x : -500, y : 500}}],
            count : 8,
            yModify : -10,
            hp : 20
        },
        {
            posY : -400,
            enemyType : 'blue',
            originX : innerWidth / 2 - 100,
            originY : -100,
            beziers : [{control1 : {x : innerWidth / 2 - 100, y : 500},control2 : {x : innerWidth + 500, y : 500},end : {x : innerWidth + 500, y : 500}}],
            count : 8,
            yModify : -10,
            hp : 30
        },
        {
            posY : -400,
            enemyType : 'blue',
            originX : innerWidth / 2 + 100,
            originY : -100,
            beziers : [{control1 : {x : innerWidth / 2 + 100, y : 500},control2 : {x : -500, y : 500},end : {x : -500, y : 500}}],
            count : 8,
            yModify : -10,
            hp : 30
        },
        {
            posY : -520,
            enemyType : 'blue+',
            originX : innerWidth + 100,
            originY : 100,
            beziers : [{control1 : {x : innerWidth + 100, y : 100},control2 : {x : -500, y : 100},end : {x : -500, y : 100}}],
            count : 8,
            yModify : -10,
            hp : 30
        },
        {
            posY : -560,
            enemyType : 'blue+',
            originX : -100,
            originY : 10,
            beziers : [{control1 : {x : -100, y : 10},control2 : {x : -500, y : 10},end : {x :innerWidth + 500, y : 10}}],
            count : 8,
            yModify : -10,
            hp : 30
        },
        {
            posY : -700,
            enemyType : 'blue++',
            originX : 200,
            originY : -200,
            beziers : [{control1 : {x : 200, y : -200},control2 : {x : 200, y : 80},end : {x : 200, y : 80}}],
            count : 0,
            yModify : 0,
            hp : 1000
        },
        {
            posY : -700,
            enemyType : 'blue++',
            originX : innerWidth - 400,
            originY : -200,
            beziers : [{control1 : {x : innerWidth - 400, y : -200},control2 : {x : innerWidth - 400, y : 80},end : {x : innerWidth - 400, y : 80}}],
            count : 0,
            yModify : 0,
            hp : 1000
        },
        {
            posY : -800,
            enemyType : 'blue',
            originX : innerWidth / 2 - 100,
            originY : -100,
            beziers : [{control1 : {x : innerWidth / 2 - 100, y : 500},control2 : {x : innerWidth + 500, y : 500},end : {x : innerWidth + 500, y : 500}}],
            count : 8,
            yModify : -10,
            hp : 50
        },
        {
            posY : -800,
            enemyType : 'blue',
            originX : innerWidth / 2 + 100,
            originY : -100,
            beziers : [{control1 : {x : innerWidth / 2 + 100, y : 500},control2 : {x : -500, y : 500},end : {x : -500, y : 500}}],
            count : 8,
            yModify : -10,
            hp : 50
        },
        {
            posY : -1000,
            enemyType : 'purple',
            originX : 1000,
            originY : -200,
            beziers : [{control1 : {x : 1000, y : -200},control2 : {x : 1000, y : 100},end : {x : 1000, y : 100}}],
            count : 0,
            yModify : 0,
            hp : 1600
        },
        {
            posY : -1100,
            enemyType : 'purple',
            originX : 200,
            originY : -200,
            beziers : [{control1 : {x : 200, y : -200},control2 : {x : 200, y : 100},end : {x : 200, y : 100}}],
            count : 0,
            yModify : 0,
            hp : 1600
        },
        {
            posY : -1300,
            enemyType : 'green',
            originX : 400,
            originY : -200,
            beziers : [{control1 : {x : 400, y : -200},control2 : {x : 400, y : 10},end : {x : 400, y : 10}}],
            count : 0,
            yModify : 0,
            hp : 1740
        },
        {
            posY : -1350,
            enemyType : 'purple',
            originX : innerWidth + 200,
            originY : 0,
            beziers : [{control1 : {x : innerWidth + 200, y : 0},control2 : {x : innerWidth / 2 - 350, y : 250},end : {x : innerWidth / 2 - 350, y : 250}},
                {control1 : {x : innerWidth / 2 - 350, y : 250},control2 : {x : -500, y : 500},end : {x : -500, y : 500}}
            ],
            count : 0,
            yModify : 0,
            hp : 1800
        },
        {
            posY : -1400,
            enemyType : 'green',
            originX : 900,
            originY : -200,
            beziers : [{control1 : {x : 900, y : -200},control2 : {x : 900, y : 10},end : {x : 900, y : 10}}],
            count : 0,
            yModify : 0,
            hp : 1800
        },
        {
            posY : -1600,
            enemyType : 'boss',
            originX : 500,
            originY : -400,
            beziers : 
            [{control1 : {x : 500, y : -400},control2 : {x : 500, y : -80},end : {x : 500, y : -80}},
            {control1 : {x : 500, y : -80},control2 : {x : 100, y : -80},end : {x : 100, y : -80}},
            {control1 : {x : 100, y : -80},control2 : {x : 500, y : -80},end : {x : 500, y : -80}},
            {control1 : {x : 500, y : -80},control2 : {x : 900, y : -80},end : {x : 900, y : -80}},
            {control1 : {x : 900, y : -80},control2 : {x : 500, y : -80},end : {x : 500, y : -80}},
            ],
            count : 0,
            yModify : 0,
            hp : 50000
        },
        {
            posY : -1900,
            enemyType : 'blue',
            originX : -100,
            originY : 0,
            beziers : [{control1 : {x : -100, y : 500},control2 : {x : innerWidth + 500, y : 500},end : {x : innerWidth + 500, y : 500}}],
            count : 8,
            yModify : -10,
            hp : 20
        },
        {
            posY : -2100,
            enemyType : 'blue+',
            originX : innerWidth + 100,
            originY : 100,
            beziers : [{control1 : {x : innerWidth + 100, y : 100},control2 : {x : -500, y : 100},end : {x : -500, y : 100}}],
            count : 8,
            yModify : -10,
            hp : 30
        },
        {
            posY : -2100,
            enemyType : 'blue+',
            originX : -100,
            originY : 10,
            beziers : [{control1 : {x : -100, y : 10},control2 : {x : -500, y : 10},end : {x :innerWidth + 500, y : 10}}],
            count : 8,
            yModify : -10,
            hp : 30
        },
        {
            posY : -2200,
            enemyType : 'blue',
            originX : innerWidth / 2 + 100,
            originY : -100,
            beziers : [{control1 : {x : innerWidth / 2 + 100, y : 500},control2 : {x : -500, y : 500},end : {x : -500, y : 500}}],
            count : 8,
            yModify : -10,
            hp : 50
        },
        {
            posY : -2300,
            enemyType : 'purple',
            originX : 1000,
            originY : -200,
            beziers : [{control1 : {x : 1000, y : -200},control2 : {x : 1000, y : 100},end : {x : 1000, y : 100}}],
            count : 0,
            yModify : 0,
            hp : 1600
        },
        {
            posY : -2300,
            enemyType : 'purple',
            originX : 200,
            originY : -200,
            beziers : [{control1 : {x : 200, y : -200},control2 : {x : 200, y : 100},end : {x : 200, y : 100}}],
            count : 0,
            yModify : 0,
            hp : 1600
        },
        {
            posY : -2400,
            enemyType : 'green',
            originX : 400,
            originY : -200,
            beziers : [{control1 : {x : 400, y : -200},control2 : {x : 400, y : 10},end : {x : 400, y : 10}}],
            count : 0,
            yModify : 0,
            hp : 1740
        },
        {
            posY : -2450,
            enemyType : 'purple',
            originX : innerWidth + 200,
            originY : 0,
            beziers : [{control1 : {x : innerWidth + 200, y : 0},control2 : {x : innerWidth / 2 - 350, y : 250},end : {x : innerWidth / 2 - 350, y : 250}},
                {control1 : {x : innerWidth / 2 - 350, y : 250},control2 : {x : -500, y : 500},end : {x : -500, y : 500}}
            ],
            count : 0,
            yModify : 0,
            hp : 1800
        }
    ];
    this.moveInterval = setInterval(()=>{
        this.move();
    },BG_MOVE_DELAY);
    Bgbox.this_ = this;
    return Bgbox.this_;
}
Bgbox.prototype = {
    construct : Bgbox,
    move : function() {
        this.y -= BG_MOVE_SPEED;
        this.elm.style.bottom = this.y + "px";
        for(var i = 0; i < this.map.length; i++) {
            if(this.y <= this.map[i].posY) {
                var t = this.map[i];
                this.cvs.enemys.push(new Enemy(t.enemyType,this.cvs,t.originX,t.originY,t.beziers,t.hp));
                if(t.count > 0) {
                    t.count--;
                    t.posY += t.yModify;
                } else {
                    this.map.splice(i--,1);
                }                
            }
        }
        if(this.y < -9000) {
            clearInterval(this.moveInterval);
        }
    }
}