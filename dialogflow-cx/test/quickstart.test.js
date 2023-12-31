// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const path = require('path');
const {assert} = require('chai');
const cp = require('child_process');
const {describe, it} = require('mocha');

const execSync = cmd => cp.execSync(cmd, {encoding: 'utf-8'});

const cwd = path.join(__dirname, '..');

const project = process.env.GCLOUD_PROJECT;

describe('Quickstart', () => {
  it('should run quickstart', async () => {
    try {
      // TODO: write an actual functional test:
      execSync(
        `node ./quickstart.js ${project} global b1808233-450b-4065-9492-bc9b40151641 resources/audio.raw AUDIO_ENCODING_LINEAR_16 16000 en`,
        {cwd}
      );
      assert('unreachable');
    } catch (err) {
      assert.match(err.message, /no such file or directory, open 'audio.raw/);
    }
  });
});
