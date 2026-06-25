(function () {
  var mouse = function () {
    var b = {
      leftButton: !1,
      middleButton: !1,
      rightButton: !1,
      x: 0,
      y: 0
    };
    document.addEventListener("mousedown", function (a) {
      0 == a.button && (b.leftButton = !0);
      1 == a.button && (b.middleButton = !0);
      2 == a.button && (b.rightButton = !0)
    });
    document.addEventListener("mouseup", function (a) {
      0 == a.button && (b.leftButton = !1);
      1 == a.button && (b.middleButton = !1);
      2 == a.button && (b.rightButton = !1)
    });
    document.addEventListener("mousemove", function (a) {
      b.x =
        a.clientX;
      b.y = a.clientY
    });
    document.addEventListener("mouseenter", function (a) {
      b.inWindow = !0
    });
    document.addEventListener("mouseleave", function (a) {
      b.inWindow = !1
    });
    return b
  }();



  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

  var W = canvas.width = window.innerWidth;
  var H = canvas.height = window.innerHeight;


  var points = [];

  var createSphere = function (originX, originY, originZ, scale) {
    for (var i = 0; i < scale * 50; i++) {
      // Make points randomly distributed across the sphere's
      // surface. We start with Spherical coordinates then
      // convert to x y and z
      var theta = Math.PI * 2 * Math.random();
      var phi = Math.PI * Math.random();
      var radius = scale;

      var x = radius * Math.sin(theta) * Math.cos(phi);
      var y = radius * Math.sin(theta) * Math.sin(phi);
      var z = radius * Math.cos(theta);

      points.push({
        x: x + originX,
        y: y + originY,
        z: z + originZ
      });
    }
  }

  createSphere(0, 0, 0, 100);
  createSphere(100, 150, 150, 20);
  createSphere(-100, 150, -150, 30);
  createSphere(100, -150, -150, 40);
  createSphere(-100, -150, 150, 10);

  // Field of View
  var fov = 550;
  var fovSpeed = -5;

  var turnAngle = 0;
  var turnSpeed = 0.01;

  var render = function () {
    ctx.clearRect(0, 0, W, H);

    if (mouse.inWindow) turnAngle = ((2 * Math.PI) / W) * mouse.x * 2;
    if (!mouse.inWindow) turnAngle = (turnAngle + turnSpeed) % (2 * Math.PI);
    var sinAngle = Math.sin(turnAngle);
    var cosAngle = Math.cos(turnAngle)

    if (mouse.leftButton) fov += 10;
    if (mouse.rightButton) fov -= 10;

    if (!mouse.inWindow) fov += fovSpeed;
    if (fov > 1000) fovSpeed = -5;
    if (fov < -1000) fovSpeed = 5;

    // Writing pixels directly is far more efficent then using
    // Draw commands.
    var imageData = ctx.getImageData(0, 0, W, H);

    for (var i = 0; i < points.length; i++) {
      var point = points[i];

      var rotatedX = cosAngle * point.x + sinAngle * point.z;
      var rotatedZ = -sinAngle * point.x + cosAngle * point.z;

      var scale = fov / (fov + rotatedZ);
      var x2d = rotatedX * scale + W / 2;
      var y2d = point.y * scale + H / 2;

      // This isn't really "normalized", but it's close enough for our purposes.
      var normalizedZ = (-rotatedZ + 150) / 300;

      // Get the index in the image data array that corrisponds to the
      // desired pixel
      var c = Math.round(y2d) * imageData.width + Math.round(x2d);
      // Each pixel has four values - red green blue and alpha
      c *= 4;

      imageData.data[c] = 0; // Red
      imageData.data[c + 1] = (normalizedZ * 150) + 100; // Green
      imageData.data[c + 2] = (normalizedZ * 30) + 30; // Blue
      imageData.data[c + 3] = (normalizedZ * 150) + 100; // Alpha
    }
    ctx.putImageData(imageData, 0, 0);
    window.requestAnimationFrame(render);
  };
  render();
})();