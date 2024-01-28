set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "users" (
  "userId" serial PRIMARY KEY,
  "username" text,
  "hashedPassword" text,
  "name" text,
  "createdAt"  timestamptz(6) not null default now()
);

CREATE TABLE "parks" (
  "parkId" text PRIMARY KEY,
  "parkName" text,
  "longitude" float,
  "latitude" float
);

CREATE TABLE "userAttractions" (
  "entryId" serial,
  "userId" integer,
  "attractionId" text,
  "parkId" text,
  PRIMARY KEY ("userId", "attractionId", "parkId")
);

COMMENT ON COLUMN "parks"."parkId" IS 'from api';

COMMENT ON COLUMN "userAttractions"."attractionId" IS 'from api';

COMMENT ON COLUMN "userAttractions"."parkId" IS 'from api';

ALTER TABLE "userAttractions" ADD FOREIGN KEY ("userId") REFERENCES "users" ("userId");

ALTER TABLE "userAttractions" ADD FOREIGN KEY ("parkId") REFERENCES "parks" ("parkId");
