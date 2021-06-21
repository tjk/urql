import { Client as e, createRequest as u } from "@urql/core";

export * from "@urql/core";

import { provide as n, getCurrentInstance as r, inject as t, reactive as a, ref as o, isRef as i, watchEffect as l, onBeforeUnmount as s, onMounted as v } from "vue";

import { makeSubject as c, concat as f, filter as p, map as d, fromValue as y, share as h, onPush as x, onEnd as b, onStart as S, publish as m, switchAll as Q, toPromise as q, take as w } from "wonka";

function _extends() {
  return (_extends = Object.assign || function(e) {
    for (var u = 1; u < arguments.length; u++) {
      var n = arguments[u];
      for (var r in n) {
        if (Object.prototype.hasOwnProperty.call(n, r)) {
          e[r] = n[r];
        }
      }
    }
    return e;
  }).apply(this, arguments);
}

function provideClient(u) {
  var r = u instanceof e ? u : new e(u);
  n("$urql", r);
  return r;
}

function install(u, n) {
  var r = n instanceof e ? n : new e(n);
  u.provide("$urql", r);
}

function useClient() {
  if ("production" !== process.env.NODE_ENV && !r()) {
    throw new Error("use* functions may only be called during the `setup()` or other lifecycle hooks.");
  }
  var e = t("$urql");
  if ("production" !== process.env.NODE_ENV && !e) {
    throw new Error("No urql Client was provided. Did you forget to install the plugin or call `provideClient` in a parent?");
  }
  return e;
}

var E = {
  flush: "pre"
};

function useQuery(e) {
  return callUseQuery(e);
}

function callUseQuery(e, n, r) {
  if (void 0 === n) {
    n = useClient();
  }
  if (void 0 === r) {
    r = [];
  }
  var t = a(e);
  var s = o();
  var v = o(!1);
  var _ = o(!1);
  var O = o();
  var C = o();
  var N = o();
  var U = i(e.pause) ? e.pause : o(!!e.pause);
  var M = o(u(t.query, t.variables));
  var P = o(null);
  var g = o(null);
  r.push(l((function() {
    var e = u(t.query, t.variables);
    if (M.value.key !== e.key) {
      M.value = e;
    }
  }), E));
  var k = {
    data: s,
    stale: v,
    error: O,
    operation: C,
    extensions: N,
    fetching: _,
    isPaused: U,
    executeQuery: function executeQuery(e) {
      g.value(n.executeQuery(M.value, _extends({}, {
        requestPolicy: t.requestPolicy
      }, t.context, e)));
      return D;
    },
    pause: function pause() {
      U.value = !0;
    },
    resume: function resume() {
      U.value = !1;
    }
  };
  var getState = function() {
    return k;
  };
  r.push(l((function(e) {
    var u = c();
    P.value = function replayOne(e) {
      var u;
      return f([ p((function(e) {
        return void 0 !== e;
      }))(d((function() {
        return u;
      }))(y(u))), h(x((function(e) {
        u = e;
      }))(e)) ]);
    }(u.source);
    g.value = function(e) {
      var n = !1;
      function doOnStart() {
        if (n) {
          return;
        }
        n = !0;
        _.value = !0;
        v.value = !1;
      }
      var r = b((function() {
        _.value = !1;
        v.value = !1;
      }))(e ? h(x((function(e) {
        doOnStart();
        s.value = e.data;
        v.value = !!e.stale;
        _.value = !1;
        O.value = e.error;
        C.value = e.operation;
        N.value = e.extensions;
      }))(S(doOnStart)(e))) : y(void 0));
      u.next(r);
    };
    e(m(d(getState)(Q(P.value))).unsubscribe);
  }), {
    flush: "sync"
  }));
  r.push(l((function() {
    g.value(!U.value ? n.executeQuery(M.value, _extends({}, {
      requestPolicy: t.requestPolicy
    }, t.context)) : void 0);
  }), E));
  var D = _extends({}, k, {
    then: function then(e, u) {
      return (s.value ? Promise.resolve(k) : q(w(1)(d(getState)(Q(P.value))))).then(e, u);
    }
  });
  return D;
}

