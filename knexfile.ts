require('ts-node/register');
require('tsconfig-paths/register');

import knex, { Knex } from 'knex';
import { knexfile } from 'src/server';

module.exports = knexfile;
