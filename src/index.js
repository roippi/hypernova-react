let React, ReactDOM, ReactDOMServer;

if (process.env.NODE_ENV === 'production') {
    React = require('react/dist/react.min');
    ReactDOM = require('react-dom/dist/react-dom.min');
    ReactDOMServer = require('react-dom/dist/react-dom-server.min');
} else {
    React = require('react');
    ReactDOM = require('react-dom');
    ReactDOMServer = require('react-dom/server');
}

import hypernova, { serialize, load } from 'hypernova';

export const renderReact = (name, component) => hypernova({
  server() {
    return (props) => {
      const contents = ReactDOMServer.renderToString(React.createElement(component, props));
      return serialize(name, contents, props);
    };
  },

  client() {
    const payloads = load(name);

    if (payloads) {
      payloads.forEach((payload) => {
        const { node, data } = payload;
        const element = React.createElement(component, data);
        ReactDOM.render(element, node);
      });
    }

    return component;
  },
});

export const renderReactStatic = (name, component) => hypernova({
  server() {
    return props => ReactDOMServer.renderToStaticMarkup(React.createElement(component, props));
  },

  client() {},
});
