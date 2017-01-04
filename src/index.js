import React from 'react/dist/react.min';
import ReactDOM from 'react-dom/dist/react-dom.min';
import ReactDOMServer from 'react-dom/dist/react-dom-server.min';
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
