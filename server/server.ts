/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import {
  ClientError,
  authMiddleware,
  defaultMiddleware,
  errorMiddleware,
} from './lib/index.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

type User = {
  userId: number;
  username: string;
  hashedPassword: string;
  name: string;
};

type Auth = {
  username: string;
  password: string;
};

type FavoriteInfo = {
  userId: number;
  attractionId: string;
  parkId: string;
};

const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.RDS_USERNAME}:${process.env.RDS_PASSWORD}@${process.env.RDS_HOSTNAME}:${process.env.RDS_PORT}/${process.env.RDS_DB_NAME}`;
const db = new pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const hashKey = process.env.TOKEN_SECRET;
if (!hashKey) throw new Error('TOKEN_SECRET not found in .env');

const app = express();

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { username, password } = req.body as Partial<Auth>;
    if (!username || !password)
      throw new ClientError(
        400,
        'username, password, and name are required fields'
      );
    const hashedPassword = await argon2.hash(password);
    const sql = `
    INSERT INTO "users" ("username", "hashedPassword", "name")
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const params = [username, hashedPassword, req.body.name];
    const result = await db.query<User>(sql, params);
    const [user] = result.rows;
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    const { username, password } = req.body as Partial<Auth>;
    if (!username || !password) throw new Error('invalid login');
    const sql = `
    SELECT "userId", "hashedPassword"
      FROM "users"
      WHERE "username" = $1
    `;
    const params = [username];
    const result = await db.query<User>(sql, params);
    const [user] = result.rows;
    if (!user) {
      throw new ClientError(401, 'invalid login');
    }
    const { userId, hashedPassword } = user;
    if (!(await argon2.verify(hashedPassword, password))) {
      throw new ClientError(401, 'invalid login');
    }
    const payload = { userId, username };
    const token = jwt.sign(payload, hashKey);
    res.status(200).json({ token, user: payload });
  } catch (err) {
    next(err);
  }
});

app.get('/api/parks', async (req, res, next) => {
  try {
    const sql = `
    SELECT "parkName", "longitude", "latitude", "parkId"
      FROM "parks"
    `;
    const result = await db.query(sql);
    const parks = result.rows;
    res.status(200).json(parks);
  } catch (err) {
    next(err);
  }
});

app.post('/api/heart', async (req, res, next) => {
  try {
    const { userId, attractionId, parkId } = req.body as FavoriteInfo;

    if (!attractionId)
      throw new ClientError(400, 'attractionId is required fields');
    if (!userId) throw new ClientError(400, 'userId is required fields');

    if (!parkId) throw new ClientError(400, 'parkId is required fields');
    const sql = `
    INSERT INTO "userAttractions" ("userId", "attractionId", "parkId")
    VALUES ($1, $2, $3)
    RETURNING *
    `;
    const params = [userId, attractionId, parkId];
    const result = await db.query(sql, params);
    const [favoriteRide] = result.rows;
    res.status(201).json(favoriteRide);
  } catch (err) {
    next(err);
  }
});

app.delete('/api/heart/:entryId', authMiddleware, async (req, res, next) => {
  try {
    const entryId = Number(req.params.entryId);
    if (!Number.isInteger(entryId)) {
      throw new ClientError(400, 'entryId must be an integer');
    }
    const sql = `
      delete from "userAttractions"
        where "entryId" = $1 and "userId" = $2
        returning *;
    `;
    const params = [entryId, req.user?.userId];
    const result = await db.query<FavoriteInfo>(sql, params);
    const [deleted] = result.rows;
    if (!deleted) {
      throw new ClientError(404, `Entry with id ${entryId} not found`);
    }
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

app.get('/api/favorite', authMiddleware, async (req, res, next) => {
  try {
    const sql = `
    SELECT * from "userAttractions"
    WHERE "userId" = $1
    `;
    const result = await db.query(sql, [req.user?.userId]);
    const favoriteRides = result.rows;
    res.status(201).json(favoriteRides);
  } catch (err) {
    next(err);
  }
});

/*
 * Middleware that handles paths that aren't handled by static middleware
 * or API route handlers.
 * This must be the _last_ non-error middleware installed, after all the
 * get/post/put/etc. route handlers and just before errorMiddleware.
 */
app.use(defaultMiddleware(reactStaticDir));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
