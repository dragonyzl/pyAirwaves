/*
 * LEAFLET.BOATMARKER
 * v1.1.0
 * Thomas Brüggemann
 * https://github.com/thomasbrueggemann/leaflet.boatmarker
 */
import L from 'leaflet'

/* BOAT ICON */
export default L.Icon.extend({

  // OPTIONS
  options: {
    iconSize: new L.Point(150, 150),
    className: 'leaflet-boat-icon',
    course: 0,
    speed: 0,
    color: '#8ED6FF',
    labelAnchor: [23, 0],
    wind: false,
    windDirection: 0,
    windSpeed: 0,
    idleCircle: false
  },

  // PROPERTIES
  x: 66,
  y: 85,
  xFac: 0.18,
  yFac: 0.18,
  ctx: null,
  lastHeading: 0,
  lastWindDirection: 0,

  // CREATE ICON
  // setup the icon and start drawing
  createIcon: function () {
    var e = document.createElement('canvas')
    this._setIconStyles(e, 'icon')
    var s = this.options.iconSize

    e.width = s.x
    e.height = s.y
    this.lastHeading = 0 // reset in case the marker is removed and added again

    this.ctx = e.getContext('2d')
    this.draw(this.ctx, s.x, s.y)

    return e
  },

  // DRAW
  // renders the boat icon onto the canvas element
  draw: function (ctx, w, h) {
    if (!ctx) return
    var x = this.x
    var y = this.y

    var xFac = this.x_fac
    var yFac = this.y_fac

    ctx.clearRect(0, 0, w, h)

    ctx.translate(w / 2, h / 2)
    ctx.rotate(this.options.course * Math.PI / 180)
    ctx.translate(-w / 2, -h / 2)

    // ctx.fillRect(0,0,w,h);

    ctx.beginPath()

    // draw idle boat shape
    if (this.options.idleCircle === true && this.options.speed === 0) {
      ctx.arc(x + (50 * xFac), y - (50 * yFac), 50 * xFac, 0, 2 * Math.PI)
    } else { // draw boat shape in motion
      // Offset
      // const xx = 10
      // const yy = 10

      // ctx.scale(1.5, 1.5);

      // Move origin
      ctx.moveTo(x, y)

      // Main body
      ctx.beginPath() // start a new path
      ctx.moveTo(x, y)
      ctx.bezierCurveTo(x, y + (80 * yFac), x + (100 * xFac), y + (80 * yFac), x + (100 * xFac), y)
      ctx.quadraticCurveTo(x + (100 * xFac), y - (100 * yFac), x + (50 * xFac), y - (200 * yFac))
      ctx.quadraticCurveTo(x, y - (100 * yFac), x, y)
      ctx.stroke()
      ctx.fillStyle = this.options.color
      ctx.fill()

      // Arrow thingy
      ctx.beginPath() // start a new path
      ctx.lineWidth = 0.5
      ctx.lineTo(w / 2, h / 2)
      // The Arrow
      // up-left
      ctx.moveTo(w / 2, h / 2) // move to origin
      ctx.lineTo((w / 2) - 5, (h / 2) - 5)
      // up-right
      ctx.moveTo(w / 2, h / 2) // move to origin
      ctx.lineTo((w / 2) + 5, (h / 2) - 5)
      // bot-left
      ctx.moveTo(w / 2, h / 2) // move to origin
      ctx.lineTo((w / 2) - 5, (h / 2) + 5)
      // bot-right
      ctx.moveTo(w / 2, h / 2) // move to origin
      ctx.lineTo((w / 2) + 5, (h / 2) + 5)
      ctx.stroke()
    }

    ctx.closePath()
  },

  setHeadingWind: function (heading, windSpeed, windDirection) {
    this.options.wind = true

    this.options.course = (heading % 360) - this.lastHeading
    this.lastHeading = heading % 360

    this.options.windDirection = (windDirection % 360) - (heading % 360)
    this.lastHeading += this.options.windDirection

    this.options.windSpeed = windSpeed

    var s = this.options.iconSize
    this.draw(this.ctx, s.x, s.y)
  },

  // SET HEADING
  // sets the boat heading and
  // update the boat icon accordingly
  setHeading: function (heading) {
    this.options.course = (heading % 360) - this.lastHeading
    this.lastHeading = heading % 360

    var s = this.options.iconSize
    this.draw(this.ctx, s.x, s.y)
  },

  // SET SPEED
  // sets the boat speed value and
  // update the boat icon accordingly
  setSpeed: function (speed) {
    this.options.speed = speed

    var s = this.options.iconSize
    this.draw(this.ctx, s.x, s.y)
  }
})
