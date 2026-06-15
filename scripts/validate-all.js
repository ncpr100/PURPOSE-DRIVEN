const fs = require("fs");
const path = require("path");

const dirsToScan = ["app", "components", "lib"];
const mojibakeRegex = /Ã|â€|Â¡|Â¿/;
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

      // Check for Mojibake
      if (mojibakeRegex.test(content)) {
        console.error(`❌ Mojibake found in ${p}`);
        errors++;
      }

      // Check for missing lucide-react imports
      const iconUsageMatches = content.match(/icon:\s*([A-Z][a-zA-Z0-9]*)/g);
      if (iconUsageMatches) {
        iconUsageMatches.forEach((match) => {
          const iconName = match.replace("icon:", "").trim();
          const importRegex = new RegExp(
            `import\\s*{[^}]*\\b${iconName}\\b[^}]*}\\s*from\\s*["']lucide-react["']`,
          );

          if (!importRegex.test(content)) {
            console.error(
              `❌ Icon '${iconName}' used but not imported in ${p}`,
            );
            errors++;
          }
        });
      }
    }
  });
}

console.log("🔍 Running full codebase validation...\n");
dirsToScan.forEach(checkDir);

if (errors > 0) {
  console.error(`\n❌ Validation failed: ${errors} errors found.`);
  process.exit(1);
}

console.log("✅ Validation passed: No encoding or import errors found.");
process.exit(0);
