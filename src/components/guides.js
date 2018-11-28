import React from 'react'

const isVertical = (props) => {
  return (
    (props.hasOwnProperty('left') && props.left !== 'auto') || 
    (props.hasOwnProperty('right') && props.right !== 'auto')
  );
}

const Guide = (props) => (
  <div style={{
      position: 'absolute',
      backgroundColor: props.hasOwnProperty('color') ? props.color : '#f00',
      width: isVertical(props) ? '1px' : '100%',
      height: isVertical(props) ? '100%' : '1px',
      top: isVertical(props) ? 'auto' : (
        props.hasOwnProperty('top') ? props.top : 'auto'
      ),
      bottom: isVertical(props) ? 'auto' : (
        props.hasOwnProperty('bottom') ? props.bottom : 'auto'
      ),
      left: !isVertical(props) ? 'auto' : (
        props.hasOwnProperty('left') ? props.left : 'auto'
      ),
      right: !isVertical(props) ? 'auto' : (
        props.hasOwnProperty('right') ? props.right : 'auto'
      ),
    }}
  ></div>
)

class MouseGuide extends React.Component {
  constructor(props) {
    super(props);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(e) {
    this.setState({ x: e.pageX+'px', y: e.pageY+'px' });
  }

  render() {
    return <div style={{
        display: this.props.on ? 'block': 'none',
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left:0,
        pointerEvents: 'all'
      }}
      onMouseMove={this.handleMouseMove.bind(this)}
    >
      <Guide top={this.state.y} color="#ccc"></Guide>
      <Guide left={this.state.x} color="#ccc"></Guide>
    </div>;
  }

}


const Guides = (props) => (
  <div style={{ 
      display: props.on ? 'block': 'none',
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left:0,
      pointerEvents: 'none'
    }}
  >
    {props.guides.map((guide,i) => {
      return <Guide 
        key={ guide.id ? guide.id : 'guide' + i}
        top={guide.top || 'auto'} 
        right={guide.right || 'auto'}
        bottom={guide.bottom || 'auto'}
        left={guide.left || 'auto'}
        color={guide.color || '#f00'}
      ></Guide>
    })}
  </div>
)

export { Guides, Guide, MouseGuide }
