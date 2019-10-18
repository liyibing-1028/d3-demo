// 实时时间轴-----------------------------------
function areaMoveChart (phoneData) {
  this.chartPhoneTrend = true
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame
  var pWidth = $('#phoneChart').width()
  var pHeight = $('#phoneChart').height()
  $('#phoneChart svg').remove()
  d3.select('#phoneChart').append('svg').attr('id', 'waveChart')
  var paper = d3.select('svg#waveChart')
    .attr('width', pWidth)
    .attr('height', pHeight)
  var margin = {top: 20, right: 20, bottom: 20, left: 20}
  var current = +new Date()
  var x = d3.scaleTime().domain([current - this.space, current]).range([0, pWidth - margin.left - margin.right])
  var y = d3.scaleLinear().domain([0, 500]).range([pHeight, 0])
  var chart = paper.append('g')
   .attr('transform', 'translate(' + margin.left + ',' + pHeight / 2 + ')')
  var xAxis = d3.axisBottom().scale(x)
    .tickFormat(() => { return '' })
    .tickSize(0)
  var axisX = chart.append('g').attr('class', 'x axis')
    .call(xAxis)
  var barGroup = chart.append('g')
  var area = d3.area()
    .x(function (d) { return x(d.x) })
    .y0(y(0))
    .y1(function (d) { return y(d.y) })
    .curve(d3.curveCardinal)
  // 区域图动画
  var areaGroup = paper.append('g')
  var areaPathTop = areaGroup.append('path')
  var areaPathBottom = areaGroup.append('path')
  areaGroup.attr('transform', 'translate(' + margin.left + ',' + -pHeight / 2 + ')')
  var dataTop = []
  var dataBottom = []
  var _this = this
  var timer = 2000
  var otimer = 0
  var ntimer = 0
  var duration = 500
  var space = 750 * 60
  var _direction = 1
  // ----------------
  let dataArr = _.orderBy(phoneData, 'time', 'asc')
  let dataObj = _.groupBy(dataArr, 'time')
  let timeArr = []
  for (let i in dataObj) {
    timeArr.push(i)
  }
  function animate () {
    ntimer = +new Date()
    if (ntimer - otimer > timer) {
      if (!timeArr.length) {
        _this.chartPhoneTrend = false
        _this.animateFlag = false
        return
      }
      let c = timeArr.shift()
      x.domain([ntimer - space, ntimer])
      axisX.transition()
        .duration(duration)
        .ease(d3.easeLinear, 0.5)
        .call(xAxis)
        .on('end', function () {
          let direction = -_direction
          let _data = dataObj[c].length + 20
          let _deg = dataObj[c].length + 10
          let rank = dataObj[c][0].rank
          let textArr = []
          var _g = barGroup.append('g')
            .attr('data-time', otimer)
            .attr('transform', 'translate(' + x(otimer) + ', 0)')
          _g.append('circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', 3)
            .attr('fill', '#fb6e11')
          _g.append('text')
            .attr('dx', '-1.8em')
            .attr('dy', (d) => {
              if (direction > 0) {
                return '1.4em'
              } else {
                return '-1em'
              }
            })
            .attr('style', 'font-size: 10px; display: inline-block')
            .attr('fill', 'red')
            .attr('text-anchor', 'start')
            .text(() => {
              let time = moment(c).format('MM-DD HH:mm:ss')
              if (direction > 0) {
                textArr = time.split(' ')
              } else {
                textArr = [time.split(' ')[1], time.split(' ')[0]]
              }
            })
            .selectAll('tspan')
            .data(textArr)
            .enter()
            .append('tspan')
            .attr('dx', (d) => {
              if (direction > 0) {
                if (d.includes('-')) {
                  return '-1.8em'
                } else {
                  return '-3.4em'
                }
              } else {
                if (!d.includes('-')) {
                  return '-2.2em'
                } else {
                  return '-3.4em'
                }
              }
            })
            .attr('dy', (d) => {
              if (direction > 0) {
                return '1.4em'
              } else {
                return '-1em'
              }
            })
            .text((d) => {
              return d
            })

          _g.append('rect')
            .attr('x', -0.5)
            .attr('y', direction > 0 ? (-_data - 11) : _data + 1)
            .attr('width', 1)
            .attr('height', 0)
            .attr('fill', '#fb6e11')
            .attr('data-time', otimer)
            .transition()
            .delay(2)
            .duration(duration)
            .ease(d3.easeLinear, 2)
            .attr('height', 10)
            .on('end', function () {
              d3.select(this).attr('class', 'bar')
            })
          _g.append('text')
            .attr('dx', '-0.8em')
            .attr('dy', (d) => {
              if (direction > 0) {
                return -(_data + 13)
              } else {
                return _data + 20
              }
            })
            .attr('style', 'font: 10px Orbitron')
            .attr('fill', rank === '1' ? '#ffd640' : rank === '2' ? '#f86f34' : '#e10d0f')
            .attr('text-anchor', 'start')
            .text((_data - 20) + '个')
          _g.append('path')
            .attr('d', _this.animateArc(0.1, direction, _data + 1, _data + 3))
            .attr('class', rank === '1' ? 'arc-border' : rank === '2' ? 'arc-middle-border' : 'arc-high-border')
            .transition()
            .delay(2)
            .duration(duration)
            .ease(d3.easeBounceInOut, 2)
            .attr('d', _this.animateArc(_deg, direction, _data + 1, _data + 3))
          _g.append('path')
            .attr('d', _this.animateArc(0.1, direction, 0, _data))
            .attr('class', rank === '1' ? 'arc' : rank === '2' ? 'arc-middle' : 'arc-high')
            .transition()
            .delay(2)
            .duration(_this.duration)
            .ease(d3.easeBounceInOut, 2)
            .attr('d', _this.animateArc(_deg, direction, 0, _data))
            .on('end', function () {
              _g.attr('class', 'arc-group')
            })
        })
      barGroup.selectAll('.arc-group')
          .each(function (d, idx) {
            var _this = d3.select(this)
            if (x(d3.select(this).attr('data-time')) < -10) {
              _this.remove()
            } else {
              d3.select(this)
                .transition()
                .duration(500)
                .ease(d3.easeLinear, 2)
                .attr('transform', () => {
                  return 'translate(' + x(d3.select(this).attr('data-time')) + ', 0)'
                })
            }
          })
      var point = {
        x: ntimer,
        y: (Math.random() * 2) * 50 + 10
      }
      var pointBottom = {
        x: ntimer,
        y: -((Math.random() * 2) * 50 + 10)
      }
      dataTop.pop()
      dataTop.push(point)
      dataTop.push({
        x: ntimer + timer,
        y: 0
      })
      dataBottom.pop()
      dataBottom.push(pointBottom)
      dataBottom.push({
        x: ntimer + timer,
        y: 0
      })
      if (dataTop.length > 100) dataTop.shift()
      if (dataBottom.length > 100) dataBottom.shift()
      areaPathTop
        .datum(dataTop)
        .attr('class', 'area')
        .transition()
        .duration(duration)
        .ease(d3.easeLinear, 0.5)
        .attr('d', area)
      areaPathBottom.datum(dataBottom)
        .attr('class', 'area')
        .transition()
        .duration(duration)
        .ease(d3.easeLinear, 0.5)
        .attr('d', area)
      otimer = ntimer
      _direction = -_direction
    }
    _this.animateFlag && requestAnimationFrame(animate)
  }
  animate()
}

function animateArc (deg, direction, innerRadius, outerRadius) {
  if (direction > 0) {
    return d3.arc()
      .startAngle(Math.PI * (-deg / 180))
      .endAngle(Math.PI * (deg / 180))
      .padAngle(0)
      .padRadius(0)
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
  } else {
    return d3.arc()
      .startAngle(Math.PI * (1 - deg / 180))
      .endAngle(Math.PI * (1 + deg / 180))
      .padAngle(0)
      .padRadius(0)
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
  }
}

function type (d) {
  var parseDate = d3.timeParse('%b %Y')
  d.date = parseDate(d.date)
  d.price = +d.price
  return d
}
