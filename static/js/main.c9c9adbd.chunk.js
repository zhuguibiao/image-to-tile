(this["webpackJsonpimage-to-tile"] =
  this["webpackJsonpimage-to-tile"] || []).push([
  [0],
  {
    14: function (e, t, n) {
      e.exports = n(22);
    },
    19: function (e, t, n) {},
    22: function (e, t, n) {
      "use strict";
      n.r(t);
      var a = n(0),
        o = n.n(a),
        r = n(11),
        i = n.n(r),
        c = (n(19), n(25)),
        l = n(27),
        s = n(24),
        u = n(26),
        m = n(2);
      var h = function () {
        return o.a.createElement(
          c.a,
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
          o.a.createElement(l.a, {
            url: "/image-to-tile/static/files/output/2222/{z}/{y}/{x}.png",
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
//# sourceMappingURL=main.c9c9adbd.chunk.js.map
