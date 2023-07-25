const fs = require('fs');
const path = require('path');
const simpleGit = require('simple-git');

function contentInit(contentId, content) {
  const directory= __dirname;
  const folderPath = path.join(__dirname,'..','public','content', contentId);

  // Create the folder with the contentId as the folder name
  fs.mkdirSync(folderPath);

  const filePath = path.join(folderPath, 'content.txt');
  // const contentString = JSON.stringify(content);

  // Save the content object inside a text file
  fs.writeFileSync(filePath, content, 'utf8');

  // Initialize a Git repository in the folder
  const git = simpleGit(folderPath);
  git.init()
    .then(() => {
      console.log(`Folder '${contentId}' created and Git repository initialized.`);
    })
    .catch((err) => {
      console.error('Error initializing Git repository:', err);
    });
}

module.exports= contentInit;