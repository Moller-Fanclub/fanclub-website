#!/usr/bin/env node
/**
 * Generate a secure random token for Vipps callback authorization
 * 
 * Usage: npm run generate:callback-token
 * or: tsx scripts/generateCallbackToken.ts
 */

import crypto from 'crypto';

const token = crypto.randomBytes(32).toString('hex');

console.log('\n🔐 Vipps Callback Authorization Token\n');
console.log('Generated secure token:');
console.log(token);
console.log('\n📝 Add this to your .env file as:');
console.log(`VIPPS_CALLBACK_AUTHORIZATION_TOKEN=${token}\n`);
console.log('⚠️  Keep this token secret and never commit it to version control!\n');

