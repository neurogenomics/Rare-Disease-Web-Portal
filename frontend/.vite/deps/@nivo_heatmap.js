import {
  AnimatedObject,
  FluidValue,
  addFluidObserver,
  callFluidObservers,
  colors2,
  config,
  createHost,
  createStringInterpolator2,
  each,
  eachProp,
  getFluidValue,
  globals_exports,
  hasFluidValue,
  is,
  removeFluidObserver,
  to,
  toArray,
  useSpring,
  useTransition
} from "./chunk-AWVDU5FC.js";
import {
  band,
  diverging,
  friday,
  hour_default,
  linear,
  millisecond_default,
  minute_default,
  monday,
  month_default,
  newInterval,
  ordinal,
  quantize,
  saturday,
  second_default,
  sequential,
  sunday,
  thursday,
  timeFormat,
  tuesday,
  utcFriday,
  utcHour_default,
  utcMinute_default,
  utcMonday,
  utcMonth_default,
  utcSaturday,
  utcSunday,
  utcThursday,
  utcTuesday,
  utcWednesday,
  utcYear_default,
  wednesday,
  year_default
} from "./chunk-YLFEHIBA.js";
import {
  require_prop_types
} from "./chunk-FWNK54VO.js";
import {
  require_jsx_runtime
} from "./chunk-32NEGIXE.js";
import {
  Accent_default,
  Blues_default,
  BrBG_default,
  BuGn_default,
  BuPu_default,
  Dark2_default,
  GnBu_default,
  Greens_default,
  Greys_default,
  OrRd_default,
  Oranges_default,
  PRGn_default,
  Paired_default,
  Pastel1_default,
  Pastel2_default,
  PiYG_default,
  PuBuGn_default,
  PuBu_default,
  PuOr_default,
  PuRd_default,
  Purples_default,
  RdBu_default,
  RdGy_default,
  RdPu_default,
  RdYlBu_default,
  RdYlGn_default,
  Reds_default,
  Set1_default,
  Set2_default,
  Set3_default,
  Spectral_default,
  Tableau10_default,
  YlGnBu_default,
  YlGn_default,
  YlOrBr_default,
  YlOrRd_default,
  ascending_default,
  basisClosed_default,
  basisOpen_default,
  basis_default,
  bundle_default,
  cardinalClosed_default,
  cardinalOpen_default,
  cardinal_default,
  category10_default,
  catmullRomClosed_default,
  catmullRomOpen_default,
  catmullRom_default,
  cividis_default,
  cool,
  cubehelix_default2 as cubehelix_default,
  descending_default,
  diverging_default,
  expand_default,
  inferno,
  insideOut_default,
  linearClosed_default,
  linear_default,
  magma,
  monotoneX,
  monotoneY,
  natural_default,
  none_default,
  none_default2,
  plasma,
  rainbow_default,
  reverse_default,
  rgb,
  scheme,
  scheme10,
  scheme11,
  scheme12,
  scheme13,
  scheme14,
  scheme15,
  scheme16,
  scheme17,
  scheme18,
  scheme19,
  scheme2,
  scheme20,
  scheme21,
  scheme22,
  scheme23,
  scheme24,
  scheme25,
  scheme26,
  scheme27,
  scheme3,
  scheme4,
  scheme5,
  scheme6,
  scheme7,
  scheme8,
  scheme9,
  silhouette_default,
  sinebow_default,
  stepAfter,
  stepBefore,
  step_default,
  string_default,
  turbo_default,
  viridis_default,
  warm,
  wiggle_default
} from "./chunk-C2D463UA.js";
import {
  require_react_dom
} from "./chunk-YNDS2U4Y.js";
import {
  require_react
} from "./chunk-65KY755N.js";
import {
  __commonJS,
  __toESM
} from "./chunk-V4OQ3NZ2.js";

// node_modules/lodash/_listCacheClear.js
var require_listCacheClear = __commonJS({
  "node_modules/lodash/_listCacheClear.js"(exports, module) {
    function listCacheClear() {
      this.__data__ = [];
      this.size = 0;
    }
    module.exports = listCacheClear;
  }
});

// node_modules/lodash/eq.js
var require_eq = __commonJS({
  "node_modules/lodash/eq.js"(exports, module) {
    function eq(value, other) {
      return value === other || value !== value && other !== other;
    }
    module.exports = eq;
  }
});

// node_modules/lodash/_assocIndexOf.js
var require_assocIndexOf = __commonJS({
  "node_modules/lodash/_assocIndexOf.js"(exports, module) {
    var eq = require_eq();
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }
    module.exports = assocIndexOf;
  }
});

// node_modules/lodash/_listCacheDelete.js
var require_listCacheDelete = __commonJS({
  "node_modules/lodash/_listCacheDelete.js"(exports, module) {
    var assocIndexOf = require_assocIndexOf();
    var arrayProto = Array.prototype;
    var splice = arrayProto.splice;
    function listCacheDelete(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      --this.size;
      return true;
    }
    module.exports = listCacheDelete;
  }
});

// node_modules/lodash/_listCacheGet.js
var require_listCacheGet = __commonJS({
  "node_modules/lodash/_listCacheGet.js"(exports, module) {
    var assocIndexOf = require_assocIndexOf();
    function listCacheGet(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      return index < 0 ? void 0 : data[index][1];
    }
    module.exports = listCacheGet;
  }
});

// node_modules/lodash/_listCacheHas.js
var require_listCacheHas = __commonJS({
  "node_modules/lodash/_listCacheHas.js"(exports, module) {
    var assocIndexOf = require_assocIndexOf();
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }
    module.exports = listCacheHas;
  }
});

// node_modules/lodash/_listCacheSet.js
var require_listCacheSet = __commonJS({
  "node_modules/lodash/_listCacheSet.js"(exports, module) {
    var assocIndexOf = require_assocIndexOf();
    function listCacheSet(key, value) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }
    module.exports = listCacheSet;
  }
});

// node_modules/lodash/_ListCache.js
var require_ListCache = __commonJS({
  "node_modules/lodash/_ListCache.js"(exports, module) {
    var listCacheClear = require_listCacheClear();
    var listCacheDelete = require_listCacheDelete();
    var listCacheGet = require_listCacheGet();
    var listCacheHas = require_listCacheHas();
    var listCacheSet = require_listCacheSet();
    function ListCache(entries) {
      var index = -1, length = entries == null ? 0 : entries.length;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype["delete"] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;
    module.exports = ListCache;
  }
});

// node_modules/lodash/_stackClear.js
var require_stackClear = __commonJS({
  "node_modules/lodash/_stackClear.js"(exports, module) {
    var ListCache = require_ListCache();
    function stackClear() {
      this.__data__ = new ListCache();
      this.size = 0;
    }
    module.exports = stackClear;
  }
});

// node_modules/lodash/_stackDelete.js
var require_stackDelete = __commonJS({
  "node_modules/lodash/_stackDelete.js"(exports, module) {
    function stackDelete(key) {
      var data = this.__data__, result = data["delete"](key);
      this.size = data.size;
      return result;
    }
    module.exports = stackDelete;
  }
});

// node_modules/lodash/_stackGet.js
var require_stackGet = __commonJS({
  "node_modules/lodash/_stackGet.js"(exports, module) {
    function stackGet(key) {
      return this.__data__.get(key);
    }
    module.exports = stackGet;
  }
});

// node_modules/lodash/_stackHas.js
var require_stackHas = __commonJS({
  "node_modules/lodash/_stackHas.js"(exports, module) {
    function stackHas(key) {
      return this.__data__.has(key);
    }
    module.exports = stackHas;
  }
});

// node_modules/lodash/_freeGlobal.js
var require_freeGlobal = __commonJS({
  "node_modules/lodash/_freeGlobal.js"(exports, module) {
    var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
    module.exports = freeGlobal;
  }
});

// node_modules/lodash/_root.js
var require_root = __commonJS({
  "node_modules/lodash/_root.js"(exports, module) {
    var freeGlobal = require_freeGlobal();
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function("return this")();
    module.exports = root;
  }
});

// node_modules/lodash/_Symbol.js
var require_Symbol = __commonJS({
  "node_modules/lodash/_Symbol.js"(exports, module) {
    var root = require_root();
    var Symbol2 = root.Symbol;
    module.exports = Symbol2;
  }
});

// node_modules/lodash/_getRawTag.js
var require_getRawTag = __commonJS({
  "node_modules/lodash/_getRawTag.js"(exports, module) {
    var Symbol2 = require_Symbol();
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var nativeObjectToString = objectProto.toString;
    var symToStringTag = Symbol2 ? Symbol2.toStringTag : void 0;
    function getRawTag(value) {
      var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
      try {
        value[symToStringTag] = void 0;
        var unmasked = true;
      } catch (e8) {
      }
      var result = nativeObjectToString.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag] = tag;
        } else {
          delete value[symToStringTag];
        }
      }
      return result;
    }
    module.exports = getRawTag;
  }
});

// node_modules/lodash/_objectToString.js
var require_objectToString = __commonJS({
  "node_modules/lodash/_objectToString.js"(exports, module) {
    var objectProto = Object.prototype;
    var nativeObjectToString = objectProto.toString;
    function objectToString(value) {
      return nativeObjectToString.call(value);
    }
    module.exports = objectToString;
  }
});

// node_modules/lodash/_baseGetTag.js
var require_baseGetTag = __commonJS({
  "node_modules/lodash/_baseGetTag.js"(exports, module) {
    var Symbol2 = require_Symbol();
    var getRawTag = require_getRawTag();
    var objectToString = require_objectToString();
    var nullTag = "[object Null]";
    var undefinedTag = "[object Undefined]";
    var symToStringTag = Symbol2 ? Symbol2.toStringTag : void 0;
    function baseGetTag(value) {
      if (value == null) {
        return value === void 0 ? undefinedTag : nullTag;
      }
      return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
    }
    module.exports = baseGetTag;
  }
});

// node_modules/lodash/isObject.js
var require_isObject = __commonJS({
  "node_modules/lodash/isObject.js"(exports, module) {
    function isObject(value) {
      var type = typeof value;
      return value != null && (type == "object" || type == "function");
    }
    module.exports = isObject;
  }
});

// node_modules/lodash/isFunction.js
var require_isFunction = __commonJS({
  "node_modules/lodash/isFunction.js"(exports, module) {
    var baseGetTag = require_baseGetTag();
    var isObject = require_isObject();
    var asyncTag = "[object AsyncFunction]";
    var funcTag = "[object Function]";
    var genTag = "[object GeneratorFunction]";
    var proxyTag = "[object Proxy]";
    function isFunction(value) {
      if (!isObject(value)) {
        return false;
      }
      var tag = baseGetTag(value);
      return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    }
    module.exports = isFunction;
  }
});

// node_modules/lodash/_coreJsData.js
var require_coreJsData = __commonJS({
  "node_modules/lodash/_coreJsData.js"(exports, module) {
    var root = require_root();
    var coreJsData = root["__core-js_shared__"];
    module.exports = coreJsData;
  }
});

// node_modules/lodash/_isMasked.js
var require_isMasked = __commonJS({
  "node_modules/lodash/_isMasked.js"(exports, module) {
    var coreJsData = require_coreJsData();
    var maskSrcKey = function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
      return uid ? "Symbol(src)_1." + uid : "";
    }();
    function isMasked(func) {
      return !!maskSrcKey && maskSrcKey in func;
    }
    module.exports = isMasked;
  }
});

// node_modules/lodash/_toSource.js
var require_toSource = __commonJS({
  "node_modules/lodash/_toSource.js"(exports, module) {
    var funcProto = Function.prototype;
    var funcToString = funcProto.toString;
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e8) {
        }
        try {
          return func + "";
        } catch (e8) {
        }
      }
      return "";
    }
    module.exports = toSource;
  }
});

// node_modules/lodash/_baseIsNative.js
var require_baseIsNative = __commonJS({
  "node_modules/lodash/_baseIsNative.js"(exports, module) {
    var isFunction = require_isFunction();
    var isMasked = require_isMasked();
    var isObject = require_isObject();
    var toSource = require_toSource();
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    var funcProto = Function.prototype;
    var objectProto = Object.prototype;
    var funcToString = funcProto.toString;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var reIsNative = RegExp(
      "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    );
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }
    module.exports = baseIsNative;
  }
});

// node_modules/lodash/_getValue.js
var require_getValue = __commonJS({
  "node_modules/lodash/_getValue.js"(exports, module) {
    function getValue(object, key) {
      return object == null ? void 0 : object[key];
    }
    module.exports = getValue;
  }
});

// node_modules/lodash/_getNative.js
var require_getNative = __commonJS({
  "node_modules/lodash/_getNative.js"(exports, module) {
    var baseIsNative = require_baseIsNative();
    var getValue = require_getValue();
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : void 0;
    }
    module.exports = getNative;
  }
});

// node_modules/lodash/_Map.js
var require_Map = __commonJS({
  "node_modules/lodash/_Map.js"(exports, module) {
    var getNative = require_getNative();
    var root = require_root();
    var Map = getNative(root, "Map");
    module.exports = Map;
  }
});

// node_modules/lodash/_nativeCreate.js
var require_nativeCreate = __commonJS({
  "node_modules/lodash/_nativeCreate.js"(exports, module) {
    var getNative = require_getNative();
    var nativeCreate = getNative(Object, "create");
    module.exports = nativeCreate;
  }
});

// node_modules/lodash/_hashClear.js
var require_hashClear = __commonJS({
  "node_modules/lodash/_hashClear.js"(exports, module) {
    var nativeCreate = require_nativeCreate();
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
      this.size = 0;
    }
    module.exports = hashClear;
  }
});

// node_modules/lodash/_hashDelete.js
var require_hashDelete = __commonJS({
  "node_modules/lodash/_hashDelete.js"(exports, module) {
    function hashDelete(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }
    module.exports = hashDelete;
  }
});

// node_modules/lodash/_hashGet.js
var require_hashGet = __commonJS({
  "node_modules/lodash/_hashGet.js"(exports, module) {
    var nativeCreate = require_nativeCreate();
    var HASH_UNDEFINED = "__lodash_hash_undefined__";
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? void 0 : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : void 0;
    }
    module.exports = hashGet;
  }
});

// node_modules/lodash/_hashHas.js
var require_hashHas = __commonJS({
  "node_modules/lodash/_hashHas.js"(exports, module) {
    var nativeCreate = require_nativeCreate();
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
    }
    module.exports = hashHas;
  }
});

// node_modules/lodash/_hashSet.js
var require_hashSet = __commonJS({
  "node_modules/lodash/_hashSet.js"(exports, module) {
    var nativeCreate = require_nativeCreate();
    var HASH_UNDEFINED = "__lodash_hash_undefined__";
    function hashSet(key, value) {
      var data = this.__data__;
      this.size += this.has(key) ? 0 : 1;
      data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
      return this;
    }
    module.exports = hashSet;
  }
});

// node_modules/lodash/_Hash.js
var require_Hash = __commonJS({
  "node_modules/lodash/_Hash.js"(exports, module) {
    var hashClear = require_hashClear();
    var hashDelete = require_hashDelete();
    var hashGet = require_hashGet();
    var hashHas = require_hashHas();
    var hashSet = require_hashSet();
    function Hash(entries) {
      var index = -1, length = entries == null ? 0 : entries.length;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    Hash.prototype.clear = hashClear;
    Hash.prototype["delete"] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;
    module.exports = Hash;
  }
});

// node_modules/lodash/_mapCacheClear.js
var require_mapCacheClear = __commonJS({
  "node_modules/lodash/_mapCacheClear.js"(exports, module) {
    var Hash = require_Hash();
    var ListCache = require_ListCache();
    var Map = require_Map();
    function mapCacheClear() {
      this.size = 0;
      this.__data__ = {
        "hash": new Hash(),
        "map": new (Map || ListCache)(),
        "string": new Hash()
      };
    }
    module.exports = mapCacheClear;
  }
});

// node_modules/lodash/_isKeyable.js
var require_isKeyable = __commonJS({
  "node_modules/lodash/_isKeyable.js"(exports, module) {
    function isKeyable(value) {
      var type = typeof value;
      return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
    }
    module.exports = isKeyable;
  }
});

// node_modules/lodash/_getMapData.js
var require_getMapData = __commonJS({
  "node_modules/lodash/_getMapData.js"(exports, module) {
    var isKeyable = require_isKeyable();
    function getMapData(map2, key) {
      var data = map2.__data__;
      return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
    }
    module.exports = getMapData;
  }
});

// node_modules/lodash/_mapCacheDelete.js
var require_mapCacheDelete = __commonJS({
  "node_modules/lodash/_mapCacheDelete.js"(exports, module) {
    var getMapData = require_getMapData();
    function mapCacheDelete(key) {
      var result = getMapData(this, key)["delete"](key);
      this.size -= result ? 1 : 0;
      return result;
    }
    module.exports = mapCacheDelete;
  }
});

// node_modules/lodash/_mapCacheGet.js
var require_mapCacheGet = __commonJS({
  "node_modules/lodash/_mapCacheGet.js"(exports, module) {
    var getMapData = require_getMapData();
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }
    module.exports = mapCacheGet;
  }
});

// node_modules/lodash/_mapCacheHas.js
var require_mapCacheHas = __commonJS({
  "node_modules/lodash/_mapCacheHas.js"(exports, module) {
    var getMapData = require_getMapData();
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }
    module.exports = mapCacheHas;
  }
});

// node_modules/lodash/_mapCacheSet.js
var require_mapCacheSet = __commonJS({
  "node_modules/lodash/_mapCacheSet.js"(exports, module) {
    var getMapData = require_getMapData();
    function mapCacheSet(key, value) {
      var data = getMapData(this, key), size = data.size;
      data.set(key, value);
      this.size += data.size == size ? 0 : 1;
      return this;
    }
    module.exports = mapCacheSet;
  }
});

// node_modules/lodash/_MapCache.js
var require_MapCache = __commonJS({
  "node_modules/lodash/_MapCache.js"(exports, module) {
    var mapCacheClear = require_mapCacheClear();
    var mapCacheDelete = require_mapCacheDelete();
    var mapCacheGet = require_mapCacheGet();
    var mapCacheHas = require_mapCacheHas();
    var mapCacheSet = require_mapCacheSet();
    function MapCache(entries) {
      var index = -1, length = entries == null ? 0 : entries.length;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype["delete"] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;
    module.exports = MapCache;
  }
});

// node_modules/lodash/_stackSet.js
var require_stackSet = __commonJS({
  "node_modules/lodash/_stackSet.js"(exports, module) {
    var ListCache = require_ListCache();
    var Map = require_Map();
    var MapCache = require_MapCache();
    var LARGE_ARRAY_SIZE = 200;
    function stackSet(key, value) {
      var data = this.__data__;
      if (data instanceof ListCache) {
        var pairs = data.__data__;
        if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
          pairs.push([key, value]);
          this.size = ++data.size;
          return this;
        }
        data = this.__data__ = new MapCache(pairs);
      }
      data.set(key, value);
      this.size = data.size;
      return this;
    }
    module.exports = stackSet;
  }
});

// node_modules/lodash/_Stack.js
var require_Stack = __commonJS({
  "node_modules/lodash/_Stack.js"(exports, module) {
    var ListCache = require_ListCache();
    var stackClear = require_stackClear();
    var stackDelete = require_stackDelete();
    var stackGet = require_stackGet();
    var stackHas = require_stackHas();
    var stackSet = require_stackSet();
    function Stack(entries) {
      var data = this.__data__ = new ListCache(entries);
      this.size = data.size;
    }
    Stack.prototype.clear = stackClear;
    Stack.prototype["delete"] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;
    module.exports = Stack;
  }
});

// node_modules/lodash/_defineProperty.js
var require_defineProperty = __commonJS({
  "node_modules/lodash/_defineProperty.js"(exports, module) {
    var getNative = require_getNative();
    var defineProperty = function() {
      try {
        var func = getNative(Object, "defineProperty");
        func({}, "", {});
        return func;
      } catch (e8) {
      }
    }();
    module.exports = defineProperty;
  }
});

// node_modules/lodash/_baseAssignValue.js
var require_baseAssignValue = __commonJS({
  "node_modules/lodash/_baseAssignValue.js"(exports, module) {
    var defineProperty = require_defineProperty();
    function baseAssignValue(object, key, value) {
      if (key == "__proto__" && defineProperty) {
        defineProperty(object, key, {
          "configurable": true,
          "enumerable": true,
          "value": value,
          "writable": true
        });
      } else {
        object[key] = value;
      }
    }
    module.exports = baseAssignValue;
  }
});

// node_modules/lodash/_assignMergeValue.js
var require_assignMergeValue = __commonJS({
  "node_modules/lodash/_assignMergeValue.js"(exports, module) {
    var baseAssignValue = require_baseAssignValue();
    var eq = require_eq();
    function assignMergeValue(object, key, value) {
      if (value !== void 0 && !eq(object[key], value) || value === void 0 && !(key in object)) {
        baseAssignValue(object, key, value);
      }
    }
    module.exports = assignMergeValue;
  }
});

// node_modules/lodash/_createBaseFor.js
var require_createBaseFor = __commonJS({
  "node_modules/lodash/_createBaseFor.js"(exports, module) {
    function createBaseFor(fromRight) {
      return function(object, iteratee, keysFunc) {
        var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
        while (length--) {
          var key = props[fromRight ? length : ++index];
          if (iteratee(iterable[key], key, iterable) === false) {
            break;
          }
        }
        return object;
      };
    }
    module.exports = createBaseFor;
  }
});

// node_modules/lodash/_baseFor.js
var require_baseFor = __commonJS({
  "node_modules/lodash/_baseFor.js"(exports, module) {
    var createBaseFor = require_createBaseFor();
    var baseFor = createBaseFor();
    module.exports = baseFor;
  }
});

// node_modules/lodash/_cloneBuffer.js
var require_cloneBuffer = __commonJS({
  "node_modules/lodash/_cloneBuffer.js"(exports, module) {
    var root = require_root();
    var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
    var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var Buffer = moduleExports ? root.Buffer : void 0;
    var allocUnsafe = Buffer ? Buffer.allocUnsafe : void 0;
    function cloneBuffer(buffer, isDeep) {
      if (isDeep) {
        return buffer.slice();
      }
      var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
      buffer.copy(result);
      return result;
    }
    module.exports = cloneBuffer;
  }
});

// node_modules/lodash/_Uint8Array.js
var require_Uint8Array = __commonJS({
  "node_modules/lodash/_Uint8Array.js"(exports, module) {
    var root = require_root();
    var Uint8Array = root.Uint8Array;
    module.exports = Uint8Array;
  }
});

// node_modules/lodash/_cloneArrayBuffer.js
var require_cloneArrayBuffer = __commonJS({
  "node_modules/lodash/_cloneArrayBuffer.js"(exports, module) {
    var Uint8Array = require_Uint8Array();
    function cloneArrayBuffer(arrayBuffer) {
      var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
      new Uint8Array(result).set(new Uint8Array(arrayBuffer));
      return result;
    }
    module.exports = cloneArrayBuffer;
  }
});

// node_modules/lodash/_cloneTypedArray.js
var require_cloneTypedArray = __commonJS({
  "node_modules/lodash/_cloneTypedArray.js"(exports, module) {
    var cloneArrayBuffer = require_cloneArrayBuffer();
    function cloneTypedArray(typedArray, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
      return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
    }
    module.exports = cloneTypedArray;
  }
});

// node_modules/lodash/_copyArray.js
var require_copyArray = __commonJS({
  "node_modules/lodash/_copyArray.js"(exports, module) {
    function copyArray(source, array) {
      var index = -1, length = source.length;
      array || (array = Array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }
    module.exports = copyArray;
  }
});

// node_modules/lodash/_baseCreate.js
var require_baseCreate = __commonJS({
  "node_modules/lodash/_baseCreate.js"(exports, module) {
    var isObject = require_isObject();
    var objectCreate = Object.create;
    var baseCreate = /* @__PURE__ */ function() {
      function object() {
      }
      return function(proto) {
        if (!isObject(proto)) {
          return {};
        }
        if (objectCreate) {
          return objectCreate(proto);
        }
        object.prototype = proto;
        var result = new object();
        object.prototype = void 0;
        return result;
      };
    }();
    module.exports = baseCreate;
  }
});

// node_modules/lodash/_overArg.js
var require_overArg = __commonJS({
  "node_modules/lodash/_overArg.js"(exports, module) {
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }
    module.exports = overArg;
  }
});

// node_modules/lodash/_getPrototype.js
var require_getPrototype = __commonJS({
  "node_modules/lodash/_getPrototype.js"(exports, module) {
    var overArg = require_overArg();
    var getPrototype = overArg(Object.getPrototypeOf, Object);
    module.exports = getPrototype;
  }
});

// node_modules/lodash/_isPrototype.js
var require_isPrototype = __commonJS({
  "node_modules/lodash/_isPrototype.js"(exports, module) {
    var objectProto = Object.prototype;
    function isPrototype(value) {
      var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
      return value === proto;
    }
    module.exports = isPrototype;
  }
});

// node_modules/lodash/_initCloneObject.js
var require_initCloneObject = __commonJS({
  "node_modules/lodash/_initCloneObject.js"(exports, module) {
    var baseCreate = require_baseCreate();
    var getPrototype = require_getPrototype();
    var isPrototype = require_isPrototype();
    function initCloneObject(object) {
      return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
    }
    module.exports = initCloneObject;
  }
});

// node_modules/lodash/isObjectLike.js
var require_isObjectLike = __commonJS({
  "node_modules/lodash/isObjectLike.js"(exports, module) {
    function isObjectLike(value) {
      return value != null && typeof value == "object";
    }
    module.exports = isObjectLike;
  }
});

// node_modules/lodash/_baseIsArguments.js
var require_baseIsArguments = __commonJS({
  "node_modules/lodash/_baseIsArguments.js"(exports, module) {
    var baseGetTag = require_baseGetTag();
    var isObjectLike = require_isObjectLike();
    var argsTag = "[object Arguments]";
    function baseIsArguments(value) {
      return isObjectLike(value) && baseGetTag(value) == argsTag;
    }
    module.exports = baseIsArguments;
  }
});

// node_modules/lodash/isArguments.js
var require_isArguments = __commonJS({
  "node_modules/lodash/isArguments.js"(exports, module) {
    var baseIsArguments = require_baseIsArguments();
    var isObjectLike = require_isObjectLike();
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var propertyIsEnumerable = objectProto.propertyIsEnumerable;
    var isArguments = baseIsArguments(/* @__PURE__ */ function() {
      return arguments;
    }()) ? baseIsArguments : function(value) {
      return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
    };
    module.exports = isArguments;
  }
});

// node_modules/lodash/isArray.js
var require_isArray = __commonJS({
  "node_modules/lodash/isArray.js"(exports, module) {
    var isArray = Array.isArray;
    module.exports = isArray;
  }
});

// node_modules/lodash/isLength.js
var require_isLength = __commonJS({
  "node_modules/lodash/isLength.js"(exports, module) {
    var MAX_SAFE_INTEGER = 9007199254740991;
    function isLength(value) {
      return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }
    module.exports = isLength;
  }
});

// node_modules/lodash/isArrayLike.js
var require_isArrayLike = __commonJS({
  "node_modules/lodash/isArrayLike.js"(exports, module) {
    var isFunction = require_isFunction();
    var isLength = require_isLength();
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }
    module.exports = isArrayLike;
  }
});

// node_modules/lodash/isArrayLikeObject.js
var require_isArrayLikeObject = __commonJS({
  "node_modules/lodash/isArrayLikeObject.js"(exports, module) {
    var isArrayLike = require_isArrayLike();
    var isObjectLike = require_isObjectLike();
    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }
    module.exports = isArrayLikeObject;
  }
});

// node_modules/lodash/stubFalse.js
var require_stubFalse = __commonJS({
  "node_modules/lodash/stubFalse.js"(exports, module) {
    function stubFalse() {
      return false;
    }
    module.exports = stubFalse;
  }
});

// node_modules/lodash/isBuffer.js
var require_isBuffer = __commonJS({
  "node_modules/lodash/isBuffer.js"(exports, module) {
    var root = require_root();
    var stubFalse = require_stubFalse();
    var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
    var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var Buffer = moduleExports ? root.Buffer : void 0;
    var nativeIsBuffer = Buffer ? Buffer.isBuffer : void 0;
    var isBuffer = nativeIsBuffer || stubFalse;
    module.exports = isBuffer;
  }
});

// node_modules/lodash/isPlainObject.js
var require_isPlainObject = __commonJS({
  "node_modules/lodash/isPlainObject.js"(exports, module) {
    var baseGetTag = require_baseGetTag();
    var getPrototype = require_getPrototype();
    var isObjectLike = require_isObjectLike();
    var objectTag = "[object Object]";
    var funcProto = Function.prototype;
    var objectProto = Object.prototype;
    var funcToString = funcProto.toString;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var objectCtorString = funcToString.call(Object);
    function isPlainObject(value) {
      if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
        return false;
      }
      var proto = getPrototype(value);
      if (proto === null) {
        return true;
      }
      var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
      return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
    }
    module.exports = isPlainObject;
  }
});

// node_modules/lodash/_baseIsTypedArray.js
var require_baseIsTypedArray = __commonJS({
  "node_modules/lodash/_baseIsTypedArray.js"(exports, module) {
    var baseGetTag = require_baseGetTag();
    var isLength = require_isLength();
    var isObjectLike = require_isObjectLike();
    var argsTag = "[object Arguments]";
    var arrayTag = "[object Array]";
    var boolTag = "[object Boolean]";
    var dateTag = "[object Date]";
    var errorTag = "[object Error]";
    var funcTag = "[object Function]";
    var mapTag = "[object Map]";
    var numberTag = "[object Number]";
    var objectTag = "[object Object]";
    var regexpTag = "[object RegExp]";
    var setTag = "[object Set]";
    var stringTag = "[object String]";
    var weakMapTag = "[object WeakMap]";
    var arrayBufferTag = "[object ArrayBuffer]";
    var dataViewTag = "[object DataView]";
    var float32Tag = "[object Float32Array]";
    var float64Tag = "[object Float64Array]";
    var int8Tag = "[object Int8Array]";
    var int16Tag = "[object Int16Array]";
    var int32Tag = "[object Int32Array]";
    var uint8Tag = "[object Uint8Array]";
    var uint8ClampedTag = "[object Uint8ClampedArray]";
    var uint16Tag = "[object Uint16Array]";
    var uint32Tag = "[object Uint32Array]";
    var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
    function baseIsTypedArray(value) {
      return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
    }
    module.exports = baseIsTypedArray;
  }
});

// node_modules/lodash/_baseUnary.js
var require_baseUnary = __commonJS({
  "node_modules/lodash/_baseUnary.js"(exports, module) {
    function baseUnary(func) {
      return function(value) {
        return func(value);
      };
    }
    module.exports = baseUnary;
  }
});

// node_modules/lodash/_nodeUtil.js
var require_nodeUtil = __commonJS({
  "node_modules/lodash/_nodeUtil.js"(exports, module) {
    var freeGlobal = require_freeGlobal();
    var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
    var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var freeProcess = moduleExports && freeGlobal.process;
    var nodeUtil = function() {
      try {
        var types = freeModule && freeModule.require && freeModule.require("util").types;
        if (types) {
          return types;
        }
        return freeProcess && freeProcess.binding && freeProcess.binding("util");
      } catch (e8) {
      }
    }();
    module.exports = nodeUtil;
  }
});

// node_modules/lodash/isTypedArray.js
var require_isTypedArray = __commonJS({
  "node_modules/lodash/isTypedArray.js"(exports, module) {
    var baseIsTypedArray = require_baseIsTypedArray();
    var baseUnary = require_baseUnary();
    var nodeUtil = require_nodeUtil();
    var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
    var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
    module.exports = isTypedArray;
  }
});

// node_modules/lodash/_safeGet.js
var require_safeGet = __commonJS({
  "node_modules/lodash/_safeGet.js"(exports, module) {
    function safeGet(object, key) {
      if (key === "constructor" && typeof object[key] === "function") {
        return;
      }
      if (key == "__proto__") {
        return;
      }
      return object[key];
    }
    module.exports = safeGet;
  }
});

// node_modules/lodash/_assignValue.js
var require_assignValue = __commonJS({
  "node_modules/lodash/_assignValue.js"(exports, module) {
    var baseAssignValue = require_baseAssignValue();
    var eq = require_eq();
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function assignValue(object, key, value) {
      var objValue = object[key];
      if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) {
        baseAssignValue(object, key, value);
      }
    }
    module.exports = assignValue;
  }
});

// node_modules/lodash/_copyObject.js
var require_copyObject = __commonJS({
  "node_modules/lodash/_copyObject.js"(exports, module) {
    var assignValue = require_assignValue();
    var baseAssignValue = require_baseAssignValue();
    function copyObject(source, props, object, customizer) {
      var isNew = !object;
      object || (object = {});
      var index = -1, length = props.length;
      while (++index < length) {
        var key = props[index];
        var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
        if (newValue === void 0) {
          newValue = source[key];
        }
        if (isNew) {
          baseAssignValue(object, key, newValue);
        } else {
          assignValue(object, key, newValue);
        }
      }
      return object;
    }
    module.exports = copyObject;
  }
});

// node_modules/lodash/_baseTimes.js
var require_baseTimes = __commonJS({
  "node_modules/lodash/_baseTimes.js"(exports, module) {
    function baseTimes(n7, iteratee) {
      var index = -1, result = Array(n7);
      while (++index < n7) {
        result[index] = iteratee(index);
      }
      return result;
    }
    module.exports = baseTimes;
  }
});

