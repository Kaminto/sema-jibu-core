require("dotenv").config();

const fs = require("fs");
const path = require("path");

createWindowEnv(
  path.resolve(__dirname, ".env.example"),
  path.resolve(__dirname, "./public/env.js")
).catch(error => {
  console.error(error);
  process.exit(1);
});

function createWindowEnv(example, output) {
  return readFile(example)
    .then(env =>
      env
        .split("\n")
        .map(v => v.split("="))
        .map(([key]) => ({ [key]: process.env[key] }))
        .reduce((all, one) => ({ ...all, ...one }), {})
    )
    .catch(() => [])
    .then(env =>
      writeFile(output, `window.env = ${JSON.stringify(env, null, 2)};`)
    );
}

function writeFile(path, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, error => {
      if (error) {
        return reject(error);
      }

      return resolve(path);
    });
  });
}

function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (error, data) => {
      if (error) {
        return reject(error);
      }

      return resolve(data.toString("utf8"));
    });
  });
}
