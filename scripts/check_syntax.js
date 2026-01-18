const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const p = path.join(dir, f);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      if (f === "node_modules" || f === ".git") continue;
      walk(p);
    } else if (p.endsWith(".js")) {
      try {
        const r = spawnSync("node", ["--check", p], { encoding: "utf8" });
        if (r.status !== 0) {
          console.log("SYNTAX ERROR in:", p);
          if (r.stderr) console.log(r.stderr);
        }
      } catch (e) {
        console.log("ERROR checking", p, e.message);
      }
    }
  }
}

const root = path.resolve(__dirname, "..", "backend");
console.log("Checking JS syntax under", root);
walk(root);
console.log("Done.");
