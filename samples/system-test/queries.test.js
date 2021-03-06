/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const path = require(`path`);
const test = require(`ava`);
const tools = require(`@google-cloud/nodejs-repo-tools`);

const cwd = path.join(__dirname, `..`);
const cmd = `node queries.js`;
const projectId = process.env.GCLOUD_PROJECT;

const sqlQuery = `SELECT * FROM publicdata.samples.natality LIMIT 5;`;
const badQuery = `SELECT * FROM INVALID`;

test.before(tools.checkCredentials);

test(`should query stackoverflow`, async t => {
  const output = await tools.runAsync(`${cmd} stackoverflow ${projectId}`, cwd);
  t.true(output.includes(`Query Results:`));
  t.true(output.includes(`views`));
});

test(`should run a sync query`, async t => {
  const output = await tools.runAsync(
    `${cmd} sync ${projectId} "${sqlQuery}"`,
    cwd
  );
  t.true(output.includes(`Rows:`));
  t.true(output.includes(`source_year`));
});

test(`should run an async query`, async t => {
  const output = await tools.runAsync(
    `${cmd} async ${projectId} "${sqlQuery}"`,
    cwd
  );
  t.true(output.includes(`Rows:`));
  t.true(output.includes(`source_year`));
});

test.skip(`should handle sync query errors`, async t => {
  await t.throws(
    tools.runAsync(`${cmd} sync ${projectId} "${badQuery}"`, cwd),
    /ERROR:/
  );
});

test.skip(`should handle async query errors`, async t => {
  await t.throws(
    tools.runAsync(`${cmd} async ${projectId} "${badQuery}"`, cwd),
    /ERROR:/
  );
});
