import { Component } from 'react'
import { Provider } from 'react-redux'
import './app.scss'
import models from './models';
import dva from './utils/dva';

const dvaApp = dva.createApp({
  initialState: {},
  models: models,
});
const store = dvaApp.getStore();
class App extends Component {

  render() {
    return (
      <Provider store={store} >
        {this.props.children}
      </Provider>
    )
  }
}

export default App
