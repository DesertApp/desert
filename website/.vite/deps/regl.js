import {
  __commonJS
} from "./chunk-HKJ2B2AA.js";

// node_modules/regl/dist/regl.js
var require_regl = __commonJS({
  "node_modules/regl/dist/regl.js"(exports, module) {
    (function(global, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : global.createREGL = factory();
    })(exports, function() {
      "use strict";
      var isTypedArray = function(x) {
        return x instanceof Uint8Array || x instanceof Uint16Array || x instanceof Uint32Array || x instanceof Int8Array || x instanceof Int16Array || x instanceof Int32Array || x instanceof Float32Array || x instanceof Float64Array || x instanceof Uint8ClampedArray;
      };
      var extend = function(base, opts) {
        var keys = Object.keys(opts);
        for (var i = 0; i < keys.length; ++i) {
          base[keys[i]] = opts[keys[i]];
        }
        return base;
      };
      var endl = "\n";
      function decodeB64(str) {
        if (typeof atob !== "undefined") {
          return atob(str);
        }
        return "base64:" + str;
      }
      function raise(message) {
        var error = new Error("(regl) " + message);
        console.error(error);
        throw error;
      }
      function check(pred, message) {
        if (!pred) {
          raise(message);
        }
      }
      function encolon(message) {
        if (message) {
          return ": " + message;
        }
        return "";
      }
      function checkParameter(param, possibilities, message) {
        if (!(param in possibilities)) {
          raise("unknown parameter (" + param + ")" + encolon(message) + ". possible values: " + Object.keys(possibilities).join());
        }
      }
      function checkIsTypedArray(data, message) {
        if (!isTypedArray(data)) {
          raise(
            "invalid parameter type" + encolon(message) + ". must be a typed array"
          );
        }
      }
      function standardTypeEh(value, type) {
        switch (type) {
          case "number":
            return typeof value === "number";
          case "object":
            return typeof value === "object";
          case "string":
            return typeof value === "string";
          case "boolean":
            return typeof value === "boolean";
          case "function":
            return typeof value === "function";
          case "undefined":
            return typeof value === "undefined";
          case "symbol":
            return typeof value === "symbol";
        }
      }
      function checkTypeOf(value, type, message) {
        if (!standardTypeEh(value, type)) {
          raise(
            "invalid parameter type" + encolon(message) + ". expected " + type + ", got " + typeof value
          );
        }
      }
      function checkNonNegativeInt(value, message) {
        if (!(value >= 0 && (value | 0) === value)) {
          raise("invalid parameter type, (" + value + ")" + encolon(message) + ". must be a nonnegative integer");
        }
      }
      function checkOneOf(value, list, message) {
        if (list.indexOf(value) < 0) {
          raise("invalid value" + encolon(message) + ". must be one of: " + list);
        }
      }
      var constructorKeys = [
        "gl",
        "canvas",
        "container",
        "attributes",
        "pixelRatio",
        "extensions",
        "optionalExtensions",
        "profile",
        "onDone"
      ];
      function checkConstructor(obj) {
        Object.keys(obj).forEach(function(key) {
          if (constructorKeys.indexOf(key) < 0) {
            raise('invalid regl constructor argument "' + key + '". must be one of ' + constructorKeys);
          }
        });
      }
      function leftPad(str, n) {
        str = str + "";
        while (str.length < n) {
          str = " " + str;
        }
        return str;
      }
      function ShaderFile() {
        this.name = "unknown";
        this.lines = [];
        this.index = {};
        this.hasErrors = false;
      }
      function ShaderLine(number, line2) {
        this.number = number;
        this.line = line2;
        this.errors = [];
      }
      function ShaderError(fileNumber, lineNumber, message) {
        this.file = fileNumber;
        this.line = lineNumber;
        this.message = message;
      }
      function guessCommand() {
        var error = new Error();
        var stack = (error.stack || error).toString();
        var pat = /compileProcedure.*\n\s*at.*\((.*)\)/.exec(stack);
        if (pat) {
          return pat[1];
        }
        var pat2 = /compileProcedure.*\n\s*at\s+(.*)(\n|$)/.exec(stack);
        if (pat2) {
          return pat2[1];
        }
        return "unknown";
      }
      function guessCallSite() {
        var error = new Error();
        var stack = (error.stack || error).toString();
        var pat = /at REGLCommand.*\n\s+at.*\((.*)\)/.exec(stack);
        if (pat) {
          return pat[1];
        }
        var pat2 = /at REGLCommand.*\n\s+at\s+(.*)\n/.exec(stack);
        if (pat2) {
          return pat2[1];
        }
        return "unknown";
      }
      function parseSource(source, command) {
        var lines2 = source.split("\n");
        var lineNumber = 1;
        var fileNumber = 0;
        var files = {
          unknown: new ShaderFile(),
          0: new ShaderFile()
        };
        files.unknown.name = files[0].name = command || guessCommand();
        files.unknown.lines.push(new ShaderLine(0, ""));
        for (var i = 0; i < lines2.length; ++i) {
          var line2 = lines2[i];
          var parts = /^\s*#\s*(\w+)\s+(.+)\s*$/.exec(line2);
          if (parts) {
            switch (parts[1]) {
              case "line":
                var lineNumberInfo = /(\d+)(\s+\d+)?/.exec(parts[2]);
                if (lineNumberInfo) {
                  lineNumber = lineNumberInfo[1] | 0;
                  if (lineNumberInfo[2]) {
                    fileNumber = lineNumberInfo[2] | 0;
                    if (!(fileNumber in files)) {
                      files[fileNumber] = new ShaderFile();
                    }
                  }
                }
                break;
              case "define":
                var nameInfo = /SHADER_NAME(_B64)?\s+(.*)$/.exec(parts[2]);
                if (nameInfo) {
                  files[fileNumber].name = nameInfo[1] ? decodeB64(nameInfo[2]) : nameInfo[2];
                }
                break;
            }
          }
          files[fileNumber].lines.push(new ShaderLine(lineNumber++, line2));
        }
        Object.keys(files).forEach(function(fileNumber2) {
          var file = files[fileNumber2];
          file.lines.forEach(function(line3) {
            file.index[line3.number] = line3;
          });
        });
        return files;
      }
      function parseErrorLog(errLog) {
        var result = [];
        errLog.split("\n").forEach(function(errMsg) {
          if (errMsg.length < 5) {
            return;
          }
          var parts = /^ERROR:\s+(\d+):(\d+):\s*(.*)$/.exec(errMsg);
          if (parts) {
            result.push(new ShaderError(
              parts[1] | 0,
              parts[2] | 0,
              parts[3].trim()
            ));
          } else if (errMsg.length > 0) {
            result.push(new ShaderError("unknown", 0, errMsg));
          }
        });
        return result;
      }
      function annotateFiles(files, errors) {
        errors.forEach(function(error) {
          var file = files[error.file];
          if (file) {
            var line2 = file.index[error.line];
            if (line2) {
              line2.errors.push(error);
              file.hasErrors = true;
              return;
            }
          }
          files.unknown.hasErrors = true;
          files.unknown.lines[0].errors.push(error);
        });
      }
      function checkShaderError(gl, shader, source, type, command) {
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          var errLog = gl.getShaderInfoLog(shader);
          var typeName = type === gl.FRAGMENT_SHADER ? "fragment" : "vertex";
          checkCommandType(source, "string", typeName + " shader source must be a string", command);
          var files = parseSource(source, command);
          var errors = parseErrorLog(errLog);
          annotateFiles(files, errors);
          Object.keys(files).forEach(function(fileNumber) {
            var file = files[fileNumber];
            if (!file.hasErrors) {
              return;
            }
            var strings = [""];
            var styles = [""];
            function push(str, style) {
              strings.push(str);
              styles.push(style || "");
            }
            push("file number " + fileNumber + ": " + file.name + "\n", "color:red;text-decoration:underline;font-weight:bold");
            file.lines.forEach(function(line2) {
              if (line2.errors.length > 0) {
                push(leftPad(line2.number, 4) + "|  ", "background-color:yellow; font-weight:bold");
                push(line2.line + endl, "color:red; background-color:yellow; font-weight:bold");
                var offset = 0;
                line2.errors.forEach(function(error) {
                  var message = error.message;
                  var token = /^\s*'(.*)'\s*:\s*(.*)$/.exec(message);
                  if (token) {
                    var tokenPat = token[1];
                    message = token[2];
                    switch (tokenPat) {
                      case "assign":
                        tokenPat = "=";
                        break;
                    }
                    offset = Math.max(line2.line.indexOf(tokenPat, offset), 0);
                  } else {
                    offset = 0;
                  }
                  push(leftPad("| ", 6));
                  push(leftPad("^^^", offset + 3) + endl, "font-weight:bold");
                  push(leftPad("| ", 6));
                  push(message + endl, "font-weight:bold");
                });
                push(leftPad("| ", 6) + endl);
              } else {
                push(leftPad(line2.number, 4) + "|  ");
                push(line2.line + endl, "color:red");
              }
            });
            if (typeof document !== "undefined" && !window.chrome) {
              styles[0] = strings.join("%c");
              console.log.apply(console, styles);
            } else {
              console.log(strings.join(""));
            }
          });
          check.raise("Error compiling " + typeName + " shader, " + files[0].name);
        }
      }
      function checkLinkError(gl, program, fragShader, vertShader, command) {
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          var errLog = gl.getProgramInfoLog(program);
          var fragParse = parseSource(fragShader, command);
          var vertParse = parseSource(vertShader, command);
          var header = 'Error linking program with vertex shader, "' + vertParse[0].name + '", and fragment shader "' + fragParse[0].name + '"';
          if (typeof document !== "undefined") {
            console.log(
              "%c" + header + endl + "%c" + errLog,
              "color:red;text-decoration:underline;font-weight:bold",
              "color:red"
            );
          } else {
            console.log(header + endl + errLog);
          }
          check.raise(header);
        }
      }
      function saveCommandRef(object) {
        object._commandRef = guessCommand();
      }
      function saveDrawCommandInfo(opts, uniforms, attributes, stringStore) {
        saveCommandRef(opts);
        function id(str) {
          if (str) {
            return stringStore.id(str);
          }
          return 0;
        }
        opts._fragId = id(opts.static.frag);
        opts._vertId = id(opts.static.vert);
        function addProps(dict, set) {
          Object.keys(set).forEach(function(u) {
            dict[stringStore.id(u)] = true;
          });
        }
        var uniformSet = opts._uniformSet = {};
        addProps(uniformSet, uniforms.static);
        addProps(uniformSet, uniforms.dynamic);
        var attributeSet = opts._attributeSet = {};
        addProps(attributeSet, attributes.static);
        addProps(attributeSet, attributes.dynamic);
        opts._hasCount = "count" in opts.static || "count" in opts.dynamic || "elements" in opts.static || "elements" in opts.dynamic;
      }
      function commandRaise(message, command) {
        var callSite = guessCallSite();
        raise(message + " in command " + (command || guessCommand()) + (callSite === "unknown" ? "" : " called from " + callSite));
      }
      function checkCommand(pred, message, command) {
        if (!pred) {
          commandRaise(message, command || guessCommand());
        }
      }
      function checkParameterCommand(param, possibilities, message, command) {
        if (!(param in possibilities)) {
          commandRaise(
            "unknown parameter (" + param + ")" + encolon(message) + ". possible values: " + Object.keys(possibilities).join(),
            command || guessCommand()
          );
        }
      }
      function checkCommandType(value, type, message, command) {
        if (!standardTypeEh(value, type)) {
          commandRaise(
            "invalid parameter type" + encolon(message) + ". expected " + type + ", got " + typeof value,
            command || guessCommand()
          );
        }
      }
      function checkOptional(block) {
        block();
      }
      function checkFramebufferFormat(attachment, texFormats, rbFormats) {
        if (attachment.texture) {
          checkOneOf(
            attachment.texture._texture.internalformat,
            texFormats,
            "unsupported texture format for attachment"
          );
        } else {
          checkOneOf(
            attachment.renderbuffer._renderbuffer.format,
            rbFormats,
            "unsupported renderbuffer format for attachment"
          );
        }
      }
      var GL_CLAMP_TO_EDGE = 33071;
      var GL_NEAREST = 9728;
      var GL_NEAREST_MIPMAP_NEAREST = 9984;
      var GL_LINEAR_MIPMAP_NEAREST = 9985;
      var GL_NEAREST_MIPMAP_LINEAR = 9986;
      var GL_LINEAR_MIPMAP_LINEAR = 9987;
      var GL_BYTE = 5120;
      var GL_UNSIGNED_BYTE = 5121;
      var GL_SHORT = 5122;
      var GL_UNSIGNED_SHORT = 5123;
      var GL_INT = 5124;
      var GL_UNSIGNED_INT = 5125;
      var GL_FLOAT = 5126;
      var GL_UNSIGNED_SHORT_4_4_4_4 = 32819;
      var GL_UNSIGNED_SHORT_5_5_5_1 = 32820;
      var GL_UNSIGNED_SHORT_5_6_5 = 33635;
      var GL_UNSIGNED_INT_24_8_WEBGL = 34042;
      var GL_HALF_FLOAT_OES = 36193;
      var TYPE_SIZE = {};
      TYPE_SIZE[GL_BYTE] = TYPE_SIZE[GL_UNSIGNED_BYTE] = 1;
      TYPE_SIZE[GL_SHORT] = TYPE_SIZE[GL_UNSIGNED_SHORT] = TYPE_SIZE[GL_HALF_FLOAT_OES] = TYPE_SIZE[GL_UNSIGNED_SHORT_5_6_5] = TYPE_SIZE[GL_UNSIGNED_SHORT_4_4_4_4] = TYPE_SIZE[GL_UNSIGNED_SHORT_5_5_5_1] = 2;
      TYPE_SIZE[GL_INT] = TYPE_SIZE[GL_UNSIGNED_INT] = TYPE_SIZE[GL_FLOAT] = TYPE_SIZE[GL_UNSIGNED_INT_24_8_WEBGL] = 4;
      function pixelSize(type, channels) {
        if (type === GL_UNSIGNED_SHORT_5_5_5_1 || type === GL_UNSIGNED_SHORT_4_4_4_4 || type === GL_UNSIGNED_SHORT_5_6_5) {
          return 2;
        } else if (type === GL_UNSIGNED_INT_24_8_WEBGL) {
          return 4;
        } else {
          return TYPE_SIZE[type] * channels;
        }
      }
      function isPow2(v) {
        return !(v & v - 1) && !!v;
      }
      function checkTexture2D(info, mipData, limits) {
        var i;
        var w = mipData.width;
        var h = mipData.height;
        var c = mipData.channels;
        check(
          w > 0 && w <= limits.maxTextureSize && h > 0 && h <= limits.maxTextureSize,
          "invalid texture shape"
        );
        if (info.wrapS !== GL_CLAMP_TO_EDGE || info.wrapT !== GL_CLAMP_TO_EDGE) {
          check(
            isPow2(w) && isPow2(h),
            "incompatible wrap mode for texture, both width and height must be power of 2"
          );
        }
        if (mipData.mipmask === 1) {
          if (w !== 1 && h !== 1) {
            check(
              info.minFilter !== GL_NEAREST_MIPMAP_NEAREST && info.minFilter !== GL_NEAREST_MIPMAP_LINEAR && info.minFilter !== GL_LINEAR_MIPMAP_NEAREST && info.minFilter !== GL_LINEAR_MIPMAP_LINEAR,
              "min filter requires mipmap"
            );
          }
        } else {
          check(
            isPow2(w) && isPow2(h),
            "texture must be a square power of 2 to support mipmapping"
          );
          check(
            mipData.mipmask === (w << 1) - 1,
            "missing or incomplete mipmap data"
          );
        }
        if (mipData.type === GL_FLOAT) {
          if (limits.extensions.indexOf("oes_texture_float_linear") < 0) {
            check(
              info.minFilter === GL_NEAREST && info.magFilter === GL_NEAREST,
              "filter not supported, must enable oes_texture_float_linear"
            );
          }
          check(
            !info.genMipmaps,
            "mipmap generation not supported with float textures"
          );
        }
        var mipimages = mipData.images;
        for (i = 0; i < 16; ++i) {
          if (mipimages[i]) {
            var mw = w >> i;
            var mh = h >> i;
            check(mipData.mipmask & 1 << i, "missing mipmap data");
            var img = mipimages[i];
            check(
              img.width === mw && img.height === mh,
              "invalid shape for mip images"
            );
            check(
              img.format === mipData.format && img.internalformat === mipData.internalformat && img.type === mipData.type,
              "incompatible type for mip image"
            );
            if (img.compressed) {
            } else if (img.data) {
              var rowSize = Math.ceil(pixelSize(img.type, c) * mw / img.unpackAlignment) * img.unpackAlignment;
              check(
                img.data.byteLength === rowSize * mh,
                "invalid data for image, buffer size is inconsistent with image format"
              );
            } else if (img.element) {
            } else if (img.copy) {
            }
          } else if (!info.genMipmaps) {
            check((mipData.mipmask & 1 << i) === 0, "extra mipmap data");
          }
        }
        if (mipData.compressed) {
          check(
            !info.genMipmaps,
            "mipmap generation for compressed images not supported"
          );
        }
      }
      function checkTextureCube(texture, info, faces, limits) {
        var w = texture.width;
        var h = texture.height;
        var c = texture.channels;
        check(
          w > 0 && w <= limits.maxTextureSize && h > 0 && h <= limits.maxTextureSize,
          "invalid texture shape"
        );
        check(
          w === h,
          "cube map must be square"
        );
        check(
          info.wrapS === GL_CLAMP_TO_EDGE && info.wrapT === GL_CLAMP_TO_EDGE,
          "wrap mode not supported by cube map"
        );
        for (var i = 0; i < faces.length; ++i) {
          var face = faces[i];
          check(
            face.width === w && face.height === h,
            "inconsistent cube map face shape"
          );
          if (info.genMipmaps) {
            check(
              !face.compressed,
              "can not generate mipmap for compressed textures"
            );
            check(
              face.mipmask === 1,
              "can not specify mipmaps and generate mipmaps"
            );
          } else {
          }
          var mipmaps = face.images;
          for (var j = 0; j < 16; ++j) {
            var img = mipmaps[j];
            if (img) {
              var mw = w >> j;
              var mh = h >> j;
              check(face.mipmask & 1 << j, "missing mipmap data");
              check(
                img.width === mw && img.height === mh,
                "invalid shape for mip images"
              );
              check(
                img.format === texture.format && img.internalformat === texture.internalformat && img.type === texture.type,
                "incompatible type for mip image"
              );
              if (img.compressed) {
              } else if (img.data) {
                check(
                  img.data.byteLength === mw * mh * Math.max(pixelSize(img.type, c), img.unpackAlignment),
                  "invalid data for image, buffer size is inconsistent with image format"
                );
              } else if (img.element) {
              } else if (img.copy) {
              }
            }
          }
        }
      }
      var check$1 = extend(check, {
        optional: checkOptional,
        raise,
        commandRaise,
        command: checkCommand,
        parameter: checkParameter,
        commandParameter: checkParameterCommand,
        constructor: checkConstructor,
        type: checkTypeOf,
        commandType: checkCommandType,
        isTypedArray: checkIsTypedArray,
        nni: checkNonNegativeInt,
        oneOf: checkOneOf,
        shaderError: checkShaderError,
        linkError: checkLinkError,
        callSite: guessCallSite,
        saveCommandRef,
        saveDrawInfo: saveDrawCommandInfo,
        framebufferFormat: checkFramebufferFormat,
        guessCommand,
        texture2D: checkTexture2D,
        textureCube: checkTextureCube
      });
      var VARIABLE_COUNTER = 0;
      var DYN_FUNC = 0;
      var DYN_CONSTANT = 5;
      var DYN_ARRAY = 6;
      function DynamicVariable(type, data) {
        this.id = VARIABLE_COUNTER++;
        this.type = type;
        this.data = data;
      }
      function escapeStr(str) {
        return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
      }
      function splitParts(str) {
        if (str.length === 0) {
          return [];
        }
        var firstChar = str.charAt(0);
        var lastChar = str.charAt(str.length - 1);
        if (str.length > 1 && firstChar === lastChar && (firstChar === '"' || firstChar === "'")) {
          return ['"' + escapeStr(str.substr(1, str.length - 2)) + '"'];
        }
        var parts = /\[(false|true|null|\d+|'[^']*'|"[^"]*")\]/.exec(str);
        if (parts) {
          return splitParts(str.substr(0, parts.index)).concat(splitParts(parts[1])).concat(splitParts(str.substr(parts.index + parts[0].length)));
        }
        var subparts = str.split(".");
        if (subparts.length === 1) {
          return ['"' + escapeStr(str) + '"'];
        }
        var result = [];
        for (var i = 0; i < subparts.length; ++i) {
          result = result.concat(splitParts(subparts[i]));
        }
        return result;
      }
      function toAccessorString(str) {
        return "[" + splitParts(str).join("][") + "]";
      }
      function defineDynamic(type, data) {
        return new DynamicVariable(type, toAccessorString(data + ""));
      }
      function isDynamic(x) {
        return typeof x === "function" && !x._reglType || x instanceof DynamicVariable;
      }
      function unbox(x, path) {
        if (typeof x === "function") {
          return new DynamicVariable(DYN_FUNC, x);
        } else if (typeof x === "number" || typeof x === "boolean") {
          return new DynamicVariable(DYN_CONSTANT, x);
        } else if (Array.isArray(x)) {
          return new DynamicVariable(DYN_ARRAY, x.map(function(y, i) {
            return unbox(y, path + "[" + i + "]");
          }));
        } else if (x instanceof DynamicVariable) {
          return x;
        }
        check$1(false, "invalid option type in uniform " + path);
      }
      var dynamic = {
        DynamicVariable,
        define: defineDynamic,
        isDynamic,
        unbox,
        accessor: toAccessorString
      };
      var raf = {
        next: typeof requestAnimationFrame === "function" ? function(cb) {
          return requestAnimationFrame(cb);
        } : function(cb) {
          return setTimeout(cb, 16);
        },
        cancel: typeof cancelAnimationFrame === "function" ? function(raf2) {
          return cancelAnimationFrame(raf2);
        } : clearTimeout
      };
      var clock = typeof performance !== "undefined" && performance.now ? function() {
        return performance.now();
      } : function() {
        return +/* @__PURE__ */ new Date();
      };
      function createStringStore() {
        var stringIds = { "": 0 };
        var stringValues = [""];
        return {
          id: function(str) {
            var result = stringIds[str];
            if (result) {
              return result;
            }
            result = stringIds[str] = stringValues.length;
            stringValues.push(str);
            return result;
          },
          str: function(id) {
            return stringValues[id];
          }
        };
      }
      function createCanvas(element, onDone, pixelRatio) {
        var canvas = document.createElement("canvas");
        extend(canvas.style, {
          border: 0,
          margin: 0,
          padding: 0,
          top: 0,
          left: 0,
          width: "100%",
          height: "100%"
        });
        element.appendChild(canvas);
        if (element === document.body) {
          canvas.style.position = "absolute";
          extend(element.style, {
            margin: 0,
            padding: 0
          });
        }
        function resize() {
          var w = window.innerWidth;
          var h = window.innerHeight;
          if (element !== document.body) {
            var bounds = canvas.getBoundingClientRect();
            w = bounds.right - bounds.left;
            h = bounds.bottom - bounds.top;
          }
          canvas.width = pixelRatio * w;
          canvas.height = pixelRatio * h;
        }
        var resizeObserver;
        if (element !== document.body && typeof ResizeObserver === "function") {
          resizeObserver = new ResizeObserver(function() {
            setTimeout(resize);
          });
          resizeObserver.observe(element);
        } else {
          window.addEventListener("resize", resize, false);
        }
        function onDestroy() {
          if (resizeObserver) {
            resizeObserver.disconnect();
          } else {
            window.removeEventListener("resize", resize);
          }
          element.removeChild(canvas);
        }
        resize();
        return {
          canvas,
          onDestroy
        };
      }
      function createContext(canvas, contextAttributes) {
        function get(name) {
          try {
            return canvas.getContext(name, contextAttributes);
          } catch (e) {
            return null;
          }
        }
        return get("webgl") || get("experimental-webgl") || get("webgl-experimental");
      }
      function isHTMLElement(obj) {
        return typeof obj.nodeName === "string" && typeof obj.appendChild === "function" && typeof obj.getBoundingClientRect === "function";
      }
      function isWebGLContext(obj) {
        return typeof obj.drawArrays === "function" || typeof obj.drawElements === "function";
      }
      function parseExtensions(input) {
        if (typeof input === "string") {
          return input.split();
        }
        check$1(Array.isArray(input), "invalid extension array");
        return input;
      }
      function getElement(desc) {
        if (typeof desc === "string") {
          check$1(typeof document !== "undefined", "not supported outside of DOM");
          return document.querySelector(desc);
        }
        return desc;
      }
      function parseArgs(args_) {
        var args = args_ || {};
        var element, container, canvas, gl;
        var contextAttributes = {};
        var extensions = [];
        var optionalExtensions = [];
        var pixelRatio = typeof window === "undefined" ? 1 : window.devicePixelRatio;
        var profile = false;
        var onDone = function(err) {
          if (err) {
            check$1.raise(err);
          }
        };
        var onDestroy = function() {
        };
        if (typeof args === "string") {
          check$1(
            typeof document !== "undefined",
            "selector queries only supported in DOM environments"
          );
          element = document.querySelector(args);
          check$1(element, "invalid query string for element");
        } else if (typeof args === "object") {
          if (isHTMLElement(args)) {
            element = args;
          } else if (isWebGLContext(args)) {
            gl = args;
            canvas = gl.canvas;
          } else {
            check$1.constructor(args);
            if ("gl" in args) {
              gl = args.gl;
            } else if ("canvas" in args) {
              canvas = getElement(args.canvas);
            } else if ("container" in args) {
              container = getElement(args.container);
            }
            if ("attributes" in args) {
              contextAttributes = args.attributes;
              check$1.type(contextAttributes, "object", "invalid context attributes");
            }
            if ("extensions" in args) {
              extensions = parseExtensions(args.extensions);
            }
            if ("optionalExtensions" in args) {
              optionalExtensions = parseExtensions(args.optionalExtensions);
            }
            if ("onDone" in args) {
              check$1.type(
                args.onDone,
                "function",
                "invalid or missing onDone callback"
              );
              onDone = args.onDone;
            }
            if ("profile" in args) {
              profile = !!args.profile;
            }
            if ("pixelRatio" in args) {
              pixelRatio = +args.pixelRatio;
              check$1(pixelRatio > 0, "invalid pixel ratio");
            }
          }
        } else {
          check$1.raise("invalid arguments to regl");
        }
        if (element) {
          if (element.nodeName.toLowerCase() === "canvas") {
            canvas = element;
          } else {
            container = element;
          }
        }
        if (!gl) {
          if (!canvas) {
            check$1(
              typeof document !== "undefined",
              "must manually specify webgl context outside of DOM environments"
            );
            var result = createCanvas(container || document.body, onDone, pixelRatio);
            if (!result) {
              return null;
            }
            canvas = result.canvas;
            onDestroy = result.onDestroy;
          }
          if (contextAttributes.premultipliedAlpha === void 0) contextAttributes.premultipliedAlpha = true;
          gl = createContext(canvas, contextAttributes);
        }
        if (!gl) {
          onDestroy();
          onDone("webgl not supported, try upgrading your browser or graphics drivers http://get.webgl.org");
          return null;
        }
        return {
          gl,
          canvas,
          container,
          extensions,
          optionalExtensions,
          pixelRatio,
          profile,
          onDone,
          onDestroy
        };
      }
      function createExtensionCache(gl, config) {
        var extensions = {};
        function tryLoadExtension(name_) {
          check$1.type(name_, "string", "extension name must be string");
          var name2 = name_.toLowerCase();
          var ext;
          try {
            ext = extensions[name2] = gl.getExtension(name2);
          } catch (e) {
          }
          return !!ext;
        }
        for (var i = 0; i < config.extensions.length; ++i) {
          var name = config.extensions[i];
          if (!tryLoadExtension(name)) {
            config.onDestroy();
            config.onDone('"' + name + '" extension is not supported by the current WebGL context, try upgrading your system or a different browser');
            return null;
          }
        }
        config.optionalExtensions.forEach(tryLoadExtension);
        return {
          extensions,
          restore: function() {
            Object.keys(extensions).forEach(function(name2) {
              if (extensions[name2] && !tryLoadExtension(name2)) {
                throw new Error("(regl): error restoring extension " + name2);
              }
            });
          }
        };
      }
      function loop(n, f) {
        var result = Array(n);
        for (var i = 0; i < n; ++i) {
          result[i] = f(i);
        }
        return result;
      }
      var GL_BYTE$1 = 5120;
      var GL_UNSIGNED_BYTE$2 = 5121;
      var GL_SHORT$1 = 5122;
      var GL_UNSIGNED_SHORT$1 = 5123;
      var GL_INT$1 = 5124;
      var GL_UNSIGNED_INT$1 = 5125;
      var GL_FLOAT$2 = 5126;
      function nextPow16(v) {
        for (var i = 16; i <= 1 << 28; i *= 16) {
          if (v <= i) {
            return i;
          }
        }
        return 0;
      }
      function log2(v) {
        var r, shift;
        r = (v > 65535) << 4;
        v >>>= r;
        shift = (v > 255) << 3;
        v >>>= shift;
        r |= shift;
        shift = (v > 15) << 2;
        v >>>= shift;
        r |= shift;
        shift = (v > 3) << 1;
        v >>>= shift;
        r |= shift;
        return r | v >> 1;
      }
      function createPool() {
        var bufferPool = loop(8, function() {
          return [];
        });
        function alloc(n) {
          var sz = nextPow16(n);
          var bin = bufferPool[log2(sz) >> 2];
          if (bin.length > 0) {
            return bin.pop();
          }
          return new ArrayBuffer(sz);
        }
        function free(buf) {
          bufferPool[log2(buf.byteLength) >> 2].push(buf);
        }
        function allocType(type, n) {
          var result = null;
          switch (type) {
            case GL_BYTE$1:
              result = new Int8Array(alloc(n), 0, n);
              break;
            case GL_UNSIGNED_BYTE$2:
              result = new Uint8Array(alloc(n), 0, n);
              break;
            case GL_SHORT$1:
              result = new Int16Array(alloc(2 * n), 0, n);
              break;
            case GL_UNSIGNED_SHORT$1:
              result = new Uint16Array(alloc(2 * n), 0, n);
              break;
            case GL_INT$1:
              result = new Int32Array(alloc(4 * n), 0, n);
              break;
            case GL_UNSIGNED_INT$1:
              result = new Uint32Array(alloc(4 * n), 0, n);
              break;
            case GL_FLOAT$2:
              result = new Float32Array(alloc(4 * n), 0, n);
              break;
            default:
              return null;
          }
          if (result.length !== n) {
            return result.subarray(0, n);
          }
          return result;
        }
        function freeType(array) {
          free(array.buffer);
        }
        return {
          alloc,
          free,
          allocType,
          freeType
        };
      }
      var pool = createPool();
      pool.zero = createPool();
      var GL_SUBPIXEL_BITS = 3408;
      var GL_RED_BITS = 3410;
      var GL_GREEN_BITS = 3411;
      var GL_BLUE_BITS = 3412;
      var GL_ALPHA_BITS = 3413;
      var GL_DEPTH_BITS = 3414;
      var GL_STENCIL_BITS = 3415;
      var GL_ALIASED_POINT_SIZE_RANGE = 33901;
      var GL_ALIASED_LINE_WIDTH_RANGE = 33902;
      var GL_MAX_TEXTURE_SIZE = 3379;
      var GL_MAX_VIEWPORT_DIMS = 3386;
      var GL_MAX_VERTEX_ATTRIBS = 34921;
      var GL_MAX_VERTEX_UNIFORM_VECTORS = 36347;
      var GL_MAX_VARYING_VECTORS = 36348;
      var GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS = 35661;
      var GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS = 35660;
      var GL_MAX_TEXTURE_IMAGE_UNITS = 34930;
      var GL_MAX_FRAGMENT_UNIFORM_VECTORS = 36349;
      var GL_MAX_CUBE_MAP_TEXTURE_SIZE = 34076;
      var GL_MAX_RENDERBUFFER_SIZE = 34024;
      var GL_VENDOR = 7936;
      var GL_RENDERER = 7937;
      var GL_VERSION = 7938;
      var GL_SHADING_LANGUAGE_VERSION = 35724;
      var GL_MAX_TEXTURE_MAX_ANISOTROPY_EXT = 34047;
      var GL_MAX_COLOR_ATTACHMENTS_WEBGL = 36063;
      var GL_MAX_DRAW_BUFFERS_WEBGL = 34852;
      var GL_TEXTURE_2D = 3553;
      var GL_TEXTURE_CUBE_MAP = 34067;
      var GL_TEXTURE_CUBE_MAP_POSITIVE_X = 34069;
      var GL_TEXTURE0 = 33984;
      var GL_RGBA = 6408;
      var GL_FLOAT$1 = 5126;
      var GL_UNSIGNED_BYTE$1 = 5121;
      var GL_FRAMEBUFFER = 36160;
      var GL_FRAMEBUFFER_COMPLETE = 36053;
      var GL_COLOR_ATTACHMENT0 = 36064;
      var GL_COLOR_BUFFER_BIT$1 = 16384;
      var wrapLimits = function(gl, extensions) {
        var maxAnisotropic = 1;
        if (extensions.ext_texture_filter_anisotropic) {
          maxAnisotropic = gl.getParameter(GL_MAX_TEXTURE_MAX_ANISOTROPY_EXT);
        }
        var maxDrawbuffers = 1;
        var maxColorAttachments = 1;
        if (extensions.webgl_draw_buffers) {
          maxDrawbuffers = gl.getParameter(GL_MAX_DRAW_BUFFERS_WEBGL);
          maxColorAttachments = gl.getParameter(GL_MAX_COLOR_ATTACHMENTS_WEBGL);
        }
        var readFloat = !!extensions.oes_texture_float;
        if (readFloat) {
          var readFloatTexture = gl.createTexture();
          gl.bindTexture(GL_TEXTURE_2D, readFloatTexture);
          gl.texImage2D(GL_TEXTURE_2D, 0, GL_RGBA, 1, 1, 0, GL_RGBA, GL_FLOAT$1, null);
          var fbo = gl.createFramebuffer();
          gl.bindFramebuffer(GL_FRAMEBUFFER, fbo);
          gl.framebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, readFloatTexture, 0);
          gl.bindTexture(GL_TEXTURE_2D, null);
          if (gl.checkFramebufferStatus(GL_FRAMEBUFFER) !== GL_FRAMEBUFFER_COMPLETE) readFloat = false;
          else {
            gl.viewport(0, 0, 1, 1);
            gl.clearColor(1, 0, 0, 1);
            gl.clear(GL_COLOR_BUFFER_BIT$1);
            var pixels = pool.allocType(GL_FLOAT$1, 4);
            gl.readPixels(0, 0, 1, 1, GL_RGBA, GL_FLOAT$1, pixels);
            if (gl.getError()) readFloat = false;
            else {
              gl.deleteFramebuffer(fbo);
              gl.deleteTexture(readFloatTexture);
              readFloat = pixels[0] === 1;
            }
            pool.freeType(pixels);
          }
        }
        var isIE = typeof navigator !== "undefined" && (/MSIE/.test(navigator.userAgent) || /Trident\//.test(navigator.appVersion) || /Edge/.test(navigator.userAgent));
        var npotTextureCube = true;
        if (!isIE) {
          var cubeTexture = gl.createTexture();
          var data = pool.allocType(GL_UNSIGNED_BYTE$1, 36);
          gl.activeTexture(GL_TEXTURE0);
          gl.bindTexture(GL_TEXTURE_CUBE_MAP, cubeTexture);
          gl.texImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X, 0, GL_RGBA, 3, 3, 0, GL_RGBA, GL_UNSIGNED_BYTE$1, data);
          pool.freeType(data);
          gl.bindTexture(GL_TEXTURE_CUBE_MAP, null);
          gl.deleteTexture(cubeTexture);
          npotTextureCube = !gl.getError();
        }
        return {
          // drawing buffer bit depth
          colorBits: [
            gl.getParameter(GL_RED_BITS),
            gl.getParameter(GL_GREEN_BITS),
            gl.getParameter(GL_BLUE_BITS),
            gl.getParameter(GL_ALPHA_BITS)
          ],
          depthBits: gl.getParameter(GL_DEPTH_BITS),
          stencilBits: gl.getParameter(GL_STENCIL_BITS),
          subpixelBits: gl.getParameter(GL_SUBPIXEL_BITS),
          // supported extensions
          extensions: Object.keys(extensions).filter(function(ext) {
            return !!extensions[ext];
          }),
          // max aniso samples
          maxAnisotropic,
          // max draw buffers
          maxDrawbuffers,
          maxColorAttachments,
          // point and line size ranges
          pointSizeDims: gl.getParameter(GL_ALIASED_POINT_SIZE_RANGE),
          lineWidthDims: gl.getParameter(GL_ALIASED_LINE_WIDTH_RANGE),
          maxViewportDims: gl.getParameter(GL_MAX_VIEWPORT_DIMS),
          maxCombinedTextureUnits: gl.getParameter(GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS),
          maxCubeMapSize: gl.getParameter(GL_MAX_CUBE_MAP_TEXTURE_SIZE),
          maxRenderbufferSize: gl.getParameter(GL_MAX_RENDERBUFFER_SIZE),
          maxTextureUnits: gl.getParameter(GL_MAX_TEXTURE_IMAGE_UNITS),
          maxTextureSize: gl.getParameter(GL_MAX_TEXTURE_SIZE),
          maxAttributes: gl.getParameter(GL_MAX_VERTEX_ATTRIBS),
          maxVertexUniforms: gl.getParameter(GL_MAX_VERTEX_UNIFORM_VECTORS),
          maxVertexTextureUnits: gl.getParameter(GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS),
          maxVaryingVectors: gl.getParameter(GL_MAX_VARYING_VECTORS),
          maxFragmentUniforms: gl.getParameter(GL_MAX_FRAGMENT_UNIFORM_VECTORS),
          // vendor info
          glsl: gl.getParameter(GL_SHADING_LANGUAGE_VERSION),
          renderer: gl.getParameter(GL_RENDERER),
          vendor: gl.getParameter(GL_VENDOR),
          version: gl.getParameter(GL_VERSION),
          // quirks
          readFloat,
          npotTextureCube
        };
      };
      function isNDArrayLike(obj) {
        return !!obj && typeof obj === "object" && Array.isArray(obj.shape) && Array.isArray(obj.stride) && typeof obj.offset === "number" && obj.shape.length === obj.stride.length && (Array.isArray(obj.data) || isTypedArray(obj.data));
      }
      var values = function(obj) {
        return Object.keys(obj).map(function(key) {
          return obj[key];
        });
      };
      var flattenUtils = {
        shape: arrayShape$1,
        flatten: flattenArray
      };
      function flatten1D(array, nx, out) {
        for (var i = 0; i < nx; ++i) {
          out[i] = array[i];
        }
      }
      function flatten2D(array, nx, ny, out) {
        var ptr = 0;
        for (var i = 0; i < nx; ++i) {
          var row = array[i];
          for (var j = 0; j < ny; ++j) {
            out[ptr++] = row[j];
          }
        }
      }
      function flatten3D(array, nx, ny, nz, out, ptr_) {
        var ptr = ptr_;
        for (var i = 0; i < nx; ++i) {
          var row = array[i];
          for (var j = 0; j < ny; ++j) {
            var col = row[j];
            for (var k = 0; k < nz; ++k) {
              out[ptr++] = col[k];
            }
          }
        }
      }
      function flattenRec(array, shape, level, out, ptr) {
        var stride = 1;
        for (var i = level + 1; i < shape.length; ++i) {
          stride *= shape[i];
        }
        var n = shape[level];
        if (shape.length - level === 4) {
          var nx = shape[level + 1];
          var ny = shape[level + 2];
          var nz = shape[level + 3];
          for (i = 0; i < n; ++i) {
            flatten3D(array[i], nx, ny, nz, out, ptr);
            ptr += stride;
          }
        } else {
          for (i = 0; i < n; ++i) {
            flattenRec(array[i], shape, level + 1, out, ptr);
            ptr += stride;
          }
        }
      }
      function flattenArray(array, shape, type, out_) {
        var sz = 1;
        if (shape.length) {
          for (var i = 0; i < shape.length; ++i) {
            sz *= shape[i];
          }
        } else {
          sz = 0;
        }
        var out = out_ || pool.allocType(type, sz);
        switch (shape.length) {
          case 0:
            break;
          case 1:
            flatten1D(array, shape[0], out);
            break;
          case 2:
            flatten2D(array, shape[0], shape[1], out);
            break;
          case 3:
            flatten3D(array, shape[0], shape[1], shape[2], out, 0);
            break;
          default:
            flattenRec(array, shape, 0, out, 0);
        }
        return out;
      }
      function arrayShape$1(array_) {
        var shape = [];
        for (var array = array_; array.length; array = array[0]) {
          shape.push(array.length);
        }
        return shape;
      }
      var arrayTypes = {
        "[object Int8Array]": 5120,
        "[object Int16Array]": 5122,
        "[object Int32Array]": 5124,
        "[object Uint8Array]": 5121,
        "[object Uint8ClampedArray]": 5121,
        "[object Uint16Array]": 5123,
        "[object Uint32Array]": 5125,
        "[object Float32Array]": 5126,
        "[object Float64Array]": 5121,
        "[object ArrayBuffer]": 5121
      };
      var int8 = 5120;
      var int16 = 5122;
      var int32 = 5124;
      var uint8 = 5121;
      var uint16 = 5123;
      var uint32 = 5125;
      var float = 5126;
      var float32 = 5126;
      var glTypes = {
        int8,
        int16,
        int32,
        uint8,
        uint16,
        uint32,
        float,
        float32
      };
      var dynamic$1 = 35048;
      var stream = 35040;
      var usageTypes = {
        dynamic: dynamic$1,
        stream,
        "static": 35044
      };
      var arrayFlatten = flattenUtils.flatten;
      var arrayShape = flattenUtils.shape;
      var GL_STATIC_DRAW = 35044;
      var GL_STREAM_DRAW = 35040;
      var GL_UNSIGNED_BYTE$3 = 5121;
      var GL_FLOAT$3 = 5126;
      var DTYPES_SIZES = [];
      DTYPES_SIZES[5120] = 1;
      DTYPES_SIZES[5122] = 2;
      DTYPES_SIZES[5124] = 4;
      DTYPES_SIZES[5121] = 1;
      DTYPES_SIZES[5123] = 2;
      DTYPES_SIZES[5125] = 4;
      DTYPES_SIZES[5126] = 4;
      function typedArrayCode(data) {
        return arrayTypes[Object.prototype.toString.call(data)] | 0;
      }
      function copyArray(out, inp) {
        for (var i = 0; i < inp.length; ++i) {
          out[i] = inp[i];
        }
      }
      function transpose(result, data, shapeX, shapeY, strideX, strideY, offset) {
        var ptr = 0;
        for (var i = 0; i < shapeX; ++i) {
          for (var j = 0; j < shapeY; ++j) {
            result[ptr++] = data[strideX * i + strideY * j + offset];
          }
        }
      }
      function wrapBufferState(gl, stats2, config, destroyBuffer) {
        var bufferCount = 0;
        var bufferSet = {};
        function REGLBuffer(type) {
          this.id = bufferCount++;
          this.buffer = gl.createBuffer();
          this.type = type;
          this.usage = GL_STATIC_DRAW;
          this.byteLength = 0;
          this.dimension = 1;
          this.dtype = GL_UNSIGNED_BYTE$3;
          this.persistentData = null;
          if (config.profile) {
            this.stats = { size: 0 };
          }
        }
        REGLBuffer.prototype.bind = function() {
          gl.bindBuffer(this.type, this.buffer);
        };
        REGLBuffer.prototype.destroy = function() {
          destroy(this);
        };
        var streamPool = [];
        function createStream(type, data) {
          var buffer = streamPool.pop();
          if (!buffer) {
            buffer = new REGLBuffer(type);
          }
          buffer.bind();
          initBufferFromData(buffer, data, GL_STREAM_DRAW, 0, 1, false);
          return buffer;
        }
        function destroyStream(stream$$1) {
          streamPool.push(stream$$1);
        }
        function initBufferFromTypedArray(buffer, data, usage) {
          buffer.byteLength = data.byteLength;
          gl.bufferData(buffer.type, data, usage);
        }
        function initBufferFromData(buffer, data, usage, dtype, dimension, persist) {
          var shape;
          buffer.usage = usage;
          if (Array.isArray(data)) {
            buffer.dtype = dtype || GL_FLOAT$3;
            if (data.length > 0) {
              var flatData;
              if (Array.isArray(data[0])) {
                shape = arrayShape(data);
                var dim = 1;
                for (var i = 1; i < shape.length; ++i) {
                  dim *= shape[i];
                }
                buffer.dimension = dim;
                flatData = arrayFlatten(data, shape, buffer.dtype);
                initBufferFromTypedArray(buffer, flatData, usage);
                if (persist) {
                  buffer.persistentData = flatData;
                } else {
                  pool.freeType(flatData);
                }
              } else if (typeof data[0] === "number") {
                buffer.dimension = dimension;
                var typedData = pool.allocType(buffer.dtype, data.length);
                copyArray(typedData, data);
                initBufferFromTypedArray(buffer, typedData, usage);
                if (persist) {
                  buffer.persistentData = typedData;
                } else {
                  pool.freeType(typedData);
                }
              } else if (isTypedArray(data[0])) {
                buffer.dimension = data[0].length;
                buffer.dtype = dtype || typedArrayCode(data[0]) || GL_FLOAT$3;
                flatData = arrayFlatten(
                  data,
                  [data.length, data[0].length],
                  buffer.dtype
                );
                initBufferFromTypedArray(buffer, flatData, usage);
                if (persist) {
                  buffer.persistentData = flatData;
                } else {
                  pool.freeType(flatData);
                }
              } else {
                check$1.raise("invalid buffer data");
              }
            }
          } else if (isTypedArray(data)) {
            buffer.dtype = dtype || typedArrayCode(data);
            buffer.dimension = dimension;
            initBufferFromTypedArray(buffer, data, usage);
            if (persist) {
              buffer.persistentData = new Uint8Array(new Uint8Array(data.buffer));
            }
          } else if (isNDArrayLike(data)) {
            shape = data.shape;
            var stride = data.stride;
            var offset = data.offset;
            var shapeX = 0;
            var shapeY = 0;
            var strideX = 0;
            var strideY = 0;
            if (shape.length === 1) {
              shapeX = shape[0];
              shapeY = 1;
              strideX = stride[0];
              strideY = 0;
            } else if (shape.length === 2) {
              shapeX = shape[0];
              shapeY = shape[1];
              strideX = stride[0];
              strideY = stride[1];
            } else {
              check$1.raise("invalid shape");
            }
            buffer.dtype = dtype || typedArrayCode(data.data) || GL_FLOAT$3;
            buffer.dimension = shapeY;
            var transposeData2 = pool.allocType(buffer.dtype, shapeX * shapeY);
            transpose(
              transposeData2,
              data.data,
              shapeX,
              shapeY,
              strideX,
              strideY,
              offset
            );
            initBufferFromTypedArray(buffer, transposeData2, usage);
            if (persist) {
              buffer.persistentData = transposeData2;
            } else {
              pool.freeType(transposeData2);
            }
          } else if (data instanceof ArrayBuffer) {
            buffer.dtype = GL_UNSIGNED_BYTE$3;
            buffer.dimension = dimension;
            initBufferFromTypedArray(buffer, data, usage);
            if (persist) {
              buffer.persistentData = new Uint8Array(new Uint8Array(data));
            }
          } else {
            check$1.raise("invalid buffer data");
          }
        }
        function destroy(buffer) {
          stats2.bufferCount--;
          destroyBuffer(buffer);
          var handle = buffer.buffer;
          check$1(handle, "buffer must not be deleted already");
          gl.deleteBuffer(handle);
          buffer.buffer = null;
          delete bufferSet[buffer.id];
        }
        function createBuffer(options, type, deferInit, persistent) {
          stats2.bufferCount++;
          var buffer = new REGLBuffer(type);
          bufferSet[buffer.id] = buffer;
          function reglBuffer(options2) {
            var usage = GL_STATIC_DRAW;
            var data = null;
            var byteLength = 0;
            var dtype = 0;
            var dimension = 1;
            if (Array.isArray(options2) || isTypedArray(options2) || isNDArrayLike(options2) || options2 instanceof ArrayBuffer) {
              data = options2;
            } else if (typeof options2 === "number") {
              byteLength = options2 | 0;
            } else if (options2) {
              check$1.type(
                options2,
                "object",
                "buffer arguments must be an object, a number or an array"
              );
              if ("data" in options2) {
                check$1(
                  data === null || Array.isArray(data) || isTypedArray(data) || isNDArrayLike(data),
                  "invalid data for buffer"
                );
                data = options2.data;
              }
              if ("usage" in options2) {
                check$1.parameter(options2.usage, usageTypes, "invalid buffer usage");
                usage = usageTypes[options2.usage];
              }
              if ("type" in options2) {
                check$1.parameter(options2.type, glTypes, "invalid buffer type");
                dtype = glTypes[options2.type];
              }
              if ("dimension" in options2) {
                check$1.type(options2.dimension, "number", "invalid dimension");
                dimension = options2.dimension | 0;
              }
              if ("length" in options2) {
                check$1.nni(byteLength, "buffer length must be a nonnegative integer");
                byteLength = options2.length | 0;
              }
            }
            buffer.bind();
            if (!data) {
              if (byteLength) gl.bufferData(buffer.type, byteLength, usage);
              buffer.dtype = dtype || GL_UNSIGNED_BYTE$3;
              buffer.usage = usage;
              buffer.dimension = dimension;
              buffer.byteLength = byteLength;
            } else {
              initBufferFromData(buffer, data, usage, dtype, dimension, persistent);
            }
            if (config.profile) {
              buffer.stats.size = buffer.byteLength * DTYPES_SIZES[buffer.dtype];
            }
            return reglBuffer;
          }
          function setSubData(data, offset) {
            check$1(
              offset + data.byteLength <= buffer.byteLength,
              "invalid buffer subdata call, buffer is too small.  Can't write data of size " + data.byteLength + " starting from offset " + offset + " to a buffer of size " + buffer.byteLength
            );
            gl.bufferSubData(buffer.type, offset, data);
          }
          function subdata(data, offset_) {
            var offset = (offset_ || 0) | 0;
            var shape;
            buffer.bind();
            if (isTypedArray(data) || data instanceof ArrayBuffer) {
              setSubData(data, offset);
            } else if (Array.isArray(data)) {
              if (data.length > 0) {
                if (typeof data[0] === "number") {
                  var converted = pool.allocType(buffer.dtype, data.length);
                  copyArray(converted, data);
                  setSubData(converted, offset);
                  pool.freeType(converted);
                } else if (Array.isArray(data[0]) || isTypedArray(data[0])) {
                  shape = arrayShape(data);
                  var flatData = arrayFlatten(data, shape, buffer.dtype);
                  setSubData(flatData, offset);
                  pool.freeType(flatData);
                } else {
                  check$1.raise("invalid buffer data");
                }
              }
            } else if (isNDArrayLike(data)) {
              shape = data.shape;
              var stride = data.stride;
              var shapeX = 0;
              var shapeY = 0;
              var strideX = 0;
              var strideY = 0;
              if (shape.length === 1) {
                shapeX = shape[0];
                shapeY = 1;
                strideX = stride[0];
                strideY = 0;
              } else if (shape.length === 2) {
                shapeX = shape[0];
                shapeY = shape[1];
                strideX = stride[0];
                strideY = stride[1];
              } else {
                check$1.raise("invalid shape");
              }
              var dtype = Array.isArray(data.data) ? buffer.dtype : typedArrayCode(data.data);
              var transposeData2 = pool.allocType(dtype, shapeX * shapeY);
              transpose(
                transposeData2,
                data.data,
                shapeX,
                shapeY,
                strideX,
                strideY,
                data.offset
              );
              setSubData(transposeData2, offset);
              pool.freeType(transposeData2);
            } else {
              check$1.raise("invalid data for buffer subdata");
            }
            return reglBuffer;
          }
          if (!deferInit) {
            reglBuffer(options);
          }
          reglBuffer._reglType = "buffer";
          reglBuffer._buffer = buffer;
          reglBuffer.subdata = subdata;
          if (config.profile) {
            reglBuffer.stats = buffer.stats;
          }
          reglBuffer.destroy = function() {
            destroy(buffer);
          };
          return reglBuffer;
        }
        function restoreBuffers() {
          values(bufferSet).forEach(function(buffer) {
            buffer.buffer = gl.createBuffer();
            gl.bindBuffer(buffer.type, buffer.buffer);
            gl.bufferData(
              buffer.type,
              buffer.persistentData || buffer.byteLength,
              buffer.usage
            );
          });
        }
        if (config.profile) {
          stats2.getTotalBufferSize = function() {
            var total = 0;
            Object.keys(bufferSet).forEach(function(key) {
              total += bufferSet[key].stats.size;
            });
            return total;
          };
        }
        return {
          create: createBuffer,
          createStream,
          destroyStream,
          clear: function() {
            values(bufferSet).forEach(destroy);
            streamPool.forEach(destroy);
          },
          getBuffer: function(wrapper) {
            if (wrapper && wrapper._buffer instanceof REGLBuffer) {
              return wrapper._buffer;
            }
            return null;
          },
          restore: restoreBuffers,
          _initBuffer: initBufferFromData
        };
      }
      var points = 0;
      var point = 0;
      var lines = 1;
      var line = 1;
      var triangles = 4;
      var triangle = 4;
      var primTypes = {
        points,
        point,
        lines,
        line,
        triangles,
        triangle,
        "line loop": 2,
        "line strip": 3,
        "triangle strip": 5,
        "triangle fan": 6
      };
      var GL_POINTS = 0;
      var GL_LINES = 1;
      var GL_TRIANGLES = 4;
      var GL_BYTE$2 = 5120;
      var GL_UNSIGNED_BYTE$4 = 5121;
      var GL_SHORT$2 = 5122;
      var GL_UNSIGNED_SHORT$2 = 5123;
      var GL_INT$2 = 5124;
      var GL_UNSIGNED_INT$2 = 5125;
      var GL_ELEMENT_ARRAY_BUFFER = 34963;
      var GL_STREAM_DRAW$1 = 35040;
      var GL_STATIC_DRAW$1 = 35044;
      function wrapElementsState(gl, extensions, bufferState, stats2) {
        var elementSet = {};
        var elementCount = 0;
        var elementTypes = {
          "uint8": GL_UNSIGNED_BYTE$4,
          "uint16": GL_UNSIGNED_SHORT$2
        };
        if (extensions.oes_element_index_uint) {
          elementTypes.uint32 = GL_UNSIGNED_INT$2;
        }
        function REGLElementBuffer(buffer) {
          this.id = elementCount++;
          elementSet[this.id] = this;
          this.buffer = buffer;
          this.primType = GL_TRIANGLES;
          this.vertCount = 0;
          this.type = 0;
        }
        REGLElementBuffer.prototype.bind = function() {
          this.buffer.bind();
        };
        var bufferPool = [];
        function createElementStream(data) {
          var result = bufferPool.pop();
          if (!result) {
            result = new REGLElementBuffer(bufferState.create(
              null,
              GL_ELEMENT_ARRAY_BUFFER,
              true,
              false
            )._buffer);
          }
          initElements(result, data, GL_STREAM_DRAW$1, -1, -1, 0, 0);
          return result;
        }
        function destroyElementStream(elements) {
          bufferPool.push(elements);
        }
        function initElements(elements, data, usage, prim, count, byteLength, type) {
          elements.buffer.bind();
          var dtype;
          if (data) {
            var predictedType = type;
            if (!type && (!isTypedArray(data) || isNDArrayLike(data) && !isTypedArray(data.data))) {
              predictedType = extensions.oes_element_index_uint ? GL_UNSIGNED_INT$2 : GL_UNSIGNED_SHORT$2;
            }
            bufferState._initBuffer(
              elements.buffer,
              data,
              usage,
              predictedType,
              3
            );
          } else {
            gl.bufferData(GL_ELEMENT_ARRAY_BUFFER, byteLength, usage);
            elements.buffer.dtype = dtype || GL_UNSIGNED_BYTE$4;
            elements.buffer.usage = usage;
            elements.buffer.dimension = 3;
            elements.buffer.byteLength = byteLength;
          }
          dtype = type;
          if (!type) {
            switch (elements.buffer.dtype) {
              case GL_UNSIGNED_BYTE$4:
              case GL_BYTE$2:
                dtype = GL_UNSIGNED_BYTE$4;
                break;
              case GL_UNSIGNED_SHORT$2:
              case GL_SHORT$2:
                dtype = GL_UNSIGNED_SHORT$2;
                break;
              case GL_UNSIGNED_INT$2:
              case GL_INT$2:
                dtype = GL_UNSIGNED_INT$2;
                break;
              default:
                check$1.raise("unsupported type for element array");
            }
            elements.buffer.dtype = dtype;
          }
          elements.type = dtype;
          check$1(
            dtype !== GL_UNSIGNED_INT$2 || !!extensions.oes_element_index_uint,
            "32 bit element buffers not supported, enable oes_element_index_uint first"
          );
          var vertCount = count;
          if (vertCount < 0) {
            vertCount = elements.buffer.byteLength;
            if (dtype === GL_UNSIGNED_SHORT$2) {
              vertCount >>= 1;
            } else if (dtype === GL_UNSIGNED_INT$2) {
              vertCount >>= 2;
            }
          }
          elements.vertCount = vertCount;
          var primType = prim;
          if (prim < 0) {
            primType = GL_TRIANGLES;
            var dimension = elements.buffer.dimension;
            if (dimension === 1) primType = GL_POINTS;
            if (dimension === 2) primType = GL_LINES;
            if (dimension === 3) primType = GL_TRIANGLES;
          }
          elements.primType = primType;
        }
        function destroyElements(elements) {
          stats2.elementsCount--;
          check$1(elements.buffer !== null, "must not double destroy elements");
          delete elementSet[elements.id];
          elements.buffer.destroy();
          elements.buffer = null;
        }
        function createElements(options, persistent) {
          var buffer = bufferState.create(null, GL_ELEMENT_ARRAY_BUFFER, true);
          var elements = new REGLElementBuffer(buffer._buffer);
          stats2.elementsCount++;
          function reglElements(options2) {
            if (!options2) {
              buffer();
              elements.primType = GL_TRIANGLES;
              elements.vertCount = 0;
              elements.type = GL_UNSIGNED_BYTE$4;
            } else if (typeof options2 === "number") {
              buffer(options2);
              elements.primType = GL_TRIANGLES;
              elements.vertCount = options2 | 0;
              elements.type = GL_UNSIGNED_BYTE$4;
            } else {
              var data = null;
              var usage = GL_STATIC_DRAW$1;
              var primType = -1;
              var vertCount = -1;
              var byteLength = 0;
              var dtype = 0;
              if (Array.isArray(options2) || isTypedArray(options2) || isNDArrayLike(options2)) {
                data = options2;
              } else {
                check$1.type(options2, "object", "invalid arguments for elements");
                if ("data" in options2) {
                  data = options2.data;
                  check$1(
                    Array.isArray(data) || isTypedArray(data) || isNDArrayLike(data),
                    "invalid data for element buffer"
                  );
                }
                if ("usage" in options2) {
                  check$1.parameter(
                    options2.usage,
                    usageTypes,
                    "invalid element buffer usage"
                  );
                  usage = usageTypes[options2.usage];
                }
                if ("primitive" in options2) {
                  check$1.parameter(
                    options2.primitive,
                    primTypes,
                    "invalid element buffer primitive"
                  );
                  primType = primTypes[options2.primitive];
                }
                if ("count" in options2) {
                  check$1(
                    typeof options2.count === "number" && options2.count >= 0,
                    "invalid vertex count for elements"
                  );
                  vertCount = options2.count | 0;
                }
                if ("type" in options2) {
                  check$1.parameter(
                    options2.type,
                    elementTypes,
                    "invalid buffer type"
                  );
                  dtype = elementTypes[options2.type];
                }
                if ("length" in options2) {
                  byteLength = options2.length | 0;
                } else {
                  byteLength = vertCount;
                  if (dtype === GL_UNSIGNED_SHORT$2 || dtype === GL_SHORT$2) {
                    byteLength *= 2;
                  } else if (dtype === GL_UNSIGNED_INT$2 || dtype === GL_INT$2) {
                    byteLength *= 4;
                  }
                }
              }
              initElements(
                elements,
                data,
                usage,
                primType,
                vertCount,
                byteLength,
                dtype
              );
            }
            return reglElements;
          }
          reglElements(options);
          reglElements._reglType = "elements";
          reglElements._elements = elements;
          reglElements.subdata = function(data, offset) {
            buffer.subdata(data, offset);
            return reglElements;
          };
          reglElements.destroy = function() {
            destroyElements(elements);
          };
          return reglElements;
        }
        return {
          create: createElements,
          createStream: createElementStream,
          destroyStream: destroyElementStream,
          getElements: function(elements) {
            if (typeof elements === "function" && elements._elements instanceof REGLElementBuffer) {
              return elements._elements;
            }
            return null;
          },
          clear: function() {
            values(elementSet).forEach(destroyElements);
          }
        };
      }
      var FLOAT = new Float32Array(1);
      var INT = new Uint32Array(FLOAT.buffer);
      var GL_UNSIGNED_SHORT$4 = 5123;
      function convertToHalfFloat(array) {
        var ushorts = pool.allocType(GL_UNSIGNED_SHORT$4, array.length);
        for (var i = 0; i < array.length; ++i) {
          if (isNaN(array[i])) {
            ushorts[i] = 65535;
          } else if (array[i] === Infinity) {
            ushorts[i] = 31744;
          } else if (array[i] === -Infinity) {
            ushorts[i] = 64512;
          } else {
            FLOAT[0] = array[i];
            var x = INT[0];
            var sgn = x >>> 31 << 15;
            var exp = (x << 1 >>> 24) - 127;
            var frac = x >> 13 & (1 << 10) - 1;
            if (exp < -24) {
              ushorts[i] = sgn;
            } else if (exp < -14) {
              var s = -14 - exp;
              ushorts[i] = sgn + (frac + (1 << 10) >> s);
            } else if (exp > 15) {
              ushorts[i] = sgn + 31744;
            } else {
              ushorts[i] = sgn + (exp + 15 << 10) + frac;
            }
          }
        }
        return ushorts;
      }
      function isArrayLike(s) {
        return Array.isArray(s) || isTypedArray(s);
      }
      var isPow2$1 = function(v) {
        return !(v & v - 1) && !!v;
      };
      var GL_COMPRESSED_TEXTURE_FORMATS = 34467;
      var GL_TEXTURE_2D$1 = 3553;
      var GL_TEXTURE_CUBE_MAP$1 = 34067;
      var GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 = 34069;
      var GL_RGBA$1 = 6408;
      var GL_ALPHA = 6406;
      var GL_RGB = 6407;
      var GL_LUMINANCE = 6409;
      var GL_LUMINANCE_ALPHA = 6410;
      var GL_RGBA4 = 32854;
      var GL_RGB5_A1 = 32855;
      var GL_RGB565 = 36194;
      var GL_UNSIGNED_SHORT_4_4_4_4$1 = 32819;
      var GL_UNSIGNED_SHORT_5_5_5_1$1 = 32820;
      var GL_UNSIGNED_SHORT_5_6_5$1 = 33635;
      var GL_UNSIGNED_INT_24_8_WEBGL$1 = 34042;
      var GL_DEPTH_COMPONENT = 6402;
      var GL_DEPTH_STENCIL = 34041;
      var GL_SRGB_EXT = 35904;
      var GL_SRGB_ALPHA_EXT = 35906;
      var GL_HALF_FLOAT_OES$1 = 36193;
      var GL_COMPRESSED_RGB_S3TC_DXT1_EXT = 33776;
      var GL_COMPRESSED_RGBA_S3TC_DXT1_EXT = 33777;
      var GL_COMPRESSED_RGBA_S3TC_DXT3_EXT = 33778;
      var GL_COMPRESSED_RGBA_S3TC_DXT5_EXT = 33779;
      var GL_COMPRESSED_RGB_ATC_WEBGL = 35986;
      var GL_COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL = 35987;
      var GL_COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL = 34798;
      var GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 35840;
      var GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 35841;
      var GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 35842;
      var GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 35843;
      var GL_COMPRESSED_RGB_ETC1_WEBGL = 36196;
      var GL_UNSIGNED_BYTE$5 = 5121;
      var GL_UNSIGNED_SHORT$3 = 5123;
      var GL_UNSIGNED_INT$3 = 5125;
      var GL_FLOAT$4 = 5126;
      var GL_TEXTURE_WRAP_S = 10242;
      var GL_TEXTURE_WRAP_T = 10243;
      var GL_REPEAT = 10497;
      var GL_CLAMP_TO_EDGE$1 = 33071;
      var GL_MIRRORED_REPEAT = 33648;
      var GL_TEXTURE_MAG_FILTER = 10240;
      var GL_TEXTURE_MIN_FILTER = 10241;
      var GL_NEAREST$1 = 9728;
      var GL_LINEAR = 9729;
      var GL_NEAREST_MIPMAP_NEAREST$1 = 9984;
      var GL_LINEAR_MIPMAP_NEAREST$1 = 9985;
      var GL_NEAREST_MIPMAP_LINEAR$1 = 9986;
      var GL_LINEAR_MIPMAP_LINEAR$1 = 9987;
      var GL_GENERATE_MIPMAP_HINT = 33170;
      var GL_DONT_CARE = 4352;
      var GL_FASTEST = 4353;
      var GL_NICEST = 4354;
      var GL_TEXTURE_MAX_ANISOTROPY_EXT = 34046;
      var GL_UNPACK_ALIGNMENT = 3317;
      var GL_UNPACK_FLIP_Y_WEBGL = 37440;
      var GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL = 37441;
      var GL_UNPACK_COLORSPACE_CONVERSION_WEBGL = 37443;
      var GL_BROWSER_DEFAULT_WEBGL = 37444;
      var GL_TEXTURE0$1 = 33984;
      var MIPMAP_FILTERS = [
        GL_NEAREST_MIPMAP_NEAREST$1,
        GL_NEAREST_MIPMAP_LINEAR$1,
        GL_LINEAR_MIPMAP_NEAREST$1,
        GL_LINEAR_MIPMAP_LINEAR$1
      ];
      var CHANNELS_FORMAT = [
        0,
        GL_LUMINANCE,
        GL_LUMINANCE_ALPHA,
        GL_RGB,
        GL_RGBA$1
      ];
      var FORMAT_CHANNELS = {};
      FORMAT_CHANNELS[GL_LUMINANCE] = FORMAT_CHANNELS[GL_ALPHA] = FORMAT_CHANNELS[GL_DEPTH_COMPONENT] = 1;
      FORMAT_CHANNELS[GL_DEPTH_STENCIL] = FORMAT_CHANNELS[GL_LUMINANCE_ALPHA] = 2;
      FORMAT_CHANNELS[GL_RGB] = FORMAT_CHANNELS[GL_SRGB_EXT] = 3;
      FORMAT_CHANNELS[GL_RGBA$1] = FORMAT_CHANNELS[GL_SRGB_ALPHA_EXT] = 4;
      function objectName(str) {
        return "[object " + str + "]";
      }
      var CANVAS_CLASS = objectName("HTMLCanvasElement");
      var OFFSCREENCANVAS_CLASS = objectName("OffscreenCanvas");
      var CONTEXT2D_CLASS = objectName("CanvasRenderingContext2D");
      var BITMAP_CLASS = objectName("ImageBitmap");
      var IMAGE_CLASS = objectName("HTMLImageElement");
      var VIDEO_CLASS = objectName("HTMLVideoElement");
      var PIXEL_CLASSES = Object.keys(arrayTypes).concat([
        CANVAS_CLASS,
        OFFSCREENCANVAS_CLASS,
        CONTEXT2D_CLASS,
        BITMAP_CLASS,
        IMAGE_CLASS,
        VIDEO_CLASS
      ]);
      var TYPE_SIZES = [];
      TYPE_SIZES[GL_UNSIGNED_BYTE$5] = 1;
      TYPE_SIZES[GL_FLOAT$4] = 4;
      TYPE_SIZES[GL_HALF_FLOAT_OES$1] = 2;
      TYPE_SIZES[GL_UNSIGNED_SHORT$3] = 2;
      TYPE_SIZES[GL_UNSIGNED_INT$3] = 4;
      var FORMAT_SIZES_SPECIAL = [];
      FORMAT_SIZES_SPECIAL[GL_RGBA4] = 2;
      FORMAT_SIZES_SPECIAL[GL_RGB5_A1] = 2;
      FORMAT_SIZES_SPECIAL[GL_RGB565] = 2;
      FORMAT_SIZES_SPECIAL[GL_DEPTH_STENCIL] = 4;
      FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_S3TC_DXT1_EXT] = 0.5;
      FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_S3TC_DXT1_EXT] = 0.5;
      FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_S3TC_DXT3_EXT] = 1;
      FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_S3TC_DXT5_EXT] = 1;
      FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_ATC_WEBGL] = 0.5;
      FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL] = 1;
      FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL] = 1;
      FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG] = 0.5;
      FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG] = 0.25;
      FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG] = 0.5;
      FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG] = 0.25;
      FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_ETC1_WEBGL] = 0.5;
      function isNumericArray(arr) {
        return Array.isArray(arr) && (arr.length === 0 || typeof arr[0] === "number");
      }
      function isRectArray(arr) {
        if (!Array.isArray(arr)) {
          return false;
        }
        var width = arr.length;
        if (width === 0 || !isArrayLike(arr[0])) {
          return false;
        }
        return true;
      }
      function classString(x) {
        return Object.prototype.toString.call(x);
      }
      function isCanvasElement(object) {
        return classString(object) === CANVAS_CLASS;
      }
      function isOffscreenCanvas(object) {
        return classString(object) === OFFSCREENCANVAS_CLASS;
      }
      function isContext2D(object) {
        return classString(object) === CONTEXT2D_CLASS;
      }
      function isBitmap(object) {
        return classString(object) === BITMAP_CLASS;
      }
      function isImageElement(object) {
        return classString(object) === IMAGE_CLASS;
      }
      function isVideoElement(object) {
        return classString(object) === VIDEO_CLASS;
      }
      function isPixelData(object) {
        if (!object) {
          return false;
        }
        var className = classString(object);
        if (PIXEL_CLASSES.indexOf(className) >= 0) {
          return true;
        }
        return isNumericArray(object) || isRectArray(object) || isNDArrayLike(object);
      }
      function typedArrayCode$1(data) {
        return arrayTypes[Object.prototype.toString.call(data)] | 0;
      }
      function convertData(result, data) {
        var n = data.length;
        switch (result.type) {
          case GL_UNSIGNED_BYTE$5:
          case GL_UNSIGNED_SHORT$3:
          case GL_UNSIGNED_INT$3:
          case GL_FLOAT$4:
            var converted = pool.allocType(result.type, n);
            converted.set(data);
            result.data = converted;
            break;
          case GL_HALF_FLOAT_OES$1:
            result.data = convertToHalfFloat(data);
            break;
          default:
            check$1.raise("unsupported texture type, must specify a typed array");
        }
      }
      function preConvert(image, n) {
        return pool.allocType(
          image.type === GL_HALF_FLOAT_OES$1 ? GL_FLOAT$4 : image.type,
          n
        );
      }
      function postConvert(image, data) {
        if (image.type === GL_HALF_FLOAT_OES$1) {
          image.data = convertToHalfFloat(data);
          pool.freeType(data);
        } else {
          image.data = data;
        }
      }
      function transposeData(image, array, strideX, strideY, strideC, offset) {
        var w = image.width;
        var h = image.height;
        var c = image.channels;
        var n = w * h * c;
        var data = preConvert(image, n);
        var p = 0;
        for (var i = 0; i < h; ++i) {
          for (var j = 0; j < w; ++j) {
            for (var k = 0; k < c; ++k) {
              data[p++] = array[strideX * j + strideY * i + strideC * k + offset];
            }
          }
        }
        postConvert(image, data);
      }
      function getTextureSize(format, type, width, height, isMipmap, isCube) {
        var s;
        if (typeof FORMAT_SIZES_SPECIAL[format] !== "undefined") {
          s = FORMAT_SIZES_SPECIAL[format];
        } else {
          s = FORMAT_CHANNELS[format] * TYPE_SIZES[type];
        }
        if (isCube) {
          s *= 6;
        }
        if (isMipmap) {
          var total = 0;
          var w = width;
          while (w >= 1) {
            total += s * w * w;
            w /= 2;
          }
          return total;
        } else {
          return s * width * height;
        }
      }
      function createTextureSet(gl, extensions, limits, reglPoll, contextState, stats2, config) {
        var mipmapHint = {
          "don't care": GL_DONT_CARE,
          "dont care": GL_DONT_CARE,
          "nice": GL_NICEST,
          "fast": GL_FASTEST
        };
        var wrapModes = {
          "repeat": GL_REPEAT,
          "clamp": GL_CLAMP_TO_EDGE$1,
          "mirror": GL_MIRRORED_REPEAT
        };
        var magFilters = {
          "nearest": GL_NEAREST$1,
          "linear": GL_LINEAR
        };
        var minFilters = extend({
          "mipmap": GL_LINEAR_MIPMAP_LINEAR$1,
          "nearest mipmap nearest": GL_NEAREST_MIPMAP_NEAREST$1,
          "linear mipmap nearest": GL_LINEAR_MIPMAP_NEAREST$1,
          "nearest mipmap linear": GL_NEAREST_MIPMAP_LINEAR$1,
          "linear mipmap linear": GL_LINEAR_MIPMAP_LINEAR$1
        }, magFilters);
        var colorSpace = {
          "none": 0,
          "browser": GL_BROWSER_DEFAULT_WEBGL
        };
        var textureTypes = {
          "uint8": GL_UNSIGNED_BYTE$5,
          "rgba4": GL_UNSIGNED_SHORT_4_4_4_4$1,
          "rgb565": GL_UNSIGNED_SHORT_5_6_5$1,
          "rgb5 a1": GL_UNSIGNED_SHORT_5_5_5_1$1
        };
        var textureFormats = {
          "alpha": GL_ALPHA,
          "luminance": GL_LUMINANCE,
          "luminance alpha": GL_LUMINANCE_ALPHA,
          "rgb": GL_RGB,
          "rgba": GL_RGBA$1,
          "rgba4": GL_RGBA4,
          "rgb5 a1": GL_RGB5_A1,
          "rgb565": GL_RGB565
        };
        var compressedTextureFormats = {};
        if (extensions.ext_srgb) {
          textureFormats.srgb = GL_SRGB_EXT;
          textureFormats.srgba = GL_SRGB_ALPHA_EXT;
        }
        if (extensions.oes_texture_float) {
          textureTypes.float32 = textureTypes.float = GL_FLOAT$4;
        }
        if (extensions.oes_texture_half_float) {
          textureTypes["float16"] = textureTypes["half float"] = GL_HALF_FLOAT_OES$1;
        }
        if (extensions.webgl_depth_texture) {
          extend(textureFormats, {
            "depth": GL_DEPTH_COMPONENT,
            "depth stencil": GL_DEPTH_STENCIL
          });
          extend(textureTypes, {
            "uint16": GL_UNSIGNED_SHORT$3,
            "uint32": GL_UNSIGNED_INT$3,
            "depth stencil": GL_UNSIGNED_INT_24_8_WEBGL$1
          });
        }
        if (extensions.webgl_compressed_texture_s3tc) {
          extend(compressedTextureFormats, {
            "rgb s3tc dxt1": GL_COMPRESSED_RGB_S3TC_DXT1_EXT,
            "rgba s3tc dxt1": GL_COMPRESSED_RGBA_S3TC_DXT1_EXT,
            "rgba s3tc dxt3": GL_COMPRESSED_RGBA_S3TC_DXT3_EXT,
            "rgba s3tc dxt5": GL_COMPRESSED_RGBA_S3TC_DXT5_EXT
          });
        }
        if (extensions.webgl_compressed_texture_atc) {
          extend(compressedTextureFormats, {
            "rgb atc": GL_COMPRESSED_RGB_ATC_WEBGL,
            "rgba atc explicit alpha": GL_COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL,
            "rgba atc interpolated alpha": GL_COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL
          });
        }
        if (extensions.webgl_compressed_texture_pvrtc) {
          extend(compressedTextureFormats, {
            "rgb pvrtc 4bppv1": GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG,
            "rgb pvrtc 2bppv1": GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG,
            "rgba pvrtc 4bppv1": GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG,
            "rgba pvrtc 2bppv1": GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG
          });
        }
        if (extensions.webgl_compressed_texture_etc1) {
          compressedTextureFormats["rgb etc1"] = GL_COMPRESSED_RGB_ETC1_WEBGL;
        }
        var supportedCompressedFormats = Array.prototype.slice.call(
          gl.getParameter(GL_COMPRESSED_TEXTURE_FORMATS)
        );
        Object.keys(compressedTextureFormats).forEach(function(name) {
          var format = compressedTextureFormats[name];
          if (supportedCompressedFormats.indexOf(format) >= 0) {
            textureFormats[name] = format;
          }
        });
        var supportedFormats = Object.keys(textureFormats);
        limits.textureFormats = supportedFormats;
        var textureFormatsInvert = [];
        Object.keys(textureFormats).forEach(function(key) {
          var val = textureFormats[key];
          textureFormatsInvert[val] = key;
        });
        var textureTypesInvert = [];
        Object.keys(textureTypes).forEach(function(key) {
          var val = textureTypes[key];
          textureTypesInvert[val] = key;
        });
        var magFiltersInvert = [];
        Object.keys(magFilters).forEach(function(key) {
          var val = magFilters[key];
          magFiltersInvert[val] = key;
        });
        var minFiltersInvert = [];
        Object.keys(minFilters).forEach(function(key) {
          var val = minFilters[key];
          minFiltersInvert[val] = key;
        });
        var wrapModesInvert = [];
        Object.keys(wrapModes).forEach(function(key) {
          var val = wrapModes[key];
          wrapModesInvert[val] = key;
        });
        var colorFormats = supportedFormats.reduce(function(color, key) {
          var glenum = textureFormats[key];
          if (glenum === GL_LUMINANCE || glenum === GL_ALPHA || glenum === GL_LUMINANCE || glenum === GL_LUMINANCE_ALPHA || glenum === GL_DEPTH_COMPONENT || glenum === GL_DEPTH_STENCIL || extensions.ext_srgb && (glenum === GL_SRGB_EXT || glenum === GL_SRGB_ALPHA_EXT)) {
            color[glenum] = glenum;
          } else if (glenum === GL_RGB5_A1 || key.indexOf("rgba") >= 0) {
            color[glenum] = GL_RGBA$1;
          } else {
            color[glenum] = GL_RGB;
          }
          return color;
        }, {});
        function TexFlags() {
          this.internalformat = GL_RGBA$1;
          this.format = GL_RGBA$1;
          this.type = GL_UNSIGNED_BYTE$5;
          this.compressed = false;
          this.premultiplyAlpha = false;
          this.flipY = false;
          this.unpackAlignment = 1;
          this.colorSpace = GL_BROWSER_DEFAULT_WEBGL;
          this.width = 0;
          this.height = 0;
          this.channels = 0;
        }
        function copyFlags(result, other) {
          result.internalformat = other.internalformat;
          result.format = other.format;
          result.type = other.type;
          result.compressed = other.compressed;
          result.premultiplyAlpha = other.premultiplyAlpha;
          result.flipY = other.flipY;
          result.unpackAlignment = other.unpackAlignment;
          result.colorSpace = other.colorSpace;
          result.width = other.width;
          result.height = other.height;
          result.channels = other.channels;
        }
        function parseFlags(flags, options) {
          if (typeof options !== "object" || !options) {
            return;
          }
          if ("premultiplyAlpha" in options) {
            check$1.type(
              options.premultiplyAlpha,
              "boolean",
              "invalid premultiplyAlpha"
            );
            flags.premultiplyAlpha = options.premultiplyAlpha;
          }
          if ("flipY" in options) {
            check$1.type(
              options.flipY,
              "boolean",
              "invalid texture flip"
            );
            flags.flipY = options.flipY;
          }
          if ("alignment" in options) {
            check$1.oneOf(
              options.alignment,
              [1, 2, 4, 8],
              "invalid texture unpack alignment"
            );
            flags.unpackAlignment = options.alignment;
          }
          if ("colorSpace" in options) {
            check$1.parameter(
              options.colorSpace,
              colorSpace,
              "invalid colorSpace"
            );
            flags.colorSpace = colorSpace[options.colorSpace];
          }
          if ("type" in options) {
            var type = options.type;
            check$1(
              extensions.oes_texture_float || !(type === "float" || type === "float32"),
              "you must enable the OES_texture_float extension in order to use floating point textures."
            );
            check$1(
              extensions.oes_texture_half_float || !(type === "half float" || type === "float16"),
              "you must enable the OES_texture_half_float extension in order to use 16-bit floating point textures."
            );
            check$1(
              extensions.webgl_depth_texture || !(type === "uint16" || type === "uint32" || type === "depth stencil"),
              "you must enable the WEBGL_depth_texture extension in order to use depth/stencil textures."
            );
            check$1.parameter(
              type,
              textureTypes,
              "invalid texture type"
            );
            flags.type = textureTypes[type];
          }
          var w = flags.width;
          var h = flags.height;
          var c = flags.channels;
          var hasChannels = false;
          if ("shape" in options) {
            check$1(
              Array.isArray(options.shape) && options.shape.length >= 2,
              "shape must be an array"
            );
            w = options.shape[0];
            h = options.shape[1];
            if (options.shape.length === 3) {
              c = options.shape[2];
              check$1(c > 0 && c <= 4, "invalid number of channels");
              hasChannels = true;
            }
            check$1(w >= 0 && w <= limits.maxTextureSize, "invalid width");
            check$1(h >= 0 && h <= limits.maxTextureSize, "invalid height");
          } else {
            if ("radius" in options) {
              w = h = options.radius;
              check$1(w >= 0 && w <= limits.maxTextureSize, "invalid radius");
            }
            if ("width" in options) {
              w = options.width;
              check$1(w >= 0 && w <= limits.maxTextureSize, "invalid width");
            }
            if ("height" in options) {
              h = options.height;
              check$1(h >= 0 && h <= limits.maxTextureSize, "invalid height");
            }
            if ("channels" in options) {
              c = options.channels;
              check$1(c > 0 && c <= 4, "invalid number of channels");
              hasChannels = true;
            }
          }
          flags.width = w | 0;
          flags.height = h | 0;
          flags.channels = c | 0;
          var hasFormat = false;
          if ("format" in options) {
            var formatStr = options.format;
            check$1(
              extensions.webgl_depth_texture || !(formatStr === "depth" || formatStr === "depth stencil"),
              "you must enable the WEBGL_depth_texture extension in order to use depth/stencil textures."
            );
            check$1.parameter(
              formatStr,
              textureFormats,
              "invalid texture format"
            );
            var internalformat = flags.internalformat = textureFormats[formatStr];
            flags.format = colorFormats[internalformat];
            if (formatStr in textureTypes) {
              if (!("type" in options)) {
                flags.type = textureTypes[formatStr];
              }
            }
            if (formatStr in compressedTextureFormats) {
              flags.compressed = true;
            }
            hasFormat = true;
          }
          if (!hasChannels && hasFormat) {
            flags.channels = FORMAT_CHANNELS[flags.format];
          } else if (hasChannels && !hasFormat) {
            if (flags.channels !== CHANNELS_FORMAT[flags.format]) {
              flags.format = flags.internalformat = CHANNELS_FORMAT[flags.channels];
            }
          } else if (hasFormat && hasChannels) {
            check$1(
              flags.channels === FORMAT_CHANNELS[flags.format],
              "number of channels inconsistent with specified format"
            );
          }
        }
        function setFlags(flags) {
          gl.pixelStorei(GL_UNPACK_FLIP_Y_WEBGL, flags.flipY);
          gl.pixelStorei(GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL, flags.premultiplyAlpha);
          gl.pixelStorei(GL_UNPACK_COLORSPACE_CONVERSION_WEBGL, flags.colorSpace);
          gl.pixelStorei(GL_UNPACK_ALIGNMENT, flags.unpackAlignment);
        }
        function TexImage() {
          TexFlags.call(this);
          this.xOffset = 0;
          this.yOffset = 0;
          this.data = null;
          this.needsFree = false;
          this.element = null;
          this.needsCopy = false;
        }
        function parseImage(image, options) {
          var data = null;
          if (isPixelData(options)) {
            data = options;
          } else if (options) {
            check$1.type(options, "object", "invalid pixel data type");
            parseFlags(image, options);
            if ("x" in options) {
              image.xOffset = options.x | 0;
            }
            if ("y" in options) {
              image.yOffset = options.y | 0;
            }
            if (isPixelData(options.data)) {
              data = options.data;
            }
          }
          check$1(
            !image.compressed || data instanceof Uint8Array,
            "compressed texture data must be stored in a uint8array"
          );
          if (options.copy) {
            check$1(!data, "can not specify copy and data field for the same texture");
            var viewW = contextState.viewportWidth;
            var viewH = contextState.viewportHeight;
            image.width = image.width || viewW - image.xOffset;
            image.height = image.height || viewH - image.yOffset;
            image.needsCopy = true;
            check$1(
              image.xOffset >= 0 && image.xOffset < viewW && image.yOffset >= 0 && image.yOffset < viewH && image.width > 0 && image.width <= viewW && image.height > 0 && image.height <= viewH,
              "copy texture read out of bounds"
            );
          } else if (!data) {
            image.width = image.width || 1;
            image.height = image.height || 1;
            image.channels = image.channels || 4;
          } else if (isTypedArray(data)) {
            image.channels = image.channels || 4;
            image.data = data;
            if (!("type" in options) && image.type === GL_UNSIGNED_BYTE$5) {
              image.type = typedArrayCode$1(data);
            }
          } else if (isNumericArray(data)) {
            image.channels = image.channels || 4;
            convertData(image, data);
            image.alignment = 1;
            image.needsFree = true;
          } else if (isNDArrayLike(data)) {
            var array = data.data;
            if (!Array.isArray(array) && image.type === GL_UNSIGNED_BYTE$5) {
              image.type = typedArrayCode$1(array);
            }
            var shape = data.shape;
            var stride = data.stride;
            var shapeX, shapeY, shapeC, strideX, strideY, strideC;
            if (shape.length === 3) {
              shapeC = shape[2];
              strideC = stride[2];
            } else {
              check$1(shape.length === 2, "invalid ndarray pixel data, must be 2 or 3D");
              shapeC = 1;
              strideC = 1;
            }
            shapeX = shape[0];
            shapeY = shape[1];
            strideX = stride[0];
            strideY = stride[1];
            image.alignment = 1;
            image.width = shapeX;
            image.height = shapeY;
            image.channels = shapeC;
            image.format = image.internalformat = CHANNELS_FORMAT[shapeC];
            image.needsFree = true;
            transposeData(image, array, strideX, strideY, strideC, data.offset);
          } else if (isCanvasElement(data) || isOffscreenCanvas(data) || isContext2D(data)) {
            if (isCanvasElement(data) || isOffscreenCanvas(data)) {
              image.element = data;
            } else {
              image.element = data.canvas;
            }
            image.width = image.element.width;
            image.height = image.element.height;
            image.channels = 4;
          } else if (isBitmap(data)) {
            image.element = data;
            image.width = data.width;
            image.height = data.height;
            image.channels = 4;
          } else if (isImageElement(data)) {
            image.element = data;
            image.width = data.naturalWidth;
            image.height = data.naturalHeight;
            image.channels = 4;
          } else if (isVideoElement(data)) {
            image.element = data;
            image.width = data.videoWidth;
            image.height = data.videoHeight;
            image.channels = 4;
          } else if (isRectArray(data)) {
            var w = image.width || data[0].length;
            var h = image.height || data.length;
            var c = image.channels;
            if (isArrayLike(data[0][0])) {
              c = c || data[0][0].length;
            } else {
              c = c || 1;
            }
            var arrayShape2 = flattenUtils.shape(data);
            var n = 1;
            for (var dd = 0; dd < arrayShape2.length; ++dd) {
              n *= arrayShape2[dd];
            }
            var allocData = preConvert(image, n);
            flattenUtils.flatten(data, arrayShape2, "", allocData);
            postConvert(image, allocData);
            image.alignment = 1;
            image.width = w;
            image.height = h;
            image.channels = c;
            image.format = image.internalformat = CHANNELS_FORMAT[c];
            image.needsFree = true;
          }
          if (image.type === GL_FLOAT$4) {
            check$1(
              limits.extensions.indexOf("oes_texture_float") >= 0,
              "oes_texture_float extension not enabled"
            );
          } else if (image.type === GL_HALF_FLOAT_OES$1) {
            check$1(
              limits.extensions.indexOf("oes_texture_half_float") >= 0,
              "oes_texture_half_float extension not enabled"
            );
          }
        }
        function setImage(info, target, miplevel) {
          var element = info.element;
          var data = info.data;
          var internalformat = info.internalformat;
          var format = info.format;
          var type = info.type;
          var width = info.width;
          var height = info.height;
          setFlags(info);
          if (element) {
            gl.texImage2D(target, miplevel, format, format, type, element);
          } else if (info.compressed) {
            gl.compressedTexImage2D(target, miplevel, internalformat, width, height, 0, data);
          } else if (info.needsCopy) {
            reglPoll();
            gl.copyTexImage2D(
              target,
              miplevel,
              format,
              info.xOffset,
              info.yOffset,
              width,
              height,
              0
            );
          } else {
            gl.texImage2D(target, miplevel, format, width, height, 0, format, type, data || null);
          }
        }
        function setSubImage(info, target, x, y, miplevel) {
          var element = info.element;
          var data = info.data;
          var internalformat = info.internalformat;
          var format = info.format;
          var type = info.type;
          var width = info.width;
          var height = info.height;
          setFlags(info);
          if (element) {
            gl.texSubImage2D(
              target,
              miplevel,
              x,
              y,
              format,
              type,
              element
            );
          } else if (info.compressed) {
            gl.compressedTexSubImage2D(
              target,
              miplevel,
              x,
              y,
              internalformat,
              width,
              height,
              data
            );
          } else if (info.needsCopy) {
            reglPoll();
            gl.copyTexSubImage2D(
              target,
              miplevel,
              x,
              y,
              info.xOffset,
              info.yOffset,
              width,
              height
            );
          } else {
            gl.texSubImage2D(
              target,
              miplevel,
              x,
              y,
              width,
              height,
              format,
              type,
              data
            );
          }
        }
        var imagePool = [];
        function allocImage() {
          return imagePool.pop() || new TexImage();
        }
        function freeImage(image) {
          if (image.needsFree) {
            pool.freeType(image.data);
          }
          TexImage.call(image);
          imagePool.push(image);
        }
        function MipMap() {
          TexFlags.call(this);
          this.genMipmaps = false;
          this.mipmapHint = GL_DONT_CARE;
          this.mipmask = 0;
          this.images = Array(16);
        }
        function parseMipMapFromShape(mipmap, width, height) {
          var img = mipmap.images[0] = allocImage();
          mipmap.mipmask = 1;
          img.width = mipmap.width = width;
          img.height = mipmap.height = height;
          img.channels = mipmap.channels = 4;
        }
        function parseMipMapFromObject(mipmap, options) {
          var imgData = null;
          if (isPixelData(options)) {
            imgData = mipmap.images[0] = allocImage();
            copyFlags(imgData, mipmap);
            parseImage(imgData, options);
            mipmap.mipmask = 1;
          } else {
            parseFlags(mipmap, options);
            if (Array.isArray(options.mipmap)) {
              var mipData = options.mipmap;
              for (var i = 0; i < mipData.length; ++i) {
                imgData = mipmap.images[i] = allocImage();
                copyFlags(imgData, mipmap);
                imgData.width >>= i;
                imgData.height >>= i;
                parseImage(imgData, mipData[i]);
                mipmap.mipmask |= 1 << i;
              }
            } else {
              imgData = mipmap.images[0] = allocImage();
              copyFlags(imgData, mipmap);
              parseImage(imgData, options);
              mipmap.mipmask = 1;
            }
          }
          copyFlags(mipmap, mipmap.images[0]);
          if (mipmap.compressed && (mipmap.internalformat === GL_COMPRESSED_RGB_S3TC_DXT1_EXT || mipmap.internalformat === GL_COMPRESSED_RGBA_S3TC_DXT1_EXT || mipmap.internalformat === GL_COMPRESSED_RGBA_S3TC_DXT3_EXT || mipmap.internalformat === GL_COMPRESSED_RGBA_S3TC_DXT5_EXT)) {
            check$1(
              mipmap.width % 4 === 0 && mipmap.height % 4 === 0,
              "for compressed texture formats, mipmap level 0 must have width and height that are a multiple of 4"
            );
          }
        }
        function setMipMap(mipmap, target) {
          var images = mipmap.images;
          for (var i = 0; i < images.length; ++i) {
            if (!images[i]) {
              return;
            }
            setImage(images[i], target, i);
          }
        }
        var mipPool = [];
        function allocMipMap() {
          var result = mipPool.pop() || new MipMap();
          TexFlags.call(result);
          result.mipmask = 0;
          for (var i = 0; i < 16; ++i) {
            result.images[i] = null;
          }
          return result;
        }
        function freeMipMap(mipmap) {
          var images = mipmap.images;
          for (var i = 0; i < images.length; ++i) {
            if (images[i]) {
              freeImage(images[i]);
            }
            images[i] = null;
          }
          mipPool.push(mipmap);
        }
        function TexInfo() {
          this.minFilter = GL_NEAREST$1;
          this.magFilter = GL_NEAREST$1;
          this.wrapS = GL_CLAMP_TO_EDGE$1;
          this.wrapT = GL_CLAMP_TO_EDGE$1;
          this.anisotropic = 1;
          this.genMipmaps = false;
          this.mipmapHint = GL_DONT_CARE;
        }
        function parseTexInfo(info, options) {
          if ("min" in options) {
            var minFilter = options.min;
            check$1.parameter(minFilter, minFilters);
            info.minFilter = minFilters[minFilter];
            if (MIPMAP_FILTERS.indexOf(info.minFilter) >= 0 && !("faces" in options)) {
              info.genMipmaps = true;
            }
          }
          if ("mag" in options) {
            var magFilter = options.mag;
            check$1.parameter(magFilter, magFilters);
            info.magFilter = magFilters[magFilter];
          }
          var wrapS = info.wrapS;
          var wrapT = info.wrapT;
          if ("wrap" in options) {
            var wrap = options.wrap;
            if (typeof wrap === "string") {
              check$1.parameter(wrap, wrapModes);
              wrapS = wrapT = wrapModes[wrap];
            } else if (Array.isArray(wrap)) {
              check$1.parameter(wrap[0], wrapModes);
              check$1.parameter(wrap[1], wrapModes);
              wrapS = wrapModes[wrap[0]];
              wrapT = wrapModes[wrap[1]];
            }
          } else {
            if ("wrapS" in options) {
              var optWrapS = options.wrapS;
              check$1.parameter(optWrapS, wrapModes);
              wrapS = wrapModes[optWrapS];
            }
            if ("wrapT" in options) {
              var optWrapT = options.wrapT;
              check$1.parameter(optWrapT, wrapModes);
              wrapT = wrapModes[optWrapT];
            }
          }
          info.wrapS = wrapS;
          info.wrapT = wrapT;
          if ("anisotropic" in options) {
            var anisotropic = options.anisotropic;
            check$1(
              typeof anisotropic === "number" && anisotropic >= 1 && anisotropic <= limits.maxAnisotropic,
              "aniso samples must be between 1 and "
            );
            info.anisotropic = options.anisotropic;
          }
          if ("mipmap" in options) {
            var hasMipMap = false;
            switch (typeof options.mipmap) {
              case "string":
                check$1.parameter(
                  options.mipmap,
                  mipmapHint,
                  "invalid mipmap hint"
                );
                info.mipmapHint = mipmapHint[options.mipmap];
                info.genMipmaps = true;
                hasMipMap = true;
                break;
              case "boolean":
                hasMipMap = info.genMipmaps = options.mipmap;
                break;
              case "object":
                check$1(Array.isArray(options.mipmap), "invalid mipmap type");
                info.genMipmaps = false;
                hasMipMap = true;
                break;
              default:
                check$1.raise("invalid mipmap type");
            }
            if (hasMipMap && !("min" in options)) {
              info.minFilter = GL_NEAREST_MIPMAP_NEAREST$1;
            }
          }
        }
        function setTexInfo(info, target) {
          gl.texParameteri(target, GL_TEXTURE_MIN_FILTER, info.minFilter);
          gl.texParameteri(target, GL_TEXTURE_MAG_FILTER, info.magFilter);
          gl.texParameteri(target, GL_TEXTURE_WRAP_S, info.wrapS);
          gl.texParameteri(target, GL_TEXTURE_WRAP_T, info.wrapT);
          if (extensions.ext_texture_filter_anisotropic) {
            gl.texParameteri(target, GL_TEXTURE_MAX_ANISOTROPY_EXT, info.anisotropic);
          }
          if (info.genMipmaps) {
            gl.hint(GL_GENERATE_MIPMAP_HINT, info.mipmapHint);
            gl.generateMipmap(target);
          }
        }
        var textureCount = 0;
        var textureSet = {};
        var numTexUnits = limits.maxTextureUnits;
        var textureUnits = Array(numTexUnits).map(function() {
          return null;
        });
        function REGLTexture(target) {
          TexFlags.call(this);
          this.mipmask = 0;
          this.internalformat = GL_RGBA$1;
          this.id = textureCount++;
          this.refCount = 1;
          this.target = target;
          this.texture = gl.createTexture();
          this.unit = -1;
          this.bindCount = 0;
          this.texInfo = new TexInfo();
          if (config.profile) {
            this.stats = { size: 0 };
          }
        }
        function tempBind(texture) {
          gl.activeTexture(GL_TEXTURE0$1);
          gl.bindTexture(texture.target, texture.texture);
        }
        function tempRestore() {
          var prev = textureUnits[0];
          if (prev) {
            gl.bindTexture(prev.target, prev.texture);
          } else {
            gl.bindTexture(GL_TEXTURE_2D$1, null);
          }
        }
        function destroy(texture) {
          var handle = texture.texture;
          check$1(handle, "must not double destroy texture");
          var unit = texture.unit;
          var target = texture.target;
          if (unit >= 0) {
            gl.activeTexture(GL_TEXTURE0$1 + unit);
            gl.bindTexture(target, null);
            textureUnits[unit] = null;
          }
          gl.deleteTexture(handle);
          texture.texture = null;
          texture.params = null;
          texture.pixels = null;
          texture.refCount = 0;
          delete textureSet[texture.id];
          stats2.textureCount--;
        }
        extend(REGLTexture.prototype, {
          bind: function() {
            var texture = this;
            texture.bindCount += 1;
            var unit = texture.unit;
            if (unit < 0) {
              for (var i = 0; i < numTexUnits; ++i) {
                var other = textureUnits[i];
                if (other) {
                  if (other.bindCount > 0) {
                    continue;
                  }
                  other.unit = -1;
                }
                textureUnits[i] = texture;
                unit = i;
                break;
              }
              if (unit >= numTexUnits) {
                check$1.raise("insufficient number of texture units");
              }
              if (config.profile && stats2.maxTextureUnits < unit + 1) {
                stats2.maxTextureUnits = unit + 1;
              }
              texture.unit = unit;
              gl.activeTexture(GL_TEXTURE0$1 + unit);
              gl.bindTexture(texture.target, texture.texture);
            }
            return unit;
          },
          unbind: function() {
            this.bindCount -= 1;
          },
          decRef: function() {
            if (--this.refCount <= 0) {
              destroy(this);
            }
          }
        });
        function createTexture2D(a, b) {
          var texture = new REGLTexture(GL_TEXTURE_2D$1);
          textureSet[texture.id] = texture;
          stats2.textureCount++;
          function reglTexture2D(a2, b2) {
            var texInfo = texture.texInfo;
            TexInfo.call(texInfo);
            var mipData = allocMipMap();
            if (typeof a2 === "number") {
              if (typeof b2 === "number") {
                parseMipMapFromShape(mipData, a2 | 0, b2 | 0);
              } else {
                parseMipMapFromShape(mipData, a2 | 0, a2 | 0);
              }
            } else if (a2) {
              check$1.type(a2, "object", "invalid arguments to regl.texture");
              parseTexInfo(texInfo, a2);
              parseMipMapFromObject(mipData, a2);
            } else {
              parseMipMapFromShape(mipData, 1, 1);
            }
            if (texInfo.genMipmaps) {
              mipData.mipmask = (mipData.width << 1) - 1;
            }
            texture.mipmask = mipData.mipmask;
            copyFlags(texture, mipData);
            check$1.texture2D(texInfo, mipData, limits);
            texture.internalformat = mipData.internalformat;
            reglTexture2D.width = mipData.width;
            reglTexture2D.height = mipData.height;
            tempBind(texture);
            setMipMap(mipData, GL_TEXTURE_2D$1);
            setTexInfo(texInfo, GL_TEXTURE_2D$1);
            tempRestore();
            freeMipMap(mipData);
            if (config.profile) {
              texture.stats.size = getTextureSize(
                texture.internalformat,
                texture.type,
                mipData.width,
                mipData.height,
                texInfo.genMipmaps,
                false
              );
            }
            reglTexture2D.format = textureFormatsInvert[texture.internalformat];
            reglTexture2D.type = textureTypesInvert[texture.type];
            reglTexture2D.mag = magFiltersInvert[texInfo.magFilter];
            reglTexture2D.min = minFiltersInvert[texInfo.minFilter];
            reglTexture2D.wrapS = wrapModesInvert[texInfo.wrapS];
            reglTexture2D.wrapT = wrapModesInvert[texInfo.wrapT];
            return reglTexture2D;
          }
          function subimage(image, x_, y_, level_) {
            check$1(!!image, "must specify image data");
            var x = x_ | 0;
            var y = y_ | 0;
            var level = level_ | 0;
            var imageData = allocImage();
            copyFlags(imageData, texture);
            imageData.width = 0;
            imageData.height = 0;
            parseImage(imageData, image);
            imageData.width = imageData.width || (texture.width >> level) - x;
            imageData.height = imageData.height || (texture.height >> level) - y;
            check$1(
              texture.type === imageData.type && texture.format === imageData.format && texture.internalformat === imageData.internalformat,
              "incompatible format for texture.subimage"
            );
            check$1(
              x >= 0 && y >= 0 && x + imageData.width <= texture.width && y + imageData.height <= texture.height,
              "texture.subimage write out of bounds"
            );
            check$1(
              texture.mipmask & 1 << level,
              "missing mipmap data"
            );
            check$1(
              imageData.data || imageData.element || imageData.needsCopy,
              "missing image data"
            );
            tempBind(texture);
            setSubImage(imageData, GL_TEXTURE_2D$1, x, y, level);
            tempRestore();
            freeImage(imageData);
            return reglTexture2D;
          }
          function resize(w_, h_) {
            var w = w_ | 0;
            var h = h_ | 0 || w;
            if (w === texture.width && h === texture.height) {
              return reglTexture2D;
            }
            reglTexture2D.width = texture.width = w;
            reglTexture2D.height = texture.height = h;
            tempBind(texture);
            for (var i = 0; texture.mipmask >> i; ++i) {
              var _w = w >> i;
              var _h = h >> i;
              if (!_w || !_h) break;
              gl.texImage2D(
                GL_TEXTURE_2D$1,
                i,
                texture.format,
                _w,
                _h,
                0,
                texture.format,
                texture.type,
                null
              );
            }
            tempRestore();
            if (config.profile) {
              texture.stats.size = getTextureSize(
                texture.internalformat,
                texture.type,
                w,
                h,
                false,
                false
              );
            }
            return reglTexture2D;
          }
          reglTexture2D(a, b);
          reglTexture2D.subimage = subimage;
          reglTexture2D.resize = resize;
          reglTexture2D._reglType = "texture2d";
          reglTexture2D._texture = texture;
          if (config.profile) {
            reglTexture2D.stats = texture.stats;
          }
          reglTexture2D.destroy = function() {
            texture.decRef();
          };
          return reglTexture2D;
        }
        function createTextureCube(a0, a1, a2, a3, a4, a5) {
          var texture = new REGLTexture(GL_TEXTURE_CUBE_MAP$1);
          textureSet[texture.id] = texture;
          stats2.cubeCount++;
          var faces = new Array(6);
          function reglTextureCube(a02, a12, a22, a32, a42, a52) {
            var i;
            var texInfo = texture.texInfo;
            TexInfo.call(texInfo);
            for (i = 0; i < 6; ++i) {
              faces[i] = allocMipMap();
            }
            if (typeof a02 === "number" || !a02) {
              var s = a02 | 0 || 1;
              for (i = 0; i < 6; ++i) {
                parseMipMapFromShape(faces[i], s, s);
              }
            } else if (typeof a02 === "object") {
              if (a12) {
                parseMipMapFromObject(faces[0], a02);
                parseMipMapFromObject(faces[1], a12);
                parseMipMapFromObject(faces[2], a22);
                parseMipMapFromObject(faces[3], a32);
                parseMipMapFromObject(faces[4], a42);
                parseMipMapFromObject(faces[5], a52);
              } else {
                parseTexInfo(texInfo, a02);
                parseFlags(texture, a02);
                if ("faces" in a02) {
                  var faceInput = a02.faces;
                  check$1(
                    Array.isArray(faceInput) && faceInput.length === 6,
                    "cube faces must be a length 6 array"
                  );
                  for (i = 0; i < 6; ++i) {
                    check$1(
                      typeof faceInput[i] === "object" && !!faceInput[i],
                      "invalid input for cube map face"
                    );
                    copyFlags(faces[i], texture);
                    parseMipMapFromObject(faces[i], faceInput[i]);
                  }
                } else {
                  for (i = 0; i < 6; ++i) {
                    parseMipMapFromObject(faces[i], a02);
                  }
                }
              }
            } else {
              check$1.raise("invalid arguments to cube map");
            }
            copyFlags(texture, faces[0]);
            check$1.optional(function() {
              if (!limits.npotTextureCube) {
                check$1(isPow2$1(texture.width) && isPow2$1(texture.height), "your browser does not support non power or two texture dimensions");
              }
            });
            if (texInfo.genMipmaps) {
              texture.mipmask = (faces[0].width << 1) - 1;
            } else {
              texture.mipmask = faces[0].mipmask;
            }
            check$1.textureCube(texture, texInfo, faces, limits);
            texture.internalformat = faces[0].internalformat;
            reglTextureCube.width = faces[0].width;
            reglTextureCube.height = faces[0].height;
            tempBind(texture);
            for (i = 0; i < 6; ++i) {
              setMipMap(faces[i], GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + i);
            }
            setTexInfo(texInfo, GL_TEXTURE_CUBE_MAP$1);
            tempRestore();
            if (config.profile) {
              texture.stats.size = getTextureSize(
                texture.internalformat,
                texture.type,
                reglTextureCube.width,
                reglTextureCube.height,
                texInfo.genMipmaps,
                true
              );
            }
            reglTextureCube.format = textureFormatsInvert[texture.internalformat];
            reglTextureCube.type = textureTypesInvert[texture.type];
            reglTextureCube.mag = magFiltersInvert[texInfo.magFilter];
            reglTextureCube.min = minFiltersInvert[texInfo.minFilter];
            reglTextureCube.wrapS = wrapModesInvert[texInfo.wrapS];
            reglTextureCube.wrapT = wrapModesInvert[texInfo.wrapT];
            for (i = 0; i < 6; ++i) {
              freeMipMap(faces[i]);
            }
            return reglTextureCube;
          }
          function subimage(face, image, x_, y_, level_) {
            check$1(!!image, "must specify image data");
            check$1(typeof face === "number" && face === (face | 0) && face >= 0 && face < 6, "invalid face");
            var x = x_ | 0;
            var y = y_ | 0;
            var level = level_ | 0;
            var imageData = allocImage();
            copyFlags(imageData, texture);
            imageData.width = 0;
            imageData.height = 0;
            parseImage(imageData, image);
            imageData.width = imageData.width || (texture.width >> level) - x;
            imageData.height = imageData.height || (texture.height >> level) - y;
            check$1(
              texture.type === imageData.type && texture.format === imageData.format && texture.internalformat === imageData.internalformat,
              "incompatible format for texture.subimage"
            );
            check$1(
              x >= 0 && y >= 0 && x + imageData.width <= texture.width && y + imageData.height <= texture.height,
              "texture.subimage write out of bounds"
            );
            check$1(
              texture.mipmask & 1 << level,
              "missing mipmap data"
            );
            check$1(
              imageData.data || imageData.element || imageData.needsCopy,
              "missing image data"
            );
            tempBind(texture);
            setSubImage(imageData, GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + face, x, y, level);
            tempRestore();
            freeImage(imageData);
            return reglTextureCube;
          }
          function resize(radius_) {
            var radius = radius_ | 0;
            if (radius === texture.width) {
              return;
            }
            reglTextureCube.width = texture.width = radius;
            reglTextureCube.height = texture.height = radius;
            tempBind(texture);
            for (var i = 0; i < 6; ++i) {
              for (var j = 0; texture.mipmask >> j; ++j) {
                gl.texImage2D(
                  GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + i,
                  j,
                  texture.format,
                  radius >> j,
                  radius >> j,
                  0,
                  texture.format,
                  texture.type,
                  null
                );
              }
            }
            tempRestore();
            if (config.profile) {
              texture.stats.size = getTextureSize(
                texture.internalformat,
                texture.type,
                reglTextureCube.width,
                reglTextureCube.height,
                false,
                true
              );
            }
            return reglTextureCube;
          }
          reglTextureCube(a0, a1, a2, a3, a4, a5);
          reglTextureCube.subimage = subimage;
          reglTextureCube.resize = resize;
          reglTextureCube._reglType = "textureCube";
          reglTextureCube._texture = texture;
          if (config.profile) {
            reglTextureCube.stats = texture.stats;
          }
          reglTextureCube.destroy = function() {
            texture.decRef();
          };
          return reglTextureCube;
        }
        function destroyTextures() {
          for (var i = 0; i < numTexUnits; ++i) {
            gl.activeTexture(GL_TEXTURE0$1 + i);
            gl.bindTexture(GL_TEXTURE_2D$1, null);
            textureUnits[i] = null;
          }
          values(textureSet).forEach(destroy);
          stats2.cubeCount = 0;
          stats2.textureCount = 0;
        }
        if (config.profile) {
          stats2.getTotalTextureSize = function() {
            var total = 0;
            Object.keys(textureSet).forEach(function(key) {
              total += textureSet[key].stats.size;
            });
            return total;
          };
        }
        function restoreTextures() {
          for (var i = 0; i < numTexUnits; ++i) {
            var tex = textureUnits[i];
            if (tex) {
              tex.bindCount = 0;
              tex.unit = -1;
              textureUnits[i] = null;
            }
          }
          values(textureSet).forEach(function(texture) {
            texture.texture = gl.createTexture();
            gl.bindTexture(texture.target, texture.texture);
            for (var i2 = 0; i2 < 32; ++i2) {
              if ((texture.mipmask & 1 << i2) === 0) {
                continue;
              }
              if (texture.target === GL_TEXTURE_2D$1) {
                gl.texImage2D(
                  GL_TEXTURE_2D$1,
                  i2,
                  texture.internalformat,
                  texture.width >> i2,
                  texture.height >> i2,
                  0,
                  texture.internalformat,
                  texture.type,
                  null
                );
              } else {
                for (var j = 0; j < 6; ++j) {
                  gl.texImage2D(
                    GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + j,
                    i2,
                    texture.internalformat,
                    texture.width >> i2,
                    texture.height >> i2,
                    0,
                    texture.internalformat,
                    texture.type,
                    null
                  );
                }
              }
            }
            setTexInfo(texture.texInfo, texture.target);
          });
        }
        function refreshTextures() {
          for (var i = 0; i < numTexUnits; ++i) {
            var tex = textureUnits[i];
            if (tex) {
              tex.bindCount = 0;
              tex.unit = -1;
              textureUnits[i] = null;
            }
            gl.activeTexture(GL_TEXTURE0$1 + i);
            gl.bindTexture(GL_TEXTURE_2D$1, null);
            gl.bindTexture(GL_TEXTURE_CUBE_MAP$1, null);
          }
        }
        return {
          create2D: createTexture2D,
          createCube: createTextureCube,
          clear: destroyTextures,
          getTexture: function(wrapper) {
            return null;
          },
          restore: restoreTextures,
          refresh: refreshTextures
        };
      }
      var GL_RENDERBUFFER = 36161;
      var GL_RGBA4$1 = 32854;
      var GL_RGB5_A1$1 = 32855;
      var GL_RGB565$1 = 36194;
      var GL_DEPTH_COMPONENT16 = 33189;
      var GL_STENCIL_INDEX8 = 36168;
      var GL_DEPTH_STENCIL$1 = 34041;
      var GL_SRGB8_ALPHA8_EXT = 35907;
      var GL_RGBA32F_EXT = 34836;
      var GL_RGBA16F_EXT = 34842;
      var GL_RGB16F_EXT = 34843;
      var FORMAT_SIZES = [];
      FORMAT_SIZES[GL_RGBA4$1] = 2;
      FORMAT_SIZES[GL_RGB5_A1$1] = 2;
      FORMAT_SIZES[GL_RGB565$1] = 2;
      FORMAT_SIZES[GL_DEPTH_COMPONENT16] = 2;
      FORMAT_SIZES[GL_STENCIL_INDEX8] = 1;
      FORMAT_SIZES[GL_DEPTH_STENCIL$1] = 4;
      FORMAT_SIZES[GL_SRGB8_ALPHA8_EXT] = 4;
      FORMAT_SIZES[GL_RGBA32F_EXT] = 16;
      FORMAT_SIZES[GL_RGBA16F_EXT] = 8;
      FORMAT_SIZES[GL_RGB16F_EXT] = 6;
      function getRenderbufferSize(format, width, height) {
        return FORMAT_SIZES[format] * width * height;
      }
      var wrapRenderbuffers = function(gl, extensions, limits, stats2, config) {
        var formatTypes = {
          "rgba4": GL_RGBA4$1,
          "rgb565": GL_RGB565$1,
          "rgb5 a1": GL_RGB5_A1$1,
          "depth": GL_DEPTH_COMPONENT16,
          "stencil": GL_STENCIL_INDEX8,
          "depth stencil": GL_DEPTH_STENCIL$1
        };
        if (extensions.ext_srgb) {
          formatTypes["srgba"] = GL_SRGB8_ALPHA8_EXT;
        }
        if (extensions.ext_color_buffer_half_float) {
          formatTypes["rgba16f"] = GL_RGBA16F_EXT;
          formatTypes["rgb16f"] = GL_RGB16F_EXT;
        }
        if (extensions.webgl_color_buffer_float) {
          formatTypes["rgba32f"] = GL_RGBA32F_EXT;
        }
        var formatTypesInvert = [];
        Object.keys(formatTypes).forEach(function(key) {
          var val = formatTypes[key];
          formatTypesInvert[val] = key;
        });
        var renderbufferCount = 0;
        var renderbufferSet = {};
        function REGLRenderbuffer(renderbuffer) {
          this.id = renderbufferCount++;
          this.refCount = 1;
          this.renderbuffer = renderbuffer;
          this.format = GL_RGBA4$1;
          this.width = 0;
          this.height = 0;
          if (config.profile) {
            this.stats = { size: 0 };
          }
        }
        REGLRenderbuffer.prototype.decRef = function() {
          if (--this.refCount <= 0) {
            destroy(this);
          }
        };
        function destroy(rb) {
          var handle = rb.renderbuffer;
          check$1(handle, "must not double destroy renderbuffer");
          gl.bindRenderbuffer(GL_RENDERBUFFER, null);
          gl.deleteRenderbuffer(handle);
          rb.renderbuffer = null;
          rb.refCount = 0;
          delete renderbufferSet[rb.id];
          stats2.renderbufferCount--;
        }
        function createRenderbuffer(a, b) {
          var renderbuffer = new REGLRenderbuffer(gl.createRenderbuffer());
          renderbufferSet[renderbuffer.id] = renderbuffer;
          stats2.renderbufferCount++;
          function reglRenderbuffer(a2, b2) {
            var w = 0;
            var h = 0;
            var format = GL_RGBA4$1;
            if (typeof a2 === "object" && a2) {
              var options = a2;
              if ("shape" in options) {
                var shape = options.shape;
                check$1(
                  Array.isArray(shape) && shape.length >= 2,
                  "invalid renderbuffer shape"
                );
                w = shape[0] | 0;
                h = shape[1] | 0;
              } else {
                if ("radius" in options) {
                  w = h = options.radius | 0;
                }
                if ("width" in options) {
                  w = options.width | 0;
                }
                if ("height" in options) {
                  h = options.height | 0;
                }
              }
              if ("format" in options) {
                check$1.parameter(
                  options.format,
                  formatTypes,
                  "invalid renderbuffer format"
                );
                format = formatTypes[options.format];
              }
            } else if (typeof a2 === "number") {
              w = a2 | 0;
              if (typeof b2 === "number") {
                h = b2 | 0;
              } else {
                h = w;
              }
            } else if (!a2) {
              w = h = 1;
            } else {
              check$1.raise("invalid arguments to renderbuffer constructor");
            }
            check$1(
              w > 0 && h > 0 && w <= limits.maxRenderbufferSize && h <= limits.maxRenderbufferSize,
              "invalid renderbuffer size"
            );
            if (w === renderbuffer.width && h === renderbuffer.height && format === renderbuffer.format) {
              return;
            }
            reglRenderbuffer.width = renderbuffer.width = w;
            reglRenderbuffer.height = renderbuffer.height = h;
            renderbuffer.format = format;
            gl.bindRenderbuffer(GL_RENDERBUFFER, renderbuffer.renderbuffer);
            gl.renderbufferStorage(GL_RENDERBUFFER, format, w, h);
            check$1(
              gl.getError() === 0,
              "invalid render buffer format"
            );
            if (config.profile) {
              renderbuffer.stats.size = getRenderbufferSize(renderbuffer.format, renderbuffer.width, renderbuffer.height);
            }
            reglRenderbuffer.format = formatTypesInvert[renderbuffer.format];
            return reglRenderbuffer;
          }
          function resize(w_, h_) {
            var w = w_ | 0;
            var h = h_ | 0 || w;
            if (w === renderbuffer.width && h === renderbuffer.height) {
              return reglRenderbuffer;
            }
            check$1(
              w > 0 && h > 0 && w <= limits.maxRenderbufferSize && h <= limits.maxRenderbufferSize,
              "invalid renderbuffer size"
            );
            reglRenderbuffer.width = renderbuffer.width = w;
            reglRenderbuffer.height = renderbuffer.height = h;
            gl.bindRenderbuffer(GL_RENDERBUFFER, renderbuffer.renderbuffer);
            gl.renderbufferStorage(GL_RENDERBUFFER, renderbuffer.format, w, h);
            check$1(
              gl.getError() === 0,
              "invalid render buffer format"
            );
            if (config.profile) {
              renderbuffer.stats.size = getRenderbufferSize(
                renderbuffer.format,
                renderbuffer.width,
                renderbuffer.height
              );
            }
            return reglRenderbuffer;
          }
          reglRenderbuffer(a, b);
          reglRenderbuffer.resize = resize;
          reglRenderbuffer._reglType = "renderbuffer";
          reglRenderbuffer._renderbuffer = renderbuffer;
          if (config.profile) {
            reglRenderbuffer.stats = renderbuffer.stats;
          }
          reglRenderbuffer.destroy = function() {
            renderbuffer.decRef();
          };
          return reglRenderbuffer;
        }
        if (config.profile) {
          stats2.getTotalRenderbufferSize = function() {
            var total = 0;
            Object.keys(renderbufferSet).forEach(function(key) {
              total += renderbufferSet[key].stats.size;
            });
            return total;
          };
        }
        function restoreRenderbuffers() {
          values(renderbufferSet).forEach(function(rb) {
            rb.renderbuffer = gl.createRenderbuffer();
            gl.bindRenderbuffer(GL_RENDERBUFFER, rb.renderbuffer);
            gl.renderbufferStorage(GL_RENDERBUFFER, rb.format, rb.width, rb.height);
          });
          gl.bindRenderbuffer(GL_RENDERBUFFER, null);
        }
        return {
          create: createRenderbuffer,
          clear: function() {
            values(renderbufferSet).forEach(destroy);
          },
          restore: restoreRenderbuffers
        };
      };
      var GL_FRAMEBUFFER$1 = 36160;
      var GL_RENDERBUFFER$1 = 36161;
      var GL_TEXTURE_2D$2 = 3553;
      var GL_TEXTURE_CUBE_MAP_POSITIVE_X$2 = 34069;
      var GL_COLOR_ATTACHMENT0$1 = 36064;
      var GL_DEPTH_ATTACHMENT = 36096;
      var GL_STENCIL_ATTACHMENT = 36128;
      var GL_DEPTH_STENCIL_ATTACHMENT = 33306;
      var GL_FRAMEBUFFER_COMPLETE$1 = 36053;
      var GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT = 36054;
      var GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 36055;
      var GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS = 36057;
      var GL_FRAMEBUFFER_UNSUPPORTED = 36061;
      var GL_HALF_FLOAT_OES$2 = 36193;
      var GL_UNSIGNED_BYTE$6 = 5121;
      var GL_FLOAT$5 = 5126;
      var GL_RGB$1 = 6407;
      var GL_RGBA$2 = 6408;
      var GL_DEPTH_COMPONENT$1 = 6402;
      var colorTextureFormatEnums = [
        GL_RGB$1,
        GL_RGBA$2
      ];
      var textureFormatChannels = [];
      textureFormatChannels[GL_RGBA$2] = 4;
      textureFormatChannels[GL_RGB$1] = 3;
      var textureTypeSizes = [];
      textureTypeSizes[GL_UNSIGNED_BYTE$6] = 1;
      textureTypeSizes[GL_FLOAT$5] = 4;
      textureTypeSizes[GL_HALF_FLOAT_OES$2] = 2;
      var GL_RGBA4$2 = 32854;
      var GL_RGB5_A1$2 = 32855;
      var GL_RGB565$2 = 36194;
      var GL_DEPTH_COMPONENT16$1 = 33189;
      var GL_STENCIL_INDEX8$1 = 36168;
      var GL_DEPTH_STENCIL$2 = 34041;
      var GL_SRGB8_ALPHA8_EXT$1 = 35907;
      var GL_RGBA32F_EXT$1 = 34836;
      var GL_RGBA16F_EXT$1 = 34842;
      var GL_RGB16F_EXT$1 = 34843;
      var colorRenderbufferFormatEnums = [
        GL_RGBA4$2,
        GL_RGB5_A1$2,
        GL_RGB565$2,
        GL_SRGB8_ALPHA8_EXT$1,
        GL_RGBA16F_EXT$1,
        GL_RGB16F_EXT$1,
        GL_RGBA32F_EXT$1
      ];
      var statusCode = {};
      statusCode[GL_FRAMEBUFFER_COMPLETE$1] = "complete";
      statusCode[GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT] = "incomplete attachment";
      statusCode[GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS] = "incomplete dimensions";
      statusCode[GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT] = "incomplete, missing attachment";
      statusCode[GL_FRAMEBUFFER_UNSUPPORTED] = "unsupported";
      function wrapFBOState(gl, extensions, limits, textureState, renderbufferState, stats2) {
        var framebufferState = {
          cur: null,
          next: null,
          dirty: false,
          setFBO: null
        };
        var colorTextureFormats = ["rgba"];
        var colorRenderbufferFormats = ["rgba4", "rgb565", "rgb5 a1"];
        if (extensions.ext_srgb) {
          colorRenderbufferFormats.push("srgba");
        }
        if (extensions.ext_color_buffer_half_float) {
          colorRenderbufferFormats.push("rgba16f", "rgb16f");
        }
        if (extensions.webgl_color_buffer_float) {
          colorRenderbufferFormats.push("rgba32f");
        }
        var colorTypes = ["uint8"];
        if (extensions.oes_texture_half_float) {
          colorTypes.push("half float", "float16");
        }
        if (extensions.oes_texture_float) {
          colorTypes.push("float", "float32");
        }
        function FramebufferAttachment(target, texture, renderbuffer) {
          this.target = target;
          this.texture = texture;
          this.renderbuffer = renderbuffer;
          var w = 0;
          var h = 0;
          if (texture) {
            w = texture.width;
            h = texture.height;
          } else if (renderbuffer) {
            w = renderbuffer.width;
            h = renderbuffer.height;
          }
          this.width = w;
          this.height = h;
        }
        function decRef(attachment) {
          if (attachment) {
            if (attachment.texture) {
              attachment.texture._texture.decRef();
            }
            if (attachment.renderbuffer) {
              attachment.renderbuffer._renderbuffer.decRef();
            }
          }
        }
        function incRefAndCheckShape(attachment, width, height) {
          if (!attachment) {
            return;
          }
          if (attachment.texture) {
            var texture = attachment.texture._texture;
            var tw = Math.max(1, texture.width);
            var th = Math.max(1, texture.height);
            check$1(
              tw === width && th === height,
              "inconsistent width/height for supplied texture"
            );
            texture.refCount += 1;
          } else {
            var renderbuffer = attachment.renderbuffer._renderbuffer;
            check$1(
              renderbuffer.width === width && renderbuffer.height === height,
              "inconsistent width/height for renderbuffer"
            );
            renderbuffer.refCount += 1;
          }
        }
        function attach(location, attachment) {
          if (attachment) {
            if (attachment.texture) {
              gl.framebufferTexture2D(
                GL_FRAMEBUFFER$1,
                location,
                attachment.target,
                attachment.texture._texture.texture,
                0
              );
            } else {
              gl.framebufferRenderbuffer(
                GL_FRAMEBUFFER$1,
                location,
                GL_RENDERBUFFER$1,
                attachment.renderbuffer._renderbuffer.renderbuffer
              );
            }
          }
        }
        function parseAttachment(attachment) {
          var target = GL_TEXTURE_2D$2;
          var texture = null;
          var renderbuffer = null;
          var data = attachment;
          if (typeof attachment === "object") {
            data = attachment.data;
            if ("target" in attachment) {
              target = attachment.target | 0;
            }
          }
          check$1.type(data, "function", "invalid attachment data");
          var type = data._reglType;
          if (type === "texture2d") {
            texture = data;
            check$1(target === GL_TEXTURE_2D$2);
          } else if (type === "textureCube") {
            texture = data;
            check$1(
              target >= GL_TEXTURE_CUBE_MAP_POSITIVE_X$2 && target < GL_TEXTURE_CUBE_MAP_POSITIVE_X$2 + 6,
              "invalid cube map target"
            );
          } else if (type === "renderbuffer") {
            renderbuffer = data;
            target = GL_RENDERBUFFER$1;
          } else {
            check$1.raise("invalid regl object for attachment");
          }
          return new FramebufferAttachment(target, texture, renderbuffer);
        }
        function allocAttachment(width, height, isTexture, format, type) {
          if (isTexture) {
            var texture = textureState.create2D({
              width,
              height,
              format,
              type
            });
            texture._texture.refCount = 0;
            return new FramebufferAttachment(GL_TEXTURE_2D$2, texture, null);
          } else {
            var rb = renderbufferState.create({
              width,
              height,
              format
            });
            rb._renderbuffer.refCount = 0;
            return new FramebufferAttachment(GL_RENDERBUFFER$1, null, rb);
          }
        }
        function unwrapAttachment(attachment) {
          return attachment && (attachment.texture || attachment.renderbuffer);
        }
        function resizeAttachment(attachment, w, h) {
          if (attachment) {
            if (attachment.texture) {
              attachment.texture.resize(w, h);
            } else if (attachment.renderbuffer) {
              attachment.renderbuffer.resize(w, h);
            }
            attachment.width = w;
            attachment.height = h;
          }
        }
        var framebufferCount = 0;
        var framebufferSet = {};
        function REGLFramebuffer() {
          this.id = framebufferCount++;
          framebufferSet[this.id] = this;
          this.framebuffer = gl.createFramebuffer();
          this.width = 0;
          this.height = 0;
          this.colorAttachments = [];
          this.depthAttachment = null;
          this.stencilAttachment = null;
          this.depthStencilAttachment = null;
        }
        function decFBORefs(framebuffer) {
          framebuffer.colorAttachments.forEach(decRef);
          decRef(framebuffer.depthAttachment);
          decRef(framebuffer.stencilAttachment);
          decRef(framebuffer.depthStencilAttachment);
        }
        function destroy(framebuffer) {
          var handle = framebuffer.framebuffer;
          check$1(handle, "must not double destroy framebuffer");
          gl.deleteFramebuffer(handle);
          framebuffer.framebuffer = null;
          stats2.framebufferCount--;
          delete framebufferSet[framebuffer.id];
        }
        function updateFramebuffer(framebuffer) {
          var i;
          gl.bindFramebuffer(GL_FRAMEBUFFER$1, framebuffer.framebuffer);
          var colorAttachments = framebuffer.colorAttachments;
          for (i = 0; i < colorAttachments.length; ++i) {
            attach(GL_COLOR_ATTACHMENT0$1 + i, colorAttachments[i]);
          }
          for (i = colorAttachments.length; i < limits.maxColorAttachments; ++i) {
            gl.framebufferTexture2D(
              GL_FRAMEBUFFER$1,
              GL_COLOR_ATTACHMENT0$1 + i,
              GL_TEXTURE_2D$2,
              null,
              0
            );
          }
          gl.framebufferTexture2D(
            GL_FRAMEBUFFER$1,
            GL_DEPTH_STENCIL_ATTACHMENT,
            GL_TEXTURE_2D$2,
            null,
            0
          );
          gl.framebufferTexture2D(
            GL_FRAMEBUFFER$1,
            GL_DEPTH_ATTACHMENT,
            GL_TEXTURE_2D$2,
            null,
            0
          );
          gl.framebufferTexture2D(
            GL_FRAMEBUFFER$1,
            GL_STENCIL_ATTACHMENT,
            GL_TEXTURE_2D$2,
            null,
            0
          );
          attach(GL_DEPTH_ATTACHMENT, framebuffer.depthAttachment);
          attach(GL_STENCIL_ATTACHMENT, framebuffer.stencilAttachment);
          attach(GL_DEPTH_STENCIL_ATTACHMENT, framebuffer.depthStencilAttachment);
          var status = gl.checkFramebufferStatus(GL_FRAMEBUFFER$1);
          if (!gl.isContextLost() && status !== GL_FRAMEBUFFER_COMPLETE$1) {
            check$1.raise("framebuffer configuration not supported, status = " + statusCode[status]);
          }
          gl.bindFramebuffer(GL_FRAMEBUFFER$1, framebufferState.next ? framebufferState.next.framebuffer : null);
          framebufferState.cur = framebufferState.next;
          gl.getError();
        }
        function createFBO(a0, a1) {
          var framebuffer = new REGLFramebuffer();
          stats2.framebufferCount++;
          function reglFramebuffer(a, b) {
            var i;
            check$1(
              framebufferState.next !== framebuffer,
              "can not update framebuffer which is currently in use"
            );
            var width = 0;
            var height = 0;
            var needsDepth = true;
            var needsStencil = true;
            var colorBuffer = null;
            var colorTexture = true;
            var colorFormat = "rgba";
            var colorType = "uint8";
            var colorCount = 1;
            var depthBuffer = null;
            var stencilBuffer = null;
            var depthStencilBuffer = null;
            var depthStencilTexture = false;
            if (typeof a === "number") {
              width = a | 0;
              height = b | 0 || width;
            } else if (!a) {
              width = height = 1;
            } else {
              check$1.type(a, "object", "invalid arguments for framebuffer");
              var options = a;
              if ("shape" in options) {
                var shape = options.shape;
                check$1(
                  Array.isArray(shape) && shape.length >= 2,
                  "invalid shape for framebuffer"
                );
                width = shape[0];
                height = shape[1];
              } else {
                if ("radius" in options) {
                  width = height = options.radius;
                }
                if ("width" in options) {
                  width = options.width;
                }
                if ("height" in options) {
                  height = options.height;
                }
              }
              if ("color" in options || "colors" in options) {
                colorBuffer = options.color || options.colors;
                if (Array.isArray(colorBuffer)) {
                  check$1(
                    colorBuffer.length === 1 || extensions.webgl_draw_buffers,
                    "multiple render targets not supported"
                  );
                }
              }
              if (!colorBuffer) {
                if ("colorCount" in options) {
                  colorCount = options.colorCount | 0;
                  check$1(colorCount > 0, "invalid color buffer count");
                }
                if ("colorTexture" in options) {
                  colorTexture = !!options.colorTexture;
                  colorFormat = "rgba4";
                }
                if ("colorType" in options) {
                  colorType = options.colorType;
                  if (!colorTexture) {
                    if (colorType === "half float" || colorType === "float16") {
                      check$1(
                        extensions.ext_color_buffer_half_float,
                        "you must enable EXT_color_buffer_half_float to use 16-bit render buffers"
                      );
                      colorFormat = "rgba16f";
                    } else if (colorType === "float" || colorType === "float32") {
                      check$1(
                        extensions.webgl_color_buffer_float,
                        "you must enable WEBGL_color_buffer_float in order to use 32-bit floating point renderbuffers"
                      );
                      colorFormat = "rgba32f";
                    }
                  } else {
                    check$1(
                      extensions.oes_texture_float || !(colorType === "float" || colorType === "float32"),
                      "you must enable OES_texture_float in order to use floating point framebuffer objects"
                    );
                    check$1(
                      extensions.oes_texture_half_float || !(colorType === "half float" || colorType === "float16"),
                      "you must enable OES_texture_half_float in order to use 16-bit floating point framebuffer objects"
                    );
                  }
                  check$1.oneOf(colorType, colorTypes, "invalid color type");
                }
                if ("colorFormat" in options) {
                  colorFormat = options.colorFormat;
                  if (colorTextureFormats.indexOf(colorFormat) >= 0) {
                    colorTexture = true;
                  } else if (colorRenderbufferFormats.indexOf(colorFormat) >= 0) {
                    colorTexture = false;
                  } else {
                    check$1.optional(function() {
                      if (colorTexture) {
                        check$1.oneOf(
                          options.colorFormat,
                          colorTextureFormats,
                          "invalid color format for texture"
                        );
                      } else {
                        check$1.oneOf(
                          options.colorFormat,
                          colorRenderbufferFormats,
                          "invalid color format for renderbuffer"
                        );
                      }
                    });
                  }
                }
              }
              if ("depthTexture" in options || "depthStencilTexture" in options) {
                depthStencilTexture = !!(options.depthTexture || options.depthStencilTexture);
                check$1(
                  !depthStencilTexture || extensions.webgl_depth_texture,
                  "webgl_depth_texture extension not supported"
                );
              }
              if ("depth" in options) {
                if (typeof options.depth === "boolean") {
                  needsDepth = options.depth;
                } else {
                  depthBuffer = options.depth;
                  needsStencil = false;
                }
              }
              if ("stencil" in options) {
                if (typeof options.stencil === "boolean") {
                  needsStencil = options.stencil;
                } else {
                  stencilBuffer = options.stencil;
                  needsDepth = false;
                }
              }
              if ("depthStencil" in options) {
                if (typeof options.depthStencil === "boolean") {
                  needsDepth = needsStencil = options.depthStencil;
                } else {
                  depthStencilBuffer = options.depthStencil;
                  needsDepth = false;
                  needsStencil = false;
                }
              }
            }
            var colorAttachments = null;
            var depthAttachment = null;
            var stencilAttachment = null;
            var depthStencilAttachment = null;
            if (Array.isArray(colorBuffer)) {
              colorAttachments = colorBuffer.map(parseAttachment);
            } else if (colorBuffer) {
              colorAttachments = [parseAttachment(colorBuffer)];
            } else {
              colorAttachments = new Array(colorCount);
              for (i = 0; i < colorCount; ++i) {
                colorAttachments[i] = allocAttachment(
                  width,
                  height,
                  colorTexture,
                  colorFormat,
                  colorType
                );
              }
            }
            check$1(
              extensions.webgl_draw_buffers || colorAttachments.length <= 1,
              "you must enable the WEBGL_draw_buffers extension in order to use multiple color buffers."
            );
            check$1(
              colorAttachments.length <= limits.maxColorAttachments,
              "too many color attachments, not supported"
            );
            width = width || colorAttachments[0].width;
            height = height || colorAttachments[0].height;
            if (depthBuffer) {
              depthAttachment = parseAttachment(depthBuffer);
            } else if (needsDepth && !needsStencil) {
              depthAttachment = allocAttachment(
                width,
                height,
                depthStencilTexture,
                "depth",
                "uint32"
              );
            }
            if (stencilBuffer) {
              stencilAttachment = parseAttachment(stencilBuffer);
            } else if (needsStencil && !needsDepth) {
              stencilAttachment = allocAttachment(
                width,
                height,
                false,
                "stencil",
                "uint8"
              );
            }
            if (depthStencilBuffer) {
              depthStencilAttachment = parseAttachment(depthStencilBuffer);
            } else if (!depthBuffer && !stencilBuffer && needsStencil && needsDepth) {
              depthStencilAttachment = allocAttachment(
                width,
                height,
                depthStencilTexture,
                "depth stencil",
                "depth stencil"
              );
            }
            check$1(
              !!depthBuffer + !!stencilBuffer + !!depthStencilBuffer <= 1,
              "invalid framebuffer configuration, can specify exactly one depth/stencil attachment"
            );
            var commonColorAttachmentSize = null;
            for (i = 0; i < colorAttachments.length; ++i) {
              incRefAndCheckShape(colorAttachments[i], width, height);
              check$1(
                !colorAttachments[i] || colorAttachments[i].texture && colorTextureFormatEnums.indexOf(colorAttachments[i].texture._texture.format) >= 0 || colorAttachments[i].renderbuffer && colorRenderbufferFormatEnums.indexOf(colorAttachments[i].renderbuffer._renderbuffer.format) >= 0,
                "framebuffer color attachment " + i + " is invalid"
              );
              if (colorAttachments[i] && colorAttachments[i].texture) {
                var colorAttachmentSize = textureFormatChannels[colorAttachments[i].texture._texture.format] * textureTypeSizes[colorAttachments[i].texture._texture.type];
                if (commonColorAttachmentSize === null) {
                  commonColorAttachmentSize = colorAttachmentSize;
                } else {
                  check$1(
                    commonColorAttachmentSize === colorAttachmentSize,
                    "all color attachments much have the same number of bits per pixel."
                  );
                }
              }
            }
            incRefAndCheckShape(depthAttachment, width, height);
            check$1(
              !depthAttachment || depthAttachment.texture && depthAttachment.texture._texture.format === GL_DEPTH_COMPONENT$1 || depthAttachment.renderbuffer && depthAttachment.renderbuffer._renderbuffer.format === GL_DEPTH_COMPONENT16$1,
              "invalid depth attachment for framebuffer object"
            );
            incRefAndCheckShape(stencilAttachment, width, height);
            check$1(
              !stencilAttachment || stencilAttachment.renderbuffer && stencilAttachment.renderbuffer._renderbuffer.format === GL_STENCIL_INDEX8$1,
              "invalid stencil attachment for framebuffer object"
            );
            incRefAndCheckShape(depthStencilAttachment, width, height);
            check$1(
              !depthStencilAttachment || depthStencilAttachment.texture && depthStencilAttachment.texture._texture.format === GL_DEPTH_STENCIL$2 || depthStencilAttachment.renderbuffer && depthStencilAttachment.renderbuffer._renderbuffer.format === GL_DEPTH_STENCIL$2,
              "invalid depth-stencil attachment for framebuffer object"
            );
            decFBORefs(framebuffer);
            framebuffer.width = width;
            framebuffer.height = height;
            framebuffer.colorAttachments = colorAttachments;
            framebuffer.depthAttachment = depthAttachment;
            framebuffer.stencilAttachment = stencilAttachment;
            framebuffer.depthStencilAttachment = depthStencilAttachment;
            reglFramebuffer.color = colorAttachments.map(unwrapAttachment);
            reglFramebuffer.depth = unwrapAttachment(depthAttachment);
            reglFramebuffer.stencil = unwrapAttachment(stencilAttachment);
            reglFramebuffer.depthStencil = unwrapAttachment(depthStencilAttachment);
            reglFramebuffer.width = framebuffer.width;
            reglFramebuffer.height = framebuffer.height;
            updateFramebuffer(framebuffer);
            return reglFramebuffer;
          }
          function resize(w_, h_) {
            check$1(
              framebufferState.next !== framebuffer,
              "can not resize a framebuffer which is currently in use"
            );
            var w = Math.max(w_ | 0, 1);
            var h = Math.max(h_ | 0 || w, 1);
            if (w === framebuffer.width && h === framebuffer.height) {
              return reglFramebuffer;
            }
            var colorAttachments = framebuffer.colorAttachments;
            for (var i = 0; i < colorAttachments.length; ++i) {
              resizeAttachment(colorAttachments[i], w, h);
            }
            resizeAttachment(framebuffer.depthAttachment, w, h);
            resizeAttachment(framebuffer.stencilAttachment, w, h);
            resizeAttachment(framebuffer.depthStencilAttachment, w, h);
            framebuffer.width = reglFramebuffer.width = w;
            framebuffer.height = reglFramebuffer.height = h;
            updateFramebuffer(framebuffer);
            return reglFramebuffer;
          }
          reglFramebuffer(a0, a1);
          return extend(reglFramebuffer, {
            resize,
            _reglType: "framebuffer",
            _framebuffer: framebuffer,
            destroy: function() {
              destroy(framebuffer);
              decFBORefs(framebuffer);
            },
            use: function(block) {
              framebufferState.setFBO({
                framebuffer: reglFramebuffer
              }, block);
            }
          });
        }
        function createCubeFBO(options) {
          var faces = Array(6);
          function reglFramebufferCube(a) {
            var i;
            check$1(
              faces.indexOf(framebufferState.next) < 0,
              "can not update framebuffer which is currently in use"
            );
            var params = {
              color: null
            };
            var radius = 0;
            var colorBuffer = null;
            var colorFormat = "rgba";
            var colorType = "uint8";
            var colorCount = 1;
            if (typeof a === "number") {
              radius = a | 0;
            } else if (!a) {
              radius = 1;
            } else {
              check$1.type(a, "object", "invalid arguments for framebuffer");
              var options2 = a;
              if ("shape" in options2) {
                var shape = options2.shape;
                check$1(
                  Array.isArray(shape) && shape.length >= 2,
                  "invalid shape for framebuffer"
                );
                check$1(
                  shape[0] === shape[1],
                  "cube framebuffer must be square"
                );
                radius = shape[0];
              } else {
                if ("radius" in options2) {
                  radius = options2.radius | 0;
                }
                if ("width" in options2) {
                  radius = options2.width | 0;
                  if ("height" in options2) {
                    check$1(options2.height === radius, "must be square");
                  }
                } else if ("height" in options2) {
                  radius = options2.height | 0;
                }
              }
              if ("color" in options2 || "colors" in options2) {
                colorBuffer = options2.color || options2.colors;
                if (Array.isArray(colorBuffer)) {
                  check$1(
                    colorBuffer.length === 1 || extensions.webgl_draw_buffers,
                    "multiple render targets not supported"
                  );
                }
              }
              if (!colorBuffer) {
                if ("colorCount" in options2) {
                  colorCount = options2.colorCount | 0;
                  check$1(colorCount > 0, "invalid color buffer count");
                }
                if ("colorType" in options2) {
                  check$1.oneOf(
                    options2.colorType,
                    colorTypes,
                    "invalid color type"
                  );
                  colorType = options2.colorType;
                }
                if ("colorFormat" in options2) {
                  colorFormat = options2.colorFormat;
                  check$1.oneOf(
                    options2.colorFormat,
                    colorTextureFormats,
                    "invalid color format for texture"
                  );
                }
              }
              if ("depth" in options2) {
                params.depth = options2.depth;
              }
              if ("stencil" in options2) {
                params.stencil = options2.stencil;
              }
              if ("depthStencil" in options2) {
                params.depthStencil = options2.depthStencil;
              }
            }
            var colorCubes;
            if (colorBuffer) {
              if (Array.isArray(colorBuffer)) {
                colorCubes = [];
                for (i = 0; i < colorBuffer.length; ++i) {
                  colorCubes[i] = colorBuffer[i];
                }
              } else {
                colorCubes = [colorBuffer];
              }
            } else {
              colorCubes = Array(colorCount);
              var cubeMapParams = {
                radius,
                format: colorFormat,
                type: colorType
              };
              for (i = 0; i < colorCount; ++i) {
                colorCubes[i] = textureState.createCube(cubeMapParams);
              }
            }
            params.color = Array(colorCubes.length);
            for (i = 0; i < colorCubes.length; ++i) {
              var cube = colorCubes[i];
              check$1(
                typeof cube === "function" && cube._reglType === "textureCube",
                "invalid cube map"
              );
              radius = radius || cube.width;
              check$1(
                cube.width === radius && cube.height === radius,
                "invalid cube map shape"
              );
              params.color[i] = {
                target: GL_TEXTURE_CUBE_MAP_POSITIVE_X$2,
                data: colorCubes[i]
              };
            }
            for (i = 0; i < 6; ++i) {
              for (var j = 0; j < colorCubes.length; ++j) {
                params.color[j].target = GL_TEXTURE_CUBE_MAP_POSITIVE_X$2 + i;
              }
              if (i > 0) {
                params.depth = faces[0].depth;
                params.stencil = faces[0].stencil;
                params.depthStencil = faces[0].depthStencil;
              }
              if (faces[i]) {
                faces[i](params);
              } else {
                faces[i] = createFBO(params);
              }
            }
            return extend(reglFramebufferCube, {
              width: radius,
              height: radius,
              color: colorCubes
            });
          }
          function resize(radius_) {
            var i;
            var radius = radius_ | 0;
            check$1(
              radius > 0 && radius <= limits.maxCubeMapSize,
              "invalid radius for cube fbo"
            );
            if (radius === reglFramebufferCube.width) {
              return reglFramebufferCube;
            }
            var colors = reglFramebufferCube.color;
            for (i = 0; i < colors.length; ++i) {
              colors[i].resize(radius);
            }
            for (i = 0; i < 6; ++i) {
              faces[i].resize(radius);
            }
            reglFramebufferCube.width = reglFramebufferCube.height = radius;
            return reglFramebufferCube;
          }
          reglFramebufferCube(options);
          return extend(reglFramebufferCube, {
            faces,
            resize,
            _reglType: "framebufferCube",
            destroy: function() {
              faces.forEach(function(f) {
                f.destroy();
              });
            }
          });
        }
        function restoreFramebuffers() {
          framebufferState.cur = null;
          framebufferState.next = null;
          framebufferState.dirty = true;
          values(framebufferSet).forEach(function(fb) {
            fb.framebuffer = gl.createFramebuffer();
            updateFramebuffer(fb);
          });
        }
        return extend(framebufferState, {
          getFramebuffer: function(object) {
            if (typeof object === "function" && object._reglType === "framebuffer") {
              var fbo = object._framebuffer;
              if (fbo instanceof REGLFramebuffer) {
                return fbo;
              }
            }
            return null;
          },
          create: createFBO,
          createCube: createCubeFBO,
          clear: function() {
            values(framebufferSet).forEach(destroy);
          },
          restore: restoreFramebuffers
        });
      }
      var GL_FLOAT$6 = 5126;
      var GL_ARRAY_BUFFER$1 = 34962;
      var GL_ELEMENT_ARRAY_BUFFER$1 = 34963;
      var VAO_OPTIONS = [
        "attributes",
        "elements",
        "offset",
        "count",
        "primitive",
        "instances"
      ];
      function AttributeRecord() {
        this.state = 0;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 0;
        this.buffer = null;
        this.size = 0;
        this.normalized = false;
        this.type = GL_FLOAT$6;
        this.offset = 0;
        this.stride = 0;
        this.divisor = 0;
      }
      function wrapAttributeState(gl, extensions, limits, stats2, bufferState, elementState, drawState) {
        var NUM_ATTRIBUTES = limits.maxAttributes;
        var attributeBindings = new Array(NUM_ATTRIBUTES);
        for (var i = 0; i < NUM_ATTRIBUTES; ++i) {
          attributeBindings[i] = new AttributeRecord();
        }
        var vaoCount = 0;
        var vaoSet = {};
        var state = {
          Record: AttributeRecord,
          scope: {},
          state: attributeBindings,
          currentVAO: null,
          targetVAO: null,
          restore: extVAO() ? restoreVAO : function() {
          },
          createVAO,
          getVAO,
          destroyBuffer,
          setVAO: extVAO() ? setVAOEXT : setVAOEmulated,
          clear: extVAO() ? destroyVAOEXT : function() {
          }
        };
        function destroyBuffer(buffer) {
          for (var i2 = 0; i2 < attributeBindings.length; ++i2) {
            var record = attributeBindings[i2];
            if (record.buffer === buffer) {
              gl.disableVertexAttribArray(i2);
              record.buffer = null;
            }
          }
        }
        function extVAO() {
          return extensions.oes_vertex_array_object;
        }
        function extInstanced() {
          return extensions.angle_instanced_arrays;
        }
        function getVAO(vao) {
          if (typeof vao === "function" && vao._vao) {
            return vao._vao;
          }
          return null;
        }
        function setVAOEXT(vao) {
          if (vao === state.currentVAO) {
            return;
          }
          var ext = extVAO();
          if (vao) {
            ext.bindVertexArrayOES(vao.vao);
          } else {
            ext.bindVertexArrayOES(null);
          }
          state.currentVAO = vao;
        }
        function setVAOEmulated(vao) {
          if (vao === state.currentVAO) {
            return;
          }
          if (vao) {
            vao.bindAttrs();
          } else {
            var exti = extInstanced();
            for (var i2 = 0; i2 < attributeBindings.length; ++i2) {
              var binding = attributeBindings[i2];
              if (binding.buffer) {
                gl.enableVertexAttribArray(i2);
                binding.buffer.bind();
                gl.vertexAttribPointer(i2, binding.size, binding.type, binding.normalized, binding.stride, binding.offfset);
                if (exti && binding.divisor) {
                  exti.vertexAttribDivisorANGLE(i2, binding.divisor);
                }
              } else {
                gl.disableVertexAttribArray(i2);
                gl.vertexAttrib4f(i2, binding.x, binding.y, binding.z, binding.w);
              }
            }
            if (drawState.elements) {
              gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER$1, drawState.elements.buffer.buffer);
            } else {
              gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER$1, null);
            }
          }
          state.currentVAO = vao;
        }
        function destroyVAOEXT() {
          values(vaoSet).forEach(function(vao) {
            vao.destroy();
          });
        }
        function REGLVAO() {
          this.id = ++vaoCount;
          this.attributes = [];
          this.elements = null;
          this.ownsElements = false;
          this.count = 0;
          this.offset = 0;
          this.instances = -1;
          this.primitive = 4;
          var extension = extVAO();
          if (extension) {
            this.vao = extension.createVertexArrayOES();
          } else {
            this.vao = null;
          }
          vaoSet[this.id] = this;
          this.buffers = [];
        }
        REGLVAO.prototype.bindAttrs = function() {
          var exti = extInstanced();
          var attributes = this.attributes;
          for (var i2 = 0; i2 < attributes.length; ++i2) {
            var attr = attributes[i2];
            if (attr.buffer) {
              gl.enableVertexAttribArray(i2);
              gl.bindBuffer(GL_ARRAY_BUFFER$1, attr.buffer.buffer);
              gl.vertexAttribPointer(i2, attr.size, attr.type, attr.normalized, attr.stride, attr.offset);
              if (exti && attr.divisor) {
                exti.vertexAttribDivisorANGLE(i2, attr.divisor);
              }
            } else {
              gl.disableVertexAttribArray(i2);
              gl.vertexAttrib4f(i2, attr.x, attr.y, attr.z, attr.w);
            }
          }
          for (var j = attributes.length; j < NUM_ATTRIBUTES; ++j) {
            gl.disableVertexAttribArray(j);
          }
          var elements = elementState.getElements(this.elements);
          if (elements) {
            gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER$1, elements.buffer.buffer);
          } else {
            gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER$1, null);
          }
        };
        REGLVAO.prototype.refresh = function() {
          var ext = extVAO();
          if (ext) {
            ext.bindVertexArrayOES(this.vao);
            this.bindAttrs();
            state.currentVAO = null;
            ext.bindVertexArrayOES(null);
          }
        };
        REGLVAO.prototype.destroy = function() {
          if (this.vao) {
            var extension = extVAO();
            if (this === state.currentVAO) {
              state.currentVAO = null;
              extension.bindVertexArrayOES(null);
            }
            extension.deleteVertexArrayOES(this.vao);
            this.vao = null;
          }
          if (this.ownsElements) {
            this.elements.destroy();
            this.elements = null;
            this.ownsElements = false;
          }
          if (vaoSet[this.id]) {
            delete vaoSet[this.id];
            stats2.vaoCount -= 1;
          }
        };
        function restoreVAO() {
          var ext = extVAO();
          if (ext) {
            values(vaoSet).forEach(function(vao) {
              vao.refresh();
            });
          }
        }
        function createVAO(_attr) {
          var vao = new REGLVAO();
          stats2.vaoCount += 1;
          function updateVAO(options) {
            var attributes;
            if (Array.isArray(options)) {
              attributes = options;
              if (vao.elements && vao.ownsElements) {
                vao.elements.destroy();
              }
              vao.elements = null;
              vao.ownsElements = false;
              vao.offset = 0;
              vao.count = 0;
              vao.instances = -1;
              vao.primitive = 4;
            } else {
              check$1(typeof options === "object", "invalid arguments for create vao");
              check$1("attributes" in options, "must specify attributes for vao");
              if (options.elements) {
                var elements = options.elements;
                if (vao.ownsElements) {
                  if (typeof elements === "function" && elements._reglType === "elements") {
                    vao.elements.destroy();
                    vao.ownsElements = false;
                  } else {
                    vao.elements(elements);
                    vao.ownsElements = false;
                  }
                } else if (elementState.getElements(options.elements)) {
                  vao.elements = options.elements;
                  vao.ownsElements = false;
                } else {
                  vao.elements = elementState.create(options.elements);
                  vao.ownsElements = true;
                }
              } else {
                vao.elements = null;
                vao.ownsElements = false;
              }
              attributes = options.attributes;
              vao.offset = 0;
              vao.count = -1;
              vao.instances = -1;
              vao.primitive = 4;
              if (vao.elements) {
                vao.count = vao.elements._elements.vertCount;
                vao.primitive = vao.elements._elements.primType;
              }
              if ("offset" in options) {
                vao.offset = options.offset | 0;
              }
              if ("count" in options) {
                vao.count = options.count | 0;
              }
              if ("instances" in options) {
                vao.instances = options.instances | 0;
              }
              if ("primitive" in options) {
                check$1(options.primitive in primTypes, "bad primitive type: " + options.primitive);
                vao.primitive = primTypes[options.primitive];
              }
              check$1.optional(() => {
                var keys = Object.keys(options);
                for (var i3 = 0; i3 < keys.length; ++i3) {
                  check$1(VAO_OPTIONS.indexOf(keys[i3]) >= 0, 'invalid option for vao: "' + keys[i3] + '" valid options are ' + VAO_OPTIONS);
                }
              });
              check$1(Array.isArray(attributes), "attributes must be an array");
            }
            check$1(attributes.length < NUM_ATTRIBUTES, "too many attributes");
            check$1(attributes.length > 0, "must specify at least one attribute");
            var bufUpdated = {};
            var nattributes = vao.attributes;
            nattributes.length = attributes.length;
            for (var i2 = 0; i2 < attributes.length; ++i2) {
              var spec = attributes[i2];
              var rec = nattributes[i2] = new AttributeRecord();
              var data = spec.data || spec;
              if (Array.isArray(data) || isTypedArray(data) || isNDArrayLike(data)) {
                var buf;
                if (vao.buffers[i2]) {
                  buf = vao.buffers[i2];
                  if (isTypedArray(data) && buf._buffer.byteLength >= data.byteLength) {
                    buf.subdata(data);
                  } else {
                    buf.destroy();
                    vao.buffers[i2] = null;
                  }
                }
                if (!vao.buffers[i2]) {
                  buf = vao.buffers[i2] = bufferState.create(spec, GL_ARRAY_BUFFER$1, false, true);
                }
                rec.buffer = bufferState.getBuffer(buf);
                rec.size = rec.buffer.dimension | 0;
                rec.normalized = false;
                rec.type = rec.buffer.dtype;
                rec.offset = 0;
                rec.stride = 0;
                rec.divisor = 0;
                rec.state = 1;
                bufUpdated[i2] = 1;
              } else if (bufferState.getBuffer(spec)) {
                rec.buffer = bufferState.getBuffer(spec);
                rec.size = rec.buffer.dimension | 0;
                rec.normalized = false;
                rec.type = rec.buffer.dtype;
                rec.offset = 0;
                rec.stride = 0;
                rec.divisor = 0;
                rec.state = 1;
              } else if (bufferState.getBuffer(spec.buffer)) {
                rec.buffer = bufferState.getBuffer(spec.buffer);
                rec.size = (+spec.size || rec.buffer.dimension) | 0;
                rec.normalized = !!spec.normalized || false;
                if ("type" in spec) {
                  check$1.parameter(spec.type, glTypes, "invalid buffer type");
                  rec.type = glTypes[spec.type];
                } else {
                  rec.type = rec.buffer.dtype;
                }
                rec.offset = (spec.offset || 0) | 0;
                rec.stride = (spec.stride || 0) | 0;
                rec.divisor = (spec.divisor || 0) | 0;
                rec.state = 1;
                check$1(rec.size >= 1 && rec.size <= 4, "size must be between 1 and 4");
                check$1(rec.offset >= 0, "invalid offset");
                check$1(rec.stride >= 0 && rec.stride <= 255, "stride must be between 0 and 255");
                check$1(rec.divisor >= 0, "divisor must be positive");
                check$1(!rec.divisor || !!extensions.angle_instanced_arrays, "ANGLE_instanced_arrays must be enabled to use divisor");
              } else if ("x" in spec) {
                check$1(i2 > 0, "first attribute must not be a constant");
                rec.x = +spec.x || 0;
                rec.y = +spec.y || 0;
                rec.z = +spec.z || 0;
                rec.w = +spec.w || 0;
                rec.state = 2;
              } else {
                check$1(false, "invalid attribute spec for location " + i2);
              }
            }
            for (var j = 0; j < vao.buffers.length; ++j) {
              if (!bufUpdated[j] && vao.buffers[j]) {
                vao.buffers[j].destroy();
                vao.buffers[j] = null;
              }
            }
            vao.refresh();
            return updateVAO;
          }
          updateVAO.destroy = function() {
            for (var j = 0; j < vao.buffers.length; ++j) {
              if (vao.buffers[j]) {
                vao.buffers[j].destroy();
              }
            }
            vao.buffers.length = 0;
            if (vao.ownsElements) {
              vao.elements.destroy();
              vao.elements = null;
              vao.ownsElements = false;
            }
            vao.destroy();
          };
          updateVAO._vao = vao;
          updateVAO._reglType = "vao";
          return updateVAO(_attr);
        }
        return state;
      }
      var GL_FRAGMENT_SHADER = 35632;
      var GL_VERTEX_SHADER = 35633;
      var GL_ACTIVE_UNIFORMS = 35718;
      var GL_ACTIVE_ATTRIBUTES = 35721;
      function wrapShaderState(gl, stringStore, stats2, config) {
        var fragShaders = {};
        var vertShaders = {};
        function ActiveInfo(name, id, location, info) {
          this.name = name;
          this.id = id;
          this.location = location;
          this.info = info;
        }
        function insertActiveInfo(list, info) {
          for (var i = 0; i < list.length; ++i) {
            if (list[i].id === info.id) {
              list[i].location = info.location;
              return;
            }
          }
          list.push(info);
        }
        function getShader(type, id, command) {
          var cache = type === GL_FRAGMENT_SHADER ? fragShaders : vertShaders;
          var shader = cache[id];
          if (!shader) {
            var source = stringStore.str(id);
            shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            check$1.shaderError(gl, shader, source, type, command);
            cache[id] = shader;
          }
          return shader;
        }
        var programCache = {};
        var programList = [];
        var PROGRAM_COUNTER = 0;
        function REGLProgram(fragId, vertId) {
          this.id = PROGRAM_COUNTER++;
          this.fragId = fragId;
          this.vertId = vertId;
          this.program = null;
          this.uniforms = [];
          this.attributes = [];
          this.refCount = 1;
          if (config.profile) {
            this.stats = {
              uniformsCount: 0,
              attributesCount: 0
            };
          }
        }
        function linkProgram(desc, command, attributeLocations) {
          var i, info;
          var fragShader = getShader(GL_FRAGMENT_SHADER, desc.fragId);
          var vertShader = getShader(GL_VERTEX_SHADER, desc.vertId);
          var program = desc.program = gl.createProgram();
          gl.attachShader(program, fragShader);
          gl.attachShader(program, vertShader);
          if (attributeLocations) {
            for (i = 0; i < attributeLocations.length; ++i) {
              var binding = attributeLocations[i];
              gl.bindAttribLocation(program, binding[0], binding[1]);
            }
          }
          gl.linkProgram(program);
          check$1.linkError(
            gl,
            program,
            stringStore.str(desc.fragId),
            stringStore.str(desc.vertId),
            command
          );
          var numUniforms = gl.getProgramParameter(program, GL_ACTIVE_UNIFORMS);
          if (config.profile) {
            desc.stats.uniformsCount = numUniforms;
          }
          var uniforms = desc.uniforms;
          for (i = 0; i < numUniforms; ++i) {
            info = gl.getActiveUniform(program, i);
            if (info) {
              if (info.size > 1) {
                for (var j = 0; j < info.size; ++j) {
                  var name = info.name.replace("[0]", "[" + j + "]");
                  insertActiveInfo(uniforms, new ActiveInfo(
                    name,
                    stringStore.id(name),
                    gl.getUniformLocation(program, name),
                    info
                  ));
                }
              } else {
                insertActiveInfo(uniforms, new ActiveInfo(
                  info.name,
                  stringStore.id(info.name),
                  gl.getUniformLocation(program, info.name),
                  info
                ));
              }
            }
          }
          var numAttributes = gl.getProgramParameter(program, GL_ACTIVE_ATTRIBUTES);
          if (config.profile) {
            desc.stats.attributesCount = numAttributes;
          }
          var attributes = desc.attributes;
          for (i = 0; i < numAttributes; ++i) {
            info = gl.getActiveAttrib(program, i);
            if (info) {
              insertActiveInfo(attributes, new ActiveInfo(
                info.name,
                stringStore.id(info.name),
                gl.getAttribLocation(program, info.name),
                info
              ));
            }
          }
        }
        if (config.profile) {
          stats2.getMaxUniformsCount = function() {
            var m = 0;
            programList.forEach(function(desc) {
              if (desc.stats.uniformsCount > m) {
                m = desc.stats.uniformsCount;
              }
            });
            return m;
          };
          stats2.getMaxAttributesCount = function() {
            var m = 0;
            programList.forEach(function(desc) {
              if (desc.stats.attributesCount > m) {
                m = desc.stats.attributesCount;
              }
            });
            return m;
          };
        }
        function restoreShaders() {
          fragShaders = {};
          vertShaders = {};
          for (var i = 0; i < programList.length; ++i) {
            linkProgram(programList[i], null, programList[i].attributes.map(function(info) {
              return [info.location, info.name];
            }));
          }
        }
        return {
          clear: function() {
            var deleteShader = gl.deleteShader.bind(gl);
            values(fragShaders).forEach(deleteShader);
            fragShaders = {};
            values(vertShaders).forEach(deleteShader);
            vertShaders = {};
            programList.forEach(function(desc) {
              gl.deleteProgram(desc.program);
            });
            programList.length = 0;
            programCache = {};
            stats2.shaderCount = 0;
          },
          program: function(vertId, fragId, command, attribLocations) {
            check$1.command(vertId >= 0, "missing vertex shader", command);
            check$1.command(fragId >= 0, "missing fragment shader", command);
            var cache = programCache[fragId];
            if (!cache) {
              cache = programCache[fragId] = {};
            }
            var prevProgram = cache[vertId];
            if (prevProgram) {
              prevProgram.refCount++;
              if (!attribLocations) {
                return prevProgram;
              }
            }
            var program = new REGLProgram(fragId, vertId);
            stats2.shaderCount++;
            linkProgram(program, command, attribLocations);
            if (!prevProgram) {
              cache[vertId] = program;
            }
            programList.push(program);
            return extend(program, {
              destroy: function() {
                program.refCount--;
                if (program.refCount <= 0) {
                  gl.deleteProgram(program.program);
                  var idx = programList.indexOf(program);
                  programList.splice(idx, 1);
                  stats2.shaderCount--;
                }
                if (cache[program.vertId].refCount <= 0) {
                  gl.deleteShader(vertShaders[program.vertId]);
                  delete vertShaders[program.vertId];
                  delete programCache[program.fragId][program.vertId];
                }
                if (!Object.keys(programCache[program.fragId]).length) {
                  gl.deleteShader(fragShaders[program.fragId]);
                  delete fragShaders[program.fragId];
                  delete programCache[program.fragId];
                }
              }
            });
          },
          restore: restoreShaders,
          shader: getShader,
          frag: -1,
          vert: -1
        };
      }
      var GL_RGBA$3 = 6408;
      var GL_UNSIGNED_BYTE$7 = 5121;
      var GL_PACK_ALIGNMENT = 3333;
      var GL_FLOAT$7 = 5126;
      function wrapReadPixels(gl, framebufferState, reglPoll, context, glAttributes, extensions, limits) {
        function readPixelsImpl(input) {
          var type;
          if (framebufferState.next === null) {
            check$1(
              glAttributes.preserveDrawingBuffer,
              'you must create a webgl context with "preserveDrawingBuffer":true in order to read pixels from the drawing buffer'
            );
            type = GL_UNSIGNED_BYTE$7;
          } else {
            check$1(
              framebufferState.next.colorAttachments[0].texture !== null,
              "You cannot read from a renderbuffer"
            );
            type = framebufferState.next.colorAttachments[0].texture._texture.type;
            check$1.optional(function() {
              if (extensions.oes_texture_float) {
                check$1(
                  type === GL_UNSIGNED_BYTE$7 || type === GL_FLOAT$7,
                  "Reading from a framebuffer is only allowed for the types 'uint8' and 'float'"
                );
                if (type === GL_FLOAT$7) {
                  check$1(limits.readFloat, "Reading 'float' values is not permitted in your browser. For a fallback, please see: https://www.npmjs.com/package/glsl-read-float");
                }
              } else {
                check$1(
                  type === GL_UNSIGNED_BYTE$7,
                  "Reading from a framebuffer is only allowed for the type 'uint8'"
                );
              }
            });
          }
          var x = 0;
          var y = 0;
          var width = context.framebufferWidth;
          var height = context.framebufferHeight;
          var data = null;
          if (isTypedArray(input)) {
            data = input;
          } else if (input) {
            check$1.type(input, "object", "invalid arguments to regl.read()");
            x = input.x | 0;
            y = input.y | 0;
            check$1(
              x >= 0 && x < context.framebufferWidth,
              "invalid x offset for regl.read"
            );
            check$1(
              y >= 0 && y < context.framebufferHeight,
              "invalid y offset for regl.read"
            );
            width = (input.width || context.framebufferWidth - x) | 0;
            height = (input.height || context.framebufferHeight - y) | 0;
            data = input.data || null;
          }
          if (data) {
            if (type === GL_UNSIGNED_BYTE$7) {
              check$1(
                data instanceof Uint8Array,
                "buffer must be 'Uint8Array' when reading from a framebuffer of type 'uint8'"
              );
            } else if (type === GL_FLOAT$7) {
              check$1(
                data instanceof Float32Array,
                "buffer must be 'Float32Array' when reading from a framebuffer of type 'float'"
              );
            }
          }
          check$1(
            width > 0 && width + x <= context.framebufferWidth,
            "invalid width for read pixels"
          );
          check$1(
            height > 0 && height + y <= context.framebufferHeight,
            "invalid height for read pixels"
          );
          reglPoll();
          var size = width * height * 4;
          if (!data) {
            if (type === GL_UNSIGNED_BYTE$7) {
              data = new Uint8Array(size);
            } else if (type === GL_FLOAT$7) {
              data = data || new Float32Array(size);
            }
          }
          check$1.isTypedArray(data, "data buffer for regl.read() must be a typedarray");
          check$1(data.byteLength >= size, "data buffer for regl.read() too small");
          gl.pixelStorei(GL_PACK_ALIGNMENT, 4);
          gl.readPixels(
            x,
            y,
            width,
            height,
            GL_RGBA$3,
            type,
            data
          );
          return data;
        }
        function readPixelsFBO(options) {
          var result;
          framebufferState.setFBO({
            framebuffer: options.framebuffer
          }, function() {
            result = readPixelsImpl(options);
          });
          return result;
        }
        function readPixels(options) {
          if (!options || !("framebuffer" in options)) {
            return readPixelsImpl(options);
          } else {
            return readPixelsFBO(options);
          }
        }
        return readPixels;
      }
      function slice(x) {
        return Array.prototype.slice.call(x);
      }
      function join(x) {
        return slice(x).join("");
      }
      function createEnvironment() {
        var varCounter = 0;
        var linkedNames = [];
        var linkedValues = [];
        function link(value) {
          for (var i = 0; i < linkedValues.length; ++i) {
            if (linkedValues[i] === value) {
              return linkedNames[i];
            }
          }
          var name = "g" + varCounter++;
          linkedNames.push(name);
          linkedValues.push(value);
          return name;
        }
        function block() {
          var code = [];
          function push() {
            code.push.apply(code, slice(arguments));
          }
          var vars = [];
          function def() {
            var name = "v" + varCounter++;
            vars.push(name);
            if (arguments.length > 0) {
              code.push(name, "=");
              code.push.apply(code, slice(arguments));
              code.push(";");
            }
            return name;
          }
          return extend(push, {
            def,
            toString: function() {
              return join([
                vars.length > 0 ? "var " + vars.join(",") + ";" : "",
                join(code)
              ]);
            }
          });
        }
        function scope() {
          var entry = block();
          var exit = block();
          var entryToString = entry.toString;
          var exitToString = exit.toString;
          function save(object, prop) {
            exit(object, prop, "=", entry.def(object, prop), ";");
          }
          return extend(function() {
            entry.apply(entry, slice(arguments));
          }, {
            def: entry.def,
            entry,
            exit,
            save,
            set: function(object, prop, value) {
              save(object, prop);
              entry(object, prop, "=", value, ";");
            },
            toString: function() {
              return entryToString() + exitToString();
            }
          });
        }
        function conditional() {
          var pred = join(arguments);
          var thenBlock = scope();
          var elseBlock = scope();
          var thenToString = thenBlock.toString;
          var elseToString = elseBlock.toString;
          return extend(thenBlock, {
            then: function() {
              thenBlock.apply(thenBlock, slice(arguments));
              return this;
            },
            else: function() {
              elseBlock.apply(elseBlock, slice(arguments));
              return this;
            },
            toString: function() {
              var elseClause = elseToString();
              if (elseClause) {
                elseClause = "else{" + elseClause + "}";
              }
              return join([
                "if(",
                pred,
                "){",
                thenToString(),
                "}",
                elseClause
              ]);
            }
          });
        }
        var globalBlock = block();
        var procedures = {};
        function proc(name, count) {
          var args = [];
          function arg() {
            var name2 = "a" + args.length;
            args.push(name2);
            return name2;
          }
          count = count || 0;
          for (var i = 0; i < count; ++i) {
            arg();
          }
          var body = scope();
          var bodyToString = body.toString;
          var result = procedures[name] = extend(body, {
            arg,
            toString: function() {
              return join([
                "function(",
                args.join(),
                "){",
                bodyToString(),
                "}"
              ]);
            }
          });
          return result;
        }
        function compile() {
          var code = [
            '"use strict";',
            globalBlock,
            "return {"
          ];
          Object.keys(procedures).forEach(function(name) {
            code.push('"', name, '":', procedures[name].toString(), ",");
          });
          code.push("}");
          var src = join(code).replace(/;/g, ";\n").replace(/}/g, "}\n").replace(/{/g, "{\n");
          var proc2 = Function.apply(null, linkedNames.concat(src));
          return proc2.apply(null, linkedValues);
        }
        return {
          global: globalBlock,
          link,
          block,
          proc,
          scope,
          cond: conditional,
          compile
        };
      }
      var CUTE_COMPONENTS = "xyzw".split("");
      var GL_UNSIGNED_BYTE$8 = 5121;
      var ATTRIB_STATE_POINTER = 1;
      var ATTRIB_STATE_CONSTANT = 2;
      var DYN_FUNC$1 = 0;
      var DYN_PROP$1 = 1;
      var DYN_CONTEXT$1 = 2;
      var DYN_STATE$1 = 3;
      var DYN_THUNK = 4;
      var DYN_CONSTANT$1 = 5;
      var DYN_ARRAY$1 = 6;
      var S_DITHER = "dither";
      var S_BLEND_ENABLE = "blend.enable";
      var S_BLEND_COLOR = "blend.color";
      var S_BLEND_EQUATION = "blend.equation";
      var S_BLEND_FUNC = "blend.func";
      var S_DEPTH_ENABLE = "depth.enable";
      var S_DEPTH_FUNC = "depth.func";
      var S_DEPTH_RANGE = "depth.range";
      var S_DEPTH_MASK = "depth.mask";
      var S_COLOR_MASK = "colorMask";
      var S_CULL_ENABLE = "cull.enable";
      var S_CULL_FACE = "cull.face";
      var S_FRONT_FACE = "frontFace";
      var S_LINE_WIDTH = "lineWidth";
      var S_POLYGON_OFFSET_ENABLE = "polygonOffset.enable";
      var S_POLYGON_OFFSET_OFFSET = "polygonOffset.offset";
      var S_SAMPLE_ALPHA = "sample.alpha";
      var S_SAMPLE_ENABLE = "sample.enable";
      var S_SAMPLE_COVERAGE = "sample.coverage";
      var S_STENCIL_ENABLE = "stencil.enable";
      var S_STENCIL_MASK = "stencil.mask";
      var S_STENCIL_FUNC = "stencil.func";
      var S_STENCIL_OPFRONT = "stencil.opFront";
      var S_STENCIL_OPBACK = "stencil.opBack";
      var S_SCISSOR_ENABLE = "scissor.enable";
      var S_SCISSOR_BOX = "scissor.box";
      var S_VIEWPORT = "viewport";
      var S_PROFILE = "profile";
      var S_FRAMEBUFFER = "framebuffer";
      var S_VERT = "vert";
      var S_FRAG = "frag";
      var S_ELEMENTS = "elements";
      var S_PRIMITIVE = "primitive";
      var S_COUNT = "count";
      var S_OFFSET = "offset";
      var S_INSTANCES = "instances";
      var S_VAO = "vao";
      var SUFFIX_WIDTH = "Width";
      var SUFFIX_HEIGHT = "Height";
      var S_FRAMEBUFFER_WIDTH = S_FRAMEBUFFER + SUFFIX_WIDTH;
      var S_FRAMEBUFFER_HEIGHT = S_FRAMEBUFFER + SUFFIX_HEIGHT;
      var S_VIEWPORT_WIDTH = S_VIEWPORT + SUFFIX_WIDTH;
      var S_VIEWPORT_HEIGHT = S_VIEWPORT + SUFFIX_HEIGHT;
      var S_DRAWINGBUFFER = "drawingBuffer";
      var S_DRAWINGBUFFER_WIDTH = S_DRAWINGBUFFER + SUFFIX_WIDTH;
      var S_DRAWINGBUFFER_HEIGHT = S_DRAWINGBUFFER + SUFFIX_HEIGHT;
      var NESTED_OPTIONS = [
        S_BLEND_FUNC,
        S_BLEND_EQUATION,
        S_STENCIL_FUNC,
        S_STENCIL_OPFRONT,
        S_STENCIL_OPBACK,
        S_SAMPLE_COVERAGE,
        S_VIEWPORT,
        S_SCISSOR_BOX,
        S_POLYGON_OFFSET_OFFSET
      ];
      var GL_ARRAY_BUFFER$2 = 34962;
      var GL_ELEMENT_ARRAY_BUFFER$2 = 34963;
      var GL_FRAGMENT_SHADER$1 = 35632;
      var GL_VERTEX_SHADER$1 = 35633;
      var GL_TEXTURE_2D$3 = 3553;
      var GL_TEXTURE_CUBE_MAP$2 = 34067;
      var GL_CULL_FACE = 2884;
      var GL_BLEND = 3042;
      var GL_DITHER = 3024;
      var GL_STENCIL_TEST = 2960;
      var GL_DEPTH_TEST = 2929;
      var GL_SCISSOR_TEST = 3089;
      var GL_POLYGON_OFFSET_FILL = 32823;
      var GL_SAMPLE_ALPHA_TO_COVERAGE = 32926;
      var GL_SAMPLE_COVERAGE = 32928;
      var GL_FLOAT$8 = 5126;
      var GL_FLOAT_VEC2 = 35664;
      var GL_FLOAT_VEC3 = 35665;
      var GL_FLOAT_VEC4 = 35666;
      var GL_INT$3 = 5124;
      var GL_INT_VEC2 = 35667;
      var GL_INT_VEC3 = 35668;
      var GL_INT_VEC4 = 35669;
      var GL_BOOL = 35670;
      var GL_BOOL_VEC2 = 35671;
      var GL_BOOL_VEC3 = 35672;
      var GL_BOOL_VEC4 = 35673;
      var GL_FLOAT_MAT2 = 35674;
      var GL_FLOAT_MAT3 = 35675;
      var GL_FLOAT_MAT4 = 35676;
      var GL_SAMPLER_2D = 35678;
      var GL_SAMPLER_CUBE = 35680;
      var GL_TRIANGLES$1 = 4;
      var GL_FRONT = 1028;
      var GL_BACK = 1029;
      var GL_CW = 2304;
      var GL_CCW = 2305;
      var GL_MIN_EXT = 32775;
      var GL_MAX_EXT = 32776;
      var GL_ALWAYS = 519;
      var GL_KEEP = 7680;
      var GL_ZERO = 0;
      var GL_ONE = 1;
      var GL_FUNC_ADD = 32774;
      var GL_LESS = 513;
      var GL_FRAMEBUFFER$2 = 36160;
      var GL_COLOR_ATTACHMENT0$2 = 36064;
      var blendFuncs = {
        "0": 0,
        "1": 1,
        "zero": 0,
        "one": 1,
        "src color": 768,
        "one minus src color": 769,
        "src alpha": 770,
        "one minus src alpha": 771,
        "dst color": 774,
        "one minus dst color": 775,
        "dst alpha": 772,
        "one minus dst alpha": 773,
        "constant color": 32769,
        "one minus constant color": 32770,
        "constant alpha": 32771,
        "one minus constant alpha": 32772,
        "src alpha saturate": 776
      };
      var invalidBlendCombinations = [
        "constant color, constant alpha",
        "one minus constant color, constant alpha",
        "constant color, one minus constant alpha",
        "one minus constant color, one minus constant alpha",
        "constant alpha, constant color",
        "constant alpha, one minus constant color",
        "one minus constant alpha, constant color",
        "one minus constant alpha, one minus constant color"
      ];
      var compareFuncs = {
        "never": 512,
        "less": 513,
        "<": 513,
        "equal": 514,
        "=": 514,
        "==": 514,
        "===": 514,
        "lequal": 515,
        "<=": 515,
        "greater": 516,
        ">": 516,
        "notequal": 517,
        "!=": 517,
        "!==": 517,
        "gequal": 518,
        ">=": 518,
        "always": 519
      };
      var stencilOps = {
        "0": 0,
        "zero": 0,
        "keep": 7680,
        "replace": 7681,
        "increment": 7682,
        "decrement": 7683,
        "increment wrap": 34055,
        "decrement wrap": 34056,
        "invert": 5386
      };
      var shaderType = {
        "frag": GL_FRAGMENT_SHADER$1,
        "vert": GL_VERTEX_SHADER$1
      };
      var orientationType = {
        "cw": GL_CW,
        "ccw": GL_CCW
      };
      function isBufferArgs(x) {
        return Array.isArray(x) || isTypedArray(x) || isNDArrayLike(x);
      }
      function sortState(state) {
        return state.sort(function(a, b) {
          if (a === S_VIEWPORT) {
            return -1;
          } else if (b === S_VIEWPORT) {
            return 1;
          }
          return a < b ? -1 : 1;
        });
      }
      function Declaration(thisDep, contextDep, propDep, append) {
        this.thisDep = thisDep;
        this.contextDep = contextDep;
        this.propDep = propDep;
        this.append = append;
      }
      function isStatic(decl) {
        return decl && !(decl.thisDep || decl.contextDep || decl.propDep);
      }
      function createStaticDecl(append) {
        return new Declaration(false, false, false, append);
      }
      function createDynamicDecl(dyn, append) {
        var type = dyn.type;
        if (type === DYN_FUNC$1) {
          var numArgs = dyn.data.length;
          return new Declaration(
            true,
            numArgs >= 1,
            numArgs >= 2,
            append
          );
        } else if (type === DYN_THUNK) {
          var data = dyn.data;
          return new Declaration(
            data.thisDep,
            data.contextDep,
            data.propDep,
            append
          );
        } else if (type === DYN_CONSTANT$1) {
          return new Declaration(
            false,
            false,
            false,
            append
          );
        } else if (type === DYN_ARRAY$1) {
          var thisDep = false;
          var contextDep = false;
          var propDep = false;
          for (var i = 0; i < dyn.data.length; ++i) {
            var subDyn = dyn.data[i];
            if (subDyn.type === DYN_PROP$1) {
              propDep = true;
            } else if (subDyn.type === DYN_CONTEXT$1) {
              contextDep = true;
            } else if (subDyn.type === DYN_STATE$1) {
              thisDep = true;
            } else if (subDyn.type === DYN_FUNC$1) {
              thisDep = true;
              var subArgs = subDyn.data;
              if (subArgs >= 1) {
                contextDep = true;
              }
              if (subArgs >= 2) {
                propDep = true;
              }
            } else if (subDyn.type === DYN_THUNK) {
              thisDep = thisDep || subDyn.data.thisDep;
              contextDep = contextDep || subDyn.data.contextDep;
              propDep = propDep || subDyn.data.propDep;
            }
          }
          return new Declaration(
            thisDep,
            contextDep,
            propDep,
            append
          );
        } else {
          return new Declaration(
            type === DYN_STATE$1,
            type === DYN_CONTEXT$1,
            type === DYN_PROP$1,
            append
          );
        }
      }
      var SCOPE_DECL = new Declaration(false, false, false, function() {
      });
      function reglCore(gl, stringStore, extensions, limits, bufferState, elementState, textureState, framebufferState, uniformState, attributeState, shaderState, drawState, contextState, timer, config) {
        var AttributeRecord2 = attributeState.Record;
        var blendEquations = {
          "add": 32774,
          "subtract": 32778,
          "reverse subtract": 32779
        };
        if (extensions.ext_blend_minmax) {
          blendEquations.min = GL_MIN_EXT;
          blendEquations.max = GL_MAX_EXT;
        }
        var extInstancing = extensions.angle_instanced_arrays;
        var extDrawBuffers = extensions.webgl_draw_buffers;
        var extVertexArrays = extensions.oes_vertex_array_object;
        var currentState = {
          dirty: true,
          profile: config.profile
        };
        var nextState = {};
        var GL_STATE_NAMES = [];
        var GL_FLAGS = {};
        var GL_VARIABLES = {};
        function propName(name) {
          return name.replace(".", "_");
        }
        function stateFlag(sname, cap, init) {
          var name = propName(sname);
          GL_STATE_NAMES.push(sname);
          nextState[name] = currentState[name] = !!init;
          GL_FLAGS[name] = cap;
        }
        function stateVariable(sname, func, init) {
          var name = propName(sname);
          GL_STATE_NAMES.push(sname);
          if (Array.isArray(init)) {
            currentState[name] = init.slice();
            nextState[name] = init.slice();
          } else {
            currentState[name] = nextState[name] = init;
          }
          GL_VARIABLES[name] = func;
        }
        stateFlag(S_DITHER, GL_DITHER);
        stateFlag(S_BLEND_ENABLE, GL_BLEND);
        stateVariable(S_BLEND_COLOR, "blendColor", [0, 0, 0, 0]);
        stateVariable(
          S_BLEND_EQUATION,
          "blendEquationSeparate",
          [GL_FUNC_ADD, GL_FUNC_ADD]
        );
        stateVariable(
          S_BLEND_FUNC,
          "blendFuncSeparate",
          [GL_ONE, GL_ZERO, GL_ONE, GL_ZERO]
        );
        stateFlag(S_DEPTH_ENABLE, GL_DEPTH_TEST, true);
        stateVariable(S_DEPTH_FUNC, "depthFunc", GL_LESS);
        stateVariable(S_DEPTH_RANGE, "depthRange", [0, 1]);
        stateVariable(S_DEPTH_MASK, "depthMask", true);
        stateVariable(S_COLOR_MASK, S_COLOR_MASK, [true, true, true, true]);
        stateFlag(S_CULL_ENABLE, GL_CULL_FACE);
        stateVariable(S_CULL_FACE, "cullFace", GL_BACK);
        stateVariable(S_FRONT_FACE, S_FRONT_FACE, GL_CCW);
        stateVariable(S_LINE_WIDTH, S_LINE_WIDTH, 1);
        stateFlag(S_POLYGON_OFFSET_ENABLE, GL_POLYGON_OFFSET_FILL);
        stateVariable(S_POLYGON_OFFSET_OFFSET, "polygonOffset", [0, 0]);
        stateFlag(S_SAMPLE_ALPHA, GL_SAMPLE_ALPHA_TO_COVERAGE);
        stateFlag(S_SAMPLE_ENABLE, GL_SAMPLE_COVERAGE);
        stateVariable(S_SAMPLE_COVERAGE, "sampleCoverage", [1, false]);
        stateFlag(S_STENCIL_ENABLE, GL_STENCIL_TEST);
        stateVariable(S_STENCIL_MASK, "stencilMask", -1);
        stateVariable(S_STENCIL_FUNC, "stencilFunc", [GL_ALWAYS, 0, -1]);
        stateVariable(
          S_STENCIL_OPFRONT,
          "stencilOpSeparate",
          [GL_FRONT, GL_KEEP, GL_KEEP, GL_KEEP]
        );
        stateVariable(
          S_STENCIL_OPBACK,
          "stencilOpSeparate",
          [GL_BACK, GL_KEEP, GL_KEEP, GL_KEEP]
        );
        stateFlag(S_SCISSOR_ENABLE, GL_SCISSOR_TEST);
        stateVariable(
          S_SCISSOR_BOX,
          "scissor",
          [0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight]
        );
        stateVariable(
          S_VIEWPORT,
          S_VIEWPORT,
          [0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight]
        );
        var sharedState = {
          gl,
          context: contextState,
          strings: stringStore,
          next: nextState,
          current: currentState,
          draw: drawState,
          elements: elementState,
          buffer: bufferState,
          shader: shaderState,
          attributes: attributeState.state,
          vao: attributeState,
          uniforms: uniformState,
          framebuffer: framebufferState,
          extensions,
          timer,
          isBufferArgs
        };
        var sharedConstants = {
          primTypes,
          compareFuncs,
          blendFuncs,
          blendEquations,
          stencilOps,
          glTypes,
          orientationType
        };
        check$1.optional(function() {
          sharedState.isArrayLike = isArrayLike;
        });
        if (extDrawBuffers) {
          sharedConstants.backBuffer = [GL_BACK];
          sharedConstants.drawBuffer = loop(limits.maxDrawbuffers, function(i) {
            if (i === 0) {
              return [0];
            }
            return loop(i, function(j) {
              return GL_COLOR_ATTACHMENT0$2 + j;
            });
          });
        }
        var drawCallCounter = 0;
        function createREGLEnvironment() {
          var env = createEnvironment();
          var link = env.link;
          var global = env.global;
          env.id = drawCallCounter++;
          env.batchId = "0";
          var SHARED = link(sharedState);
          var shared = env.shared = {
            props: "a0"
          };
          Object.keys(sharedState).forEach(function(prop) {
            shared[prop] = global.def(SHARED, ".", prop);
          });
          check$1.optional(function() {
            env.CHECK = link(check$1);
            env.commandStr = check$1.guessCommand();
            env.command = link(env.commandStr);
            env.assert = function(block, pred, message) {
              block(
                "if(!(",
                pred,
                "))",
                this.CHECK,
                ".commandRaise(",
                link(message),
                ",",
                this.command,
                ");"
              );
            };
            sharedConstants.invalidBlendCombinations = invalidBlendCombinations;
          });
          var nextVars = env.next = {};
          var currentVars = env.current = {};
          Object.keys(GL_VARIABLES).forEach(function(variable) {
            if (Array.isArray(currentState[variable])) {
              nextVars[variable] = global.def(shared.next, ".", variable);
              currentVars[variable] = global.def(shared.current, ".", variable);
            }
          });
          var constants = env.constants = {};
          Object.keys(sharedConstants).forEach(function(name) {
            constants[name] = global.def(JSON.stringify(sharedConstants[name]));
          });
          env.invoke = function(block, x) {
            switch (x.type) {
              case DYN_FUNC$1:
                var argList = [
                  "this",
                  shared.context,
                  shared.props,
                  env.batchId
                ];
                return block.def(
                  link(x.data),
                  ".call(",
                  argList.slice(0, Math.max(x.data.length + 1, 4)),
                  ")"
                );
              case DYN_PROP$1:
                return block.def(shared.props, x.data);
              case DYN_CONTEXT$1:
                return block.def(shared.context, x.data);
              case DYN_STATE$1:
                return block.def("this", x.data);
              case DYN_THUNK:
                x.data.append(env, block);
                return x.data.ref;
              case DYN_CONSTANT$1:
                return x.data.toString();
              case DYN_ARRAY$1:
                return x.data.map(function(y) {
                  return env.invoke(block, y);
                });
            }
          };
          env.attribCache = {};
          var scopeAttribs = {};
          env.scopeAttrib = function(name) {
            var id = stringStore.id(name);
            if (id in scopeAttribs) {
              return scopeAttribs[id];
            }
            var binding = attributeState.scope[id];
            if (!binding) {
              binding = attributeState.scope[id] = new AttributeRecord2();
            }
            var result = scopeAttribs[id] = link(binding);
            return result;
          };
          return env;
        }
        function parseProfile(options) {
          var staticOptions = options.static;
          var dynamicOptions = options.dynamic;
          var profileEnable;
          if (S_PROFILE in staticOptions) {
            var value = !!staticOptions[S_PROFILE];
            profileEnable = createStaticDecl(function(env, scope) {
              return value;
            });
            profileEnable.enable = value;
          } else if (S_PROFILE in dynamicOptions) {
            var dyn = dynamicOptions[S_PROFILE];
            profileEnable = createDynamicDecl(dyn, function(env, scope) {
              return env.invoke(scope, dyn);
            });
          }
          return profileEnable;
        }
        function parseFramebuffer(options, env) {
          var staticOptions = options.static;
          var dynamicOptions = options.dynamic;
          if (S_FRAMEBUFFER in staticOptions) {
            var framebuffer = staticOptions[S_FRAMEBUFFER];
            if (framebuffer) {
              framebuffer = framebufferState.getFramebuffer(framebuffer);
              check$1.command(framebuffer, "invalid framebuffer object");
              return createStaticDecl(function(env2, block) {
                var FRAMEBUFFER = env2.link(framebuffer);
                var shared = env2.shared;
                block.set(
                  shared.framebuffer,
                  ".next",
                  FRAMEBUFFER
                );
                var CONTEXT = shared.context;
                block.set(
                  CONTEXT,
                  "." + S_FRAMEBUFFER_WIDTH,
                  FRAMEBUFFER + ".width"
                );
                block.set(
                  CONTEXT,
                  "." + S_FRAMEBUFFER_HEIGHT,
                  FRAMEBUFFER + ".height"
                );
                return FRAMEBUFFER;
              });
            } else {
              return createStaticDecl(function(env2, scope) {
                var shared = env2.shared;
                scope.set(
                  shared.framebuffer,
                  ".next",
                  "null"
                );
                var CONTEXT = shared.context;
                scope.set(
                  CONTEXT,
                  "." + S_FRAMEBUFFER_WIDTH,
                  CONTEXT + "." + S_DRAWINGBUFFER_WIDTH
                );
                scope.set(
                  CONTEXT,
                  "." + S_FRAMEBUFFER_HEIGHT,
                  CONTEXT + "." + S_DRAWINGBUFFER_HEIGHT
                );
                return "null";
              });
            }
          } else if (S_FRAMEBUFFER in dynamicOptions) {
            var dyn = dynamicOptions[S_FRAMEBUFFER];
            return createDynamicDecl(dyn, function(env2, scope) {
              var FRAMEBUFFER_FUNC = env2.invoke(scope, dyn);
              var shared = env2.shared;
              var FRAMEBUFFER_STATE = shared.framebuffer;
              var FRAMEBUFFER = scope.def(
                FRAMEBUFFER_STATE,
                ".getFramebuffer(",
                FRAMEBUFFER_FUNC,
                ")"
              );
              check$1.optional(function() {
                env2.assert(
                  scope,
                  "!" + FRAMEBUFFER_FUNC + "||" + FRAMEBUFFER,
                  "invalid framebuffer object"
                );
              });
              scope.set(
                FRAMEBUFFER_STATE,
                ".next",
                FRAMEBUFFER
              );
              var CONTEXT = shared.context;
              scope.set(
                CONTEXT,
                "." + S_FRAMEBUFFER_WIDTH,
                FRAMEBUFFER + "?" + FRAMEBUFFER + ".width:" + CONTEXT + "." + S_DRAWINGBUFFER_WIDTH
              );
              scope.set(
                CONTEXT,
                "." + S_FRAMEBUFFER_HEIGHT,
                FRAMEBUFFER + "?" + FRAMEBUFFER + ".height:" + CONTEXT + "." + S_DRAWINGBUFFER_HEIGHT
              );
              return FRAMEBUFFER;
            });
          } else {
            return null;
          }
        }
        function parseViewportScissor(options, framebuffer, env) {
          var staticOptions = options.static;
          var dynamicOptions = options.dynamic;
          function parseBox(param) {
            if (param in staticOptions) {
              var box = staticOptions[param];
              check$1.commandType(box, "object", "invalid " + param, env.commandStr);
              var isStatic2 = true;
              var x = box.x | 0;
              var y = box.y | 0;
              var w, h;
              if ("width" in box) {
                w = box.width | 0;
                check$1.command(w >= 0, "invalid " + param, env.commandStr);
              } else {
                isStatic2 = false;
              }
              if ("height" in box) {
                h = box.height | 0;
                check$1.command(h >= 0, "invalid " + param, env.commandStr);
              } else {
                isStatic2 = false;
              }
              return new Declaration(
                !isStatic2 && framebuffer && framebuffer.thisDep,
                !isStatic2 && framebuffer && framebuffer.contextDep,
                !isStatic2 && framebuffer && framebuffer.propDep,
                function(env2, scope) {
                  var CONTEXT = env2.shared.context;
                  var BOX_W = w;
                  if (!("width" in box)) {
                    BOX_W = scope.def(CONTEXT, ".", S_FRAMEBUFFER_WIDTH, "-", x);
                  }
                  var BOX_H = h;
                  if (!("height" in box)) {
                    BOX_H = scope.def(CONTEXT, ".", S_FRAMEBUFFER_HEIGHT, "-", y);
                  }
                  return [x, y, BOX_W, BOX_H];
                }
              );
            } else if (param in dynamicOptions) {
              var dynBox = dynamicOptions[param];
              var result = createDynamicDecl(dynBox, function(env2, scope) {
                var BOX = env2.invoke(scope, dynBox);
                check$1.optional(function() {
                  env2.assert(
                    scope,
                    BOX + "&&typeof " + BOX + '==="object"',
                    "invalid " + param
                  );
                });
                var CONTEXT = env2.shared.context;
                var BOX_X = scope.def(BOX, ".x|0");
                var BOX_Y = scope.def(BOX, ".y|0");
                var BOX_W = scope.def(
                  '"width" in ',
                  BOX,
                  "?",
                  BOX,
                  ".width|0:",
                  "(",
                  CONTEXT,
                  ".",
                  S_FRAMEBUFFER_WIDTH,
                  "-",
                  BOX_X,
                  ")"
                );
                var BOX_H = scope.def(
                  '"height" in ',
                  BOX,
                  "?",
                  BOX,
                  ".height|0:",
                  "(",
                  CONTEXT,
                  ".",
                  S_FRAMEBUFFER_HEIGHT,
                  "-",
                  BOX_Y,
                  ")"
                );
                check$1.optional(function() {
                  env2.assert(
                    scope,
                    BOX_W + ">=0&&" + BOX_H + ">=0",
                    "invalid " + param
                  );
                });
                return [BOX_X, BOX_Y, BOX_W, BOX_H];
              });
              if (framebuffer) {
                result.thisDep = result.thisDep || framebuffer.thisDep;
                result.contextDep = result.contextDep || framebuffer.contextDep;
                result.propDep = result.propDep || framebuffer.propDep;
              }
              return result;
            } else if (framebuffer) {
              return new Declaration(
                framebuffer.thisDep,
                framebuffer.contextDep,
                framebuffer.propDep,
                function(env2, scope) {
                  var CONTEXT = env2.shared.context;
                  return [
                    0,
                    0,
                    scope.def(CONTEXT, ".", S_FRAMEBUFFER_WIDTH),
                    scope.def(CONTEXT, ".", S_FRAMEBUFFER_HEIGHT)
                  ];
                }
              );
            } else {
              return null;
            }
          }
          var viewport = parseBox(S_VIEWPORT);
          if (viewport) {
            var prevViewport = viewport;
            viewport = new Declaration(
              viewport.thisDep,
              viewport.contextDep,
              viewport.propDep,
              function(env2, scope) {
                var VIEWPORT = prevViewport.append(env2, scope);
                var CONTEXT = env2.shared.context;
                scope.set(
                  CONTEXT,
                  "." + S_VIEWPORT_WIDTH,
                  VIEWPORT[2]
                );
                scope.set(
                  CONTEXT,
                  "." + S_VIEWPORT_HEIGHT,
                  VIEWPORT[3]
                );
                return VIEWPORT;
              }
            );
          }
          return {
            viewport,
            scissor_box: parseBox(S_SCISSOR_BOX)
          };
        }
        function parseAttribLocations(options, attributes) {
          var staticOptions = options.static;
          var staticProgram = typeof staticOptions[S_FRAG] === "string" && typeof staticOptions[S_VERT] === "string";
          if (staticProgram) {
            if (Object.keys(attributes.dynamic).length > 0) {
              return null;
            }
            var staticAttributes = attributes.static;
            var sAttributes = Object.keys(staticAttributes);
            if (sAttributes.length > 0 && typeof staticAttributes[sAttributes[0]] === "number") {
              var bindings = [];
              for (var i = 0; i < sAttributes.length; ++i) {
                check$1(typeof staticAttributes[sAttributes[i]] === "number", "must specify all vertex attribute locations when using vaos");
                bindings.push([staticAttributes[sAttributes[i]] | 0, sAttributes[i]]);
              }
              return bindings;
            }
          }
          return null;
        }
        function parseProgram(options, env, attribLocations) {
          var staticOptions = options.static;
          var dynamicOptions = options.dynamic;
          function parseShader(name) {
            if (name in staticOptions) {
              var id = stringStore.id(staticOptions[name]);
              check$1.optional(function() {
                shaderState.shader(shaderType[name], id, check$1.guessCommand());
              });
              var result = createStaticDecl(function() {
                return id;
              });
              result.id = id;
              return result;
            } else if (name in dynamicOptions) {
              var dyn = dynamicOptions[name];
              return createDynamicDecl(dyn, function(env2, scope) {
                var str = env2.invoke(scope, dyn);
                var id2 = scope.def(env2.shared.strings, ".id(", str, ")");
                check$1.optional(function() {
                  scope(
                    env2.shared.shader,
                    ".shader(",
                    shaderType[name],
                    ",",
                    id2,
                    ",",
                    env2.command,
                    ");"
                  );
                });
                return id2;
              });
            }
            return null;
          }
          var frag = parseShader(S_FRAG);
          var vert = parseShader(S_VERT);
          var program = null;
          var progVar;
          if (isStatic(frag) && isStatic(vert)) {
            program = shaderState.program(vert.id, frag.id, null, attribLocations);
            progVar = createStaticDecl(function(env2, scope) {
              return env2.link(program);
            });
          } else {
            progVar = new Declaration(
              frag && frag.thisDep || vert && vert.thisDep,
              frag && frag.contextDep || vert && vert.contextDep,
              frag && frag.propDep || vert && vert.propDep,
              function(env2, scope) {
                var SHADER_STATE = env2.shared.shader;
                var fragId;
                if (frag) {
                  fragId = frag.append(env2, scope);
                } else {
                  fragId = scope.def(SHADER_STATE, ".", S_FRAG);
                }
                var vertId;
                if (vert) {
                  vertId = vert.append(env2, scope);
                } else {
                  vertId = scope.def(SHADER_STATE, ".", S_VERT);
                }
                var progDef = SHADER_STATE + ".program(" + vertId + "," + fragId;
                check$1.optional(function() {
                  progDef += "," + env2.command;
                });
                return scope.def(progDef + ")");
              }
            );
          }
          return {
            frag,
            vert,
            progVar,
            program
          };
        }
        function parseDraw(options, env) {
          var staticOptions = options.static;
          var dynamicOptions = options.dynamic;
          var staticDraw = {};
          var vaoActive = false;
          function parseVAO() {
            if (S_VAO in staticOptions) {
              var vao2 = staticOptions[S_VAO];
              if (vao2 !== null && attributeState.getVAO(vao2) === null) {
                vao2 = attributeState.createVAO(vao2);
              }
              vaoActive = true;
              staticDraw.vao = vao2;
              return createStaticDecl(function(env2) {
                var vaoRef = attributeState.getVAO(vao2);
                if (vaoRef) {
                  return env2.link(vaoRef);
                } else {
                  return "null";
                }
              });
            } else if (S_VAO in dynamicOptions) {
              vaoActive = true;
              var dyn = dynamicOptions[S_VAO];
              return createDynamicDecl(dyn, function(env2, scope) {
                var vaoRef = env2.invoke(scope, dyn);
                return scope.def(env2.shared.vao + ".getVAO(" + vaoRef + ")");
              });
            }
            return null;
          }
          var vao = parseVAO();
          var elementsActive = false;
          function parseElements() {
            if (S_ELEMENTS in staticOptions) {
              var elements2 = staticOptions[S_ELEMENTS];
              staticDraw.elements = elements2;
              if (isBufferArgs(elements2)) {
                var e = staticDraw.elements = elementState.create(elements2, true);
                elements2 = elementState.getElements(e);
                elementsActive = true;
              } else if (elements2) {
                elements2 = elementState.getElements(elements2);
                elementsActive = true;
                check$1.command(elements2, "invalid elements", env.commandStr);
              }
              var result = createStaticDecl(function(env2, scope) {
                if (elements2) {
                  var result2 = env2.link(elements2);
                  env2.ELEMENTS = result2;
                  return result2;
                }
                env2.ELEMENTS = null;
                return null;
              });
              result.value = elements2;
              return result;
            } else if (S_ELEMENTS in dynamicOptions) {
              elementsActive = true;
              var dyn = dynamicOptions[S_ELEMENTS];
              return createDynamicDecl(dyn, function(env2, scope) {
                var shared = env2.shared;
                var IS_BUFFER_ARGS = shared.isBufferArgs;
                var ELEMENT_STATE = shared.elements;
                var elementDefn = env2.invoke(scope, dyn);
                var elements3 = scope.def("null");
                var elementStream = scope.def(IS_BUFFER_ARGS, "(", elementDefn, ")");
                var ifte = env2.cond(elementStream).then(elements3, "=", ELEMENT_STATE, ".createStream(", elementDefn, ");").else(elements3, "=", ELEMENT_STATE, ".getElements(", elementDefn, ");");
                check$1.optional(function() {
                  env2.assert(
                    ifte.else,
                    "!" + elementDefn + "||" + elements3,
                    "invalid elements"
                  );
                });
                scope.entry(ifte);
                scope.exit(
                  env2.cond(elementStream).then(ELEMENT_STATE, ".destroyStream(", elements3, ");")
                );
                env2.ELEMENTS = elements3;
                return elements3;
              });
            } else if (vaoActive) {
              return new Declaration(
                vao.thisDep,
                vao.contextDep,
                vao.propDep,
                function(env2, scope) {
                  return scope.def(env2.shared.vao + ".currentVAO?" + env2.shared.elements + ".getElements(" + env2.shared.vao + ".currentVAO.elements):null");
                }
              );
            }
            return null;
          }
          var elements = parseElements();
          function parsePrimitive() {
            if (S_PRIMITIVE in staticOptions) {
              var primitive2 = staticOptions[S_PRIMITIVE];
              staticDraw.primitive = primitive2;
              check$1.commandParameter(primitive2, primTypes, "invalid primitve", env.commandStr);
              return createStaticDecl(function(env2, scope) {
                return primTypes[primitive2];
              });
            } else if (S_PRIMITIVE in dynamicOptions) {
              var dynPrimitive = dynamicOptions[S_PRIMITIVE];
              return createDynamicDecl(dynPrimitive, function(env2, scope) {
                var PRIM_TYPES = env2.constants.primTypes;
                var prim = env2.invoke(scope, dynPrimitive);
                check$1.optional(function() {
                  env2.assert(
                    scope,
                    prim + " in " + PRIM_TYPES,
                    "invalid primitive, must be one of " + Object.keys(primTypes)
                  );
                });
                return scope.def(PRIM_TYPES, "[", prim, "]");
              });
            } else if (elementsActive) {
              if (isStatic(elements)) {
                if (elements.value) {
                  return createStaticDecl(function(env2, scope) {
                    return scope.def(env2.ELEMENTS, ".primType");
                  });
                } else {
                  return createStaticDecl(function() {
                    return GL_TRIANGLES$1;
                  });
                }
              } else {
                return new Declaration(
                  elements.thisDep,
                  elements.contextDep,
                  elements.propDep,
                  function(env2, scope) {
                    var elements2 = env2.ELEMENTS;
                    return scope.def(elements2, "?", elements2, ".primType:", GL_TRIANGLES$1);
                  }
                );
              }
            } else if (vaoActive) {
              return new Declaration(
                vao.thisDep,
                vao.contextDep,
                vao.propDep,
                function(env2, scope) {
                  return scope.def(env2.shared.vao + ".currentVAO?" + env2.shared.vao + ".currentVAO.primitive:" + GL_TRIANGLES$1);
                }
              );
            }
            return null;
          }
          function parseParam(param, isOffset) {
            if (param in staticOptions) {
              var value = staticOptions[param] | 0;
              if (isOffset) {
                staticDraw.offset = value;
              } else {
                staticDraw.instances = value;
              }
              check$1.command(!isOffset || value >= 0, "invalid " + param, env.commandStr);
              return createStaticDecl(function(env2, scope) {
                if (isOffset) {
                  env2.OFFSET = value;
                }
                return value;
              });
            } else if (param in dynamicOptions) {
              var dynValue = dynamicOptions[param];
              return createDynamicDecl(dynValue, function(env2, scope) {
                var result = env2.invoke(scope, dynValue);
                if (isOffset) {
                  env2.OFFSET = result;
                  check$1.optional(function() {
                    env2.assert(
                      scope,
                      result + ">=0",
                      "invalid " + param
                    );
                  });
                }
                return result;
              });
            } else if (isOffset) {
              if (elementsActive) {
                return createStaticDecl(function(env2, scope) {
                  env2.OFFSET = 0;
                  return 0;
                });
              } else if (vaoActive) {
                return new Declaration(
                  vao.thisDep,
                  vao.contextDep,
                  vao.propDep,
                  function(env2, scope) {
                    return scope.def(env2.shared.vao + ".currentVAO?" + env2.shared.vao + ".currentVAO.offset:0");
                  }
                );
              }
            } else if (vaoActive) {
              return new Declaration(
                vao.thisDep,
                vao.contextDep,
                vao.propDep,
                function(env2, scope) {
                  return scope.def(env2.shared.vao + ".currentVAO?" + env2.shared.vao + ".currentVAO.instances:-1");
                }
              );
            }
            return null;
          }
          var OFFSET = parseParam(S_OFFSET, true);
          function parseVertCount() {
            if (S_COUNT in staticOptions) {
              var count2 = staticOptions[S_COUNT] | 0;
              staticDraw.count = count2;
              check$1.command(
                typeof count2 === "number" && count2 >= 0,
                "invalid vertex count",
                env.commandStr
              );
              return createStaticDecl(function() {
                return count2;
              });
            } else if (S_COUNT in dynamicOptions) {
              var dynCount = dynamicOptions[S_COUNT];
              return createDynamicDecl(dynCount, function(env2, scope) {
                var result2 = env2.invoke(scope, dynCount);
                check$1.optional(function() {
                  env2.assert(
                    scope,
                    "typeof " + result2 + '==="number"&&' + result2 + ">=0&&" + result2 + "===(" + result2 + "|0)",
                    "invalid vertex count"
                  );
                });
                return result2;
              });
            } else if (elementsActive) {
              if (isStatic(elements)) {
                if (elements) {
                  if (OFFSET) {
                    return new Declaration(
                      OFFSET.thisDep,
                      OFFSET.contextDep,
                      OFFSET.propDep,
                      function(env2, scope) {
                        var result2 = scope.def(
                          env2.ELEMENTS,
                          ".vertCount-",
                          env2.OFFSET
                        );
                        check$1.optional(function() {
                          env2.assert(
                            scope,
                            result2 + ">=0",
                            "invalid vertex offset/element buffer too small"
                          );
                        });
                        return result2;
                      }
                    );
                  } else {
                    return createStaticDecl(function(env2, scope) {
                      return scope.def(env2.ELEMENTS, ".vertCount");
                    });
                  }
                } else {
                  var result = createStaticDecl(function() {
                    return -1;
                  });
                  check$1.optional(function() {
                    result.MISSING = true;
                  });
                  return result;
                }
              } else {
                var variable = new Declaration(
                  elements.thisDep || OFFSET.thisDep,
                  elements.contextDep || OFFSET.contextDep,
                  elements.propDep || OFFSET.propDep,
                  function(env2, scope) {
                    var elements2 = env2.ELEMENTS;
                    if (env2.OFFSET) {
                      return scope.def(
                        elements2,
                        "?",
                        elements2,
                        ".vertCount-",
                        env2.OFFSET,
                        ":-1"
                      );
                    }
                    return scope.def(elements2, "?", elements2, ".vertCount:-1");
                  }
                );
                check$1.optional(function() {
                  variable.DYNAMIC = true;
                });
                return variable;
              }
            } else if (vaoActive) {
              var countVariable = new Declaration(
                vao.thisDep,
                vao.contextDep,
                vao.propDep,
                function(env2, scope) {
                  return scope.def(env2.shared.vao, ".currentVAO?", env2.shared.vao, ".currentVAO.count:-1");
                }
              );
              return countVariable;
            }
            return null;
          }
          var primitive = parsePrimitive();
          var count = parseVertCount();
          var instances = parseParam(S_INSTANCES, false);
          return {
            elements,
            primitive,
            count,
            instances,
            offset: OFFSET,
            vao,
            vaoActive,
            elementsActive,
            // static draw props
            static: staticDraw
          };
        }
        function parseGLState(options, env) {
          var staticOptions = options.static;
          var dynamicOptions = options.dynamic;
          var STATE = {};
          GL_STATE_NAMES.forEach(function(prop) {
            var param = propName(prop);
            function parseParam(parseStatic, parseDynamic) {
              if (prop in staticOptions) {
                var value = parseStatic(staticOptions[prop]);
                STATE[param] = createStaticDecl(function() {
                  return value;
                });
              } else if (prop in dynamicOptions) {
                var dyn = dynamicOptions[prop];
                STATE[param] = createDynamicDecl(dyn, function(env2, scope) {
                  return parseDynamic(env2, scope, env2.invoke(scope, dyn));
                });
              }
            }
            switch (prop) {
              case S_CULL_ENABLE:
              case S_BLEND_ENABLE:
              case S_DITHER:
              case S_STENCIL_ENABLE:
              case S_DEPTH_ENABLE:
              case S_SCISSOR_ENABLE:
              case S_POLYGON_OFFSET_ENABLE:
              case S_SAMPLE_ALPHA:
              case S_SAMPLE_ENABLE:
              case S_DEPTH_MASK:
                return parseParam(
                  function(value) {
                    check$1.commandType(value, "boolean", prop, env.commandStr);
                    return value;
                  },
                  function(env2, scope, value) {
                    check$1.optional(function() {
                      env2.assert(
                        scope,
                        "typeof " + value + '==="boolean"',
                        "invalid flag " + prop,
                        env2.commandStr
                      );
                    });
                    return value;
                  }
                );
              case S_DEPTH_FUNC:
                return parseParam(
                  function(value) {
                    check$1.commandParameter(value, compareFuncs, "invalid " + prop, env.commandStr);
                    return compareFuncs[value];
                  },
                  function(env2, scope, value) {
                    var COMPARE_FUNCS = env2.constants.compareFuncs;
                    check$1.optional(function() {
                      env2.assert(
                        scope,
                        value + " in " + COMPARE_FUNCS,
                        "invalid " + prop + ", must be one of " + Object.keys(compareFuncs)
                      );
                    });
                    return scope.def(COMPARE_FUNCS, "[", value, "]");
                  }
                );
              case S_DEPTH_RANGE:
                return parseParam(
                  function(value) {
                    check$1.command(
                      isArrayLike(value) && value.length === 2 && typeof value[0] === "number" && typeof value[1] === "number" && value[0] <= value[1],
                      "depth range is 2d array",
                      env.commandStr
                    );
                    return value;
                  },
                  function(env2, scope, value) {
                    check$1.optional(function() {
                      env2.assert(
                        scope,
                        env2.shared.isArrayLike + "(" + value + ")&&" + value + ".length===2&&typeof " + value + '[0]==="number"&&typeof ' + value + '[1]==="number"&&' + value + "[0]<=" + value + "[1]",
                        "depth range must be a 2d array"
                      );
                    });
                    var Z_NEAR = scope.def("+", value, "[0]");
                    var Z_FAR = scope.def("+", value, "[1]");
                    return [Z_NEAR, Z_FAR];
                  }
                );
              case S_BLEND_FUNC:
                return parseParam(
                  function(value) {
                    check$1.commandType(value, "object", "blend.func", env.commandStr);
                    var srcRGB = "srcRGB" in value ? value.srcRGB : value.src;
                    var srcAlpha = "srcAlpha" in value ? value.srcAlpha : value.src;
                    var dstRGB = "dstRGB" in value ? value.dstRGB : value.dst;
                    var dstAlpha = "dstAlpha" in value ? value.dstAlpha : value.dst;
                    check$1.commandParameter(srcRGB, blendFuncs, param + ".srcRGB", env.commandStr);
                    check$1.commandParameter(srcAlpha, blendFuncs, param + ".srcAlpha", env.commandStr);
                    check$1.commandParameter(dstRGB, blendFuncs, param + ".dstRGB", env.commandStr);
                    check$1.commandParameter(dstAlpha, blendFuncs, param + ".dstAlpha", env.commandStr);
                    check$1.command(
                      invalidBlendCombinations.indexOf(srcRGB + ", " + dstRGB) === -1,
                      "unallowed blending combination (srcRGB, dstRGB) = (" + srcRGB + ", " + dstRGB + ")",
                      env.commandStr
                    );
                    return [
                      blendFuncs[srcRGB],
                      blendFuncs[dstRGB],
                      blendFuncs[srcAlpha],
                      blendFuncs[dstAlpha]
                    ];
                  },
                  function(env2, scope, value) {
                    var BLEND_FUNCS = env2.constants.blendFuncs;
                    check$1.optional(function() {
                      env2.assert(
                        scope,
                        value + "&&typeof " + value + '==="object"',
                        "invalid blend func, must be an object"
                      );
                    });
                    function read(prefix, suffix) {
                      var func = scope.def(
                        '"',
                        prefix,
                        suffix,
                        '" in ',
                        value,
                        "?",
                        value,
                        ".",
                        prefix,
                        suffix,
                        ":",
                        value,
                        ".",
                        prefix
                      );
                      check$1.optional(function() {
                        env2.assert(
                          scope,
                          func + " in " + BLEND_FUNCS,
                          "invalid " + prop + "." + prefix + suffix + ", must be one of " + Object.keys(blendFuncs)
                        );
                      });
                      return func;
                    }
                    var srcRGB = read("src", "RGB");
                    var dstRGB = read("dst", "RGB");
                    check$1.optional(function() {
                      var INVALID_BLEND_COMBINATIONS = env2.constants.invalidBlendCombinations;
                      env2.assert(
                        scope,
                        INVALID_BLEND_COMBINATIONS + ".indexOf(" + srcRGB + '+", "+' + dstRGB + ") === -1 ",
                        "unallowed blending combination for (srcRGB, dstRGB)"
                      );
                    });
                    var SRC_RGB = scope.def(BLEND_FUNCS, "[", srcRGB, "]");
                    var SRC_ALPHA = scope.def(BLEND_FUNCS, "[", read("src", "Alpha"), "]");
                    var DST_RGB = scope.def(BLEND_FUNCS, "[", dstRGB, "]");
                    var DST_ALPHA = scope.def(BLEND_FUNCS, "[", read("dst", "Alpha"), "]");
                    return [SRC_RGB, DST_RGB, SRC_ALPHA, DST_ALPHA];
                  }
                );
              case S_BLEND_EQUATION:
                return parseParam(
                  function(value) {
                    if (typeof value === "string") {
                      check$1.commandParameter(value, blendEquations, "invalid " + prop, env.commandStr);
                      return [
                        blendEquations[value],
                        blendEquations[value]
                      ];
                    } else if (typeof value === "object") {
                      check$1.commandParameter(
                        value.rgb,
                        blendEquations,
                        prop + ".rgb",
                        env.commandStr
                      );
                      check$1.commandParameter(
                        value.alpha,
                        blendEquations,
                        prop + ".alpha",
                        env.commandStr
                      );
                      return [
                        blendEquations[value.rgb],
                        blendEquations[value.alpha]
                      ];
                    } else {
                      check$1.commandRaise("invalid blend.equation", env.commandStr);
                    }
                  },
                  function(env2, scope, value) {
                    var BLEND_EQUATIONS = env2.constants.blendEquations;
                    var RGB = scope.def();
                    var ALPHA = scope.def();
                    var ifte = env2.cond("typeof ", value, '==="string"');
                    check$1.optional(function() {
                      function checkProp(block, name, value2) {
                        env2.assert(
                          block,
                          value2 + " in " + BLEND_EQUATIONS,
                          "invalid " + name + ", must be one of " + Object.keys(blendEquations)
                        );
                      }
                      checkProp(ifte.then, prop, value);
                      env2.assert(
                        ifte.else,
                        value + "&&typeof " + value + '==="object"',
                        "invalid " + prop
                      );
                      checkProp(ifte.else, prop + ".rgb", value + ".rgb");
                      checkProp(ifte.else, prop + ".alpha", value + ".alpha");
                    });
                    ifte.then(
                      RGB,
                      "=",
                      ALPHA,
                      "=",
                      BLEND_EQUATIONS,
                      "[",
                      value,
                      "];"
                    );
                    ifte.else(
                      RGB,
                      "=",
                      BLEND_EQUATIONS,
                      "[",
                      value,
                      ".rgb];",
                      ALPHA,
                      "=",
                      BLEND_EQUATIONS,
                      "[",
                      value,
                      ".alpha];"
                    );
                    scope(ifte);
                    return [RGB, ALPHA];
                  }
                );
              case S_BLEND_COLOR:
                return parseParam(
                  function(value) {
                    check$1.command(
                      isArrayLike(value) && value.length === 4,
                      "blend.color must be a 4d array",
                      env.commandStr
                    );
                    return loop(4, function(i) {
                      return +value[i];
                    });
                  },
                  function(env2, scope, value) {
                    check$1.optional(function() {
                      env2.assert(
                        scope,
                        env2.shared.isArrayLike + "(" + value + ")&&" + value + ".length===4",
                        "blend.color must be a 4d array"
                      );
                    });
                    return loop(4, function(i) {
                      return scope.def("+", value, "[", i, "]");
                    });
                  }
                );
              case S_STENCIL_MASK:
                return parseParam(
                  function(value) {
                    check$1.commandType(value, "number", param, env.commandStr);
                    return value | 0;
                  },
                  function(env2, scope, value) {
                    check$1.optional(function() {
                      env2.assert(
                        scope,
                        "typeof " + value + '==="number"',
                        "invalid stencil.mask"
                      );
                    });
                    return scope.def(value, "|0");
                  }
                );
              case S_STENCIL_FUNC:
                return parseParam(
                  function(value) {
                    check$1.commandType(value, "object", param, env.commandStr);
                    var cmp = value.cmp || "keep";
                    var ref = value.ref || 0;
                    var mask = "mask" in value ? value.mask : -1;
                    check$1.commandParameter(cmp, compareFuncs, prop + ".cmp", env.commandStr);
                    check$1.commandType(ref, "number", prop + ".ref", env.commandStr);
                    check$1.commandType(mask, "number", prop + ".mask", env.commandStr);
                    return [
                      compareFuncs[cmp],
                      ref,
                      mask
                    ];
                  },
                  function(env2, scope, value) {
                    var COMPARE_FUNCS = env2.constants.compareFuncs;
                    check$1.optional(function() {
                      function assert() {
                        env2.assert(
                          scope,
                          Array.prototype.join.call(arguments, ""),
                          "invalid stencil.func"
                        );
                      }
                      assert(value + "&&typeof ", value, '==="object"');
                      assert(
                        '!("cmp" in ',
                        value,
                        ")||(",
                        value,
                        ".cmp in ",
                        COMPARE_FUNCS,
                        ")"
                      );
                    });
                    var cmp = scope.def(
                      '"cmp" in ',
                      value,
                      "?",
                      COMPARE_FUNCS,
                      "[",
                      value,
                      ".cmp]",
                      ":",
                      GL_KEEP
                    );
                    var ref = scope.def(value, ".ref|0");
                    var mask = scope.def(
                      '"mask" in ',
                      value,
                      "?",
                      value,
                      ".mask|0:-1"
                    );
                    return [cmp, ref, mask];
                  }
                );
              case S_STENCIL_OPFRONT:
              case S_STENCIL_OPBACK:
                return parseParam(
                  function(value) {
                    check$1.commandType(value, "object", param, env.commandStr);
                    var fail = value.fail || "keep";
                    var zfail = value.zfail || "keep";
                    var zpass = value.zpass || "keep";
                    check$1.commandParameter(fail, stencilOps, prop + ".fail", env.commandStr);
                    check$1.commandParameter(zfail, stencilOps, prop + ".zfail", env.commandStr);
                    check$1.commandParameter(zpass, stencilOps, prop + ".zpass", env.commandStr);
                    return [
                      prop === S_STENCIL_OPBACK ? GL_BACK : GL_FRONT,
                      stencilOps[fail],
                      stencilOps[zfail],
                      stencilOps[zpass]
                    ];
                  },
                  function(env2, scope, value) {
                    var STENCIL_OPS = env2.constants.stencilOps;
                    check$1.optional(function() {
                      env2.assert(
                        scope,
                        value + "&&typeof " + value + '==="object"',
                        "invalid " + prop
                      );
                    });
                    function read(name) {
                      check$1.optional(function() {
                        env2.assert(
                          scope,
                          '!("' + name + '" in ' + value + ")||(" + value + "." + name + " in " + STENCIL_OPS + ")",
                          "invalid " + prop + "." + name + ", must be one of " + Object.keys(stencilOps)
                        );
                      });
                      return scope.def(
                        '"',
                        name,
                        '" in ',
                        value,
                        "?",
                        STENCIL_OPS,
                        "[",
                        value,
                        ".",
                        name,
                        "]:",
                        GL_KEEP
                      );
                    }
                    return [
                      prop === S_STENCIL_OPBACK ? GL_BACK : GL_FRONT,
                      read("fail"),
                      read("zfail"),
                      read("zpass")
                    ];
                  }
                );
              case S_POLYGON_OFFSET_OFFSET:
                return parseParam(
                  function(value) {
                    check$1.commandType(value, "object", param, env.commandStr);
                    var factor = value.factor | 0;
                    var units = value.units | 0;
                    check$1.commandType(factor, "number", param + ".factor", env.commandStr);
                    check$1.commandType(units, "number", param + ".units", env.commandStr);
                    return [factor, units];
                  },
                  function(env2, scope, value) {
                    check$1.optional(function() {
                      env2.assert(
                        scope,
                        value + "&&typeof " + value + '==="object"',
                        "invalid " + prop
                      );
                    });
                    var FACTOR = scope.def(value, ".factor|0");
                    var UNITS = scope.def(value, ".units|0");
                    return [FACTOR, UNITS];
                  }
                );
              case S_CULL_FACE:
                return parseParam(
                  function(value) {
                    var face = 0;
                    if (value === "front") {
                      face = GL_FRONT;
                    } else if (value === "back") {
                      face = GL_BACK;
                    }
                    check$1.command(!!face, param, env.commandStr);
                    return face;
                  },
                  function(env2, scope, value) {
                    check$1.optional(function() {
                      env2.assert(
                        scope,
                        value + '==="front"||' + value + '==="back"',
                        "invalid cull.face"
                      );
                    });
                    return scope.def(value, '==="front"?', GL_FRONT, ":", GL_BACK);
                  }
                );
              case S_LINE_WIDTH:
                return parseParam(
                  function(value) {
                    check$1.command(
                      typeof value === "number" && value >= limits.lineWidthDims[0] && value <= limits.lineWidthDims[1],
                      "invalid line width, must be a positive number between " + limits.lineWidthDims[0] + " and " + limits.lineWidthDims[1],
                      env.commandStr
                    );
                    return value;
                  },
                  function(env2, scope, value) {
                    check$1.optional(function() {
                      env2.assert(
                        scope,
                        "typeof " + value + '==="number"&&' + value + ">=" + limits.lineWidthDims[0] + "&&" + value + "<=" + limits.lineWidthDims[1],
                        "invalid line width"
                      );
                    });
                    return value;
                  }
                );
              case S_FRONT_FACE:
                return parseParam(
                  function(value) {
                    check$1.commandParameter(value, orientationType, param, env.commandStr);
                    return orientationType[value];
                  },
                  function(env2, scope, value) {
                    check$1.optional(function() {
                      env2.assert(
                        scope,
                        value + '==="cw"||' + value + '==="ccw"',
                        "invalid frontFace, must be one of cw,ccw"
                      );
                    });
                    return scope.def(value + '==="cw"?' + GL_CW + ":" + GL_CCW);
                  }
                );
              case S_COLOR_MASK:
                return parseParam(
                  function(value) {
                    check$1.command(
                      isArrayLike(value) && value.length === 4,
                      "color.mask must be length 4 array",
                      env.commandStr
                    );
                    return value.map(function(v) {
                      return !!v;
                    });
                  },
                  function(env2, scope, value) {
                    check$1.optional(function() {
                      env2.assert(
                        scope,
                        env2.shared.isArrayLike + "(" + value + ")&&" + value + ".length===4",
                        "invalid color.mask"
                      );
                    });
                    return loop(4, function(i) {
                      return "!!" + value + "[" + i + "]";
                    });
                  }
                );
              case S_SAMPLE_COVERAGE:
                return parseParam(
                  function(value) {
                    check$1.command(typeof value === "object" && value, param, env.commandStr);
                    var sampleValue = "value" in value ? value.value : 1;
                    var sampleInvert = !!value.invert;
                    check$1.command(
                      typeof sampleValue === "number" && sampleValue >= 0 && sampleValue <= 1,
                      "sample.coverage.value must be a number between 0 and 1",
                      env.commandStr
                    );
                    return [sampleValue, sampleInvert];
                  },
                  function(env2, scope, value) {
                    check$1.optional(function() {
                      env2.assert(
                        scope,
                        value + "&&typeof " + value + '==="object"',
                        "invalid sample.coverage"
                      );
                    });
                    var VALUE = scope.def(
                      '"value" in ',
                      value,
                      "?+",
                      value,
                      ".value:1"
                    );
                    var INVERT = scope.def("!!", value, ".invert");
                    return [VALUE, INVERT];
                  }
                );
            }
          });
          return STATE;
        }
        function parseUniforms(uniforms, env) {
          var staticUniforms = uniforms.static;
          var dynamicUniforms = uniforms.dynamic;
          var UNIFORMS = {};
          Object.keys(staticUniforms).forEach(function(name) {
            var value = staticUniforms[name];
            var result;
            if (typeof value === "number" || typeof value === "boolean") {
              result = createStaticDecl(function() {
                return value;
              });
            } else if (typeof value === "function") {
              var reglType = value._reglType;
              if (reglType === "texture2d" || reglType === "textureCube") {
                result = createStaticDecl(function(env2) {
                  return env2.link(value);
                });
              } else if (reglType === "framebuffer" || reglType === "framebufferCube") {
                check$1.command(
                  value.color.length > 0,
                  'missing color attachment for framebuffer sent to uniform "' + name + '"',
                  env.commandStr
                );
                result = createStaticDecl(function(env2) {
                  return env2.link(value.color[0]);
                });
              } else {
                check$1.commandRaise('invalid data for uniform "' + name + '"', env.commandStr);
              }
            } else if (isArrayLike(value)) {
              result = createStaticDecl(function(env2) {
                var ITEM = env2.global.def(
                  "[",
                  loop(value.length, function(i) {
                    check$1.command(
                      typeof value[i] === "number" || typeof value[i] === "boolean",
                      "invalid uniform " + name,
                      env2.commandStr
                    );
                    return value[i];
                  }),
                  "]"
                );
                return ITEM;
              });
            } else {
              check$1.commandRaise('invalid or missing data for uniform "' + name + '"', env.commandStr);
            }
            result.value = value;
            UNIFORMS[name] = result;
          });
          Object.keys(dynamicUniforms).forEach(function(key) {
            var dyn = dynamicUniforms[key];
            UNIFORMS[key] = createDynamicDecl(dyn, function(env2, scope) {
              return env2.invoke(scope, dyn);
            });
          });
          return UNIFORMS;
        }
        function parseAttributes(attributes, env) {
          var staticAttributes = attributes.static;
          var dynamicAttributes = attributes.dynamic;
          var attributeDefs = {};
          Object.keys(staticAttributes).forEach(function(attribute) {
            var value = staticAttributes[attribute];
            var id = stringStore.id(attribute);
            var record = new AttributeRecord2();
            if (isBufferArgs(value)) {
              record.state = ATTRIB_STATE_POINTER;
              record.buffer = bufferState.getBuffer(
                bufferState.create(value, GL_ARRAY_BUFFER$2, false, true)
              );
              record.type = 0;
            } else {
              var buffer = bufferState.getBuffer(value);
              if (buffer) {
                record.state = ATTRIB_STATE_POINTER;
                record.buffer = buffer;
                record.type = 0;
              } else {
                check$1.command(
                  typeof value === "object" && value,
                  "invalid data for attribute " + attribute,
                  env.commandStr
                );
                if ("constant" in value) {
                  var constant = value.constant;
                  record.buffer = "null";
                  record.state = ATTRIB_STATE_CONSTANT;
                  if (typeof constant === "number") {
                    record.x = constant;
                  } else {
                    check$1.command(
                      isArrayLike(constant) && constant.length > 0 && constant.length <= 4,
                      "invalid constant for attribute " + attribute,
                      env.commandStr
                    );
                    CUTE_COMPONENTS.forEach(function(c, i) {
                      if (i < constant.length) {
                        record[c] = constant[i];
                      }
                    });
                  }
                } else {
                  if (isBufferArgs(value.buffer)) {
                    buffer = bufferState.getBuffer(
                      bufferState.create(value.buffer, GL_ARRAY_BUFFER$2, false, true)
                    );
                  } else {
                    buffer = bufferState.getBuffer(value.buffer);
                  }
                  check$1.command(!!buffer, 'missing buffer for attribute "' + attribute + '"', env.commandStr);
                  var offset = value.offset | 0;
                  check$1.command(
                    offset >= 0,
                    'invalid offset for attribute "' + attribute + '"',
                    env.commandStr
                  );
                  var stride = value.stride | 0;
                  check$1.command(
                    stride >= 0 && stride < 256,
                    'invalid stride for attribute "' + attribute + '", must be integer betweeen [0, 255]',
                    env.commandStr
                  );
                  var size = value.size | 0;
                  check$1.command(
                    !("size" in value) || size > 0 && size <= 4,
                    'invalid size for attribute "' + attribute + '", must be 1,2,3,4',
                    env.commandStr
                  );
                  var normalized = !!value.normalized;
                  var type = 0;
                  if ("type" in value) {
                    check$1.commandParameter(
                      value.type,
                      glTypes,
                      "invalid type for attribute " + attribute,
                      env.commandStr
                    );
                    type = glTypes[value.type];
                  }
                  var divisor = value.divisor | 0;
                  check$1.optional(function() {
                    if ("divisor" in value) {
                      check$1.command(
                        divisor === 0 || extInstancing,
                        'cannot specify divisor for attribute "' + attribute + '", instancing not supported',
                        env.commandStr
                      );
                      check$1.command(
                        divisor >= 0,
                        'invalid divisor for attribute "' + attribute + '"',
                        env.commandStr
                      );
                    }
                    var command = env.commandStr;
                    var VALID_KEYS = [
                      "buffer",
                      "offset",
                      "divisor",
                      "normalized",
                      "type",
                      "size",
                      "stride"
                    ];
                    Object.keys(value).forEach(function(prop) {
                      check$1.command(
                        VALID_KEYS.indexOf(prop) >= 0,
                        'unknown parameter "' + prop + '" for attribute pointer "' + attribute + '" (valid parameters are ' + VALID_KEYS + ")",
                        command
                      );
                    });
                  });
                  record.buffer = buffer;
                  record.state = ATTRIB_STATE_POINTER;
                  record.size = size;
                  record.normalized = normalized;
                  record.type = type || buffer.dtype;
                  record.offset = offset;
                  record.stride = stride;
                  record.divisor = divisor;
                }
              }
            }
            attributeDefs[attribute] = createStaticDecl(function(env2, scope) {
              var cache = env2.attribCache;
              if (id in cache) {
                return cache[id];
              }
              var result = {
                isStream: false
              };
              Object.keys(record).forEach(function(key) {
                result[key] = record[key];
              });
              if (record.buffer) {
                result.buffer = env2.link(record.buffer);
                result.type = result.type || result.buffer + ".dtype";
              }
              cache[id] = result;
              return result;
            });
          });
          Object.keys(dynamicAttributes).forEach(function(attribute) {
            var dyn = dynamicAttributes[attribute];
            function appendAttributeCode(env2, block) {
              var VALUE = env2.invoke(block, dyn);
              var shared = env2.shared;
              var constants = env2.constants;
              var IS_BUFFER_ARGS = shared.isBufferArgs;
              var BUFFER_STATE = shared.buffer;
              check$1.optional(function() {
                env2.assert(
                  block,
                  VALUE + "&&(typeof " + VALUE + '==="object"||typeof ' + VALUE + '==="function")&&(' + IS_BUFFER_ARGS + "(" + VALUE + ")||" + BUFFER_STATE + ".getBuffer(" + VALUE + ")||" + BUFFER_STATE + ".getBuffer(" + VALUE + ".buffer)||" + IS_BUFFER_ARGS + "(" + VALUE + '.buffer)||("constant" in ' + VALUE + "&&(typeof " + VALUE + '.constant==="number"||' + shared.isArrayLike + "(" + VALUE + ".constant))))",
                  'invalid dynamic attribute "' + attribute + '"'
                );
              });
              var result = {
                isStream: block.def(false)
              };
              var defaultRecord = new AttributeRecord2();
              defaultRecord.state = ATTRIB_STATE_POINTER;
              Object.keys(defaultRecord).forEach(function(key) {
                result[key] = block.def("" + defaultRecord[key]);
              });
              var BUFFER = result.buffer;
              var TYPE = result.type;
              block(
                "if(",
                IS_BUFFER_ARGS,
                "(",
                VALUE,
                ")){",
                result.isStream,
                "=true;",
                BUFFER,
                "=",
                BUFFER_STATE,
                ".createStream(",
                GL_ARRAY_BUFFER$2,
                ",",
                VALUE,
                ");",
                TYPE,
                "=",
                BUFFER,
                ".dtype;",
                "}else{",
                BUFFER,
                "=",
                BUFFER_STATE,
                ".getBuffer(",
                VALUE,
                ");",
                "if(",
                BUFFER,
                "){",
                TYPE,
                "=",
                BUFFER,
                ".dtype;",
                '}else if("constant" in ',
                VALUE,
                "){",
                result.state,
                "=",
                ATTRIB_STATE_CONSTANT,
                ";",
                "if(typeof " + VALUE + '.constant === "number"){',
                result[CUTE_COMPONENTS[0]],
                "=",
                VALUE,
                ".constant;",
                CUTE_COMPONENTS.slice(1).map(function(n) {
                  return result[n];
                }).join("="),
                "=0;",
                "}else{",
                CUTE_COMPONENTS.map(function(name, i) {
                  return result[name] + "=" + VALUE + ".constant.length>" + i + "?" + VALUE + ".constant[" + i + "]:0;";
                }).join(""),
                "}}else{",
                "if(",
                IS_BUFFER_ARGS,
                "(",
                VALUE,
                ".buffer)){",
                BUFFER,
                "=",
                BUFFER_STATE,
                ".createStream(",
                GL_ARRAY_BUFFER$2,
                ",",
                VALUE,
                ".buffer);",
                "}else{",
                BUFFER,
                "=",
                BUFFER_STATE,
                ".getBuffer(",
                VALUE,
                ".buffer);",
                "}",
                TYPE,
                '="type" in ',
                VALUE,
                "?",
                constants.glTypes,
                "[",
                VALUE,
                ".type]:",
                BUFFER,
                ".dtype;",
                result.normalized,
                "=!!",
                VALUE,
                ".normalized;"
              );
              function emitReadRecord(name) {
                block(result[name], "=", VALUE, ".", name, "|0;");
              }
              emitReadRecord("size");
              emitReadRecord("offset");
              emitReadRecord("stride");
              emitReadRecord("divisor");
              block("}}");
              block.exit(
                "if(",
                result.isStream,
                "){",
                BUFFER_STATE,
                ".destroyStream(",
                BUFFER,
                ");",
                "}"
              );
              return result;
            }
            attributeDefs[attribute] = createDynamicDecl(dyn, appendAttributeCode);
          });
          return attributeDefs;
        }
        function parseContext(context) {
          var staticContext = context.static;
          var dynamicContext = context.dynamic;
          var result = {};
          Object.keys(staticContext).forEach(function(name) {
            var value = staticContext[name];
            result[name] = createStaticDecl(function(env, scope) {
              if (typeof value === "number" || typeof value === "boolean") {
                return "" + value;
              } else {
                return env.link(value);
              }
            });
          });
          Object.keys(dynamicContext).forEach(function(name) {
            var dyn = dynamicContext[name];
            result[name] = createDynamicDecl(dyn, function(env, scope) {
              return env.invoke(scope, dyn);
            });
          });
          return result;
        }
        function parseArguments(options, attributes, uniforms, context, env) {
          var staticOptions = options.static;
          var dynamicOptions = options.dynamic;
          check$1.optional(function() {
            var KEY_NAMES = [
              S_FRAMEBUFFER,
              S_VERT,
              S_FRAG,
              S_ELEMENTS,
              S_PRIMITIVE,
              S_OFFSET,
              S_COUNT,
              S_INSTANCES,
              S_PROFILE,
              S_VAO
            ].concat(GL_STATE_NAMES);
            function checkKeys(dict) {
              Object.keys(dict).forEach(function(key) {
                check$1.command(
                  KEY_NAMES.indexOf(key) >= 0,
                  'unknown parameter "' + key + '"',
                  env.commandStr
                );
              });
            }
            checkKeys(staticOptions);
            checkKeys(dynamicOptions);
          });
          var attribLocations = parseAttribLocations(options, attributes);
          var framebuffer = parseFramebuffer(options, env);
          var viewportAndScissor = parseViewportScissor(options, framebuffer, env);
          var draw = parseDraw(options, env);
          var state = parseGLState(options, env);
          var shader = parseProgram(options, env, attribLocations);
          function copyBox(name) {
            var defn = viewportAndScissor[name];
            if (defn) {
              state[name] = defn;
            }
          }
          copyBox(S_VIEWPORT);
          copyBox(propName(S_SCISSOR_BOX));
          var dirty = Object.keys(state).length > 0;
          var result = {
            framebuffer,
            draw,
            shader,
            state,
            dirty,
            scopeVAO: null,
            drawVAO: null,
            useVAO: false,
            attributes: {}
          };
          result.profile = parseProfile(options, env);
          result.uniforms = parseUniforms(uniforms, env);
          result.drawVAO = result.scopeVAO = draw.vao;
          if (!result.drawVAO && shader.program && !attribLocations && extensions.angle_instanced_arrays && draw.static.elements) {
            var useVAO = true;
            var staticBindings = shader.program.attributes.map(function(attr) {
              var binding = attributes.static[attr];
              useVAO = useVAO && !!binding;
              return binding;
            });
            if (useVAO && staticBindings.length > 0) {
              var vao = attributeState.getVAO(attributeState.createVAO({
                attributes: staticBindings,
                elements: draw.static.elements
              }));
              result.drawVAO = new Declaration(null, null, null, function(env2, scope) {
                return env2.link(vao);
              });
              result.useVAO = true;
            }
          }
          if (attribLocations) {
            result.useVAO = true;
          } else {
            result.attributes = parseAttributes(attributes, env);
          }
          result.context = parseContext(context, env);
          return result;
        }
        function emitContext(env, scope, context) {
          var shared = env.shared;
          var CONTEXT = shared.context;
          var contextEnter = env.scope();
          Object.keys(context).forEach(function(name) {
            scope.save(CONTEXT, "." + name);
            var defn = context[name];
            var value = defn.append(env, scope);
            if (Array.isArray(value)) {
              contextEnter(CONTEXT, ".", name, "=[", value.join(), "];");
            } else {
              contextEnter(CONTEXT, ".", name, "=", value, ";");
            }
          });
          scope(contextEnter);
        }
        function emitPollFramebuffer(env, scope, framebuffer, skipCheck) {
          var shared = env.shared;
          var GL = shared.gl;
          var FRAMEBUFFER_STATE = shared.framebuffer;
          var EXT_DRAW_BUFFERS;
          if (extDrawBuffers) {
            EXT_DRAW_BUFFERS = scope.def(shared.extensions, ".webgl_draw_buffers");
          }
          var constants = env.constants;
          var DRAW_BUFFERS = constants.drawBuffer;
          var BACK_BUFFER = constants.backBuffer;
          var NEXT;
          if (framebuffer) {
            NEXT = framebuffer.append(env, scope);
          } else {
            NEXT = scope.def(FRAMEBUFFER_STATE, ".next");
          }
          if (!skipCheck) {
            scope("if(", NEXT, "!==", FRAMEBUFFER_STATE, ".cur){");
          }
          scope(
            "if(",
            NEXT,
            "){",
            GL,
            ".bindFramebuffer(",
            GL_FRAMEBUFFER$2,
            ",",
            NEXT,
            ".framebuffer);"
          );
          if (extDrawBuffers) {
            scope(
              EXT_DRAW_BUFFERS,
              ".drawBuffersWEBGL(",
              DRAW_BUFFERS,
              "[",
              NEXT,
              ".colorAttachments.length]);"
            );
          }
          scope(
            "}else{",
            GL,
            ".bindFramebuffer(",
            GL_FRAMEBUFFER$2,
            ",null);"
          );
          if (extDrawBuffers) {
            scope(EXT_DRAW_BUFFERS, ".drawBuffersWEBGL(", BACK_BUFFER, ");");
          }
          scope(
            "}",
            FRAMEBUFFER_STATE,
            ".cur=",
            NEXT,
            ";"
          );
          if (!skipCheck) {
            scope("}");
          }
        }
        function emitPollState(env, scope, args) {
          var shared = env.shared;
          var GL = shared.gl;
          var CURRENT_VARS = env.current;
          var NEXT_VARS = env.next;
          var CURRENT_STATE = shared.current;
          var NEXT_STATE = shared.next;
          var block = env.cond(CURRENT_STATE, ".dirty");
          GL_STATE_NAMES.forEach(function(prop) {
            var param = propName(prop);
            if (param in args.state) {
              return;
            }
            var NEXT, CURRENT;
            if (param in NEXT_VARS) {
              NEXT = NEXT_VARS[param];
              CURRENT = CURRENT_VARS[param];
              var parts = loop(currentState[param].length, function(i) {
                return block.def(NEXT, "[", i, "]");
              });
              block(env.cond(parts.map(function(p, i) {
                return p + "!==" + CURRENT + "[" + i + "]";
              }).join("||")).then(
                GL,
                ".",
                GL_VARIABLES[param],
                "(",
                parts,
                ");",
                parts.map(function(p, i) {
                  return CURRENT + "[" + i + "]=" + p;
                }).join(";"),
                ";"
              ));
            } else {
              NEXT = block.def(NEXT_STATE, ".", param);
              var ifte = env.cond(NEXT, "!==", CURRENT_STATE, ".", param);
              block(ifte);
              if (param in GL_FLAGS) {
                ifte(
                  env.cond(NEXT).then(GL, ".enable(", GL_FLAGS[param], ");").else(GL, ".disable(", GL_FLAGS[param], ");"),
                  CURRENT_STATE,
                  ".",
                  param,
                  "=",
                  NEXT,
                  ";"
                );
              } else {
                ifte(
                  GL,
                  ".",
                  GL_VARIABLES[param],
                  "(",
                  NEXT,
                  ");",
                  CURRENT_STATE,
                  ".",
                  param,
                  "=",
                  NEXT,
                  ";"
                );
              }
            }
          });
          if (Object.keys(args.state).length === 0) {
            block(CURRENT_STATE, ".dirty=false;");
          }
          scope(block);
        }
        function emitSetOptions(env, scope, options, filter) {
          var shared = env.shared;
          var CURRENT_VARS = env.current;
          var CURRENT_STATE = shared.current;
          var GL = shared.gl;
          sortState(Object.keys(options)).forEach(function(param) {
            var defn = options[param];
            if (filter && !filter(defn)) {
              return;
            }
            var variable = defn.append(env, scope);
            if (GL_FLAGS[param]) {
              var flag = GL_FLAGS[param];
              if (isStatic(defn)) {
                if (variable) {
                  scope(GL, ".enable(", flag, ");");
                } else {
                  scope(GL, ".disable(", flag, ");");
                }
              } else {
                scope(env.cond(variable).then(GL, ".enable(", flag, ");").else(GL, ".disable(", flag, ");"));
              }
              scope(CURRENT_STATE, ".", param, "=", variable, ";");
            } else if (isArrayLike(variable)) {
              var CURRENT = CURRENT_VARS[param];
              scope(
                GL,
                ".",
                GL_VARIABLES[param],
                "(",
                variable,
                ");",
                variable.map(function(v, i) {
                  return CURRENT + "[" + i + "]=" + v;
                }).join(";"),
                ";"
              );
            } else {
              scope(
                GL,
                ".",
                GL_VARIABLES[param],
                "(",
                variable,
                ");",
                CURRENT_STATE,
                ".",
                param,
                "=",
                variable,
                ";"
              );
            }
          });
        }
        function injectExtensions(env, scope) {
          if (extInstancing) {
            env.instancing = scope.def(
              env.shared.extensions,
              ".angle_instanced_arrays"
            );
          }
        }
        function emitProfile(env, scope, args, useScope, incrementCounter) {
          var shared = env.shared;
          var STATS = env.stats;
          var CURRENT_STATE = shared.current;
          var TIMER = shared.timer;
          var profileArg = args.profile;
          function perfCounter() {
            if (typeof performance === "undefined") {
              return "Date.now()";
            } else {
              return "performance.now()";
            }
          }
          var CPU_START, QUERY_COUNTER;
          function emitProfileStart(block) {
            CPU_START = scope.def();
            block(CPU_START, "=", perfCounter(), ";");
            if (typeof incrementCounter === "string") {
              block(STATS, ".count+=", incrementCounter, ";");
            } else {
              block(STATS, ".count++;");
            }
            if (timer) {
              if (useScope) {
                QUERY_COUNTER = scope.def();
                block(QUERY_COUNTER, "=", TIMER, ".getNumPendingQueries();");
              } else {
                block(TIMER, ".beginQuery(", STATS, ");");
              }
            }
          }
          function emitProfileEnd(block) {
            block(STATS, ".cpuTime+=", perfCounter(), "-", CPU_START, ";");
            if (timer) {
              if (useScope) {
                block(
                  TIMER,
                  ".pushScopeStats(",
                  QUERY_COUNTER,
                  ",",
                  TIMER,
                  ".getNumPendingQueries(),",
                  STATS,
                  ");"
                );
              } else {
                block(TIMER, ".endQuery();");
              }
            }
          }
          function scopeProfile(value) {
            var prev = scope.def(CURRENT_STATE, ".profile");
            scope(CURRENT_STATE, ".profile=", value, ";");
            scope.exit(CURRENT_STATE, ".profile=", prev, ";");
          }
          var USE_PROFILE;
          if (profileArg) {
            if (isStatic(profileArg)) {
              if (profileArg.enable) {
                emitProfileStart(scope);
                emitProfileEnd(scope.exit);
                scopeProfile("true");
              } else {
                scopeProfile("false");
              }
              return;
            }
            USE_PROFILE = profileArg.append(env, scope);
            scopeProfile(USE_PROFILE);
          } else {
            USE_PROFILE = scope.def(CURRENT_STATE, ".profile");
          }
          var start = env.block();
          emitProfileStart(start);
          scope("if(", USE_PROFILE, "){", start, "}");
          var end = env.block();
          emitProfileEnd(end);
          scope.exit("if(", USE_PROFILE, "){", end, "}");
        }
        function emitAttributes(env, scope, args, attributes, filter) {
          var shared = env.shared;
          function typeLength(x) {
            switch (x) {
              case GL_FLOAT_VEC2:
              case GL_INT_VEC2:
              case GL_BOOL_VEC2:
                return 2;
              case GL_FLOAT_VEC3:
              case GL_INT_VEC3:
              case GL_BOOL_VEC3:
                return 3;
              case GL_FLOAT_VEC4:
              case GL_INT_VEC4:
              case GL_BOOL_VEC4:
                return 4;
              default:
                return 1;
            }
          }
          function emitBindAttribute(ATTRIBUTE, size, record) {
            var GL = shared.gl;
            var LOCATION = scope.def(ATTRIBUTE, ".location");
            var BINDING = scope.def(shared.attributes, "[", LOCATION, "]");
            var STATE = record.state;
            var BUFFER = record.buffer;
            var CONST_COMPONENTS = [
              record.x,
              record.y,
              record.z,
              record.w
            ];
            var COMMON_KEYS = [
              "buffer",
              "normalized",
              "offset",
              "stride"
            ];
            function emitBuffer() {
              scope(
                "if(!",
                BINDING,
                ".buffer){",
                GL,
                ".enableVertexAttribArray(",
                LOCATION,
                ");}"
              );
              var TYPE = record.type;
              var SIZE;
              if (!record.size) {
                SIZE = size;
              } else {
                SIZE = scope.def(record.size, "||", size);
              }
              scope(
                "if(",
                BINDING,
                ".type!==",
                TYPE,
                "||",
                BINDING,
                ".size!==",
                SIZE,
                "||",
                COMMON_KEYS.map(function(key) {
                  return BINDING + "." + key + "!==" + record[key];
                }).join("||"),
                "){",
                GL,
                ".bindBuffer(",
                GL_ARRAY_BUFFER$2,
                ",",
                BUFFER,
                ".buffer);",
                GL,
                ".vertexAttribPointer(",
                [
                  LOCATION,
                  SIZE,
                  TYPE,
                  record.normalized,
                  record.stride,
                  record.offset
                ],
                ");",
                BINDING,
                ".type=",
                TYPE,
                ";",
                BINDING,
                ".size=",
                SIZE,
                ";",
                COMMON_KEYS.map(function(key) {
                  return BINDING + "." + key + "=" + record[key] + ";";
                }).join(""),
                "}"
              );
              if (extInstancing) {
                var DIVISOR = record.divisor;
                scope(
                  "if(",
                  BINDING,
                  ".divisor!==",
                  DIVISOR,
                  "){",
                  env.instancing,
                  ".vertexAttribDivisorANGLE(",
                  [LOCATION, DIVISOR],
                  ");",
                  BINDING,
                  ".divisor=",
                  DIVISOR,
                  ";}"
                );
              }
            }
            function emitConstant() {
              scope(
                "if(",
                BINDING,
                ".buffer){",
                GL,
                ".disableVertexAttribArray(",
                LOCATION,
                ");",
                BINDING,
                ".buffer=null;",
                "}if(",
                CUTE_COMPONENTS.map(function(c, i) {
                  return BINDING + "." + c + "!==" + CONST_COMPONENTS[i];
                }).join("||"),
                "){",
                GL,
                ".vertexAttrib4f(",
                LOCATION,
                ",",
                CONST_COMPONENTS,
                ");",
                CUTE_COMPONENTS.map(function(c, i) {
                  return BINDING + "." + c + "=" + CONST_COMPONENTS[i] + ";";
                }).join(""),
                "}"
              );
            }
            if (STATE === ATTRIB_STATE_POINTER) {
              emitBuffer();
            } else if (STATE === ATTRIB_STATE_CONSTANT) {
              emitConstant();
            } else {
              scope("if(", STATE, "===", ATTRIB_STATE_POINTER, "){");
              emitBuffer();
              scope("}else{");
              emitConstant();
              scope("}");
            }
          }
          attributes.forEach(function(attribute) {
            var name = attribute.name;
            var arg = args.attributes[name];
            var record;
            if (arg) {
              if (!filter(arg)) {
                return;
              }
              record = arg.append(env, scope);
            } else {
              if (!filter(SCOPE_DECL)) {
                return;
              }
              var scopeAttrib = env.scopeAttrib(name);
              check$1.optional(function() {
                env.assert(
                  scope,
                  scopeAttrib + ".state",
                  "missing attribute " + name
                );
              });
              record = {};
              Object.keys(new AttributeRecord2()).forEach(function(key) {
                record[key] = scope.def(scopeAttrib, ".", key);
              });
            }
            emitBindAttribute(
              env.link(attribute),
              typeLength(attribute.info.type),
              record
            );
          });
        }
        function emitUniforms(env, scope, args, uniforms, filter, isBatchInnerLoop) {
          var shared = env.shared;
          var GL = shared.gl;
          var infix;
          for (var i = 0; i < uniforms.length; ++i) {
            var uniform = uniforms[i];
            var name = uniform.name;
            var type = uniform.info.type;
            var arg = args.uniforms[name];
            var UNIFORM = env.link(uniform);
            var LOCATION = UNIFORM + ".location";
            var VALUE;
            if (arg) {
              if (!filter(arg)) {
                continue;
              }
              if (isStatic(arg)) {
                var value = arg.value;
                check$1.command(
                  value !== null && typeof value !== "undefined",
                  'missing uniform "' + name + '"',
                  env.commandStr
                );
                if (type === GL_SAMPLER_2D || type === GL_SAMPLER_CUBE) {
                  check$1.command(
                    typeof value === "function" && (type === GL_SAMPLER_2D && (value._reglType === "texture2d" || value._reglType === "framebuffer") || type === GL_SAMPLER_CUBE && (value._reglType === "textureCube" || value._reglType === "framebufferCube")),
                    "invalid texture for uniform " + name,
                    env.commandStr
                  );
                  var TEX_VALUE = env.link(value._texture || value.color[0]._texture);
                  scope(GL, ".uniform1i(", LOCATION, ",", TEX_VALUE + ".bind());");
                  scope.exit(TEX_VALUE, ".unbind();");
                } else if (type === GL_FLOAT_MAT2 || type === GL_FLOAT_MAT3 || type === GL_FLOAT_MAT4) {
                  check$1.optional(function() {
                    check$1.command(
                      isArrayLike(value),
                      "invalid matrix for uniform " + name,
                      env.commandStr
                    );
                    check$1.command(
                      type === GL_FLOAT_MAT2 && value.length === 4 || type === GL_FLOAT_MAT3 && value.length === 9 || type === GL_FLOAT_MAT4 && value.length === 16,
                      "invalid length for matrix uniform " + name,
                      env.commandStr
                    );
                  });
                  var MAT_VALUE = env.global.def("new Float32Array([" + Array.prototype.slice.call(value) + "])");
                  var dim = 2;
                  if (type === GL_FLOAT_MAT3) {
                    dim = 3;
                  } else if (type === GL_FLOAT_MAT4) {
                    dim = 4;
                  }
                  scope(
                    GL,
                    ".uniformMatrix",
                    dim,
                    "fv(",
                    LOCATION,
                    ",false,",
                    MAT_VALUE,
                    ");"
                  );
                } else {
                  switch (type) {
                    case GL_FLOAT$8:
                      check$1.commandType(value, "number", "uniform " + name, env.commandStr);
                      infix = "1f";
                      break;
                    case GL_FLOAT_VEC2:
                      check$1.command(
                        isArrayLike(value) && value.length === 2,
                        "uniform " + name,
                        env.commandStr
                      );
                      infix = "2f";
                      break;
                    case GL_FLOAT_VEC3:
                      check$1.command(
                        isArrayLike(value) && value.length === 3,
                        "uniform " + name,
                        env.commandStr
                      );
                      infix = "3f";
                      break;
                    case GL_FLOAT_VEC4:
                      check$1.command(
                        isArrayLike(value) && value.length === 4,
                        "uniform " + name,
                        env.commandStr
                      );
                      infix = "4f";
                      break;
                    case GL_BOOL:
                      check$1.commandType(value, "boolean", "uniform " + name, env.commandStr);
                      infix = "1i";
                      break;
                    case GL_INT$3:
                      check$1.commandType(value, "number", "uniform " + name, env.commandStr);
                      infix = "1i";
                      break;
                    case GL_BOOL_VEC2:
                      check$1.command(
                        isArrayLike(value) && value.length === 2,
                        "uniform " + name,
                        env.commandStr
                      );
                      infix = "2i";
                      break;
                    case GL_INT_VEC2:
                      check$1.command(
                        isArrayLike(value) && value.length === 2,
                        "uniform " + name,
                        env.commandStr
                      );
                      infix = "2i";
                      break;
                    case GL_BOOL_VEC3:
                      check$1.command(
                        isArrayLike(value) && value.length === 3,
                        "uniform " + name,
                        env.commandStr
                      );
                      infix = "3i";
                      break;
                    case GL_INT_VEC3:
                      check$1.command(
                        isArrayLike(value) && value.length === 3,
                        "uniform " + name,
                        env.commandStr
                      );
                      infix = "3i";
                      break;
                    case GL_BOOL_VEC4:
                      check$1.command(
                        isArrayLike(value) && value.length === 4,
                        "uniform " + name,
                        env.commandStr
                      );
                      infix = "4i";
                      break;
                    case GL_INT_VEC4:
                      check$1.command(
                        isArrayLike(value) && value.length === 4,
                        "uniform " + name,
                        env.commandStr
                      );
                      infix = "4i";
                      break;
                  }
                  scope(
                    GL,
                    ".uniform",
                    infix,
                    "(",
                    LOCATION,
                    ",",
                    isArrayLike(value) ? Array.prototype.slice.call(value) : value,
                    ");"
                  );
                }
                continue;
              } else {
                VALUE = arg.append(env, scope);
              }
            } else {
              if (!filter(SCOPE_DECL)) {
                continue;
              }
              VALUE = scope.def(shared.uniforms, "[", stringStore.id(name), "]");
            }
            if (type === GL_SAMPLER_2D) {
              check$1(!Array.isArray(VALUE), "must specify a scalar prop for textures");
              scope(
                "if(",
                VALUE,
                "&&",
                VALUE,
                '._reglType==="framebuffer"){',
                VALUE,
                "=",
                VALUE,
                ".color[0];",
                "}"
              );
            } else if (type === GL_SAMPLER_CUBE) {
              check$1(!Array.isArray(VALUE), "must specify a scalar prop for cube maps");
              scope(
                "if(",
                VALUE,
                "&&",
                VALUE,
                '._reglType==="framebufferCube"){',
                VALUE,
                "=",
                VALUE,
                ".color[0];",
                "}"
              );
            }
            check$1.optional(function() {
              function emitCheck(pred, message) {
                env.assert(
                  scope,
                  pred,
                  'bad data or missing for uniform "' + name + '".  ' + message
                );
              }
              function checkType(type2) {
                check$1(!Array.isArray(VALUE), "must not specify an array type for uniform");
                emitCheck(
                  "typeof " + VALUE + '==="' + type2 + '"',
                  "invalid type, expected " + type2
                );
              }
              function checkVector(n, type2) {
                if (Array.isArray(VALUE)) {
                  check$1(VALUE.length === n, "must have length " + n);
                } else {
                  emitCheck(
                    shared.isArrayLike + "(" + VALUE + ")&&" + VALUE + ".length===" + n,
                    "invalid vector, should have length " + n,
                    env.commandStr
                  );
                }
              }
              function checkTexture(target) {
                check$1(!Array.isArray(VALUE), "must not specify a value type");
                emitCheck(
                  "typeof " + VALUE + '==="function"&&' + VALUE + '._reglType==="texture' + (target === GL_TEXTURE_2D$3 ? "2d" : "Cube") + '"',
                  "invalid texture type",
                  env.commandStr
                );
              }
              switch (type) {
                case GL_INT$3:
                  checkType("number");
                  break;
                case GL_INT_VEC2:
                  checkVector(2, "number");
                  break;
                case GL_INT_VEC3:
                  checkVector(3, "number");
                  break;
                case GL_INT_VEC4:
                  checkVector(4, "number");
                  break;
                case GL_FLOAT$8:
                  checkType("number");
                  break;
                case GL_FLOAT_VEC2:
                  checkVector(2, "number");
                  break;
                case GL_FLOAT_VEC3:
                  checkVector(3, "number");
                  break;
                case GL_FLOAT_VEC4:
                  checkVector(4, "number");
                  break;
                case GL_BOOL:
                  checkType("boolean");
                  break;
                case GL_BOOL_VEC2:
                  checkVector(2, "boolean");
                  break;
                case GL_BOOL_VEC3:
                  checkVector(3, "boolean");
                  break;
                case GL_BOOL_VEC4:
                  checkVector(4, "boolean");
                  break;
                case GL_FLOAT_MAT2:
                  checkVector(4, "number");
                  break;
                case GL_FLOAT_MAT3:
                  checkVector(9, "number");
                  break;
                case GL_FLOAT_MAT4:
                  checkVector(16, "number");
                  break;
                case GL_SAMPLER_2D:
                  checkTexture(GL_TEXTURE_2D$3);
                  break;
                case GL_SAMPLER_CUBE:
                  checkTexture(GL_TEXTURE_CUBE_MAP$2);
                  break;
              }
            });
            var unroll = 1;
            switch (type) {
              case GL_SAMPLER_2D:
              case GL_SAMPLER_CUBE:
                var TEX = scope.def(VALUE, "._texture");
                scope(GL, ".uniform1i(", LOCATION, ",", TEX, ".bind());");
                scope.exit(TEX, ".unbind();");
                continue;
              case GL_INT$3:
              case GL_BOOL:
                infix = "1i";
                break;
              case GL_INT_VEC2:
              case GL_BOOL_VEC2:
                infix = "2i";
                unroll = 2;
                break;
              case GL_INT_VEC3:
              case GL_BOOL_VEC3:
                infix = "3i";
                unroll = 3;
                break;
              case GL_INT_VEC4:
              case GL_BOOL_VEC4:
                infix = "4i";
                unroll = 4;
                break;
              case GL_FLOAT$8:
                infix = "1f";
                break;
              case GL_FLOAT_VEC2:
                infix = "2f";
                unroll = 2;
                break;
              case GL_FLOAT_VEC3:
                infix = "3f";
                unroll = 3;
                break;
              case GL_FLOAT_VEC4:
                infix = "4f";
                unroll = 4;
                break;
              case GL_FLOAT_MAT2:
                infix = "Matrix2fv";
                break;
              case GL_FLOAT_MAT3:
                infix = "Matrix3fv";
                break;
              case GL_FLOAT_MAT4:
                infix = "Matrix4fv";
                break;
            }
            if (infix.charAt(0) === "M") {
              scope(GL, ".uniform", infix, "(", LOCATION, ",");
              var matSize = Math.pow(type - GL_FLOAT_MAT2 + 2, 2);
              var STORAGE = env.global.def("new Float32Array(", matSize, ")");
              if (Array.isArray(VALUE)) {
                scope(
                  "false,(",
                  loop(matSize, function(i2) {
                    return STORAGE + "[" + i2 + "]=" + VALUE[i2];
                  }),
                  ",",
                  STORAGE,
                  ")"
                );
              } else {
                scope(
                  "false,(Array.isArray(",
                  VALUE,
                  ")||",
                  VALUE,
                  " instanceof Float32Array)?",
                  VALUE,
                  ":(",
                  loop(matSize, function(i2) {
                    return STORAGE + "[" + i2 + "]=" + VALUE + "[" + i2 + "]";
                  }),
                  ",",
                  STORAGE,
                  ")"
                );
              }
              scope(");");
            } else if (unroll > 1) {
              var prev = [];
              var cur = [];
              for (var j = 0; j < unroll; ++j) {
                if (Array.isArray(VALUE)) {
                  cur.push(VALUE[j]);
                } else {
                  cur.push(scope.def(VALUE + "[" + j + "]"));
                }
                if (isBatchInnerLoop) {
                  prev.push(scope.def());
                }
              }
              if (isBatchInnerLoop) {
                scope("if(!", env.batchId, "||", prev.map(function(p, i2) {
                  return p + "!==" + cur[i2];
                }).join("||"), "){", prev.map(function(p, i2) {
                  return p + "=" + cur[i2] + ";";
                }).join(""));
              }
              scope(GL, ".uniform", infix, "(", LOCATION, ",", cur.join(","), ");");
              if (isBatchInnerLoop) {
                scope("}");
              }
            } else {
              check$1(!Array.isArray(VALUE), "uniform value must not be an array");
              if (isBatchInnerLoop) {
                var prevS = scope.def();
                scope(
                  "if(!",
                  env.batchId,
                  "||",
                  prevS,
                  "!==",
                  VALUE,
                  "){",
                  prevS,
                  "=",
                  VALUE,
                  ";"
                );
              }
              scope(GL, ".uniform", infix, "(", LOCATION, ",", VALUE, ");");
              if (isBatchInnerLoop) {
                scope("}");
              }
            }
          }
        }
        function emitDraw(env, outer, inner, args) {
          var shared = env.shared;
          var GL = shared.gl;
          var DRAW_STATE = shared.draw;
          var drawOptions = args.draw;
          function emitElements() {
            var defn = drawOptions.elements;
            var ELEMENTS2;
            var scope = outer;
            if (defn) {
              if (defn.contextDep && args.contextDynamic || defn.propDep) {
                scope = inner;
              }
              ELEMENTS2 = defn.append(env, scope);
              if (drawOptions.elementsActive) {
                scope(
                  "if(" + ELEMENTS2 + ")" + GL + ".bindBuffer(" + GL_ELEMENT_ARRAY_BUFFER$2 + "," + ELEMENTS2 + ".buffer.buffer);"
                );
              }
            } else {
              ELEMENTS2 = scope.def();
              scope(
                ELEMENTS2,
                "=",
                DRAW_STATE,
                ".",
                S_ELEMENTS,
                ";",
                "if(",
                ELEMENTS2,
                "){",
                GL,
                ".bindBuffer(",
                GL_ELEMENT_ARRAY_BUFFER$2,
                ",",
                ELEMENTS2,
                ".buffer.buffer);}",
                "else if(",
                shared.vao,
                ".currentVAO){",
                ELEMENTS2,
                "=",
                env.shared.elements + ".getElements(" + shared.vao,
                ".currentVAO.elements);",
                !extVertexArrays ? "if(" + ELEMENTS2 + ")" + GL + ".bindBuffer(" + GL_ELEMENT_ARRAY_BUFFER$2 + "," + ELEMENTS2 + ".buffer.buffer);" : "",
                "}"
              );
            }
            return ELEMENTS2;
          }
          function emitCount() {
            var defn = drawOptions.count;
            var COUNT2;
            var scope = outer;
            if (defn) {
              if (defn.contextDep && args.contextDynamic || defn.propDep) {
                scope = inner;
              }
              COUNT2 = defn.append(env, scope);
              check$1.optional(function() {
                if (defn.MISSING) {
                  env.assert(outer, "false", "missing vertex count");
                }
                if (defn.DYNAMIC) {
                  env.assert(scope, COUNT2 + ">=0", "missing vertex count");
                }
              });
            } else {
              COUNT2 = scope.def(DRAW_STATE, ".", S_COUNT);
              check$1.optional(function() {
                env.assert(scope, COUNT2 + ">=0", "missing vertex count");
              });
            }
            return COUNT2;
          }
          var ELEMENTS = emitElements();
          function emitValue(name) {
            var defn = drawOptions[name];
            if (defn) {
              if (defn.contextDep && args.contextDynamic || defn.propDep) {
                return defn.append(env, inner);
              } else {
                return defn.append(env, outer);
              }
            } else {
              return outer.def(DRAW_STATE, ".", name);
            }
          }
          var PRIMITIVE = emitValue(S_PRIMITIVE);
          var OFFSET = emitValue(S_OFFSET);
          var COUNT = emitCount();
          if (typeof COUNT === "number") {
            if (COUNT === 0) {
              return;
            }
          } else {
            inner("if(", COUNT, "){");
            inner.exit("}");
          }
          var INSTANCES, EXT_INSTANCING;
          if (extInstancing) {
            INSTANCES = emitValue(S_INSTANCES);
            EXT_INSTANCING = env.instancing;
          }
          var ELEMENT_TYPE = ELEMENTS + ".type";
          var elementsStatic = drawOptions.elements && isStatic(drawOptions.elements) && !drawOptions.vaoActive;
          function emitInstancing() {
            function drawElements() {
              inner(EXT_INSTANCING, ".drawElementsInstancedANGLE(", [
                PRIMITIVE,
                COUNT,
                ELEMENT_TYPE,
                OFFSET + "<<((" + ELEMENT_TYPE + "-" + GL_UNSIGNED_BYTE$8 + ")>>1)",
                INSTANCES
              ], ");");
            }
            function drawArrays() {
              inner(
                EXT_INSTANCING,
                ".drawArraysInstancedANGLE(",
                [PRIMITIVE, OFFSET, COUNT, INSTANCES],
                ");"
              );
            }
            if (ELEMENTS && ELEMENTS !== "null") {
              if (!elementsStatic) {
                inner("if(", ELEMENTS, "){");
                drawElements();
                inner("}else{");
                drawArrays();
                inner("}");
              } else {
                drawElements();
              }
            } else {
              drawArrays();
            }
          }
          function emitRegular() {
            function drawElements() {
              inner(GL + ".drawElements(" + [
                PRIMITIVE,
                COUNT,
                ELEMENT_TYPE,
                OFFSET + "<<((" + ELEMENT_TYPE + "-" + GL_UNSIGNED_BYTE$8 + ")>>1)"
              ] + ");");
            }
            function drawArrays() {
              inner(GL + ".drawArrays(" + [PRIMITIVE, OFFSET, COUNT] + ");");
            }
            if (ELEMENTS && ELEMENTS !== "null") {
              if (!elementsStatic) {
                inner("if(", ELEMENTS, "){");
                drawElements();
                inner("}else{");
                drawArrays();
                inner("}");
              } else {
                drawElements();
              }
            } else {
              drawArrays();
            }
          }
          if (extInstancing && (typeof INSTANCES !== "number" || INSTANCES >= 0)) {
            if (typeof INSTANCES === "string") {
              inner("if(", INSTANCES, ">0){");
              emitInstancing();
              inner("}else if(", INSTANCES, "<0){");
              emitRegular();
              inner("}");
            } else {
              emitInstancing();
            }
          } else {
            emitRegular();
          }
        }
        function createBody(emitBody, parentEnv, args, program, count) {
          var env = createREGLEnvironment();
          var scope = env.proc("body", count);
          check$1.optional(function() {
            env.commandStr = parentEnv.commandStr;
            env.command = env.link(parentEnv.commandStr);
          });
          if (extInstancing) {
            env.instancing = scope.def(
              env.shared.extensions,
              ".angle_instanced_arrays"
            );
          }
          emitBody(env, scope, args, program);
          return env.compile().body;
        }
        function emitDrawBody(env, draw, args, program) {
          injectExtensions(env, draw);
          if (args.useVAO) {
            if (args.drawVAO) {
              draw(env.shared.vao, ".setVAO(", args.drawVAO.append(env, draw), ");");
            } else {
              draw(env.shared.vao, ".setVAO(", env.shared.vao, ".targetVAO);");
            }
          } else {
            draw(env.shared.vao, ".setVAO(null);");
            emitAttributes(env, draw, args, program.attributes, function() {
              return true;
            });
          }
          emitUniforms(env, draw, args, program.uniforms, function() {
            return true;
          }, false);
          emitDraw(env, draw, draw, args);
        }
        function emitDrawProc(env, args) {
          var draw = env.proc("draw", 1);
          injectExtensions(env, draw);
          emitContext(env, draw, args.context);
          emitPollFramebuffer(env, draw, args.framebuffer);
          emitPollState(env, draw, args);
          emitSetOptions(env, draw, args.state);
          emitProfile(env, draw, args, false, true);
          var program = args.shader.progVar.append(env, draw);
          draw(env.shared.gl, ".useProgram(", program, ".program);");
          if (args.shader.program) {
            emitDrawBody(env, draw, args, args.shader.program);
          } else {
            draw(env.shared.vao, ".setVAO(null);");
            var drawCache = env.global.def("{}");
            var PROG_ID = draw.def(program, ".id");
            var CACHED_PROC = draw.def(drawCache, "[", PROG_ID, "]");
            draw(
              env.cond(CACHED_PROC).then(CACHED_PROC, ".call(this,a0);").else(
                CACHED_PROC,
                "=",
                drawCache,
                "[",
                PROG_ID,
                "]=",
                env.link(function(program2) {
                  return createBody(emitDrawBody, env, args, program2, 1);
                }),
                "(",
                program,
                ");",
                CACHED_PROC,
                ".call(this,a0);"
              )
            );
          }
          if (Object.keys(args.state).length > 0) {
            draw(env.shared.current, ".dirty=true;");
          }
          if (env.shared.vao) {
            draw(env.shared.vao, ".setVAO(null);");
          }
        }
        function emitBatchDynamicShaderBody(env, scope, args, program) {
          env.batchId = "a1";
          injectExtensions(env, scope);
          function all() {
            return true;
          }
          emitAttributes(env, scope, args, program.attributes, all);
          emitUniforms(env, scope, args, program.uniforms, all, false);
          emitDraw(env, scope, scope, args);
        }
        function emitBatchBody(env, scope, args, program) {
          injectExtensions(env, scope);
          var contextDynamic = args.contextDep;
          var BATCH_ID = scope.def();
          var PROP_LIST = "a0";
          var NUM_PROPS = "a1";
          var PROPS = scope.def();
          env.shared.props = PROPS;
          env.batchId = BATCH_ID;
          var outer = env.scope();
          var inner = env.scope();
          scope(
            outer.entry,
            "for(",
            BATCH_ID,
            "=0;",
            BATCH_ID,
            "<",
            NUM_PROPS,
            ";++",
            BATCH_ID,
            "){",
            PROPS,
            "=",
            PROP_LIST,
            "[",
            BATCH_ID,
            "];",
            inner,
            "}",
            outer.exit
          );
          function isInnerDefn(defn) {
            return defn.contextDep && contextDynamic || defn.propDep;
          }
          function isOuterDefn(defn) {
            return !isInnerDefn(defn);
          }
          if (args.needsContext) {
            emitContext(env, inner, args.context);
          }
          if (args.needsFramebuffer) {
            emitPollFramebuffer(env, inner, args.framebuffer);
          }
          emitSetOptions(env, inner, args.state, isInnerDefn);
          if (args.profile && isInnerDefn(args.profile)) {
            emitProfile(env, inner, args, false, true);
          }
          if (!program) {
            var progCache = env.global.def("{}");
            var PROGRAM = args.shader.progVar.append(env, inner);
            var PROG_ID = inner.def(PROGRAM, ".id");
            var CACHED_PROC = inner.def(progCache, "[", PROG_ID, "]");
            inner(
              env.shared.gl,
              ".useProgram(",
              PROGRAM,
              ".program);",
              "if(!",
              CACHED_PROC,
              "){",
              CACHED_PROC,
              "=",
              progCache,
              "[",
              PROG_ID,
              "]=",
              env.link(function(program2) {
                return createBody(
                  emitBatchDynamicShaderBody,
                  env,
                  args,
                  program2,
                  2
                );
              }),
              "(",
              PROGRAM,
              ");}",
              CACHED_PROC,
              ".call(this,a0[",
              BATCH_ID,
              "],",
              BATCH_ID,
              ");"
            );
          } else {
            if (args.useVAO) {
              if (args.drawVAO) {
                if (isInnerDefn(args.drawVAO)) {
                  inner(env.shared.vao, ".setVAO(", args.drawVAO.append(env, inner), ");");
                } else {
                  outer(env.shared.vao, ".setVAO(", args.drawVAO.append(env, outer), ");");
                }
              } else {
                outer(env.shared.vao, ".setVAO(", env.shared.vao, ".targetVAO);");
              }
            } else {
              outer(env.shared.vao, ".setVAO(null);");
              emitAttributes(env, outer, args, program.attributes, isOuterDefn);
              emitAttributes(env, inner, args, program.attributes, isInnerDefn);
            }
            emitUniforms(env, outer, args, program.uniforms, isOuterDefn, false);
            emitUniforms(env, inner, args, program.uniforms, isInnerDefn, true);
            emitDraw(env, outer, inner, args);
          }
        }
        function emitBatchProc(env, args) {
          var batch = env.proc("batch", 2);
          env.batchId = "0";
          injectExtensions(env, batch);
          var contextDynamic = false;
          var needsContext = true;
          Object.keys(args.context).forEach(function(name) {
            contextDynamic = contextDynamic || args.context[name].propDep;
          });
          if (!contextDynamic) {
            emitContext(env, batch, args.context);
            needsContext = false;
          }
          var framebuffer = args.framebuffer;
          var needsFramebuffer = false;
          if (framebuffer) {
            if (framebuffer.propDep) {
              contextDynamic = needsFramebuffer = true;
            } else if (framebuffer.contextDep && contextDynamic) {
              needsFramebuffer = true;
            }
            if (!needsFramebuffer) {
              emitPollFramebuffer(env, batch, framebuffer);
            }
          } else {
            emitPollFramebuffer(env, batch, null);
          }
          if (args.state.viewport && args.state.viewport.propDep) {
            contextDynamic = true;
          }
          function isInnerDefn(defn) {
            return defn.contextDep && contextDynamic || defn.propDep;
          }
          emitPollState(env, batch, args);
          emitSetOptions(env, batch, args.state, function(defn) {
            return !isInnerDefn(defn);
          });
          if (!args.profile || !isInnerDefn(args.profile)) {
            emitProfile(env, batch, args, false, "a1");
          }
          args.contextDep = contextDynamic;
          args.needsContext = needsContext;
          args.needsFramebuffer = needsFramebuffer;
          var progDefn = args.shader.progVar;
          if (progDefn.contextDep && contextDynamic || progDefn.propDep) {
            emitBatchBody(
              env,
              batch,
              args,
              null
            );
          } else {
            var PROGRAM = progDefn.append(env, batch);
            batch(env.shared.gl, ".useProgram(", PROGRAM, ".program);");
            if (args.shader.program) {
              emitBatchBody(
                env,
                batch,
                args,
                args.shader.program
              );
            } else {
              batch(env.shared.vao, ".setVAO(null);");
              var batchCache = env.global.def("{}");
              var PROG_ID = batch.def(PROGRAM, ".id");
              var CACHED_PROC = batch.def(batchCache, "[", PROG_ID, "]");
              batch(
                env.cond(CACHED_PROC).then(CACHED_PROC, ".call(this,a0,a1);").else(
                  CACHED_PROC,
                  "=",
                  batchCache,
                  "[",
                  PROG_ID,
                  "]=",
                  env.link(function(program) {
                    return createBody(emitBatchBody, env, args, program, 2);
                  }),
                  "(",
                  PROGRAM,
                  ");",
                  CACHED_PROC,
                  ".call(this,a0,a1);"
                )
              );
            }
          }
          if (Object.keys(args.state).length > 0) {
            batch(env.shared.current, ".dirty=true;");
          }
          if (env.shared.vao) {
            batch(env.shared.vao, ".setVAO(null);");
          }
        }
        function emitScopeProc(env, args) {
          var scope = env.proc("scope", 3);
          env.batchId = "a2";
          var shared = env.shared;
          var CURRENT_STATE = shared.current;
          emitContext(env, scope, args.context);
          if (args.framebuffer) {
            args.framebuffer.append(env, scope);
          }
          sortState(Object.keys(args.state)).forEach(function(name) {
            var defn = args.state[name];
            var value = defn.append(env, scope);
            if (isArrayLike(value)) {
              value.forEach(function(v, i) {
                scope.set(env.next[name], "[" + i + "]", v);
              });
            } else {
              scope.set(shared.next, "." + name, value);
            }
          });
          emitProfile(env, scope, args, true, true);
          [S_ELEMENTS, S_OFFSET, S_COUNT, S_INSTANCES, S_PRIMITIVE].forEach(
            function(opt) {
              var variable = args.draw[opt];
              if (!variable) {
                return;
              }
              scope.set(shared.draw, "." + opt, "" + variable.append(env, scope));
            }
          );
          Object.keys(args.uniforms).forEach(function(opt) {
            var value = args.uniforms[opt].append(env, scope);
            if (Array.isArray(value)) {
              value = "[" + value.join() + "]";
            }
            scope.set(
              shared.uniforms,
              "[" + stringStore.id(opt) + "]",
              value
            );
          });
          Object.keys(args.attributes).forEach(function(name) {
            var record = args.attributes[name].append(env, scope);
            var scopeAttrib = env.scopeAttrib(name);
            Object.keys(new AttributeRecord2()).forEach(function(prop) {
              scope.set(scopeAttrib, "." + prop, record[prop]);
            });
          });
          if (args.scopeVAO) {
            scope.set(shared.vao, ".targetVAO", args.scopeVAO.append(env, scope));
          }
          function saveShader(name) {
            var shader = args.shader[name];
            if (shader) {
              scope.set(shared.shader, "." + name, shader.append(env, scope));
            }
          }
          saveShader(S_VERT);
          saveShader(S_FRAG);
          if (Object.keys(args.state).length > 0) {
            scope(CURRENT_STATE, ".dirty=true;");
            scope.exit(CURRENT_STATE, ".dirty=true;");
          }
          scope("a1(", env.shared.context, ",a0,", env.batchId, ");");
        }
        function isDynamicObject(object) {
          if (typeof object !== "object" || isArrayLike(object)) {
            return;
          }
          var props = Object.keys(object);
          for (var i = 0; i < props.length; ++i) {
            if (dynamic.isDynamic(object[props[i]])) {
              return true;
            }
          }
          return false;
        }
        function splatObject(env, options, name) {
          var object = options.static[name];
          if (!object || !isDynamicObject(object)) {
            return;
          }
          var globals = env.global;
          var keys = Object.keys(object);
          var thisDep = false;
          var contextDep = false;
          var propDep = false;
          var objectRef = env.global.def("{}");
          keys.forEach(function(key) {
            var value = object[key];
            if (dynamic.isDynamic(value)) {
              if (typeof value === "function") {
                value = object[key] = dynamic.unbox(value);
              }
              var deps = createDynamicDecl(value, null);
              thisDep = thisDep || deps.thisDep;
              propDep = propDep || deps.propDep;
              contextDep = contextDep || deps.contextDep;
            } else {
              globals(objectRef, ".", key, "=");
              switch (typeof value) {
                case "number":
                  globals(value);
                  break;
                case "string":
                  globals('"', value, '"');
                  break;
                case "object":
                  if (Array.isArray(value)) {
                    globals("[", value.join(), "]");
                  }
                  break;
                default:
                  globals(env.link(value));
                  break;
              }
              globals(";");
            }
          });
          function appendBlock(env2, block) {
            keys.forEach(function(key) {
              var value = object[key];
              if (!dynamic.isDynamic(value)) {
                return;
              }
              var ref = env2.invoke(block, value);
              block(objectRef, ".", key, "=", ref, ";");
            });
          }
          options.dynamic[name] = new dynamic.DynamicVariable(DYN_THUNK, {
            thisDep,
            contextDep,
            propDep,
            ref: objectRef,
            append: appendBlock
          });
          delete options.static[name];
        }
        function compileCommand(options, attributes, uniforms, context, stats2) {
          var env = createREGLEnvironment();
          env.stats = env.link(stats2);
          Object.keys(attributes.static).forEach(function(key) {
            splatObject(env, attributes, key);
          });
          NESTED_OPTIONS.forEach(function(name) {
            splatObject(env, options, name);
          });
          var args = parseArguments(options, attributes, uniforms, context, env);
          emitDrawProc(env, args);
          emitScopeProc(env, args);
          emitBatchProc(env, args);
          return extend(env.compile(), {
            destroy: function() {
              args.shader.program.destroy();
            }
          });
        }
        return {
          next: nextState,
          current: currentState,
          procs: function() {
            var env = createREGLEnvironment();
            var poll = env.proc("poll");
            var refresh = env.proc("refresh");
            var common = env.block();
            poll(common);
            refresh(common);
            var shared = env.shared;
            var GL = shared.gl;
            var NEXT_STATE = shared.next;
            var CURRENT_STATE = shared.current;
            common(CURRENT_STATE, ".dirty=false;");
            emitPollFramebuffer(env, poll);
            emitPollFramebuffer(env, refresh, null, true);
            var INSTANCING;
            if (extInstancing) {
              INSTANCING = env.link(extInstancing);
            }
            if (extensions.oes_vertex_array_object) {
              refresh(env.link(extensions.oes_vertex_array_object), ".bindVertexArrayOES(null);");
            }
            for (var i = 0; i < limits.maxAttributes; ++i) {
              var BINDING = refresh.def(shared.attributes, "[", i, "]");
              var ifte = env.cond(BINDING, ".buffer");
              ifte.then(
                GL,
                ".enableVertexAttribArray(",
                i,
                ");",
                GL,
                ".bindBuffer(",
                GL_ARRAY_BUFFER$2,
                ",",
                BINDING,
                ".buffer.buffer);",
                GL,
                ".vertexAttribPointer(",
                i,
                ",",
                BINDING,
                ".size,",
                BINDING,
                ".type,",
                BINDING,
                ".normalized,",
                BINDING,
                ".stride,",
                BINDING,
                ".offset);"
              ).else(
                GL,
                ".disableVertexAttribArray(",
                i,
                ");",
                GL,
                ".vertexAttrib4f(",
                i,
                ",",
                BINDING,
                ".x,",
                BINDING,
                ".y,",
                BINDING,
                ".z,",
                BINDING,
                ".w);",
                BINDING,
                ".buffer=null;"
              );
              refresh(ifte);
              if (extInstancing) {
                refresh(
                  INSTANCING,
                  ".vertexAttribDivisorANGLE(",
                  i,
                  ",",
                  BINDING,
                  ".divisor);"
                );
              }
            }
            refresh(
              env.shared.vao,
              ".currentVAO=null;",
              env.shared.vao,
              ".setVAO(",
              env.shared.vao,
              ".targetVAO);"
            );
            Object.keys(GL_FLAGS).forEach(function(flag) {
              var cap = GL_FLAGS[flag];
              var NEXT = common.def(NEXT_STATE, ".", flag);
              var block = env.block();
              block(
                "if(",
                NEXT,
                "){",
                GL,
                ".enable(",
                cap,
                ")}else{",
                GL,
                ".disable(",
                cap,
                ")}",
                CURRENT_STATE,
                ".",
                flag,
                "=",
                NEXT,
                ";"
              );
              refresh(block);
              poll(
                "if(",
                NEXT,
                "!==",
                CURRENT_STATE,
                ".",
                flag,
                "){",
                block,
                "}"
              );
            });
            Object.keys(GL_VARIABLES).forEach(function(name) {
              var func = GL_VARIABLES[name];
              var init = currentState[name];
              var NEXT, CURRENT;
              var block = env.block();
              block(GL, ".", func, "(");
              if (isArrayLike(init)) {
                var n = init.length;
                NEXT = env.global.def(NEXT_STATE, ".", name);
                CURRENT = env.global.def(CURRENT_STATE, ".", name);
                block(
                  loop(n, function(i2) {
                    return NEXT + "[" + i2 + "]";
                  }),
                  ");",
                  loop(n, function(i2) {
                    return CURRENT + "[" + i2 + "]=" + NEXT + "[" + i2 + "];";
                  }).join("")
                );
                poll(
                  "if(",
                  loop(n, function(i2) {
                    return NEXT + "[" + i2 + "]!==" + CURRENT + "[" + i2 + "]";
                  }).join("||"),
                  "){",
                  block,
                  "}"
                );
              } else {
                NEXT = common.def(NEXT_STATE, ".", name);
                CURRENT = common.def(CURRENT_STATE, ".", name);
                block(
                  NEXT,
                  ");",
                  CURRENT_STATE,
                  ".",
                  name,
                  "=",
                  NEXT,
                  ";"
                );
                poll(
                  "if(",
                  NEXT,
                  "!==",
                  CURRENT,
                  "){",
                  block,
                  "}"
                );
              }
              refresh(block);
            });
            return env.compile();
          }(),
          compile: compileCommand
        };
      }
      function stats() {
        return {
          vaoCount: 0,
          bufferCount: 0,
          elementsCount: 0,
          framebufferCount: 0,
          shaderCount: 0,
          textureCount: 0,
          cubeCount: 0,
          renderbufferCount: 0,
          maxTextureUnits: 0
        };
      }
      var GL_QUERY_RESULT_EXT = 34918;
      var GL_QUERY_RESULT_AVAILABLE_EXT = 34919;
      var GL_TIME_ELAPSED_EXT = 35007;
      var createTimer = function(gl, extensions) {
        if (!extensions.ext_disjoint_timer_query) {
          return null;
        }
        var queryPool = [];
        function allocQuery() {
          return queryPool.pop() || extensions.ext_disjoint_timer_query.createQueryEXT();
        }
        function freeQuery(query) {
          queryPool.push(query);
        }
        var pendingQueries = [];
        function beginQuery(stats2) {
          var query = allocQuery();
          extensions.ext_disjoint_timer_query.beginQueryEXT(GL_TIME_ELAPSED_EXT, query);
          pendingQueries.push(query);
          pushScopeStats(pendingQueries.length - 1, pendingQueries.length, stats2);
        }
        function endQuery() {
          extensions.ext_disjoint_timer_query.endQueryEXT(GL_TIME_ELAPSED_EXT);
        }
        function PendingStats() {
          this.startQueryIndex = -1;
          this.endQueryIndex = -1;
          this.sum = 0;
          this.stats = null;
        }
        var pendingStatsPool = [];
        function allocPendingStats() {
          return pendingStatsPool.pop() || new PendingStats();
        }
        function freePendingStats(pendingStats2) {
          pendingStatsPool.push(pendingStats2);
        }
        var pendingStats = [];
        function pushScopeStats(start, end, stats2) {
          var ps = allocPendingStats();
          ps.startQueryIndex = start;
          ps.endQueryIndex = end;
          ps.sum = 0;
          ps.stats = stats2;
          pendingStats.push(ps);
        }
        var timeSum = [];
        var queryPtr = [];
        function update() {
          var ptr, i;
          var n = pendingQueries.length;
          if (n === 0) {
            return;
          }
          queryPtr.length = Math.max(queryPtr.length, n + 1);
          timeSum.length = Math.max(timeSum.length, n + 1);
          timeSum[0] = 0;
          queryPtr[0] = 0;
          var queryTime = 0;
          ptr = 0;
          for (i = 0; i < pendingQueries.length; ++i) {
            var query = pendingQueries[i];
            if (extensions.ext_disjoint_timer_query.getQueryObjectEXT(query, GL_QUERY_RESULT_AVAILABLE_EXT)) {
              queryTime += extensions.ext_disjoint_timer_query.getQueryObjectEXT(query, GL_QUERY_RESULT_EXT);
              freeQuery(query);
            } else {
              pendingQueries[ptr++] = query;
            }
            timeSum[i + 1] = queryTime;
            queryPtr[i + 1] = ptr;
          }
          pendingQueries.length = ptr;
          ptr = 0;
          for (i = 0; i < pendingStats.length; ++i) {
            var stats2 = pendingStats[i];
            var start = stats2.startQueryIndex;
            var end = stats2.endQueryIndex;
            stats2.sum += timeSum[end] - timeSum[start];
            var startPtr = queryPtr[start];
            var endPtr = queryPtr[end];
            if (endPtr === startPtr) {
              stats2.stats.gpuTime += stats2.sum / 1e6;
              freePendingStats(stats2);
            } else {
              stats2.startQueryIndex = startPtr;
              stats2.endQueryIndex = endPtr;
              pendingStats[ptr++] = stats2;
            }
          }
          pendingStats.length = ptr;
        }
        return {
          beginQuery,
          endQuery,
          pushScopeStats,
          update,
          getNumPendingQueries: function() {
            return pendingQueries.length;
          },
          clear: function() {
            queryPool.push.apply(queryPool, pendingQueries);
            for (var i = 0; i < queryPool.length; i++) {
              extensions.ext_disjoint_timer_query.deleteQueryEXT(queryPool[i]);
            }
            pendingQueries.length = 0;
            queryPool.length = 0;
          },
          restore: function() {
            pendingQueries.length = 0;
            queryPool.length = 0;
          }
        };
      };
      var GL_COLOR_BUFFER_BIT = 16384;
      var GL_DEPTH_BUFFER_BIT = 256;
      var GL_STENCIL_BUFFER_BIT = 1024;
      var GL_ARRAY_BUFFER = 34962;
      var CONTEXT_LOST_EVENT = "webglcontextlost";
      var CONTEXT_RESTORED_EVENT = "webglcontextrestored";
      var DYN_PROP = 1;
      var DYN_CONTEXT = 2;
      var DYN_STATE = 3;
      function find(haystack, needle) {
        for (var i = 0; i < haystack.length; ++i) {
          if (haystack[i] === needle) {
            return i;
          }
        }
        return -1;
      }
      function wrapREGL(args) {
        var config = parseArgs(args);
        if (!config) {
          return null;
        }
        var gl = config.gl;
        var glAttributes = gl.getContextAttributes();
        var contextLost = gl.isContextLost();
        var extensionState = createExtensionCache(gl, config);
        if (!extensionState) {
          return null;
        }
        var stringStore = createStringStore();
        var stats$$1 = stats();
        var extensions = extensionState.extensions;
        var timer = createTimer(gl, extensions);
        var START_TIME = clock();
        var WIDTH = gl.drawingBufferWidth;
        var HEIGHT = gl.drawingBufferHeight;
        var contextState = {
          tick: 0,
          time: 0,
          viewportWidth: WIDTH,
          viewportHeight: HEIGHT,
          framebufferWidth: WIDTH,
          framebufferHeight: HEIGHT,
          drawingBufferWidth: WIDTH,
          drawingBufferHeight: HEIGHT,
          pixelRatio: config.pixelRatio
        };
        var uniformState = {};
        var drawState = {
          elements: null,
          primitive: 4,
          // GL_TRIANGLES
          count: -1,
          offset: 0,
          instances: -1
        };
        var limits = wrapLimits(gl, extensions);
        var bufferState = wrapBufferState(
          gl,
          stats$$1,
          config,
          destroyBuffer
        );
        var elementState = wrapElementsState(gl, extensions, bufferState, stats$$1);
        var attributeState = wrapAttributeState(
          gl,
          extensions,
          limits,
          stats$$1,
          bufferState,
          elementState,
          drawState
        );
        function destroyBuffer(buffer) {
          return attributeState.destroyBuffer(buffer);
        }
        var shaderState = wrapShaderState(gl, stringStore, stats$$1, config);
        var textureState = createTextureSet(
          gl,
          extensions,
          limits,
          function() {
            core.procs.poll();
          },
          contextState,
          stats$$1,
          config
        );
        var renderbufferState = wrapRenderbuffers(gl, extensions, limits, stats$$1, config);
        var framebufferState = wrapFBOState(
          gl,
          extensions,
          limits,
          textureState,
          renderbufferState,
          stats$$1
        );
        var core = reglCore(
          gl,
          stringStore,
          extensions,
          limits,
          bufferState,
          elementState,
          textureState,
          framebufferState,
          uniformState,
          attributeState,
          shaderState,
          drawState,
          contextState,
          timer,
          config
        );
        var readPixels = wrapReadPixels(
          gl,
          framebufferState,
          core.procs.poll,
          contextState,
          glAttributes,
          extensions,
          limits
        );
        var nextState = core.next;
        var canvas = gl.canvas;
        var rafCallbacks = [];
        var lossCallbacks = [];
        var restoreCallbacks = [];
        var destroyCallbacks = [config.onDestroy];
        var activeRAF = null;
        function handleRAF() {
          if (rafCallbacks.length === 0) {
            if (timer) {
              timer.update();
            }
            activeRAF = null;
            return;
          }
          activeRAF = raf.next(handleRAF);
          poll();
          for (var i = rafCallbacks.length - 1; i >= 0; --i) {
            var cb = rafCallbacks[i];
            if (cb) {
              cb(contextState, null, 0);
            }
          }
          gl.flush();
          if (timer) {
            timer.update();
          }
        }
        function startRAF() {
          if (!activeRAF && rafCallbacks.length > 0) {
            activeRAF = raf.next(handleRAF);
          }
        }
        function stopRAF() {
          if (activeRAF) {
            raf.cancel(handleRAF);
            activeRAF = null;
          }
        }
        function handleContextLoss(event) {
          event.preventDefault();
          contextLost = true;
          stopRAF();
          lossCallbacks.forEach(function(cb) {
            cb();
          });
        }
        function handleContextRestored(event) {
          gl.getError();
          contextLost = false;
          extensionState.restore();
          shaderState.restore();
          bufferState.restore();
          textureState.restore();
          renderbufferState.restore();
          framebufferState.restore();
          attributeState.restore();
          if (timer) {
            timer.restore();
          }
          core.procs.refresh();
          startRAF();
          restoreCallbacks.forEach(function(cb) {
            cb();
          });
        }
        if (canvas) {
          canvas.addEventListener(CONTEXT_LOST_EVENT, handleContextLoss, false);
          canvas.addEventListener(CONTEXT_RESTORED_EVENT, handleContextRestored, false);
        }
        function destroy() {
          rafCallbacks.length = 0;
          stopRAF();
          if (canvas) {
            canvas.removeEventListener(CONTEXT_LOST_EVENT, handleContextLoss);
            canvas.removeEventListener(CONTEXT_RESTORED_EVENT, handleContextRestored);
          }
          shaderState.clear();
          framebufferState.clear();
          renderbufferState.clear();
          attributeState.clear();
          textureState.clear();
          elementState.clear();
          bufferState.clear();
          if (timer) {
            timer.clear();
          }
          destroyCallbacks.forEach(function(cb) {
            cb();
          });
        }
        function compileProcedure(options) {
          check$1(!!options, "invalid args to regl({...})");
          check$1.type(options, "object", "invalid args to regl({...})");
          function flattenNestedOptions(options2) {
            var result = extend({}, options2);
            delete result.uniforms;
            delete result.attributes;
            delete result.context;
            delete result.vao;
            if ("stencil" in result && result.stencil.op) {
              result.stencil.opBack = result.stencil.opFront = result.stencil.op;
              delete result.stencil.op;
            }
            function merge(name) {
              if (name in result) {
                var child = result[name];
                delete result[name];
                Object.keys(child).forEach(function(prop) {
                  result[name + "." + prop] = child[prop];
                });
              }
            }
            merge("blend");
            merge("depth");
            merge("cull");
            merge("stencil");
            merge("polygonOffset");
            merge("scissor");
            merge("sample");
            if ("vao" in options2) {
              result.vao = options2.vao;
            }
            return result;
          }
          function separateDynamic(object, useArrays) {
            var staticItems = {};
            var dynamicItems = {};
            Object.keys(object).forEach(function(option) {
              var value = object[option];
              if (dynamic.isDynamic(value)) {
                dynamicItems[option] = dynamic.unbox(value, option);
                return;
              } else if (useArrays && Array.isArray(value)) {
                for (var i = 0; i < value.length; ++i) {
                  if (dynamic.isDynamic(value[i])) {
                    dynamicItems[option] = dynamic.unbox(value, option);
                    return;
                  }
                }
              }
              staticItems[option] = value;
            });
            return {
              dynamic: dynamicItems,
              static: staticItems
            };
          }
          var context = separateDynamic(options.context || {}, true);
          var uniforms = separateDynamic(options.uniforms || {}, true);
          var attributes = separateDynamic(options.attributes || {}, false);
          var opts = separateDynamic(flattenNestedOptions(options), false);
          var stats$$12 = {
            gpuTime: 0,
            cpuTime: 0,
            count: 0
          };
          var compiled = core.compile(opts, attributes, uniforms, context, stats$$12);
          var draw = compiled.draw;
          var batch = compiled.batch;
          var scope = compiled.scope;
          var EMPTY_ARRAY = [];
          function reserve(count) {
            while (EMPTY_ARRAY.length < count) {
              EMPTY_ARRAY.push(null);
            }
            return EMPTY_ARRAY;
          }
          function REGLCommand(args2, body) {
            var i;
            if (contextLost) {
              check$1.raise("context lost");
            }
            if (typeof args2 === "function") {
              return scope.call(this, null, args2, 0);
            } else if (typeof body === "function") {
              if (typeof args2 === "number") {
                for (i = 0; i < args2; ++i) {
                  scope.call(this, null, body, i);
                }
              } else if (Array.isArray(args2)) {
                for (i = 0; i < args2.length; ++i) {
                  scope.call(this, args2[i], body, i);
                }
              } else {
                return scope.call(this, args2, body, 0);
              }
            } else if (typeof args2 === "number") {
              if (args2 > 0) {
                return batch.call(this, reserve(args2 | 0), args2 | 0);
              }
            } else if (Array.isArray(args2)) {
              if (args2.length) {
                return batch.call(this, args2, args2.length);
              }
            } else {
              return draw.call(this, args2);
            }
          }
          return extend(REGLCommand, {
            stats: stats$$12,
            destroy: function() {
              compiled.destroy();
            }
          });
        }
        var setFBO = framebufferState.setFBO = compileProcedure({
          framebuffer: dynamic.define.call(null, DYN_PROP, "framebuffer")
        });
        function clearImpl(_, options) {
          var clearFlags = 0;
          core.procs.poll();
          var c = options.color;
          if (c) {
            gl.clearColor(+c[0] || 0, +c[1] || 0, +c[2] || 0, +c[3] || 0);
            clearFlags |= GL_COLOR_BUFFER_BIT;
          }
          if ("depth" in options) {
            gl.clearDepth(+options.depth);
            clearFlags |= GL_DEPTH_BUFFER_BIT;
          }
          if ("stencil" in options) {
            gl.clearStencil(options.stencil | 0);
            clearFlags |= GL_STENCIL_BUFFER_BIT;
          }
          check$1(!!clearFlags, "called regl.clear with no buffer specified");
          gl.clear(clearFlags);
        }
        function clear(options) {
          check$1(
            typeof options === "object" && options,
            "regl.clear() takes an object as input"
          );
          if ("framebuffer" in options) {
            if (options.framebuffer && options.framebuffer_reglType === "framebufferCube") {
              for (var i = 0; i < 6; ++i) {
                setFBO(extend({
                  framebuffer: options.framebuffer.faces[i]
                }, options), clearImpl);
              }
            } else {
              setFBO(options, clearImpl);
            }
          } else {
            clearImpl(null, options);
          }
        }
        function frame(cb) {
          check$1.type(cb, "function", "regl.frame() callback must be a function");
          rafCallbacks.push(cb);
          function cancel() {
            var i = find(rafCallbacks, cb);
            check$1(i >= 0, "cannot cancel a frame twice");
            function pendingCancel() {
              var index = find(rafCallbacks, pendingCancel);
              rafCallbacks[index] = rafCallbacks[rafCallbacks.length - 1];
              rafCallbacks.length -= 1;
              if (rafCallbacks.length <= 0) {
                stopRAF();
              }
            }
            rafCallbacks[i] = pendingCancel;
          }
          startRAF();
          return {
            cancel
          };
        }
        function pollViewport() {
          var viewport = nextState.viewport;
          var scissorBox = nextState.scissor_box;
          viewport[0] = viewport[1] = scissorBox[0] = scissorBox[1] = 0;
          contextState.viewportWidth = contextState.framebufferWidth = contextState.drawingBufferWidth = viewport[2] = scissorBox[2] = gl.drawingBufferWidth;
          contextState.viewportHeight = contextState.framebufferHeight = contextState.drawingBufferHeight = viewport[3] = scissorBox[3] = gl.drawingBufferHeight;
        }
        function poll() {
          contextState.tick += 1;
          contextState.time = now();
          pollViewport();
          core.procs.poll();
        }
        function refresh() {
          textureState.refresh();
          pollViewport();
          core.procs.refresh();
          if (timer) {
            timer.update();
          }
        }
        function now() {
          return (clock() - START_TIME) / 1e3;
        }
        refresh();
        function addListener(event, callback) {
          check$1.type(callback, "function", "listener callback must be a function");
          var callbacks;
          switch (event) {
            case "frame":
              return frame(callback);
            case "lost":
              callbacks = lossCallbacks;
              break;
            case "restore":
              callbacks = restoreCallbacks;
              break;
            case "destroy":
              callbacks = destroyCallbacks;
              break;
            default:
              check$1.raise("invalid event, must be one of frame,lost,restore,destroy");
          }
          callbacks.push(callback);
          return {
            cancel: function() {
              for (var i = 0; i < callbacks.length; ++i) {
                if (callbacks[i] === callback) {
                  callbacks[i] = callbacks[callbacks.length - 1];
                  callbacks.pop();
                  return;
                }
              }
            }
          };
        }
        var regl = extend(compileProcedure, {
          // Clear current FBO
          clear,
          // Short cuts for dynamic variables
          prop: dynamic.define.bind(null, DYN_PROP),
          context: dynamic.define.bind(null, DYN_CONTEXT),
          this: dynamic.define.bind(null, DYN_STATE),
          // executes an empty draw command
          draw: compileProcedure({}),
          // Resources
          buffer: function(options) {
            return bufferState.create(options, GL_ARRAY_BUFFER, false, false);
          },
          elements: function(options) {
            return elementState.create(options, false);
          },
          texture: textureState.create2D,
          cube: textureState.createCube,
          renderbuffer: renderbufferState.create,
          framebuffer: framebufferState.create,
          framebufferCube: framebufferState.createCube,
          vao: attributeState.createVAO,
          // Expose context attributes
          attributes: glAttributes,
          // Frame rendering
          frame,
          on: addListener,
          // System limits
          limits,
          hasExtension: function(name) {
            return limits.extensions.indexOf(name.toLowerCase()) >= 0;
          },
          // Read pixels
          read: readPixels,
          // Destroy regl and all associated resources
          destroy,
          // Direct GL state manipulation
          _gl: gl,
          _refresh: refresh,
          poll: function() {
            poll();
            if (timer) {
              timer.update();
            }
          },
          // Current time
          now,
          // regl Statistics Information
          stats: stats$$1
        });
        config.onDone(null, regl);
        return regl;
      }
      return wrapREGL;
    });
  }
});
export default require_regl();
//# sourceMappingURL=regl.js.map
