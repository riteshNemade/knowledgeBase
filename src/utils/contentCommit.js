const fs = require('fs');
const path = require('path');
const simpleGit = require('simple-git');

function contentCommit(contentId, content) {

  const folderPath = path.join(__dirname, '..', 'public', 'content', contentId);      // Create the folder with the contentId as the folder name

  if (!fs.existsSync(folderPath)) {

    fs.mkdirSync(folderPath);

    const filePath = path.join(folderPath, 'content.txt');                          // Create a text file to hold deltaObjects of the Quill editor

    fs.writeFileSync(filePath, JSON.stringify(content), 'utf8');                   // Save the content object inside a text file

    
    const git = simpleGit(folderPath);                                            // Initialize a Git repository in the folder
    git.add('.')                                                                  //Stage the text file.
      .then(() => {
        const commitMessage = `Content updated on ${new Date().toISOString()}`;   // Commit the changes with a timestamp-based commit message
        return git.commit(commitMessage);
      })
      .then(() => {
        // console.log('Changes committed to the Git repository.');
      })
      .catch((err) => {
        console.error('Error committing changes:', err);
      });
  }
}

module.exports = contentCommit;