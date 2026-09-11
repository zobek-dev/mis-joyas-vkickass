/******/ (() => { // webpackBootstrap
/*!******************************!*\
  !*** ./src/js/cart-debug.js ***!
  \******************************/
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/**
 * Debugger del cart drawer Mis Joyas (carga bajo demanda vía cart-debug.js).
 * Activar: ?mj_cart_debug=1 o localStorage misjoyas_cart_debug=1
 */
(function initMisJoyasCartDebug() {
  var LOG = '[MisJoyas Cart Debug]';
  var STORAGE_KEY = 'misjoyas_cart_debug';
  var isEnabled = function isEnabled() {
    try {
      if (localStorage.getItem(STORAGE_KEY) === '1') return true;
    } catch (e) {/* ignore */}
    return new URLSearchParams(window.location.search).has('mj_cart_debug');
  };
  var getDrawer = function getDrawer() {
    return document.getElementById('CartDrawer');
  };
  var getMiniCartStore = function getMiniCartStore() {
    var _window$Alpine, _window$Alpine$store;
    return ((_window$Alpine = window.Alpine) === null || _window$Alpine === void 0 || (_window$Alpine$store = _window$Alpine.store) === null || _window$Alpine$store === void 0 ? void 0 : _window$Alpine$store.call(_window$Alpine, 'xMiniCart')) || null;
  };
  var getCartBubbleCount = function getCartBubbleCount() {
    var bubble = document.querySelector('#cart-icon-bubble [aria-hidden="true"]') || document.querySelector('#cart-icon-bubble span');
    return parseInt((bubble === null || bubble === void 0 ? void 0 : bubble.textContent) || '0', 10) || 0;
  };
  var scanStylesheets = function scanStylesheets() {
    var mainCssLinks = _toConsumableArray(document.querySelectorAll('link[rel="stylesheet"]')).filter(function (link) {
      return /main\.css/i.test(link.href);
    }).map(function (link) {
      return {
        href: link.href,
        loaded: !!link.sheet
      };
    });
    var misjoyasSelectors = [];
    var blockedSheets = [];
    var _iterator = _createForOfIteratorHelper(document.styleSheets),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var sheet = _step.value;
        var rules = void 0;
        try {
          rules = sheet.cssRules;
        } catch (error) {
          blockedSheets.push({
            href: sheet.href || '(inline)',
            reason: error.message
          });
          continue;
        }
        var _iterator2 = _createForOfIteratorHelper(rules || []),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var rule = _step2.value;
            var selector = rule.selectorText || '';
            if (selector.includes('misjoyas-cart')) {
              misjoyasSelectors.push({
                href: sheet.href || '(inline)',
                selector: selector
              });
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return {
      mainCssLinks: mainCssLinks,
      misjoyasRuleCount: misjoyasSelectors.length,
      misjoyasSample: misjoyasSelectors.slice(0, 5),
      blockedSheets: blockedSheets
    };
  };
  var inspectStyles = function inspectStyles(drawer) {
    if (!drawer) return null;
    var panel = drawer.querySelector('#update-cart, .misjoyas-cart__panel');
    var title = drawer.querySelector('.misjoyas-cart__title');
    var progress = drawer.querySelector('.misjoyas-cart-progress');
    var read = function read(el) {
      if (!el) return null;
      var style = getComputedStyle(el);
      return {
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
        maxWidth: style.maxWidth,
        width: style.width,
        zIndex: style.zIndex,
        fontSize: style.fontSize,
        color: style.color
      };
    };
    return {
      drawer: read(drawer),
      panel: read(panel),
      title: read(title),
      progress: read(progress)
    };
  };
  var inspectAlpine = function inspectAlpine(drawer) {
    var _window$Alpine2, _drawer$hasAttribute;
    var miniCart = getMiniCartStore();
    var alpineData = drawer && ((_window$Alpine2 = window.Alpine) === null || _window$Alpine2 === void 0 || (_window$Alpine2 = _window$Alpine2._x_dataStack) === null || _window$Alpine2 === void 0 ? void 0 : _window$Alpine2[0]);
    return {
      alpineLoaded: !!window.Alpine,
      miniCart: miniCart ? {
        open: miniCart.open,
        loading: miniCart.loading,
        type: miniCart.type,
        needReload: miniCart.needReload
      } : null,
      drawerXData: alpineData ? Object.keys(alpineData) : null,
      xCloakPresent: (_drawer$hasAttribute = drawer === null || drawer === void 0 ? void 0 : drawer.hasAttribute('x-cloak')) !== null && _drawer$hasAttribute !== void 0 ? _drawer$hasAttribute : false
    };
  };
  var inspectDom = function inspectDom() {
    var _drawer$classList$con, _drawer$className$inc, _drawer$innerHTML;
    var drawers = _toConsumableArray(document.querySelectorAll('#CartDrawer'));
    var drawer = drawers[0] || null;
    return {
      drawerCount: drawers.length,
      drawerPresent: !!drawer,
      classes: (drawer === null || drawer === void 0 ? void 0 : drawer.className) || null,
      hasMisjoyasRootClass: (_drawer$classList$con = drawer === null || drawer === void 0 ? void 0 : drawer.classList.contains('misjoyas-cart')) !== null && _drawer$classList$con !== void 0 ? _drawer$classList$con : false,
      hasLegacyMjClass: (_drawer$className$inc = drawer === null || drawer === void 0 ? void 0 : drawer.className.includes('mj-cart')) !== null && _drawer$className$inc !== void 0 ? _drawer$className$inc : false,
      progressPresent: !!(drawer !== null && drawer !== void 0 && drawer.querySelector('.misjoyas-cart-progress')),
      progressLegacyMj: !!(drawer !== null && drawer !== void 0 && drawer.querySelector('.mj-cart__progress')),
      panelPresent: !!(drawer !== null && drawer !== void 0 && drawer.querySelector('.misjoyas-cart__panel, #update-cart')),
      renderedIn: drawer !== null && drawer !== void 0 && drawer.closest('#ajax-loading-cart') ? 'section cart-drawer (#ajax-loading-cart)' : drawer ? 'snippet directo (theme.liquid)' : null,
      innerHTMLLength: (drawer === null || drawer === void 0 || (_drawer$innerHTML = drawer.innerHTML) === null || _drawer$innerHTML === void 0 ? void 0 : _drawer$innerHTML.length) || 0
    };
  };
  var inspectOpenLogic = function inspectOpenLogic() {
    var drawer = getDrawer();
    var itemCount = getCartBubbleCount();
    var hasProgress = !!(drawer !== null && drawer !== void 0 && drawer.querySelector('.misjoyas-cart-progress'));
    var miniCart = getMiniCartStore();
    return {
      itemCount: itemCount,
      hasProgress: hasProgress,
      wouldForceReloadOnOpen: itemCount > 0 && !hasProgress,
      reloadBlockedByLoading: !!(miniCart !== null && miniCart !== void 0 && miniCart.loading),
      onCartPage: window.location.pathname === '/cart',
      cartTypeSettingGuess: drawer !== null && drawer !== void 0 && drawer.classList.contains('drawer') ? 'drawer' : drawer !== null && drawer !== void 0 && drawer.classList.contains('popup') ? 'popup' : null
    };
  };
  var summarizeIssues = function summarizeIssues(report) {
    var _report$computed, _report$alpine$miniCa, _report$computed2;
    var issues = [];
    if (!report.dom.drawerPresent) {
      issues.push('No existe #CartDrawer en el DOM.');
    }
    if (report.dom.drawerCount > 1) {
      issues.push("Hay ".concat(report.dom.drawerCount, " elementos #CartDrawer (IDs duplicados)."));
    }
    if (report.dom.drawerPresent && !report.dom.hasMisjoyasRootClass) {
      issues.push('El drawer no tiene la clase raíz .misjoyas-cart — el CSS de Figma no aplicará.');
    }
    if (report.dom.hasLegacyMjClass) {
      issues.push('Aún hay clases legacy .mj-cart* en el drawer.');
    }
    if (report.stylesheets.misjoyasRuleCount === 0) {
      issues.push('No se encontraron reglas CSS .misjoyas-cart en stylesheets accesibles (main.css no cargado o desactualizado).');
    }
    if (report.stylesheets.mainCssLinks.length === 0) {
      issues.push('No hay <link> a main.css en la página.');
    }
    if (report.openLogic.wouldForceReloadOnOpen) {
      issues.push('openCart() forzará reLoad() porque falta .misjoyas-cart-progress en el drawer actual.');
    }
    if (!report.alpine.miniCart) {
      issues.push('Alpine.store("xMiniCart") no está disponible.');
    }
    if (report.alpine.miniCart && report.alpine.drawerXData && !report.alpine.drawerXData.includes('loading')) {
      issues.push('x-data="xCart" podría no estar inicializado en #CartDrawer.');
    }
    if (report.dom.drawerPresent && ((_report$computed = report.computed) === null || _report$computed === void 0 || (_report$computed = _report$computed.drawer) === null || _report$computed === void 0 ? void 0 : _report$computed.display) === 'none' && (_report$alpine$miniCa = report.alpine.miniCart) !== null && _report$alpine$miniCa !== void 0 && _report$alpine$miniCa.open) {
      issues.push('El store dice open=true pero #CartDrawer tiene display:none.');
    }
    if (report.dom.drawerPresent && ((_report$computed2 = report.computed) === null || _report$computed2 === void 0 || (_report$computed2 = _report$computed2.panel) === null || _report$computed2 === void 0 ? void 0 : _report$computed2.maxWidth) === '384px') {
      issues.push('Panel sigue con max-width ~384px (md:w-96 del tema base) — CSS Mis Joyas no está ganando.');
    }
    return issues;
  };
  var run = function run() {
    var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var drawer = getDrawer();
    var report = {
      at: new Date().toISOString(),
      trigger: context.trigger || 'manual',
      url: window.location.href,
      dom: inspectDom(),
      alpine: inspectAlpine(drawer),
      openLogic: inspectOpenLogic(),
      stylesheets: scanStylesheets(),
      computed: inspectStyles(drawer)
    };
    report.issues = summarizeIssues(report);
    console.group("".concat(LOG, " ").concat(report.trigger));
    console.log('Resumen DOM', report.dom);
    console.log('Alpine / estado', report.alpine);
    console.log('Lógica openCart / reLoad', report.openLogic);
    console.log('CSS cargado', report.stylesheets);
    console.log('Estilos computados', report.computed);
    if (report.issues.length) {
      console.warn('Posibles causas:', report.issues);
    } else {
      console.info('No se detectaron problemas obvios. Si el diseño sigue mal, ejecuta MisJoyasCartDebug.fetchSection().');
    }
    console.groupEnd();
    return report;
  };
  var fetchSection = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var _sectionDrawer$classL, _liveDrawer$classList, response, json, html, doc, sectionDrawer, liveDrawer, sectionInfo, liveInfo, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            console.group("".concat(LOG, " fetchSection()"));
            _context.p = 1;
            _context.n = 2;
            return fetch("".concat(window.location.pathname, "?sections=cart-drawer"));
          case 2:
            response = _context.v;
            _context.n = 3;
            return response.json();
          case 3:
            json = _context.v;
            html = json['cart-drawer'] || '';
            doc = new DOMParser().parseFromString(html, 'text/html');
            sectionDrawer = doc.querySelector('#CartDrawer');
            liveDrawer = getDrawer();
            sectionInfo = {
              htmlLength: html.length,
              hasCartDrawer: !!sectionDrawer,
              sectionClasses: (sectionDrawer === null || sectionDrawer === void 0 ? void 0 : sectionDrawer.className) || null,
              sectionHasMisjoyas: (_sectionDrawer$classL = sectionDrawer === null || sectionDrawer === void 0 ? void 0 : sectionDrawer.classList.contains('misjoyas-cart')) !== null && _sectionDrawer$classL !== void 0 ? _sectionDrawer$classL : false,
              sectionHasProgress: html.includes('misjoyas-cart-progress'),
              sectionHasLegacyMj: html.includes('mj-cart')
            };
            liveInfo = {
              classes: (liveDrawer === null || liveDrawer === void 0 ? void 0 : liveDrawer.className) || null,
              hasMisjoyas: (_liveDrawer$classList = liveDrawer === null || liveDrawer === void 0 ? void 0 : liveDrawer.classList.contains('misjoyas-cart')) !== null && _liveDrawer$classList !== void 0 ? _liveDrawer$classList : false,
              hasProgress: !!(liveDrawer !== null && liveDrawer !== void 0 && liveDrawer.querySelector('.misjoyas-cart-progress'))
            };
            console.log('Section API (cart-drawer)', sectionInfo);
            console.log('DOM live (#CartDrawer)', liveInfo);
            if (sectionInfo.sectionClasses !== liveInfo.classes) {
              console.warn('El HTML del section API no coincide con el drawer en pantalla — puede haber caché o un render distinto.');
            }
            if (sectionInfo.sectionHasMisjoyas && !liveInfo.hasMisjoyas) {
              console.warn('El section trae .misjoyas-cart pero el DOM live no — reLoad() podría no estar aplicando el HTML nuevo.');
            }
            console.groupEnd();
            return _context.a(2, {
              sectionInfo: sectionInfo,
              liveInfo: liveInfo,
              htmlSnippet: html.slice(0, 500)
            });
          case 4:
            _context.p = 4;
            _t = _context.v;
            console.error('Error al fetch cart-drawer section', _t);
            console.groupEnd();
            throw _t;
          case 5:
            return _context.a(2);
        }
      }, _callee, null, [[1, 4]]);
    }));
    return function fetchSection() {
      return _ref.apply(this, arguments);
    };
  }();
  var wrapped = false;
  var watch = function watch() {
    if (wrapped) {
      console.info("".concat(LOG, " watch ya activo"));
      return;
    }
    var wrapStore = function wrapStore() {
      var store = getMiniCartStore();
      if (!store || store.__mjDebugWrapped) return !!store;
      ['openCart', 'hideCart', 'reLoad'].forEach(function (method) {
        var _store$method;
        var original = (_store$method = store[method]) === null || _store$method === void 0 ? void 0 : _store$method.bind(store);
        if (!original) return;
        store[method] = function () {
          console.group("".concat(LOG, " xMiniCart.").concat(method, "()"));
          run({
            trigger: "xMiniCart.".concat(method)
          });
          console.groupEnd();
          return original.apply(void 0, arguments);
        };
      });
      store.__mjDebugWrapped = true;
      wrapped = true;
      console.info("".concat(LOG, " watch activo \u2014 abre/cierra el carrito para ver logs"));
      return true;
    };
    document.addEventListener('alpine:init', wrapStore);
    if (!wrapStore()) {
      window.setTimeout(wrapStore, 500);
      window.setTimeout(wrapStore, 2000);
    }
    document.addEventListener('eurus:cart:items-changed', function () {
      console.info("".concat(LOG, " evento eurus:cart:items-changed"));
      run({
        trigger: 'eurus:cart:items-changed'
      });
    });
  };
  var unwatch = function unwatch() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {/* ignore */}
    console.info("".concat(LOG, " Para desactivar watch recarga sin ?mj_cart_debug=1"));
  };
  window.MisJoyasCartDebug = {
    run: run,
    watch: watch,
    unwatch: unwatch,
    fetchSection: fetchSection,
    enable: function enable() {
      try {
        localStorage.setItem(STORAGE_KEY, '1');
      } catch (e) {/* ignore */}
      watch();
      run({
        trigger: 'enable'
      });
    }
  };
  console.info("".concat(LOG, " Debugger listo. Comandos: MisJoyasCartDebug.run(), .watch(), .fetchSection(), .enable()"));
  if (isEnabled()) {
    watch();
    window.addEventListener('load', function () {
      run({
        trigger: 'auto-load'
      });
    });
  }
})();
/******/ })()
;