var GameScene  = cc.Scene.extend({
    snake_layer: {},
    
    onEnter:function () {
        this._super();
    
    this.score_layer = new ScoreLayer ();    
    this.snake_layer = new SnakeLayer ();
    
    this.addChild(this.score_layer, 1);    
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
    biscuit: null, // ссылка на печенье
    stone: null,
    curDir: 0,/* направление перемещения, соответствующее заданным ранее переменным */
    nextDir: 0,
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
        
        /* Дополнение для работы с печеньем */
        this.updateBiscuit();
        
        /* Дополнение для работы с препятстсвием - камнем */
        this.updateStone();
        
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
                        //targ.curDir = keyMap[keyCode];
                        targ.nextDir = keyMap[keyCode];
                    }
            }
        }, this);
        
        /* Прослушиватель для организации сенсорного управления */
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function() {
                
                /* Позволяет задействовать onTouchMoved, если возвращено true */
                return true;
            },
            
            onTouchMoved: function(touch, event) {
                var targ = event.getCurrentTarget();
                var up = 1, down = -1, left = -2, right = 2;
                
                /* Получаем расстояние перемещения */
                var delta = touch.getDelta();
                
                /* Если было касание с протягиванием */
                if (delta.x !== 0 && delta.y !== 0)
                    {
                        if (Math.abs(delta.x) > Math.abs(delta.y))
                            {
                                /* Определяем направление, получая знак */
                                //targ.curDir = Math.sign(delta.x) * right;
                                targ.nextDir = Math.sign(delta.x) * right;
                            }
                        else if (Math.abs(delta.x) < Math.abs(delta.y))
                            {
                                /* Определяем направление, получая знак */
                                //targ.curDir = Math.sign(delta.y) * up;
                                targ.nextDir = Math.sign(delta.y) * up;
                            }
                    }
                /* Если было простое касание, без протягивания, не делаем ничего */
            }
        }, this);
        
    },
    
    moveSnake: function() {
        
        /* Набор значений, задающих направление перемещения */
        var up = 1, down = -1, left = -2, right = 2, step = 10;
        
        /* Перенесём переменную snakeHead в локальную область видимости */ 
        var snakeHead = this.snakeParts[0];
        
        /* Сопоставление направлений и реализующего перемещения кода */
        var dirMap = {};
        dirMap[up] = function() {snakeHead.move(snakeHead.x, snakeHead.y + step);};
        dirMap[down] = function() {snakeHead.move(snakeHead.x, snakeHead.y - step);};
        dirMap[left] = function() {snakeHead.move(snakeHead.x - step, snakeHead.y);};
        dirMap[right] = function() {snakeHead.move(snakeHead.x + step, snakeHead.y);};
        
        /* Меняем направление движения, если оно не является противоположным текущему или если змея состоит лишь из головы */
        if ((this.nextDir * -1) != this.curDir || this.snakeParts.length == 1)
            {
                this.curDir = this.nextDir;
            }
        
        /* Перемещаем голову в заданном направлении */
        if (dirMap[this.curDir] !== undefined) {
            dirMap[this.curDir] ();
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
            this.moveSnake(this.nextDir);
            this.moveSnake();
            
            /* Проверяем, столкнулась ли голова змеи с границей экрана, её телом или с печеньем */
            this.checkCollision();
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
    },
    
    updateBiscuit: function() {
        /* Если печенье уже есть на игровом экране */
        if (this.biscuit) {
            /* Переместить его */
            this.biscuit.randPosition(this.snakeParts);        
        /* Если нет */
        } else {
            /* Создать новый спрайт */
            this.biscuit = new Biscuit(this.snakeParts);
            /* и добавить к сцене в качестве объекта-потомка */
            this.addChild(this.biscuit);
        }
            
    },
    
    updateStone: function() {
        /* Если камень уже есть на игровом экране */
        if (this.stone) {
            /* Переместить его */
            this.stone.randPosition(this.snakeParts);        
        /* Если нет */
        } else {
            /* Создать новый спрайт */
            this.stone = new Stone(this.snakeParts);
            /* и добавить к сцене в качестве объекта-потомка */
            this.addChild(this.stone);
        }
    },
    
    checkCollision: function()
    {
        var winSize = cc.view.getDesignResolutionSize();
        var head = this.snakeParts[0];
        var body = this.snakeParts;
        
        /* Проверка столкновения с границей экрана */
        if (head.x < 0)
            {
                head.x = winSize.width;
            }
        else if (head.x > winSize.width)
            {
                head.x = 0;
            }
        if (head.y < 0)
            {
                head.y = winSize.height;
            }
        else if (head.y > winSize.height)
            {
                head.y = 0;
            }
        
        /* Проверка столкновения с собой */
        for (var part = 1; part < body.length; part++)
            {
                if (head.x == body[part].x && head.y == body[part].y)
                    {
                        /* Запуск сцены GameOver */
                        //this.snakeParts = null;
                        cc.director.runScene(
                        new GameOverScene 
                            (this.parent.score_layer.score)
                        );
                    }
            }
        
        /* Проверка столкновения с печеньем */
        if (head.x == this.biscuit.x && head.y == this.biscuit.y)
            {
                /* Увеличиваем число набранных очков */
                this.parent.score_layer.scoreIncrease();
                
                /* Обновление позиции печенья */
                this.updateBiscuit();
                
                /* Увеличение длины змеи */
                this.addPart();
            }
    },
});

