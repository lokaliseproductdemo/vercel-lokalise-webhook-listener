import { Octokit } from "@octokit/core";
require('dotenv').config();
const axios = require('axios').default;

export default async function handler(request, response) {
    console.log('REQUEST BODY', JSON.stringify(request.body));
    try {
        // Step 1: Get the SHA of main branch
        const mainSha = (await axios.get('https://api.github.com/repos/lokaliseproductdemo/listen-to-lokalise-webhook-repo/git/refs/heads/main')).data.object.sha;
        console.log('mainSha -->',mainSha);

        // Step 2: Prepare for GIT API Request
        const octokit = new Octokit({ auth: process.env.GITHUB_API_TOKEN }),
            owner = 'lokaliseproductdemo',
            repo = 'listen-to-lokalise-webhook-repo',
            branchName = `new-key-added-in-your-lokalise-project-${Date.now()}`,
            base = 'main',
            ref = `refs/heads/${branchName}`,
            sha = mainSha;
        
        // Step 3: Create a new branch
        const reposiotry = await octokit.request('POST /repos/{owner}/{repo}/git/refs', {
            owner,
            repo,
            ref,
            sha
        })

        console.log('CREATED A BRANCH ->', JSON.stringify(reposiotry));
    } catch (error) {
        console.log('ERROR', error);
    }
    response.status(200).json({
        body: request.body,
        query: request.query,
        cookies: request.cookies,
    });
}