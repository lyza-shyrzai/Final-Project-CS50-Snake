var GameScene  = cc.Scene.extend({
    snake_layer: {},
    
    onEnter:function () {
        this._super();
    
    this.snake_layer = new SnakeLayer ();
    
    this.addChild(this.snake_layer, 0);
    }
});