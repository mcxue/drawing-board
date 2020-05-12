// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"OKMM":[function(require,module,exports) {

},{}],"epB2":[function(require,module,exports) {
"use strict";

require("./components/reset.css");

require("./components/style.css");

require("./components/toolbar.css");

require("./components/canvas.css");

// 我原本想把 toolbar 和 canvas 的 JS 代码分成两个文件来写
// 但是 它们数据之间的通信用原生 JS 直接写貌似有些困难，所以就还是写在一起，假装是分开的
// toolbar 的 JS 代码，一直到第 67 行代码开始 canvas 的 JS 代码
var $colorShow = document.querySelector('.color-show');
var $brushList = document.querySelector('.brush-list');
var $rubber = document.querySelector('.rubber');
var $colorList = document.querySelector('.color-list');
var colorChoice = 'black';
var widthChoice = 15;
var rubberChoice = false;
var colorStore = ['black', 'red', '#ff5000', '#1AAD19', 'blue', '#8000ff', '#483D8D'];
var widthStore = [20, 15, 10];

$colorShow.onclick = function (e) {
  e.currentTarget.classList.add('selected');
  $rubber.classList.remove('selected');
  rubberChoice = false;
};

$brushList.addEventListener('click', function (e) {
  if (e.target !== e.currentTarget) {
    var temporary = e.currentTarget;
    var brushList = temporary.children;
    var brush = e.target;

    for (var i = 0; i < brushList.length; i++) {
      if (brushList[i] !== brush) {
        brushList[i].classList.remove('selected');
      } else {
        brush.classList.add('selected');
        widthChoice = widthStore[i];
      }
    }
  }
});
$rubber.addEventListener('click', function (e) {
  var rubber = e.currentTarget;
  rubber.classList.add('selected');
  $colorShow.classList.remove('selected');
  rubberChoice = true;
});
$colorList.addEventListener('click', function (e) {
  if (e.target !== e.currentTarget) {
    $rubber.classList.remove('selected');
    var tempory = e.currentTarget;
    var colorList = tempory.children;
    var color = e.target;

    for (var i = 0; i < colorList.length; i++) {
      if (colorList[i] === color) {
        color.classList.add('selected');
        colorChoice = colorStore[i];
        rubberChoice = false;
        $colorShow.style.background = colorStore[i];
      } else {
        colorList[i].classList.remove('selected');
      }
    }
  }
}); // canvas 的 JS 代码

var $canvasWrapper = document.querySelector('.canvas-wrapper');
var $canvas = document.querySelector('.canvas');
var ctx = $canvas.getContext('2d');
var mouseState = false;
var touchDevice = "ontouchend" in document;
var lastLocation;
$canvas.width = $canvasWrapper.clientWidth;
$canvas.height = $canvasWrapper.clientHeight;

function drawLine(x1, y1, x2, y2) {
  ctx.lineWidth = widthChoice;
  ctx.strokeStyle = colorChoice;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  lastLocation = [x2, y2];
}

function drawDot(x, y) {
  ctx.fillStyle = colorChoice;
  console.log(colorChoice);
  ctx.beginPath();
  ctx.arc(x, y, widthChoice / 2, 0, 2 * Math.PI);
  ctx.fill();
}

function clearLine(x, y) {
  ctx.clearRect(x, y, 30, 30);
}

function clearSquare(x, y) {
  ctx.clearRect(x, y, 30, 30);
}

if (touchDevice) {
  $canvas.ontouchstart = function (e) {
    lastLocation = [e.touches[0].clientX, e.touches[0].clientY];

    if (rubberChoice) {
      clearSquare(e.touches[0].clientX - 15, e.touches[0].clientY - 15, 30, 30);
    } else {
      console.log("执行了一次画点");
      drawDot(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  $canvas.ontouchmove = function (e) {
    if (rubberChoice) {
      clearLine(e.touches[0].clientX - 15, e.touches[0].clientY - 15);
    } else {
      drawLine(lastLocation[0], lastLocation[1], e.touches[0].clientX, e.touches[0].clientY);
    }
  };
} else {
  $canvas.onmousedown = function (e) {
    mouseState = true;
    lastLocation = [e.clientX, e.clientY];
  };

  $canvas.onmouseup = function () {
    mouseState = false;
  };

  $canvas.onmousemove = function (e) {
    if (mouseState) {
      if (rubberChoice) {
        clearLine(e.clientX - 15, e.clientY - 15, 30, 30);
      } else {
        drawLine(lastLocation[0], lastLocation[1], e.clientX, e.clientY);
      }
    }
  };

  $canvas.onclick = function (e) {
    if (rubberChoice) {
      clearSquare(e.clientX - 15, e.clientY - 15, 30, 30);
    } else {
      drawDot(e.clientX, e.clientY);
    }
  };
}
},{"./components/reset.css":"OKMM","./components/style.css":"OKMM","./components/toolbar.css":"OKMM","./components/canvas.css":"OKMM"}]},{},["epB2"], null)
//# sourceMappingURL=main.d9eee7d0.js.map