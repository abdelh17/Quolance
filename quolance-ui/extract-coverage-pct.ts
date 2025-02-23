#!/usr/bin/env ts-node

import fs from 'fs';
import got from 'got';

const coverageFile = 'coverage/coverage-summary.json';

interface CoverageData {
    total: {
        statements: {
            pct: number;
        };
    };
}

interface EnvOptions {
    token: string;
    repository: string;
    sha: string;
}

function readCoverage(filename: string): number {
    const coverageData: CoverageData = JSON.parse(fs.readFileSync(filename, 'utf-8'));
    return coverageData.total.statements.pct;
}

async function setGitHubCommitStatus(pct: number, envOptions: EnvOptions) {
    const url = `https://api.github.com/repos/${envOptions.repository}/statuses/${envOptions.sha}`;
    console.log(`Setting commit status with ${pct}% of statements covered`);

    await got.post(url, {
        headers: {
            authorization: `Bearer ${envOptions.token}`,
            'content-type': 'application/json',
        },
        json: {
            context: 'cypress code-coverage',
            state: 'success',
            description: `${pct}% of statements`,
        },
    });
    console.log(`Coverage percentage set to ${pct}% on GitHub`);
}

const pct = readCoverage(coverageFile);
console.log(`Total Statements Coverage: ${pct}%`);

const envOptions: EnvOptions = {
    token: process.env.GITHUB_TOKEN || '',
    repository: process.env.GITHUB_REPOSITORY || '',
    sha: process.env.GITHUB_SHA || '',
};

if (!envOptions.token || !envOptions.repository || !envOptions.sha) {
    console.error('Missing required environment variables');
    process.exit(1);
}

setGitHubCommitStatus(pct, envOptions).catch((e) => {
    console.error(e);
    process.exit(1);
});
