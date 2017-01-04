Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderReactStatic = exports.renderReact = undefined;

var _react = require('react/dist/react.min');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom/dist/react-dom.min');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactDomServer = require('react-dom/dist/react-dom-server.min');

var _reactDomServer2 = _interopRequireDefault(_reactDomServer);

var _hypernova = require('hypernova');

var _hypernova2 = _interopRequireDefault(_hypernova);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var renderReact = exports.renderReact = function renderReact(name, component) {
  return (0, _hypernova2['default'])({
    server: function () {
      function server() {
        return function (props) {
          var contents = _reactDomServer2['default'].renderToString(_react2['default'].createElement(component, props));
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

            var element = _react2['default'].createElement(component, data);
            _reactDom2['default'].render(element, node);
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
          return _reactDomServer2['default'].renderToStaticMarkup(_react2['default'].createElement(component, props));
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