// node_modules/lodash/_isIndex.js
var require_isIndex = __commonJS({
  "node_modules/lodash/_isIndex.js"(exports, module) {
    var MAX_SAFE_INTEGER = 9007199254740991;
    var reIsUint = /^(?:0|[1-9]\d*)$/;
    function isIndex(value, length) {
      var type = typeof value;
      length = length == null ? MAX_SAFE_INTEGER : length;
      return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
    }
    module.exports = isIndex;
  }
});

// node_modules/lodash/_arrayLikeKeys.js
var require_arrayLikeKeys = __commonJS({
  "node_modules/lodash/_arrayLikeKeys.js"(exports, module) {
    var baseTimes = require_baseTimes();
    var isArguments = require_isArguments();
    var isArray = require_isArray();
    var isBuffer = require_isBuffer();
    var isIndex = require_isIndex();
    var isTypedArray = require_isTypedArray();
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function arrayLikeKeys(value, inherited) {
      var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
      for (var key in value) {
        if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
        (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
        isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
        isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
        isIndex(key, length)))) {
          result.push(key);
        }
      }
      return result;
    }
    module.exports = arrayLikeKeys;
  }
});

// node_modules/lodash/_nativeKeysIn.js
var require_nativeKeysIn = __commonJS({
  "node_modules/lodash/_nativeKeysIn.js"(exports, module) {
    function nativeKeysIn(object) {
      var result = [];
      if (object != null) {
        for (var key in Object(object)) {
          result.push(key);
        }
      }
      return result;
    }
    module.exports = nativeKeysIn;
  }
});

// node_modules/lodash/_baseKeysIn.js
var require_baseKeysIn = __commonJS({
  "node_modules/lodash/_baseKeysIn.js"(exports, module) {
    var isObject = require_isObject();
    var isPrototype = require_isPrototype();
    var nativeKeysIn = require_nativeKeysIn();
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function baseKeysIn(object) {
      if (!isObject(object)) {
        return nativeKeysIn(object);
      }
      var isProto = isPrototype(object), result = [];
      for (var key in object) {
        if (!(key == "constructor" && (isProto || !hasOwnProperty.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }
    module.exports = baseKeysIn;
  }
});

// node_modules/lodash/keysIn.js
var require_keysIn = __commonJS({
  "node_modules/lodash/keysIn.js"(exports, module) {
    var arrayLikeKeys = require_arrayLikeKeys();
    var baseKeysIn = require_baseKeysIn();
    var isArrayLike = require_isArrayLike();
    function keysIn(object) {
      return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
    }
    module.exports = keysIn;
  }
});

// node_modules/lodash/toPlainObject.js
var require_toPlainObject = __commonJS({
  "node_modules/lodash/toPlainObject.js"(exports, module) {
    var copyObject = require_copyObject();
    var keysIn = require_keysIn();
    function toPlainObject(value) {
      return copyObject(value, keysIn(value));
    }
    module.exports = toPlainObject;
  }
});

// node_modules/lodash/_baseMergeDeep.js
var require_baseMergeDeep = __commonJS({
  "node_modules/lodash/_baseMergeDeep.js"(exports, module) {
    var assignMergeValue = require_assignMergeValue();
    var cloneBuffer = require_cloneBuffer();
    var cloneTypedArray = require_cloneTypedArray();
    var copyArray = require_copyArray();
    var initCloneObject = require_initCloneObject();
    var isArguments = require_isArguments();
    var isArray = require_isArray();
    var isArrayLikeObject = require_isArrayLikeObject();
    var isBuffer = require_isBuffer();
    var isFunction = require_isFunction();
    var isObject = require_isObject();
    var isPlainObject = require_isPlainObject();
    var isTypedArray = require_isTypedArray();
    var safeGet = require_safeGet();
    var toPlainObject = require_toPlainObject();
    function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
      var objValue = safeGet(object, key), srcValue = safeGet(source, key), stacked = stack.get(srcValue);
      if (stacked) {
        assignMergeValue(object, key, stacked);
        return;
      }
      var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : void 0;
      var isCommon = newValue === void 0;
      if (isCommon) {
        var isArr = isArray(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
        newValue = srcValue;
        if (isArr || isBuff || isTyped) {
          if (isArray(objValue)) {
            newValue = objValue;
          } else if (isArrayLikeObject(objValue)) {
            newValue = copyArray(objValue);
          } else if (isBuff) {
            isCommon = false;
            newValue = cloneBuffer(srcValue, true);
          } else if (isTyped) {
            isCommon = false;
            newValue = cloneTypedArray(srcValue, true);
          } else {
            newValue = [];
          }
        } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
          newValue = objValue;
          if (isArguments(objValue)) {
            newValue = toPlainObject(objValue);
          } else if (!isObject(objValue) || isFunction(objValue)) {
            newValue = initCloneObject(srcValue);
          }
        } else {
          isCommon = false;
        }
      }
      if (isCommon) {
        stack.set(srcValue, newValue);
        mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
        stack["delete"](srcValue);
      }
      assignMergeValue(object, key, newValue);
    }
    module.exports = baseMergeDeep;
  }
});

// node_modules/lodash/_baseMerge.js
var require_baseMerge = __commonJS({
  "node_modules/lodash/_baseMerge.js"(exports, module) {
    var Stack = require_Stack();
    var assignMergeValue = require_assignMergeValue();
    var baseFor = require_baseFor();
    var baseMergeDeep = require_baseMergeDeep();
    var isObject = require_isObject();
    var keysIn = require_keysIn();
    var safeGet = require_safeGet();
    function baseMerge(object, source, srcIndex, customizer, stack) {
      if (object === source) {
        return;
      }
      baseFor(source, function(srcValue, key) {
        stack || (stack = new Stack());
        if (isObject(srcValue)) {
          baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
        } else {
          var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack) : void 0;
          if (newValue === void 0) {
            newValue = srcValue;
          }
          assignMergeValue(object, key, newValue);
        }
      }, keysIn);
    }
    module.exports = baseMerge;
  }
});

// node_modules/lodash/identity.js
var require_identity = __commonJS({
  "node_modules/lodash/identity.js"(exports, module) {
    function identity(value) {
      return value;
    }
    module.exports = identity;
  }
});

// node_modules/lodash/_apply.js
var require_apply = __commonJS({
  "node_modules/lodash/_apply.js"(exports, module) {
    function apply(func, thisArg, args) {
      switch (args.length) {
        case 0:
          return func.call(thisArg);
        case 1:
          return func.call(thisArg, args[0]);
        case 2:
          return func.call(thisArg, args[0], args[1]);
        case 3:
          return func.call(thisArg, args[0], args[1], args[2]);
      }
      return func.apply(thisArg, args);
    }
    module.exports = apply;
  }
});

// node_modules/lodash/_overRest.js
var require_overRest = __commonJS({
  "node_modules/lodash/_overRest.js"(exports, module) {
    var apply = require_apply();
    var nativeMax = Math.max;
    function overRest(func, start, transform) {
      start = nativeMax(start === void 0 ? func.length - 1 : start, 0);
      return function() {
        var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length);
        while (++index < length) {
          array[index] = args[start + index];
        }
        index = -1;
        var otherArgs = Array(start + 1);
        while (++index < start) {
          otherArgs[index] = args[index];
        }
        otherArgs[start] = transform(array);
        return apply(func, this, otherArgs);
      };
    }
    module.exports = overRest;
  }
});

// node_modules/lodash/constant.js
var require_constant = __commonJS({
  "node_modules/lodash/constant.js"(exports, module) {
    function constant(value) {
      return function() {
        return value;
      };
    }
    module.exports = constant;
  }
});

// node_modules/lodash/_baseSetToString.js
var require_baseSetToString = __commonJS({
  "node_modules/lodash/_baseSetToString.js"(exports, module) {
    var constant = require_constant();
    var defineProperty = require_defineProperty();
    var identity = require_identity();
    var baseSetToString = !defineProperty ? identity : function(func, string) {
      return defineProperty(func, "toString", {
        "configurable": true,
        "enumerable": false,
        "value": constant(string),
        "writable": true
      });
    };
    module.exports = baseSetToString;
  }
});

// node_modules/lodash/_shortOut.js
var require_shortOut = __commonJS({
  "node_modules/lodash/_shortOut.js"(exports, module) {
    var HOT_COUNT = 800;
    var HOT_SPAN = 16;
    var nativeNow = Date.now;
    function shortOut(func) {
      var count = 0, lastCalled = 0;
      return function() {
        var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
        lastCalled = stamp;
        if (remaining > 0) {
          if (++count >= HOT_COUNT) {
            return arguments[0];
          }
        } else {
          count = 0;
        }
        return func.apply(void 0, arguments);
      };
    }
    module.exports = shortOut;
  }
});

// node_modules/lodash/_setToString.js
var require_setToString = __commonJS({
  "node_modules/lodash/_setToString.js"(exports, module) {
    var baseSetToString = require_baseSetToString();
    var shortOut = require_shortOut();
    var setToString = shortOut(baseSetToString);
    module.exports = setToString;
  }
});

// node_modules/lodash/_baseRest.js
var require_baseRest = __commonJS({
  "node_modules/lodash/_baseRest.js"(exports, module) {
    var identity = require_identity();
    var overRest = require_overRest();
    var setToString = require_setToString();
    function baseRest(func, start) {
      return setToString(overRest(func, start, identity), func + "");
    }
    module.exports = baseRest;
  }
});

// node_modules/lodash/_isIterateeCall.js
var require_isIterateeCall = __commonJS({
  "node_modules/lodash/_isIterateeCall.js"(exports, module) {
    var eq = require_eq();
    var isArrayLike = require_isArrayLike();
    var isIndex = require_isIndex();
    var isObject = require_isObject();
    function isIterateeCall(value, index, object) {
      if (!isObject(object)) {
        return false;
      }
      var type = typeof index;
      if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && index in object) {
        return eq(object[index], value);
      }
      return false;
    }
    module.exports = isIterateeCall;
  }
});

// node_modules/lodash/_createAssigner.js
var require_createAssigner = __commonJS({
  "node_modules/lodash/_createAssigner.js"(exports, module) {
    var baseRest = require_baseRest();
    var isIterateeCall = require_isIterateeCall();
    function createAssigner(assigner) {
      return baseRest(function(object, sources) {
        var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
        customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0;
        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
          customizer = length < 3 ? void 0 : customizer;
          length = 1;
        }
        object = Object(object);
        while (++index < length) {
          var source = sources[index];
          if (source) {
            assigner(object, source, index, customizer);
          }
        }
        return object;
      });
    }
    module.exports = createAssigner;
  }
});

// node_modules/lodash/merge.js
var require_merge = __commonJS({
  "node_modules/lodash/merge.js"(exports, module) {
    var baseMerge = require_baseMerge();
    var createAssigner = require_createAssigner();
    var merge = createAssigner(function(object, source, srcIndex) {
      baseMerge(object, source, srcIndex);
    });
    module.exports = merge;
  }
});

// node_modules/lodash/isSymbol.js
var require_isSymbol = __commonJS({
  "node_modules/lodash/isSymbol.js"(exports, module) {
    var baseGetTag = require_baseGetTag();
    var isObjectLike = require_isObjectLike();
    var symbolTag = "[object Symbol]";
    function isSymbol(value) {
      return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
    }
    module.exports = isSymbol;
  }
});

// node_modules/lodash/_isKey.js
var require_isKey = __commonJS({
  "node_modules/lodash/_isKey.js"(exports, module) {
    var isArray = require_isArray();
    var isSymbol = require_isSymbol();
    var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
    var reIsPlainProp = /^\w*$/;
    function isKey(value, object) {
      if (isArray(value)) {
        return false;
      }
      var type = typeof value;
      if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
        return true;
      }
      return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
    }
    module.exports = isKey;
  }
});

// node_modules/lodash/memoize.js
var require_memoize = __commonJS({
  "node_modules/lodash/memoize.js"(exports, module) {
    var MapCache = require_MapCache();
    var FUNC_ERROR_TEXT = "Expected a function";
    function memoize(func, resolver) {
      if (typeof func != "function" || resolver != null && typeof resolver != "function") {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var memoized = function() {
        var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
        if (cache.has(key)) {
          return cache.get(key);
        }
        var result = func.apply(this, args);
        memoized.cache = cache.set(key, result) || cache;
        return result;
      };
      memoized.cache = new (memoize.Cache || MapCache)();
      return memoized;
    }
    memoize.Cache = MapCache;
    module.exports = memoize;
  }
});

// node_modules/lodash/_memoizeCapped.js
var require_memoizeCapped = __commonJS({
  "node_modules/lodash/_memoizeCapped.js"(exports, module) {
    var memoize = require_memoize();
    var MAX_MEMOIZE_SIZE = 500;
    function memoizeCapped(func) {
      var result = memoize(func, function(key) {
        if (cache.size === MAX_MEMOIZE_SIZE) {
          cache.clear();
        }
        return key;
      });
      var cache = result.cache;
      return result;
    }
    module.exports = memoizeCapped;
  }
});

// node_modules/lodash/_stringToPath.js
var require_stringToPath = __commonJS({
  "node_modules/lodash/_stringToPath.js"(exports, module) {
    var memoizeCapped = require_memoizeCapped();
    var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
    var reEscapeChar = /\\(\\)?/g;
    var stringToPath = memoizeCapped(function(string) {
      var result = [];
      if (string.charCodeAt(0) === 46) {
        result.push("");
      }
      string.replace(rePropName, function(match, number, quote, subString) {
        result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
      });
      return result;
    });
    module.exports = stringToPath;
  }
});

// node_modules/lodash/_arrayMap.js
var require_arrayMap = __commonJS({
  "node_modules/lodash/_arrayMap.js"(exports, module) {
    function arrayMap(array, iteratee) {
      var index = -1, length = array == null ? 0 : array.length, result = Array(length);
      while (++index < length) {
        result[index] = iteratee(array[index], index, array);
      }
      return result;
    }
    module.exports = arrayMap;
  }
});

// node_modules/lodash/_baseToString.js
var require_baseToString = __commonJS({
  "node_modules/lodash/_baseToString.js"(exports, module) {
    var Symbol2 = require_Symbol();
    var arrayMap = require_arrayMap();
    var isArray = require_isArray();
    var isSymbol = require_isSymbol();
    var INFINITY = 1 / 0;
    var symbolProto = Symbol2 ? Symbol2.prototype : void 0;
    var symbolToString = symbolProto ? symbolProto.toString : void 0;
    function baseToString(value) {
      if (typeof value == "string") {
        return value;
      }
      if (isArray(value)) {
        return arrayMap(value, baseToString) + "";
      }
      if (isSymbol(value)) {
        return symbolToString ? symbolToString.call(value) : "";
      }
      var result = value + "";
      return result == "0" && 1 / value == -INFINITY ? "-0" : result;
    }
    module.exports = baseToString;
  }
});

// node_modules/lodash/toString.js
var require_toString = __commonJS({
  "node_modules/lodash/toString.js"(exports, module) {
    var baseToString = require_baseToString();
    function toString(value) {
      return value == null ? "" : baseToString(value);
    }
    module.exports = toString;
  }
});

// node_modules/lodash/_castPath.js
var require_castPath = __commonJS({
  "node_modules/lodash/_castPath.js"(exports, module) {
    var isArray = require_isArray();
    var isKey = require_isKey();
    var stringToPath = require_stringToPath();
    var toString = require_toString();
    function castPath(value, object) {
      if (isArray(value)) {
        return value;
      }
      return isKey(value, object) ? [value] : stringToPath(toString(value));
    }
    module.exports = castPath;
  }
});

// node_modules/lodash/_toKey.js
var require_toKey = __commonJS({
  "node_modules/lodash/_toKey.js"(exports, module) {
    var isSymbol = require_isSymbol();
    var INFINITY = 1 / 0;
    function toKey(value) {
      if (typeof value == "string" || isSymbol(value)) {
        return value;
      }
      var result = value + "";
      return result == "0" && 1 / value == -INFINITY ? "-0" : result;
    }
    module.exports = toKey;
  }
});

// node_modules/lodash/_baseGet.js
var require_baseGet = __commonJS({
  "node_modules/lodash/_baseGet.js"(exports, module) {
    var castPath = require_castPath();
    var toKey = require_toKey();
    function baseGet(object, path) {
      path = castPath(path, object);
      var index = 0, length = path.length;
      while (object != null && index < length) {
        object = object[toKey(path[index++])];
      }
      return index && index == length ? object : void 0;
    }
    module.exports = baseGet;
  }
});

// node_modules/lodash/get.js
var require_get = __commonJS({
  "node_modules/lodash/get.js"(exports, module) {
    var baseGet = require_baseGet();
    function get(object, path, defaultValue) {
      var result = object == null ? void 0 : baseGet(object, path);
      return result === void 0 ? defaultValue : result;
    }
    module.exports = get;
  }
});

// node_modules/lodash/_baseSet.js
var require_baseSet = __commonJS({
  "node_modules/lodash/_baseSet.js"(exports, module) {
    var assignValue = require_assignValue();
    var castPath = require_castPath();
    var isIndex = require_isIndex();
    var isObject = require_isObject();
    var toKey = require_toKey();
    function baseSet(object, path, value, customizer) {
      if (!isObject(object)) {
        return object;
      }
      path = castPath(path, object);
      var index = -1, length = path.length, lastIndex = length - 1, nested = object;
      while (nested != null && ++index < length) {
        var key = toKey(path[index]), newValue = value;
        if (key === "__proto__" || key === "constructor" || key === "prototype") {
          return object;
        }
        if (index != lastIndex) {
          var objValue = nested[key];
          newValue = customizer ? customizer(objValue, key, nested) : void 0;
          if (newValue === void 0) {
            newValue = isObject(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
          }
        }
        assignValue(nested, key, newValue);
        nested = nested[key];
      }
      return object;
    }
    module.exports = baseSet;
  }
});

// node_modules/lodash/set.js
var require_set = __commonJS({
  "node_modules/lodash/set.js"(exports, module) {
    var baseSet = require_baseSet();
    function set(object, path, value) {
      return object == null ? object : baseSet(object, path, value);
    }
    module.exports = set;
  }
});

// node_modules/lodash/isString.js
var require_isString = __commonJS({
  "node_modules/lodash/isString.js"(exports, module) {
    var baseGetTag = require_baseGetTag();
    var isArray = require_isArray();
    var isObjectLike = require_isObjectLike();
    var stringTag = "[object String]";
    function isString(value) {
      return typeof value == "string" || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
    }
    module.exports = isString;
  }
});

// node_modules/lodash/last.js
var require_last = __commonJS({
  "node_modules/lodash/last.js"(exports, module) {
    function last(array) {
      var length = array == null ? 0 : array.length;
      return length ? array[length - 1] : void 0;
    }
    module.exports = last;
  }
});

// node_modules/lodash/_setCacheAdd.js
var require_setCacheAdd = __commonJS({
  "node_modules/lodash/_setCacheAdd.js"(exports, module) {
    var HASH_UNDEFINED = "__lodash_hash_undefined__";
    function setCacheAdd(value) {
      this.__data__.set(value, HASH_UNDEFINED);
      return this;
    }
    module.exports = setCacheAdd;
  }
});

// node_modules/lodash/_setCacheHas.js
var require_setCacheHas = __commonJS({
  "node_modules/lodash/_setCacheHas.js"(exports, module) {
    function setCacheHas(value) {
      return this.__data__.has(value);
    }
    module.exports = setCacheHas;
  }
});

// node_modules/lodash/_SetCache.js
var require_SetCache = __commonJS({
  "node_modules/lodash/_SetCache.js"(exports, module) {
    var MapCache = require_MapCache();
    var setCacheAdd = require_setCacheAdd();
    var setCacheHas = require_setCacheHas();
    function SetCache(values) {
      var index = -1, length = values == null ? 0 : values.length;
      this.__data__ = new MapCache();
      while (++index < length) {
        this.add(values[index]);
      }
    }
    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
    SetCache.prototype.has = setCacheHas;
    module.exports = SetCache;
  }
});

// node_modules/lodash/_baseFindIndex.js
var require_baseFindIndex = __commonJS({
  "node_modules/lodash/_baseFindIndex.js"(exports, module) {
    function baseFindIndex(array, predicate, fromIndex, fromRight) {
      var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
      while (fromRight ? index-- : ++index < length) {
        if (predicate(array[index], index, array)) {
          return index;
        }
      }
      return -1;
    }
    module.exports = baseFindIndex;
  }
});

// node_modules/lodash/_baseIsNaN.js
var require_baseIsNaN = __commonJS({
  "node_modules/lodash/_baseIsNaN.js"(exports, module) {
    function baseIsNaN(value) {
      return value !== value;
    }
    module.exports = baseIsNaN;
  }
});

// node_modules/lodash/_strictIndexOf.js
var require_strictIndexOf = __commonJS({
  "node_modules/lodash/_strictIndexOf.js"(exports, module) {
    function strictIndexOf(array, value, fromIndex) {
      var index = fromIndex - 1, length = array.length;
      while (++index < length) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }
    module.exports = strictIndexOf;
  }
});

// node_modules/lodash/_baseIndexOf.js
var require_baseIndexOf = __commonJS({
  "node_modules/lodash/_baseIndexOf.js"(exports, module) {
    var baseFindIndex = require_baseFindIndex();
    var baseIsNaN = require_baseIsNaN();
    var strictIndexOf = require_strictIndexOf();
    function baseIndexOf(array, value, fromIndex) {
      return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
    }
    module.exports = baseIndexOf;
  }
});

// node_modules/lodash/_arrayIncludes.js
var require_arrayIncludes = __commonJS({
  "node_modules/lodash/_arrayIncludes.js"(exports, module) {
    var baseIndexOf = require_baseIndexOf();
    function arrayIncludes(array, value) {
      var length = array == null ? 0 : array.length;
      return !!length && baseIndexOf(array, value, 0) > -1;
    }
    module.exports = arrayIncludes;
  }
});

// node_modules/lodash/_arrayIncludesWith.js
var require_arrayIncludesWith = __commonJS({
  "node_modules/lodash/_arrayIncludesWith.js"(exports, module) {
    function arrayIncludesWith(array, value, comparator) {
      var index = -1, length = array == null ? 0 : array.length;
      while (++index < length) {
        if (comparator(value, array[index])) {
          return true;
        }
      }
      return false;
    }
    module.exports = arrayIncludesWith;
  }
});

// node_modules/lodash/_cacheHas.js
var require_cacheHas = __commonJS({
  "node_modules/lodash/_cacheHas.js"(exports, module) {
    function cacheHas(cache, key) {
      return cache.has(key);
    }
    module.exports = cacheHas;
  }
});

// node_modules/lodash/_baseDifference.js
var require_baseDifference = __commonJS({
  "node_modules/lodash/_baseDifference.js"(exports, module) {
    var SetCache = require_SetCache();
    var arrayIncludes = require_arrayIncludes();
    var arrayIncludesWith = require_arrayIncludesWith();
    var arrayMap = require_arrayMap();
    var baseUnary = require_baseUnary();
    var cacheHas = require_cacheHas();
    var LARGE_ARRAY_SIZE = 200;
    function baseDifference(array, values, iteratee, comparator) {
      var index = -1, includes = arrayIncludes, isCommon = true, length = array.length, result = [], valuesLength = values.length;
      if (!length) {
        return result;
      }
      if (iteratee) {
        values = arrayMap(values, baseUnary(iteratee));
      }
      if (comparator) {
        includes = arrayIncludesWith;
        isCommon = false;
      } else if (values.length >= LARGE_ARRAY_SIZE) {
        includes = cacheHas;
        isCommon = false;
        values = new SetCache(values);
      }
      outer:
        while (++index < length) {
          var value = array[index], computed = iteratee == null ? value : iteratee(value);
          value = comparator || value !== 0 ? value : 0;
          if (isCommon && computed === computed) {
            var valuesIndex = valuesLength;
            while (valuesIndex--) {
              if (values[valuesIndex] === computed) {
                continue outer;
              }
            }
            result.push(value);
          } else if (!includes(values, computed, comparator)) {
            result.push(value);
          }
        }
      return result;
    }
    module.exports = baseDifference;
  }
});

// node_modules/lodash/without.js
var require_without = __commonJS({
  "node_modules/lodash/without.js"(exports, module) {
    var baseDifference = require_baseDifference();
    var baseRest = require_baseRest();
    var isArrayLikeObject = require_isArrayLikeObject();
    var without = baseRest(function(array, values) {
      return isArrayLikeObject(array) ? baseDifference(array, values) : [];
    });
    module.exports = without;
  }
});

// node_modules/lodash/_basePickBy.js
var require_basePickBy = __commonJS({
  "node_modules/lodash/_basePickBy.js"(exports, module) {
    var baseGet = require_baseGet();
    var baseSet = require_baseSet();
    var castPath = require_castPath();
    function basePickBy(object, paths, predicate) {
      var index = -1, length = paths.length, result = {};
      while (++index < length) {
        var path = paths[index], value = baseGet(object, path);
        if (predicate(value, path)) {
          baseSet(result, castPath(path, object), value);
        }
      }
      return result;
    }
    module.exports = basePickBy;
  }
});

// node_modules/lodash/_baseHasIn.js
var require_baseHasIn = __commonJS({
  "node_modules/lodash/_baseHasIn.js"(exports, module) {
    function baseHasIn(object, key) {
      return object != null && key in Object(object);
    }
    module.exports = baseHasIn;
  }
});

// node_modules/lodash/_hasPath.js
var require_hasPath = __commonJS({
  "node_modules/lodash/_hasPath.js"(exports, module) {
    var castPath = require_castPath();
    var isArguments = require_isArguments();
    var isArray = require_isArray();
    var isIndex = require_isIndex();
    var isLength = require_isLength();
    var toKey = require_toKey();
    function hasPath(object, path, hasFunc) {
      path = castPath(path, object);
      var index = -1, length = path.length, result = false;
      while (++index < length) {
        var key = toKey(path[index]);
        if (!(result = object != null && hasFunc(object, key))) {
          break;
        }
        object = object[key];
      }
      if (result || ++index != length) {
        return result;
      }
      length = object == null ? 0 : object.length;
      return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
    }
    module.exports = hasPath;
  }
});

// node_modules/lodash/hasIn.js
var require_hasIn = __commonJS({
  "node_modules/lodash/hasIn.js"(exports, module) {
    var baseHasIn = require_baseHasIn();
    var hasPath = require_hasPath();
    function hasIn(object, path) {
      return object != null && hasPath(object, path, baseHasIn);
    }
    module.exports = hasIn;
  }
});

// node_modules/lodash/_basePick.js
var require_basePick = __commonJS({
  "node_modules/lodash/_basePick.js"(exports, module) {
    var basePickBy = require_basePickBy();
    var hasIn = require_hasIn();
    function basePick(object, paths) {
      return basePickBy(object, paths, function(value, path) {
        return hasIn(object, path);
      });
    }
    module.exports = basePick;
  }
});

// node_modules/lodash/_arrayPush.js
var require_arrayPush = __commonJS({
  "node_modules/lodash/_arrayPush.js"(exports, module) {
    function arrayPush(array, values) {
      var index = -1, length = values.length, offset = array.length;
      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }
    module.exports = arrayPush;
  }
});

// node_modules/lodash/_isFlattenable.js
var require_isFlattenable = __commonJS({
  "node_modules/lodash/_isFlattenable.js"(exports, module) {
    var Symbol2 = require_Symbol();
    var isArguments = require_isArguments();
    var isArray = require_isArray();
    var spreadableSymbol = Symbol2 ? Symbol2.isConcatSpreadable : void 0;
    function isFlattenable(value) {
      return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
    }
    module.exports = isFlattenable;
  }
});

// node_modules/lodash/_baseFlatten.js
var require_baseFlatten = __commonJS({
  "node_modules/lodash/_baseFlatten.js"(exports, module) {
    var arrayPush = require_arrayPush();
    var isFlattenable = require_isFlattenable();
    function baseFlatten(array, depth, predicate, isStrict, result) {
      var index = -1, length = array.length;
      predicate || (predicate = isFlattenable);
      result || (result = []);
      while (++index < length) {
        var value = array[index];
        if (depth > 0 && predicate(value)) {
          if (depth > 1) {
            baseFlatten(value, depth - 1, predicate, isStrict, result);
          } else {
            arrayPush(result, value);
          }
        } else if (!isStrict) {
          result[result.length] = value;
        }
      }
      return result;
    }
    module.exports = baseFlatten;
  }
});

// node_modules/lodash/flatten.js
var require_flatten = __commonJS({
  "node_modules/lodash/flatten.js"(exports, module) {
    var baseFlatten = require_baseFlatten();
    function flatten(array) {
      var length = array == null ? 0 : array.length;
      return length ? baseFlatten(array, 1) : [];
    }
    module.exports = flatten;
  }
});

// node_modules/lodash/_flatRest.js
var require_flatRest = __commonJS({
  "node_modules/lodash/_flatRest.js"(exports, module) {
    var flatten = require_flatten();
    var overRest = require_overRest();
    var setToString = require_setToString();
    function flatRest(func) {
      return setToString(overRest(func, void 0, flatten), func + "");
    }
    module.exports = flatRest;
  }
});

// node_modules/lodash/pick.js
var require_pick = __commonJS({
  "node_modules/lodash/pick.js"(exports, module) {
    var basePick = require_basePick();
    var flatRest = require_flatRest();
    var pick = flatRest(function(object, paths) {
      return object == null ? {} : basePick(object, paths);
    });
    module.exports = pick;
  }
});

// node_modules/lodash/_arraySome.js
var require_arraySome = __commonJS({
  "node_modules/lodash/_arraySome.js"(exports, module) {
    function arraySome(array, predicate) {
      var index = -1, length = array == null ? 0 : array.length;
      while (++index < length) {
        if (predicate(array[index], index, array)) {
          return true;
        }
      }
      return false;
    }
    module.exports = arraySome;
  }
});

// node_modules/lodash/_equalArrays.js
var require_equalArrays = __commonJS({
  "node_modules/lodash/_equalArrays.js"(exports, module) {
    var SetCache = require_SetCache();
    var arraySome = require_arraySome();
    var cacheHas = require_cacheHas();
    var COMPARE_PARTIAL_FLAG = 1;
    var COMPARE_UNORDERED_FLAG = 2;
    function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
      if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
        return false;
      }
      var arrStacked = stack.get(array);
      var othStacked = stack.get(other);
      if (arrStacked && othStacked) {
        return arrStacked == other && othStacked == array;
      }
      var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : void 0;
      stack.set(array, other);
      stack.set(other, array);
      while (++index < arrLength) {
        var arrValue = array[index], othValue = other[index];
        if (customizer) {
          var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
        }
        if (compared !== void 0) {
          if (compared) {
            continue;
          }
          result = false;
          break;
        }
        if (seen) {
          if (!arraySome(other, function(othValue2, othIndex) {
            if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
            result = false;
            break;
          }
        } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
          result = false;
          break;
        }
      }
      stack["delete"](array);
      stack["delete"](other);
      return result;
    }
    module.exports = equalArrays;
  }
});

// node_modules/lodash/_mapToArray.js
var require_mapToArray = __commonJS({
  "node_modules/lodash/_mapToArray.js"(exports, module) {
    function mapToArray(map2) {
      var index = -1, result = Array(map2.size);
      map2.forEach(function(value, key) {
        result[++index] = [key, value];
      });
      return result;
    }
    module.exports = mapToArray;
  }
});

// node_modules/lodash/_setToArray.js
var require_setToArray = __commonJS({
  "node_modules/lodash/_setToArray.js"(exports, module) {
    function setToArray(set) {
      var index = -1, result = Array(set.size);
      set.forEach(function(value) {
        result[++index] = value;
      });
      return result;
    }
    module.exports = setToArray;
  }
});

// node_modules/lodash/_equalByTag.js
var require_equalByTag = __commonJS({
  "node_modules/lodash/_equalByTag.js"(exports, module) {
    var Symbol2 = require_Symbol();
    var Uint8Array = require_Uint8Array();
    var eq = require_eq();
    var equalArrays = require_equalArrays();
    var mapToArray = require_mapToArray();
    var setToArray = require_setToArray();
    var COMPARE_PARTIAL_FLAG = 1;
    var COMPARE_UNORDERED_FLAG = 2;
    var boolTag = "[object Boolean]";
    var dateTag = "[object Date]";
    var errorTag = "[object Error]";
    var mapTag = "[object Map]";
    var numberTag = "[object Number]";
    var regexpTag = "[object RegExp]";
    var setTag = "[object Set]";
    var stringTag = "[object String]";
    var symbolTag = "[object Symbol]";
    var arrayBufferTag = "[object ArrayBuffer]";
    var dataViewTag = "[object DataView]";
    var symbolProto = Symbol2 ? Symbol2.prototype : void 0;
    var symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
    function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
      switch (tag) {
        case dataViewTag:
          if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
            return false;
          }
          object = object.buffer;
          other = other.buffer;
        case arrayBufferTag:
          if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
            return false;
          }
          return true;
        case boolTag:
        case dateTag:
        case numberTag:
          return eq(+object, +other);
        case errorTag:
          return object.name == other.name && object.message == other.message;
        case regexpTag:
        case stringTag:
          return object == other + "";
        case mapTag:
          var convert = mapToArray;
        case setTag:
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
          convert || (convert = setToArray);
          if (object.size != other.size && !isPartial) {
            return false;
          }
          var stacked = stack.get(object);
          if (stacked) {
            return stacked == other;
          }
          bitmask |= COMPARE_UNORDERED_FLAG;
          stack.set(object, other);
          var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
          stack["delete"](object);
          return result;
        case symbolTag:
          if (symbolValueOf) {
            return symbolValueOf.call(object) == symbolValueOf.call(other);
          }
      }
      return false;
    }
    module.exports = equalByTag;
  }
});

