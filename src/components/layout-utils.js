import React from 'react';
import PropTypes from 'prop-types'
import { Guides, MouseGuide } from './guides';
import Grid from './grid';
import styles from './layout-utils.module.css';

const POSITIONS = [ 'top', 'bottom', 'left', 'right' ];

class ToolWindow extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      x: 0, 
      y: 0, 
      dragging: false, 
      startX: 0, 
      startY: 0,
      screenStartX: 0,
      screenStartY: 0,
      active: true
    };
  }

  componentDidMount() {
    window.addEventListener('mousemove', this.handleMouseMove.bind(this));
    window.addEventListener('mousedown', this.handleDocumentMouseDown.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    window.removeEventListener('mousedown', this.handleDocumentMouseDown.bind(this));
  }

  getTransformString() {
    const { x, y } = this.state;
    return 'translate(' + x + 'px, ' + y + 'px) scale(1)';
  }

  handleDocumentMouseDown(e) {
    if (!this.props.visible) { return; }
    this.setState({
      active: false
    });
  }

  handleMouseDown(e) {
    e.stopPropagation();
    this.setState({
      dragging: true,
      startX: this.state.x,
      startY: this.state.y,
      screenStartX: e.screenX,
      screenStartY: e.screenY,
      active: true
    });
    return false;
  }

  handleMouseUp(e) {
    this.setState({
      dragging: false,
      startX: 0,
      startY: 0
    });
  }

  handleMouseMove(e) {
    if (this.state.dragging) {
      this.setState({
        x: this.state.startX + (e.screenX - this.state.screenStartX), 
        y: this.state.startY + (e.screenY - this.state.screenStartY)
      });
    }
  }

  render() {
    return (
      <div 
        className='ui-window'
        style={{ 
          transform: this.props.visible ? this.getTransformString() : 'translate(0,0) scale(0)',
          transition: this.state.dragging ? 'none' : 'transform 0.25s ease, opacity 0.25s ease',
          transformOrigin: '100% 100%',
          position: 'absolute',
          right: 0,
          bottom: 0,
          opacity: this.props.visible ? (this.state.active ? 1 : 0.2) : 0,
          width: '264px'
        }}
      >
        <div className='ui-toolbar'
          onMouseDown={this.handleMouseDown.bind(this)}
          onMouseUp={this.handleMouseUp.bind(this)}
        >
          <span>Layout Tools</span>
          <button style={{margin: '-1px 6px 0 0'}} onClick={this.props.onClose} className='ui-icon-button'>&times;</button>
        </div>
        <div className='ui-window-content' 
          onMouseDown={e => { e.stopPropagation(); this.setState({ active: true }) }}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

class GuideSettings extends React.Component {

  getGuidePosition() {
    const position = POSITIONS.filter(p => (
        this.props.guide.hasOwnProperty(p) && this.props.guide[p] !== 'auto'
      ));
    return position.length > 0 ? position[0] : 'top';
  }

  getGuideValue() {
    const pos = this.getGuidePosition(this.props.guide)
    return this.props.guide[pos]
  }

  getGuideColor() {
    return this.props.guide['color'] || '#ff0000';
  }

  setGuidePosition(pos) {
    
    if (typeof this.props.onGuideChange !== 'function') { return; }
    const value = this.getGuideValue();
    
    const newPosition = POSITIONS.reduce((acc, curr) => { 
        acc[curr] = curr === pos ? value  : 'auto';
        return acc;
      }, {});
    this.props.onGuideChange(Object.assign({}, this.props.guide, newPosition));
  }

  setGuideValue(val) {
    if (typeof this.props.onGuideChange !== 'function') { return; }
    const newValue = {};
    const pos = this.getGuidePosition();
    newValue[pos] = val;
    this.props.onGuideChange(Object.assign({}, this.props.guide, newValue));
  }

  setGuideColor(col) {
    if (typeof this.props.onGuideChange !== 'function') { return; }
    this.props.onGuideChange(Object.assign({}, this.props.guide, { color: col }));
  }

  render() {
    return(
      <div className='guideSetting' style={{ display: 'flex', padding: '2px 0' }}>
        <select defaultValue={this.getGuidePosition()} onChange={((e) => this.setGuidePosition(e.target.value))}>
          {POSITIONS.map(p => (<option key={p} value={p}>{p}</option>))}
        </select>
        <input type="text" 
          value={this.getGuideValue()} 
          onChange={(e) => this.setGuideValue(e.target.value) } />
        <input type="color" 
          value={this.getGuideColor()} 
          onChange={(e) => this.setGuideColor(e.target.value) } />
        <button
          className='ui-icon-button' 
          onClick={(e) => this.props.onRemoveGuide(this.props.guide)
        }>&times;</button>
      </div>
    )
  }
}

GuideSettings.propTypes = {
  guide: PropTypes.object.isRequired
}

class LayoutUtils extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      windowOpen: false,
      gridOn: false,
      gridSize: 8,
      guidesOn: true,
      guides: [ 
        { id: 'header-a', top: '1.5rem', color: '#cccccc' },
        { id: 'header-b', top: '3.5rem', color: '#cccccc' },
        { id: 'main', top: '5rem' },
        { id: 'main-a', top: '7rem', color: '#cccccc' },
        { id: 'item2', bottom: '24px' },
        { id: 'item3', left: '24px' },
        { id: 'item3a', left: 'calc(50% - 28.5rem)' },
        { id: 'item3b', left: 'calc(50% + 28.5rem)' },
        { id: 'item4', right: '24px' }
      ],
      mouseGuideOn: false
    }
  }

  /** Toggle the mouse guides on or off */
  toggleMouseGuide() { 
    this.setState({ mouseGuideOn: !this.state.mouseGuideOn }); 
  }

  /** Toggle the grid on or off */
  toggleGrid() { 
    this.setState({ gridOn: !this.state.gridOn }); 
  }

  /** Toggle the guides on or off */
  toggleGuides() { 
    this.setState({ guidesOn: !this.state.guidesOn }); 
  }

  toggleWindowOpen() {
    this.setState({ windowOpen: !this.state.windowOpen });
  }

  /** Add a guide */
  addGuide(anchor, offset, color) {
    const newGuide = { id: 'g' + (new Date().getTime() / 1000) };
    newGuide[anchor] = offset || '0px';
    newGuide[color] = color || '#f00';
    const newGuides = [ ...this.state.guides, newGuide ];
    this.setState({ guides: newGuides });
  }

  /** Update existing guide with new values */
  updateGuide(newGuide) {
    const updatedGuides = 
      this.state.guides.map(g => g.id === newGuide.id ? newGuide : g);
    this.setState({ guides: updatedGuides });
  }

  /** Remove a guide */
  removeGuide(id) {
    const newGuides = this.state.guides.filter(g => g.id !== id);
    this.setState({ guides: newGuides });
  }

  /** Set the grid size */
  setGridSize(size) {
    this.setState({ gridSize: size });
  }

  render() {
    return (
      <div style={{ 
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left:0,
          overflow: 'hidden',
          pointerEvents: 'none'
        }}
      >
        <Guides on={this.state.guidesOn} guides={this.state.guides}></Guides>
        <Grid on={this.state.gridOn} size={this.state.gridSize}></Grid>
        <MouseGuide on={this.state.mouseGuideOn}></MouseGuide>
        <button 
          className='ui-btn-trigger'
          style={{
            transform: this.state.windowOpen ? 'translate(48px, 48px)' : 'translate(0,0)',
            transition: 'transform 0.25s ease 0.125s',
            pointerEvents: 'all'
          }} 
          onClick={this.toggleWindowOpen.bind(this)}>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 640 640">
              <path fill="#fff" d="M455.968 14.016l-441.952 442.016c-18.688 18.688-18.688 49.216 0.064 67.968l101.92 101.984c18.688 18.688 49.312 18.752 67.968 0.064l442.016-442.016c18.688-18.72 18.688-49.312 0-68l-101.952-102.016c-18.784-18.752-49.344-18.656-68.064 0zM125.728 489.984l-24.288 24.288-60.672-60.704 24.288-24.288 60.672 60.704zM222.88 489.984l-24.288 24.288-109.28-109.28 24.288-24.32 109.28 109.312zM222.88 392.832l-24.288 24.288-60.736-60.672 24.32-24.32 60.704 60.704zM271.456 344.256l-24.288 24.288-60.672-60.672 24.288-24.32 60.672 60.704zM368.576 344.256l-24.288 24.288-109.248-109.248 24.288-24.288 109.248 109.248zM368.576 247.136l-24.288 24.288-60.672-60.672 24.288-24.288 60.672 60.672zM417.152 198.592l-24.288 24.288-60.704-60.704 24.288-24.288 60.704 60.704zM514.304 198.592l-24.32 24.288-109.248-109.28 24.288-24.32 109.28 109.312zM514.272 101.472l-24.288 24.288-60.672-60.736 24.288-24.256 60.672 60.704z"></path>
            </svg>
          </button>
        <ToolWindow visible={this.state.windowOpen} onClose={this.toggleWindowOpen.bind(this)}>
          <div className={styles.popover}>
            <div className={styles.section}>
              <label>
                <span>Grid</span>
                <input 
                    type="number"
                    disabled={!this.state.gridOn}
                    value={this.state.gridSize} 
                    onChange={((e) => this.setGridSize(e.target.value))} />
                <input
                  name="gridOn"
                  type="checkbox"
                  checked={this.state.gridOn}
                  onChange={this.toggleGrid.bind(this)} />
              </label>
            </div>
            <div className={styles.section}>
              <label>
                <span>Guides</span>
                <button 
                  disabled={!this.state.guidesOn} 
                  onClick={(e) => this.addGuide('top', '16px', '#ff000')}
                >+ Add</button>
                <input
                  name="gridOn"
                  type="checkbox"
                  checked={this.state.guidesOn}
                  onChange={this.toggleGuides.bind(this)} />
              </label>
              <div className='ui-scroll-content' style={{display: this.state.guidesOn ? 'block' : 'none'}}>
                {this.state.guides.map((g) => (
                  <GuideSettings 
                    key={g.id} 
                    guide={g} 
                    onGuideChange={this.updateGuide.bind(this)} 
                    onRemoveGuide={(guide) => this.removeGuide(guide.id)}  
                    />
                ))}
              </div>
            </div>
            <div className={styles.section}>
              <label>
                <span>Mouse Guides</span>
                <input
                  name="mouseGuideOn"
                  type="checkbox"
                  checked={this.state.mouseGuideOn}
                  onChange={this.toggleMouseGuide.bind(this)} />
              </label>
            </div>
          </div>
        </ToolWindow>
      </div>
    );
  }
} 

export default LayoutUtils;