import { Component } from 'react';
import { Provider } from 'react-redux';
import './app.scss';
import models from './models';
import dva from './utils/dva';
import './styles/icon.scss';

const dvaApp = dva.createApp({
  initialState: {},
  models: models,
});
const store = dvaApp.getStore();
class App extends Component {
  componentDidMount() {
    store.dispatch({ type: 'user/getCurrentUserInfo' });
  }
  render() {
    return <Provider store={store}>{this.props.children}</Provider>;
  }
}

export default App;
