const fs = require("fs");
const path = require("path");

const dirsToScan = ["app", "components", "lib"];
const mojibakeRegex = /Ñ|'|Â¡|Â¿/;
let errors = 0;

function checkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir, { withFileTypes: true });
  files.forEach((f) => {
    const p = path.join(dir, f.name);
    if (
      f.isDirectory() &&
      !p.includes("node_modules") &&
      !p.includes(".next") &&
      !p.includes(".git")
    ) {
      checkDir(p);
    } else if (f.isFile() && (p.endsWith(".tsx") || p.endsWith(".ts"))) {
      const content = fs.readFileSync(p, "utf8");
      if (mojibakeRegex.test(content)) {
        console.error(`❌ Mojibake found in ${p}`);
        errors++;
      }
    }
  });
}

dirsToScan.forEach(checkDir);

if (errors > 0) {
  console.error(
    `\n❌ CI Quality Gate Failed: ${errors} encoding errors found.`,
  );
  process.exit(1);
}

console.log("✅ CI Quality Gate Passed: No encoding errors found.");
process.exit(0);
