import React, {Component} from 'react'
import {render} from 'react-dom'

class Demo extends Component {
  render() {
    return <div>
      Demo is in React Most Wanted Project
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
