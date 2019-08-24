import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import HelloWorld from './components/hello-world';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const obj = {
      foo: {
        bar: {
          baz: 'Hello World',
        },
      },
    };
    console.log(obj?.foo?.bar?.x?.y?.z);
    console.log(process.env);

    return <HelloWorld title={obj?.foo?.bar?.baz} />;
  }
}

export default hot(App);