function useMutation(e) {
  return callUseMutation(e);
}

function callUseMutation(e, u) {
  if (void 0 === u) {
    u = useClient();
  }
  var n = o();
  var r = o(!1);
  var t = o(!1);
  var a = o();
  var i = o();
  var l = o();
  return {
    data: n,
    stale: r,
    fetching: t,
    error: a,
    operation: i,
    extensions: l,
    executeMutation: function executeMutation(o, s) {
      t.value = !0;
      return u.mutation(e, o, s).toPromise().then((function(e) {
        n.value = e.data;
        r.value = !!e.stale;
        t.value = !1;
        a.value = e.error;
        i.value = e.operation;
        l.value = e.extensions;
        return e;
      }));
    }
  };
}

var _ = {
  flush: "pre"
};

function useSubscription(e, u) {
  return callUseSubscription(e, u);
}

function callUseSubscription(e, n, r, t) {
  if (void 0 === r) {
    r = useClient();
  }
  if (void 0 === t) {
    t = [];
  }
  var s = a(e);
  var v = o();
  var c = o(!1);
  var f = o(!1);
  var p = o();
  var d = o();
  var y = o();
  var Q = o(n);
  var q = i(e.pause) ? e.pause : o(!!e.pause);
  var w = o(u(s.query, s.variables));
  var E = o();
  t.push(l((function() {
    var e = u(s.query, s.variables);
    if (w.value.key !== e.key) {
      w.value = e;
    }
  }), _));
  t.push(l((function() {
    if (!q.value) {
      E.value = h(r.executeSubscription(w.value, _extends({}, s.context)));
    } else {
      E.value = void 0;
    }
  }), _));
  t.push(l((function(e) {
    if (E.value) {
      e(m(x((function(e) {
        f.value = !0;
        v.value = void 0 !== e.data ? "function" == typeof Q.value ? Q.value(v.value, e.data) : e.data : e.data, 
        p.value = e.error;
        y.value = e.extensions;
        c.value = !!e.stale;
        d.value = e.operation;
      }))(b((function() {
        f.value = !1;
      }))(S((function() {
        f.value = !0;
      }))(E.value)))).unsubscribe);
    }
  }), _));
  var O = {
    data: v,
    stale: c,
    error: p,
    operation: d,
    extensions: y,
    fetching: f,
    isPaused: q,
    executeSubscription: function executeSubscription(e) {
      E.value = h(r.executeSubscription(w.value, _extends({}, s.context, e)));
      return O;
    },
    pause: function pause() {
      q.value = !0;
    },
    resume: function resume() {
      q.value = !1;
    }
  };
  return O;
}

function useClientHandle() {
  var e = useClient();
  var u = [];
  s((function() {
    var e;
    while (e = u.shift()) {
      e();
    }
  }));
  var n = {
    client: e,
    useQuery: function useQuery(n) {
      return callUseQuery(n, e, u);
    },
    useSubscription: function useSubscription(n, r) {
      return callUseSubscription(n, r, e, u);
    },
    useMutation: function useMutation(u) {
      return callUseMutation(u, e);
    }
  };
  if ("production" !== process.env.NODE_ENV) {
    v((function() {
      _extends(n, {
        useQuery: function useQuery(n) {
          if ("production" !== process.env.NODE_ENV && !r()) {
            throw new Error("`handle.useQuery()` should only be called in the `setup()` or a lifecycle hook.");
          }
          return callUseQuery(n, e, u);
        },
        useSubscription: function useSubscription(n, t) {
          if ("production" !== process.env.NODE_ENV && !r()) {
            throw new Error("`handle.useSubscription()` should only be called in the `setup()` or a lifecycle hook.");
          }
          return callUseSubscription(n, t, e, u);
        }
      });
    }));
  }
  return n;
}

export default install;

export { install, provideClient, useClientHandle, useMutation, useQuery, useSubscription };
//# sourceMappingURL=urql-vue.mjs.map
