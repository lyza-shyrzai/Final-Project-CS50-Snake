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
         /* Вызов конструктора суперкласса */
        this._super();
        
        /* Создание головы змеи */
        this.snakeHead = new SnakePart(asset.SnakeHead_png);
        /* Добавление головы в качестве объекта-потомка слоя */
        this.addChild(this.snakeHead);
        
    },
});