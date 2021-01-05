# southsista
A low-poly experiment with flocking simulation in three.js. View it [live](https://southsista.serenapascual.com).

![Demo](/res/demo.gif)

## About
[Boids](http://www.red3d.com/cwr/boids/) is the iconic 1986 computer program developed by Craig Reynolds. It modeled the behavior seen in flocks of birds, where members of the flock tend to cluster together, simultaneously keep some distance from one another, and orient themselves in the same direction.

I modeled a butterfly object with primitive shapes and attempted my own implementation of boids.

### Motivation
<img src="/res/summit.JPG" width="640px" alt="Me atop South Sister" />

This project was inspired by South Sister Mountain in Oregon state. A grueling trek of nearly 5,000 feet in elevation gain rewards beautiful views of the mountain's glacial lakes. When I went in August, the summit was swarming with California Tortoiseshell butterflies!

I hope that in my lifetime, I can create things that inspire people to go out into nature or care about the planet a little more.

## To-do
- Tweak algorithm to add noise for more realistic behavior
- Add ability to spawn more butterflies
- Model glacial lake
  - Bring attention to the fact that we are rapidly losing these lakes to climate change :-(

## Credits
Ong Ming Yang's implementation, [macaws](https://github.com/ongmingyang/macaws), helped me to figure out how to use a trigonometric scalar in vertex translation to mimic a more natural wing-flap.
