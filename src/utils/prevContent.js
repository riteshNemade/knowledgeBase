const fs = require('fs');
const path = require('path');
const simpleGit = require('simple-git');

async function getContentFromCommit(contentId, commitHash) {
  const folderPath = path.join(__dirname, '..', 'public', 'content', contentId);
  const git = simpleGit(folderPath);

  // Check if the folder and Git repository exist
  if (!fs.existsSync(folderPath)) {
    console.log(`Folder '${contentId}' or Git repository does not exist.`);
    return null;
  }

  try {
    // Checkout the specific commit using the provided commit hash
    await git.checkout(commitHash);

    // Read the content from the text file in that commit
    const filePath = path.join(folderPath, 'content.txt');
    const content = fs.readFileSync(filePath, 'utf8');

    // Return the content as a string
    return content;
  } catch (err) {
    console.error('Error fetching content from commit:', err);
    return null;
  }
}


module.exports=getContentFromCommit;