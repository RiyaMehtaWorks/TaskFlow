import fs from "fs";
import path from "path";

const ROOT_DIR = path.resolve("notes");
const README_PATH = path.join(ROOT_DIR, "README.md");

function getMarkdownFiles(dir, baseDir = dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  let files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files = files.concat(getMarkdownFiles(fullPath, baseDir));
    } else if (
      entry.isFile() &&
      entry.name.endsWith(".md") &&
      entry.name !== "README.md"
    ) {
      files.push(path.relative(baseDir, fullPath));
    }
  }

  return files;
}

function extractHeadings(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");

  return content
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((h) => h.replace("## ", "").trim());
}

function generateIndex() {
  const files = getMarkdownFiles(ROOT_DIR);

  let index = `## 📘 Notes Index\n\n`;

  for (const file of files) {
    const fullPath = path.join(ROOT_DIR, file);
    const title = path.basename(file, ".md").replace(/_/g, " ");
    const headings = extractHeadings(fullPath);

    index += `- **[${title}](./${file.replace(/\\/g, "/")})**\n`;

    headings.forEach((h) => {
      const anchor = h
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");

      index += `  - [${h}](./${file.replace(/\\/g, "/")}#${anchor})\n`;
    });
  }

  return index;
}

function updateReadme() {
  const index = generateIndex();
  const readmeContent = fs.existsSync(README_PATH)
    ? fs.readFileSync(README_PATH, "utf-8")
    : "";

  const START = "<!-- AUTO-GENERATED-INDEX:START -->";
  const END = "<!-- AUTO-GENERATED-INDEX:END -->";

  const newContent = readmeContent.includes(START)
    ? readmeContent.replace(
        new RegExp(`${START}[\\s\\S]*?${END}`),
        `${START}\n\n${index}\n\n${END}`
      )
    : `${START}\n\n${index}\n\n${END}\n\n${readmeContent}`;

  fs.writeFileSync(README_PATH, newContent);
}

updateReadme();
console.log("README index updated successfully");
