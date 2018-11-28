import React from 'react'

const getStripedBackground = (size, color) => {
  color = color || 'rgba(0,0,0,0.05)';
  size = size || 8;
  return `linear-gradient(
      to bottom, 
      transparent, 
      transparent ${size-1}px, 
      ${color} ${size-1}px, 
      ${color}
    ),
    linear-gradient(
      to right, 
      transparent, 
      transparent ${size-1}px, 
      ${color} ${size-1}px, 
      ${color}
    )
  `;
}

const Grid = (props) => (
  <div style={{ 
      display: props.on ? 'block': 'none',
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      backgroundImage: getStripedBackground(props.size, props.color),
      backgroundRepeat: 'repeat, repeat',
      backgroundSize: `100% ${props.size}px, ${props.size}px 100%`,
      pointerEvents: 'none'
    }}
  ></div>
)

export default Grid
