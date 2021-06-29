/* eslint-disable camelcase */
/* eslint-disable dot-notation */
/* eslint-disable prettier/prettier */
import React, { useRef, useEffect, useState } from 'react'


function Chart(props) {
  const [numbers] = useState(props.numbers)
  const [min, setMin] = useState(props.numbers[0])
  const [max, setMax] = useState(0)
  const [height, setHeight] = useState(350)
  const [width, setWidth] = useState(800)
  const [points, setPoints] = useState()
  const [lineWidth, setLineWidth] = useState(1)
  const [color, setColor] = useState('#000000')
  const canvas = useRef(null)

  const getY = (price) => {
    return height - ((((price - min) / (max - min)) * (height / 2)) + (height / 4));
  }

  useEffect(() => {
    if (props.height !== undefined) {
      setHeight(props.height)
    }
    if (props.width !== undefined) {
      setWidth(props.width)
    }
    if (props.lineWidth !== undefined) {
      setLineWidth(props.lineWidth)
    }
    if (props.color !== undefined) {
      setColor(props.color)
    }
    if (props.points !== undefined) {
      setPoints(width / props.points)
    }
    else {
      setPoints(width / numbers.length)
    }

    for (var i = 0; i < numbers.length; i++) {
      var price = numbers[i];
      if (price > max) {
        setMax(price)
      }
      if (price < min) {
        setMin(price)
      }
    }
    var ctx = canvas.current.getContext('2d')
    ctx.clearRect(0, 0, width, height)
    ctx.beginPath()
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = color
    ctx.lineCap = 'round'
    var y = getY(numbers[0])
    var x = Math.floor(points) + .5
    ctx.moveTo(x, y)
    for (let i = 2; i < numbers.length; i++) {
      y = getY(numbers[i])
      x = Math.floor(i * points) + .5
      ctx.quadraticCurveTo(x, y, x, y)
    }
    ctx.stroke()
  })

  return (
    <canvas ref={canvas} width={width} height={height} />
  )
}

export default Chart