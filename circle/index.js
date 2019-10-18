var box = document.getElementById('canvas')
let W = box.offsetWidth
let H = box.offsetHeight

let pointsNum = 200
var renderer = new PIXI.Application({width: 800, height: 600, antialias: true})
box.appendChild(renderer.view)

let dataArr = []
function init() {
  animate()
  function animate () {
    requestAnimationFrame(animate)
    TWEEN.update()
  }
  let scirclePone = []
  // let ecirclePone = []
  for (let i = 0; i < 20; i++) {
    let lnglat = [Math.random() * 800, Math.random() * 600]
    let r = parseInt(Math.random() * 10)
    let s = creatScircle({
      from: lnglat,
      r: r,
      i: i
    })
    // let e = creatEcircle({ from: [Math.random() * 800, Math.random() * 600] })
    scirclePone.push(s)
    // ecirclePone.push(e)
  }
  setInterval(() => {
    scirclePone.forEach((item, index) => {
      if (item.status === 'init') {
        tweenCircle(item, 'goip')
      } else {
        item.status = 'init'
      }
    })
    // ecirclePone.forEach((item, index) => {
    //   if (item.status === 'init') {
    //     tweenCircle(item, 'phone')
    //   } else {
    //     item.status = 'init'
    //   }
    // })
  }, 1000)
}
init()

function creatScircle (d) {
  let lineUnit = {
    status: 'init',
    scircle: null, // 外圆
    circle: null // 内圆
  }
  let s_circle = lineUnit.scircle = new PIXI.Graphics()
  s_circle.beginFill(0xFF293B, 1)
  s_circle.drawCircle(0, 0, 10 + d.r)
  s_circle.endFill()
  s_circle.scale.set(0)
  s_circle.alpha = 0
  s_circle.position.x = d.from[0]
  s_circle.position.y = d.from[1]
  s_circle.blendMode = PIXI.BLEND_MODES.ADD
  renderer.stage.addChild(s_circle)

  let circle = lineUnit.circle = new PIXI.Graphics()
  circle.interactive = true
  circle.buttonMode = true
  circle.domIndex = d.i 
  circle.domR = d.r 
  circle.beginFill(0xFF293B, 1)
  circle.drawCircle(0, 0, d.r)
  circle.endFill()
  circle.position.x = d.from[0]
  circle.position.y = d.from[1]
  circle.blendMode = PIXI.BLEND_MODES.ADD
  circle.on('click', function () {
    onDragDown(circle)
  })
  renderer.stage.addChild(circle)
  return lineUnit
}

function onDragDown(circle) {
  console.log(circle.domR)
}

function creatEcircle (d) {
  let lineUnit = {
    status: 'init',
    ecircle: null,
    circle: null
  }
  let r = parseInt(Math.random() * 5) < 2 ? 2 : parseInt(Math.random() * 5)
  let e_circle = lineUnit.ecircle = new PIXI.Graphics()
  e_circle.beginFill(0x42CA83, 1)
  e_circle.drawCircle(0, 0, 10 + r)
  e_circle.endFill()
  e_circle.scale.set(0)
  e_circle.alpha = 0
  e_circle.position.x = d.to[0]
  e_circle.position.y = d.to[1]
  e_circle.blendMode = PIXI.BLEND_MODES.ADD
  renderer.stage.addChild(e_circle)
  
  let circle = lineUnit.circle = new PIXI.Graphics()
  circle.beginFill(0x42CA83, 1)
  circle.drawCircle(0, 0, r)
  circle.endFill()
  circle.position.x = d.to[0]
  circle.position.y = d.to[1]
  circle.blendMode = PIXI.BLEND_MODES.ADD
  renderer.stage.addChild(circle)
  return lineUnit
}

function tweenCircle (item, flag) {
  new TWEEN.Tween()
    .to(1000)
    .delay(Math.random() * 3000)
    .onUpdate(function (t) {
      if (flag === 'goip') {
        item.scircle.scale.set(t)
        item.scircle.alpha = Math.cos(t * (Math.PI / 2))
        if (t >= 1) {
          item.scircle.alpha = 0
        }
      } else {
        item.ecircle.scale.set(t)
        item.ecircle.alpha = Math.cos(t * (Math.PI / 2))
        if (t >= 1) {
          item.ecircle.alpha = 0
        }
      }
    })
    .start()
    .onComplete(function () {
      item.status = 'end'
    })
}

