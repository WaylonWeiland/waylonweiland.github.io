const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

(async () => {
  const pressPath = path.resolve(process.cwd(), "press.html");
  if (!fs.existsSync(pressPath)) {
    console.error("press.html not found at repo root.");
    process.exit(1);
  }

  const fileUrl = "file://" + pressPath;

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto(fileUrl, { waitUntil: "networkidle0" });

  // Slightly widen for a cleaner PDF layout
  await page.setViewport({ width: 1200, height: 800 });

  await page.pdf({
    path: "press-kit.pdf",
    format: "Letter",
    printBackground: true,
    margin: {
      top: "0.6in",
      right: "0.6in",
      bottom: "0.6in",
      left: "0.6in",
    },
  });

  await browser.close();
  console.log("Generated press-kit.pdf");
})();