// node_modules/lodash/_baseGetAllKeys.js
var require_baseGetAllKeys = __commonJS({
  "node_modules/lodash/_baseGetAllKeys.js"(exports, module) {
    var arrayPush = require_arrayPush();
    var isArray = require_isArray();
    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
    }
    module.exports = baseGetAllKeys;
  }
});

// node_modules/lodash/_arrayFilter.js
var require_arrayFilter = __commonJS({
  "node_modules/lodash/_arrayFilter.js"(exports, module) {
    function arrayFilter(array, predicate) {
      var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result[resIndex++] = value;
        }
      }
      return result;
    }
    module.exports = arrayFilter;
  }
});

// node_modules/lodash/stubArray.js
var require_stubArray = __commonJS({
  "node_modules/lodash/stubArray.js"(exports, module) {
    function stubArray() {
      return [];
    }
    module.exports = stubArray;
  }
});

// node_modules/lodash/_getSymbols.js
var require_getSymbols = __commonJS({
  "node_modules/lodash/_getSymbols.js"(exports, module) {
    var arrayFilter = require_arrayFilter();
    var stubArray = require_stubArray();
    var objectProto = Object.prototype;
    var propertyIsEnumerable = objectProto.propertyIsEnumerable;
    var nativeGetSymbols = Object.getOwnPropertySymbols;
    var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
      if (object == null) {
        return [];
      }
      object = Object(object);
      return arrayFilter(nativeGetSymbols(object), function(symbol) {
        return propertyIsEnumerable.call(object, symbol);
      });
    };
    module.exports = getSymbols;
  }
});

// node_modules/lodash/_nativeKeys.js
var require_nativeKeys = __commonJS({
  "node_modules/lodash/_nativeKeys.js"(exports, module) {
    var overArg = require_overArg();
    var nativeKeys = overArg(Object.keys, Object);
    module.exports = nativeKeys;
  }
});

// node_modules/lodash/_baseKeys.js
var require_baseKeys = __commonJS({
  "node_modules/lodash/_baseKeys.js"(exports, module) {
    var isPrototype = require_isPrototype();
    var nativeKeys = require_nativeKeys();
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function baseKeys(object) {
      if (!isPrototype(object)) {
        return nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty.call(object, key) && key != "constructor") {
          result.push(key);
        }
      }
      return result;
    }
    module.exports = baseKeys;
  }
});

// node_modules/lodash/keys.js
var require_keys = __commonJS({
  "node_modules/lodash/keys.js"(exports, module) {
    var arrayLikeKeys = require_arrayLikeKeys();
    var baseKeys = require_baseKeys();
    var isArrayLike = require_isArrayLike();
    function keys(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }
    module.exports = keys;
  }
});

// node_modules/lodash/_getAllKeys.js
var require_getAllKeys = __commonJS({
  "node_modules/lodash/_getAllKeys.js"(exports, module) {
    var baseGetAllKeys = require_baseGetAllKeys();
    var getSymbols = require_getSymbols();
    var keys = require_keys();
    function getAllKeys(object) {
      return baseGetAllKeys(object, keys, getSymbols);
    }
    module.exports = getAllKeys;
  }
});

// node_modules/lodash/_equalObjects.js
var require_equalObjects = __commonJS({
  "node_modules/lodash/_equalObjects.js"(exports, module) {
    var getAllKeys = require_getAllKeys();
    var COMPARE_PARTIAL_FLAG = 1;
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
      if (objLength != othLength && !isPartial) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
          return false;
        }
      }
      var objStacked = stack.get(object);
      var othStacked = stack.get(other);
      if (objStacked && othStacked) {
        return objStacked == other && othStacked == object;
      }
      var result = true;
      stack.set(object, other);
      stack.set(other, object);
      var skipCtor = isPartial;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object[key], othValue = other[key];
        if (customizer) {
          var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
        }
        if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
          result = false;
          break;
        }
        skipCtor || (skipCtor = key == "constructor");
      }
      if (result && !skipCtor) {
        var objCtor = object.constructor, othCtor = other.constructor;
        if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
          result = false;
        }
      }
      stack["delete"](object);
      stack["delete"](other);
      return result;
    }
    module.exports = equalObjects;
  }
});

// node_modules/lodash/_DataView.js
var require_DataView = __commonJS({
  "node_modules/lodash/_DataView.js"(exports, module) {
    var getNative = require_getNative();
    var root = require_root();
    var DataView = getNative(root, "DataView");
    module.exports = DataView;
  }
});

// node_modules/lodash/_Promise.js
var require_Promise = __commonJS({
  "node_modules/lodash/_Promise.js"(exports, module) {
    var getNative = require_getNative();
    var root = require_root();
    var Promise2 = getNative(root, "Promise");
    module.exports = Promise2;
  }
});

// node_modules/lodash/_Set.js
var require_Set = __commonJS({
  "node_modules/lodash/_Set.js"(exports, module) {
    var getNative = require_getNative();
    var root = require_root();
    var Set2 = getNative(root, "Set");
    module.exports = Set2;
  }
});

// node_modules/lodash/_WeakMap.js
var require_WeakMap = __commonJS({
  "node_modules/lodash/_WeakMap.js"(exports, module) {
    var getNative = require_getNative();
    var root = require_root();
    var WeakMap = getNative(root, "WeakMap");
    module.exports = WeakMap;
  }
});

// node_modules/lodash/_getTag.js
var require_getTag = __commonJS({
  "node_modules/lodash/_getTag.js"(exports, module) {
    var DataView = require_DataView();
    var Map = require_Map();
    var Promise2 = require_Promise();
    var Set2 = require_Set();
    var WeakMap = require_WeakMap();
    var baseGetTag = require_baseGetTag();
    var toSource = require_toSource();
    var mapTag = "[object Map]";
    var objectTag = "[object Object]";
    var promiseTag = "[object Promise]";
    var setTag = "[object Set]";
    var weakMapTag = "[object WeakMap]";
    var dataViewTag = "[object DataView]";
    var dataViewCtorString = toSource(DataView);
    var mapCtorString = toSource(Map);
    var promiseCtorString = toSource(Promise2);
    var setCtorString = toSource(Set2);
    var weakMapCtorString = toSource(WeakMap);
    var getTag = baseGetTag;
    if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set2 && getTag(new Set2()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
      getTag = function(value) {
        var result = baseGetTag(value), Ctor = result == objectTag ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString:
              return dataViewTag;
            case mapCtorString:
              return mapTag;
            case promiseCtorString:
              return promiseTag;
            case setCtorString:
              return setTag;
            case weakMapCtorString:
              return weakMapTag;
          }
        }
        return result;
      };
    }
    module.exports = getTag;
  }
});

// node_modules/lodash/_baseIsEqualDeep.js
var require_baseIsEqualDeep = __commonJS({
  "node_modules/lodash/_baseIsEqualDeep.js"(exports, module) {
    var Stack = require_Stack();
    var equalArrays = require_equalArrays();
    var equalByTag = require_equalByTag();
    var equalObjects = require_equalObjects();
    var getTag = require_getTag();
    var isArray = require_isArray();
    var isBuffer = require_isBuffer();
    var isTypedArray = require_isTypedArray();
    var COMPARE_PARTIAL_FLAG = 1;
    var argsTag = "[object Arguments]";
    var arrayTag = "[object Array]";
    var objectTag = "[object Object]";
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
      var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
      objTag = objTag == argsTag ? objectTag : objTag;
      othTag = othTag == argsTag ? objectTag : othTag;
      var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
      if (isSameTag && isBuffer(object)) {
        if (!isBuffer(other)) {
          return false;
        }
        objIsArr = true;
        objIsObj = false;
      }
      if (isSameTag && !objIsObj) {
        stack || (stack = new Stack());
        return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
      }
      if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
        var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
        if (objIsWrapped || othIsWrapped) {
          var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
          stack || (stack = new Stack());
          return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
        }
      }
      if (!isSameTag) {
        return false;
      }
      stack || (stack = new Stack());
      return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
    }
    module.exports = baseIsEqualDeep;
  }
});

// node_modules/lodash/_baseIsEqual.js
var require_baseIsEqual = __commonJS({
  "node_modules/lodash/_baseIsEqual.js"(exports, module) {
    var baseIsEqualDeep = require_baseIsEqualDeep();
    var isObjectLike = require_isObjectLike();
    function baseIsEqual(value, other, bitmask, customizer, stack) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
    }
    module.exports = baseIsEqual;
  }
});

// node_modules/lodash/isEqual.js
var require_isEqual = __commonJS({
  "node_modules/lodash/isEqual.js"(exports, module) {
    var baseIsEqual = require_baseIsEqual();
    function isEqual(value, other) {
      return baseIsEqual(value, other);
    }
    module.exports = isEqual;
  }
});

// node_modules/lodash/noop.js
var require_noop = __commonJS({
  "node_modules/lodash/noop.js"(exports, module) {
    function noop() {
    }
    module.exports = noop;
  }
});

// node_modules/lodash/_createSet.js
var require_createSet = __commonJS({
  "node_modules/lodash/_createSet.js"(exports, module) {
    var Set2 = require_Set();
    var noop = require_noop();
    var setToArray = require_setToArray();
    var INFINITY = 1 / 0;
    var createSet = !(Set2 && 1 / setToArray(new Set2([, -0]))[1] == INFINITY) ? noop : function(values) {
      return new Set2(values);
    };
    module.exports = createSet;
  }
});

// node_modules/lodash/_baseUniq.js
var require_baseUniq = __commonJS({
  "node_modules/lodash/_baseUniq.js"(exports, module) {
    var SetCache = require_SetCache();
    var arrayIncludes = require_arrayIncludes();
    var arrayIncludesWith = require_arrayIncludesWith();
    var cacheHas = require_cacheHas();
    var createSet = require_createSet();
    var setToArray = require_setToArray();
    var LARGE_ARRAY_SIZE = 200;
    function baseUniq(array, iteratee, comparator) {
      var index = -1, includes = arrayIncludes, length = array.length, isCommon = true, result = [], seen = result;
      if (comparator) {
        isCommon = false;
        includes = arrayIncludesWith;
      } else if (length >= LARGE_ARRAY_SIZE) {
        var set = iteratee ? null : createSet(array);
        if (set) {
          return setToArray(set);
        }
        isCommon = false;
        includes = cacheHas;
        seen = new SetCache();
      } else {
        seen = iteratee ? [] : result;
      }
      outer:
        while (++index < length) {
          var value = array[index], computed = iteratee ? iteratee(value) : value;
          value = comparator || value !== 0 ? value : 0;
          if (isCommon && computed === computed) {
            var seenIndex = seen.length;
            while (seenIndex--) {
              if (seen[seenIndex] === computed) {
                continue outer;
              }
            }
            if (iteratee) {
              seen.push(computed);
            }
            result.push(value);
          } else if (!includes(seen, computed, comparator)) {
            if (seen !== result) {
              seen.push(computed);
            }
            result.push(value);
          }
        }
      return result;
    }
    module.exports = baseUniq;
  }
});

// node_modules/lodash/uniq.js
var require_uniq = __commonJS({
  "node_modules/lodash/uniq.js"(exports, module) {
    var baseUniq = require_baseUniq();
    function uniq(array) {
      return array && array.length ? baseUniq(array) : [];
    }
    module.exports = uniq;
  }
});

// node_modules/lodash/_baseIsMatch.js
var require_baseIsMatch = __commonJS({
  "node_modules/lodash/_baseIsMatch.js"(exports, module) {
    var Stack = require_Stack();
    var baseIsEqual = require_baseIsEqual();
    var COMPARE_PARTIAL_FLAG = 1;
    var COMPARE_UNORDERED_FLAG = 2;
    function baseIsMatch(object, source, matchData, customizer) {
      var index = matchData.length, length = index, noCustomizer = !customizer;
      if (object == null) {
        return !length;
      }
      object = Object(object);
      while (index--) {
        var data = matchData[index];
        if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
          return false;
        }
      }
      while (++index < length) {
        data = matchData[index];
        var key = data[0], objValue = object[key], srcValue = data[1];
        if (noCustomizer && data[2]) {
          if (objValue === void 0 && !(key in object)) {
            return false;
          }
        } else {
          var stack = new Stack();
          if (customizer) {
            var result = customizer(objValue, srcValue, key, object, source, stack);
          }
          if (!(result === void 0 ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack) : result)) {
            return false;
          }
        }
      }
      return true;
    }
    module.exports = baseIsMatch;
  }
});

// node_modules/lodash/_isStrictComparable.js
var require_isStrictComparable = __commonJS({
  "node_modules/lodash/_isStrictComparable.js"(exports, module) {
    var isObject = require_isObject();
    function isStrictComparable(value) {
      return value === value && !isObject(value);
    }
    module.exports = isStrictComparable;
  }
});

// node_modules/lodash/_getMatchData.js
var require_getMatchData = __commonJS({
  "node_modules/lodash/_getMatchData.js"(exports, module) {
    var isStrictComparable = require_isStrictComparable();
    var keys = require_keys();
    function getMatchData(object) {
      var result = keys(object), length = result.length;
      while (length--) {
        var key = result[length], value = object[key];
        result[length] = [key, value, isStrictComparable(value)];
      }
      return result;
    }
    module.exports = getMatchData;
  }
});

// node_modules/lodash/_matchesStrictComparable.js
var require_matchesStrictComparable = __commonJS({
  "node_modules/lodash/_matchesStrictComparable.js"(exports, module) {
    function matchesStrictComparable(key, srcValue) {
      return function(object) {
        if (object == null) {
          return false;
        }
        return object[key] === srcValue && (srcValue !== void 0 || key in Object(object));
      };
    }
    module.exports = matchesStrictComparable;
  }
});

// node_modules/lodash/_baseMatches.js
var require_baseMatches = __commonJS({
  "node_modules/lodash/_baseMatches.js"(exports, module) {
    var baseIsMatch = require_baseIsMatch();
    var getMatchData = require_getMatchData();
    var matchesStrictComparable = require_matchesStrictComparable();
    function baseMatches(source) {
      var matchData = getMatchData(source);
      if (matchData.length == 1 && matchData[0][2]) {
        return matchesStrictComparable(matchData[0][0], matchData[0][1]);
      }
      return function(object) {
        return object === source || baseIsMatch(object, source, matchData);
      };
    }
    module.exports = baseMatches;
  }
});

// node_modules/lodash/_baseMatchesProperty.js
var require_baseMatchesProperty = __commonJS({
  "node_modules/lodash/_baseMatchesProperty.js"(exports, module) {
    var baseIsEqual = require_baseIsEqual();
    var get = require_get();
    var hasIn = require_hasIn();
    var isKey = require_isKey();
    var isStrictComparable = require_isStrictComparable();
    var matchesStrictComparable = require_matchesStrictComparable();
    var toKey = require_toKey();
    var COMPARE_PARTIAL_FLAG = 1;
    var COMPARE_UNORDERED_FLAG = 2;
    function baseMatchesProperty(path, srcValue) {
      if (isKey(path) && isStrictComparable(srcValue)) {
        return matchesStrictComparable(toKey(path), srcValue);
      }
      return function(object) {
        var objValue = get(object, path);
        return objValue === void 0 && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
      };
    }
    module.exports = baseMatchesProperty;
  }
});

// node_modules/lodash/_baseProperty.js
var require_baseProperty = __commonJS({
  "node_modules/lodash/_baseProperty.js"(exports, module) {
    function baseProperty(key) {
      return function(object) {
        return object == null ? void 0 : object[key];
      };
    }
    module.exports = baseProperty;
  }
});

// node_modules/lodash/_basePropertyDeep.js
var require_basePropertyDeep = __commonJS({
  "node_modules/lodash/_basePropertyDeep.js"(exports, module) {
    var baseGet = require_baseGet();
    function basePropertyDeep(path) {
      return function(object) {
        return baseGet(object, path);
      };
    }
    module.exports = basePropertyDeep;
  }
});

// node_modules/lodash/property.js
var require_property = __commonJS({
  "node_modules/lodash/property.js"(exports, module) {
    var baseProperty = require_baseProperty();
    var basePropertyDeep = require_basePropertyDeep();
    var isKey = require_isKey();
    var toKey = require_toKey();
    function property(path) {
      return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
    }
    module.exports = property;
  }
});

// node_modules/lodash/_baseIteratee.js
var require_baseIteratee = __commonJS({
  "node_modules/lodash/_baseIteratee.js"(exports, module) {
    var baseMatches = require_baseMatches();
    var baseMatchesProperty = require_baseMatchesProperty();
    var identity = require_identity();
    var isArray = require_isArray();
    var property = require_property();
    function baseIteratee(value) {
      if (typeof value == "function") {
        return value;
      }
      if (value == null) {
        return identity;
      }
      if (typeof value == "object") {
        return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
      }
      return property(value);
    }
    module.exports = baseIteratee;
  }
});

// node_modules/lodash/uniqBy.js
var require_uniqBy = __commonJS({
  "node_modules/lodash/uniqBy.js"(exports, module) {
    var baseIteratee = require_baseIteratee();
    var baseUniq = require_baseUniq();
    function uniqBy(array, iteratee) {
      return array && array.length ? baseUniq(array, baseIteratee(iteratee, 2)) : [];
    }
    module.exports = uniqBy;
  }
});

// node_modules/lodash/_baseForOwn.js
var require_baseForOwn = __commonJS({
  "node_modules/lodash/_baseForOwn.js"(exports, module) {
    var baseFor = require_baseFor();
    var keys = require_keys();
    function baseForOwn(object, iteratee) {
      return object && baseFor(object, iteratee, keys);
    }
    module.exports = baseForOwn;
  }
});

// node_modules/lodash/_createBaseEach.js
var require_createBaseEach = __commonJS({
  "node_modules/lodash/_createBaseEach.js"(exports, module) {
    var isArrayLike = require_isArrayLike();
    function createBaseEach(eachFunc, fromRight) {
      return function(collection, iteratee) {
        if (collection == null) {
          return collection;
        }
        if (!isArrayLike(collection)) {
          return eachFunc(collection, iteratee);
        }
        var length = collection.length, index = fromRight ? length : -1, iterable = Object(collection);
        while (fromRight ? index-- : ++index < length) {
          if (iteratee(iterable[index], index, iterable) === false) {
            break;
          }
        }
        return collection;
      };
    }
    module.exports = createBaseEach;
  }
});

// node_modules/lodash/_baseEach.js
var require_baseEach = __commonJS({
  "node_modules/lodash/_baseEach.js"(exports, module) {
    var baseForOwn = require_baseForOwn();
    var createBaseEach = require_createBaseEach();
    var baseEach = createBaseEach(baseForOwn);
    module.exports = baseEach;
  }
});

// node_modules/lodash/_baseMap.js
var require_baseMap = __commonJS({
  "node_modules/lodash/_baseMap.js"(exports, module) {
    var baseEach = require_baseEach();
    var isArrayLike = require_isArrayLike();
    function baseMap(collection, iteratee) {
      var index = -1, result = isArrayLike(collection) ? Array(collection.length) : [];
      baseEach(collection, function(value, key, collection2) {
        result[++index] = iteratee(value, key, collection2);
      });
      return result;
    }
    module.exports = baseMap;
  }
});

// node_modules/lodash/_baseSortBy.js
var require_baseSortBy = __commonJS({
  "node_modules/lodash/_baseSortBy.js"(exports, module) {
    function baseSortBy(array, comparer) {
      var length = array.length;
      array.sort(comparer);
      while (length--) {
        array[length] = array[length].value;
      }
      return array;
    }
    module.exports = baseSortBy;
  }
});

// node_modules/lodash/_compareAscending.js
var require_compareAscending = __commonJS({
  "node_modules/lodash/_compareAscending.js"(exports, module) {
    var isSymbol = require_isSymbol();
    function compareAscending(value, other) {
      if (value !== other) {
        var valIsDefined = value !== void 0, valIsNull = value === null, valIsReflexive = value === value, valIsSymbol = isSymbol(value);
        var othIsDefined = other !== void 0, othIsNull = other === null, othIsReflexive = other === other, othIsSymbol = isSymbol(other);
        if (!othIsNull && !othIsSymbol && !valIsSymbol && value > other || valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol || valIsNull && othIsDefined && othIsReflexive || !valIsDefined && othIsReflexive || !valIsReflexive) {
          return 1;
        }
        if (!valIsNull && !valIsSymbol && !othIsSymbol && value < other || othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol || othIsNull && valIsDefined && valIsReflexive || !othIsDefined && valIsReflexive || !othIsReflexive) {
          return -1;
        }
      }
      return 0;
    }
    module.exports = compareAscending;
  }
});

// node_modules/lodash/_compareMultiple.js
var require_compareMultiple = __commonJS({
  "node_modules/lodash/_compareMultiple.js"(exports, module) {
    var compareAscending = require_compareAscending();
    function compareMultiple(object, other, orders) {
      var index = -1, objCriteria = object.criteria, othCriteria = other.criteria, length = objCriteria.length, ordersLength = orders.length;
      while (++index < length) {
        var result = compareAscending(objCriteria[index], othCriteria[index]);
        if (result) {
          if (index >= ordersLength) {
            return result;
          }
          var order = orders[index];
          return result * (order == "desc" ? -1 : 1);
        }
      }
      return object.index - other.index;
    }
    module.exports = compareMultiple;
  }
});

// node_modules/lodash/_baseOrderBy.js
var require_baseOrderBy = __commonJS({
  "node_modules/lodash/_baseOrderBy.js"(exports, module) {
    var arrayMap = require_arrayMap();
    var baseGet = require_baseGet();
    var baseIteratee = require_baseIteratee();
    var baseMap = require_baseMap();
    var baseSortBy = require_baseSortBy();
    var baseUnary = require_baseUnary();
    var compareMultiple = require_compareMultiple();
    var identity = require_identity();
    var isArray = require_isArray();
    function baseOrderBy(collection, iteratees, orders) {
      if (iteratees.length) {
        iteratees = arrayMap(iteratees, function(iteratee) {
          if (isArray(iteratee)) {
            return function(value) {
              return baseGet(value, iteratee.length === 1 ? iteratee[0] : iteratee);
            };
          }
          return iteratee;
        });
      } else {
        iteratees = [identity];
      }
      var index = -1;
      iteratees = arrayMap(iteratees, baseUnary(baseIteratee));
      var result = baseMap(collection, function(value, key, collection2) {
        var criteria = arrayMap(iteratees, function(iteratee) {
          return iteratee(value);
        });
        return { "criteria": criteria, "index": ++index, "value": value };
      });
      return baseSortBy(result, function(object, other) {
        return compareMultiple(object, other, orders);
      });
    }
    module.exports = baseOrderBy;
  }
});

// node_modules/lodash/sortBy.js
var require_sortBy = __commonJS({
  "node_modules/lodash/sortBy.js"(exports, module) {
    var baseFlatten = require_baseFlatten();
    var baseOrderBy = require_baseOrderBy();
    var baseRest = require_baseRest();
    var isIterateeCall = require_isIterateeCall();
    var sortBy = baseRest(function(collection, iteratees) {
      if (collection == null) {
        return [];
      }
      var length = iteratees.length;
      if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
        iteratees = [];
      } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
        iteratees = [iteratees[0]];
      }
      return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
    });
    module.exports = sortBy;
  }
});

// node_modules/lodash/_baseIsDate.js
var require_baseIsDate = __commonJS({
  "node_modules/lodash/_baseIsDate.js"(exports, module) {
    var baseGetTag = require_baseGetTag();
    var isObjectLike = require_isObjectLike();
    var dateTag = "[object Date]";
    function baseIsDate(value) {
      return isObjectLike(value) && baseGetTag(value) == dateTag;
    }
    module.exports = baseIsDate;
  }
});

// node_modules/lodash/isDate.js
var require_isDate = __commonJS({
  "node_modules/lodash/isDate.js"(exports, module) {
    var baseIsDate = require_baseIsDate();
    var baseUnary = require_baseUnary();
    var nodeUtil = require_nodeUtil();
    var nodeIsDate = nodeUtil && nodeUtil.isDate;
    var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;
    module.exports = isDate;
  }
});

// node_modules/lodash/_baseFilter.js
var require_baseFilter = __commonJS({
  "node_modules/lodash/_baseFilter.js"(exports, module) {
    var baseEach = require_baseEach();
    function baseFilter(collection, predicate) {
      var result = [];
      baseEach(collection, function(value, index, collection2) {
        if (predicate(value, index, collection2)) {
          result.push(value);
        }
      });
      return result;
    }
    module.exports = baseFilter;
  }
});

// node_modules/lodash/filter.js
var require_filter = __commonJS({
  "node_modules/lodash/filter.js"(exports, module) {
    var arrayFilter = require_arrayFilter();
    var baseFilter = require_baseFilter();
    var baseIteratee = require_baseIteratee();
    var isArray = require_isArray();
    function filter(collection, predicate) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      return func(collection, baseIteratee(predicate, 3));
    }
    module.exports = filter;
  }
});

// node_modules/lodash/isNumber.js
var require_isNumber = __commonJS({
  "node_modules/lodash/isNumber.js"(exports, module) {
    var baseGetTag = require_baseGetTag();
    var isObjectLike = require_isObjectLike();
    var numberTag = "[object Number]";
    function isNumber(value) {
      return typeof value == "number" || isObjectLike(value) && baseGetTag(value) == numberTag;
    }
    module.exports = isNumber;
  }
});

// node_modules/lodash/_arrayEach.js
var require_arrayEach = __commonJS({
  "node_modules/lodash/_arrayEach.js"(exports, module) {
    function arrayEach(array, iteratee) {
      var index = -1, length = array == null ? 0 : array.length;
      while (++index < length) {
        if (iteratee(array[index], index, array) === false) {
          break;
        }
      }
      return array;
    }
    module.exports = arrayEach;
  }
});

// node_modules/lodash/_baseAssign.js
var require_baseAssign = __commonJS({
  "node_modules/lodash/_baseAssign.js"(exports, module) {
    var copyObject = require_copyObject();
    var keys = require_keys();
    function baseAssign(object, source) {
      return object && copyObject(source, keys(source), object);
    }
    module.exports = baseAssign;
  }
});

// node_modules/lodash/_baseAssignIn.js
var require_baseAssignIn = __commonJS({
  "node_modules/lodash/_baseAssignIn.js"(exports, module) {
    var copyObject = require_copyObject();
    var keysIn = require_keysIn();
    function baseAssignIn(object, source) {
      return object && copyObject(source, keysIn(source), object);
    }
    module.exports = baseAssignIn;
  }
});

// node_modules/lodash/_copySymbols.js
var require_copySymbols = __commonJS({
  "node_modules/lodash/_copySymbols.js"(exports, module) {
    var copyObject = require_copyObject();
    var getSymbols = require_getSymbols();
    function copySymbols(source, object) {
      return copyObject(source, getSymbols(source), object);
    }
    module.exports = copySymbols;
  }
});

// node_modules/lodash/_getSymbolsIn.js
var require_getSymbolsIn = __commonJS({
  "node_modules/lodash/_getSymbolsIn.js"(exports, module) {
    var arrayPush = require_arrayPush();
    var getPrototype = require_getPrototype();
    var getSymbols = require_getSymbols();
    var stubArray = require_stubArray();
    var nativeGetSymbols = Object.getOwnPropertySymbols;
    var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
      var result = [];
      while (object) {
        arrayPush(result, getSymbols(object));
        object = getPrototype(object);
      }
      return result;
    };
    module.exports = getSymbolsIn;
  }
});

// node_modules/lodash/_copySymbolsIn.js
var require_copySymbolsIn = __commonJS({
  "node_modules/lodash/_copySymbolsIn.js"(exports, module) {
    var copyObject = require_copyObject();
    var getSymbolsIn = require_getSymbolsIn();
    function copySymbolsIn(source, object) {
      return copyObject(source, getSymbolsIn(source), object);
    }
    module.exports = copySymbolsIn;
  }
});

// node_modules/lodash/_getAllKeysIn.js
var require_getAllKeysIn = __commonJS({
  "node_modules/lodash/_getAllKeysIn.js"(exports, module) {
    var baseGetAllKeys = require_baseGetAllKeys();
    var getSymbolsIn = require_getSymbolsIn();
    var keysIn = require_keysIn();
    function getAllKeysIn(object) {
      return baseGetAllKeys(object, keysIn, getSymbolsIn);
    }
    module.exports = getAllKeysIn;
  }
});

// node_modules/lodash/_initCloneArray.js
var require_initCloneArray = __commonJS({
  "node_modules/lodash/_initCloneArray.js"(exports, module) {
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function initCloneArray(array) {
      var length = array.length, result = new array.constructor(length);
      if (length && typeof array[0] == "string" && hasOwnProperty.call(array, "index")) {
        result.index = array.index;
        result.input = array.input;
      }
      return result;
    }
    module.exports = initCloneArray;
  }
});

// node_modules/lodash/_cloneDataView.js
var require_cloneDataView = __commonJS({
  "node_modules/lodash/_cloneDataView.js"(exports, module) {
    var cloneArrayBuffer = require_cloneArrayBuffer();
    function cloneDataView(dataView, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
      return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
    }
    module.exports = cloneDataView;
  }
});

// node_modules/lodash/_cloneRegExp.js
var require_cloneRegExp = __commonJS({
  "node_modules/lodash/_cloneRegExp.js"(exports, module) {
    var reFlags = /\w*$/;
    function cloneRegExp(regexp) {
      var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
      result.lastIndex = regexp.lastIndex;
      return result;
    }
    module.exports = cloneRegExp;
  }
});

// node_modules/lodash/_cloneSymbol.js
var require_cloneSymbol = __commonJS({
  "node_modules/lodash/_cloneSymbol.js"(exports, module) {
    var Symbol2 = require_Symbol();
    var symbolProto = Symbol2 ? Symbol2.prototype : void 0;
    var symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
    function cloneSymbol(symbol) {
      return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
    }
    module.exports = cloneSymbol;
  }
});

// node_modules/lodash/_initCloneByTag.js
var require_initCloneByTag = __commonJS({
  "node_modules/lodash/_initCloneByTag.js"(exports, module) {
    var cloneArrayBuffer = require_cloneArrayBuffer();
    var cloneDataView = require_cloneDataView();
    var cloneRegExp = require_cloneRegExp();
    var cloneSymbol = require_cloneSymbol();
    var cloneTypedArray = require_cloneTypedArray();
    var boolTag = "[object Boolean]";
    var dateTag = "[object Date]";
    var mapTag = "[object Map]";
    var numberTag = "[object Number]";
    var regexpTag = "[object RegExp]";
    var setTag = "[object Set]";
    var stringTag = "[object String]";
    var symbolTag = "[object Symbol]";
    var arrayBufferTag = "[object ArrayBuffer]";
    var dataViewTag = "[object DataView]";
    var float32Tag = "[object Float32Array]";
    var float64Tag = "[object Float64Array]";
    var int8Tag = "[object Int8Array]";
    var int16Tag = "[object Int16Array]";
    var int32Tag = "[object Int32Array]";
    var uint8Tag = "[object Uint8Array]";
    var uint8ClampedTag = "[object Uint8ClampedArray]";
    var uint16Tag = "[object Uint16Array]";
    var uint32Tag = "[object Uint32Array]";
    function initCloneByTag(object, tag, isDeep) {
      var Ctor = object.constructor;
      switch (tag) {
        case arrayBufferTag:
          return cloneArrayBuffer(object);
        case boolTag:
        case dateTag:
          return new Ctor(+object);
        case dataViewTag:
          return cloneDataView(object, isDeep);
        case float32Tag:
        case float64Tag:
        case int8Tag:
        case int16Tag:
        case int32Tag:
        case uint8Tag:
        case uint8ClampedTag:
        case uint16Tag:
        case uint32Tag:
          return cloneTypedArray(object, isDeep);
        case mapTag:
          return new Ctor();
        case numberTag:
        case stringTag:
          return new Ctor(object);
        case regexpTag:
          return cloneRegExp(object);
        case setTag:
          return new Ctor();
        case symbolTag:
          return cloneSymbol(object);
      }
    }
    module.exports = initCloneByTag;
  }
});

// node_modules/lodash/_baseIsMap.js
var require_baseIsMap = __commonJS({
  "node_modules/lodash/_baseIsMap.js"(exports, module) {
    var getTag = require_getTag();
    var isObjectLike = require_isObjectLike();
    var mapTag = "[object Map]";
    function baseIsMap(value) {
      return isObjectLike(value) && getTag(value) == mapTag;
    }
    module.exports = baseIsMap;
  }
});

// node_modules/lodash/isMap.js
var require_isMap = __commonJS({
  "node_modules/lodash/isMap.js"(exports, module) {
    var baseIsMap = require_baseIsMap();
    var baseUnary = require_baseUnary();
    var nodeUtil = require_nodeUtil();
    var nodeIsMap = nodeUtil && nodeUtil.isMap;
    var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
    module.exports = isMap;
  }
});

// node_modules/lodash/_baseIsSet.js
var require_baseIsSet = __commonJS({
  "node_modules/lodash/_baseIsSet.js"(exports, module) {
    var getTag = require_getTag();
    var isObjectLike = require_isObjectLike();
    var setTag = "[object Set]";
    function baseIsSet(value) {
      return isObjectLike(value) && getTag(value) == setTag;
    }
    module.exports = baseIsSet;
  }
});

// node_modules/lodash/isSet.js
var require_isSet = __commonJS({
  "node_modules/lodash/isSet.js"(exports, module) {
    var baseIsSet = require_baseIsSet();
    var baseUnary = require_baseUnary();
    var nodeUtil = require_nodeUtil();
    var nodeIsSet = nodeUtil && nodeUtil.isSet;
    var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
    module.exports = isSet;
  }
});

