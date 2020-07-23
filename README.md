<p align="center">

[![Build Status](https://travis-ci.com/DougAnderson444/syncs.info.svg?branch=master)](https://travis-ci.com/DougAnderson444/syncs.info)

</p>

# Syncs.info Demo [WIP: Work in Progress]

This repo is a brief example of a [syncs.info](https://syncs.info/) in action, that can be deployed with ZEIT Now and zero configuration.

## Why?

After spending 20 years in the Navy, I moved around a lot. After missing a few importnant pieces of mail, and losing a few friends to phone number changes, I realized that I had no "personal RSS" feed to give out so that everyone could keep in touch with me. Also, in my 20 years of watching the internet, I saw company after company get gobbled up onyl to see their service disappear.

I needed a data source that I owned, with an internet pointer to it, with personal APIs that I controlled and knew wouldn't go away with the latest acquisition.

That quickly led me to things like IPFS, SSI, and cryptography. 

## The Solution

The solution is to have a browser based data feed that is 100% in control of the user. So that's what I built!

## How it works

The PeerPiper client syncs.info lives in the browser. It effectively starts a "Browser server" and saves the data there. You hand out a code (public key) to your contacts which points to your data. Whenever your data changes, the code points to the new version, and you can keep in touch!

## One Click Deployment to Your Own Server

Don't want to run on our server? No problem! Deploy your own project with ZEIT Now.

[![Deploy with ZEIT Now](https://zeit.co/button)](https://zeit.co/import/project?template=https://github.com/DougAnderson444/syncs.info)

_Live Example: https://syncs-info.vercel.app_

### How We Created This Demo

This demo is built using svelte/sapper with IPFS in the service worker.