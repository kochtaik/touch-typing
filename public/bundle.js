/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/facade.js":
/*!**************************!*\
  !*** ./src/js/facade.js ***!
  \**************************/
/*! namespace exports */
/*! exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./module */ \"./src/js/module.js\");\n\nwindow.addEventListener('DOMContentLoaded', function () {\n  var keyboard = new _module__WEBPACK_IMPORTED_MODULE_0__.default('ru');\n  keyboard.generateKeyboard();\n});\n\n//# sourceURL=webpack://touch-typing/./src/js/facade.js?");

/***/ }),

/***/ "./src/js/index.js":
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
/*! namespace exports */
/*! exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _styles_style_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../styles/style.scss */ \"./src/styles/style.scss\");\n/* harmony import */ var _facade__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./facade */ \"./src/js/facade.js\");\n\n\n\n//# sourceURL=webpack://touch-typing/./src/js/index.js?");

/***/ }),

/***/ "./src/js/module.js":
/*!**************************!*\
  !*** ./src/js/module.js ***!
  \**************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar Keyboard = /*#__PURE__*/function () {\n  function Keyboard(lang) {\n    _classCallCheck(this, Keyboard);\n\n    this.lang = lang;\n    this.elements = {\n      keyboardField: document.querySelector('#keyboard')\n    };\n    this.HTMLCodes = {\n      backspace: '&larr;',\n      capsLock: '&uarr;',\n      tab: '&#8633;'\n    };\n  }\n\n  _createClass(Keyboard, [{\n    key: \"generateKeyboard\",\n    value: function generateKeyboard() {\n      var _this = this;\n\n      var fragment = document.createDocumentFragment();\n      var keys = ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace', 'tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', 'capsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\\'', '#', 'shiftL', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'shiftR', 'space'];\n      var marginElements = ['backspace', ']', '#', 'ShiftR'];\n      keys.forEach(function (_char) {\n        var key = document.createElement('div');\n        key.classList.add('keyboard__key');\n        var characterWrapper = document.createElement('span');\n        characterWrapper.classList.add('keyboard__key__char');\n\n        switch (_char) {\n          case \"backspace\":\n            characterWrapper.textContent = _this.HTMLCodes.backspace;\n            key.style.width = '9%';\n            key.dataset.type = 'backspace';\n            break;\n\n          case \"tab\":\n            characterWrapper.textContent = _this.HTMLCodes.tab;\n            key.style.width = '9%';\n            key.dataset.type = 'tab';\n            break;\n\n          case \"capsLock\":\n            characterWrapper.textContent = _this.HTMLCodes.capsLock;\n            key.style.width = '10%';\n            key.dataset.type = 'capsLock';\n            break;\n\n          case \"shiftL\":\n            characterWrapper.textContent = '&larr';\n            key.style.width = '12%';\n            key.dataset.type = 'shiftL';\n            break;\n\n          case \"shiftR\":\n            characterWrapper.textContent = '&larr';\n            key.dataset.type = 'shiftR';\n            key.style.width = '12%';\n            break;\n\n          case \"space\":\n            characterWrapper.textContent = '';\n            key.classList.add('keyboard__key--extrawide');\n            key.dataset.type = 'space';\n            break;\n\n          default:\n            characterWrapper.textContent = _char.toLowerCase();\n            key.dataset.type = _char.toLowerCase();\n            break;\n        }\n\n        var isMargin = function isMargin(el) {\n          return marginElements.indexOf(el) !== -1;\n        };\n\n        key.appendChild(characterWrapper);\n\n        _this.colorKey(key);\n\n        fragment.appendChild(key);\n        if (isMargin(_char)) fragment.appendChild(document.createElement('br'));\n      });\n      this.elements.keyboardField.appendChild(fragment);\n    }\n  }, {\n    key: \"colorKey\",\n    value: function colorKey(key) {\n      var fingerZones = {\n        mericularFingers: {\n          values: ['`', '1', '2', 'tab', 'capsLock', 'shiftL', 'shiftR', 'q', 'a', 'z', 'p', '0', '-', '=', '[', ']', '\\'', '/', ';', 'backspace', '#'],\n          className: 'keyboard__key--blue'\n        },\n        ringFingers: {\n          values: ['w', 's', 'x', 'o', 'l', '.', '9', '3'],\n          className: 'keyboard__key--green'\n        },\n        middleFingers: {\n          values: ['e', 'd', 'c', '4', ',', '8', 'i', 'k'],\n          className: 'keyboard__key--rose'\n        },\n        leftPointerFinger: {\n          values: ['5', '6', 'r', 'f', 'v', 't', 'g', 'b'],\n          className: 'keyboard__key--orange'\n        },\n        rightPointerFinger: {\n          values: ['7', 'y', 'h', 'n', 'u', 'j', 'm'],\n          className: 'keyboard__key--yellow'\n        },\n        thumbFinger: {\n          values: ['space'],\n          className: 'keyboard__key--gray'\n        }\n      };\n      var keyValue = key.dataset.type;\n      var keyGroups = Object.values(fingerZones);\n\n      for (var _i = 0, _keyGroups = keyGroups; _i < _keyGroups.length; _i++) {\n        var group = _keyGroups[_i];\n        var values = group.values,\n            className = group.className;\n        if (values.includes(keyValue)) key.classList.add(className);\n      }\n    }\n  }]);\n\n  return Keyboard;\n}();\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Keyboard);\n\n//# sourceURL=webpack://touch-typing/./src/js/module.js?");

/***/ }),

/***/ "./src/styles/style.scss":
/*!*******************************!*\
  !*** ./src/styles/style.scss ***!
  \*******************************/
/*! namespace exports */
/*! exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://touch-typing/./src/styles/style.scss?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/js/index.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;