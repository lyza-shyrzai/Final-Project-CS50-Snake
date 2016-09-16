var asset = {
    SnakeHead_png : "asset/snake_head.png",
    SnakeBody_png : "asset/snake_body.png",
    SnakeBiscuit_png : "asset/snake_biscuit.png"
};

var g_resources = [];
for (var i in asset) {
    g_resources.push(asset[i]);
}
