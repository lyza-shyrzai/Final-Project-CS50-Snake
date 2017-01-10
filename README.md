# Snake50
![](https://github.com/Liza-S/Final-Project-CS50-Snake/blob/first/Screenshots/3.png)

The app is done as CS50 Final Project. So I made all the tasks programmatically and will introduce You what I have done overall.

This is Snake50 - a classical game "Snake" for Android and iOS.

1. Created window [game start](https://github.com/Liza-S/Final-Project-CS50-Snake/blob/first/Screenshots/1.png)
2. Created playfield, which consists of:
  1. Snake
  2. Obstacle - stone
  3. Treats - cookies
  4. Inscriptions, which counted game score
3. Snake is moving with a certain speed
4. When the snake reaches the edge of the screen, it appears from the opposite edge of the screen
5. Every time, when the snake eats a cookie, the following things are happening:
  1. Snake is incremented by one ball
  2. The score is increased by one
  3. Obstacle - the stone changes its location randomly
  4. Cookie changes its location randomly too
6. When the snake bumps into itself or hits the stone, the [Game Over](https://github.com/Liza-S/Final-Project-CS50-Snake/blob/first/Screenshots/4.png) screen appears
