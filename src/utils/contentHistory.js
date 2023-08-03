const fs = require('fs');
const path = require('path');
const simpleGit = require('simple-git');

async function getCommitsFromRepo(contentId) {
    const folderPath = path.join(__dirname, '..', 'public', 'content', contentId);
    const git = simpleGit(folderPath);
  
    if (!fs.existsSync(folderPath)) {                                           // Check if the folder and Git repository exist
      console.log(`Folder '${contentId}' or Git repository does not exist.`);
      return [];
    }
  
    try {
      // fetch the commit history from the repository
      const logOptions = ['--oneline'];
      const commitLog = await git.log(logOptions);
  
      // map the commit log to an array of objects containing commit hash and message
      const commits = commitLog.all.map((commit) => ({
        hash: commit.hash,
        message: commit.message                 //commit messages contain date of commit for future reference
      }));
      
      //return the array of commit hashes and messages.
      return commits;                                       
    } catch (err) {
      console.error('Error fetching commits:', err);
      return [];
    }
  }

  module.exports=getCommitsFromRepo;