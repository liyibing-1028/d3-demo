// initialize canvas
var canvas = document.createElement('canvas')
var box = document.getElementById('canvas')
let W = box.offsetWidth - 30
let H = box.offsetHeight - 30
canvas.width = W
canvas.height = H
canvas.fillStyle = '#fff'
let context = canvas.getContext('2d')

var renderer = new PIXI.Application(W, H, {
  antialias: true,
  transparent: true
})
box.appendChild(renderer.view)

function init() {
  // 圆
  let arr = []
  let arr2 = []
  for (let i = 0; i < 1000; i++) {
    arr.push({
      x: Math.random() * W, y: Math.random() * H
    })
    arr2.push({
      x: Math.random() * W, y: Math.random() * H
    })
  }
  let start = +new Date()
  let _copy = []
  renderer.ticker.add(() => {
    let now = +new Date()
    if (now - start > 1) {
      if (arr.length < 1) {
        arr = arr2
      }
      let d = arr.shift()
      arr2.push(d)
      let thing = new PIXI.Graphics()
      thing.lineStyle(0)
      thing.beginFill(0xB1E3FF, 1); // color alpha
      thing.drawCircle(10, 10, 10); // x y r
      thing.scale.set(0)
      thing.alpha = 0.2
      thing.position.x = d.x
      thing.position.y = d.y
      thing.endFill()
      thing.blendMode = PIXI.BLEND_MODES.ADD
      renderer.stage.addChild(thing)
      _copy.push({
        dom: thing,
        times: 0
      })
      start = now
    }
    for (var i = 0; i < _copy.length; i++) {
      var p = _copy[i]
      p.times = p.times + 0.01
      p.dom.scale.set(p.times)
      p.dom.alpha = Math.cos(p.times * (Math.PI / 2))
      if (p.times > 1) {
        renderer.stage.removeChild(p.dom)
        _copy.shift()
      }
    }
  })
}

init()
