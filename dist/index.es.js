import q, { createContext as ge, useRef as K, useContext as me, useMemo as ce } from "react";
import * as D from "three";
import { useFrame as ue } from "@react-three/fiber";
import { Html as he, OrbitControls as ye } from "@react-three/drei";
var U = { exports: {} }, Y = {};
var te;
function xe() {
  if (te) return Y;
  te = 1;
  var r = /* @__PURE__ */ Symbol.for("react.transitional.element"), l = /* @__PURE__ */ Symbol.for("react.fragment");
  function t(o, e, s) {
    var i = null;
    if (s !== void 0 && (i = "" + s), e.key !== void 0 && (i = "" + e.key), "key" in e) {
      s = {};
      for (var c in e)
        c !== "key" && (s[c] = e[c]);
    } else s = e;
    return e = s.ref, {
      $$typeof: r,
      type: o,
      key: i,
      ref: e !== void 0 ? e : null,
      props: s
    };
  }
  return Y.Fragment = l, Y.jsx = t, Y.jsxs = t, Y;
}
var L = {};
var ne;
function ve() {
  return ne || (ne = 1, process.env.NODE_ENV !== "production" && (function() {
    function r(n) {
      if (n == null) return null;
      if (typeof n == "function")
        return n.$$typeof === J ? null : n.displayName || n.name || null;
      if (typeof n == "string") return n;
      switch (n) {
        case h:
          return "Fragment";
        case S:
          return "Profiler";
        case R:
          return "StrictMode";
        case N:
          return "Suspense";
        case V:
          return "SuspenseList";
        case F:
          return "Activity";
      }
      if (typeof n == "object")
        switch (typeof n.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), n.$$typeof) {
          case b:
            return "Portal";
          case I:
            return n.displayName || "Context";
          case E:
            return (n._context.displayName || "Context") + ".Consumer";
          case v:
            var d = n.render;
            return n = n.displayName, n || (n = d.displayName || d.name || "", n = n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef"), n;
          case G:
            return d = n.displayName || null, d !== null ? d : r(n.type) || "Memo";
          case O:
            d = n._payload, n = n._init;
            try {
              return r(n(d));
            } catch {
            }
        }
      return null;
    }
    function l(n) {
      return "" + n;
    }
    function t(n) {
      try {
        l(n);
        var d = !1;
      } catch {
        d = !0;
      }
      if (d) {
        d = console;
        var w = d.error, T = typeof Symbol == "function" && Symbol.toStringTag && n[Symbol.toStringTag] || n.constructor.name || "Object";
        return w.call(
          d,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          T
        ), l(n);
      }
    }
    function o(n) {
      if (n === h) return "<>";
      if (typeof n == "object" && n !== null && n.$$typeof === O)
        return "<...>";
      try {
        var d = r(n);
        return d ? "<" + d + ">" : "<...>";
      } catch {
        return "<...>";
      }
    }
    function e() {
      var n = W.A;
      return n === null ? null : n.getOwner();
    }
    function s() {
      return Error("react-stack-top-frame");
    }
    function i(n) {
      if (A.call(n, "key")) {
        var d = Object.getOwnPropertyDescriptor(n, "key").get;
        if (d && d.isReactWarning) return !1;
      }
      return n.key !== void 0;
    }
    function c(n, d) {
      function w() {
        j || (j = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          d
        ));
      }
      w.isReactWarning = !0, Object.defineProperty(n, "key", {
        get: w,
        configurable: !0
      });
    }
    function f() {
      var n = r(this.type);
      return _[n] || (_[n] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), n = this.props.ref, n !== void 0 ? n : null;
    }
    function p(n, d, w, T, z, X) {
      var k = w.ref;
      return n = {
        $$typeof: m,
        type: n,
        key: d,
        props: w,
        _owner: T
      }, (k !== void 0 ? k : null) !== null ? Object.defineProperty(n, "ref", {
        enumerable: !1,
        get: f
      }) : Object.defineProperty(n, "ref", { enumerable: !1, value: null }), n._store = {}, Object.defineProperty(n._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: 0
      }), Object.defineProperty(n, "_debugInfo", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: null
      }), Object.defineProperty(n, "_debugStack", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: z
      }), Object.defineProperty(n, "_debugTask", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: X
      }), Object.freeze && (Object.freeze(n.props), Object.freeze(n)), n;
    }
    function x(n, d, w, T, z, X) {
      var k = d.children;
      if (k !== void 0)
        if (T)
          if (M(k)) {
            for (T = 0; T < k.length; T++)
              u(k[T]);
            Object.freeze && Object.freeze(k);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else u(k);
      if (A.call(d, "key")) {
        k = r(n);
        var B = Object.keys(d).filter(function(de) {
          return de !== "key";
        });
        T = 0 < B.length ? "{key: someKey, " + B.join(": ..., ") + ": ...}" : "{key: someKey}", ee[k + T] || (B = 0 < B.length ? "{" + B.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          T,
          k,
          B,
          k
        ), ee[k + T] = !0);
      }
      if (k = null, w !== void 0 && (t(w), k = "" + w), i(d) && (t(d.key), k = "" + d.key), "key" in d) {
        w = {};
        for (var Z in d)
          Z !== "key" && (w[Z] = d[Z]);
      } else w = d;
      return k && c(
        w,
        typeof n == "function" ? n.displayName || n.name || "Unknown" : n
      ), p(
        n,
        k,
        w,
        e(),
        z,
        X
      );
    }
    function u(n) {
      g(n) ? n._store && (n._store.validated = 1) : typeof n == "object" && n !== null && n.$$typeof === O && (n._payload.status === "fulfilled" ? g(n._payload.value) && n._payload.value._store && (n._payload.value._store.validated = 1) : n._store && (n._store.validated = 1));
    }
    function g(n) {
      return typeof n == "object" && n !== null && n.$$typeof === m;
    }
    var y = q, m = /* @__PURE__ */ Symbol.for("react.transitional.element"), b = /* @__PURE__ */ Symbol.for("react.portal"), h = /* @__PURE__ */ Symbol.for("react.fragment"), R = /* @__PURE__ */ Symbol.for("react.strict_mode"), S = /* @__PURE__ */ Symbol.for("react.profiler"), E = /* @__PURE__ */ Symbol.for("react.consumer"), I = /* @__PURE__ */ Symbol.for("react.context"), v = /* @__PURE__ */ Symbol.for("react.forward_ref"), N = /* @__PURE__ */ Symbol.for("react.suspense"), V = /* @__PURE__ */ Symbol.for("react.suspense_list"), G = /* @__PURE__ */ Symbol.for("react.memo"), O = /* @__PURE__ */ Symbol.for("react.lazy"), F = /* @__PURE__ */ Symbol.for("react.activity"), J = /* @__PURE__ */ Symbol.for("react.client.reference"), W = y.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, A = Object.prototype.hasOwnProperty, M = Array.isArray, H = console.createTask ? console.createTask : function() {
      return null;
    };
    y = {
      react_stack_bottom_frame: function(n) {
        return n();
      }
    };
    var j, _ = {}, $ = y.react_stack_bottom_frame.bind(
      y,
      s
    )(), Q = H(o(s)), ee = {};
    L.Fragment = h, L.jsx = function(n, d, w) {
      var T = 1e4 > W.recentlyCreatedOwnerStacks++;
      return x(
        n,
        d,
        w,
        !1,
        T ? Error("react-stack-top-frame") : $,
        T ? H(o(n)) : Q
      );
    }, L.jsxs = function(n, d, w) {
      var T = 1e4 > W.recentlyCreatedOwnerStacks++;
      return x(
        n,
        d,
        w,
        !0,
        T ? Error("react-stack-top-frame") : $,
        T ? H(o(n)) : Q
      );
    };
  })()), L;
}
var oe;
function be() {
  return oe || (oe = 1, process.env.NODE_ENV === "production" ? U.exports = xe() : U.exports = ve()), U.exports;
}
var a = be();
const re = (r) => {
  let l;
  const t = /* @__PURE__ */ new Set(), o = (p, x) => {
    const u = typeof p == "function" ? p(l) : p;
    if (!Object.is(u, l)) {
      const g = l;
      l = x ?? (typeof u != "object" || u === null) ? u : Object.assign({}, l, u), t.forEach((y) => y(l, g));
    }
  }, e = () => l, c = { setState: o, getState: e, getInitialState: () => f, subscribe: (p) => (t.add(p), () => t.delete(p)) }, f = l = r(o, e, c);
  return c;
}, we = ((r) => r ? re(r) : re), Pe = (r) => r;
function pe(r, l = Pe) {
  const t = q.useSyncExternalStore(
    r.subscribe,
    q.useCallback(() => l(r.getState()), [r, l]),
    q.useCallback(() => l(r.getInitialState()), [r, l])
  );
  return q.useDebugValue(t), t;
}
const ie = (r) => {
  const l = we(r), t = (o) => pe(l, o);
  return Object.assign(t, l), t;
}, Ce = ((r) => r ? ie(r) : ie), P = (r, l, t, o, e = (s) => s) => {
  const s = performance.now(), i = (c) => {
    const f = c - s, p = Math.min(f / t, 1), x = e(p), u = r + (l - r) * x;
    o(u), p < 1 && requestAnimationFrame(i);
  };
  requestAnimationFrame(i);
}, C = (r) => r < 0.5 ? 4 * r * r * r : 1 - Math.pow(-2 * r + 2, 3) / 2, se = {
  // Core settings
  pageCount: 30,
  // More pages for better visual
  currentPage: 15,
  // Open in the middle
  dimensions: {
    height: 4,
    width: 3,
    depth: 0.6
    // Will be calculated from pageCount
  },
  // Transformations
  spineRotation: 0.5,
  tilt: 0.2,
  scale: 1,
  position: [0, 0, 0],
  // Cover hinges
  frontHinge: 0,
  backHinge: 0,
  // Appearance
  pageOpacity: 0.15,
  pageColor: "#00ffcc",
  glowIntensity: 0,
  coverColor: "#2b1e16",
  coverOpacity: 1,
  spineColor: "#1a0f0a",
  // Cover text
  frontCoverText: "",
  backCoverText: "",
  coverTextColor: "#c9a876",
  coverOutlineColor: "#c9a876",
  coverOutlineWidth: 3,
  fontFamily: "Roboto",
  // Features
  particlesEnabled: !0,
  particleIntensity: 0.5,
  confidenceScore: 0,
  // Debug
  debug: !1,
  testPageFlipAngle: 0,
  // 0 = back cover, 180 = front cover
  // Page flip animation
  flippingPageIndex: null,
  flipProgress: 0,
  flipDirection: null,
  isFlippingContinuously: !1,
  continuousDirection: null
}, Te = (r) => {
  const l = { ...se, ...r };
  return Ce((t, o) => ({
    ...l,
    // Actions
    setPageCount: (e) => {
      const s = Math.max(10, Math.min(100, e)), i = Math.floor(s / 2);
      t({
        pageCount: s,
        currentPage: i,
        dimensions: {
          ...o().dimensions,
          depth: 0.6
        }
      });
    },
    setCurrentPage: (e) => {
      const { pageCount: s } = o(), i = (e % s + s) % s;
      t({ currentPage: i });
    },
    flipPage: (e) => {
      const s = o(), { currentPage: i, pageCount: c, flippingPageIndex: f, isFlippingContinuously: p } = s;
      if (f !== null) {
        console.log("⚠️ Flip already in progress");
        return;
      }
      if (e === "forward") {
        const x = Math.min(i + 1, c - 1);
        if (x === i) {
          console.log("⚠️ Already at last page");
          return;
        }
        console.log("📄 Start flip forward:", i, "→", x), t({ flippingPageIndex: i, flipProgress: 0, flipDirection: "forward" });
        const u = 500, g = performance.now(), y = (m) => {
          const b = m - g, h = Math.min(b / u, 1);
          t({ flipProgress: h }), console.log(`  Progress: ${(h * 100).toFixed(1)}%`), h < 1 ? requestAnimationFrame(y) : (t({ flippingPageIndex: null, flipProgress: 0, flipDirection: null }), console.log("✅ Flip animation complete (currentPage unchanged)"), o().isFlippingContinuously && o().continuousDirection === "forward" && setTimeout(() => {
            o().isFlippingContinuously && o().continuousDirection === "forward" && o().flipPage("forward");
          }, 100));
        };
        requestAnimationFrame(y);
      } else {
        const x = Math.max(i - 1, 0);
        if (x === i) {
          console.log("⚠️ Already at first page");
          return;
        }
        console.log("📄 Start flip BACKWARD:", i, "→", x), console.log("   Flipping page", i, "from FRONT to BACK"), t({ flippingPageIndex: i, flipProgress: 0, flipDirection: "backward" });
        const u = 500, g = performance.now(), y = (m) => {
          const b = m - g, h = Math.min(b / u, 1);
          t({ flipProgress: h }), console.log(`  Progress: ${(h * 100).toFixed(1)}% (BACKWARD)`), h < 1 ? requestAnimationFrame(y) : (t({ flippingPageIndex: null, flipProgress: 0, flipDirection: null }), console.log("✅ Flip animation complete (currentPage unchanged)"), o().isFlippingContinuously && o().continuousDirection === "backward" && setTimeout(() => {
            o().isFlippingContinuously && o().continuousDirection === "backward" && o().flipPage("backward");
          }, 100));
        };
        requestAnimationFrame(y);
      }
    },
    toggleContinuousFlip: (e) => {
      const s = o(), { isFlippingContinuously: i, continuousDirection: c } = s;
      i && c === e ? (console.log("⏸️ Stop continuous flip"), t({ isFlippingContinuously: !1, continuousDirection: null })) : (console.log("▶️ Start continuous flip", e), t({ isFlippingContinuously: !0, continuousDirection: e }), o().flipPage(e));
    },
    setDimensions: (e) => {
      const s = o().dimensions, i = { ...s, ...e };
      if (e.depth !== void 0 && e.depth !== s.depth) {
        const c = Math.round(e.depth / 2e-3), f = Math.max(10, Math.min(100, c));
        t({
          dimensions: i,
          pageCount: f,
          currentPage: Math.floor(f / 2)
        });
      } else
        t({ dimensions: i });
    },
    setSpineRotation: (e) => t({ spineRotation: e }),
    setTilt: (e) => t({ tilt: e }),
    setScale: (e) => t({ scale: e }),
    setPosition: (e) => t({ position: e }),
    setFrontHinge: (e) => t({ frontHinge: e }),
    setBackHinge: (e) => t({ backHinge: e }),
    setBothHinges: (e) => t({ frontHinge: e, backHinge: e }),
    setPageOpacity: (e) => t({ pageOpacity: e }),
    setPageColor: (e) => t({ pageColor: e }),
    setGlowIntensity: (e) => t({ glowIntensity: e }),
    setCoverColor: (e) => t({ coverColor: e }),
    setCoverOpacity: (e) => t({ coverOpacity: e }),
    setSpineColor: (e) => t({ spineColor: e }),
    setFrontCoverText: (e) => t({ frontCoverText: e }),
    setBackCoverText: (e) => t({ backCoverText: e }),
    setCoverTextColor: (e) => t({ coverTextColor: e }),
    setCoverOutlineColor: (e) => t({ coverOutlineColor: e }),
    setCoverOutlineWidth: (e) => t({ coverOutlineWidth: e }),
    setFontFamily: (e) => t({ fontFamily: e }),
    setParticlesEnabled: (e) => t({ particlesEnabled: e }),
    setParticleIntensity: (e) => t({ particleIntensity: e }),
    setConfidenceScore: (e) => t({ confidenceScore: e }),
    setDebug: (e) => t({ debug: e }),
    setTestPageFlipAngle: (e) => {
      t({ testPageFlipAngle: e }), console.log("📄 Test page flip angle:", e.toFixed(1), "°");
    },
    reset: () => t(se),
    // ========== ANIMATED ACTIONS ==========
    /**
     * Open book - smoothly animate both covers to open position
     */
    openBook: (e = 1e3) => {
      const s = o(), i = Math.PI * 0.4;
      P(
        s.frontHinge,
        i,
        e,
        (c) => t({ frontHinge: c }),
        C
      ), P(
        s.backHinge,
        i,
        e,
        (c) => t({ backHinge: c }),
        C
      ), P(
        s.particleIntensity,
        0.7,
        e,
        (c) => t({ particleIntensity: c }),
        C
      );
    },
    /**
     * Close book - smoothly animate both covers to closed position
     */
    closeBook: (e = 1e3) => {
      const s = o();
      P(
        s.frontHinge,
        0,
        e,
        (i) => t({ frontHinge: i }),
        C
      ), P(
        s.backHinge,
        0,
        e,
        (i) => t({ backHinge: i }),
        C
      ), P(
        s.particleIntensity,
        0,
        e,
        (i) => t({ particleIntensity: i }),
        C
      ), P(
        s.glowIntensity,
        0,
        e,
        (i) => t({ glowIntensity: i }),
        C
      );
    },
    /**
     * Flip multiple pages with animation (visual flip for each)
     */
    flipPages: (e, s, i = 200) => {
      const c = o(), { flippingPageIndex: f } = c;
      if (f !== null) {
        console.log("⚠️ Flip already in progress");
        return;
      }
      let p = 0;
      const x = () => {
        if (p >= e) {
          console.log("✅ Finished flipping", e, "pages", s);
          return;
        }
        const u = o(), { currentPage: g, pageCount: y } = u;
        let m;
        if (s === "forward" ? m = Math.min(g + 1, y - 1) : m = Math.max(g - 1, 0), m === g) {
          console.log("⚠️ Reached boundary at page", g);
          return;
        }
        console.log(`📄 Flip ${p + 1}/${e}: page ${g} → ${m}`), t({ flippingPageIndex: g, flipProgress: 0 });
        const h = 500, R = performance.now(), S = (E) => {
          const I = E - R, v = Math.min(I / h, 1);
          t({ flipProgress: v }), v < 1 ? requestAnimationFrame(S) : (t({ flippingPageIndex: null, flipProgress: 0, flipDirection: null }), p++, p < e ? setTimeout(x, 50) : console.log("✅ All", e, "page animations complete (currentPage unchanged)"));
        };
        requestAnimationFrame(S);
      };
      console.log("▶️ Starting", e, "page flips", s, "from page", o().currentPage), x();
    },
    /**
     * Trigger emotional states (from README concept)
     */
    triggerEmotion: (e) => {
      const s = o();
      switch (e) {
        case "focus":
          let i = 0;
          const c = 5, f = 1200, p = () => {
            if (i >= c) {
              P(o().glowIntensity, 1.2, f / 2, (v) => t({ glowIntensity: v }), C);
              return;
            }
            P(o().glowIntensity, 1.8, f / 2, (v) => t({ glowIntensity: v }), C), setTimeout(() => {
              P(o().glowIntensity, 0.8, f / 2, (v) => t({ glowIntensity: v }), C), i++, setTimeout(p, f / 2);
            }, f / 2);
          };
          p(), P(s.particleIntensity, 1, 800, (v) => t({ particleIntensity: v }), C);
          break;
        case "drift":
          let x = 0;
          const u = 5, g = 1200, y = () => {
            if (x >= u) {
              P(o().glowIntensity, 0.1, g / 2, (v) => t({ glowIntensity: v }), C);
              return;
            }
            P(o().glowIntensity, 0.4, g / 2, (v) => t({ glowIntensity: v }), C), setTimeout(() => {
              P(o().glowIntensity, 0.1, g / 2, (v) => t({ glowIntensity: v }), C), x++, setTimeout(y, g / 2);
            }, g / 2);
          };
          y(), P(s.particleIntensity, 0.1, 1200, (v) => t({ particleIntensity: v }), C);
          break;
        case "paradox":
          const m = s.spineRotation, b = s.tilt, h = 0.15, R = 10, S = 50;
          let E = 0;
          const I = () => {
            if (E >= R) {
              t({ spineRotation: m, tilt: b });
              return;
            }
            const v = m + (Math.random() - 0.5) * h, N = b + (Math.random() - 0.5) * h;
            t({ spineRotation: v, tilt: N }), E++, setTimeout(I, S);
          };
          I(), P(s.glowIntensity, 2, 200, (v) => t({ glowIntensity: v })), setTimeout(() => {
            P(2, 0.3, 300, (v) => t({ glowIntensity: v }));
          }, 200);
          break;
      }
    },
    /**
     * Morph cover material appearance (from README concept)
     */
    morphMaterial: (e) => {
      const s = o();
      switch (e) {
        case "leather":
          t({ coverColor: "#2b1e16", coverOpacity: 1 }), P(s.glowIntensity, 0.1, 500, (i) => t({ glowIntensity: i }), C);
          break;
        case "metal":
          t({ coverColor: "#556b7d", coverOpacity: 1 }), P(s.glowIntensity, 0.8, 500, (i) => t({ glowIntensity: i }), C), P(s.particleIntensity, 0.9, 500, (i) => t({ particleIntensity: i }), C);
          break;
        case "glass":
          t({ coverColor: "#d0e8f2", coverOpacity: 0.3 }), P(s.glowIntensity, 1.8, 500, (i) => t({ glowIntensity: i }), C), P(s.particleIntensity, 1, 500, (i) => t({ particleIntensity: i }), C);
          break;
      }
    }
  }));
}, fe = ge(null);
function Ae({ children: r, ...l }) {
  const t = K();
  return t.current || (t.current = Te(l)), /* @__PURE__ */ a.jsx(fe.Provider, { value: t.current, children: r });
}
function ke(r) {
  const l = me(fe);
  if (!l)
    throw new Error("useBookStore must be used within a BookProvider");
  return pe(l, r);
}
function ae({
  index: r,
  totalPages: l,
  currentPage: t,
  opacity: o = 0.15,
  color: e = "#00ffcc",
  glow: s = 0,
  coverWidth: i,
  coverHeight: c
}) {
  const f = i * 0.93, p = c * 0.95, x = 0.6, u = r < t, y = x / 2 - 0.05 / 2;
  let m;
  return u && t > 0 ? m = r / (t - 1 || 1) * y : m = -((r - t) / (l - t - 1 || 1)) * y, /* @__PURE__ */ a.jsx("group", { position: [0, 0, m], children: /* @__PURE__ */ a.jsxs("mesh", { position: [f / 2, 0, 0], children: [
    /* @__PURE__ */ a.jsx("planeGeometry", { args: [f, p] }),
    /* @__PURE__ */ a.jsx(
      "meshStandardMaterial",
      {
        color: e,
        transparent: !0,
        opacity: o,
        side: D.DoubleSide,
        emissive: e,
        emissiveIntensity: s,
        depthWrite: !1
      }
    )
  ] }) });
}
function Re(r, l = "#c9a876", t = "#c9a876", o = 3, e = !0, s = "Roboto") {
  return ce(() => {
    if (typeof document > "u" || !r) return null;
    const i = document.createElement("canvas");
    i.width = 512, i.height = 512;
    const c = i.getContext("2d");
    if (!c) return null;
    c.clearRect(0, 0, 512, 512), c.fillStyle = l, c.textAlign = "center", c.textBaseline = "middle";
    const f = r.split(`
`), p = Math.min(48, Math.floor(400 / f.length));
    c.font = `bold ${p}px ${s}, sans-serif`;
    const x = 256 - (f.length - 1) * (p + 10) / 2;
    f.forEach((g, y) => {
      const m = x + y * (p + 10), b = g.split(" "), h = 450;
      let R = "", S = m;
      b.forEach((E, I) => {
        const v = R + (R ? " " : "") + E;
        c.measureText(v).width > h && R ? (c.fillText(R, 256, S), R = E, S += p + 5) : R = v, I === b.length - 1 && c.fillText(R, 256, S);
      });
    });
    const u = new D.CanvasTexture(i);
    return u.needsUpdate = !0, u;
  }, [r, l, t, o, e, s]);
}
function le({
  side: r,
  width: l,
  height: t,
  hinge: o,
  text: e,
  textColor: s = "#c9a876",
  outlineColor: i = "#c9a876",
  outlineWidth: c = 3,
  color: f = "#2b1e16",
  opacity: p = 1,
  fontFamily: x = "Roboto"
}) {
  const u = Re(e, s, i, c, r === "front", x), g = 0.1, y = 0.6, m = 0.05, b = g / 2, h = r === "front" ? y / 2 : -y / 2, R = r === "front" ? -o : o;
  return /* @__PURE__ */ a.jsxs(
    "group",
    {
      position: [b, 0, h],
      rotation: [0, R, 0],
      children: [
        /* @__PURE__ */ a.jsxs(
          "mesh",
          {
            position: [l / 2, 0, 0],
            castShadow: !0,
            receiveShadow: !0,
            children: [
              /* @__PURE__ */ a.jsx("boxGeometry", { args: [l, t, m] }),
              /* @__PURE__ */ a.jsx(
                "meshStandardMaterial",
                {
                  color: f,
                  transparent: p < 1,
                  opacity: p,
                  side: D.DoubleSide
                }
              )
            ]
          }
        ),
        u && /* @__PURE__ */ a.jsxs(
          "mesh",
          {
            position: [
              l / 2,
              0,
              r === "front" ? m / 2 + 0.01 : -0.035
              // Back: offset in -Z (away from pages)
            ],
            rotation: [
              0,
              r === "back" ? Math.PI : 0,
              // Back cover: flip 180° around Y axis
              0
            ],
            children: [
              /* @__PURE__ */ a.jsx("planeGeometry", { args: [l * 0.9, t * 0.9] }),
              /* @__PURE__ */ a.jsx(
                "meshStandardMaterial",
                {
                  map: u,
                  transparent: !0,
                  opacity: 1,
                  side: D.DoubleSide,
                  depthWrite: !1,
                  alphaTest: 0.1
                }
              )
            ]
          }
        )
      ]
    }
  );
}
function je({
  width: r = 0.1,
  height: l = 4,
  depth: t = 0.6,
  color: o = "#666666",
  pageCount: e = 30
}) {
  return /* @__PURE__ */ a.jsxs("mesh", { position: [0, 0, 0], children: [
    /* @__PURE__ */ a.jsx("boxGeometry", { args: [r, l, t] }),
    /* @__PURE__ */ a.jsx("meshStandardMaterial", { color: o })
  ] });
}
function Se({
  count: r = 200,
  intensity: l,
  enabled: t,
  bookDimensions: o
}) {
  const e = K(null), { positions: s, velocities: i } = ce(() => {
    const f = new Float32Array(r * 3), p = new Float32Array(r * 3), { height: x, width: u, depth: g } = o;
    for (let y = 0; y < r; y++) {
      const m = y * 3;
      f[m] = (Math.random() - 0.5) * u * 0.5, f[m + 1] = (Math.random() - 0.5) * x, f[m + 2] = (Math.random() - 0.5) * g, p[m] = 0.01 + Math.random() * 0.02, p[m + 1] = Math.random() * 0.01, p[m + 2] = (Math.random() - 0.5) * 5e-3;
    }
    return { positions: f, velocities: p };
  }, [r, o]);
  if (ue((f, p) => {
    if (!e.current || !t) return;
    const u = e.current.geometry.attributes.position, { height: g, width: y, depth: m } = o;
    for (let b = 0; b < r; b++) {
      const h = b * 3;
      u.array[h] += i[h] * l, u.array[h + 1] += i[h + 1] * l, u.array[h + 2] += i[h + 2] * l, u.array[h] > y * 2 && (u.array[h] = (Math.random() - 0.5) * y * 0.5, u.array[h + 1] = (Math.random() - 0.5) * g, u.array[h + 2] = (Math.random() - 0.5) * m), Math.abs(u.array[h + 1]) > g * 1.5 && (u.array[h + 1] = (Math.random() - 0.5) * g), Math.abs(u.array[h + 2]) > m * 1.5 && (u.array[h + 2] = (Math.random() - 0.5) * m);
    }
    u.needsUpdate = !0;
  }), !t) return null;
  const c = Math.max(0.05, l);
  return /* @__PURE__ */ a.jsxs("points", { ref: e, children: [
    /* @__PURE__ */ a.jsx("bufferGeometry", { children: /* @__PURE__ */ a.jsx(
      "bufferAttribute",
      {
        attach: "attributes-position",
        count: r,
        array: s,
        itemSize: 3
      }
    ) }),
    /* @__PURE__ */ a.jsx(
      "pointsMaterial",
      {
        size: 0.05 * c,
        color: "#00ffcc",
        transparent: !0,
        opacity: c,
        sizeAttenuation: !0,
        blending: D.AdditiveBlending
      }
    )
  ] });
}
function Oe() {
  const r = K(null), {
    pageCount: l,
    currentPage: t,
    dimensions: o,
    spineRotation: e,
    tilt: s,
    scale: i,
    position: c,
    frontHinge: f,
    backHinge: p,
    pageOpacity: x,
    pageColor: u,
    glowIntensity: g,
    coverColor: y,
    coverOpacity: m,
    spineColor: b,
    frontCoverText: h,
    backCoverText: R,
    coverTextColor: S,
    coverOutlineColor: E,
    coverOutlineWidth: I,
    particlesEnabled: v,
    particleIntensity: N,
    debug: V,
    testPageFlipAngle: G,
    flippingPageIndex: O,
    flipProgress: F,
    flipDirection: J,
    fontFamily: W
  } = ke((j) => j), A = 0.1, M = 0.6, H = 0.05;
  return ue(() => {
    if (r.current) {
      r.current.rotation.y = e, r.current.rotation.z = s, r.current.scale.setScalar(i);
      const j = c || [0, 0, 0];
      r.current.position.set(j[0], j[1], j[2]);
    }
  }), /* @__PURE__ */ a.jsxs("group", { ref: r, children: [
    V && /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
      /* @__PURE__ */ a.jsx("axesHelper", { args: [2] }),
      /* @__PURE__ */ a.jsx("gridHelper", { args: [10, 10] }),
      /* @__PURE__ */ a.jsx(he, { position: [0, o.height / 2 + 0.5, 0], children: /* @__PURE__ */ a.jsxs("div", { style: {
        background: "rgba(0,0,0,0.8)",
        color: "#00ffcc",
        padding: "10px",
        fontFamily: "monospace",
        fontSize: "10px",
        borderRadius: "4px",
        whiteSpace: "nowrap"
      }, children: [
        /* @__PURE__ */ a.jsxs("div", { children: [
          "Total Pages: ",
          l
        ] }),
        /* @__PURE__ */ a.jsxs("div", { children: [
          "Current Page: ",
          t
        ] }),
        /* @__PURE__ */ a.jsxs("div", { children: [
          "Spine: ",
          A,
          " × ",
          M
        ] }),
        /* @__PURE__ */ a.jsxs("div", { children: [
          "Back Pages: ",
          t
        ] }),
        /* @__PURE__ */ a.jsxs("div", { children: [
          "Front Pages: ",
          l - t
        ] }),
        /* @__PURE__ */ a.jsxs("div", { children: [
          "Cover Width: ",
          o.width.toFixed(2)
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ a.jsx(
      je,
      {
        width: A,
        height: o.height,
        depth: M,
        color: b,
        pageCount: l
      }
    ),
    /* @__PURE__ */ a.jsx(
      le,
      {
        side: "front",
        width: o.width,
        height: o.height,
        hinge: f,
        text: h,
        textColor: S,
        outlineColor: E,
        outlineWidth: I,
        color: y,
        opacity: m,
        fontFamily: W
      }
    ),
    /* @__PURE__ */ a.jsx(
      le,
      {
        side: "back",
        width: o.width,
        height: o.height,
        hinge: p,
        text: R,
        textColor: S,
        outlineColor: E,
        outlineWidth: I,
        color: y,
        opacity: m,
        fontFamily: W
      }
    ),
    /* @__PURE__ */ a.jsx(
      "group",
      {
        position: [A / 2, 0, -M / 2],
        rotation: [0, p, 0],
        children: /* @__PURE__ */ a.jsx("group", { position: [0, 0, H / 2], children: Array.from({ length: t }, (j, _) => _ === O && F > 0 ? null : /* @__PURE__ */ a.jsx(
          ae,
          {
            index: _,
            totalPages: l,
            currentPage: t,
            opacity: x,
            color: u,
            glow: g,
            coverWidth: o.width,
            coverHeight: o.height
          },
          `back-${_}`
        )) })
      }
    ),
    /* @__PURE__ */ a.jsx(
      "group",
      {
        position: [A / 2, 0, M / 2],
        rotation: [0, -f, 0],
        children: /* @__PURE__ */ a.jsx("group", { position: [0, 0, -H / 2], children: Array.from({ length: l - t }, (j, _) => {
          const $ = _ + t;
          return $ === O && F > 0 ? null : /* @__PURE__ */ a.jsx(
            ae,
            {
              index: $,
              totalPages: l,
              currentPage: t,
              opacity: x,
              color: u,
              glow: g,
              coverWidth: o.width,
              coverHeight: o.height
            },
            `front-${$}`
          );
        }) })
      }
    ),
    O !== null && F > 0 && (() => {
      const j = J === "forward" ? -f + F * (p - -f) : p + F * (-f - p);
      return /* @__PURE__ */ a.jsx(
        "group",
        {
          position: [A / 2, 0, 0],
          rotation: [0, j, 0],
          children: /* @__PURE__ */ a.jsxs("mesh", { position: [o.width * 0.93 / 2, 0, 0], children: [
            /* @__PURE__ */ a.jsx("planeGeometry", { args: [o.width * 0.93, o.height * 0.95] }),
            /* @__PURE__ */ a.jsx(
              "meshStandardMaterial",
              {
                color: u,
                transparent: !0,
                opacity: x,
                side: D.DoubleSide,
                emissive: u,
                emissiveIntensity: g,
                depthWrite: !1
              }
            )
          ] })
        }
      );
    })(),
    /* @__PURE__ */ a.jsx(
      Se,
      {
        count: 200,
        intensity: N,
        enabled: v,
        bookDimensions: {
          ...o,
          depth: M
        }
      }
    ),
    G > 0 && (() => {
      const j = G / 180, _ = p + j * (-f - p);
      return /* @__PURE__ */ a.jsx(
        "group",
        {
          position: [A / 2, 0, 0],
          rotation: [0, _, 0],
          children: /* @__PURE__ */ a.jsxs("mesh", { position: [o.width / 2, 0, 0], children: [
            /* @__PURE__ */ a.jsx("planeGeometry", { args: [o.width, o.height] }),
            /* @__PURE__ */ a.jsx(
              "meshStandardMaterial",
              {
                color: "#ff0000",
                transparent: !0,
                opacity: 0.8,
                side: D.DoubleSide,
                emissive: "#ff0000",
                emissiveIntensity: 0.5
              }
            )
          ] })
        }
      );
    })()
  ] });
}
function Fe({ children: r }) {
  return /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
    /* @__PURE__ */ a.jsx("ambientLight", { intensity: 0.8 }),
    /* @__PURE__ */ a.jsx(
      "pointLight",
      {
        position: [5, 5, 5],
        intensity: 1,
        distance: 50,
        color: "#00ffcc"
      }
    ),
    /* @__PURE__ */ a.jsx(
      ye,
      {
        makeDefault: !0,
        enableDamping: !0,
        dampingFactor: 0.05
      }
    ),
    r
  ] });
}
export {
  Oe as Book,
  Ae as BookProvider,
  le as Cover,
  ae as Page,
  Se as Particles,
  Fe as Scene,
  je as Spine,
  ke as useBookStore,
  Re as useCoverTexture
};
//# sourceMappingURL=index.es.js.map