// node_modules/lodash/_baseClone.js
var require_baseClone = __commonJS({
  "node_modules/lodash/_baseClone.js"(exports, module) {
    var Stack = require_Stack();
    var arrayEach = require_arrayEach();
    var assignValue = require_assignValue();
    var baseAssign = require_baseAssign();
    var baseAssignIn = require_baseAssignIn();
    var cloneBuffer = require_cloneBuffer();
    var copyArray = require_copyArray();
    var copySymbols = require_copySymbols();
    var copySymbolsIn = require_copySymbolsIn();
    var getAllKeys = require_getAllKeys();
    var getAllKeysIn = require_getAllKeysIn();
    var getTag = require_getTag();
    var initCloneArray = require_initCloneArray();
    var initCloneByTag = require_initCloneByTag();
    var initCloneObject = require_initCloneObject();
    var isArray = require_isArray();
    var isBuffer = require_isBuffer();
    var isMap = require_isMap();
    var isObject = require_isObject();
    var isSet = require_isSet();
    var keys = require_keys();
    var keysIn = require_keysIn();
    var CLONE_DEEP_FLAG = 1;
    var CLONE_FLAT_FLAG = 2;
    var CLONE_SYMBOLS_FLAG = 4;
    var argsTag = "[object Arguments]";
    var arrayTag = "[object Array]";
    var boolTag = "[object Boolean]";
    var dateTag = "[object Date]";
    var errorTag = "[object Error]";
    var funcTag = "[object Function]";
    var genTag = "[object GeneratorFunction]";
    var mapTag = "[object Map]";
    var numberTag = "[object Number]";
    var objectTag = "[object Object]";
    var regexpTag = "[object RegExp]";
    var setTag = "[object Set]";
    var stringTag = "[object String]";
    var symbolTag = "[object Symbol]";
    var weakMapTag = "[object WeakMap]";
    var arrayBufferTag = "[object ArrayBuffer]";
    var dataViewTag = "[object DataView]";
    var float32Tag = "[object Float32Array]";
    var float64Tag = "[object Float64Array]";
    var int8Tag = "[object Int8Array]";
    var int16Tag = "[object Int16Array]";
    var int32Tag = "[object Int32Array]";
    var uint8Tag = "[object Uint8Array]";
    var uint8ClampedTag = "[object Uint8ClampedArray]";
    var uint16Tag = "[object Uint16Array]";
    var uint32Tag = "[object Uint32Array]";
    var cloneableTags = {};
    cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
    cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
    function baseClone(value, bitmask, customizer, key, object, stack) {
      var result, isDeep = bitmask & CLONE_DEEP_FLAG, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG;
      if (customizer) {
        result = object ? customizer(value, key, object, stack) : customizer(value);
      }
      if (result !== void 0) {
        return result;
      }
      if (!isObject(value)) {
        return value;
      }
      var isArr = isArray(value);
      if (isArr) {
        result = initCloneArray(value);
        if (!isDeep) {
          return copyArray(value, result);
        }
      } else {
        var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
        if (isBuffer(value)) {
          return cloneBuffer(value, isDeep);
        }
        if (tag == objectTag || tag == argsTag || isFunc && !object) {
          result = isFlat || isFunc ? {} : initCloneObject(value);
          if (!isDeep) {
            return isFlat ? copySymbolsIn(value, baseAssignIn(result, value)) : copySymbols(value, baseAssign(result, value));
          }
        } else {
          if (!cloneableTags[tag]) {
            return object ? value : {};
          }
          result = initCloneByTag(value, tag, isDeep);
        }
      }
      stack || (stack = new Stack());
      var stacked = stack.get(value);
      if (stacked) {
        return stacked;
      }
      stack.set(value, result);
      if (isSet(value)) {
        value.forEach(function(subValue) {
          result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
        });
      } else if (isMap(value)) {
        value.forEach(function(subValue, key2) {
          result.set(key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
        });
      }
      var keysFunc = isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys;
      var props = isArr ? void 0 : keysFunc(value);
      arrayEach(props || value, function(subValue, key2) {
        if (props) {
          key2 = subValue;
          subValue = value[key2];
        }
        assignValue(result, key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
      });
      return result;
    }
    module.exports = baseClone;
  }
});

// node_modules/lodash/_baseSlice.js
var require_baseSlice = __commonJS({
  "node_modules/lodash/_baseSlice.js"(exports, module) {
    function baseSlice(array, start, end) {
      var index = -1, length = array.length;
      if (start < 0) {
        start = -start > length ? 0 : length + start;
      }
      end = end > length ? length : end;
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : end - start >>> 0;
      start >>>= 0;
      var result = Array(length);
      while (++index < length) {
        result[index] = array[index + start];
      }
      return result;
    }
    module.exports = baseSlice;
  }
});

// node_modules/lodash/_parent.js
var require_parent = __commonJS({
  "node_modules/lodash/_parent.js"(exports, module) {
    var baseGet = require_baseGet();
    var baseSlice = require_baseSlice();
    function parent(object, path) {
      return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
    }
    module.exports = parent;
  }
});

// node_modules/lodash/_baseUnset.js
var require_baseUnset = __commonJS({
  "node_modules/lodash/_baseUnset.js"(exports, module) {
    var castPath = require_castPath();
    var last = require_last();
    var parent = require_parent();
    var toKey = require_toKey();
    function baseUnset(object, path) {
      path = castPath(path, object);
      object = parent(object, path);
      return object == null || delete object[toKey(last(path))];
    }
    module.exports = baseUnset;
  }
});

// node_modules/lodash/_customOmitClone.js
var require_customOmitClone = __commonJS({
  "node_modules/lodash/_customOmitClone.js"(exports, module) {
    var isPlainObject = require_isPlainObject();
    function customOmitClone(value) {
      return isPlainObject(value) ? void 0 : value;
    }
    module.exports = customOmitClone;
  }
});

// node_modules/lodash/omit.js
var require_omit = __commonJS({
  "node_modules/lodash/omit.js"(exports, module) {
    var arrayMap = require_arrayMap();
    var baseClone = require_baseClone();
    var baseUnset = require_baseUnset();
    var castPath = require_castPath();
    var copyObject = require_copyObject();
    var customOmitClone = require_customOmitClone();
    var flatRest = require_flatRest();
    var getAllKeysIn = require_getAllKeysIn();
    var CLONE_DEEP_FLAG = 1;
    var CLONE_FLAT_FLAG = 2;
    var CLONE_SYMBOLS_FLAG = 4;
    var omit = flatRest(function(object, paths) {
      var result = {};
      if (object == null) {
        return result;
      }
      var isDeep = false;
      paths = arrayMap(paths, function(path) {
        path = castPath(path, object);
        isDeep || (isDeep = path.length > 1);
        return path;
      });
      copyObject(object, getAllKeysIn(object), result);
      if (isDeep) {
        result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
      }
      var length = paths.length;
      while (length--) {
        baseUnset(result, paths[length]);
      }
      return result;
    });
    module.exports = omit;
  }
});

// node_modules/@nivo/heatmap/dist/nivo-heatmap.es.js
var import_react7 = __toESM(require_react());

// node_modules/@nivo/heatmap/node_modules/@nivo/core/dist/nivo-core.es.js
var import_react2 = __toESM(require_react());
var import_prop_types = __toESM(require_prop_types());

// node_modules/@nivo/heatmap/node_modules/@nivo/tooltip/dist/nivo-tooltip.es.js
var import_react = __toESM(require_react());

// node_modules/@react-spring/web/dist/react-spring_web.modern.mjs
var import_react_dom = __toESM(require_react_dom(), 1);
var isCustomPropRE = /^--/;
function dangerousStyleValue(name, value) {
  if (value == null || typeof value === "boolean" || value === "")
    return "";
  if (typeof value === "number" && value !== 0 && !isCustomPropRE.test(name) && !(isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name]))
    return value + "px";
  return ("" + value).trim();
}
var attributeCache = {};
function applyAnimatedValues(instance, props) {
  if (!instance.nodeType || !instance.setAttribute) {
    return false;
  }
  const isFilterElement = instance.nodeName === "filter" || instance.parentNode && instance.parentNode.nodeName === "filter";
  const {
    className,
    style,
    children,
    scrollTop,
    scrollLeft,
    viewBox,
    ...attributes
  } = props;
  const values = Object.values(attributes);
  const names = Object.keys(attributes).map(
    (name) => isFilterElement || instance.hasAttribute(name) ? name : attributeCache[name] || (attributeCache[name] = name.replace(
      /([A-Z])/g,
      // Attributes are written in dash case
      (n7) => "-" + n7.toLowerCase()
    ))
  );
  if (children !== void 0) {
    instance.textContent = children;
  }
  for (const name in style) {
    if (style.hasOwnProperty(name)) {
      const value = dangerousStyleValue(name, style[name]);
      if (isCustomPropRE.test(name)) {
        instance.style.setProperty(name, value);
      } else {
        instance.style[name] = value;
      }
    }
  }
  names.forEach((name, i6) => {
    instance.setAttribute(name, values[i6]);
  });
  if (className !== void 0) {
    instance.className = className;
  }
  if (scrollTop !== void 0) {
    instance.scrollTop = scrollTop;
  }
  if (scrollLeft !== void 0) {
    instance.scrollLeft = scrollLeft;
  }
  if (viewBox !== void 0) {
    instance.setAttribute("viewBox", viewBox);
  }
}
var isUnitlessNumber = {
  animationIterationCount: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  // SVG-related properties
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
};
var prefixKey = (prefix, key) => prefix + key.charAt(0).toUpperCase() + key.substring(1);
var prefixes = ["Webkit", "Ms", "Moz", "O"];
isUnitlessNumber = Object.keys(isUnitlessNumber).reduce((acc, prop) => {
  prefixes.forEach((prefix) => acc[prefixKey(prefix, prop)] = acc[prop]);
  return acc;
}, isUnitlessNumber);
var domTransforms = /^(matrix|translate|scale|rotate|skew)/;
var pxTransforms = /^(translate)/;
var degTransforms = /^(rotate|skew)/;
var addUnit = (value, unit) => is.num(value) && value !== 0 ? value + unit : value;
var isValueIdentity = (value, id) => is.arr(value) ? value.every((v5) => isValueIdentity(v5, id)) : is.num(value) ? value === id : parseFloat(value) === id;
var AnimatedStyle = class extends AnimatedObject {
  constructor({ x: x3, y: y4, z: z6, ...style }) {
    const inputs = [];
    const transforms = [];
    if (x3 || y4 || z6) {
      inputs.push([x3 || 0, y4 || 0, z6 || 0]);
      transforms.push((xyz) => [
        `translate3d(${xyz.map((v5) => addUnit(v5, "px")).join(",")})`,
        // prettier-ignore
        isValueIdentity(xyz, 0)
      ]);
    }
    eachProp(style, (value, key) => {
      if (key === "transform") {
        inputs.push([value || ""]);
        transforms.push((transform) => [transform, transform === ""]);
      } else if (domTransforms.test(key)) {
        delete style[key];
        if (is.und(value))
          return;
        const unit = pxTransforms.test(key) ? "px" : degTransforms.test(key) ? "deg" : "";
        inputs.push(toArray(value));
        transforms.push(
          key === "rotate3d" ? ([x22, y22, z22, deg]) => [
            `rotate3d(${x22},${y22},${z22},${addUnit(deg, unit)})`,
            isValueIdentity(deg, 0)
          ] : (input) => [
            `${key}(${input.map((v5) => addUnit(v5, unit)).join(",")})`,
            isValueIdentity(input, key.startsWith("scale") ? 1 : 0)
          ]
        );
      }
    });
    if (inputs.length) {
      style.transform = new FluidTransform(inputs, transforms);
    }
    super(style);
  }
};
var FluidTransform = class extends FluidValue {
  constructor(inputs, transforms) {
    super();
    this.inputs = inputs;
    this.transforms = transforms;
    this._value = null;
  }
  get() {
    return this._value || (this._value = this._get());
  }
  _get() {
    let transform = "";
    let identity = true;
    each(this.inputs, (input, i6) => {
      const arg1 = getFluidValue(input[0]);
      const [t8, id] = this.transforms[i6](
        is.arr(arg1) ? arg1 : input.map(getFluidValue)
      );
      transform += " " + t8;
      identity = identity && id;
    });
    return identity ? "none" : transform;
  }
  // Start observing our inputs once we have an observer.
  observerAdded(count) {
    if (count == 1)
      each(
        this.inputs,
        (input) => each(
          input,
          (value) => hasFluidValue(value) && addFluidObserver(value, this)
        )
      );
  }
  // Stop observing our inputs once we have no observers.
  observerRemoved(count) {
    if (count == 0)
      each(
        this.inputs,
        (input) => each(
          input,
          (value) => hasFluidValue(value) && removeFluidObserver(value, this)
        )
      );
  }
  eventObserved(event) {
    if (event.type == "change") {
      this._value = null;
    }
    callFluidObservers(this, event);
  }
};
var primitives = [
  "a",
  "abbr",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "base",
  "bdi",
  "bdo",
  "big",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "div",
  "dl",
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "keygen",
  "label",
  "legend",
  "li",
  "link",
  "main",
  "map",
  "mark",
  "menu",
  "menuitem",
  "meta",
  "meter",
  "nav",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "param",
  "picture",
  "pre",
  "progress",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "script",
  "section",
  "select",
  "small",
  "source",
  "span",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "u",
  "ul",
  "var",
  "video",
  "wbr",
  // SVG
  "circle",
  "clipPath",
  "defs",
  "ellipse",
  "foreignObject",
  "g",
  "image",
  "line",
  "linearGradient",
  "mask",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialGradient",
  "rect",
  "stop",
  "svg",
  "text",
  "tspan"
];
globals_exports.assign({
  batchedUpdates: import_react_dom.unstable_batchedUpdates,
  createStringInterpolator: createStringInterpolator2,
  colors: colors2
});
var host = createHost(primitives, {
  applyAnimatedValues,
  createAnimatedStyle: (style) => new AnimatedStyle(style),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getComponentProps: ({ scrollTop, scrollLeft, ...props }) => props
});
var animated = host.animated;

// node_modules/@nivo/heatmap/node_modules/@nivo/tooltip/dist/nivo-tooltip.es.js
var import_jsx_runtime = __toESM(require_jsx_runtime());
function v() {
  return v = Object.assign ? Object.assign.bind() : function(t8) {
    for (var i6 = 1; i6 < arguments.length; i6++) {
      var o5 = arguments[i6];
      for (var n7 in o5) Object.prototype.hasOwnProperty.call(o5, n7) && (t8[n7] = o5[n7]);
    }
    return t8;
  }, v.apply(this, arguments);
}
var x = { pointerEvents: "none", position: "absolute", zIndex: 10, top: 0, left: 0 };
var m = function(t8, i6) {
  return "translate(" + t8 + "px, " + i6 + "px)";
};
var b = (0, import_react.memo)(function(t8) {
  var o5, n7 = t8.position, r6 = t8.anchor, e8 = t8.children, l4 = zt(), d3 = Ur(), y4 = d3.animate, f2 = d3.config, b5 = kt(), g5 = b5[0], w4 = b5[1], T4 = (0, import_react.useRef)(false), C6 = void 0, E4 = false, P4 = w4.width > 0 && w4.height > 0, j5 = Math.round(n7[0]), N3 = Math.round(n7[1]);
  P4 && ("top" === r6 ? (j5 -= w4.width / 2, N3 -= w4.height + 14) : "right" === r6 ? (j5 += 14, N3 -= w4.height / 2) : "bottom" === r6 ? (j5 -= w4.width / 2, N3 += 14) : "left" === r6 ? (j5 -= w4.width + 14, N3 -= w4.height / 2) : "center" === r6 && (j5 -= w4.width / 2, N3 -= w4.height / 2), C6 = { transform: m(j5, N3) }, T4.current || (E4 = true), T4.current = [j5, N3]);
  var O5 = useSpring({ to: C6, config: f2, immediate: !y4 || E4 }), V3 = v({}, x, l4.tooltip.wrapper, { transform: null != (o5 = O5.transform) ? o5 : m(j5, N3), opacity: O5.transform ? 1 : 0 });
  return (0, import_jsx_runtime.jsx)(animated.div, { ref: g5, style: V3, children: e8 });
});
b.displayName = "TooltipWrapper";
var g = (0, import_react.memo)(function(t8) {
  var i6 = t8.size, o5 = void 0 === i6 ? 12 : i6, n7 = t8.color, r6 = t8.style;
  return (0, import_jsx_runtime.jsx)("span", { style: v({ display: "block", width: o5, height: o5, background: n7 }, void 0 === r6 ? {} : r6) });
});
var w = (0, import_react.memo)(function(t8) {
  var i6, o5 = t8.id, n7 = t8.value, r6 = t8.format, e8 = t8.enableChip, l4 = void 0 !== e8 && e8, a5 = t8.color, c3 = t8.renderContent, h2 = zt(), u2 = Ot(r6);
  if ("function" == typeof c3) i6 = c3();
  else {
    var f2 = n7;
    void 0 !== u2 && void 0 !== f2 && (f2 = u2(f2)), i6 = (0, import_jsx_runtime.jsxs)("div", { style: h2.tooltip.basic, children: [l4 && (0, import_jsx_runtime.jsx)(g, { color: a5, style: h2.tooltip.chip }), void 0 !== f2 ? (0, import_jsx_runtime.jsxs)("span", { children: [o5, ": ", (0, import_jsx_runtime.jsx)("strong", { children: "" + f2 })] }) : o5] });
  }
  return (0, import_jsx_runtime.jsx)("div", { style: h2.tooltip.container, children: i6 });
});
var T = { width: "100%", borderCollapse: "collapse" };
var C = (0, import_react.memo)(function(t8) {
  var i6, o5 = t8.title, n7 = t8.rows, r6 = void 0 === n7 ? [] : n7, e8 = t8.renderContent, l4 = zt();
  return r6.length ? (i6 = "function" == typeof e8 ? e8() : (0, import_jsx_runtime.jsxs)("div", { children: [o5 && o5, (0, import_jsx_runtime.jsx)("table", { style: v({}, T, l4.tooltip.table), children: (0, import_jsx_runtime.jsx)("tbody", { children: r6.map(function(t9, i7) {
    return (0, import_jsx_runtime.jsx)("tr", { children: t9.map(function(t10, i8) {
      return (0, import_jsx_runtime.jsx)("td", { style: l4.tooltip.tableCell, children: t10 }, i8);
    }) }, i7);
  }) }) })] }), (0, import_jsx_runtime.jsx)("div", { style: l4.tooltip.container, children: i6 })) : null;
});
C.displayName = "TableTooltip";
var E = (0, import_react.memo)(function(t8) {
  var i6 = t8.x0, n7 = t8.x1, r6 = t8.y0, e8 = t8.y1, l4 = zt(), u2 = Ur(), d3 = u2.animate, y4 = u2.config, f2 = (0, import_react.useMemo)(function() {
    return v({}, l4.crosshair.line, { pointerEvents: "none" });
  }, [l4.crosshair.line]), x3 = useSpring({ x1: i6, x2: n7, y1: r6, y2: e8, config: y4, immediate: !d3 });
  return (0, import_jsx_runtime.jsx)(animated.line, v({}, x3, { fill: "none", style: f2 }));
});
E.displayName = "CrosshairLine";
var P = (0, import_react.memo)(function(t8) {
  var i6, o5, n7 = t8.width, r6 = t8.height, e8 = t8.type, l4 = t8.x, a5 = t8.y;
  return "cross" === e8 ? (i6 = { x0: l4, x1: l4, y0: 0, y1: r6 }, o5 = { x0: 0, x1: n7, y0: a5, y1: a5 }) : "top-left" === e8 ? (i6 = { x0: l4, x1: l4, y0: 0, y1: a5 }, o5 = { x0: 0, x1: l4, y0: a5, y1: a5 }) : "top" === e8 ? i6 = { x0: l4, x1: l4, y0: 0, y1: a5 } : "top-right" === e8 ? (i6 = { x0: l4, x1: l4, y0: 0, y1: a5 }, o5 = { x0: l4, x1: n7, y0: a5, y1: a5 }) : "right" === e8 ? o5 = { x0: l4, x1: n7, y0: a5, y1: a5 } : "bottom-right" === e8 ? (i6 = { x0: l4, x1: l4, y0: a5, y1: r6 }, o5 = { x0: l4, x1: n7, y0: a5, y1: a5 }) : "bottom" === e8 ? i6 = { x0: l4, x1: l4, y0: a5, y1: r6 } : "bottom-left" === e8 ? (i6 = { x0: l4, x1: l4, y0: a5, y1: r6 }, o5 = { x0: 0, x1: l4, y0: a5, y1: a5 }) : "left" === e8 ? o5 = { x0: 0, x1: l4, y0: a5, y1: a5 } : "x" === e8 ? i6 = { x0: l4, x1: l4, y0: 0, y1: r6 } : "y" === e8 && (o5 = { x0: 0, x1: n7, y0: a5, y1: a5 }), (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [i6 && (0, import_jsx_runtime.jsx)(E, { x0: i6.x0, x1: i6.x1, y0: i6.y0, y1: i6.y1 }), o5 && (0, import_jsx_runtime.jsx)(E, { x0: o5.x0, x1: o5.x1, y0: o5.y0, y1: o5.y1 })] });
});
P.displayName = "Crosshair";
var j = (0, import_react.createContext)({ showTooltipAt: function() {
}, showTooltipFromEvent: function() {
}, hideTooltip: function() {
} });
var N = { isVisible: false, position: [null, null], content: null, anchor: null };
var O = (0, import_react.createContext)(N);
var V = function(t8) {
  var i6 = (0, import_react.useState)(N), n7 = i6[0], l4 = i6[1], a5 = (0, import_react.useCallback)(function(t9, i7, o5) {
    var n8 = i7[0], r6 = i7[1];
    void 0 === o5 && (o5 = "top"), l4({ isVisible: true, position: [n8, r6], anchor: o5, content: t9 });
  }, [l4]), c3 = (0, import_react.useCallback)(function(i7, o5, n8) {
    void 0 === n8 && (n8 = "top");
    var r6 = t8.current.getBoundingClientRect(), e8 = t8.current.offsetWidth, a6 = e8 === r6.width ? 1 : e8 / r6.width, c4 = "touches" in o5 ? o5.touches[0] : o5, s4 = c4.clientX, h2 = c4.clientY, u2 = (s4 - r6.left) * a6, d3 = (h2 - r6.top) * a6;
    "left" !== n8 && "right" !== n8 || (n8 = u2 < r6.width / 2 ? "right" : "left"), l4({ isVisible: true, position: [u2, d3], anchor: n8, content: i7 });
  }, [t8, l4]), s3 = (0, import_react.useCallback)(function() {
    l4(N);
  }, [l4]);
  return { actions: (0, import_react.useMemo)(function() {
    return { showTooltipAt: a5, showTooltipFromEvent: c3, hideTooltip: s3 };
  }, [a5, c3, s3]), state: n7 };
};
var k = function() {
  var t8 = (0, import_react.useContext)(j);
  if (void 0 === t8) throw new Error("useTooltip must be used within a TooltipProvider");
  return t8;
};
var z = function() {
  var t8 = (0, import_react.useContext)(O);
  if (void 0 === t8) throw new Error("useTooltipState must be used within a TooltipProvider");
  return t8;
};
var A = function(t8) {
  return t8.isVisible;
};
var F = function() {
  var t8 = z();
  return A(t8) ? (0, import_jsx_runtime.jsx)(b, { position: t8.position, anchor: t8.anchor, children: t8.content }) : null;
};
var M = function(t8) {
  var i6 = t8.container, o5 = t8.children, n7 = V(i6), r6 = n7.actions, e8 = n7.state;
  return (0, import_jsx_runtime.jsx)(j.Provider, { value: r6, children: (0, import_jsx_runtime.jsx)(O.Provider, { value: e8, children: o5 }) });
};

// node_modules/@nivo/heatmap/node_modules/@nivo/core/dist/nivo-core.es.js
var import_merge = __toESM(require_merge());
var import_get = __toESM(require_get());
var import_set = __toESM(require_set());
var import_isString = __toESM(require_isString());
var import_jsx_runtime2 = __toESM(require_jsx_runtime());
var import_last = __toESM(require_last());
var import_isArray = __toESM(require_isArray());
var import_isFunction = __toESM(require_isFunction());
var import_without = __toESM(require_without());

// node_modules/@nivo/heatmap/node_modules/d3-format/src/formatDecimal.js
function formatDecimal_default(x3) {
  return Math.abs(x3 = Math.round(x3)) >= 1e21 ? x3.toLocaleString("en").replace(/,/g, "") : x3.toString(10);
}
function formatDecimalParts(x3, p5) {
  if ((i6 = (x3 = p5 ? x3.toExponential(p5 - 1) : x3.toExponential()).indexOf("e")) < 0) return null;
  var i6, coefficient = x3.slice(0, i6);
  return [
    coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
    +x3.slice(i6 + 1)
  ];
}

// node_modules/@nivo/heatmap/node_modules/d3-format/src/exponent.js
function exponent_default(x3) {
  return x3 = formatDecimalParts(Math.abs(x3)), x3 ? x3[1] : NaN;
}

// node_modules/@nivo/heatmap/node_modules/d3-format/src/formatGroup.js
function formatGroup_default(grouping, thousands) {
  return function(value, width) {
    var i6 = value.length, t8 = [], j5 = 0, g5 = grouping[0], length = 0;
    while (i6 > 0 && g5 > 0) {
      if (length + g5 + 1 > width) g5 = Math.max(1, width - length);
      t8.push(value.substring(i6 -= g5, i6 + g5));
      if ((length += g5 + 1) > width) break;
      g5 = grouping[j5 = (j5 + 1) % grouping.length];
    }
    return t8.reverse().join(thousands);
  };
}

// node_modules/@nivo/heatmap/node_modules/d3-format/src/formatNumerals.js
function formatNumerals_default(numerals) {
  return function(value) {
    return value.replace(/[0-9]/g, function(i6) {
      return numerals[+i6];
    });
  };
}

// node_modules/@nivo/heatmap/node_modules/d3-format/src/formatSpecifier.js
var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
function formatSpecifier(specifier) {
  if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
  var match;
  return new FormatSpecifier({
    fill: match[1],
    align: match[2],
    sign: match[3],
    symbol: match[4],
    zero: match[5],
    width: match[6],
    comma: match[7],
    precision: match[8] && match[8].slice(1),
    trim: match[9],
    type: match[10]
  });
}
formatSpecifier.prototype = FormatSpecifier.prototype;
function FormatSpecifier(specifier) {
  this.fill = specifier.fill === void 0 ? " " : specifier.fill + "";
  this.align = specifier.align === void 0 ? ">" : specifier.align + "";
  this.sign = specifier.sign === void 0 ? "-" : specifier.sign + "";
  this.symbol = specifier.symbol === void 0 ? "" : specifier.symbol + "";
  this.zero = !!specifier.zero;
  this.width = specifier.width === void 0 ? void 0 : +specifier.width;
  this.comma = !!specifier.comma;
  this.precision = specifier.precision === void 0 ? void 0 : +specifier.precision;
  this.trim = !!specifier.trim;
  this.type = specifier.type === void 0 ? "" : specifier.type + "";
}
FormatSpecifier.prototype.toString = function() {
  return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
};

// node_modules/@nivo/heatmap/node_modules/d3-format/src/formatTrim.js
function formatTrim_default(s3) {
  out: for (var n7 = s3.length, i6 = 1, i0 = -1, i1; i6 < n7; ++i6) {
    switch (s3[i6]) {
      case ".":
        i0 = i1 = i6;
        break;
      case "0":
        if (i0 === 0) i0 = i6;
        i1 = i6;
        break;
      default:
        if (!+s3[i6]) break out;
        if (i0 > 0) i0 = 0;
        break;
    }
  }
  return i0 > 0 ? s3.slice(0, i0) + s3.slice(i1 + 1) : s3;
}

// node_modules/@nivo/heatmap/node_modules/d3-format/src/formatPrefixAuto.js
var prefixExponent;
function formatPrefixAuto_default(x3, p5) {
  var d3 = formatDecimalParts(x3, p5);
  if (!d3) return x3 + "";
  var coefficient = d3[0], exponent = d3[1], i6 = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1, n7 = coefficient.length;
  return i6 === n7 ? coefficient : i6 > n7 ? coefficient + new Array(i6 - n7 + 1).join("0") : i6 > 0 ? coefficient.slice(0, i6) + "." + coefficient.slice(i6) : "0." + new Array(1 - i6).join("0") + formatDecimalParts(x3, Math.max(0, p5 + i6 - 1))[0];
}

// node_modules/@nivo/heatmap/node_modules/d3-format/src/formatRounded.js
function formatRounded_default(x3, p5) {
  var d3 = formatDecimalParts(x3, p5);
  if (!d3) return x3 + "";
  var coefficient = d3[0], exponent = d3[1];
  return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1) : coefficient + new Array(exponent - coefficient.length + 2).join("0");
}

// node_modules/@nivo/heatmap/node_modules/d3-format/src/formatTypes.js
var formatTypes_default = {
  "%": function(x3, p5) {
    return (x3 * 100).toFixed(p5);
  },
  "b": function(x3) {
    return Math.round(x3).toString(2);
  },
  "c": function(x3) {
    return x3 + "";
  },
  "d": formatDecimal_default,
  "e": function(x3, p5) {
    return x3.toExponential(p5);
  },
  "f": function(x3, p5) {
    return x3.toFixed(p5);
  },
  "g": function(x3, p5) {
    return x3.toPrecision(p5);
  },
  "o": function(x3) {
    return Math.round(x3).toString(8);
  },
  "p": function(x3, p5) {
    return formatRounded_default(x3 * 100, p5);
  },
  "r": formatRounded_default,
  "s": formatPrefixAuto_default,
  "X": function(x3) {
    return Math.round(x3).toString(16).toUpperCase();
  },
  "x": function(x3) {
    return Math.round(x3).toString(16);
  }
};

// node_modules/@nivo/heatmap/node_modules/d3-format/src/identity.js
function identity_default(x3) {
  return x3;
}

// node_modules/@nivo/heatmap/node_modules/d3-format/src/locale.js
var map = Array.prototype.map;
var prefixes2 = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
function locale_default(locale2) {
  var group = locale2.grouping === void 0 || locale2.thousands === void 0 ? identity_default : formatGroup_default(map.call(locale2.grouping, Number), locale2.thousands + ""), currencyPrefix = locale2.currency === void 0 ? "" : locale2.currency[0] + "", currencySuffix = locale2.currency === void 0 ? "" : locale2.currency[1] + "", decimal = locale2.decimal === void 0 ? "." : locale2.decimal + "", numerals = locale2.numerals === void 0 ? identity_default : formatNumerals_default(map.call(locale2.numerals, String)), percent = locale2.percent === void 0 ? "%" : locale2.percent + "", minus = locale2.minus === void 0 ? "-" : locale2.minus + "", nan = locale2.nan === void 0 ? "NaN" : locale2.nan + "";
  function newFormat(specifier) {
    specifier = formatSpecifier(specifier);
    var fill = specifier.fill, align = specifier.align, sign = specifier.sign, symbol = specifier.symbol, zero = specifier.zero, width = specifier.width, comma = specifier.comma, precision = specifier.precision, trim = specifier.trim, type = specifier.type;
    if (type === "n") comma = true, type = "g";
    else if (!formatTypes_default[type]) precision === void 0 && (precision = 12), trim = true, type = "g";
    if (zero || fill === "0" && align === "=") zero = true, fill = "0", align = "=";
    var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "", suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : "";
    var formatType = formatTypes_default[type], maybeSuffix = /[defgprs%]/.test(type);
    precision = precision === void 0 ? 6 : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision)) : Math.max(0, Math.min(20, precision));
    function format2(value) {
      var valuePrefix = prefix, valueSuffix = suffix, i6, n7, c3;
      if (type === "c") {
        valueSuffix = formatType(value) + valueSuffix;
        value = "";
      } else {
        value = +value;
        var valueNegative = value < 0 || 1 / value < 0;
        value = isNaN(value) ? nan : formatType(Math.abs(value), precision);
        if (trim) value = formatTrim_default(value);
        if (valueNegative && +value === 0 && sign !== "+") valueNegative = false;
        valuePrefix = (valueNegative ? sign === "(" ? sign : minus : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
        valueSuffix = (type === "s" ? prefixes2[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");
        if (maybeSuffix) {
          i6 = -1, n7 = value.length;
          while (++i6 < n7) {
            if (c3 = value.charCodeAt(i6), 48 > c3 || c3 > 57) {
              valueSuffix = (c3 === 46 ? decimal + value.slice(i6 + 1) : value.slice(i6)) + valueSuffix;
              value = value.slice(0, i6);
              break;
            }
          }
        }
      }
      if (comma && !zero) value = group(value, Infinity);
      var length = valuePrefix.length + value.length + valueSuffix.length, padding = length < width ? new Array(width - length + 1).join(fill) : "";
      if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";
      switch (align) {
        case "<":
          value = valuePrefix + value + valueSuffix + padding;
          break;
        case "=":
          value = valuePrefix + padding + value + valueSuffix;
          break;
        case "^":
          value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);
          break;
        default:
          value = padding + valuePrefix + value + valueSuffix;
          break;
      }
      return numerals(value);
    }
    format2.toString = function() {
      return specifier + "";
    };
    return format2;
  }
  function formatPrefix2(specifier, value) {
    var f2 = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)), e8 = Math.max(-8, Math.min(8, Math.floor(exponent_default(value) / 3))) * 3, k4 = Math.pow(10, -e8), prefix = prefixes2[8 + e8 / 3];
    return function(value2) {
      return f2(k4 * value2) + prefix;
    };
  }
  return {
    format: newFormat,
    formatPrefix: formatPrefix2
  };
}

