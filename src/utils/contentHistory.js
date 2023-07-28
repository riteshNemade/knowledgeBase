const fs = require('fs');
const path = require('path');
const simpleGit = require('simple-git');

async function getCommitsFromRepo(contentId) {
    const folderPath = path.join(__dirname, '..', 'public', 'content', contentId);
    const git = simpleGit(folderPath);
  
    // Check if the folder and Git repository exist
    if (!fs.existsSync(folderPath)) {
      console.log(`Folder '${contentId}' or Git repository does not exist.`);
      return [];
    }
  
    try {
      // Fetch the commit history from the repository
      const logOptions = ['--oneline'];
      const commitLog = await git.log(logOptions);
  
      // Map the commit log to an array of objects containing commit hash and message
      const commits = commitLog.all.map((commit) => ({
        hash: commit.hash,
        message: commit.message
      }));
  
      return commits;
    } catch (err) {
      console.error('Error fetching commits:', err);
      return [];
    }
  }

  module.exports=getCommitsFromRepo;