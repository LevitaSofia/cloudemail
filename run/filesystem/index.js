// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/**
 * Express webapp that generates files to a mounted NFS disk.
 *
 * See https://cloud.google.com/run/docs/tutorials/network-filesystems-filestore before running the code snippet.
 */

const express = require('express');
const rateLimit = require('express-rate-limit');
const fs = require('fs');

const app = express();
const limit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Rate limit exceeded',
  headers: true,
});
const mntDir = process.env.MNT_DIR || '/mnt/nfs/filestore';

app.use(limit);
app.use(mntDir, express.static(mntDir));

app.get(mntDir, async (req, res) => {
  // Have all requests to mount directory generate a new file on the filesystem.
  try {
    await writeFile(mntDir);
    // Respond with html listing files.
    res.send(generateIndex(mntDir));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(
        'Something went wrong when writing to the file system. Refresh the page to try again.'
      );
  }
});

app.all('*', (req, res) => {
  // Redirect all requests to the mount directory
  res.redirect(mntDir);
});

const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

async function writeFile(path, filePrefix = 'test') {
  let date = new Date();
  date = date.toString().split(' ').slice(0, 5).join('-');
  const filename = `${filePrefix}-${date}.txt`;
  const contents = `This test file was created on ${date}.\n`;

  fs.writeFile(`${path}/${filename}`, contents, err => {
    if (err) {
      return err;
    }
  });
}

function generateIndex(mntDir) {
  const header =
    '<html><body>A new file is generated each time this page is reloaded.<p>Files created on filesystem:<p>';
  const footer = '</body></html>';
  // Get list of files on mounted file system.
  const existingFiles = fs.readdirSync(mntDir);
  const fileHtml = existingFiles.map(filename => {
    return `<a href="${mntDir}/${filename}">${filename}</a><br>`;
  });
  return header + fileHtml.join('') + footer;
}

module.exports = app;
