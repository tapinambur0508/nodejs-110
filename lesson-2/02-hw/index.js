import * as fs from 'node:fs/promises';
import path from 'node:path';

/**
 * @returns {Promise<Array<{ id: string, name: string, ... }>}
 */
async function readContacts() {
  const data = await fs.readFile(path.resolve('db.json'), {
    encoding: 'utf-8',
  });

  return JSON.parse(data);
}

/**
 * @param {Array<{ id: string, name: string, ... }>} contacts
 * @return {Promise<void>}
 */
async function writeContacts(contacts) {
  await fs.writeFile(
    path.resolve('db.json'),
    JSON.stringify(contacts, undefined, 2),
  );
}

// Add new contact
readContacts().then((contacts) => {
  contacts.push({ id: '401d3485-9eee-4fef-ad30-ee6ae297c089' });
  writeContacts(contacts);
});
