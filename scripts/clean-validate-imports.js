const fs = require("fs");
const path = require("path");

const DIR = path.resolve(__dirname, "../proto/janus");

function walk(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    const fullPath = path.join(dir, f);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath, callback);
    } else if (f.endsWith(".ts")) {
      callback(fullPath);
    }
  });
}

function cleanFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  // Remove the import line
  content = content.replace(
    /^import\s+\{\s*file_buf_validate_validate\s*\}\s+from\s+["'][^"']*["'];\s*$/gm,
    "",
  );

  // Remove from array references (e.g. inside fileDesc([...]))
  content = content.replace(/,\s*file_buf_validate_validate/g, "");
  content = content.replace(/file_buf_validate_validate,\s*/g, "");
  content = content.replace(/\[\s*file_buf_validate_validate\s*\]/g, "[]");

  fs.writeFileSync(filePath, content, "utf8");
  console.log(`✔ Cleaned: ${filePath}`);
}

walk(DIR, cleanFile);
