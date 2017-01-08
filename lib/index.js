Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderReactStatic = exports.renderReact = undefined;

var _hypernova = require('hypernova');

var _hypernova2 = _interopRequireDefault(_hypernova);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var React = void 0,
    ReactDOM = void 0,
    ReactDOMServer = void 0;

if (process.env.NODE_ENV === 'production') {
  React = require('react/dist/react.min');
  ReactDOM = require('react-dom/dist/react-dom.min');
  ReactDOMServer = require('react-dom/dist/react-dom-server.min');
} else {
  React = require('react');
  ReactDOM = require('react-dom');
  ReactDOMServer = require('react-dom/server');
}

var renderReact = exports.renderReact = function renderReact(name, component) {
  return (0, _hypernova2['default'])({
    server: function () {
      function server() {
        return function (props) {
          var contents = ReactDOMServer.renderToString(React.createElement(component, props));
          return (0, _hypernova.serialize)(name, contents, props);
        };
      }

      return server;
    }(),
    client: function () {
      function client() {
        var payloads = (0, _hypernova.load)(name);

        if (payloads) {
          payloads.forEach(function (payload) {
            var node = payload.node,
                data = payload.data;

            var element = React.createElement(component, data);
            ReactDOM.render(element, node);
          });
        }

        return component;
      }

      return client;
    }()
  });
};

var renderReactStatic = exports.renderReactStatic = function renderReactStatic(name, component) {
  return (0, _hypernova2['default'])({
    server: function () {
      function server() {
        return function (props) {
          return ReactDOMServer.renderToStaticMarkup(React.createElement(component, props));
        };
      }

      return server;
    }(),
    client: function () {
      function client() {}

      return client;
    }()
  });
};