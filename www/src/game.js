var GameScene  = cc.Scene.extend({
    snake_layer: {},
    
    onEnter:function () {
        this._super();
    
    this.snake_layer = new SnakeLayer ();
    
    this.addChild(this.snake_layer, 0);
    }
});

//описания одного сегмента змейки
var SnakePart = cc.Sprite.extend({
    prevX: this.x,
    prevY: this.y,
    ctor: function(sprite) {
        /* Вызов конструктора суперкласса с передачей ему спрайта, представляющего фрагмент тела змеи */
        this._super(sprite);
    },
    move: function(posX, posY) {
        /* Установим предыдущее расположение */
        this.prevX = this.x;
        this.prevY = this.y;
        /* Обновляем текущую позицию */
        this.x = posX;
        this.y = posY;
    },
});

var SnakeLayer = cc.Layer.extend({
    snakeParts: null,
    curDir: 0, /* направление перемещения, соответствующее заданным ранее переменным */
    interval: 0.25, //секунды
    counter: this.interval,
    ctor: function () {
         /* Размер окна */
        var winSize = cc.view.getDesignResolutionSize();
        
         /* Вызов конструктора суперкласса */
        this._super();
        
        /* Инициализируем массив snakeParts */
        this.snakeParts = [];   
        
        /* Создание головы змеи */
        var snakeHead = new SnakePart(asset.SnakeHead_png);
        
        /* Координаты для головы змеи */
        snakeHead.x = winSize.width / 2;
        snakeHead.y = winSize.height / 2;
        
        /* Добавление головы в качестве объекта-потомка слоя */
        this.addChild(snakeHead);
        this.snakeParts.push(snakeHead);
        
        /* Запланируем обновления */
        this.scheduleUpdate();
        
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(keyCode, event) {
                var targ = event.getCurrentTarget();
                
                /* Набор значений, задающих направление перемещения */
                var up = 1, down = -1, left = -2, right = 2;
                
                 /* Объект, в котором клавишам поставлены в соответствие направления */
                var keyMap = {};
                keyMap[87] = up; // w
                keyMap[83] = down; // s
                keyMap[65] = left; // a
                keyMap[68] = right; // d
                
                /* Обработка нажатий на клавиши */
                if (keyMap[keyCode] !== undefined)
                    {
                        targ.curDir = keyMap[keyCode];
                    }
            }
        }, this);
        
        for (var parts = 0; parts < 10; parts++) 
            {
                this.addPart();
            }
    },
    
    moveSnake: function(dir) {
        
        /* Набор значений, задающих направление перемещения */
        var up = 1, down = -1, left = -2, right = 2, step = 20;
        
        /* Перенесём переменную snakeHead в локальную область видимости */ 
        var snakeHead = this.snakeParts[0];
        
        /* Сопоставление направлений и реализующего перемещения кода */
        var dirMap = {};
        dirMap[up] = function() {snakeHead.move(snakeHead.x, snakeHead.y + step);};
        dirMap[down] = function() {snakeHead.move(snakeHead.x, snakeHead.y - step);};
        dirMap[left] = function() {snakeHead.move(snakeHead.x - step, snakeHead.y);};
        dirMap[right] = function() {snakeHead.move(snakeHead.x + step, snakeHead.y);};
        
        /* Перемещаем голову в заданном направлении */
        if (dirMap[dir] !== undefined) {
            dirMap[dir] ();
        }
        
        /* Сохраняем текущую позицию головы для следующего фрагмента змеи */
        var prevX = snakeHead.prevX;
        var prevY = snakeHead.prevY;
        
        /* Перемещаем остальные части змеи */
        for (var part = 1; part < this.snakeParts.length; part++)
            {
                var curPart = this.snakeParts[part];
                /* Перемещаем текущую часть, сохраняем её предыдущую позицию для следующей итерации */
                curPart.move(prevX,prevY);
                prevX = curPart.prevX;
                prevY = curPart.prevY;
            }
        
    },
    
    update: function(dt) {
        /* Число, соответствующее направлению */
        var up = 1;
         /* Перемещаем объект только если истёк заданный срок */
        if (this.counter < this.interval) {
            this.counter += dt;
        } else {
            this.counter = 0;
            this.moveSnake(this.curDir);
        }
    },
    
    addPart: function() {
        var newPart = new SnakePart(asset.SnakeBody_png),
            size = this.snakeParts.length,
            tail = this.snakeParts[size - 1];
        
        /* Изначально новая часть расположена в хвосте */
        newPart.x = tail.x;
        newPart.y = tail.y;
        
        /* Добавляем объект в качестве потомка слоя */
        this.addChild(newPart);
        this.snakeParts.push(newPart);
    }
});