import git from 'isomorphic-git';
import fs from 'fs';
import path from 'path';

const dir = process.cwd();

async function walkDir(currentDir, relativePath = '') {
  const entries = await fs.promises.readdir(currentDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'dist') {
      continue;
    }
    const fullPath = path.join(currentDir, entry.name);
    const rel = relativePath ? `${relativePath}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      const sub = await walkDir(fullPath, rel);
      files.push(...sub);
    } else {
      files.push(rel);
    }
  }

  return files;
}

async function run() {
  console.log('Initializing Git repository at:', dir);
  await git.init({ fs, dir });

  console.log('Scanning project files...');
  const files = await walkDir(dir);
  console.log(`Found ${files.length} project files to track.`);

  for (const filepath of files) {
    await git.add({ fs, dir, filepath });
  }

  console.log('Staging complete. Creating commit...');
  const sha = await git.commit({
    fs,
    dir,
    author: {
      name: 'DAA Hackathon Developer',
      email: 'developer@apexuniv.edu',
    },
    message: 'Initial commit: University Timetable Room Minimizer (OptiRoom - DAA Hackathon)',
  });

  console.log('Successfully committed all project files! Commit SHA:', sha);

  const log = await git.log({ fs, dir, depth: 1 });
  console.log('Latest Commit:', log[0].commit.message);
}

run().catch((err) => {
  console.error('Error committing files:', err);
  process.exit(1);
});