var Biscuit = cc.Sprite.extend({
    winSize: 0,
    ctor: function(snakeParts) {
        /* Вызов метода суперкласса */        
        this._super(asset.SnakeBiscuit_png);          
        /* Настройка winSize */
        this.winSize = cc.view.getDesignResolutionSize();
        /* Установка позиции спрайта */
        this.randPosition(snakeParts);
        
        
    },
    
    randPosition: function(snakeParts) {            
        var step = 20;
        var randNum = function(range) {
            /* Возвратим случайную позицию в пределах диапазона range */
            return Math.floor(Math.random() * range);        
        };
        /* Диапазон возможных координат, где может располагаться печенье */
        var range = {
            x: (this.winSize.width / step) - 1,
            y: (this.winSize.height / step) - 1             
        }                          
        /* Возможная позиция */
        var possible = {
             x: randNum(range.x) * step,
             y: randNum(range.y) * step
        }                        
        var flag = true;
        var hit = false;
        
        /* Если нужна дополнительная попытка */
        while (flag) {            
            /* Для каждого фрагмента змеи */
            for (var part = 0; part < snakeParts.length; part++) {
     /* Проверяем сгенерированные координаты на столкновение с любым фрагментом змеи */
if (snakeParts[part].x == possible.x && 
    snakeParts[part].y == possible.y) 
    {
                    /* Если столкновение произошло, установим переменную hit */
                    hit = true;
                }
            }
            /* Если было обнаружено столкновение */
            if (hit == true) {                
                /* Попытаемся снова */
                possible.x = randNum(range.x) * step;
                possible.y = randNum(range.y) * step;                
                hit = false;
            } else { /* В противном случае */
                /* Новая позиция найдена */
                flag = false;
                this.x = possible.x;
                this.y = possible.y;
            }            
        }        
    },    
});

