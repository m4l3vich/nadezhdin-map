import { c as P, g as T } from "./_commonjsHelpers-f3sTPFkQ.js";
var V = function() {
  var t = "", e, o, i, s = [], n = { passive: !0 };
  window.addEventListener ? (e = "addEventListener", o = "removeEventListener") : (e = "attachEvent", o = "detachEvent", t = "on"), i = "onwheel" in document.createElement("div") ? "wheel" : (
    // Modern browsers support "wheel"
    document.onmousewheel !== void 0 ? "mousewheel" : (
      // Webkit and IE support at least "mousewheel"
      "DOMMouseScroll"
    )
  );
  function a(h, l) {
    var f = function(p) {
      !p && (p = window.event);
      var d = {
        // keep a ref to the original event object
        originalEvent: p,
        target: p.target || p.srcElement,
        type: "wheel",
        deltaMode: p.type == "MozMousePixelScroll" ? 0 : 1,
        deltaX: 0,
        delatZ: 0,
        preventDefault: function() {
          p.preventDefault ? p.preventDefault() : p.returnValue = !1;
        }
      };
      return i == "mousewheel" ? (d.deltaY = -0.025 * p.wheelDelta, p.wheelDeltaX && (d.deltaX = -0.025 * p.wheelDeltaX)) : d.deltaY = p.detail, l(d);
    };
    return s.push({
      element: h,
      fn: f
    }), f;
  }
  function c(h) {
    for (var l = 0; l < s.length; l++)
      if (s[l].element === h)
        return s[l].fn;
    return function() {
    };
  }
  function g(h) {
    for (var l = 0; l < s.length; l++)
      if (s[l].element === h)
        return s.splice(l, 1);
  }
  function M(h, l, f, p) {
    var d;
    i === "wheel" ? d = f : d = a(h, f), h[e](t + l, d, p ? n : !1);
  }
  function x(h, l, f, p) {
    var d;
    i === "wheel" ? d = f : d = c(h), h[o](t + l, d, p ? n : !1), g(h);
  }
  function S(h, l, f) {
    M(h, i, l, f), i == "DOMMouseScroll" && M(h, "MozMousePixelScroll", l, f);
  }
  function D(h, l, f) {
    x(h, i, l, f), i == "DOMMouseScroll" && x(h, "MozMousePixelScroll", l, f);
  }
  return {
    on: S,
    off: D
  };
}(), z = {
  /**
   * Extends an object
   *
   * @param  {Object} target object to extend
   * @param  {Object} source object to take properties from
   * @return {Object}        extended object
   */
  extend: function(t, e) {
    t = t || {};
    for (var o in e)
      this.isObject(e[o]) ? t[o] = this.extend(t[o], e[o]) : t[o] = e[o];
    return t;
  },
  /**
   * Checks if an object is a DOM element
   *
   * @param  {Object}  o HTML element or String
   * @return {Boolean}   returns true if object is a DOM element
   */
  isElement: function(t) {
    return t instanceof HTMLElement || t instanceof SVGElement || t instanceof SVGSVGElement || //DOM2
    t && typeof t == "object" && t !== null && t.nodeType === 1 && typeof t.nodeName == "string";
  },
  /**
   * Checks if an object is an Object
   *
   * @param  {Object}  o Object
   * @return {Boolean}   returns true if object is an Object
   */
  isObject: function(t) {
    return Object.prototype.toString.call(t) === "[object Object]";
  },
  /**
   * Checks if variable is Number
   *
   * @param  {Integer|Float}  n
   * @return {Boolean}   returns true if variable is Number
   */
  isNumber: function(t) {
    return !isNaN(parseFloat(t)) && isFinite(t);
  },
  /**
   * Search for an SVG element
   *
   * @param  {Object|String} elementOrSelector DOM Element or selector String
   * @return {Object|Null}                   SVG or null
   */
  getSvg: function(t) {
    var e, o;
    if (this.isElement(t))
      e = t;
    else if (typeof t == "string" || t instanceof String) {
      if (e = document.querySelector(t), !e)
        throw new Error(
          "Provided selector did not find any elements. Selector: " + t
        );
    } else
      throw new Error("Provided selector is not an HTML object nor String");
    if (e.tagName.toLowerCase() === "svg")
      o = e;
    else if (e.tagName.toLowerCase() === "object")
      o = e.contentDocument.documentElement;
    else if (e.tagName.toLowerCase() === "embed")
      o = e.getSVGDocument().documentElement;
    else
      throw e.tagName.toLowerCase() === "img" ? new Error(
        'Cannot script an SVG in an "img" element. Please use an "object" element or an in-line SVG.'
      ) : new Error("Cannot get SVG.");
    return o;
  },
  /**
   * Attach a given context to a function
   * @param  {Function} fn      Function
   * @param  {Object}   context Context
   * @return {Function}           Function with certain context
   */
  proxy: function(t, e) {
    return function() {
      return t.apply(e, arguments);
    };
  },
  /**
   * Returns object type
   * Uses toString that returns [object SVGPoint]
   * And than parses object type from string
   *
   * @param  {Object} o Any object
   * @return {String}   Object type
   */
  getType: function(t) {
    return Object.prototype.toString.apply(t).replace(/^\[object\s/, "").replace(/\]$/, "");
  },
  /**
   * If it is a touch event than add clientX and clientY to event object
   *
   * @param  {Event} evt
   * @param  {SVGSVGElement} svg
   */
  mouseAndTouchNormalize: function(t, e) {
    if (t.clientX === void 0 || t.clientX === null)
      if (t.clientX = 0, t.clientY = 0, t.touches !== void 0 && t.touches.length) {
        if (t.touches[0].clientX !== void 0)
          t.clientX = t.touches[0].clientX, t.clientY = t.touches[0].clientY;
        else if (t.touches[0].pageX !== void 0) {
          var o = e.getBoundingClientRect();
          t.clientX = t.touches[0].pageX - o.left, t.clientY = t.touches[0].pageY - o.top;
        }
      } else
        t.originalEvent !== void 0 && t.originalEvent.clientX !== void 0 && (t.clientX = t.originalEvent.clientX, t.clientY = t.originalEvent.clientY);
  },
  /**
   * Check if an event is a double click/tap
   * TODO: For touch gestures use a library (hammer.js) that takes in account other events
   * (touchmove and touchend). It should take in account tap duration and traveled distance
   *
   * @param  {Event}  evt
   * @param  {Event}  prevEvt Previous Event
   * @return {Boolean}
   */
  isDblClick: function(t, e) {
    if (t.detail === 2)
      return !0;
    if (e != null) {
      var o = t.timeStamp - e.timeStamp, i = Math.sqrt(
        Math.pow(t.clientX - e.clientX, 2) + Math.pow(t.clientY - e.clientY, 2)
      );
      return o < 250 && i < 10;
    }
    return !1;
  },
  /**
   * Returns current timestamp as an integer
   *
   * @return {Number}
   */
  now: Date.now || function() {
    return (/* @__PURE__ */ new Date()).getTime();
  },
  // From underscore.
  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  throttle: function(t, e, o) {
    var i = this, s, n, a, c = null, g = 0;
    o || (o = {});
    var M = function() {
      g = o.leading === !1 ? 0 : i.now(), c = null, a = t.apply(s, n), c || (s = n = null);
    };
    return function() {
      var x = i.now();
      !g && o.leading === !1 && (g = x);
      var S = e - (x - g);
      return s = this, n = arguments, S <= 0 || S > e ? (clearTimeout(c), c = null, g = x, a = t.apply(s, n), c || (s = n = null)) : !c && o.trailing !== !1 && (c = setTimeout(M, S)), a;
    };
  },
  /**
   * Create a requestAnimationFrame simulation
   *
   * @param  {Number|String} refreshRate
   * @return {Function}
   */
  createRequestAnimationFrame: function(t) {
    var e = null;
    return t !== "auto" && t < 60 && t > 1 && (e = Math.floor(1e3 / t)), e === null ? window.requestAnimationFrame || A(33) : A(e);
  }
};
function A(t) {
  return function(e) {
    window.setTimeout(e, t);
  };
}
var Z = z, B = "unknown";
document.documentMode && (B = "ie");
var C = {
  svgNS: "http://www.w3.org/2000/svg",
  xmlNS: "http://www.w3.org/XML/1998/namespace",
  xmlnsNS: "http://www.w3.org/2000/xmlns/",
  xlinkNS: "http://www.w3.org/1999/xlink",
  evNS: "http://www.w3.org/2001/xml-events",
  /**
   * Get svg dimensions: width and height
   *
   * @param  {SVGSVGElement} svg
   * @return {Object}     {width: 0, height: 0}
   */
  getBoundingClientRectNormalized: function(t) {
    if (t.clientWidth && t.clientHeight)
      return { width: t.clientWidth, height: t.clientHeight };
    if (t.getBoundingClientRect())
      return t.getBoundingClientRect();
    throw new Error("Cannot get BoundingClientRect for SVG.");
  },
  /**
   * Gets g element with class of "viewport" or creates it if it doesn't exist
   *
   * @param  {SVGSVGElement} svg
   * @return {SVGElement}     g (group) element
   */
  getOrCreateViewport: function(t, e) {
    var o = null;
    if (Z.isElement(e) ? o = e : o = t.querySelector(e), !o) {
      var i = Array.prototype.slice.call(t.childNodes || t.children).filter(function(g) {
        return g.nodeName !== "defs" && g.nodeName !== "#text";
      });
      i.length === 1 && i[0].nodeName === "g" && i[0].getAttribute("transform") === null && (o = i[0]);
    }
    if (!o) {
      var s = "viewport-" + (/* @__PURE__ */ new Date()).toISOString().replace(/\D/g, "");
      o = document.createElementNS(this.svgNS, "g"), o.setAttribute("id", s);
      var n = t.childNodes || t.children;
      if (n && n.length > 0)
        for (var a = n.length; a > 0; a--)
          n[n.length - a].nodeName !== "defs" && o.appendChild(n[n.length - a]);
      t.appendChild(o);
    }
    var c = [];
    return o.getAttribute("class") && (c = o.getAttribute("class").split(" ")), ~c.indexOf("svg-pan-zoom_viewport") || (c.push("svg-pan-zoom_viewport"), o.setAttribute("class", c.join(" "))), o;
  },
  /**
   * Set SVG attributes
   *
   * @param  {SVGSVGElement} svg
   */
  setupSvgAttributes: function(t) {
    if (t.setAttribute("xmlns", this.svgNS), t.setAttributeNS(this.xmlnsNS, "xmlns:xlink", this.xlinkNS), t.setAttributeNS(this.xmlnsNS, "xmlns:ev", this.evNS), t.parentNode !== null) {
      var e = t.getAttribute("style") || "";
      e.toLowerCase().indexOf("overflow") === -1 && t.setAttribute("style", "overflow: hidden; " + e);
    }
  },
  /**
   * How long Internet Explorer takes to finish updating its display (ms).
   */
  internetExplorerRedisplayInterval: 300,
  /**
   * Forces the browser to redisplay all SVG elements that rely on an
   * element defined in a 'defs' section. It works globally, for every
   * available defs element on the page.
   * The throttling is intentionally global.
   *
   * This is only needed for IE. It is as a hack to make markers (and 'use' elements?)
   * visible after pan/zoom when there are multiple SVGs on the page.
   * See bug report: https://connect.microsoft.com/IE/feedback/details/781964/
   * also see svg-pan-zoom issue: https://github.com/ariutta/svg-pan-zoom/issues/62
   */
  refreshDefsGlobal: Z.throttle(
    function() {
      for (var t = document.querySelectorAll("defs"), e = t.length, o = 0; o < e; o++) {
        var i = t[o];
        i.parentNode.insertBefore(i, i);
      }
    },
    P ? P.internetExplorerRedisplayInterval : null
  ),
  /**
   * Sets the current transform matrix of an element
   *
   * @param {SVGElement} element
   * @param {SVGMatrix} matrix  CTM
   * @param {SVGElement} defs
   */
  setCTM: function(t, e, o) {
    var i = this, s = "matrix(" + e.a + "," + e.b + "," + e.c + "," + e.d + "," + e.e + "," + e.f + ")";
    t.setAttributeNS(null, "transform", s), "transform" in t.style ? t.style.transform = s : "-ms-transform" in t.style ? t.style["-ms-transform"] = s : "-webkit-transform" in t.style && (t.style["-webkit-transform"] = s), B === "ie" && o && (o.parentNode.insertBefore(o, o), window.setTimeout(function() {
      i.refreshDefsGlobal();
    }, i.internetExplorerRedisplayInterval));
  },
  /**
   * Instantiate an SVGPoint object with given event coordinates
   *
   * @param {Event} evt
   * @param  {SVGSVGElement} svg
   * @return {SVGPoint}     point
   */
  getEventPoint: function(t, e) {
    var o = e.createSVGPoint();
    return Z.mouseAndTouchNormalize(t, e), o.x = t.clientX, o.y = t.clientY, o;
  },
  /**
   * Get SVG center point
   *
   * @param  {SVGSVGElement} svg
   * @return {SVGPoint}
   */
  getSvgCenterPoint: function(t, e, o) {
    return this.createSVGPoint(t, e / 2, o / 2);
  },
  /**
   * Create a SVGPoint with given x and y
   *
   * @param  {SVGSVGElement} svg
   * @param  {Number} x
   * @param  {Number} y
   * @return {SVGPoint}
   */
  createSVGPoint: function(t, e, o) {
    var i = t.createSVGPoint();
    return i.x = e, i.y = o, i;
  }
}, m = C, L = {
  enable: function(t) {
    var e = t.svg.querySelector("defs");
    e || (e = document.createElementNS(m.svgNS, "defs"), t.svg.appendChild(e));
    var o = e.querySelector("style#svg-pan-zoom-controls-styles");
    if (!o) {
      var i = document.createElementNS(m.svgNS, "style");
      i.setAttribute("id", "svg-pan-zoom-controls-styles"), i.setAttribute("type", "text/css"), i.textContent = ".svg-pan-zoom-control { cursor: pointer; fill: black; fill-opacity: 0.333; } .svg-pan-zoom-control:hover { fill-opacity: 0.8; } .svg-pan-zoom-control-background { fill: white; fill-opacity: 0.5; } .svg-pan-zoom-control-background { fill-opacity: 0.8; }", e.appendChild(i);
    }
    var s = document.createElementNS(m.svgNS, "g");
    s.setAttribute("id", "svg-pan-zoom-controls"), s.setAttribute(
      "transform",
      "translate(" + (t.width - 70) + " " + (t.height - 76) + ") scale(0.75)"
    ), s.setAttribute("class", "svg-pan-zoom-control"), s.appendChild(this._createZoomIn(t)), s.appendChild(this._createZoomReset(t)), s.appendChild(this._createZoomOut(t)), t.svg.appendChild(s), t.controlIcons = s;
  },
  _createZoomIn: function(t) {
    var e = document.createElementNS(m.svgNS, "g");
    e.setAttribute("id", "svg-pan-zoom-zoom-in"), e.setAttribute("transform", "translate(30.5 5) scale(0.015)"), e.setAttribute("class", "svg-pan-zoom-control"), e.addEventListener(
      "click",
      function() {
        t.getPublicInstance().zoomIn();
      },
      !1
    ), e.addEventListener(
      "touchstart",
      function() {
        t.getPublicInstance().zoomIn();
      },
      !1
    );
    var o = document.createElementNS(m.svgNS, "rect");
    o.setAttribute("x", "0"), o.setAttribute("y", "0"), o.setAttribute("width", "1500"), o.setAttribute("height", "1400"), o.setAttribute("class", "svg-pan-zoom-control-background"), e.appendChild(o);
    var i = document.createElementNS(m.svgNS, "path");
    return i.setAttribute(
      "d",
      "M1280 576v128q0 26 -19 45t-45 19h-320v320q0 26 -19 45t-45 19h-128q-26 0 -45 -19t-19 -45v-320h-320q-26 0 -45 -19t-19 -45v-128q0 -26 19 -45t45 -19h320v-320q0 -26 19 -45t45 -19h128q26 0 45 19t19 45v320h320q26 0 45 19t19 45zM1536 1120v-960 q0 -119 -84.5 -203.5t-203.5 -84.5h-960q-119 0 -203.5 84.5t-84.5 203.5v960q0 119 84.5 203.5t203.5 84.5h960q119 0 203.5 -84.5t84.5 -203.5z"
    ), i.setAttribute("class", "svg-pan-zoom-control-element"), e.appendChild(i), e;
  },
  _createZoomReset: function(t) {
    var e = document.createElementNS(m.svgNS, "g");
    e.setAttribute("id", "svg-pan-zoom-reset-pan-zoom"), e.setAttribute("transform", "translate(5 35) scale(0.4)"), e.setAttribute("class", "svg-pan-zoom-control"), e.addEventListener(
      "click",
      function() {
        t.getPublicInstance().reset();
      },
      !1
    ), e.addEventListener(
      "touchstart",
      function() {
        t.getPublicInstance().reset();
      },
      !1
    );
    var o = document.createElementNS(
      m.svgNS,
      "rect"
    );
    o.setAttribute("x", "2"), o.setAttribute("y", "2"), o.setAttribute("width", "182"), o.setAttribute("height", "58"), o.setAttribute(
      "class",
      "svg-pan-zoom-control-background"
    ), e.appendChild(o);
    var i = document.createElementNS(
      m.svgNS,
      "path"
    );
    i.setAttribute(
      "d",
      "M33.051,20.632c-0.742-0.406-1.854-0.609-3.338-0.609h-7.969v9.281h7.769c1.543,0,2.701-0.188,3.473-0.562c1.365-0.656,2.048-1.953,2.048-3.891C35.032,22.757,34.372,21.351,33.051,20.632z"
    ), i.setAttribute(
      "class",
      "svg-pan-zoom-control-element"
    ), e.appendChild(i);
    var s = document.createElementNS(
      m.svgNS,
      "path"
    );
    return s.setAttribute(
      "d",
      "M170.231,0.5H15.847C7.102,0.5,0.5,5.708,0.5,11.84v38.861C0.5,56.833,7.102,61.5,15.847,61.5h154.384c8.745,0,15.269-4.667,15.269-10.798V11.84C185.5,5.708,178.976,0.5,170.231,0.5z M42.837,48.569h-7.969c-0.219-0.766-0.375-1.383-0.469-1.852c-0.188-0.969-0.289-1.961-0.305-2.977l-0.047-3.211c-0.03-2.203-0.41-3.672-1.142-4.406c-0.732-0.734-2.103-1.102-4.113-1.102h-7.05v13.547h-7.055V14.022h16.524c2.361,0.047,4.178,0.344,5.45,0.891c1.272,0.547,2.351,1.352,3.234,2.414c0.731,0.875,1.31,1.844,1.737,2.906s0.64,2.273,0.64,3.633c0,1.641-0.414,3.254-1.242,4.84s-2.195,2.707-4.102,3.363c1.594,0.641,2.723,1.551,3.387,2.73s0.996,2.98,0.996,5.402v2.32c0,1.578,0.063,2.648,0.19,3.211c0.19,0.891,0.635,1.547,1.333,1.969V48.569z M75.579,48.569h-26.18V14.022h25.336v6.117H56.454v7.336h16.781v6H56.454v8.883h19.125V48.569z M104.497,46.331c-2.44,2.086-5.887,3.129-10.34,3.129c-4.548,0-8.125-1.027-10.731-3.082s-3.909-4.879-3.909-8.473h6.891c0.224,1.578,0.662,2.758,1.316,3.539c1.196,1.422,3.246,2.133,6.15,2.133c1.739,0,3.151-0.188,4.236-0.562c2.058-0.719,3.087-2.055,3.087-4.008c0-1.141-0.504-2.023-1.512-2.648c-1.008-0.609-2.607-1.148-4.796-1.617l-3.74-0.82c-3.676-0.812-6.201-1.695-7.576-2.648c-2.328-1.594-3.492-4.086-3.492-7.477c0-3.094,1.139-5.664,3.417-7.711s5.623-3.07,10.036-3.07c3.685,0,6.829,0.965,9.431,2.895c2.602,1.93,3.966,4.73,4.093,8.402h-6.938c-0.128-2.078-1.057-3.555-2.787-4.43c-1.154-0.578-2.587-0.867-4.301-0.867c-1.907,0-3.428,0.375-4.565,1.125c-1.138,0.75-1.706,1.797-1.706,3.141c0,1.234,0.561,2.156,1.682,2.766c0.721,0.406,2.25,0.883,4.589,1.43l6.063,1.43c2.657,0.625,4.648,1.461,5.975,2.508c2.059,1.625,3.089,3.977,3.089,7.055C108.157,41.624,106.937,44.245,104.497,46.331z M139.61,48.569h-26.18V14.022h25.336v6.117h-18.281v7.336h16.781v6h-16.781v8.883h19.125V48.569z M170.337,20.14h-10.336v28.43h-7.266V20.14h-10.383v-6.117h27.984V20.14z"
    ), s.setAttribute(
      "class",
      "svg-pan-zoom-control-element"
    ), e.appendChild(s), e;
  },
  _createZoomOut: function(t) {
    var e = document.createElementNS(m.svgNS, "g");
    e.setAttribute("id", "svg-pan-zoom-zoom-out"), e.setAttribute("transform", "translate(30.5 70) scale(0.015)"), e.setAttribute("class", "svg-pan-zoom-control"), e.addEventListener(
      "click",
      function() {
        t.getPublicInstance().zoomOut();
      },
      !1
    ), e.addEventListener(
      "touchstart",
      function() {
        t.getPublicInstance().zoomOut();
      },
      !1
    );
    var o = document.createElementNS(m.svgNS, "rect");
    o.setAttribute("x", "0"), o.setAttribute("y", "0"), o.setAttribute("width", "1500"), o.setAttribute("height", "1400"), o.setAttribute("class", "svg-pan-zoom-control-background"), e.appendChild(o);
    var i = document.createElementNS(m.svgNS, "path");
    return i.setAttribute(
      "d",
      "M1280 576v128q0 26 -19 45t-45 19h-896q-26 0 -45 -19t-19 -45v-128q0 -26 19 -45t45 -19h896q26 0 45 19t19 45zM1536 1120v-960q0 -119 -84.5 -203.5t-203.5 -84.5h-960q-119 0 -203.5 84.5t-84.5 203.5v960q0 119 84.5 203.5t203.5 84.5h960q119 0 203.5 -84.5 t84.5 -203.5z"
    ), i.setAttribute("class", "svg-pan-zoom-control-element"), e.appendChild(i), e;
  },
  disable: function(t) {
    t.controlIcons && (t.controlIcons.parentNode.removeChild(t.controlIcons), t.controlIcons = null);
  }
}, O = C, y = z, u = function(t, e) {
  this.init(t, e);
};
u.prototype.init = function(t, e) {
  this.viewport = t, this.options = e, this.originalState = { zoom: 1, x: 0, y: 0 }, this.activeState = { zoom: 1, x: 0, y: 0 }, this.updateCTMCached = y.proxy(this.updateCTM, this), this.requestAnimationFrame = y.createRequestAnimationFrame(
    this.options.refreshRate
  ), this.viewBox = { x: 0, y: 0, width: 0, height: 0 }, this.cacheViewBox();
  var o = this.processCTM();
  this.setCTM(o), this.updateCTM();
};
u.prototype.cacheViewBox = function() {
  var t = this.options.svg.getAttribute("viewBox");
  if (t) {
    var e = t.split(/[\s\,]/).filter(function(i) {
      return i;
    }).map(parseFloat);
    this.viewBox.x = e[0], this.viewBox.y = e[1], this.viewBox.width = e[2], this.viewBox.height = e[3];
    var o = Math.min(
      this.options.width / this.viewBox.width,
      this.options.height / this.viewBox.height
    );
    this.activeState.zoom = o, this.activeState.x = (this.options.width - this.viewBox.width * o) / 2, this.activeState.y = (this.options.height - this.viewBox.height * o) / 2, this.updateCTMOnNextFrame(), this.options.svg.removeAttribute("viewBox");
  } else
    this.simpleViewBoxCache();
};
u.prototype.simpleViewBoxCache = function() {
  var t = this.viewport.getBBox();
  this.viewBox.x = t.x, this.viewBox.y = t.y, this.viewBox.width = t.width, this.viewBox.height = t.height;
};
u.prototype.getViewBox = function() {
  return y.extend({}, this.viewBox);
};
u.prototype.processCTM = function() {
  var t = this.getCTM();
  if (this.options.fit || this.options.contain) {
    var e;
    this.options.fit ? e = Math.min(
      this.options.width / this.viewBox.width,
      this.options.height / this.viewBox.height
    ) : e = Math.max(
      this.options.width / this.viewBox.width,
      this.options.height / this.viewBox.height
    ), t.a = e, t.d = e, t.e = -this.viewBox.x * e, t.f = -this.viewBox.y * e;
  }
  if (this.options.center) {
    var o = (this.options.width - (this.viewBox.width + this.viewBox.x * 2) * t.a) * 0.5, i = (this.options.height - (this.viewBox.height + this.viewBox.y * 2) * t.a) * 0.5;
    t.e = o, t.f = i;
  }
  return this.originalState.zoom = t.a, this.originalState.x = t.e, this.originalState.y = t.f, t;
};
u.prototype.getOriginalState = function() {
  return y.extend({}, this.originalState);
};
u.prototype.getState = function() {
  return y.extend({}, this.activeState);
};
u.prototype.getZoom = function() {
  return this.activeState.zoom;
};
u.prototype.getRelativeZoom = function() {
  return this.activeState.zoom / this.originalState.zoom;
};
u.prototype.computeRelativeZoom = function(t) {
  return t / this.originalState.zoom;
};
u.prototype.getPan = function() {
  return { x: this.activeState.x, y: this.activeState.y };
};
u.prototype.getCTM = function() {
  var t = this.options.svg.createSVGMatrix();
  return t.a = this.activeState.zoom, t.b = 0, t.c = 0, t.d = this.activeState.zoom, t.e = this.activeState.x, t.f = this.activeState.y, t;
};
u.prototype.setCTM = function(t) {
  var e = this.isZoomDifferent(t), o = this.isPanDifferent(t);
  if (e || o) {
    if (e && (this.options.beforeZoom(
      this.getRelativeZoom(),
      this.computeRelativeZoom(t.a)
    ) === !1 ? (t.a = t.d = this.activeState.zoom, e = !1) : (this.updateCache(t), this.options.onZoom(this.getRelativeZoom()))), o) {
      var i = this.options.beforePan(this.getPan(), {
        x: t.e,
        y: t.f
      }), s = !1, n = !1;
      i === !1 ? (t.e = this.getPan().x, t.f = this.getPan().y, s = n = !0) : y.isObject(i) && (i.x === !1 ? (t.e = this.getPan().x, s = !0) : y.isNumber(i.x) && (t.e = i.x), i.y === !1 ? (t.f = this.getPan().y, n = !0) : y.isNumber(i.y) && (t.f = i.y)), s && n || !this.isPanDifferent(t) ? o = !1 : (this.updateCache(t), this.options.onPan(this.getPan()));
    }
    (e || o) && this.updateCTMOnNextFrame();
  }
};
u.prototype.isZoomDifferent = function(t) {
  return this.activeState.zoom !== t.a;
};
u.prototype.isPanDifferent = function(t) {
  return this.activeState.x !== t.e || this.activeState.y !== t.f;
};
u.prototype.updateCache = function(t) {
  this.activeState.zoom = t.a, this.activeState.x = t.e, this.activeState.y = t.f;
};
u.prototype.pendingUpdate = !1;
u.prototype.updateCTMOnNextFrame = function() {
  this.pendingUpdate || (this.pendingUpdate = !0, this.requestAnimationFrame.call(window, this.updateCTMCached));
};
u.prototype.updateCTM = function() {
  var t = this.getCTM();
  O.setCTM(this.viewport, t, this.defs), this.pendingUpdate = !1, this.options.onUpdatedCTM && this.options.onUpdatedCTM(t);
};
var q = function(t, e) {
  return new u(t, e);
}, N = V, E = L, v = z, b = C, k = q, r = function(t, e) {
  this.init(t, e);
}, W = {
  viewportSelector: ".svg-pan-zoom_viewport",
  // Viewport selector. Can be querySelector string or SVGElement
  panEnabled: !0,
  // enable or disable panning (default enabled)
  controlIconsEnabled: !1,
  // insert icons to give user an option in addition to mouse events to control pan/zoom (default disabled)
  zoomEnabled: !0,
  // enable or disable zooming (default enabled)
  dblClickZoomEnabled: !0,
  // enable or disable zooming by double clicking (default enabled)
  mouseWheelZoomEnabled: !0,
  // enable or disable zooming by mouse wheel (default enabled)
  preventMouseEventsDefault: !0,
  // enable or disable preventDefault for mouse events
  zoomScaleSensitivity: 0.1,
  // Zoom sensitivity
  minZoom: 0.5,
  // Minimum Zoom level
  maxZoom: 10,
  // Maximum Zoom level
  fit: !0,
  // enable or disable viewport fit in SVG (default true)
  contain: !1,
  // enable or disable viewport contain the svg (default false)
  center: !0,
  // enable or disable viewport centering in SVG (default true)
  refreshRate: "auto",
  // Maximum number of frames per second (altering SVG's viewport)
  beforeZoom: null,
  onZoom: null,
  beforePan: null,
  onPan: null,
  customEventsHandler: null,
  eventsListenerElement: null,
  onUpdatedCTM: null
}, I = { passive: !0 };
r.prototype.init = function(t, e) {
  var o = this;
  this.svg = t, this.defs = t.querySelector("defs"), b.setupSvgAttributes(this.svg), this.options = v.extend(v.extend({}, W), e), this.state = "none";
  var i = b.getBoundingClientRectNormalized(
    t
  );
  this.width = i.width, this.height = i.height, this.viewport = k(
    b.getOrCreateViewport(this.svg, this.options.viewportSelector),
    {
      svg: this.svg,
      width: this.width,
      height: this.height,
      fit: this.options.fit,
      contain: this.options.contain,
      center: this.options.center,
      refreshRate: this.options.refreshRate,
      // Put callbacks into functions as they can change through time
      beforeZoom: function(n, a) {
        if (o.viewport && o.options.beforeZoom)
          return o.options.beforeZoom(n, a);
      },
      onZoom: function(n) {
        if (o.viewport && o.options.onZoom)
          return o.options.onZoom(n);
      },
      beforePan: function(n, a) {
        if (o.viewport && o.options.beforePan)
          return o.options.beforePan(n, a);
      },
      onPan: function(n) {
        if (o.viewport && o.options.onPan)
          return o.options.onPan(n);
      },
      onUpdatedCTM: function(n) {
        if (o.viewport && o.options.onUpdatedCTM)
          return o.options.onUpdatedCTM(n);
      }
    }
  );
  var s = this.getPublicInstance();
  s.setBeforeZoom(this.options.beforeZoom), s.setOnZoom(this.options.onZoom), s.setBeforePan(this.options.beforePan), s.setOnPan(this.options.onPan), s.setOnUpdatedCTM(this.options.onUpdatedCTM), this.options.controlIconsEnabled && E.enable(this), this.lastMouseWheelEventTime = Date.now(), this.setupHandlers();
};
r.prototype.setupHandlers = function() {
  var t = this, e = null;
  if (this.eventListeners = {
    // Mouse down group
    mousedown: function(n) {
      var a = t.handleMouseDown(n, e);
      return e = n, a;
    },
    touchstart: function(n) {
      var a = t.handleMouseDown(n, e);
      return e = n, a;
    },
    // Mouse up group
    mouseup: function(n) {
      return t.handleMouseUp(n);
    },
    touchend: function(n) {
      return t.handleMouseUp(n);
    },
    // Mouse move group
    mousemove: function(n) {
      return t.handleMouseMove(n);
    },
    touchmove: function(n) {
      return t.handleMouseMove(n);
    },
    // Mouse leave group
    mouseleave: function(n) {
      return t.handleMouseUp(n);
    },
    touchleave: function(n) {
      return t.handleMouseUp(n);
    },
    touchcancel: function(n) {
      return t.handleMouseUp(n);
    }
  }, this.options.customEventsHandler != null) {
    this.options.customEventsHandler.init({
      svgElement: this.svg,
      eventsListenerElement: this.options.eventsListenerElement,
      instance: this.getPublicInstance()
    });
    var o = this.options.customEventsHandler.haltEventListeners;
    if (o && o.length)
      for (var i = o.length - 1; i >= 0; i--)
        this.eventListeners.hasOwnProperty(o[i]) && delete this.eventListeners[o[i]];
  }
  for (var s in this.eventListeners)
    (this.options.eventsListenerElement || this.svg).addEventListener(
      s,
      this.eventListeners[s],
      this.options.preventMouseEventsDefault ? !1 : I
    );
  this.options.mouseWheelZoomEnabled && (this.options.mouseWheelZoomEnabled = !1, this.enableMouseWheelZoom());
};
r.prototype.enableMouseWheelZoom = function() {
  if (!this.options.mouseWheelZoomEnabled) {
    var t = this;
    this.wheelListener = function(o) {
      return t.handleMouseWheel(o);
    };
    var e = !this.options.preventMouseEventsDefault;
    N.on(
      this.options.eventsListenerElement || this.svg,
      this.wheelListener,
      e
    ), this.options.mouseWheelZoomEnabled = !0;
  }
};
r.prototype.disableMouseWheelZoom = function() {
  if (this.options.mouseWheelZoomEnabled) {
    var t = !this.options.preventMouseEventsDefault;
    N.off(
      this.options.eventsListenerElement || this.svg,
      this.wheelListener,
      t
    ), this.options.mouseWheelZoomEnabled = !1;
  }
};
r.prototype.handleMouseWheel = function(t) {
  if (!(!this.options.zoomEnabled || this.state !== "none")) {
    this.options.preventMouseEventsDefault && (t.preventDefault ? t.preventDefault() : t.returnValue = !1);
    var e = t.deltaY || 1, o = Date.now() - this.lastMouseWheelEventTime, i = 3 + Math.max(0, 30 - o);
    this.lastMouseWheelEventTime = Date.now(), "deltaMode" in t && t.deltaMode === 0 && t.wheelDelta && (e = t.deltaY === 0 ? 0 : Math.abs(t.wheelDelta) / t.deltaY), e = -0.3 < e && e < 0.3 ? e : (e > 0 ? 1 : -1) * Math.log(Math.abs(e) + 10) / i;
    var s = this.svg.getScreenCTM().inverse(), n = b.getEventPoint(t, this.svg).matrixTransform(
      s
    ), a = Math.pow(1 + this.options.zoomScaleSensitivity, -1 * e);
    this.zoomAtPoint(a, n);
  }
};
r.prototype.zoomAtPoint = function(t, e, o) {
  var i = this.viewport.getOriginalState();
  o ? (t = Math.max(
    this.options.minZoom * i.zoom,
    Math.min(this.options.maxZoom * i.zoom, t)
  ), t = t / this.getZoom()) : this.getZoom() * t < this.options.minZoom * i.zoom ? t = this.options.minZoom * i.zoom / this.getZoom() : this.getZoom() * t > this.options.maxZoom * i.zoom && (t = this.options.maxZoom * i.zoom / this.getZoom());
  var s = this.viewport.getCTM(), n = e.matrixTransform(s.inverse()), a = this.svg.createSVGMatrix().translate(n.x, n.y).scale(t).translate(-n.x, -n.y), c = s.multiply(a);
  c.a !== s.a && this.viewport.setCTM(c);
};
r.prototype.zoom = function(t, e) {
  this.zoomAtPoint(
    t,
    b.getSvgCenterPoint(this.svg, this.width, this.height),
    e
  );
};
r.prototype.publicZoom = function(t, e) {
  e && (t = this.computeFromRelativeZoom(t)), this.zoom(t, e);
};
r.prototype.publicZoomAtPoint = function(t, e, o) {
  if (o && (t = this.computeFromRelativeZoom(t)), v.getType(e) !== "SVGPoint")
    if ("x" in e && "y" in e)
      e = b.createSVGPoint(this.svg, e.x, e.y);
    else
      throw new Error("Given point is invalid");
  this.zoomAtPoint(t, e, o);
};
r.prototype.getZoom = function() {
  return this.viewport.getZoom();
};
r.prototype.getRelativeZoom = function() {
  return this.viewport.getRelativeZoom();
};
r.prototype.computeFromRelativeZoom = function(t) {
  return t * this.viewport.getOriginalState().zoom;
};
r.prototype.resetZoom = function() {
  var t = this.viewport.getOriginalState();
  this.zoom(t.zoom, !0);
};
r.prototype.resetPan = function() {
  this.pan(this.viewport.getOriginalState());
};
r.prototype.reset = function() {
  this.resetZoom(), this.resetPan();
};
r.prototype.handleDblClick = function(t) {
  if (this.options.preventMouseEventsDefault && (t.preventDefault ? t.preventDefault() : t.returnValue = !1), this.options.controlIconsEnabled) {
    var e = t.target.getAttribute("class") || "";
    if (e.indexOf("svg-pan-zoom-control") > -1)
      return !1;
  }
  var o;
  t.shiftKey ? o = 1 / ((1 + this.options.zoomScaleSensitivity) * 2) : o = (1 + this.options.zoomScaleSensitivity) * 2;
  var i = b.getEventPoint(t, this.svg).matrixTransform(
    this.svg.getScreenCTM().inverse()
  );
  this.zoomAtPoint(o, i);
};
r.prototype.handleMouseDown = function(t, e) {
  this.options.preventMouseEventsDefault && (t.preventDefault ? t.preventDefault() : t.returnValue = !1), v.mouseAndTouchNormalize(t, this.svg), this.options.dblClickZoomEnabled && v.isDblClick(t, e) ? this.handleDblClick(t) : (this.state = "pan", this.firstEventCTM = this.viewport.getCTM(), this.stateOrigin = b.getEventPoint(t, this.svg).matrixTransform(
    this.firstEventCTM.inverse()
  ));
};
r.prototype.handleMouseMove = function(t) {
  if (this.options.preventMouseEventsDefault && (t.preventDefault ? t.preventDefault() : t.returnValue = !1), this.state === "pan" && this.options.panEnabled) {
    var e = b.getEventPoint(t, this.svg).matrixTransform(
      this.firstEventCTM.inverse()
    ), o = this.firstEventCTM.translate(
      e.x - this.stateOrigin.x,
      e.y - this.stateOrigin.y
    );
    this.viewport.setCTM(o);
  }
};
r.prototype.handleMouseUp = function(t) {
  this.options.preventMouseEventsDefault && (t.preventDefault ? t.preventDefault() : t.returnValue = !1), this.state === "pan" && (this.state = "none");
};
r.prototype.fit = function() {
  var t = this.viewport.getViewBox(), e = Math.min(
    this.width / t.width,
    this.height / t.height
  );
  this.zoom(e, !0);
};
r.prototype.contain = function() {
  var t = this.viewport.getViewBox(), e = Math.max(
    this.width / t.width,
    this.height / t.height
  );
  this.zoom(e, !0);
};
r.prototype.center = function() {
  var t = this.viewport.getViewBox(), e = (this.width - (t.width + t.x * 2) * this.getZoom()) * 0.5, o = (this.height - (t.height + t.y * 2) * this.getZoom()) * 0.5;
  this.getPublicInstance().pan({ x: e, y: o });
};
r.prototype.updateBBox = function() {
  this.viewport.simpleViewBoxCache();
};
r.prototype.pan = function(t) {
  var e = this.viewport.getCTM();
  e.e = t.x, e.f = t.y, this.viewport.setCTM(e);
};
r.prototype.panBy = function(t) {
  var e = this.viewport.getCTM();
  e.e += t.x, e.f += t.y, this.viewport.setCTM(e);
};
r.prototype.getPan = function() {
  var t = this.viewport.getState();
  return { x: t.x, y: t.y };
};
r.prototype.resize = function() {
  var t = b.getBoundingClientRectNormalized(
    this.svg
  );
  this.width = t.width, this.height = t.height;
  var e = this.viewport;
  e.options.width = this.width, e.options.height = this.height, e.processCTM(), this.options.controlIconsEnabled && (this.getPublicInstance().disableControlIcons(), this.getPublicInstance().enableControlIcons());
};
r.prototype.destroy = function() {
  var t = this;
  this.beforeZoom = null, this.onZoom = null, this.beforePan = null, this.onPan = null, this.onUpdatedCTM = null, this.options.customEventsHandler != null && this.options.customEventsHandler.destroy({
    svgElement: this.svg,
    eventsListenerElement: this.options.eventsListenerElement,
    instance: this.getPublicInstance()
  });
  for (var e in this.eventListeners)
    (this.options.eventsListenerElement || this.svg).removeEventListener(
      e,
      this.eventListeners[e],
      this.options.preventMouseEventsDefault ? !1 : I
    );
  this.disableMouseWheelZoom(), this.getPublicInstance().disableControlIcons(), this.reset(), w = w.filter(function(o) {
    return o.svg !== t.svg;
  }), delete this.options, delete this.viewport, delete this.publicInstance, delete this.pi, this.getPublicInstance = function() {
    return null;
  };
};
r.prototype.getPublicInstance = function() {
  var t = this;
  return this.publicInstance || (this.publicInstance = this.pi = {
    // Pan
    enablePan: function() {
      return t.options.panEnabled = !0, t.pi;
    },
    disablePan: function() {
      return t.options.panEnabled = !1, t.pi;
    },
    isPanEnabled: function() {
      return !!t.options.panEnabled;
    },
    pan: function(e) {
      return t.pan(e), t.pi;
    },
    panBy: function(e) {
      return t.panBy(e), t.pi;
    },
    getPan: function() {
      return t.getPan();
    },
    // Pan event
    setBeforePan: function(e) {
      return t.options.beforePan = e === null ? null : v.proxy(e, t.publicInstance), t.pi;
    },
    setOnPan: function(e) {
      return t.options.onPan = e === null ? null : v.proxy(e, t.publicInstance), t.pi;
    },
    // Zoom and Control Icons
    enableZoom: function() {
      return t.options.zoomEnabled = !0, t.pi;
    },
    disableZoom: function() {
      return t.options.zoomEnabled = !1, t.pi;
    },
    isZoomEnabled: function() {
      return !!t.options.zoomEnabled;
    },
    enableControlIcons: function() {
      return t.options.controlIconsEnabled || (t.options.controlIconsEnabled = !0, E.enable(t)), t.pi;
    },
    disableControlIcons: function() {
      return t.options.controlIconsEnabled && (t.options.controlIconsEnabled = !1, E.disable(t)), t.pi;
    },
    isControlIconsEnabled: function() {
      return !!t.options.controlIconsEnabled;
    },
    // Double click zoom
    enableDblClickZoom: function() {
      return t.options.dblClickZoomEnabled = !0, t.pi;
    },
    disableDblClickZoom: function() {
      return t.options.dblClickZoomEnabled = !1, t.pi;
    },
    isDblClickZoomEnabled: function() {
      return !!t.options.dblClickZoomEnabled;
    },
    // Mouse wheel zoom
    enableMouseWheelZoom: function() {
      return t.enableMouseWheelZoom(), t.pi;
    },
    disableMouseWheelZoom: function() {
      return t.disableMouseWheelZoom(), t.pi;
    },
    isMouseWheelZoomEnabled: function() {
      return !!t.options.mouseWheelZoomEnabled;
    },
    // Zoom scale and bounds
    setZoomScaleSensitivity: function(e) {
      return t.options.zoomScaleSensitivity = e, t.pi;
    },
    setMinZoom: function(e) {
      return t.options.minZoom = e, t.pi;
    },
    setMaxZoom: function(e) {
      return t.options.maxZoom = e, t.pi;
    },
    // Zoom event
    setBeforeZoom: function(e) {
      return t.options.beforeZoom = e === null ? null : v.proxy(e, t.publicInstance), t.pi;
    },
    setOnZoom: function(e) {
      return t.options.onZoom = e === null ? null : v.proxy(e, t.publicInstance), t.pi;
    },
    // Zooming
    zoom: function(e) {
      return t.publicZoom(e, !0), t.pi;
    },
    zoomBy: function(e) {
      return t.publicZoom(e, !1), t.pi;
    },
    zoomAtPoint: function(e, o) {
      return t.publicZoomAtPoint(e, o, !0), t.pi;
    },
    zoomAtPointBy: function(e, o) {
      return t.publicZoomAtPoint(e, o, !1), t.pi;
    },
    zoomIn: function() {
      return this.zoomBy(1 + t.options.zoomScaleSensitivity), t.pi;
    },
    zoomOut: function() {
      return this.zoomBy(1 / (1 + t.options.zoomScaleSensitivity)), t.pi;
    },
    getZoom: function() {
      return t.getRelativeZoom();
    },
    // CTM update
    setOnUpdatedCTM: function(e) {
      return t.options.onUpdatedCTM = e === null ? null : v.proxy(e, t.publicInstance), t.pi;
    },
    // Reset
    resetZoom: function() {
      return t.resetZoom(), t.pi;
    },
    resetPan: function() {
      return t.resetPan(), t.pi;
    },
    reset: function() {
      return t.reset(), t.pi;
    },
    // Fit, Contain and Center
    fit: function() {
      return t.fit(), t.pi;
    },
    contain: function() {
      return t.contain(), t.pi;
    },
    center: function() {
      return t.center(), t.pi;
    },
    // Size and Resize
    updateBBox: function() {
      return t.updateBBox(), t.pi;
    },
    resize: function() {
      return t.resize(), t.pi;
    },
    getSizes: function() {
      return {
        width: t.width,
        height: t.height,
        realZoom: t.getZoom(),
        viewBox: t.viewport.getViewBox()
      };
    },
    // Destroy
    destroy: function() {
      return t.destroy(), t.pi;
    }
  }), this.publicInstance;
};
var w = [], R = function(t, e) {
  var o = v.getSvg(t);
  if (o === null)
    return null;
  for (var i = w.length - 1; i >= 0; i--)
    if (w[i].svg === o)
      return w[i].instance.getPublicInstance();
  return w.push({
    svg: o,
    instance: new r(o, e)
  }), w[w.length - 1].instance.getPublicInstance();
}, U = R;
const G = /* @__PURE__ */ T(U), _ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: G
}, Symbol.toStringTag, { value: "Module" }));
export {
  _ as s
};
