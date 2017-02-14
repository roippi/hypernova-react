Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderReactStatic = exports.renderReact = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _react3 = require('react/dist/react.min');

var _server = require('react-dom/server');

var _hypernova = require('hypernova');

var _hypernova2 = _interopRequireDefault(_hypernova);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var ReactDOMServer = process.env.NODE_ENV === 'production' ? _react3.ReactDomServer : _server.ReactDomServer;

var DATA_KEY = 'hypernova-key';
var DATA_ID = 'hypernova-id';

// https://gist.github.com/jed/982883
function uuid() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (x) {
    return (x ^ Math.random() * 16 >> x / 4).toString(16);
  });
}

function serialize(name, html, data, id) {
  var key = name.replace(/\W/g, '');
  return '<div data-' + DATA_KEY + '="' + String(key) + '" data-' + DATA_ID + '="' + String(id) + '">' + String(html) + '</div>';
}

var renderReact = exports.renderReact = function renderReact(name, component, context) {
  return (0, _hypernova2['default'])({
    server: function () {
      function server() {
        return function (props) {
          var contents = ReactDOMServer.renderToString(_react2['default'].createElement(component, props));
          var generatedUuid = uuid();
          context.returnMeta = Object.assign({}, context.returnMeta, {
            uuid: generatedUuid
          });
          return serialize(name, contents, props, generatedUuid);
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
          return ReactDOMServer.renderToStaticMarkup(_react2['default'].createElement(component, props));
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