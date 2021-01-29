const redis = require('redis');
const { Pool } = require('pg');

// establish PSQL client connection
const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'philosource',
	password: '',
	port: 5432
});

// create Redis client
const redisClient = redis.createClient();
// set error listener
redisClient.on('error', err => { if (err) console.log(`Redis Error: ${err}`) });

module.exports = {
	// query PSQL database
	query: (text, values) => pool.query(text, values),
	// get key from redis
	get: (id) => redisClient.get(id),
	// set key in redis
	set: (id, user, type, exp) => redisClient.set(id, user, type, exp),
	// delete key from redis
	del: (id) => redisClient.del(id),
	// check redis for existing key
	exists: (id) => redisClient.exists(id),
}
