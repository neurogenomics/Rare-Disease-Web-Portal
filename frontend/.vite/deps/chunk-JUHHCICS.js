import {
  colors2,
  createHost,
  createStringInterpolator2,
  globals_exports,
  raf
} from "./chunk-AWVDU5FC.js";
import {
  addEffect,
  applyProps,
  three_module_exports
} from "./chunk-KDQOOMWH.js";

// node_modules/@react-spring/three/dist/react-spring_three.modern.mjs
var primitives = ["primitive"].concat(
  Object.keys(three_module_exports).filter((key) => /^[A-Z]/.test(key)).map((key) => key[0].toLowerCase() + key.slice(1))
);
globals_exports.assign({
  createStringInterpolator: createStringInterpolator2,
  colors: colors2,
  frameLoop: "demand"
});
addEffect(() => {
  raf.advance();
});
var host = createHost(primitives, {
  // @ts-expect-error r3f related
  applyAnimatedValues: applyProps
});
var animated = host.animated;

export {
  animated
};
//# sourceMappingURL=chunk-JUHHCICS.js.map