// node_modules/@nivo/heatmap/node_modules/d3-format/src/defaultLocale.js
var locale;
var format;
var formatPrefix;
defaultLocale({
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["$", ""],
  minus: "-"
});
function defaultLocale(definition) {
  locale = locale_default(definition);
  format = locale.format;
  formatPrefix = locale.formatPrefix;
  return locale;
}

// node_modules/@nivo/heatmap/node_modules/@nivo/core/dist/nivo-core.es.js
var import_isPlainObject = __toESM(require_isPlainObject());
var import_pick = __toESM(require_pick());
var import_isEqual = __toESM(require_isEqual());
var Pr = { background: "transparent", text: { fontFamily: "sans-serif", fontSize: 11, fill: "#333333", outlineWidth: 0, outlineColor: "transparent", outlineOpacity: 1 }, axis: { domain: { line: { stroke: "transparent", strokeWidth: 1 } }, ticks: { line: { stroke: "#777777", strokeWidth: 1 }, text: {} }, legend: { text: { fontSize: 12 } } }, grid: { line: { stroke: "#dddddd", strokeWidth: 1 } }, legends: { hidden: { symbol: { fill: "#333333", opacity: 0.6 }, text: { fill: "#333333", opacity: 0.6 } }, text: {}, ticks: { line: { stroke: "#777777", strokeWidth: 1 }, text: { fontSize: 10 } }, title: { text: {} } }, labels: { text: {} }, markers: { lineColor: "#000000", lineStrokeWidth: 1, text: {} }, dots: { text: {} }, tooltip: { container: { background: "white", color: "inherit", fontSize: "inherit", borderRadius: "2px", boxShadow: "0 1px 2px rgba(0, 0, 0, 0.25)", padding: "5px 9px" }, basic: { whiteSpace: "pre", display: "flex", alignItems: "center" }, chip: { marginRight: 7 }, table: {}, tableCell: { padding: "3px 5px" }, tableCellValue: { fontWeight: "bold" } }, crosshair: { line: { stroke: "#000000", strokeWidth: 1, strokeOpacity: 0.75, strokeDasharray: "6 6" } }, annotations: { text: { fontSize: 13, outlineWidth: 2, outlineColor: "#ffffff", outlineOpacity: 1 }, link: { stroke: "#000000", strokeWidth: 1, outlineWidth: 2, outlineColor: "#ffffff", outlineOpacity: 1 }, outline: { fill: "none", stroke: "#000000", strokeWidth: 2, outlineWidth: 2, outlineColor: "#ffffff", outlineOpacity: 1 }, symbol: { fill: "#000000", outlineWidth: 2, outlineColor: "#ffffff", outlineOpacity: 1 } } };
function jr() {
  return jr = Object.assign ? Object.assign.bind() : function(e8) {
    for (var r6 = 1; r6 < arguments.length; r6++) {
      var t8 = arguments[r6];
      for (var n7 in t8) Object.prototype.hasOwnProperty.call(t8, n7) && (e8[n7] = t8[n7]);
    }
    return e8;
  }, jr.apply(this, arguments);
}
function Br(e8, r6) {
  if (null == e8) return {};
  var t8, n7, i6 = {}, o5 = Object.keys(e8);
  for (n7 = 0; n7 < o5.length; n7++) t8 = o5[n7], r6.indexOf(t8) >= 0 || (i6[t8] = e8[t8]);
  return i6;
}
var Gr = ["axis.ticks.text", "axis.legend.text", "legends.title.text", "legends.text", "legends.ticks.text", "legends.title.text", "labels.text", "dots.text", "markers.text", "annotations.text"];
var Lr = function(e8, r6) {
  return jr({}, r6, e8);
};
var Ir = function(e8, r6) {
  var t8 = (0, import_merge.default)({}, e8, r6);
  return Gr.forEach(function(e9) {
    (0, import_set.default)(t8, e9, Lr((0, import_get.default)(t8, e9), t8.text));
  }), t8;
};
var Yr = (0, import_react2.createContext)();
var Ar = function(e8) {
  var t8 = e8.children, n7 = e8.animate, i6 = void 0 === n7 || n7, o5 = e8.config, l4 = void 0 === o5 ? "default" : o5, a5 = (0, import_react2.useMemo)(function() {
    var e9 = (0, import_isString.default)(l4) ? config[l4] : l4;
    return { animate: i6, config: e9 };
  }, [i6, l4]);
  return (0, import_jsx_runtime2.jsx)(Yr.Provider, { value: a5, children: t8 });
};
var Er = { animate: import_prop_types.default.bool, motionConfig: import_prop_types.default.oneOfType([import_prop_types.default.oneOf(Object.keys(config)), import_prop_types.default.shape({ mass: import_prop_types.default.number, tension: import_prop_types.default.number, friction: import_prop_types.default.number, clamp: import_prop_types.default.bool, precision: import_prop_types.default.number, velocity: import_prop_types.default.number, duration: import_prop_types.default.number, easing: import_prop_types.default.func })]) };
Ar.propTypes = { children: import_prop_types.default.node.isRequired, animate: Er.animate, config: Er.motionConfig };
var Ur = function() {
  return (0, import_react2.useContext)(Yr);
};
var Fr = function(e8) {
  var t8 = Ur(), o5 = t8.animate, l4 = t8.config, a5 = function(e9) {
    var r6 = (0, import_react2.useRef)();
    return (0, import_react2.useEffect)(function() {
      r6.current = e9;
    }, [e9]), r6.current;
  }(e8), d3 = (0, import_react2.useMemo)(function() {
    return string_default(a5, e8);
  }, [a5, e8]), s3 = useSpring({ from: { value: 0 }, to: { value: 1 }, reset: true, config: l4, immediate: !o5 }).value;
  return to(s3, d3);
};
var Xr = { nivo: ["#d76445", "#f47560", "#e8c1a0", "#97e3d5", "#61cdbb", "#00b0a7"], BrBG: (0, import_last.default)(scheme), PRGn: (0, import_last.default)(scheme2), PiYG: (0, import_last.default)(scheme3), PuOr: (0, import_last.default)(scheme4), RdBu: (0, import_last.default)(scheme5), RdGy: (0, import_last.default)(scheme6), RdYlBu: (0, import_last.default)(scheme7), RdYlGn: (0, import_last.default)(scheme8), spectral: (0, import_last.default)(scheme9), blues: (0, import_last.default)(scheme22), greens: (0, import_last.default)(scheme23), greys: (0, import_last.default)(scheme24), oranges: (0, import_last.default)(scheme27), purples: (0, import_last.default)(scheme25), reds: (0, import_last.default)(scheme26), BuGn: (0, import_last.default)(scheme10), BuPu: (0, import_last.default)(scheme11), GnBu: (0, import_last.default)(scheme12), OrRd: (0, import_last.default)(scheme13), PuBuGn: (0, import_last.default)(scheme14), PuBu: (0, import_last.default)(scheme15), PuRd: (0, import_last.default)(scheme16), RdPu: (0, import_last.default)(scheme17), YlGnBu: (0, import_last.default)(scheme18), YlGn: (0, import_last.default)(scheme19), YlOrBr: (0, import_last.default)(scheme20), YlOrRd: (0, import_last.default)(scheme21) };
var Nr = Object.keys(Xr);
var Kr = { nivo: ["#e8c1a0", "#f47560", "#f1e15b", "#e8a838", "#61cdbb", "#97e3d5"], category10: category10_default, accent: Accent_default, dark2: Dark2_default, paired: Paired_default, pastel1: Pastel1_default, pastel2: Pastel2_default, set1: Set1_default, set2: Set2_default, set3: Set3_default, brown_blueGreen: (0, import_last.default)(scheme), purpleRed_green: (0, import_last.default)(scheme2), pink_yellowGreen: (0, import_last.default)(scheme3), purple_orange: (0, import_last.default)(scheme4), red_blue: (0, import_last.default)(scheme5), red_grey: (0, import_last.default)(scheme6), red_yellow_blue: (0, import_last.default)(scheme7), red_yellow_green: (0, import_last.default)(scheme8), spectral: (0, import_last.default)(scheme9), blues: (0, import_last.default)(scheme22), greens: (0, import_last.default)(scheme23), greys: (0, import_last.default)(scheme24), oranges: (0, import_last.default)(scheme27), purples: (0, import_last.default)(scheme25), reds: (0, import_last.default)(scheme26), blue_green: (0, import_last.default)(scheme10), blue_purple: (0, import_last.default)(scheme11), green_blue: (0, import_last.default)(scheme12), orange_red: (0, import_last.default)(scheme13), purple_blue_green: (0, import_last.default)(scheme14), purple_blue: (0, import_last.default)(scheme15), purple_red: (0, import_last.default)(scheme16), red_purple: (0, import_last.default)(scheme17), yellow_green_blue: (0, import_last.default)(scheme18), yellow_green: (0, import_last.default)(scheme19), yellow_orange_brown: (0, import_last.default)(scheme20), yellow_orange_red: (0, import_last.default)(scheme21) };
var et = import_prop_types.default.oneOfType([import_prop_types.default.oneOf(Nr), import_prop_types.default.func, import_prop_types.default.arrayOf(import_prop_types.default.string)]);
var rt = { basis: basis_default, basisClosed: basisClosed_default, basisOpen: basisOpen_default, bundle: bundle_default, cardinal: cardinal_default, cardinalClosed: cardinalClosed_default, cardinalOpen: cardinalOpen_default, catmullRom: catmullRom_default, catmullRomClosed: catmullRomClosed_default, catmullRomOpen: catmullRomOpen_default, linear: linear_default, linearClosed: linearClosed_default, monotoneX, monotoneY, natural: natural_default, step: step_default, stepAfter, stepBefore };
var tt = Object.keys(rt);
var nt = tt.filter(function(e8) {
  return e8.endsWith("Closed");
});
var it = (0, import_without.default)(tt, "bundle", "basisClosed", "basisOpen", "cardinalClosed", "cardinalOpen", "catmullRomClosed", "catmullRomOpen", "linearClosed");
var ot = (0, import_without.default)(tt, "bundle", "basisClosed", "basisOpen", "cardinalClosed", "cardinalOpen", "catmullRomClosed", "catmullRomOpen", "linearClosed");
var at = { ascending: ascending_default, descending: descending_default, insideOut: insideOut_default, none: none_default2, reverse: reverse_default };
var dt = Object.keys(at);
var ut = { expand: expand_default, diverging: diverging_default, none: none_default, silhouette: silhouette_default, wiggle: wiggle_default };
var ct = Object.keys(ut);
var pt = import_prop_types.default.shape({ top: import_prop_types.default.number, right: import_prop_types.default.number, bottom: import_prop_types.default.number, left: import_prop_types.default.number }).isRequired;
var ht = ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"];
var gt = import_prop_types.default.oneOf(ht);
var vt = ordinal(Set3_default);
var _t = { top: 0, right: 0, bottom: 0, left: 0 };
var wt = function(e8, t8, n7) {
  return void 0 === n7 && (n7 = {}), (0, import_react2.useMemo)(function() {
    var r6 = jr({}, _t, n7);
    return { margin: r6, innerWidth: e8 - r6.left - r6.right, innerHeight: t8 - r6.top - r6.bottom, outerWidth: e8, outerHeight: t8 };
  }, [e8, t8, n7.top, n7.right, n7.bottom, n7.left]);
};
var kt = function() {
  var e8 = (0, import_react2.useRef)(null), r6 = (0, import_react2.useState)({ left: 0, top: 0, width: 0, height: 0 }), t8 = r6[0], l4 = r6[1], a5 = (0, import_react2.useState)(function() {
    return "undefined" == typeof ResizeObserver ? null : new ResizeObserver(function(e9) {
      var r7 = e9[0];
      return l4(r7.contentRect);
    });
  })[0];
  return (0, import_react2.useEffect)(function() {
    return e8.current && null !== a5 && a5.observe(e8.current), function() {
      null !== a5 && a5.disconnect();
    };
  }, []), [e8, t8];
};
var Rt = function(e8) {
  return (0, import_react2.useMemo)(function() {
    return Ir(Pr, e8);
  }, [e8]);
};
var xt = function(e8) {
  return "function" == typeof e8 ? e8 : "string" == typeof e8 ? 0 === e8.indexOf("time:") ? timeFormat(e8.slice("5")) : format(e8) : function(e9) {
    return "" + e9;
  };
};
var Ot = function(e8) {
  return (0, import_react2.useMemo)(function() {
    return xt(e8);
  }, [e8]);
};
var qt = (0, import_react2.createContext)();
var Ct = {};
var Wt = function(e8) {
  var r6 = e8.theme, t8 = void 0 === r6 ? Ct : r6, n7 = e8.children, i6 = Rt(t8);
  return (0, import_jsx_runtime2.jsx)(qt.Provider, { value: i6, children: n7 });
};
Wt.propTypes = { children: import_prop_types.default.node.isRequired, theme: import_prop_types.default.object };
var zt = function() {
  return (0, import_react2.useContext)(qt);
};
var Tt = ["outlineWidth", "outlineColor", "outlineOpacity"];
var Mt = function(e8) {
  return e8.outlineWidth, e8.outlineColor, e8.outlineOpacity, Br(e8, Tt);
};
var Pt = function(e8) {
  var r6 = e8.children, t8 = e8.condition, n7 = e8.wrapper;
  return t8 ? (0, import_react2.cloneElement)(n7, {}, r6) : r6;
};
Pt.propTypes = { children: import_prop_types.default.node.isRequired, condition: import_prop_types.default.bool.isRequired, wrapper: import_prop_types.default.element.isRequired };
var jt = { position: "relative" };
var St = function(e8) {
  var r6 = e8.children, t8 = e8.theme, i6 = e8.renderWrapper, o5 = void 0 === i6 || i6, l4 = e8.isInteractive, a5 = void 0 === l4 || l4, d3 = e8.animate, s3 = e8.motionConfig, u2 = (0, import_react2.useRef)(null);
  return (0, import_jsx_runtime2.jsx)(Wt, { theme: t8, children: (0, import_jsx_runtime2.jsx)(Ar, { animate: d3, config: s3, children: (0, import_jsx_runtime2.jsx)(M, { container: u2, children: (0, import_jsx_runtime2.jsxs)(Pt, { condition: o5, wrapper: (0, import_jsx_runtime2.jsx)("div", { style: jt, ref: u2 }), children: [r6, a5 && (0, import_jsx_runtime2.jsx)(F, {})] }) }) }) });
};
St.propTypes = { children: import_prop_types.default.element.isRequired, isInteractive: import_prop_types.default.bool, renderWrapper: import_prop_types.default.bool, theme: import_prop_types.default.object, animate: import_prop_types.default.bool, motionConfig: import_prop_types.default.oneOfType([import_prop_types.default.string, Er.motionConfig]) };
var Bt = function() {
};
var Gt = { position: "relative" };
var Lt = function(e8) {
  var t8 = e8.children, i6 = e8.theme, o5 = e8.isInteractive, l4 = void 0 === o5 || o5, d3 = e8.renderWrapper, s3 = void 0 === d3 || d3, u2 = e8.animate, c3 = e8.motionConfig, f2 = (0, import_react2.useRef)(null), m4 = V(f2), y4 = m4.actions, v5 = m4.state, _2 = (0, import_react2.useCallback)(function(e9, r6) {
    return y4.showTooltipFromEvent(e9, r6);
  }, [y4.showTooltipFromEvent]), w4 = (0, import_react2.useMemo)(function() {
    return { showTooltip: l4 ? _2 : Bt, hideTooltip: l4 ? y4.hideTooltip : Bt };
  }, [y4.hideTooltip, l4, _2]);
  return (0, import_jsx_runtime2.jsx)(Wt, { theme: i6, children: (0, import_jsx_runtime2.jsx)(Ar, { animate: u2, config: c3, children: (0, import_jsx_runtime2.jsx)(j.Provider, { value: y4, children: (0, import_jsx_runtime2.jsx)(O.Provider, { value: v5, children: (0, import_jsx_runtime2.jsxs)(Pt, { condition: s3, wrapper: (0, import_jsx_runtime2.jsx)("div", { style: Gt, ref: f2 }), children: [t8(w4), l4 && (0, import_jsx_runtime2.jsx)(F, {})] }) }) }) }) });
};
Lt.propTypes = { children: import_prop_types.default.func.isRequired, isInteractive: import_prop_types.default.bool, renderWrapper: import_prop_types.default.bool, theme: import_prop_types.default.object.isRequired, animate: import_prop_types.default.bool.isRequired, motionConfig: import_prop_types.default.oneOfType([import_prop_types.default.string, Er.motionConfig]) };
var It = function(e8) {
  var r6 = e8.children, t8 = kt(), n7 = t8[0], i6 = t8[1], o5 = i6.width > 0 && i6.height > 0;
  return (0, import_jsx_runtime2.jsx)("div", { ref: n7, style: { width: "100%", height: "100%" }, children: o5 && r6({ width: i6.width, height: i6.height }) });
};
It.propTypes = { children: import_prop_types.default.func.isRequired };
var Yt = ["id", "colors"];
var Dt = function(e8) {
  var r6 = e8.id, t8 = e8.colors, n7 = Br(e8, Yt);
  return (0, import_jsx_runtime2.jsx)("linearGradient", jr({ id: r6, x1: 0, x2: 0, y1: 0, y2: 1 }, n7, { children: t8.map(function(e9) {
    var r7 = e9.offset, t9 = e9.color, n8 = e9.opacity;
    return (0, import_jsx_runtime2.jsx)("stop", { offset: r7 + "%", stopColor: t9, stopOpacity: void 0 !== n8 ? n8 : 1 }, r7);
  }) }));
};
Dt.propTypes = { id: import_prop_types.default.string.isRequired, colors: import_prop_types.default.arrayOf(import_prop_types.default.shape({ offset: import_prop_types.default.number.isRequired, color: import_prop_types.default.string.isRequired, opacity: import_prop_types.default.number })).isRequired, gradientTransform: import_prop_types.default.string };
var Et = { linearGradient: Dt };
var Ut = { color: "#000000", background: "#ffffff", size: 4, padding: 4, stagger: false };
var Ft = (0, import_react2.memo)(function(e8) {
  var r6 = e8.id, t8 = e8.background, n7 = void 0 === t8 ? Ut.background : t8, i6 = e8.color, o5 = void 0 === i6 ? Ut.color : i6, l4 = e8.size, a5 = void 0 === l4 ? Ut.size : l4, d3 = e8.padding, s3 = void 0 === d3 ? Ut.padding : d3, u2 = e8.stagger, c3 = void 0 === u2 ? Ut.stagger : u2, f2 = a5 + s3, p5 = a5 / 2, h2 = s3 / 2;
  return true === c3 && (f2 = 2 * a5 + 2 * s3), (0, import_jsx_runtime2.jsxs)("pattern", { id: r6, width: f2, height: f2, patternUnits: "userSpaceOnUse", children: [(0, import_jsx_runtime2.jsx)("rect", { width: f2, height: f2, fill: n7 }), (0, import_jsx_runtime2.jsx)("circle", { cx: h2 + p5, cy: h2 + p5, r: p5, fill: o5 }), c3 && (0, import_jsx_runtime2.jsx)("circle", { cx: 1.5 * s3 + a5 + p5, cy: 1.5 * s3 + a5 + p5, r: p5, fill: o5 })] });
});
Ft.displayName = "PatternDots", Ft.propTypes = { id: import_prop_types.default.string.isRequired, color: import_prop_types.default.string.isRequired, background: import_prop_types.default.string.isRequired, size: import_prop_types.default.number.isRequired, padding: import_prop_types.default.number.isRequired, stagger: import_prop_types.default.bool.isRequired };
var Nt = 2 * Math.PI;
var Ht = function(e8) {
  return e8 * Math.PI / 180;
};
var Kt = function(e8) {
  return 180 * e8 / Math.PI;
};
var Jt = function(e8, r6) {
  return { x: Math.cos(e8) * r6, y: Math.sin(e8) * r6 };
};
var Qt = function(e8) {
  var r6 = e8 % 360;
  return r6 < 0 && (r6 += 360), r6;
};
var rn = { svg: { align: { left: "start", center: "middle", right: "end", start: "start", middle: "middle", end: "end" }, baseline: { top: "text-before-edge", center: "central", bottom: "alphabetic" } }, canvas: { align: { left: "left", center: "center", right: "right", start: "left", middle: "center", end: "right" }, baseline: { top: "top", center: "middle", bottom: "bottom" } } };
var nn = { spacing: 5, rotation: 0, background: "#000000", color: "#ffffff", lineWidth: 2 };
var on = (0, import_react2.memo)(function(e8) {
  var r6 = e8.id, t8 = e8.spacing, n7 = void 0 === t8 ? nn.spacing : t8, i6 = e8.rotation, o5 = void 0 === i6 ? nn.rotation : i6, l4 = e8.background, a5 = void 0 === l4 ? nn.background : l4, d3 = e8.color, s3 = void 0 === d3 ? nn.color : d3, u2 = e8.lineWidth, c3 = void 0 === u2 ? nn.lineWidth : u2, f2 = Math.round(o5) % 360, p5 = Math.abs(n7);
  f2 > 180 ? f2 -= 360 : f2 > 90 ? f2 -= 180 : f2 < -180 ? f2 += 360 : f2 < -90 && (f2 += 180);
  var h2, g5 = p5, b5 = p5;
  return 0 === f2 ? h2 = "\n                M 0 0 L " + g5 + " 0\n                M 0 " + b5 + " L " + g5 + " " + b5 + "\n            " : 90 === f2 ? h2 = "\n                M 0 0 L 0 " + b5 + "\n                M " + g5 + " 0 L " + g5 + " " + b5 + "\n            " : (g5 = Math.abs(p5 / Math.sin(Ht(f2))), b5 = p5 / Math.sin(Ht(90 - f2)), h2 = f2 > 0 ? "\n                    M 0 " + -b5 + " L " + 2 * g5 + " " + b5 + "\n                    M " + -g5 + " " + -b5 + " L " + g5 + " " + b5 + "\n                    M " + -g5 + " 0 L " + g5 + " " + 2 * b5 + "\n                " : "\n                    M " + -g5 + " " + b5 + " L " + g5 + " " + -b5 + "\n                    M " + -g5 + " " + 2 * b5 + " L " + 2 * g5 + " " + -b5 + "\n                    M 0 " + 2 * b5 + " L " + 2 * g5 + " 0\n                "), (0, import_jsx_runtime2.jsxs)("pattern", { id: r6, width: g5, height: b5, patternUnits: "userSpaceOnUse", children: [(0, import_jsx_runtime2.jsx)("rect", { width: g5, height: b5, fill: a5, stroke: "rgba(255, 0, 0, 0.1)", strokeWidth: 0 }), (0, import_jsx_runtime2.jsx)("path", { d: h2, strokeWidth: c3, stroke: s3, strokeLinecap: "square" })] });
});
on.displayName = "PatternLines", on.propTypes = { id: import_prop_types.default.string.isRequired, spacing: import_prop_types.default.number.isRequired, rotation: import_prop_types.default.number.isRequired, background: import_prop_types.default.string.isRequired, color: import_prop_types.default.string.isRequired, lineWidth: import_prop_types.default.number.isRequired };
var an = { color: "#000000", background: "#ffffff", size: 4, padding: 4, stagger: false };
var dn = (0, import_react2.memo)(function(e8) {
  var r6 = e8.id, t8 = e8.color, n7 = void 0 === t8 ? an.color : t8, i6 = e8.background, o5 = void 0 === i6 ? an.background : i6, l4 = e8.size, a5 = void 0 === l4 ? an.size : l4, d3 = e8.padding, s3 = void 0 === d3 ? an.padding : d3, u2 = e8.stagger, c3 = void 0 === u2 ? an.stagger : u2, f2 = a5 + s3, p5 = s3 / 2;
  return true === c3 && (f2 = 2 * a5 + 2 * s3), (0, import_jsx_runtime2.jsxs)("pattern", { id: r6, width: f2, height: f2, patternUnits: "userSpaceOnUse", children: [(0, import_jsx_runtime2.jsx)("rect", { width: f2, height: f2, fill: o5 }), (0, import_jsx_runtime2.jsx)("rect", { x: p5, y: p5, width: a5, height: a5, fill: n7 }), c3 && (0, import_jsx_runtime2.jsx)("rect", { x: 1.5 * s3 + a5, y: 1.5 * s3 + a5, width: a5, height: a5, fill: n7 })] });
});
dn.displayName = "PatternSquares", dn.propTypes = { id: import_prop_types.default.string.isRequired, color: import_prop_types.default.string.isRequired, background: import_prop_types.default.string.isRequired, size: import_prop_types.default.number.isRequired, padding: import_prop_types.default.number.isRequired, stagger: import_prop_types.default.bool.isRequired };
var un = { patternDots: Ft, patternLines: on, patternSquares: dn };
var cn = ["type"];
var fn = jr({}, Et, un);
var pn = function(e8) {
  var r6 = e8.defs;
  return !r6 || r6.length < 1 ? null : (0, import_jsx_runtime2.jsx)("defs", { "aria-hidden": true, children: r6.map(function(e9) {
    var r7 = e9.type, t8 = Br(e9, cn);
    return fn[r7] ? (0, import_react2.createElement)(fn[r7], jr({ key: t8.id }, t8)) : null;
  }) });
};
pn.propTypes = { defs: import_prop_types.default.arrayOf(import_prop_types.default.shape({ type: import_prop_types.default.oneOf(Object.keys(fn)).isRequired, id: import_prop_types.default.string.isRequired })) };
var hn = (0, import_react2.memo)(pn);
var gn = function(e8) {
  var r6 = e8.width, t8 = e8.height, n7 = e8.margin, i6 = e8.defs, o5 = e8.children, l4 = e8.role, a5 = e8.ariaLabel, d3 = e8.ariaLabelledBy, s3 = e8.ariaDescribedBy, u2 = e8.isFocusable, c3 = zt();
  return (0, import_jsx_runtime2.jsxs)("svg", { xmlns: "http://www.w3.org/2000/svg", width: r6, height: t8, role: l4, "aria-label": a5, "aria-labelledby": d3, "aria-describedby": s3, focusable: u2, tabIndex: u2 ? 0 : void 0, children: [(0, import_jsx_runtime2.jsx)(hn, { defs: i6 }), (0, import_jsx_runtime2.jsx)("rect", { width: r6, height: t8, fill: c3.background }), (0, import_jsx_runtime2.jsx)("g", { transform: "translate(" + n7.left + "," + n7.top + ")", children: o5 })] });
};
gn.propTypes = { width: import_prop_types.default.number.isRequired, height: import_prop_types.default.number.isRequired, margin: import_prop_types.default.shape({ top: import_prop_types.default.number.isRequired, left: import_prop_types.default.number.isRequired }).isRequired, defs: import_prop_types.default.array, children: import_prop_types.default.oneOfType([import_prop_types.default.arrayOf(import_prop_types.default.node), import_prop_types.default.node]).isRequired, role: import_prop_types.default.string, isFocusable: import_prop_types.default.bool, ariaLabel: import_prop_types.default.string, ariaLabelledBy: import_prop_types.default.string, ariaDescribedBy: import_prop_types.default.string };
var bn = function(e8) {
  var r6 = e8.size, t8 = e8.color, n7 = e8.borderWidth, i6 = e8.borderColor;
  return (0, import_jsx_runtime2.jsx)("circle", { r: r6 / 2, fill: t8, stroke: i6, strokeWidth: n7, style: { pointerEvents: "none" } });
};
bn.propTypes = { size: import_prop_types.default.number.isRequired, color: import_prop_types.default.string.isRequired, borderWidth: import_prop_types.default.number.isRequired, borderColor: import_prop_types.default.string.isRequired };
var mn = (0, import_react2.memo)(bn);
var yn = function(e8) {
  var r6 = e8.x, t8 = e8.y, n7 = e8.symbol, i6 = void 0 === n7 ? mn : n7, o5 = e8.size, l4 = e8.datum, a5 = e8.color, d3 = e8.borderWidth, u2 = e8.borderColor, c3 = e8.label, f2 = e8.labelTextAnchor, p5 = void 0 === f2 ? "middle" : f2, h2 = e8.labelYOffset, g5 = void 0 === h2 ? -12 : h2, b5 = zt(), m4 = Ur(), y4 = m4.animate, v5 = m4.config, _2 = useSpring({ transform: "translate(" + r6 + ", " + t8 + ")", config: v5, immediate: !y4 });
  return (0, import_jsx_runtime2.jsxs)(animated.g, { transform: _2.transform, style: { pointerEvents: "none" }, children: [(0, import_react2.createElement)(i6, { size: o5, color: a5, datum: l4, borderWidth: d3, borderColor: u2 }), c3 && (0, import_jsx_runtime2.jsx)("text", { textAnchor: p5, y: g5, style: Mt(b5.dots.text), children: c3 })] });
};
yn.propTypes = { x: import_prop_types.default.number.isRequired, y: import_prop_types.default.number.isRequired, datum: import_prop_types.default.object.isRequired, size: import_prop_types.default.number.isRequired, color: import_prop_types.default.string.isRequired, borderWidth: import_prop_types.default.number.isRequired, borderColor: import_prop_types.default.string.isRequired, symbol: import_prop_types.default.oneOfType([import_prop_types.default.func, import_prop_types.default.object]), label: import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.number]), labelTextAnchor: import_prop_types.default.oneOf(["start", "middle", "end"]), labelYOffset: import_prop_types.default.number };
var vn = (0, import_react2.memo)(yn);
var _n = function(e8) {
  var r6 = e8.width, t8 = e8.height, n7 = e8.axis, i6 = e8.scale, o5 = e8.value, l4 = e8.lineStyle, a5 = e8.textStyle, d3 = e8.legend, s3 = e8.legendNode, u2 = e8.legendPosition, c3 = void 0 === u2 ? "top-right" : u2, f2 = e8.legendOffsetX, p5 = void 0 === f2 ? 14 : f2, h2 = e8.legendOffsetY, g5 = void 0 === h2 ? 14 : h2, b5 = e8.legendOrientation, m4 = void 0 === b5 ? "horizontal" : b5, y4 = zt(), v5 = 0, _2 = 0, w4 = 0, k4 = 0;
  if ("y" === n7 ? (w4 = i6(o5), _2 = r6) : (v5 = i6(o5), k4 = t8), d3 && !s3) {
    var R3 = function(e9) {
      var r7 = e9.axis, t9 = e9.width, n8 = e9.height, i7 = e9.position, o6 = e9.offsetX, l5 = e9.offsetY, a6 = e9.orientation, d4 = 0, s4 = 0, u3 = "vertical" === a6 ? -90 : 0, c4 = "start";
      if ("x" === r7) switch (i7) {
        case "top-left":
          d4 = -o6, s4 = l5, c4 = "end";
          break;
        case "top":
          s4 = -l5, c4 = "horizontal" === a6 ? "middle" : "start";
          break;
        case "top-right":
          d4 = o6, s4 = l5, c4 = "horizontal" === a6 ? "start" : "end";
          break;
        case "right":
          d4 = o6, s4 = n8 / 2, c4 = "horizontal" === a6 ? "start" : "middle";
          break;
        case "bottom-right":
          d4 = o6, s4 = n8 - l5, c4 = "start";
          break;
        case "bottom":
          s4 = n8 + l5, c4 = "horizontal" === a6 ? "middle" : "end";
          break;
        case "bottom-left":
          s4 = n8 - l5, d4 = -o6, c4 = "horizontal" === a6 ? "end" : "start";
          break;
        case "left":
          d4 = -o6, s4 = n8 / 2, c4 = "horizontal" === a6 ? "end" : "middle";
      }
      else switch (i7) {
        case "top-left":
          d4 = o6, s4 = -l5, c4 = "start";
          break;
        case "top":
          d4 = t9 / 2, s4 = -l5, c4 = "horizontal" === a6 ? "middle" : "start";
          break;
        case "top-right":
          d4 = t9 - o6, s4 = -l5, c4 = "horizontal" === a6 ? "end" : "start";
          break;
        case "right":
          d4 = t9 + o6, c4 = "horizontal" === a6 ? "start" : "middle";
          break;
        case "bottom-right":
          d4 = t9 - o6, s4 = l5, c4 = "end";
          break;
        case "bottom":
          d4 = t9 / 2, s4 = l5, c4 = "horizontal" === a6 ? "middle" : "end";
          break;
        case "bottom-left":
          d4 = o6, s4 = l5, c4 = "horizontal" === a6 ? "start" : "end";
          break;
        case "left":
          d4 = -o6, c4 = "horizontal" === a6 ? "end" : "middle";
      }
      return { x: d4, y: s4, rotation: u3, textAnchor: c4 };
    }({ axis: n7, width: r6, height: t8, position: c3, offsetX: p5, offsetY: g5, orientation: m4 });
    s3 = (0, import_jsx_runtime2.jsx)("text", { transform: "translate(" + R3.x + ", " + R3.y + ") rotate(" + R3.rotation + ")", textAnchor: R3.textAnchor, dominantBaseline: "central", style: a5, children: d3 });
  }
  return (0, import_jsx_runtime2.jsxs)("g", { transform: "translate(" + v5 + ", " + w4 + ")", children: [(0, import_jsx_runtime2.jsx)("line", { x1: 0, x2: _2, y1: 0, y2: k4, stroke: y4.markers.lineColor, strokeWidth: y4.markers.lineStrokeWidth, style: l4 }), s3] });
};
_n.propTypes = { width: import_prop_types.default.number.isRequired, height: import_prop_types.default.number.isRequired, axis: import_prop_types.default.oneOf(["x", "y"]).isRequired, scale: import_prop_types.default.func.isRequired, value: import_prop_types.default.oneOfType([import_prop_types.default.number, import_prop_types.default.string, import_prop_types.default.instanceOf(Date)]).isRequired, lineStyle: import_prop_types.default.object, textStyle: import_prop_types.default.object, legend: import_prop_types.default.string, legendPosition: import_prop_types.default.oneOf(["top-left", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left"]), legendOffsetX: import_prop_types.default.number.isRequired, legendOffsetY: import_prop_types.default.number.isRequired, legendOrientation: import_prop_types.default.oneOf(["horizontal", "vertical"]).isRequired };
var wn = (0, import_react2.memo)(_n);
var kn = function(e8) {
  var r6 = e8.markers, t8 = e8.width, n7 = e8.height, i6 = e8.xScale, o5 = e8.yScale;
  return r6 && 0 !== r6.length ? r6.map(function(e9, r7) {
    return (0, import_jsx_runtime2.jsx)(wn, jr({}, e9, { width: t8, height: n7, scale: "y" === e9.axis ? o5 : i6 }), r7);
  }) : null;
};
kn.propTypes = { width: import_prop_types.default.number.isRequired, height: import_prop_types.default.number.isRequired, xScale: import_prop_types.default.func.isRequired, yScale: import_prop_types.default.func.isRequired, markers: import_prop_types.default.arrayOf(import_prop_types.default.shape({ axis: import_prop_types.default.oneOf(["x", "y"]).isRequired, value: import_prop_types.default.oneOfType([import_prop_types.default.number, import_prop_types.default.string, import_prop_types.default.instanceOf(Date)]).isRequired, lineStyle: import_prop_types.default.object, textStyle: import_prop_types.default.object })) };
var Rn = (0, import_react2.memo)(kn);
var Cn = function(e8) {
  return (0, import_isFunction.default)(e8) ? e8 : function(r6) {
    return (0, import_get.default)(r6, e8);
  };
};
var Wn = function(e8) {
  return (0, import_react2.useMemo)(function() {
    return Cn(e8);
  }, [e8]);
};
var jn = function(e8, r6, t8, n7, i6, o5) {
  return e8 <= i6 && i6 <= e8 + t8 && r6 <= o5 && o5 <= r6 + n7;
};
var Sn = function(e8, r6) {
  var t8, n7 = "touches" in r6 ? r6.touches[0] : r6, i6 = n7.clientX, o5 = n7.clientY, l4 = e8.getBoundingClientRect(), a5 = (t8 = void 0 !== e8.getBBox ? e8.getBBox() : { width: e8.offsetWidth || 0, height: e8.offsetHeight || 0 }).width === l4.width ? 1 : t8.width / l4.width;
  return [(i6 - l4.left) * a5, (o5 - l4.top) * a5];
};
var Bn = Object.keys(Et);
var Gn = Object.keys(un);

// node_modules/@nivo/heatmap/node_modules/@nivo/axes/dist/nivo-axes.es.js
var t4 = __toESM(require_react());
var import_react3 = __toESM(require_react());

// node_modules/@nivo/heatmap/node_modules/@nivo/scales/dist/nivo-scales.es.js
var import_uniq = __toESM(require_uniq());
var import_uniqBy = __toESM(require_uniqBy());
var import_sortBy = __toESM(require_sortBy());
var import_last2 = __toESM(require_last());
var import_isDate = __toESM(require_isDate());
var J = [function(n7) {
  return n7.setMilliseconds(0);
}, function(n7) {
  return n7.setSeconds(0);
}, function(n7) {
  return n7.setMinutes(0);
}, function(n7) {
  return n7.setHours(0);
}, function(n7) {
  return n7.setDate(1);
}, function(n7) {
  return n7.setMonth(0);
}];
var K = { millisecond: [], second: J.slice(0, 1), minute: J.slice(0, 2), hour: J.slice(0, 3), day: J.slice(0, 4), month: J.slice(0, 5), year: J.slice(0, 6) };
var nn2 = function(n7) {
  var t8 = n7;
  return t8.type = "band", t8;
};
var pn2 = function(n7) {
  var t8 = n7.bandwidth();
  if (0 === t8) return n7;
  var r6 = t8 / 2;
  return n7.round() && (r6 = Math.round(r6)), function(t9) {
    var e8;
    return (null != (e8 = n7(t9)) ? e8 : 0) + r6;
  };
};
var hn2 = { millisecond: [millisecond_default, millisecond_default], second: [second_default, second_default], minute: [minute_default, utcMinute_default], hour: [hour_default, utcHour_default], day: [newInterval(function(n7) {
  return n7.setHours(0, 0, 0, 0);
}, function(n7, t8) {
  return n7.setDate(n7.getDate() + t8);
}, function(n7, t8) {
  return (t8.getTime() - n7.getTime()) / 864e5;
}, function(n7) {
  return Math.floor(n7.getTime() / 864e5);
}), newInterval(function(n7) {
  return n7.setUTCHours(0, 0, 0, 0);
}, function(n7, t8) {
  return n7.setUTCDate(n7.getUTCDate() + t8);
}, function(n7, t8) {
  return (t8.getTime() - n7.getTime()) / 864e5;
}, function(n7) {
  return Math.floor(n7.getTime() / 864e5);
})], week: [sunday, utcSunday], sunday: [sunday, utcSunday], monday: [monday, utcMonday], tuesday: [tuesday, utcTuesday], wednesday: [wednesday, utcWednesday], thursday: [thursday, utcThursday], friday: [friday, utcFriday], saturday: [saturday, utcSaturday], month: [month_default, utcMonth_default], year: [year_default, utcYear_default] };
var gn2 = Object.keys(hn2);
var xn = new RegExp("^every\\s*(\\d+)?\\s*(" + gn2.join("|") + ")s?$", "i");
var kn2 = function(n7, t8) {
  if (Array.isArray(t8)) return t8;
  if ("string" == typeof t8 && "useUTC" in n7) {
    var r6 = t8.match(xn);
    if (r6) {
      var e8 = r6[1], a5 = r6[2], i6 = hn2[a5][n7.useUTC ? 1 : 0];
      if ("day" === a5) {
        var o5, u2, c3 = n7.domain(), s3 = c3[0], d3 = c3[1], f2 = new Date(d3);
        return f2.setDate(f2.getDate() + 1), null != (o5 = null == (u2 = i6.every(Number(null != e8 ? e8 : 1))) ? void 0 : u2.range(s3, f2)) ? o5 : [];
      }
      if (void 0 === e8) return n7.ticks(i6);
      var l4 = i6.every(Number(e8));
      if (l4) return n7.ticks(l4);
    }
    throw new Error("Invalid tickValues: " + t8);
  }
  if ("ticks" in n7) {
    if (void 0 === t8) return n7.ticks();
    if ("number" == typeof (m4 = t8) && isFinite(m4) && Math.floor(m4) === m4) return n7.ticks(t8);
  }
  var m4;
  return n7.domain();
};

// node_modules/@nivo/heatmap/node_modules/@nivo/axes/dist/nivo-axes.es.js
var import_jsx_runtime3 = __toESM(require_jsx_runtime());
function p2() {
  return p2 = Object.assign ? Object.assign.bind() : function(t8) {
    for (var e8 = 1; e8 < arguments.length; e8++) {
      var i6 = arguments[e8];
      for (var n7 in i6) Object.prototype.hasOwnProperty.call(i6, n7) && (t8[n7] = i6[n7]);
    }
    return t8;
  }, p2.apply(this, arguments);
}
var b2 = function(t8) {
  var e8, i6 = t8.axis, n7 = t8.scale, r6 = t8.ticksPosition, o5 = t8.tickValues, l4 = t8.tickSize, s3 = t8.tickPadding, c3 = t8.tickRotation, f2 = t8.truncateTickAt, u2 = t8.engine, d3 = void 0 === u2 ? "svg" : u2, x3 = kn2(n7, o5), m4 = rn[d3], k4 = "bandwidth" in n7 ? pn2(n7) : n7, g5 = { lineX: 0, lineY: 0 }, v5 = { textX: 0, textY: 0 }, b5 = "object" == typeof document && "rtl" === document.dir, P4 = m4.align.center, T4 = m4.baseline.center;
  "x" === i6 ? (e8 = function(t9) {
    var e9;
    return { x: null != (e9 = k4(t9)) ? e9 : 0, y: 0 };
  }, g5.lineY = l4 * ("after" === r6 ? 1 : -1), v5.textY = (l4 + s3) * ("after" === r6 ? 1 : -1), T4 = "after" === r6 ? m4.baseline.top : m4.baseline.bottom, 0 === c3 ? P4 = m4.align.center : "after" === r6 && c3 < 0 || "before" === r6 && c3 > 0 ? (P4 = m4.align[b5 ? "left" : "right"], T4 = m4.baseline.center) : ("after" === r6 && c3 > 0 || "before" === r6 && c3 < 0) && (P4 = m4.align[b5 ? "right" : "left"], T4 = m4.baseline.center)) : (e8 = function(t9) {
    var e9;
    return { x: 0, y: null != (e9 = k4(t9)) ? e9 : 0 };
  }, g5.lineX = l4 * ("after" === r6 ? 1 : -1), v5.textX = (l4 + s3) * ("after" === r6 ? 1 : -1), P4 = "after" === r6 ? m4.align.left : m4.align.right);
  return { ticks: x3.map(function(t9) {
    var i7 = "string" == typeof t9 ? function(t10) {
      var e9 = String(t10).length;
      return f2 && f2 > 0 && e9 > f2 ? "" + String(t10).slice(0, f2).concat("...") : "" + t10;
    }(t9) : t9;
    return p2({ key: t9 instanceof Date ? "" + t9.valueOf() : "" + t9, value: i7 }, e8(t9), g5, v5);
  }), textAlign: P4, textBaseline: T4 };
};
var P2 = function(t8, e8) {
  if (void 0 === t8 || "function" == typeof t8) return t8;
  if ("time" === e8.type) {
    var i6 = timeFormat(t8);
    return function(t9) {
      return i6(t9 instanceof Date ? t9 : new Date(t9));
    };
  }
  return format(t8);
};
var T2 = function(t8) {
  var e8, i6 = t8.width, n7 = t8.height, r6 = t8.scale, a5 = t8.axis, o5 = t8.values, l4 = (e8 = o5, Array.isArray(e8) ? o5 : void 0) || kn2(r6, o5), s3 = "bandwidth" in r6 ? pn2(r6) : r6, c3 = "x" === a5 ? l4.map(function(t9) {
    var e9, i7;
    return { key: t9 instanceof Date ? "" + t9.valueOf() : "" + t9, x1: null != (e9 = s3(t9)) ? e9 : 0, x2: null != (i7 = s3(t9)) ? i7 : 0, y1: 0, y2: n7 };
  }) : l4.map(function(t9) {
    var e9, n8;
    return { key: t9 instanceof Date ? "" + t9.valueOf() : "" + t9, x1: 0, x2: i6, y1: null != (e9 = s3(t9)) ? e9 : 0, y2: null != (n8 = s3(t9)) ? n8 : 0 };
  });
  return c3;
};
var A2 = (0, import_react3.memo)(function(t8) {
  var e8, n7 = t8.value, r6 = t8.format, a5 = t8.lineX, s3 = t8.lineY, c3 = t8.onClick, u2 = t8.textBaseline, d3 = t8.textAnchor, x3 = t8.animatedProps, m4 = zt(), y4 = m4.axis.ticks.line, h2 = m4.axis.ticks.text, v5 = null != (e8 = null == r6 ? void 0 : r6(n7)) ? e8 : n7, b5 = (0, import_react3.useMemo)(function() {
    var t9 = { opacity: x3.opacity };
    return c3 ? { style: p2({}, t9, { cursor: "pointer" }), onClick: function(t10) {
      return c3(t10, v5);
    } } : { style: t9 };
  }, [x3.opacity, c3, v5]);
  return (0, import_jsx_runtime3.jsxs)(animated.g, p2({ transform: x3.transform }, b5, { children: [(0, import_jsx_runtime3.jsx)("line", { x1: 0, x2: a5, y1: 0, y2: s3, style: y4 }), h2.outlineWidth > 0 && (0, import_jsx_runtime3.jsx)(animated.text, { dominantBaseline: u2, textAnchor: d3, transform: x3.textTransform, style: h2, strokeWidth: 2 * h2.outlineWidth, stroke: h2.outlineColor, strokeLinejoin: "round", children: "" + v5 }), (0, import_jsx_runtime3.jsx)(animated.text, { dominantBaseline: u2, textAnchor: d3, transform: x3.textTransform, style: Mt(h2), children: "" + v5 })] }));
});
var S = function(e8) {
  var r6 = e8.axis, a5 = e8.scale, l4 = e8.x, c3 = void 0 === l4 ? 0 : l4, x3 = e8.y, m4 = void 0 === x3 ? 0 : x3, y4 = e8.length, h2 = e8.ticksPosition, T4 = e8.tickValues, S3 = e8.tickSize, W5 = void 0 === S3 ? 5 : S3, w4 = e8.tickPadding, B3 = void 0 === w4 ? 5 : w4, X2 = e8.tickRotation, Y3 = void 0 === X2 ? 0 : X2, C6 = e8.format, O5 = e8.renderTick, j5 = void 0 === O5 ? A2 : O5, z6 = e8.truncateTickAt, V3 = e8.legend, D3 = e8.legendPosition, R3 = void 0 === D3 ? "end" : D3, E4 = e8.legendOffset, q3 = void 0 === E4 ? 0 : E4, F2 = e8.onClick, L2 = e8.ariaHidden, N3 = zt(), H2 = N3.axis.legend.text, I2 = (0, import_react3.useMemo)(function() {
    return P2(C6, a5);
  }, [C6, a5]), J4 = b2({ axis: r6, scale: a5, ticksPosition: h2, tickValues: T4, tickSize: W5, tickPadding: B3, tickRotation: Y3, truncateTickAt: z6 }), G2 = J4.ticks, K3 = J4.textAlign, M3 = J4.textBaseline, Q2 = null;
  if (void 0 !== V3) {
    var U2, Z2 = 0, $2 = 0, _2 = 0;
    "y" === r6 ? (_2 = -90, Z2 = q3, "start" === R3 ? (U2 = "start", $2 = y4) : "middle" === R3 ? (U2 = "middle", $2 = y4 / 2) : "end" === R3 && (U2 = "end")) : ($2 = q3, "start" === R3 ? U2 = "start" : "middle" === R3 ? (U2 = "middle", Z2 = y4 / 2) : "end" === R3 && (U2 = "end", Z2 = y4)), Q2 = (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [H2.outlineWidth > 0 && (0, import_jsx_runtime3.jsx)("text", { transform: "translate(" + Z2 + ", " + $2 + ") rotate(" + _2 + ")", textAnchor: U2, style: p2({ dominantBaseline: "central" }, H2), strokeWidth: 2 * H2.outlineWidth, stroke: H2.outlineColor, strokeLinejoin: "round", children: V3 }), (0, import_jsx_runtime3.jsx)("text", { transform: "translate(" + Z2 + ", " + $2 + ") rotate(" + _2 + ")", textAnchor: U2, style: p2({ dominantBaseline: "central" }, H2), children: V3 })] });
  }
  var tt2 = Ur(), et2 = tt2.animate, it2 = tt2.config, nt2 = useSpring({ transform: "translate(" + c3 + "," + m4 + ")", lineX2: "x" === r6 ? y4 : 0, lineY2: "x" === r6 ? 0 : y4, config: it2, immediate: !et2 }), rt2 = (0, import_react3.useCallback)(function(t8) {
    return { opacity: 1, transform: "translate(" + t8.x + "," + t8.y + ")", textTransform: "translate(" + t8.textX + "," + t8.textY + ") rotate(" + Y3 + ")" };
  }, [Y3]), at2 = (0, import_react3.useCallback)(function(t8) {
    return { opacity: 0, transform: "translate(" + t8.x + "," + t8.y + ")", textTransform: "translate(" + t8.textX + "," + t8.textY + ") rotate(" + Y3 + ")" };
  }, [Y3]), ot2 = useTransition(G2, { keys: function(t8) {
    return t8.key;
  }, initial: rt2, from: at2, enter: rt2, update: rt2, leave: { opacity: 0 }, config: it2, immediate: !et2 });
  return (0, import_jsx_runtime3.jsxs)(animated.g, { transform: nt2.transform, "aria-hidden": L2, children: [ot2(function(e9, i6, n7, r7) {
    return t4.createElement(j5, p2({ tickIndex: r7, format: I2, rotate: Y3, textBaseline: M3, textAnchor: K3, truncateTickAt: z6, animatedProps: e9 }, i6, F2 ? { onClick: F2 } : {}));
  }), (0, import_jsx_runtime3.jsx)(animated.line, { style: N3.axis.domain.line, x1: 0, x2: nt2.lineX2, y1: 0, y2: nt2.lineY2 }), Q2] });
};
var W2 = (0, import_react3.memo)(S);
var w2 = ["top", "right", "bottom", "left"];
var B = (0, import_react3.memo)(function(t8) {
  var e8 = t8.xScale, i6 = t8.yScale, n7 = t8.width, r6 = t8.height, a5 = { top: t8.top, right: t8.right, bottom: t8.bottom, left: t8.left };
  return (0, import_jsx_runtime3.jsx)(import_jsx_runtime3.Fragment, { children: w2.map(function(t9) {
    var o5 = a5[t9];
    if (!o5) return null;
    var l4 = "top" === t9 || "bottom" === t9;
    return (0, import_jsx_runtime3.jsx)(W2, p2({}, o5, { axis: l4 ? "x" : "y", x: "right" === t9 ? n7 : 0, y: "bottom" === t9 ? r6 : 0, scale: l4 ? e8 : i6, length: l4 ? n7 : r6, ticksPosition: "top" === t9 || "left" === t9 ? "before" : "after", truncateTickAt: o5.truncateTickAt }), t9);
  }) });
});
var X = (0, import_react3.memo)(function(t8) {
  var e8 = t8.animatedProps, i6 = zt();
  return (0, import_jsx_runtime3.jsx)(animated.line, p2({}, e8, i6.grid.line));
});
var Y = (0, import_react3.memo)(function(t8) {
  var e8 = t8.lines, i6 = Ur(), n7 = i6.animate, a5 = i6.config, o5 = useTransition(e8, { keys: function(t9) {
    return t9.key;
  }, initial: function(t9) {
    return { opacity: 1, x1: t9.x1, x2: t9.x2, y1: t9.y1, y2: t9.y2 };
  }, from: function(t9) {
    return { opacity: 0, x1: t9.x1, x2: t9.x2, y1: t9.y1, y2: t9.y2 };
  }, enter: function(t9) {
    return { opacity: 1, x1: t9.x1, x2: t9.x2, y1: t9.y1, y2: t9.y2 };
  }, update: function(t9) {
    return { opacity: 1, x1: t9.x1, x2: t9.x2, y1: t9.y1, y2: t9.y2 };
  }, leave: { opacity: 0 }, config: a5, immediate: !n7 });
  return (0, import_jsx_runtime3.jsx)("g", { children: o5(function(t9, e9) {
    return (0, import_react3.createElement)(X, p2({}, e9, { key: e9.key, animatedProps: t9 }));
  }) });
});
var C3 = (0, import_react3.memo)(function(t8) {
  var e8 = t8.width, n7 = t8.height, r6 = t8.xScale, a5 = t8.yScale, o5 = t8.xValues, l4 = t8.yValues, s3 = (0, import_react3.useMemo)(function() {
    return !!r6 && T2({ width: e8, height: n7, scale: r6, axis: "x", values: o5 });
  }, [r6, o5, e8, n7]), c3 = (0, import_react3.useMemo)(function() {
    return !!a5 && T2({ width: e8, height: n7, scale: a5, axis: "y", values: l4 });
  }, [n7, e8, a5, l4]);
  return (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [s3 && (0, import_jsx_runtime3.jsx)(Y, { lines: s3 }), c3 && (0, import_jsx_runtime3.jsx)(Y, { lines: c3 })] });
});
var O3 = function(t8, e8) {
  var i6, n7 = e8.axis, r6 = e8.scale, a5 = e8.x, o5 = void 0 === a5 ? 0 : a5, l4 = e8.y, s3 = void 0 === l4 ? 0 : l4, f2 = e8.length, u2 = e8.ticksPosition, d3 = e8.tickValues, x3 = e8.tickSize, m4 = void 0 === x3 ? 5 : x3, y4 = e8.tickPadding, h2 = void 0 === y4 ? 5 : y4, k4 = e8.tickRotation, g5 = void 0 === k4 ? 0 : k4, v5 = e8.format, p5 = e8.legend, P4 = e8.legendPosition, T4 = void 0 === P4 ? "end" : P4, A4 = e8.legendOffset, S3 = void 0 === A4 ? 0 : A4, W5 = e8.theme, w4 = b2({ axis: n7, scale: r6, ticksPosition: u2, tickValues: d3, tickSize: m4, tickPadding: h2, tickRotation: g5, engine: "canvas" }), B3 = w4.ticks, X2 = w4.textAlign, Y3 = w4.textBaseline;
  t8.save(), t8.translate(o5, s3), t8.textAlign = X2, t8.textBaseline = Y3;
  var C6 = W5.axis.ticks.text;
  t8.font = (C6.fontWeight ? C6.fontWeight + " " : "") + C6.fontSize + "px " + C6.fontFamily, (null != (i6 = W5.axis.domain.line.strokeWidth) ? i6 : 0) > 0 && (t8.lineWidth = Number(W5.axis.domain.line.strokeWidth), t8.lineCap = "square", W5.axis.domain.line.stroke && (t8.strokeStyle = W5.axis.domain.line.stroke), t8.beginPath(), t8.moveTo(0, 0), t8.lineTo("x" === n7 ? f2 : 0, "x" === n7 ? 0 : f2), t8.stroke());
  var O5 = "function" == typeof v5 ? v5 : function(t9) {
    return "" + t9;
  };
  if (B3.forEach(function(e9) {
    var i7;
    (null != (i7 = W5.axis.ticks.line.strokeWidth) ? i7 : 0) > 0 && (t8.lineWidth = Number(W5.axis.ticks.line.strokeWidth), t8.lineCap = "square", W5.axis.ticks.line.stroke && (t8.strokeStyle = W5.axis.ticks.line.stroke), t8.beginPath(), t8.moveTo(e9.x, e9.y), t8.lineTo(e9.x + e9.lineX, e9.y + e9.lineY), t8.stroke());
    var n8 = O5(e9.value);
    t8.save(), t8.translate(e9.x + e9.textX, e9.y + e9.textY), t8.rotate(Ht(g5)), C6.outlineWidth > 0 && (t8.strokeStyle = C6.outlineColor, t8.lineWidth = 2 * C6.outlineWidth, t8.lineJoin = "round", t8.strokeText("" + n8, 0, 0)), W5.axis.ticks.text.fill && (t8.fillStyle = C6.fill), t8.fillText("" + n8, 0, 0), t8.restore();
  }), void 0 !== p5) {
    var j5 = 0, z6 = 0, V3 = 0, D3 = "center";
    "y" === n7 ? (V3 = -90, j5 = S3, "start" === T4 ? (D3 = "start", z6 = f2) : "middle" === T4 ? (D3 = "center", z6 = f2 / 2) : "end" === T4 && (D3 = "end")) : (z6 = S3, "start" === T4 ? D3 = "start" : "middle" === T4 ? (D3 = "center", j5 = f2 / 2) : "end" === T4 && (D3 = "end", j5 = f2)), t8.translate(j5, z6), t8.rotate(Ht(V3)), t8.font = (W5.axis.legend.text.fontWeight ? W5.axis.legend.text.fontWeight + " " : "") + W5.axis.legend.text.fontSize + "px " + W5.axis.legend.text.fontFamily, W5.axis.legend.text.fill && (t8.fillStyle = W5.axis.legend.text.fill), t8.textAlign = D3, t8.textBaseline = "middle", t8.fillText(p5, 0, 0);
  }
  t8.restore();
};
var j2 = function(t8, e8) {
  var i6 = e8.xScale, n7 = e8.yScale, r6 = e8.width, a5 = e8.height, o5 = e8.top, l4 = e8.right, s3 = e8.bottom, c3 = e8.left, f2 = e8.theme, u2 = { top: o5, right: l4, bottom: s3, left: c3 };
  w2.forEach(function(e9) {
    var o6 = u2[e9];
    if (!o6) return null;
    var l5 = "top" === e9 || "bottom" === e9, s4 = "top" === e9 || "left" === e9 ? "before" : "after", c4 = l5 ? i6 : n7, d3 = P2(o6.format, c4);
    O3(t8, p2({}, o6, { axis: l5 ? "x" : "y", x: "right" === e9 ? r6 : 0, y: "bottom" === e9 ? a5 : 0, scale: c4, format: d3, length: l5 ? r6 : a5, ticksPosition: s4, theme: f2 }));
  });
};
var z3 = function(t8, e8) {
  var i6 = e8.width, n7 = e8.height, r6 = e8.scale, a5 = e8.axis, o5 = e8.values;
  T2({ width: i6, height: n7, scale: r6, axis: a5, values: o5 }).forEach(function(e9) {
    t8.beginPath(), t8.moveTo(e9.x1, e9.y1), t8.lineTo(e9.x2, e9.y2), t8.stroke();
  });
};

// node_modules/@nivo/heatmap/node_modules/@nivo/legends/dist/nivo-legends.es.js
var import_jsx_runtime4 = __toESM(require_jsx_runtime());

// node_modules/@nivo/heatmap/node_modules/@nivo/colors/dist/nivo-colors.es.js
var import_react4 = __toESM(require_react());
var import_get2 = __toESM(require_get());
var import_isPlainObject2 = __toESM(require_isPlainObject());
var import_prop_types2 = __toESM(require_prop_types());
function qe() {
  return qe = Object.assign ? Object.assign.bind() : function(e8) {
    for (var r6 = 1; r6 < arguments.length; r6++) {
      var n7 = arguments[r6];
      for (var t8 in n7) Object.prototype.hasOwnProperty.call(n7, t8) && (e8[t8] = n7[t8]);
    }
    return e8;
  }, qe.apply(this, arguments);
}
function Ce(e8, r6) {
  (null == r6 || r6 > e8.length) && (r6 = e8.length);
  for (var n7 = 0, t8 = new Array(r6); n7 < r6; n7++) t8[n7] = e8[n7];
  return t8;
}
function Ge(e8, r6) {
  var n7 = "undefined" != typeof Symbol && e8[Symbol.iterator] || e8["@@iterator"];
  if (n7) return (n7 = n7.call(e8)).next.bind(n7);
  if (Array.isArray(e8) || (n7 = function(e9, r7) {
    if (e9) {
      if ("string" == typeof e9) return Ce(e9, r7);
      var n8 = Object.prototype.toString.call(e9).slice(8, -1);
      return "Object" === n8 && e9.constructor && (n8 = e9.constructor.name), "Map" === n8 || "Set" === n8 ? Array.from(e9) : "Arguments" === n8 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n8) ? Ce(e9, r7) : void 0;
    }
  }(e8)) || r6 && e8 && "number" == typeof e8.length) {
    n7 && (e8 = n7);
    var t8 = 0;
    return function() {
      return t8 >= e8.length ? { done: true } : { done: false, value: e8[t8++] };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
var Re = { nivo: ["#e8c1a0", "#f47560", "#f1e15b", "#e8a838", "#61cdbb", "#97e3d5"], category10: category10_default, accent: Accent_default, dark2: Dark2_default, paired: Paired_default, pastel1: Pastel1_default, pastel2: Pastel2_default, set1: Set1_default, set2: Set2_default, set3: Set3_default, tableau10: Tableau10_default };
var Ve = Object.keys(Re);
var Pe = { brown_blueGreen: scheme, purpleRed_green: scheme2, pink_yellowGreen: scheme3, purple_orange: scheme4, red_blue: scheme5, red_grey: scheme6, red_yellow_blue: scheme7, red_yellow_green: scheme8, spectral: scheme9 };
var Te = Object.keys(Pe);
var Ue = { brown_blueGreen: BrBG_default, purpleRed_green: PRGn_default, pink_yellowGreen: PiYG_default, purple_orange: PuOr_default, red_blue: RdBu_default, red_grey: RdGy_default, red_yellow_blue: RdYlBu_default, red_yellow_green: RdYlGn_default, spectral: Spectral_default };
var De = { blues: scheme22, greens: scheme23, greys: scheme24, oranges: scheme27, purples: scheme25, reds: scheme26, blue_green: scheme10, blue_purple: scheme11, green_blue: scheme12, orange_red: scheme13, purple_blue_green: scheme14, purple_blue: scheme15, purple_red: scheme16, red_purple: scheme17, yellow_green_blue: scheme18, yellow_green: scheme19, yellow_orange_brown: scheme20, yellow_orange_red: scheme21 };
var Me = Object.keys(De);
var $e = { blues: Blues_default, greens: Greens_default, greys: Greys_default, oranges: Oranges_default, purples: Purples_default, reds: Reds_default, turbo: turbo_default, viridis: viridis_default, inferno, magma, plasma, cividis: cividis_default, warm, cool, cubehelixDefault: cubehelix_default, blue_green: BuGn_default, blue_purple: BuPu_default, green_blue: GnBu_default, orange_red: OrRd_default, purple_blue_green: PuBuGn_default, purple_blue: PuBu_default, purple_red: PuRd_default, red_purple: RdPu_default, yellow_green_blue: YlGnBu_default, yellow_green: YlGn_default, yellow_orange_brown: YlOrBr_default, yellow_orange_red: YlOrRd_default };
var Be = qe({}, Re, Pe, De);
var Fe = Object.keys(Be);
var Le = { rainbow: rainbow_default, sinebow: sinebow_default };
var Ne = qe({}, Ue, $e, Le);
var Qe2 = Object.keys(Ne);
var We = function(e8, r6) {
  if ("function" == typeof e8) return e8;
  if ((0, import_isPlainObject2.default)(e8)) {
    if (function(e9) {
      return void 0 !== e9.theme;
    }(e8)) {
      if (void 0 === r6) throw new Error("Unable to use color from theme as no theme was provided");
      var n7 = (0, import_get2.default)(r6, e8.theme);
      if (void 0 === n7) throw new Error("Color from theme is undefined at path: '" + e8.theme + "'");
      return function() {
        return n7;
      };
    }
    if (function(e9) {
      return void 0 !== e9.from;
    }(e8)) {
      var t8 = function(r7) {
        return (0, import_get2.default)(r7, e8.from);
      };
      if (Array.isArray(e8.modifiers)) {
        for (var o5, i6 = [], u2 = function() {
          var e9 = o5.value, r7 = e9[0], n8 = e9[1];
          if ("brighter" === r7) i6.push(function(e10) {
            return e10.brighter(n8);
          });
          else if ("darker" === r7) i6.push(function(e10) {
            return e10.darker(n8);
          });
          else {
            if ("opacity" !== r7) throw new Error("Invalid color modifier: '" + r7 + "', must be one of: 'brighter', 'darker', 'opacity'");
            i6.push(function(e10) {
              return e10.opacity = n8, e10;
            });
          }
        }, a5 = Ge(e8.modifiers); !(o5 = a5()).done; ) u2();
        return 0 === i6.length ? t8 : function(e9) {
          return i6.reduce(function(e10, r7) {
            return r7(e10);
          }, rgb(t8(e9))).toString();
        };
      }
      return t8;
    }
    throw new Error("Invalid color spec, you should either specify 'theme' or 'from' when using a config object");
  }
  return function() {
    return e8;
  };
};
var Xe = function(e8, r6) {
  return (0, import_react4.useMemo)(function() {
    return We(e8, r6);
  }, [e8, r6]);
};
var Ye = import_prop_types2.default.oneOfType([import_prop_types2.default.string, import_prop_types2.default.func, import_prop_types2.default.shape({ theme: import_prop_types2.default.string.isRequired }), import_prop_types2.default.shape({ from: import_prop_types2.default.string.isRequired, modifiers: import_prop_types2.default.arrayOf(import_prop_types2.default.array) })]);
var Ze2 = { scheme: "turbo" };
var er = function(e8, r6) {
  var n7 = e8.minValue, t8 = e8.maxValue, o5 = void 0 !== n7 ? n7 : r6.min, i6 = void 0 !== t8 ? t8 : r6.max, u2 = sequential().domain([o5, i6]).clamp(true);
  if ("colors" in e8) u2.range(e8.colors);
  else if ("interpolator" in e8) u2.interpolator(e8.interpolator);
  else {
    var a5, l4 = null != (a5 = e8.scheme) ? a5 : Ze2.scheme;
    u2.interpolator(Ne[l4]);
  }
  return u2;
};
var nr = { scheme: "red_yellow_blue", divergeAt: 0.5 };
var tr = function(e8, r6) {
  var n7, t8 = e8.minValue, o5 = e8.maxValue, i6 = void 0 !== t8 ? t8 : r6.min, u2 = void 0 !== o5 ? o5 : r6.max, a5 = [i6, i6 + (u2 - i6) / 2, u2], l4 = 0.5 - (null != (n7 = e8.divergeAt) ? n7 : nr.divergeAt), c3 = diverging().domain(a5).clamp(true), s3 = function(e9) {
    return String(e9);
  };
  if ("colors" in e8) s3 = diverging().domain(a5.map(function(e9) {
    return e9 - l4 * (u2 - i6);
  })).range(e8.colors).interpolator();
  else if ("interpolator" in e8) s3 = e8.interpolator;
  else {
    var f2, p5 = null != (f2 = e8.scheme) ? f2 : nr.scheme;
    s3 = Ne[p5];
  }
  return c3.interpolator(function(e9) {
    return s3(e9 + l4);
  });
};
var ir = { scheme: "turbo", steps: 7 };
var ur = function(e8, r6) {
  var n7 = quantize().domain(e8.domain || [r6.min, r6.max]).nice();
  if ("colors" in e8) n7.range(e8.colors);
  else {
    var t8 = e8.scheme || ir.scheme, o5 = void 0 === e8.steps ? ir.steps : e8.steps, i6 = Ne[t8], u2 = Array.from({ length: o5 }).map(function(e9, r7) {
      return i6(r7 * (1 / (o5 - 1)));
    });
    n7.range(u2);
  }
  return n7;
};
var lr = function(e8, r6) {
  if (function(e9) {
    return "sequential" === e9.type;
  }(e8)) return er(e8, r6);
  if (function(e9) {
    return "diverging" === e9.type;
  }(e8)) return tr(e8, r6);
  if (function(e9) {
    return "quantize" === e9.type;
  }(e8)) return ur(e8, r6);
  throw new Error("Invalid continuous color scale config");
};
var sr = function(e8, r6) {
  void 0 === r6 && (r6 = 16);
  var n7 = e8.domain();
  if ("thresholds" in e8) {
    var t8 = [], o5 = linear().domain(n7).range([0, 1]);
    return e8.range().forEach(function(r7, n8) {
      var i7 = e8.invertExtent(r7), u2 = i7[0], a5 = i7[1];
      t8.push({ key: n8 + ".0", offset: o5(u2), stopColor: r7 }), t8.push({ key: n8 + ".1", offset: o5(a5), stopColor: r7 });
    }), t8;
  }
  var i6 = e8.copy();
  return 2 === n7.length ? i6.domain([0, 1]) : 3 === n7.length && i6.domain([0, 0.5, 1]), i6.ticks(r6).map(function(e9) {
    return { key: "" + e9, offset: e9, stopColor: "" + i6(e9) };
  });
};

// node_modules/@nivo/heatmap/node_modules/@nivo/legends/dist/nivo-legends.es.js
var c2 = __toESM(require_react());
var import_react5 = __toESM(require_react());
function p3() {
  return p3 = Object.assign ? Object.assign.bind() : function(t8) {
    for (var e8 = 1; e8 < arguments.length; e8++) {
      var i6 = arguments[e8];
      for (var n7 in i6) Object.prototype.hasOwnProperty.call(i6, n7) && (t8[n7] = i6[n7]);
    }
    return t8;
  }, p3.apply(this, arguments);
}
var y3 = { length: 200, thickness: 16, direction: "row", tickPosition: "after", tickSize: 4, tickSpacing: 3, tickOverlap: false, tickFormat: function(t8) {
  return "" + t8;
}, titleAlign: "start", titleOffset: 4 };
var b3 = function(t8) {
  var e8 = t8.anchor, i6 = t8.translateX, n7 = t8.translateY, o5 = t8.containerWidth, r6 = t8.containerHeight, l4 = t8.width, a5 = t8.height, c3 = i6, d3 = n7;
  switch (e8) {
    case "top":
      c3 += (o5 - l4) / 2;
      break;
    case "top-right":
      c3 += o5 - l4;
      break;
    case "right":
      c3 += o5 - l4, d3 += (r6 - a5) / 2;
      break;
    case "bottom-right":
      c3 += o5 - l4, d3 += r6 - a5;
      break;
    case "bottom":
      c3 += (o5 - l4) / 2, d3 += r6 - a5;
      break;
    case "bottom-left":
      d3 += r6 - a5;
      break;
    case "left":
      d3 += (r6 - a5) / 2;
      break;
    case "center":
      c3 += (o5 - l4) / 2, d3 += (r6 - a5) / 2;
  }
  return { x: c3, y: d3 };
};
var A3 = function(t8) {
  var e8, o5 = t8.scale, r6 = t8.ticks, l4 = t8.length, c3 = void 0 === l4 ? y3.length : l4, d3 = t8.thickness, s3 = void 0 === d3 ? y3.thickness : d3, h2 = t8.direction, g5 = void 0 === h2 ? y3.direction : h2, f2 = t8.tickPosition, m4 = void 0 === f2 ? y3.tickPosition : f2, v5 = t8.tickSize, u2 = void 0 === v5 ? y3.tickSize : v5, p5 = t8.tickSpacing, k4 = void 0 === p5 ? y3.tickSpacing : p5, x3 = t8.tickOverlap, b5 = void 0 === x3 ? y3.tickOverlap : x3, S3 = t8.tickFormat, A4 = void 0 === S3 ? y3.tickFormat : S3, W5 = t8.title, z6 = t8.titleAlign, C6 = void 0 === z6 ? y3.titleAlign : z6, w4 = t8.titleOffset, X2 = void 0 === w4 ? y3.titleOffset : w4, Y3 = "column" === g5 ? [].concat(o5.domain()).reverse() : o5.domain(), O5 = linear().domain(Y3);
  2 === Y3.length ? O5.range([0, c3]) : 3 === Y3.length && O5.range([0, c3 / 2, c3]), e8 = "thresholds" in o5 ? [Y3[0]].concat(o5.thresholds(), [Y3[1]]) : Array.isArray(r6) ? r6 : o5.ticks(r6);
  var B3, H2, E4, j5, L2, M3, F2 = sr(o5, 32), T4 = xt(A4), P4 = [], V3 = 0, R3 = 0;
  if ("row" === g5) {
    var D3, q3, G2;
    B3 = c3, H2 = s3, R3 = 1;
    var I2;
    L2 = 0, E4 = "start" === C6 ? 0 : "middle" === C6 ? c3 / 2 : c3, "before" === m4 ? (D3 = -u2, q3 = b5 ? s3 : 0, G2 = -u2 - k4, I2 = "alphabetic", j5 = s3 + X2, M3 = "hanging") : (D3 = b5 ? 0 : s3, G2 = (q3 = s3 + u2) + k4, I2 = "hanging", j5 = -X2, M3 = "alphabetic"), e8.forEach(function(t9) {
      var e9 = O5(t9);
      P4.push({ x1: e9, y1: D3, x2: e9, y2: q3, text: T4(t9), textX: e9, textY: G2, textHorizontalAlign: "middle", textVerticalAlign: I2 });
    });
  } else {
    var N3, _2, J4, K3;
    B3 = s3, H2 = c3, V3 = 1;
    L2 = -90, j5 = "start" === C6 ? c3 : "middle" === C6 ? c3 / 2 : 0, "before" === m4 ? (_2 = b5 ? s3 : 0, J4 = (N3 = -u2) - k4, K3 = "end", E4 = s3 + X2, M3 = "hanging") : (N3 = b5 ? 0 : s3, J4 = (_2 = s3 + u2) + k4, K3 = "start", E4 = -X2, M3 = "alphabetic"), e8.forEach(function(t9) {
      var e9 = O5(t9);
      P4.push({ x1: N3, y1: e9, x2: _2, y2: e9, text: T4(t9), textX: J4, textY: e9, textHorizontalAlign: K3, textVerticalAlign: "central" });
    });
  }
  return { width: B3, height: H2, gradientX1: 0, gradientY1: V3, gradientX2: R3, gradientY2: 0, colorStops: F2, ticks: P4, titleText: W5, titleX: E4, titleY: j5, titleRotation: L2, titleHorizontalAlign: C6, titleVerticalAlign: M3 };
};
var W3 = function(i6) {
  var n7 = i6.scale, r6 = i6.ticks, l4 = i6.length, a5 = void 0 === l4 ? y3.length : l4, c3 = i6.thickness, s3 = void 0 === c3 ? y3.thickness : c3, h2 = i6.direction, g5 = void 0 === h2 ? y3.direction : h2, f2 = i6.tickPosition, m4 = void 0 === f2 ? y3.tickPosition : f2, v5 = i6.tickSize, u2 = void 0 === v5 ? y3.tickSize : v5, k4 = i6.tickSpacing, x3 = void 0 === k4 ? y3.tickSpacing : k4, b5 = i6.tickOverlap, S3 = void 0 === b5 ? y3.tickOverlap : b5, W5 = i6.tickFormat, z6 = void 0 === W5 ? y3.tickFormat : W5, C6 = i6.title, w4 = i6.titleAlign, X2 = void 0 === w4 ? y3.titleAlign : w4, Y3 = i6.titleOffset, O5 = A3({ scale: n7, ticks: r6, length: a5, thickness: s3, direction: g5, tickPosition: m4, tickSize: u2, tickSpacing: x3, tickOverlap: S3, tickFormat: z6, title: C6, titleAlign: X2, titleOffset: void 0 === Y3 ? y3.titleOffset : Y3 }), B3 = O5.width, H2 = O5.height, E4 = O5.gradientX1, j5 = O5.gradientY1, L2 = O5.gradientX2, M3 = O5.gradientY2, F2 = O5.ticks, T4 = O5.colorStops, P4 = O5.titleText, V3 = O5.titleX, R3 = O5.titleY, D3 = O5.titleRotation, q3 = O5.titleVerticalAlign, G2 = O5.titleHorizontalAlign, I2 = zt(), N3 = "ContinuousColorsLegendSvgGradient." + g5 + "." + T4.map(function(t8) {
    return t8.offset;
  }).join("_");
  return (0, import_jsx_runtime4.jsxs)("g", { children: [(0, import_jsx_runtime4.jsx)("defs", { children: (0, import_jsx_runtime4.jsx)("linearGradient", { id: N3, x1: E4, y1: j5, x2: L2, y2: M3, children: T4.map(function(e8) {
    return (0, import_jsx_runtime4.jsx)("stop", p3({}, e8));
  }) }) }), P4 && (0, import_jsx_runtime4.jsx)("text", { transform: "translate(" + V3 + ", " + R3 + ") rotate(" + D3 + ")", textAnchor: G2, dominantBaseline: q3, style: I2.legends.title.text, children: P4 }), (0, import_jsx_runtime4.jsx)("rect", { width: B3, height: H2, fill: "url(#" + N3 }), F2.map(function(i7, n8) {
    return (0, import_jsx_runtime4.jsxs)(import_react5.Fragment, { children: [(0, import_jsx_runtime4.jsx)("line", { x1: i7.x1, y1: i7.y1, x2: i7.x2, y2: i7.y2, style: I2.legends.ticks.line }), (0, import_jsx_runtime4.jsx)("text", { x: i7.textX, y: i7.textY, textAnchor: i7.textHorizontalAlign, dominantBaseline: i7.textVerticalAlign, style: I2.legends.ticks.text, children: i7.text })] }, n8);
  })] });
};
var z4 = ["containerWidth", "containerHeight", "anchor", "translateX", "translateY", "length", "thickness", "direction"];
var C4 = function(e8) {
  var i6, n7, o5 = e8.containerWidth, r6 = e8.containerHeight, l4 = e8.anchor, a5 = e8.translateX, c3 = void 0 === a5 ? 0 : a5, d3 = e8.translateY, s3 = void 0 === d3 ? 0 : d3, h2 = e8.length, g5 = void 0 === h2 ? y3.length : h2, f2 = e8.thickness, m4 = void 0 === f2 ? y3.thickness : f2, v5 = e8.direction, u2 = void 0 === v5 ? y3.direction : v5, k4 = function(t8, e9) {
    if (null == t8) return {};
    var i7, n8, o6 = {}, r7 = Object.keys(t8);
    for (n8 = 0; n8 < r7.length; n8++) i7 = r7[n8], e9.indexOf(i7) >= 0 || (o6[i7] = t8[i7]);
    return o6;
  }(e8, z4);
  "row" === u2 ? (i6 = g5, n7 = m4) : (i6 = m4, n7 = g5);
  var x3 = b3({ anchor: l4, translateX: c3, translateY: s3, containerWidth: o5, containerHeight: r6, width: i6, height: n7 }), S3 = x3.x, A4 = x3.y;
  return (0, import_jsx_runtime4.jsx)("g", { transform: "translate(" + S3 + ", " + A4 + ")", children: (0, import_jsx_runtime4.jsx)(W3, p3({ length: g5, thickness: m4, direction: u2 }, k4)) });
};
var E2 = function(t8, e8) {
  var i6 = e8.containerWidth, n7 = e8.containerHeight, o5 = e8.anchor, r6 = e8.translateX, a5 = void 0 === r6 ? 0 : r6, c3 = e8.translateY, d3 = void 0 === c3 ? 0 : c3, s3 = e8.scale, h2 = e8.length, g5 = void 0 === h2 ? y3.length : h2, f2 = e8.thickness, m4 = void 0 === f2 ? y3.thickness : f2, v5 = e8.direction, u2 = void 0 === v5 ? y3.direction : v5, p5 = e8.ticks, k4 = e8.tickPosition, x3 = void 0 === k4 ? y3.tickPosition : k4, S3 = e8.tickSize, W5 = void 0 === S3 ? y3.tickSize : S3, z6 = e8.tickSpacing, C6 = void 0 === z6 ? y3.tickSpacing : z6, w4 = e8.tickOverlap, X2 = void 0 === w4 ? y3.tickOverlap : w4, Y3 = e8.tickFormat, O5 = void 0 === Y3 ? y3.tickFormat : Y3, B3 = e8.title, H2 = e8.titleAlign, E4 = void 0 === H2 ? y3.titleAlign : H2, j5 = e8.titleOffset, L2 = void 0 === j5 ? y3.titleOffset : j5, M3 = e8.theme, F2 = A3({ scale: s3, ticks: p5, length: g5, thickness: m4, direction: u2, tickPosition: x3, tickSize: W5, tickSpacing: C6, tickOverlap: X2, tickFormat: O5, title: B3, titleAlign: E4, titleOffset: L2 }), T4 = F2.width, P4 = F2.height, V3 = F2.gradientX1, R3 = F2.gradientY1, D3 = F2.gradientX2, q3 = F2.gradientY2, G2 = F2.colorStops, I2 = F2.ticks, N3 = F2.titleText, _2 = F2.titleX, J4 = F2.titleY, K3 = F2.titleRotation, Q2 = F2.titleVerticalAlign, U2 = F2.titleHorizontalAlign, Z2 = b3({ anchor: o5, translateX: a5, translateY: d3, containerWidth: i6, containerHeight: n7, width: T4, height: P4 }), $2 = Z2.x, tt2 = Z2.y, et2 = { font: t8.font, textAlign: t8.textAlign, textBaseline: t8.textBaseline };
  t8.save(), t8.translate($2, tt2);
  var it2 = t8.createLinearGradient(V3 * T4, R3 * P4, D3 * T4, q3 * P4);
  G2.forEach(function(t9) {
    it2.addColorStop(t9.offset, t9.stopColor);
  }), t8.fillStyle = it2, t8.fillRect(0, 0, T4, P4), t8.font = (M3.legends.ticks.text.fontWeight ? M3.legends.ticks.text.fontWeight + " " : "") + M3.legends.ticks.text.fontSize + "px " + M3.legends.ticks.text.fontFamily, I2.forEach(function(e9) {
    var i7;
    (null != (i7 = M3.legends.ticks.line.strokeWidth) ? i7 : 0) > 0 && (t8.lineWidth = Number(M3.axis.ticks.line.strokeWidth), M3.axis.ticks.line.stroke && (t8.strokeStyle = M3.axis.ticks.line.stroke), t8.lineCap = "square", t8.beginPath(), t8.moveTo(e9.x1, e9.y1), t8.lineTo(e9.x2, e9.y2), t8.stroke()), M3.legends.ticks.text.fill && (t8.fillStyle = M3.legends.ticks.text.fill), t8.textAlign = "middle" === e9.textHorizontalAlign ? "center" : e9.textHorizontalAlign, t8.textBaseline = "central" === e9.textVerticalAlign ? "middle" : e9.textVerticalAlign, t8.fillText(e9.text, e9.textX, e9.textY);
  }), N3 && (t8.save(), t8.translate(_2, J4), t8.rotate(Ht(K3)), t8.font = (M3.legends.title.text.fontWeight ? M3.legends.title.text.fontWeight + " " : "") + M3.legends.title.text.fontSize + "px " + M3.legends.title.text.fontFamily, M3.legends.title.text.fill && (t8.fillStyle = M3.legends.title.text.fill), t8.textAlign = "middle" === U2 ? "center" : U2, t8.textBaseline = Q2, t8.fillText(N3, 0, 0), t8.restore()), t8.restore(), t8.font = et2.font, t8.textAlign = et2.textAlign, t8.textBaseline = et2.textBaseline;
};

// node_modules/@nivo/heatmap/node_modules/@nivo/annotations/dist/nivo-annotations.es.js
var import_react6 = __toESM(require_react());
var import_filter = __toESM(require_filter());
var import_isNumber = __toESM(require_isNumber());
var import_omit = __toESM(require_omit());
var import_jsx_runtime5 = __toESM(require_jsx_runtime());
function g4() {
  return g4 = Object.assign ? Object.assign.bind() : function(t8) {
    for (var n7 = 1; n7 < arguments.length; n7++) {
      var i6 = arguments[n7];
      for (var o5 in i6) Object.prototype.hasOwnProperty.call(i6, o5) && (t8[o5] = i6[o5]);
    }
    return t8;
  }, g4.apply(this, arguments);
}
var k3 = { dotSize: 4, noteWidth: 120, noteTextOffset: 8, animate: true };
var W4 = function(n7) {
  var i6 = typeof n7;
  return (0, import_react6.isValidElement)(n7) || "string" === i6 || "function" === i6 || "object" === i6;
};
var v4 = function(t8) {
  var n7 = typeof t8;
  return "string" === n7 || "function" === n7;
};
var b4 = function(t8) {
  return "circle" === t8.type;
};
var w3 = function(t8) {
  return "dot" === t8.type;
};
var z5 = function(t8) {
  return "rect" === t8.type;
};
var P3 = function(t8) {
  var n7 = t8.data, i6 = t8.annotations, e8 = t8.getPosition, r6 = t8.getDimensions;
  return i6.reduce(function(t9, i7) {
    var s3 = i7.offset || 0;
    return [].concat(t9, (0, import_filter.default)(n7, i7.match).map(function(t10) {
      var n8 = e8(t10), o5 = r6(t10);
      return (b4(i7) || z5(i7)) && (o5.size = o5.size + 2 * s3, o5.width = o5.width + 2 * s3, o5.height = o5.height + 2 * s3), g4({}, (0, import_omit.default)(i7, ["match", "offset"]), n8, o5, { size: i7.size || o5.size, datum: t10 });
    }));
  }, []);
};
var C5 = function(t8, n7, i6, o5) {
  var e8 = Math.atan2(o5 - n7, i6 - t8);
  return Qt(Kt(e8));
};
var O4 = function(t8) {
  var n7, i6, o5 = t8.x, a5 = t8.y, r6 = t8.noteX, s3 = t8.noteY, h2 = t8.noteWidth, d3 = void 0 === h2 ? k3.noteWidth : h2, c3 = t8.noteTextOffset, f2 = void 0 === c3 ? k3.noteTextOffset : c3;
  if ((0, import_isNumber.default)(r6)) n7 = o5 + r6;
  else {
    if (void 0 === r6.abs) throw new Error("noteX should be either a number or an object containing an 'abs' property");
    n7 = r6.abs;
  }
  if ((0, import_isNumber.default)(s3)) i6 = a5 + s3;
  else {
    if (void 0 === s3.abs) throw new Error("noteY should be either a number or an object containing an 'abs' property");
    i6 = s3.abs;
  }
  var y4 = o5, x3 = a5, m4 = C5(o5, a5, n7, i6);
  if (b4(t8)) {
    var p5 = Jt(Ht(m4), t8.size / 2);
    y4 += p5.x, x3 += p5.y;
  }
  if (z5(t8)) {
    var g5 = Math.round((m4 + 90) / 45) % 8;
    0 === g5 && (x3 -= t8.height / 2), 1 === g5 && (y4 += t8.width / 2, x3 -= t8.height / 2), 2 === g5 && (y4 += t8.width / 2), 3 === g5 && (y4 += t8.width / 2, x3 += t8.height / 2), 4 === g5 && (x3 += t8.height / 2), 5 === g5 && (y4 -= t8.width / 2, x3 += t8.height / 2), 6 === g5 && (y4 -= t8.width / 2), 7 === g5 && (y4 -= t8.width / 2, x3 -= t8.height / 2);
  }
  var W5 = n7, v5 = n7;
  return (m4 + 90) % 360 > 180 ? (W5 -= d3, v5 -= d3) : v5 += d3, { points: [[y4, x3], [n7, i6], [v5, i6]], text: [W5, i6 - f2], angle: m4 + 90 };
};
var S2 = function(t8) {
  var i6 = t8.data, o5 = t8.annotations, e8 = t8.getPosition, a5 = t8.getDimensions;
  return (0, import_react6.useMemo)(function() {
    return P3({ data: i6, annotations: o5, getPosition: e8, getDimensions: a5 });
  }, [i6, o5, e8, a5]);
};
var j3 = function(t8) {
  var i6 = t8.annotations;
  return (0, import_react6.useMemo)(function() {
    return i6.map(function(t9) {
      return g4({}, t9, { computed: O4(g4({}, t9)) });
    });
  }, [i6]);
};
var M2 = function(t8) {
  return (0, import_react6.useMemo)(function() {
    return O4(t8);
  }, [t8]);
};
var T3 = function(t8) {
  var n7 = t8.datum, o5 = t8.x, e8 = t8.y, r6 = t8.note, s3 = zt(), l4 = Ur(), u2 = l4.animate, c3 = l4.config, k4 = useSpring({ x: o5, y: e8, config: c3, immediate: !u2 });
  return "function" == typeof r6 ? (0, import_react6.createElement)(r6, { x: o5, y: e8, datum: n7 }) : (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [s3.annotations.text.outlineWidth > 0 && (0, import_jsx_runtime5.jsx)(animated.text, { x: k4.x, y: k4.y, style: g4({}, s3.annotations.text, { strokeLinejoin: "round", strokeWidth: 2 * s3.annotations.text.outlineWidth, stroke: s3.annotations.text.outlineColor }), children: r6 }), (0, import_jsx_runtime5.jsx)(animated.text, { x: k4.x, y: k4.y, style: (0, import_omit.default)(s3.annotations.text, ["outlineWidth", "outlineColor"]), children: r6 })] });
};
var E3 = function(t8) {
  var i6 = t8.points, o5 = t8.isOutline, e8 = void 0 !== o5 && o5, a5 = zt(), r6 = (0, import_react6.useMemo)(function() {
    var t9 = i6[0];
    return i6.slice(1).reduce(function(t10, n7) {
      return t10 + " L" + n7[0] + "," + n7[1];
    }, "M" + t9[0] + "," + t9[1]);
  }, [i6]), s3 = Fr(r6);
  if (e8 && a5.annotations.link.outlineWidth <= 0) return null;
  var l4 = g4({}, a5.annotations.link);
  return e8 && (l4.strokeLinecap = "square", l4.strokeWidth = a5.annotations.link.strokeWidth + 2 * a5.annotations.link.outlineWidth, l4.stroke = a5.annotations.link.outlineColor, l4.opacity = a5.annotations.link.outlineOpacity), (0, import_jsx_runtime5.jsx)(animated.path, { fill: "none", d: s3, style: l4 });
};
var I = function(t8) {
  var n7 = t8.x, i6 = t8.y, o5 = t8.size, e8 = zt(), a5 = Ur(), r6 = a5.animate, s3 = a5.config, l4 = useSpring({ x: n7, y: i6, radius: o5 / 2, config: s3, immediate: !r6 });
  return (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [e8.annotations.outline.outlineWidth > 0 && (0, import_jsx_runtime5.jsx)(animated.circle, { cx: l4.x, cy: l4.y, r: l4.radius, style: g4({}, e8.annotations.outline, { fill: "none", strokeWidth: e8.annotations.outline.strokeWidth + 2 * e8.annotations.outline.outlineWidth, stroke: e8.annotations.outline.outlineColor, opacity: e8.annotations.outline.outlineOpacity }) }), (0, import_jsx_runtime5.jsx)(animated.circle, { cx: l4.x, cy: l4.y, r: l4.radius, style: e8.annotations.outline })] });
};
var D = function(t8) {
  var n7 = t8.x, i6 = t8.y, o5 = t8.size, e8 = void 0 === o5 ? k3.dotSize : o5, a5 = zt(), r6 = Ur(), s3 = r6.animate, l4 = r6.config, u2 = useSpring({ x: n7, y: i6, radius: e8 / 2, config: l4, immediate: !s3 });
  return (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [a5.annotations.outline.outlineWidth > 0 && (0, import_jsx_runtime5.jsx)(animated.circle, { cx: u2.x, cy: u2.y, r: u2.radius, style: g4({}, a5.annotations.outline, { fill: "none", strokeWidth: 2 * a5.annotations.outline.outlineWidth, stroke: a5.annotations.outline.outlineColor, opacity: a5.annotations.outline.outlineOpacity }) }), (0, import_jsx_runtime5.jsx)(animated.circle, { cx: u2.x, cy: u2.y, r: u2.radius, style: a5.annotations.symbol })] });
};
var L = function(t8) {
  var n7 = t8.x, i6 = t8.y, o5 = t8.width, e8 = t8.height, a5 = t8.borderRadius, r6 = void 0 === a5 ? 6 : a5, s3 = zt(), l4 = Ur(), u2 = l4.animate, c3 = l4.config, k4 = useSpring({ x: n7 - o5 / 2, y: i6 - e8 / 2, width: o5, height: e8, config: c3, immediate: !u2 });
  return (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [s3.annotations.outline.outlineWidth > 0 && (0, import_jsx_runtime5.jsx)(animated.rect, { x: k4.x, y: k4.y, rx: r6, ry: r6, width: k4.width, height: k4.height, style: g4({}, s3.annotations.outline, { fill: "none", strokeWidth: s3.annotations.outline.strokeWidth + 2 * s3.annotations.outline.outlineWidth, stroke: s3.annotations.outline.outlineColor, opacity: s3.annotations.outline.outlineOpacity }) }), (0, import_jsx_runtime5.jsx)(animated.rect, { x: k4.x, y: k4.y, rx: r6, ry: r6, width: k4.width, height: k4.height, style: s3.annotations.outline })] });
};
var R = function(t8) {
  var n7 = t8.datum, i6 = t8.x, o5 = t8.y, e8 = t8.note, a5 = M2(t8);
  if (!W4(e8)) throw new Error("note should be a valid react element");
  return (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [(0, import_jsx_runtime5.jsx)(E3, { points: a5.points, isOutline: true }), b4(t8) && (0, import_jsx_runtime5.jsx)(I, { x: i6, y: o5, size: t8.size }), w3(t8) && (0, import_jsx_runtime5.jsx)(D, { x: i6, y: o5, size: t8.size }), z5(t8) && (0, import_jsx_runtime5.jsx)(L, { x: i6, y: o5, width: t8.width, height: t8.height, borderRadius: t8.borderRadius }), (0, import_jsx_runtime5.jsx)(E3, { points: a5.points }), (0, import_jsx_runtime5.jsx)(T3, { datum: n7, x: a5.text[0], y: a5.text[1], note: e8 })] });
};
var q2 = function(t8, n7) {
  n7.forEach(function(n8, i6) {
    var o5 = n8[0], e8 = n8[1];
    0 === i6 ? t8.moveTo(o5, e8) : t8.lineTo(o5, e8);
  });
};
var J2 = function(t8, n7) {
  var i6 = n7.annotations, o5 = n7.theme;
  0 !== i6.length && (t8.save(), i6.forEach(function(n8) {
    if (!v4(n8.note)) throw new Error("note is invalid for canvas implementation");
    o5.annotations.link.outlineWidth > 0 && (t8.lineCap = "square", t8.strokeStyle = o5.annotations.link.outlineColor, t8.lineWidth = o5.annotations.link.strokeWidth + 2 * o5.annotations.link.outlineWidth, t8.beginPath(), q2(t8, n8.computed.points), t8.stroke(), t8.lineCap = "butt"), b4(n8) && o5.annotations.outline.outlineWidth > 0 && (t8.strokeStyle = o5.annotations.outline.outlineColor, t8.lineWidth = o5.annotations.outline.strokeWidth + 2 * o5.annotations.outline.outlineWidth, t8.beginPath(), t8.arc(n8.x, n8.y, n8.size / 2, 0, 2 * Math.PI), t8.stroke()), w3(n8) && o5.annotations.symbol.outlineWidth > 0 && (t8.strokeStyle = o5.annotations.symbol.outlineColor, t8.lineWidth = 2 * o5.annotations.symbol.outlineWidth, t8.beginPath(), t8.arc(n8.x, n8.y, n8.size / 2, 0, 2 * Math.PI), t8.stroke()), z5(n8) && o5.annotations.outline.outlineWidth > 0 && (t8.strokeStyle = o5.annotations.outline.outlineColor, t8.lineWidth = o5.annotations.outline.strokeWidth + 2 * o5.annotations.outline.outlineWidth, t8.beginPath(), t8.rect(n8.x - n8.width / 2, n8.y - n8.height / 2, n8.width, n8.height), t8.stroke()), t8.strokeStyle = o5.annotations.link.stroke, t8.lineWidth = o5.annotations.link.strokeWidth, t8.beginPath(), q2(t8, n8.computed.points), t8.stroke(), b4(n8) && (t8.strokeStyle = o5.annotations.outline.stroke, t8.lineWidth = o5.annotations.outline.strokeWidth, t8.beginPath(), t8.arc(n8.x, n8.y, n8.size / 2, 0, 2 * Math.PI), t8.stroke()), w3(n8) && (t8.fillStyle = o5.annotations.symbol.fill, t8.beginPath(), t8.arc(n8.x, n8.y, n8.size / 2, 0, 2 * Math.PI), t8.fill()), z5(n8) && (t8.strokeStyle = o5.annotations.outline.stroke, t8.lineWidth = o5.annotations.outline.strokeWidth, t8.beginPath(), t8.rect(n8.x - n8.width / 2, n8.y - n8.height / 2, n8.width, n8.height), t8.stroke()), "function" == typeof n8.note ? n8.note(t8, { datum: n8.datum, x: n8.computed.text[0], y: n8.computed.text[1], theme: o5 }) : (t8.font = o5.annotations.text.fontSize + "px " + o5.annotations.text.fontFamily, t8.textAlign = "left", t8.textBaseline = "alphabetic", t8.fillStyle = o5.annotations.text.fill, t8.strokeStyle = o5.annotations.text.outlineColor, t8.lineWidth = 2 * o5.annotations.text.outlineWidth, o5.annotations.text.outlineWidth > 0 && (t8.lineJoin = "round", t8.strokeText(n8.note, n8.computed.text[0], n8.computed.text[1]), t8.lineJoin = "miter"), t8.fillText(n8.note, n8.computed.text[0], n8.computed.text[1]));
  }), t8.restore());
};

