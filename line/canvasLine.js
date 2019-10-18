class TestLine {
  constructor (opt = {}) {
    let def = {
      pointsNum: 200,
      lineCount: 100
    }
    this.options = _.assign(def, opt)
    this.pointsNum = this.options.pointsNum
    this.lineCount = this.options.lineCount
    this.box = document.getElementById(this.options.box)
    this.render = new PIXI.Application({width: this.box.offsetWidth, height: this.box.offsetHeight, antialias: true, transparent: true})
    this.canvasline = this.setCanvasLine()
    this.box.appendChild(this.render.view)
    this.util = new Util()
    animate()
    function animate () {
      requestAnimationFrame(animate)
      TWEEN.update()
    }
  }

  setCanvasLine () { // 绘制canvas线性渐变模块
    let canvasline = document.createElement('canvas')
    let ctx = canvasline.getContext('2d')
    let grad = ctx.createLinearGradient(0, 0, 300, 0)
    grad.addColorStop(0, 'rgba(66,202,131,0)')
    grad.addColorStop(1, '#42ca83')
    ctx.fillStyle = grad
    ctx.fillRect(0, 75, 300, 2)
    return canvasline
  }

  setData (data) { // 数据接收绘制
    let linePool = []
    setInterval(() => {
      for (let i = 0; i < linePool.length; i++) {
        let item = linePool[i]
        if (item.status === 'init') {
          this.tweenAnimate(item)
        } else if (item.status === 'end') {
          this.render.stage.removeChild(item.dom)
          this.render.stage.removeChild(item.scircle)
          this.render.stage.removeChild(item.ecircle)
          linePool.splice(i, 1)
        }
      }

      for (let j = this.lineCount - linePool.length; j >= 0; j--) {
        let d = {
          from: [Math.random() * 800, Math.random() * 600],
          to: [Math.random() * 800, Math.random() * 600]
        }
        linePool.push(this.createLineUnit(d))
      }
    }, 1000)
    data.forEach(d => {
      linePool.push(this.createLineUnit(d))
    })
  }

  createLineUnit (d) { // 创建飞线对象
    let lineUnit = {
      status: 'init',
      process: 0,
      dom: null,
      color: null,
      from: d.from,
      to: d.to,
      len: 0.3,
      allPoints: this.util.calBezierLine([d.from, d.to], this.pointsNum, -0.3),
      points: this.util.calBezierLine([d.from, d.to], this.pointsNum, -0.3),
      scircle: null,
      ecircle: null
    }
    let s = lineUnit.points.splice(0, lineUnit.len * this.pointsNum - 1)
    let line = lineUnit.dom = new PIXI.SimpleRope(PIXI.Texture.from(this.canvasline), s)
    line.blendMode = PIXI.BLEND_MODES.ADD
    line.alpha = 0
    this.render.stage.addChild(line)
    // start circle
    lineUnit.scircle = this.createCircle(0xFF293B, d.from)
    this.render.stage.addChild(lineUnit.scircle)
    // end circle
    lineUnit.ecircle = this.createCircle(0x42CA83, d.to)
    this.render.stage.addChild(lineUnit.ecircle)
  
    return lineUnit
  }
  
  createCircle (color, pst) { // 创建圆
    let circle = new PIXI.Graphics()
    circle.beginFill(color, 1)
    circle.drawCircle(0, 0, 10)
    circle.endFill()
    circle.scale.set(0)
    circle.alpha = 0
    circle.position.x = pst[0]
    circle.position.y = pst[1]
    circle.blendMode = PIXI.BLEND_MODES.ADD
    return circle
  }

  tweenAnimate (item) { // 改变线位置，圆大小、透明度
    item.status = 'ing'
    var lt = 3000
    // start circle
    this.tweenCircle(item, 0, 'sCircle')
    // line
    this.tweenLine(item, lt)
    // end circle
    this.tweenCircle(item, lt - 1000, 'eCircle')
  }

  tweenCircle (item, times, flag) { // circle
    new TWEEN.Tween()
    .to(1000)
    .delay(times)
    .onUpdate(function (t) {
      if (flag === 'eCircle') {
        item.ecircle.scale.set(t)
        item.ecircle.alpha = Math.cos(t * (Math.PI / 2))
        if (t >= 1) {
          item.ecircle.alpha = 0
        }
      } else {
        item.scircle.scale.set(t)
        item.scircle.alpha = Math.cos(t * (Math.PI / 2))
        if (t >= 1) {
          item.scircle.alpha = 0
        }
      }
    })
    .start()
    .onComplete(function () {
      if (flag === 'eCircle') {
        item.scircle.alpha = 0
        item.ecircle.alpha = 0
        item.status = 'end'
      }
    })
  }

  tweenLine (item, lt) { // line
    let _this = this
    new TWEEN.Tween({
      process: 0,
    })
    .to({
      process: _this.pointsNum + item.dom.geometry.points.length
    }, lt)
    .delay(200)
    .easing(TWEEN.Easing.Quadratic.InOut) 
    .onStart(function () {
      item.dom.alpha = 1
    })
    .onUpdate(function () {
      let process = ~~this.process
      if (process <= _this.pointsNum + item.dom.geometry.points.length) {
        for (let j = 0; j < item.dom.geometry.points.length; j++) {
          let _index = process + j - item.dom.geometry.points.length
          if (_index < 0) {
            item.dom.geometry.points[j] = item.allPoints[0]
          } else if (_index <= _this.pointsNum && item.allPoints[_index]) {
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
    .onComplete(function () {
      item.dom.alpha = 0
    })
  }
}

export { TestLine }

