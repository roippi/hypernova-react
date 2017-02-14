let React, ReactDOM, ReactDOMServer;

if (process.env.NODE_ENV === 'production') {
    React = require('react/dist/react.min');
    ReactDOM = React.__SECRET_DOM_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    ReactDOMServer = React.__SECRET_DOM_SERVER_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
} else {
    React = require('react');
    ReactDOM = require('react-dom');
    ReactDOMServer = require('react-dom/server');
}

import hypernova, { load } from 'hypernova';

var DATA_KEY = 'hypernova-key';
var DATA_ID = 'hypernova-id';

// https://gist.github.com/jed/982883
function uuid() {
    return (
        [1e7] +
        -1e3 +
        -4e3 +
        -8e3 +
        -1e11
    ).replace(
        /[018]/g,
        x => (x ^ Math.random() * 16 >> x / 4).toString(16), // eslint-disable-line no-mixed-operators, no-bitwise, max-len
    );
}

function serialize(name, html, data, id) {
    const key = name.replace(/\W/g, '');
    return `<div data-${DATA_KEY}="${key}" data-${DATA_ID}="${id}">${html}</div>`;
}

export const renderReact = (name, component, context) => hypernova({
  server() {
    return (props) => {
      const contents = ReactDOMServer.renderToString(React.createElement(component, props));
      const generatedUuid = uuid();
      context.returnMeta = {
          ...context.returnMeta,
          uuid: generatedUuid
      };
      return serialize(name, contents, props, generatedUuid);
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