// node_modules/@nivo/heatmap/dist/nivo-heatmap.es.js
var import_jsx_runtime6 = __toESM(require_jsx_runtime());
function Y2() {
  return Y2 = Object.assign ? Object.assign.bind() : function(e8) {
    for (var t8 = 1; t8 < arguments.length; t8++) {
      var i6 = arguments[t8];
      for (var o5 in i6) Object.prototype.hasOwnProperty.call(i6, o5) && (e8[o5] = i6[o5]);
    }
    return e8;
  }, Y2.apply(this, arguments);
}
function G(e8, t8) {
  if (null == e8) return {};
  var i6, o5, n7 = {}, r6 = Object.keys(e8);
  for (o5 = 0; o5 < r6.length; o5++) i6 = r6[o5], t8.indexOf(i6) >= 0 || (n7[i6] = e8[i6]);
  return n7;
}
var j4 = { layers: ["grid", "axes", "cells", "legends", "annotations"], forceSquare: false, xInnerPadding: 0, xOuterPadding: 0, yInnerPadding: 0, yOuterPadding: 0, sizeVariation: false, opacity: 1, activeOpacity: 1, inactiveOpacity: 0.15, borderWidth: 0, borderColor: { from: "color", modifiers: [["darker", 0.8]] }, enableGridX: false, enableGridY: false, enableLabels: true, label: "formattedValue", labelTextColor: { from: "color", modifiers: [["darker", 2]] }, colors: { type: "sequential", scheme: "brown_blueGreen" }, emptyColor: "#000000", legends: [], annotations: [], isInteractive: true, hoverTarget: "rowColumn", tooltip: (0, import_react7.memo)(function(e8) {
  var t8 = e8.cell;
  return null === t8.formattedValue ? null : (0, import_jsx_runtime6.jsx)(w, { id: t8.serieId + " - " + t8.data.x, value: t8.formattedValue, enableChip: true, color: t8.color });
}), animate: true, motionConfig: "gentle" };
var H = Y2({}, j4, { axisTop: {}, axisRight: null, axisBottom: null, axisLeft: {}, borderRadius: 0, cellComponent: "rect" });
var D2 = Y2({}, j4, { axisTop: {}, axisRight: null, axisBottom: null, axisLeft: {}, renderCell: "rect", pixelRatio: "undefined" != typeof window && window.devicePixelRatio || 1 });
var _ = function(e8) {
  var t8 = e8.width, i6 = e8.height, o5 = e8.rows, n7 = e8.columns, r6 = t8, a5 = i6, l4 = 0, d3 = 0;
  if (e8.forceSquare) {
    var c3 = Math.max(t8 / n7, 0), u2 = Math.max(i6 / o5, 0), s3 = Math.min(c3, u2);
    l4 = (t8 - (r6 = s3 * n7)) / 2, d3 = (i6 - (a5 = s3 * o5)) / 2;
  }
  return { offsetX: l4, offsetY: d3, width: r6, height: a5 };
};
var J3 = function(e8) {
  var t8 = e8.data, i6 = e8.width, o5 = e8.height, n7 = e8.xInnerPadding, r6 = e8.xOuterPadding, a5 = e8.yInnerPadding, l4 = e8.yOuterPadding, d3 = e8.forceSquare, c3 = /* @__PURE__ */ new Set(), u2 = [], s3 = [], h2 = [];
  t8.forEach(function(e9) {
    u2.push(e9.id), e9.data.forEach(function(t9) {
      c3.add(t9.x);
      var i7 = null;
      void 0 !== t9.y && null !== t9.y && (s3.push(t9.y), i7 = t9.y), h2.push({ id: e9.id + "." + t9.x, serieId: e9.id, value: i7, data: t9 });
    });
  });
  var v5 = Array.from(c3), f2 = _({ width: i6, height: o5, columns: v5.length, rows: u2.length, forceSquare: d3 }), g5 = f2.width, b5 = f2.height, p5 = f2.offsetX, y4 = f2.offsetY, m4 = nn2(band().domain(v5).range([0, g5]).paddingOuter(r6).paddingInner(n7)), x3 = nn2(band().domain(u2).range([0, b5]).paddingOuter(l4).paddingInner(a5)), C6 = m4.bandwidth(), w4 = x3.bandwidth(), P4 = h2.map(function(e9) {
    return Y2({}, e9, { x: m4(e9.data.x) + C6 / 2, y: x3(e9.serieId) + w4 / 2, width: C6, height: w4 });
  });
  return { width: g5, height: b5, offsetX: p5, offsetY: y4, xScale: m4, yScale: x3, minValue: Math.min.apply(Math, s3), maxValue: Math.max.apply(Math, s3), cells: P4 };
};
var K2 = function(e8, t8, i6) {
  if (!e8) return function() {
    return 1;
  };
  var o5 = linear().domain(e8.values ? e8.values : [t8, i6]).range(e8.sizes);
  return function(e9) {
    return null === e9 ? 1 : o5(e9);
  };
};
var N2 = function(e8) {
  return { x: e8.x, y: e8.y };
};
var Q = function(e8) {
  return { size: Math.max(e8.width, e8.height), width: e8.width, height: e8.height };
};
var U = function(e8) {
  var i6 = e8.data, o5 = e8.width, n7 = e8.height, r6 = e8.xInnerPadding, a5 = e8.xOuterPadding, l4 = e8.yInnerPadding, d3 = e8.yOuterPadding, c3 = e8.forceSquare;
  return (0, import_react7.useMemo)(function() {
    return J3({ data: i6, width: o5, height: n7, xInnerPadding: r6, xOuterPadding: a5, yInnerPadding: l4, yOuterPadding: d3, forceSquare: c3 });
  }, [i6, o5, n7, r6, a5, l4, d3, c3]);
};
var Z = { cell: function(e8, t8) {
  return e8.id === t8.id;
}, row: function(e8, t8) {
  return e8.serieId === t8.serieId;
}, column: function(e8, t8) {
  return e8.data.x === t8.data.x;
}, rowColumn: function(e8, t8) {
  return e8.serieId === t8.serieId || e8.data.x === t8.data.x;
} };
var $ = function(e8) {
  var i6, n7, r6, a5 = e8.cells, l4 = e8.minValue, s3 = e8.maxValue, h2 = e8.sizeVariation, v5 = e8.colors, f2 = e8.emptyColor, g5 = e8.opacity, b5 = e8.activeOpacity, p5 = e8.inactiveOpacity, y4 = e8.borderColor, m4 = e8.label, x3 = e8.labelTextColor, C6 = e8.valueFormat, w4 = e8.activeIds, P4 = (0, import_react7.useMemo)(function() {
    return K2(i6, n7, r6);
  }, [i6 = h2, n7 = l4, r6 = s3]), S3 = (0, import_react7.useMemo)(function() {
    return "function" == typeof v5 ? null : lr(v5, { min: l4, max: s3 });
  }, [v5, l4, s3]), M3 = (0, import_react7.useCallback)(function(e9) {
    if (null !== e9.value) {
      if ("function" == typeof v5) return v5(e9);
      if (null !== S3) return S3(e9.value);
    }
    return f2;
  }, [v5, S3, f2]), T4 = zt(), W5 = Xe(y4, T4), L2 = Xe(x3, T4), k4 = Ot(C6), V3 = Wn(m4);
  return { cells: (0, import_react7.useMemo)(function() {
    return a5.map(function(e9) {
      var t8 = g5;
      w4.length > 0 && (t8 = w4.includes(e9.id) ? b5 : p5);
      var i7 = P4(e9.value), o5 = Y2({}, e9, { width: e9.width * i7, height: e9.height * i7, formattedValue: null !== e9.value ? k4(e9.value) : null, opacity: t8 });
      return o5.label = V3(o5), o5.color = M3(o5), o5.borderColor = W5(o5), o5.labelTextColor = L2(o5), o5;
    });
  }, [a5, P4, M3, W5, L2, k4, V3, w4, g5, b5, p5]), colorScale: S3 };
};
var ee = function(e8) {
  var o5 = e8.data, n7 = e8.valueFormat, r6 = e8.width, a5 = e8.height, l4 = e8.xOuterPadding, d3 = void 0 === l4 ? j4.xOuterPadding : l4, c3 = e8.xInnerPadding, u2 = void 0 === c3 ? j4.xInnerPadding : c3, s3 = e8.yOuterPadding, h2 = void 0 === s3 ? j4.yOuterPadding : s3, v5 = e8.yInnerPadding, f2 = void 0 === v5 ? j4.yInnerPadding : v5, g5 = e8.forceSquare, b5 = void 0 === g5 ? j4.forceSquare : g5, p5 = e8.sizeVariation, y4 = void 0 === p5 ? j4.sizeVariation : p5, m4 = e8.colors, x3 = void 0 === m4 ? j4.colors : m4, C6 = e8.emptyColor, w4 = void 0 === C6 ? j4.emptyColor : C6, P4 = e8.opacity, O5 = void 0 === P4 ? j4.opacity : P4, I2 = e8.activeOpacity, S3 = void 0 === I2 ? j4.activeOpacity : I2, M3 = e8.inactiveOpacity, T4 = void 0 === M3 ? j4.inactiveOpacity : M3, W5 = e8.borderColor, L2 = void 0 === W5 ? j4.borderColor : W5, k4 = e8.label, V3 = void 0 === k4 ? j4.label : k4, R3 = e8.labelTextColor, B3 = void 0 === R3 ? j4.labelTextColor : R3, q3 = e8.hoverTarget, E4 = void 0 === q3 ? j4.hoverTarget : q3, z6 = (0, import_react7.useState)(null), A4 = z6[0], F2 = z6[1], X2 = U({ data: o5, width: r6, height: a5, xOuterPadding: d3, xInnerPadding: u2, yOuterPadding: h2, yInnerPadding: f2, forceSquare: b5 }), Y3 = X2.width, G2 = X2.height, H2 = X2.offsetX, D3 = X2.offsetY, _2 = X2.cells, J4 = X2.xScale, K3 = X2.yScale, N3 = X2.minValue, Q2 = X2.maxValue, ee2 = (0, import_react7.useMemo)(function() {
    if (!A4) return [];
    var e9 = Z[E4];
    return _2.filter(function(t8) {
      return e9(t8, A4);
    }).map(function(e10) {
      return e10.id;
    });
  }, [_2, A4, E4]), te2 = $({ cells: _2, minValue: N3, maxValue: Q2, sizeVariation: y4, colors: x3, emptyColor: w4, opacity: O5, activeOpacity: S3, inactiveOpacity: T4, borderColor: L2, label: V3, labelTextColor: B3, valueFormat: n7, activeIds: ee2 });
  return { width: Y3, height: G2, offsetX: H2, offsetY: D3, cells: te2.cells, xScale: J4, yScale: K3, colorScale: te2.colorScale, activeCell: A4, setActiveCell: F2 };
};
var te = function(e8, t8) {
  return S2({ data: e8, annotations: t8, getPosition: N2, getDimensions: Q });
};
var ie = (0, import_react7.memo)(function(e8) {
  var i6 = e8.cell, o5 = e8.borderWidth, n7 = e8.borderRadius, r6 = e8.animatedProps, a5 = e8.onMouseEnter, l4 = e8.onMouseMove, c3 = e8.onMouseLeave, u2 = e8.onClick, s3 = e8.enableLabels, h2 = zt(), v5 = (0, import_react7.useMemo)(function() {
    return { onMouseEnter: a5 ? a5(i6) : void 0, onMouseMove: l4 ? l4(i6) : void 0, onMouseLeave: c3 ? c3(i6) : void 0, onClick: u2 ? u2(i6) : void 0 };
  }, [i6, a5, l4, c3, u2]);
  return (0, import_jsx_runtime6.jsxs)(animated.g, Y2({ "data-testid": "cell." + i6.id, style: { cursor: "pointer" }, opacity: r6.opacity }, v5, { transform: to([r6.x, r6.y, r6.scale], function(e9, t8, i7) {
    return "translate(" + e9 + ", " + t8 + ") scale(" + i7 + ")";
  }), children: [(0, import_jsx_runtime6.jsx)(animated.rect, { transform: to([r6.width, r6.height], function(e9, t8) {
    return "translate(" + -0.5 * e9 + ", " + -0.5 * t8 + ")";
  }), fill: r6.color, width: r6.width, height: r6.height, stroke: r6.borderColor, strokeWidth: o5, rx: n7, ry: n7 }, i6.id), s3 && (0, import_jsx_runtime6.jsx)(animated.text, { textAnchor: "middle", dominantBaseline: "central", fill: r6.labelTextColor, style: Y2({}, h2.labels.text, { fill: void 0, userSelect: "none" }), children: i6.label })] }));
});
var oe = (0, import_react7.memo)(function(e8) {
  var i6 = e8.cell, o5 = e8.borderWidth, n7 = e8.animatedProps, r6 = e8.onMouseEnter, a5 = e8.onMouseMove, l4 = e8.onMouseLeave, c3 = e8.onClick, u2 = e8.enableLabels, s3 = zt(), h2 = (0, import_react7.useMemo)(function() {
    return { onMouseEnter: r6 ? r6(i6) : void 0, onMouseMove: a5 ? a5(i6) : void 0, onMouseLeave: l4 ? l4(i6) : void 0, onClick: c3 ? c3(i6) : void 0 };
  }, [i6, r6, a5, l4, c3]);
  return (0, import_jsx_runtime6.jsxs)(animated.g, Y2({ "data-testid": "cell." + i6.id, style: { cursor: "pointer" }, opacity: n7.opacity }, h2, { transform: to([n7.x, n7.y], function(e9, t8) {
    return "translate(" + e9 + ", " + t8 + ")";
  }), children: [(0, import_jsx_runtime6.jsx)(animated.circle, { r: to([n7.width, n7.height], function(e9, t8) {
    return Math.min(e9, t8) / 2;
  }), fill: n7.color, fillOpacity: n7.opacity, strokeWidth: o5, stroke: n7.borderColor }), u2 && (0, import_jsx_runtime6.jsx)(animated.text, { dominantBaseline: "central", textAnchor: "middle", fill: n7.labelTextColor, style: Y2({}, s3.labels.text, { fill: void 0 }), children: i6.label })] }));
});
var ne = function(e8) {
  return { x: e8.x, y: e8.y, width: e8.width, height: e8.height, color: e8.color, opacity: 0, borderColor: e8.borderColor, labelTextColor: e8.labelTextColor, scale: 0 };
};
var re2 = function(e8) {
  return { x: e8.x, y: e8.y, width: e8.width, height: e8.height, color: e8.color, opacity: e8.opacity, borderColor: e8.borderColor, labelTextColor: e8.labelTextColor, scale: 1 };
};
var ae = function(e8) {
  return { x: e8.x, y: e8.y, width: e8.width, height: e8.height, color: e8.color, opacity: 0, borderColor: e8.borderColor, labelTextColor: e8.labelTextColor, scale: 0 };
};
var le = function(e8) {
  var i6, o5 = e8.cells, r6 = e8.cellComponent, a5 = e8.borderRadius, l4 = e8.borderWidth, d3 = e8.isInteractive, c3 = e8.setActiveCell, u2 = e8.onMouseEnter, h2 = e8.onMouseMove, v5 = e8.onMouseLeave, f2 = e8.onClick, g5 = e8.tooltip, b5 = e8.enableLabels, p5 = Ur(), y4 = p5.animate, m4 = p5.config, x3 = useTransition(o5, { keys: function(e9) {
    return e9.id;
  }, initial: re2, from: ne, enter: re2, update: re2, leave: ae, config: m4, immediate: !y4 }), C6 = k(), w4 = C6.showTooltipFromEvent, P4 = C6.hideTooltip, O5 = (0, import_react7.useMemo)(function() {
    if (d3) return function(e9) {
      return function(t8) {
        w4((0, import_react7.createElement)(g5, { cell: e9 }), t8), c3(e9), null == u2 || u2(e9, t8);
      };
    };
  }, [d3, w4, g5, c3, u2]), I2 = (0, import_react7.useMemo)(function() {
    if (d3) return function(e9) {
      return function(t8) {
        w4((0, import_react7.createElement)(g5, { cell: e9 }), t8), null == h2 || h2(e9, t8);
      };
    };
  }, [d3, w4, g5, h2]), S3 = (0, import_react7.useMemo)(function() {
    if (d3) return function(e9) {
      return function(t8) {
        P4(), c3(null), null == v5 || v5(e9, t8);
      };
    };
  }, [d3, P4, c3, v5]), M3 = (0, import_react7.useMemo)(function() {
    if (d3) return function(e9) {
      return function(t8) {
        null == f2 || f2(e9, t8);
      };
    };
  }, [d3, f2]);
  return i6 = "rect" === r6 ? ie : "circle" === r6 ? oe : r6, (0, import_jsx_runtime6.jsx)(import_jsx_runtime6.Fragment, { children: x3(function(e9, t8) {
    return (0, import_react7.createElement)(i6, { cell: t8, borderRadius: a5, borderWidth: l4, animatedProps: e9, enableLabels: b5, onMouseEnter: O5, onMouseMove: I2, onMouseLeave: S3, onClick: M3 });
  }) });
};
var de = function(e8) {
  var t8 = e8.cells, i6 = e8.annotations, o5 = te(t8, i6);
  return (0, import_jsx_runtime6.jsx)(import_jsx_runtime6.Fragment, { children: o5.map(function(e9, t9) {
    return (0, import_jsx_runtime6.jsx)(R, Y2({}, e9), t9);
  }) });
};
var ce = ["isInteractive", "animate", "motionConfig", "theme", "renderWrapper"];
var ue = function(e8) {
  var i6 = e8.data, o5 = e8.layers, a5 = void 0 === o5 ? H.layers : o5, l4 = e8.valueFormat, d3 = e8.width, c3 = e8.height, u2 = e8.margin, s3 = e8.forceSquare, h2 = void 0 === s3 ? H.forceSquare : s3, g5 = e8.xInnerPadding, b5 = void 0 === g5 ? H.xInnerPadding : g5, p5 = e8.xOuterPadding, x3 = void 0 === p5 ? H.xOuterPadding : p5, C6 = e8.yInnerPadding, P4 = void 0 === C6 ? H.yInnerPadding : C6, O5 = e8.yOuterPadding, I2 = void 0 === O5 ? H.yOuterPadding : O5, S3 = e8.sizeVariation, M3 = void 0 === S3 ? H.sizeVariation : S3, T4 = e8.cellComponent, W5 = void 0 === T4 ? H.cellComponent : T4, L2 = e8.opacity, k4 = void 0 === L2 ? H.opacity : L2, R3 = e8.activeOpacity, B3 = void 0 === R3 ? H.activeOpacity : R3, q3 = e8.inactiveOpacity, E4 = void 0 === q3 ? H.inactiveOpacity : q3, z6 = e8.borderRadius, A4 = void 0 === z6 ? H.borderRadius : z6, F2 = e8.borderWidth, X2 = void 0 === F2 ? H.borderWidth : F2, G2 = e8.borderColor, j5 = void 0 === G2 ? H.borderColor : G2, D3 = e8.enableGridX, _2 = void 0 === D3 ? H.enableGridX : D3, J4 = e8.enableGridY, K3 = void 0 === J4 ? H.enableGridY : J4, N3 = e8.axisTop, Q2 = void 0 === N3 ? H.axisTop : N3, U2 = e8.axisRight, Z2 = void 0 === U2 ? H.axisRight : U2, $2 = e8.axisBottom, te2 = void 0 === $2 ? H.axisBottom : $2, ie2 = e8.axisLeft, oe2 = void 0 === ie2 ? H.axisLeft : ie2, ne2 = e8.enableLabels, re3 = void 0 === ne2 ? H.enableLabels : ne2, ae2 = e8.label, ce2 = void 0 === ae2 ? H.label : ae2, ue2 = e8.labelTextColor, se2 = void 0 === ue2 ? H.labelTextColor : ue2, he2 = e8.colors, ve2 = void 0 === he2 ? H.colors : he2, fe2 = e8.emptyColor, ge2 = void 0 === fe2 ? H.emptyColor : fe2, be2 = e8.legends, pe2 = void 0 === be2 ? H.legends : be2, ye2 = e8.annotations, me = void 0 === ye2 ? H.annotations : ye2, xe = e8.isInteractive, Ce2 = void 0 === xe ? H.isInteractive : xe, we2 = e8.onMouseEnter, Pe2 = e8.onMouseMove, Oe2 = e8.onMouseLeave, Ie = e8.onClick, Se = e8.hoverTarget, Me2 = void 0 === Se ? H.hoverTarget : Se, Te2 = e8.tooltip, We2 = void 0 === Te2 ? H.tooltip : Te2, Le2 = e8.role, ke2 = e8.ariaLabel, Ve2 = e8.ariaLabelledBy, Re2 = e8.ariaDescribedBy, Be2 = wt(d3, c3, u2), qe2 = Be2.margin, Ee = Be2.innerWidth, ze = Be2.innerHeight, Ae = Be2.outerWidth, Fe2 = Be2.outerHeight, Xe2 = ee({ data: i6, valueFormat: l4, width: Ee, height: ze, forceSquare: h2, xInnerPadding: b5, xOuterPadding: x3, yInnerPadding: P4, yOuterPadding: I2, sizeVariation: M3, colors: ve2, emptyColor: ge2, opacity: k4, activeOpacity: B3, inactiveOpacity: E4, borderColor: j5, label: ce2, labelTextColor: se2, hoverTarget: Me2 }), Ye2 = Xe2.width, Ge2 = Xe2.height, je2 = Xe2.offsetX, He = Xe2.offsetY, De2 = Xe2.xScale, _e = Xe2.yScale, Je = Xe2.cells, Ke = Xe2.colorScale, Ne2 = Xe2.activeCell, Qe3 = Xe2.setActiveCell, Ue2 = (0, import_react7.useMemo)(function() {
    return Y2({}, qe2, { top: qe2.top + He, left: qe2.left + je2 });
  }, [qe2, je2, He]), Ze3 = { grid: null, axes: null, cells: null, legends: null, annotations: null };
  a5.includes("grid") && (Ze3.grid = (0, import_jsx_runtime6.jsx)(C3, { width: Ye2, height: Ge2, xScale: _2 ? De2 : null, yScale: K3 ? _e : null }, "grid")), a5.includes("axes") && (Ze3.axes = (0, import_jsx_runtime6.jsx)(B, { xScale: De2, yScale: _e, width: Ye2, height: Ge2, top: Q2, right: Z2, bottom: te2, left: oe2 }, "axes")), a5.includes("cells") && (Ze3.cells = (0, import_jsx_runtime6.jsx)(import_react7.Fragment, { children: (0, import_jsx_runtime6.jsx)(le, { cells: Je, cellComponent: W5, borderRadius: A4, borderWidth: X2, isInteractive: Ce2, setActiveCell: Qe3, onMouseEnter: we2, onMouseMove: Pe2, onMouseLeave: Oe2, onClick: Ie, tooltip: We2, enableLabels: re3 }) }, "cells")), a5.includes("legends") && null !== Ke && (Ze3.legends = (0, import_jsx_runtime6.jsx)(import_react7.Fragment, { children: pe2.map(function(e9, t8) {
    return (0, import_react7.createElement)(C4, Y2({}, e9, { key: t8, containerWidth: Ye2, containerHeight: Ge2, scale: Ke }));
  }) }, "legends")), a5.includes("annotations") && me.length > 0 && (Ze3.annotations = (0, import_jsx_runtime6.jsx)(de, { cells: Je, annotations: me }, "annotations"));
  var $e2 = { cells: Je, activeCell: Ne2, setActiveCell: Qe3 };
  return (0, import_jsx_runtime6.jsx)(gn, { width: Ae, height: Fe2, margin: Object.assign({}, Ue2, { top: Ue2.top, left: Ue2.left }), role: Le2, ariaLabel: ke2, ariaLabelledBy: Ve2, ariaDescribedBy: Re2, children: a5.map(function(e9, t8) {
    var i7;
    return "function" == typeof e9 ? (0, import_jsx_runtime6.jsx)(import_react7.Fragment, { children: (0, import_react7.createElement)(e9, $e2) }, t8) : null != (i7 = null == Ze3 ? void 0 : Ze3[e9]) ? i7 : null;
  }) });
};
var se = function(e8) {
  var t8 = e8.isInteractive, i6 = void 0 === t8 ? H.isInteractive : t8, o5 = e8.animate, n7 = void 0 === o5 ? H.animate : o5, r6 = e8.motionConfig, a5 = void 0 === r6 ? H.motionConfig : r6, l4 = e8.theme, d3 = e8.renderWrapper, c3 = G(e8, ce);
  return (0, import_jsx_runtime6.jsx)(St, { animate: n7, isInteractive: i6, motionConfig: a5, renderWrapper: d3, theme: l4, children: (0, import_jsx_runtime6.jsx)(ue, Y2({ isInteractive: i6 }, c3)) });
};
var he = function(e8) {
  return (0, import_jsx_runtime6.jsx)(It, { children: function(t8) {
    var i6 = t8.width, o5 = t8.height;
    return (0, import_jsx_runtime6.jsx)(se, Y2({ width: i6, height: o5 }, e8));
  } });
};
var ve = function(e8, t8) {
  var i6 = t8.cell, o5 = i6.x, n7 = i6.y, r6 = i6.width, a5 = i6.height, l4 = i6.color, d3 = i6.borderColor, c3 = i6.opacity, u2 = i6.labelTextColor, s3 = i6.label, h2 = t8.borderWidth, v5 = t8.enableLabels, f2 = t8.theme;
  e8.save(), e8.globalAlpha = c3, e8.fillStyle = l4, h2 > 0 && (e8.strokeStyle = d3, e8.lineWidth = h2), e8.fillRect(o5 - r6 / 2, n7 - a5 / 2, r6, a5), h2 > 0 && e8.strokeRect(o5 - r6 / 2, n7 - a5 / 2, r6, a5), v5 && (e8.fillStyle = u2, e8.font = (f2.labels.text.fontWeight ? f2.labels.text.fontWeight + " " : "") + f2.labels.text.fontSize + "px " + f2.labels.text.fontFamily, e8.textAlign = "center", e8.textBaseline = "middle", e8.fillText(s3, o5, n7)), e8.restore();
};
var fe = function(e8, t8) {
  var i6 = t8.cell, o5 = i6.x, n7 = i6.y, r6 = i6.width, a5 = i6.height, l4 = i6.color, d3 = i6.borderColor, c3 = i6.opacity, u2 = i6.labelTextColor, s3 = i6.label, h2 = t8.borderWidth, v5 = t8.enableLabels, f2 = t8.theme;
  e8.save(), e8.globalAlpha = c3;
  var g5 = Math.min(r6, a5) / 2;
  e8.fillStyle = l4, h2 > 0 && (e8.strokeStyle = d3, e8.lineWidth = h2), e8.beginPath(), e8.arc(o5, n7, g5, 0, 2 * Math.PI), e8.fill(), h2 > 0 && e8.stroke(), v5 && (e8.fillStyle = u2, e8.font = (f2.labels.text.fontWeight ? f2.labels.text.fontWeight + " " : "") + f2.labels.text.fontSize + "px " + f2.labels.text.fontFamily, e8.textAlign = "center", e8.textBaseline = "middle", e8.fillText(s3, o5, n7)), e8.restore();
};
var ge = ["theme", "isInteractive", "animate", "motionConfig", "renderWrapper"];
var be = function(e8) {
  var i6, r6 = e8.data, c3 = e8.layers, u2 = void 0 === c3 ? D2.layers : c3, s3 = e8.valueFormat, h2 = e8.width, f2 = e8.height, g5 = e8.margin, y4 = e8.xInnerPadding, m4 = void 0 === y4 ? D2.xInnerPadding : y4, w4 = e8.xOuterPadding, O5 = void 0 === w4 ? D2.xOuterPadding : w4, I2 = e8.yInnerPadding, S3 = void 0 === I2 ? D2.yInnerPadding : I2, M3 = e8.yOuterPadding, L2 = void 0 === M3 ? D2.yOuterPadding : M3, R3 = e8.forceSquare, B3 = void 0 === R3 ? D2.forceSquare : R3, q3 = e8.sizeVariation, E4 = void 0 === q3 ? D2.sizeVariation : q3, z6 = e8.renderCell, A4 = void 0 === z6 ? D2.renderCell : z6, F2 = e8.opacity, X2 = void 0 === F2 ? D2.opacity : F2, G2 = e8.activeOpacity, j5 = void 0 === G2 ? D2.activeOpacity : G2, H2 = e8.inactiveOpacity, _2 = void 0 === H2 ? D2.inactiveOpacity : H2, J4 = e8.borderWidth, K3 = void 0 === J4 ? D2.borderWidth : J4, N3 = e8.borderColor, Q2 = void 0 === N3 ? D2.borderColor : N3, U2 = e8.enableGridX, Z2 = void 0 === U2 ? D2.enableGridX : U2, $2 = e8.enableGridY, ie2 = void 0 === $2 ? D2.enableGridY : $2, oe2 = e8.axisTop, ne2 = void 0 === oe2 ? D2.axisTop : oe2, re3 = e8.axisRight, ae2 = void 0 === re3 ? D2.axisRight : re3, le2 = e8.axisBottom, de2 = void 0 === le2 ? D2.axisBottom : le2, ce2 = e8.axisLeft, ue2 = void 0 === ce2 ? D2.axisLeft : ce2, se2 = e8.enableLabels, he2 = void 0 === se2 ? D2.enableLabels : se2, ge2 = e8.label, be2 = void 0 === ge2 ? D2.label : ge2, pe2 = e8.labelTextColor, ye2 = void 0 === pe2 ? D2.labelTextColor : pe2, me = e8.colors, xe = void 0 === me ? D2.colors : me, Ce2 = e8.emptyColor, we2 = void 0 === Ce2 ? D2.emptyColor : Ce2, Pe2 = e8.legends, Oe2 = void 0 === Pe2 ? D2.legends : Pe2, Ie = e8.annotations, Se = void 0 === Ie ? D2.annotations : Ie, Me2 = e8.isInteractive, Te2 = void 0 === Me2 ? D2.isInteractive : Me2, We2 = e8.onClick, Le2 = e8.hoverTarget, ke2 = void 0 === Le2 ? D2.hoverTarget : Le2, Ve2 = e8.tooltip, Re2 = void 0 === Ve2 ? D2.tooltip : Ve2, Be2 = e8.role, qe2 = e8.ariaLabel, Ee = e8.ariaLabelledBy, ze = e8.ariaDescribedBy, Ae = e8.pixelRatio, Fe2 = void 0 === Ae ? D2.pixelRatio : Ae, Xe2 = (0, import_react7.useRef)(null), Ye2 = wt(h2, f2, g5), Ge2 = Ye2.margin, je2 = Ye2.innerWidth, He = Ye2.innerHeight, De2 = Ye2.outerWidth, _e = Ye2.outerHeight, Je = ee({ data: r6, valueFormat: s3, width: je2, height: He, xInnerPadding: m4, xOuterPadding: O5, yInnerPadding: S3, yOuterPadding: L2, forceSquare: B3, sizeVariation: E4, colors: xe, emptyColor: we2, opacity: X2, activeOpacity: j5, inactiveOpacity: _2, borderColor: Q2, label: be2, labelTextColor: ye2, hoverTarget: ke2 }), Ke = Je.width, Ne2 = Je.height, Qe3 = Je.offsetX, Ue2 = Je.offsetY, Ze3 = Je.xScale, $e2 = Je.yScale, et2 = Je.cells, tt2 = Je.colorScale, it2 = Je.activeCell, ot2 = Je.setActiveCell, nt2 = (0, import_react7.useMemo)(function() {
    return Y2({}, Ge2, { top: Ge2.top + Ue2, left: Ge2.left + Qe3 });
  }, [Ge2, Qe3, Ue2]), rt2 = te(et2, Se), at2 = j3({ annotations: rt2 });
  i6 = "function" == typeof A4 ? A4 : "circle" === A4 ? fe : ve;
  var lt = zt(), dt2 = (0, import_react7.useMemo)(function() {
    return { cells: et2, activeCell: it2, setActiveCell: ot2 };
  }, [et2, it2, ot2]);
  (0, import_react7.useEffect)(function() {
    if (null !== Xe2.current) {
      var e9 = Xe2.current.getContext("2d");
      e9 && (Xe2.current.width = De2 * Fe2, Xe2.current.height = _e * Fe2, e9.scale(Fe2, Fe2), e9.fillStyle = lt.background, e9.fillRect(0, 0, De2, _e), e9.translate(nt2.left, nt2.top), u2.forEach(function(t8) {
        "grid" === t8 ? (e9.lineWidth = lt.grid.line.strokeWidth, e9.strokeStyle = lt.grid.line.stroke, Z2 && z3(e9, { width: Ke, height: Ne2, scale: Ze3, axis: "x" }), ie2 && z3(e9, { width: Ke, height: Ne2, scale: $e2, axis: "y" })) : "axes" === t8 ? j2(e9, { xScale: Ze3, yScale: $e2, width: Ke, height: Ne2, top: ne2, right: ae2, bottom: de2, left: ue2, theme: lt }) : "cells" === t8 ? (e9.textAlign = "center", e9.textBaseline = "middle", et2.forEach(function(t9) {
          i6(e9, { cell: t9, borderWidth: K3, enableLabels: he2, theme: lt });
        })) : "legends" === t8 && null !== tt2 ? Oe2.forEach(function(t9) {
          E2(e9, Y2({}, t9, { containerWidth: Ke, containerHeight: Ne2, scale: tt2, theme: lt }));
        }) : "annotations" === t8 ? J2(e9, { annotations: at2, theme: lt }) : "function" == typeof t8 && t8(e9, dt2);
      }));
    }
  }, [Xe2, Fe2, De2, _e, Ke, Ne2, nt2, u2, dt2, et2, i6, Z2, ie2, ne2, ae2, de2, ue2, Ze3, $e2, lt, K3, he2, tt2, Oe2, at2]);
  var ct2 = k(), ut2 = ct2.showTooltipFromEvent, st = ct2.hideTooltip, ht2 = (0, import_react7.useCallback)(function(e9) {
    if (null !== Xe2.current) {
      var t8 = Sn(Xe2.current, e9), i7 = t8[0], o5 = t8[1], r7 = et2.find(function(e10) {
        return jn(e10.x + nt2.left - e10.width / 2, e10.y + nt2.top - e10.height / 2, e10.width, e10.height, i7, o5);
      });
      void 0 !== r7 ? (ot2(r7), ut2((0, import_react7.createElement)(Re2, { cell: r7 }), e9)) : (ot2(null), st());
    }
  }, [Xe2, et2, nt2, ot2, ut2, st, Re2]), vt2 = (0, import_react7.useCallback)(function() {
    ot2(null), st();
  }, [ot2, st]), ft = (0, import_react7.useCallback)(function(e9) {
    null !== it2 && (null == We2 || We2(it2, e9));
  }, [it2, We2]);
  return (0, import_jsx_runtime6.jsx)("canvas", { ref: Xe2, width: De2 * Fe2, height: _e * Fe2, style: { width: De2, height: _e }, onMouseEnter: Te2 ? ht2 : void 0, onMouseMove: Te2 ? ht2 : void 0, onMouseLeave: Te2 ? vt2 : void 0, onClick: Te2 ? ft : void 0, role: Be2, "aria-label": qe2, "aria-labelledby": Ee, "aria-describedby": ze });
};
var pe = function(e8) {
  var t8 = e8.theme, i6 = e8.isInteractive, o5 = void 0 === i6 ? D2.isInteractive : i6, n7 = e8.animate, r6 = void 0 === n7 ? D2.animate : n7, a5 = e8.motionConfig, l4 = void 0 === a5 ? D2.motionConfig : a5, d3 = e8.renderWrapper, c3 = G(e8, ge);
  return (0, import_jsx_runtime6.jsx)(St, { isInteractive: o5, animate: r6, motionConfig: l4, theme: t8, renderWrapper: d3, children: (0, import_jsx_runtime6.jsx)(be, Y2({ isInteractive: o5 }, c3)) });
};
var ye = function(e8) {
  return (0, import_jsx_runtime6.jsx)(It, { children: function(t8) {
    var i6 = t8.width, o5 = t8.height;
    return (0, import_jsx_runtime6.jsx)(pe, Y2({ width: i6, height: o5 }, e8));
  } });
};
export {
  se as HeatMap,
  pe as HeatMapCanvas,
  he as ResponsiveHeatMap,
  ye as ResponsiveHeatMapCanvas,
  D2 as canvasDefaultProps,
  j4 as commonDefaultProps,
  J3 as computeCells,
  _ as computeLayout,
  K2 as computeSizeScale,
  Q as getCellAnnotationDimensions,
  N2 as getCellAnnotationPosition,
  H as svgDefaultProps,
  te as useCellAnnotations,
  U as useComputeCells,
  ee as useHeatMap
};
//# sourceMappingURL=@nivo_heatmap.js.map
