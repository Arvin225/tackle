const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = 9999;
const MUSIC_DIR = path.join(__dirname, "test-music");

// Ensure test music directory exists
if (!fs.existsSync(MUSIC_DIR)) {
  fs.mkdirSync(MUSIC_DIR, { recursive: true });
  console.log("Created test music directory:", MUSIC_DIR);

  // Create some sample folders
  fs.mkdirSync(path.join(MUSIC_DIR, "Album1"), { recursive: true });
  fs.mkdirSync(path.join(MUSIC_DIR, "Album2"), { recursive: true });

  // Create sample MP3 files (empty files for testing)
  const sampleFiles = [
    "Album1/track1.mp3",
    "Album1/track2.mp3",
    "Album2/track3.mp3",
    "Album2/track4.flac",
    "sample.mp3",
  ];

  sampleFiles.forEach(file => {
    const filePath = path.join(MUSIC_DIR, file);
    fs.writeFileSync(filePath, ""); // Create empty file
    console.log("Created:", file);
  });
}

// Simple WebDAV server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  console.log(`${req.method} ${pathname}`);

  // Handle CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE, PROPFIND, MKCOL, MOVE, COPY"
  );
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, Depth, Destination");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // Basic Auth check
  const auth = req.headers.authorization;
  if (!auth) {
    res.setHeader("WWW-Authenticate", 'Basic realm="WebDAV"');
    res.writeHead(401);
    res.end("Unauthorized");
    return;
  }

  // Decode auth (expecting username: password)
  const creds = Buffer.from(auth.split(" ")[1], "base64").toString();
  if (creds !== "testuser:testpass" && creds !== "alist:") {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  // PROPFIND - list directory
  if (req.method === "PROPFIND") {
    const dirPath = path.join(MUSIC_DIR, pathname);

    if (!fs.existsSync(dirPath)) {
      res.writeHead(404);
      res.end("Not Found");
      return;
    }

    const depth = req.headers.depth || "1";
    const items = [];

    // Add current directory
    items.push({
      href: pathname,
      isCollection: true,
    });

    // List contents
    if (depth !== "0" && fs.statSync(dirPath).isDirectory()) {
      const files = fs.readdirSync(dirPath);
      files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);
        items.push({
          href: pathname === "/" ? `/${file}` : `${pathname}/${file}`,
          isCollection: stat.isDirectory(),
          contentLength: stat.size,
          lastModified: stat.mtime.toISOString(),
        });
      });
    }

    // Generate WebDAV XML response
    const xml = `<?xml version="1.0" encoding="utf-8"?>
<D:multistatus xmlns:D="DAV:">
${items
  .map(
    item => `  <D:response>
    <D:href>${item.href}</D:href>
    <D:propstat>
      <D:prop>
        <D:resourcetype>${item.isCollection ? "<D:collection/>" : ""}</D:resourcetype>
        ${item.contentLength !== undefined ? `<D:getcontentlength>${item.contentLength}</D:getcontentlength>` : ""}
        ${item.lastModified ? `<D:getlastmodified>${item.lastModified}</D:getlastmodified>` : ""}
      </D:prop>
      <D:status>HTTP/1.1 200 OK</D:status>
    </D:propstat>
  </D:response>`
  )
  .join("\n")}
</D:multistatus>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.writeHead(207);
    res.end(xml);
    return;
  }

  // GET - download file
  if (req.method === "GET") {
    const filePath = path.join(MUSIC_DIR, pathname);

    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      res.end("Not Found");
      return;
    }

    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end("<html><body><h1>Directory listing</h1></body></html>");
      return;
    }

    res.writeHead(200, {
      "Content-Type": "audio/mpeg",
      "Content-Length": stat.size,
    });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // HEAD - get file info
  if (req.method === "HEAD") {
    const filePath = path.join(MUSIC_DIR, pathname);

    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      res.end();
      return;
    }

    const stat = fs.statSync(filePath);
    res.writeHead(200, {
      "Content-Type": "audio/mpeg",
      "Content-Length": stat.size,
    });
    res.end();
    return;
  }

  // Method not supported
  res.writeHead(405);
  res.end("Method Not Allowed");
});

server.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`Test WebDAV Server Started`);
  console.log(`========================================`);
  console.log(`URL: http://localhost:${PORT}/`);
  console.log(`Username: testuser`);
  console.log(`Password: testpass`);
  console.log(`Or use: alist / (empty password)`);
  console.log(`Music directory: ${MUSIC_DIR}`);
  console.log(`========================================\n`);
});
