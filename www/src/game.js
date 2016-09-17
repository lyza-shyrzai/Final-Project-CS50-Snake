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
    ctor: function(sprite) {
        /* Вызов конструктора суперкласса с передачей ему спрайта, представляющего фрагмент тела змеи */
        this._super(sprite);
    },
    move: function(posX, posY) {
        /* Обновляем текущую позицию */
        this.x = posX;
        this.y = posY;
    },
});

var SnakeLayer = cc.Layer.extend({
    snakeHead: null,
    ctor: function () {
         /* Размер окна */
        var winSize = cc.view.getDesignResolutionSize();
        
         /* Вызов конструктора суперкласса */
        this._super();
        
        /* Создание головы змеи */
        this.snakeHead = new SnakePart(asset.SnakeHead_png);
        
        /* Координаты для головы змеи */
        this.snakeHead.x = winSize.width / 2;
        this.snakeHead.y = winSize.height / 2;
        
        /* Добавление головы в качестве объекта-потомка слоя */
        this.addChild(this.snakeHead);
        
        /* Запланируем обновления */
        this.scheduleUpdate();
    },
    
    moveSnake: function(dir) {
        
        /* Набор значений, задающих направление перемещения */
        var up = 1, down = -1, left = -2, right = 2, step = 20;
        
        /* Перенесём переменную snakeHead в локальную область видимости */ 
        var snakeHead = this.snakeHead;
        
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
    },
    
    update: function() {
        /* Число, соответствующее направлению */
        var up = 1;
        this.moveSnake(up);
    },
});