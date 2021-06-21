var e = require("@urql/core");

var r = require("vue");

var t = require("wonka");

function _extends() {
  return (_extends = Object.assign || function(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = arguments[r];
      for (var u in t) {
        if (Object.prototype.hasOwnProperty.call(t, u)) {
          e[u] = t[u];
        }
      }
    }
    return e;
  }).apply(this, arguments);
}

function install(r, t) {
  var u = t instanceof e.Client ? t : new e.Client(t);
  r.provide("$urql", u);
}

function useClient() {
  if ("production" !== process.env.NODE_ENV && !r.getCurrentInstance()) {
    throw new Error("use* functions may only be called during the `setup()` or other lifecycle hooks.");
  }
  var e = r.inject("$urql");
  if ("production" !== process.env.NODE_ENV && !e) {
    throw new Error("No urql Client was provided. Did you forget to install the plugin or call `provideClient` in a parent?");
  }
  return e;
}

var u = {
  flush: "pre"
};

function callUseQuery(n, a, o) {
  if (void 0 === a) {
    a = useClient();
  }
  if (void 0 === o) {
    o = [];
  }
  var i = r.reactive(n);
  var s = r.ref();
  var l = r.ref(!1);
  var c = r.ref(!1);
  var v = r.ref();
  var f = r.ref();
  var p = r.ref();
  var d = r.isRef(n.pause) ? n.pause : r.ref(!!n.pause);
  var h = r.ref(e.createRequest(i.query, i.variables));
  var y = r.ref(null);
  var x = r.ref(null);
  o.push(r.watchEffect((function() {
    var r = e.createRequest(i.query, i.variables);
    if (h.value.key !== r.key) {
      h.value = r;
    }
  }), u));
  var b = {
    data: s,
    stale: l,
    error: v,
    operation: f,
    extensions: p,
    fetching: c,
    isPaused: d,
    executeQuery: function executeQuery(e) {
      x.value(a.executeQuery(h.value, _extends({}, {
        requestPolicy: i.requestPolicy
      }, i.context, e)));
      return w;
    },
    pause: function pause() {
      d.value = !0;
    },
    resume: function resume() {
      d.value = !1;
    }
  };
  var getState = function() {
    return b;
  };
  o.push(r.watchEffect((function(e) {
    var r = t.makeSubject();
    y.value = function replayOne(e) {
      var r;
      return t.concat([ t.filter((function(e) {
        return void 0 !== e;
      }))(t.map((function() {
        return r;
      }))(t.fromValue(r))), t.share(t.onPush((function(e) {
        r = e;
      }))(e)) ]);
    }(r.source);
    x.value = function(e) {
      var u = !1;
      function doOnStart() {
        if (u) {
          return;
        }
        u = !0;
        c.value = !0;
        l.value = !1;
      }
      var n = t.onEnd((function() {
        c.value = !1;
        l.value = !1;
      }))(e ? t.share(t.onPush((function(e) {
        doOnStart();
        s.value = e.data;
        l.value = !!e.stale;
        c.value = !1;
        v.value = e.error;
        f.value = e.operation;
        p.value = e.extensions;
      }))(t.onStart(doOnStart)(e))) : t.fromValue(void 0));
      r.next(n);
    };
    e(t.publish(t.map(getState)(t.switchAll(y.value))).unsubscribe);
  }), {
    flush: "sync"
  }));
  o.push(r.watchEffect((function() {
    x.value(!d.value ? a.executeQuery(h.value, _extends({}, {
      requestPolicy: i.requestPolicy
    }, i.context)) : void 0);
  }), u));
  var w = _extends({}, b, {
    then: function then(e, r) {
      return (s.value ? Promise.resolve(b) : t.toPromise(t.take(1)(t.map(getState)(t.switchAll(y.value))))).then(e, r);
    }
  });
  return w;
}

function callUseMutation(e, t) {
  if (void 0 === t) {
    t = useClient();
  }
  var u = r.ref();
  var n = r.ref(!1);
  var a = r.ref(!1);
  var o = r.ref();
  var i = r.ref();
  var s = r.ref();
  return {
    data: u,
    stale: n,
    fetching: a,
    error: o,
    operation: i,
    extensions: s,
    executeMutation: function executeMutation(r, l) {
      a.value = !0;
      return t.mutation(e, r, l).toPromise().then((function(e) {
        u.value = e.data;
        n.value = !!e.stale;
        a.value = !1;
        o.value = e.error;
        i.value = e.operation;
        s.value = e.extensions;
        return e;
      }));
    }
  };
}

