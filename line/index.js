var box = document.getElementById('canvas')
let W = box.offsetWidth
let H = box.offsetHeight

let pointsNum = 200
var renderer = new PIXI.Application({width: 800, height: 600, antialias: true})

box.appendChild(renderer.view)

function animate() {
  requestAnimationFrame(animate)
  TWEEN.update()
}
animate()

let canvasline = document.createElement('canvas')
let ctx = canvasline.getContext('2d')
let grad = ctx.createLinearGradient(0,0,300,0)
grad.addColorStop(0, 'rgba(66,202,131,0)')
grad.addColorStop(1, '#42ca83')
ctx.fillStyle = grad
ctx.fillRect(0,75,300,1)

function init() {
  let count = 50
  let linePool = []

  setInterval(function() {
    for (let index = 0; index < linePool.length; index++) {
      var item = linePool[index]
      if (item.status == 'init') {
        tweenAnimate(item)
      } else if (item.status == 'end') {
        renderer.stage.removeChild(item.dom)
        renderer.stage.removeChild(item.scircle)
        renderer.stage.removeChild(item.ecircle)
        linePool.splice(index, 1)
      }
    }

    for (let j = count - linePool.length; j >= 0; j--) {
      var d = {
        from: [Math.random() * 800, Math.random() * 600],
        to: [Math.random() * 800, Math.random() * 600]
      }
      linePool.push(creatAnimateObj(d))
    }
  }, 1000)
}
init()

function creatAnimateObj (d) {
  let lineUnit = {
    status: 'init',
    process: 0,
    dom: null,
    color: null,
    from: d.from,
    to: d.to,
    len: 0.3,
    allPoints: calBezierLine([d.from, d.to], pointsNum, -0.3),
    points: calBezierLine([d.from, d.to], pointsNum, -0.3),
    scircle: null,
    ecircle: null
  }
  let s = lineUnit.points.splice(0, lineUnit.len * pointsNum - 1)
  let line = lineUnit.dom = new PIXI.SimpleRope(PIXI.Texture.from(canvasline), s)
  line.blendMode = PIXI.BLEND_MODES.ADD
  line.alpha = 0
  renderer.stage.addChild(line)
  // start circle
  let s_circle = lineUnit.scircle = new PIXI.Graphics()
  s_circle.beginFill(0xFF293B, 1)
  s_circle.drawCircle(0, 0, 10)
  s_circle.endFill()
  s_circle.scale.set(0)
  s_circle.alpha = 0
  s_circle.position.x = d.from[0]
  s_circle.position.y = d.from[1]
  s_circle.blendMode = PIXI.BLEND_MODES.ADD
  renderer.stage.addChild(s_circle)
  // end circle
  let e_circle = lineUnit.ecircle = new PIXI.Graphics()
  e_circle.beginFill(0x42CA83, 1)
  e_circle.drawCircle(0, 0, 10)
  e_circle.endFill()
  e_circle.scale.set(0)
  e_circle.alpha = 0
  e_circle.position.x = d.to[0]
  e_circle.position.y = d.to[1]
  e_circle.blendMode = PIXI.BLEND_MODES.ADD
  renderer.stage.addChild(e_circle)

  return lineUnit
}

function tweenAnimate (item) {
  item.status = 'ing'
  var lt = 3000
  // start circle
  new TWEEN.Tween({
    process: 0,
  })
  .to({
    process: 1
  }, 1000)
  .onUpdate(function (t) {
    item.scircle.scale.set(t)
    item.scircle.alpha = Math.cos(t * (Math.PI / 2))
    if (t >= 1) {
      item.scircle.alpha = 0
    }
  })
  .start()
  // line
  new TWEEN.Tween({
    process: 0,
  })
  .to({
    process: pointsNum + item.dom.geometry.points.length
  }, lt)
  .delay(200)
  .easing(TWEEN.Easing.Quadratic.InOut) 
  .onStart(function () {
    item.dom.alpha = 1
  })
  .onUpdate(function () {
    var process = ~~this.process
    if (process <= pointsNum + item.dom.geometry.points.length) {
      for (let j = 0; j < item.dom.geometry.points.length; j++) {
        let _index = process + j - item.dom.geometry.points.length
        if (_index < 0) {
          item.dom.geometry.points[j] = item.allPoints[0]
        } else if (_index <= pointsNum && item.allPoints[_index]) {
          if (_index === item.allPoints.length - 1) {
            item.dom.geometry.points[j] = item.allPoints[item.allPoints.length - 1]
          } else {
            item.dom.geometry.points[j] = item.allPoints[_index]
          }
        }
      }
    }
  })
  .start()
  // end circle
  new TWEEN.Tween()
  .to(1000)
  .delay(lt - 1000)
  .onUpdate(function (t) {
    item.ecircle.scale.set(t)
    item.ecircle.alpha = Math.cos(t * (Math.PI / 2))
    if (t >= 1) {
      item.ecircle.alpha = 0
    }
  })
  .start()
  .onComplete(function () {
    item.dom.alpha = 0
    item.scircle.alpha = 0
    item.ecircle.alpha = 0
    item.status = 'end'
  })

}
