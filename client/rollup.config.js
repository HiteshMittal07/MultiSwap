import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import postcss from "rollup-plugin-postcss";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import { babel } from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
// import { uglify } from "rollup-plugin-uglify";
// import uglify from "@lopatnov/rollup-plugin-uglify";
// const packageJson = require('./package.json')

export default [
  {
    input: "src/MultiSwapWidget.jsx", // Corrected the entry file to index.js
    output: [
      {
        file: "dist/swap-widget.js",
        format: "cjs",
        sourcemap: false,
      },
      {
        file: "dist/swap-widget.es.js",
        format: "es",
        exports: "named",
      },
    ],
    external: ["react", "react-dom"],
    plugins: [
      json(),
      peerDepsExternal(),
      nodeResolve({
        extensions: [".js", ".jsx"],
      }),
      commonjs(),
      terser(),
      postcss({
        plugins: [],
        minimize: true,
        extract: "style.css",
      }),
      babel({
        // presets: ["@babel/preset-env", "@babel/preset-react"],
        // extensions: ['.js', '.jsx']
        configFile: "./.babelrc",
        babelHelpers: "bundled",
        exclude: "node_modules/**",
      }),
      // uglify()
    ],
  },
];
