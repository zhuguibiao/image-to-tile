(this.webpackJsonpleaflet_examining =
  this.webpackJsonpleaflet_examining || []).push([
  [0],
  {
    14: function (e, n, t) {
      e.exports = t(22);
    },
    19: function (e, n, t) {},
    22: function (e, n, t) {
      "use strict";
      t.r(n);
      var a = t(0),
        o = t.n(a),
        r = t(11),
        i = t.n(r),
        l = (t(19), t(25)),
        c = t(27),
        s = t(24),
        u = t(26),
        m = t(2);
      var h = function () {
        return o.a.createElement(
          l.a,
          {
            animate: !0,
            crs: m.CRS.Simple,
            center: [0, 0],
            bounds: [
              [10, 10],
              [0, 50],
            ],
            zoom: 6,
            style: { height: "100vh" },
            maxBounds: [
              [-110, 165],
              [0, 0],
            ],
          },
          o.a.createElement(c.a, {
            url: "/static/files/output/2222/{z}/{y}/{x}.png",
          }),
          o.a.createElement(s.a, {
            bounds: [
              [-10, 15],
              [0, 0],
            ],
            zIndex: 12,
            url: "http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg",
          }),
          o.a.createElement(u.a, {
            center: [-10, 40],
            fillColor: "blue",
            radius: 2,
          })
        );
      };
      Boolean(
        "localhost" === window.location.hostname ||
          "[::1]" === window.location.hostname ||
          window.location.hostname.match(
            /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
          )
      );
      i.a.render(
        o.a.createElement(o.a.StrictMode, null, o.a.createElement(h, null)),
        document.getElementById("root")
      ),
        "serviceWorker" in navigator &&
          navigator.serviceWorker.ready
            .then(function (e) {
              e.unregister();
            })
            .catch(function (e) {
              console.error(e.message);
            });
    },
  },
  [[14, 1, 2]],
]);
//# sourceMappingURL=main.135b6d4a.chunk.js.map
