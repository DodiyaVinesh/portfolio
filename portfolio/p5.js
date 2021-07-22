window.addEventListener("load", function () {
  winResize();
  window.addEventListener("resize", winResize);
  //title animation
  var txt = document.querySelector(".title h3");
  var cnt = "I Develop Websites\nthat users loves";
  txt.innerHTML = cnt.replace(/\S/g, "<span>$&</span>").replace("\n", "<br>");

  //image hover animation
  var img = document.querySelectorAll(".pImg");
  img.forEach((i) => {
    i.addEventListener("mousemove", function (e) {
      let xAxis = (e.offsetX - 125) / 10;
      let yAxis = (e.offsetY - 200) / 10;
      i.style.transform = `rotateX(${xAxis}deg) rotateY(${yAxis}deg)`;
    });
    i.addEventListener("mouseleave", function () {
      i.style.transform = "initial";
    });
  });

  //moving balls
  var canvas = document.getElementById("balls");
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  var ctx = canvas.getContext("2d");
  var b1x = getRandom(canvas.width - 10) + 5;
  var b1y = getRandom(canvas.height - 10) + 5;
  var b2x = getRandom(canvas.width - 10) + 5;
  var b2y = getRandom(canvas.height - 10) + 5;
  var b3x = getRandom(canvas.width - 10) + 5;
  var b3y = getRandom(canvas.height - 10) + 5;
  var b4x = getRandom(canvas.width - 10) + 5;
  var b4y = getRandom(canvas.height - 10) + 5;
  var b1xs = (b1ys = b2xs = b2ys = b3xs = b3ys = b4xs = b4ys = 1);

  requestAnimationFrame(draw);
  function draw() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    if (b1x <= 5) {
      b1xs = 1;
    } else if (b1x >= canvas.width - 5) {
      b1xs = -1;
    }
    if (b1y <= 5) {
      b1ys = 1;
    } else if (b1y >= canvas.height - 5) {
      b1ys = -1;
    }
    if (b2x <= 5) {
      b2xs = 1;
    } else if (b2x >= canvas.width - 5) {
      b2xs = -1;
    }
    if (b2y <= 5) {
      b2ys = 1;
    } else if (b2y >= canvas.height - 5) {
      b2ys = -1;
    }
    if (b3x <= 5) {
      b3xs = 1;
    } else if (b3x >= canvas.width - 5) {
      b3xs = -1;
    }
    if (b3y <= 5) {
      b3ys = 1;
    } else if (b3y >= canvas.height - 5) {
      b3ys = -1;
    }
    if (b4x <= 5) {
      b4xs = 1;
    } else if (b4x >= canvas.width - 5) {
      b4xs = -1;
    }
    if (b4y <= 5) {
      b4ys = 1;
    } else if (b4y >= canvas.height - 5) {
      b4ys = -1;
    }
    b1x += b1xs;
    b1y += b1ys;
    b2x += b2xs;
    b2y += b2ys;
    b3x += b3xs;
    b3y += b3ys;
    b4x += b4xs;
    b4y += b4ys;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(b1x, b1y, 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(b2x, b2y, 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(b3x, b3y, 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(b4x, b4y, 10, 0, 2 * Math.PI);
    ctx.fill();
    requestAnimationFrame(draw);
  }

  //techskill animation
  var perc = [60, 70, 90, 90, 85, 55, 65, 70];
  var boxs = document.querySelectorAll(".box .percent svg circle:nth-child(2)");
  console.log(boxs);
  for (var i = 0; i < 8; i++) {
    b(i, boxs[i]);
    function b(i, box) {
      var visible = false;
      var temp = i;
      window.addEventListener("scroll", function () {
        var rect = boxs[temp].getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight && !visible) {
          visible = true;
          var x = 0;
          var intrvl = setInterval(() => {
            x++;
            if (x > perc[temp]) {
              clearInterval(intrvl);
              return;
            }
            boxs[temp].style.strokeDashoffset = x * 2.8 - 280;
          }, 10);
        } else if (
          visible &&
          (rect.top >= window.innerHeight || rect.bottom <= 0)
        ) {
          boxs[temp].style.strokeDashoffset = 280;
          visible = false;
        }
      });
    }
  }
});

function getRandom(n) {
  return Math.floor(Math.random() * n);
}
function getRandomColor() {
  var v = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "a", "b", "c", "d", "e", "f"];
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += v[getRandom(16)];
  }
  return color;
}
function sendMsg(e) {
  e.preventDefault();
}
function winResize() {
  var circls = document.querySelectorAll(".box .percent svg circle");
  if (window.innerWidth <= 600) {
    circls.forEach((c) => {
      c.setAttribute("cx", "28.125");
      c.setAttribute("cy", "28.125");
      c.setAttribute("r", "28.125");
    });
  } else {
    circls.forEach((c) => {
      c.setAttribute("cx", "45");
      c.setAttribute("cy", "45");
      c.setAttribute("r", "45");
    });
  }
}
