import React from "react"

export default ({ children, direction, align, justify }) => (
  <div style={
    {
      display: 'flex',
      alignItems: align ? align : 'flex-start',
      justifyContent: justify ? justify : 'flex-start',
      flexDirection: direction ? direction : 'row',
      margin: '0 auto',
      maxWidth: 'var(--max-content-width)',
      padding: 'var(--spacer) var(--page-margin)'
    }
  }>{children}</div>
)