var n = {
  flush: "pre"
};

function callUseSubscription(u, a, o, i) {
  if (void 0 === o) {
    o = useClient();
  }
  if (void 0 === i) {
    i = [];
  }
  var s = r.reactive(u);
  var l = r.ref();
  var c = r.ref(!1);
  var v = r.ref(!1);
  var f = r.ref();
  var p = r.ref();
  var d = r.ref();
  var h = r.ref(a);
  var y = r.isRef(u.pause) ? u.pause : r.ref(!!u.pause);
  var x = r.ref(e.createRequest(s.query, s.variables));
  var b = r.ref();
  i.push(r.watchEffect((function() {
    var r = e.createRequest(s.query, s.variables);
    if (x.value.key !== r.key) {
      x.value = r;
    }
  }), n));
  i.push(r.watchEffect((function() {
    if (!y.value) {
      b.value = t.share(o.executeSubscription(x.value, _extends({}, s.context)));
    } else {
      b.value = void 0;
    }
  }), n));
  i.push(r.watchEffect((function(e) {
    if (b.value) {
      e(t.publish(t.onPush((function(e) {
        v.value = !0;
        l.value = void 0 !== e.data ? "function" == typeof h.value ? h.value(l.value, e.data) : e.data : e.data, 
        f.value = e.error;
        d.value = e.extensions;
        c.value = !!e.stale;
        p.value = e.operation;
      }))(t.onEnd((function() {
        v.value = !1;
      }))(t.onStart((function() {
        v.value = !0;
      }))(b.value)))).unsubscribe);
    }
  }), n));
  var w = {
    data: l,
    stale: c,
    error: f,
    operation: p,
    extensions: d,
    fetching: v,
    isPaused: y,
    executeSubscription: function executeSubscription(e) {
      b.value = t.share(o.executeSubscription(x.value, _extends({}, s.context, e)));
      return w;
    },
    pause: function pause() {
      y.value = !0;
    },
    resume: function resume() {
      y.value = !1;
    }
  };
  return w;
}

exports.default = install;

exports.install = install;

exports.provideClient = function provideClient(t) {
  var u = t instanceof e.Client ? t : new e.Client(t);
  r.provide("$urql", u);
  return u;
};

exports.useClientHandle = function useClientHandle() {
  var e = useClient();
  var t = [];
  r.onBeforeUnmount((function() {
    var e;
    while (e = t.shift()) {
      e();
    }
  }));
  var u = {
    client: e,
    useQuery: function useQuery(r) {
      return callUseQuery(r, e, t);
    },
    useSubscription: function useSubscription(r, u) {
      return callUseSubscription(r, u, e, t);
    },
    useMutation: function useMutation(r) {
      return callUseMutation(r, e);
    }
  };
  if ("production" !== process.env.NODE_ENV) {
    r.onMounted((function() {
      _extends(u, {
        useQuery: function useQuery(u) {
          if ("production" !== process.env.NODE_ENV && !r.getCurrentInstance()) {
            throw new Error("`handle.useQuery()` should only be called in the `setup()` or a lifecycle hook.");
          }
          return callUseQuery(u, e, t);
        },
        useSubscription: function useSubscription(u, n) {
          if ("production" !== process.env.NODE_ENV && !r.getCurrentInstance()) {
            throw new Error("`handle.useSubscription()` should only be called in the `setup()` or a lifecycle hook.");
          }
          return callUseSubscription(u, n, e, t);
        }
      });
    }));
  }
  return u;
};

exports.useMutation = function useMutation(e) {
  return callUseMutation(e);
};

exports.useQuery = function useQuery(e) {
  return callUseQuery(e);
};

exports.useSubscription = function useSubscription(e, r) {
  return callUseSubscription(e, r);
};

Object.keys(e).forEach((function(r) {
  if ("default" !== r && !exports.hasOwnProperty(r)) {
    exports[r] = e[r];
  }
}));
//# sourceMappingURL=urql-vue.js.map
