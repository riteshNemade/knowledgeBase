const fs = require('fs');
const path = require('path');
const simpleGit = require('simple-git');

function contentCommit(contentId, content) {
  const directory= __dirname;
  const folderPath = path.join(__dirname,'..','public','content', contentId);

  if (!fs.existsSync(folderPath)) {
  // Create the folder with the contentId as the folder name
  fs.mkdirSync(folderPath);

  const filePath = path.join(folderPath, 'content.txt');
  // const contentString = JSON.stringify(content);

  // Save the content object inside a text file
  fs.writeFileSync(filePath, JSON.stringify(content), 'utf8');

  // Initialize a Git repository in the folder
  const git = simpleGit(folderPath);
  git.add('.')
    .then(() => {
      // Commit the changes with a timestamp-based commit message
      const commitMessage = `Content updated on ${new Date().toISOString()}`;
      return git.commit(commitMessage);
    })
    .then(() => {
      console.log('Changes committed to the Git repository.');
    })
    .catch((err) => {
      console.error('Error committing changes:', err);
    });
}
}

module.exports= contentCommit;