var Stone = cc.Sprite.extend({
    winSize: 0,
    ctor: function(snakeParts) {
        /* Вызов метода суперкласса */        
        this._super(asset.SnakeStone_png);          
        /* Настройка winSize */
        this.winSize = cc.view.getDesignResolutionSize();
        /* Установка позиции спрайта */
        this.randPosition(snakeParts);
        
        
    },
    
    randPosition: function(snakeParts) {            
        var step = 20;
        var randNum = function(range) {
            /* Возвратим случайную позицию в пределах диапазона range */
            return Math.floor(Math.random() * range);        
        };
        /* Диапазон возможных координат, где может располагаться камень */
        var range = {
            x: (this.winSize.width / step) - 1,
            y: (this.winSize.height / step) - 1             
        }                          
        /* Возможная позиция */
        var possible = {
             x: randNum(range.x) * step,
             y: randNum(range.y) * step
        }                        
        var flag = true;
        var hit = false;
        
        /* Если нужна дополнительная попытка */
        while (flag) {            
            /* Для каждого фрагмента змеи */
            for (var part = 0; part < snakeParts.length; part++) {
     /* Проверяем сгенерированные координаты на столкновение с любым фрагментом змеи */
if (snakeParts[part].x == possible.x && 
    snakeParts[part].y == possible.y) 
    {
                    /* Если столкновение произошло, установим переменную hit */
                    hit = true;
                }
            }
            /* Если было обнаружено столкновение */
            if (hit == true) {                
                /* Попытаемся снова */
                possible.x = randNum(range.x) * step;
                possible.y = randNum(range.y) * step;                
                hit = false;
            } else { /* В противном случае */
                /* Новая позиция найдена */
                flag = false;
                this.x = possible.x;
                this.y = possible.y;
            }            
        }        
    },    
});



var ScoreLayer = cc.Layer.extend({
    score: 0,
    labelScore: null,
    ctor: function() {
        /* Вызываем конструктор суперкласса */
        this._super();
        /* Инициализация */
        this.init();
    },
    init: function() {
        /* Создаём текст для вывода сведений об очках */
        this.labelScore = cc.LabelTTF.create("Score: 0");
        this.labelScore.setColor(cc.color(255, 255, 255, 255));
        this.labelScore.setPosition(cc.p(240, 700));
        this.addChild(this.labelScore);
    },
    
    scoreIncrease: function() {
        /* Увеличиваем набранные очки и обновляем текст */
        this.score += 1;
        this.labelScore.setString("Score: " + this.score);
    },
});

var MenuScene = cc.Scene.extend({
    titleSprite: {},
    subTitleSprite: {},
    onEnter: function() {
        this._super();
        /* Получим размер окна */
        var winSize = cc.view.getDesignResolutionSize();
        
        /* Создадим заголовок */
        this.titleSprite = cc.LabelTTF.create("Snake50", "Arial", 50);
        this.titleSprite.x = winSize.width / 2;
        this.titleSprite.y = winSize.height / 2;
        this.addChild(this.titleSprite);
        
        /* Создаём подзаголовок */
        this.subTitleSprite = cc.LabelTTF.create("Click anywhere to play", "Arial", 20);
        this.subTitleSprite.x = winSize.width / 2;
        this.subTitleSprite.y = winSize.height / 2 - 80;
        this.addChild(this.subTitleSprite);
        
        /* Добавляем прослушиватель события касания для запуска игры */
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touches, event) {
                cc.director.runScene(new GameScene());
            },
        }, this);
    },
});

var GameOverScene = cc.Scene.extend({
    finalScore: 0,
    labelGameOver: {},
    labelScore: {},
    labelPrompt: {},
    ctor: function(score) {
        this._super();
        this.finalScore = score;
        
        /* Прослушиватель события касания, запускает экран меню */
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touch, event) {
                cc.director.runScene(new MenuScene());
            }
        }, this);
    },
    
    onEnter: function() {
        this._super();
        /* размер окна */
        var winSize = cc.view.getDesignResolutionSize();
        /* Надписи для сцены GameOver */
        this.labelGameOver = new cc.LabelTTF("Game Over :(", "Arial", 60);
        this.labelGameOver.x = winSize.width * 0.50;
        this.labelGameOver.y = winSize.height * 0.50;
        this.addChild(this.labelGameOver);
        
        /* Надпись, содержащая сведения о набранных очках */
        this.labelScore = new cc.LabelTTF("Score: " + this.finalScore, "Arial", 30);
        this.labelScore.x = winSize.width * 0.50;
        this.labelScore.y = winSize.height * 0.43;
        this.addChild(this.labelScore);
        
        /* Предложение сыграть снова */
        this.labelPrompt = new cc.LabelTTF("Click or Tap To Try Again");
        this.labelPrompt.x = winSize.width * 0.50;
        this.labelPrompt.y = winSize.height * 0.39;
        this.addChild(this.labelPrompt);
    },
});