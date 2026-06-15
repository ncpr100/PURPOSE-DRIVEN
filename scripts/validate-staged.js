const fs = require("fs");
const path = require("path");

// Files are passed as arguments by lint-staged
const files = process.argv.slice(2);
let hasErrors = false;

// Regex to detect common UTF-8 Mojibake
const mojibakeRegex = /Ã|â€|Â¡|Â¿/;

files.forEach((file) => {
  const filePath = path.resolve(file);

  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, "utf8");

  // 1. Check for Mojibake
  if (mojibakeRegex.test(content)) {
    console.error(`❌ Encoding error (Mojibake) detected in: ${file}`);
    hasErrors = true;
  }

  // 2. Basic Lucide-React Import Check
  // If the file uses an icon pattern like `icon: IconName`, verify it is imported.
  const iconUsageMatches = content.match(/icon:\s*([A-Z][a-zA-Z0-9]*)/g);
  if (iconUsageMatches) {
    iconUsageMatches.forEach((match) => {
      const iconName = match.replace("icon:", "").trim();
      const importRegex = new RegExp(
        `import\\s*{[^}]*\\b${iconName}\\b[^}]*}\\s*from\\s*["']lucide-react["']`,
      );

      if (!importRegex.test(content)) {
        console.error(
          `❌ Icon '${iconName}' is used but not imported from lucide-react in: ${file}`,
        );
        hasErrors = true;
      }
    });
  }
});

if (hasErrors) {
  console.error("\nPre-commit validation failed. Please fix the errors above.");
  process.exit(1);
}

console.log("✅ Pre-commit validation passed.");
process.exit(0);
