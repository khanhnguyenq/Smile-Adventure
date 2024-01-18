-- Use SQL insert statements to add any
-- starting/dummy data to your database tables

-- EXAMPLE:

--  insert into "todos"
--    ("task", "isCompleted")
--    values
--      ('Learn to code', false),
--      ('Build projects', false),
--      ('Get a job', false);

insert into "parks"
  ("parkId", "parkName", "longitude", "lattitude")
  values
    ('832fcd51-ea19-4e77-85c7-75d5843b127c', 'Disney California Adventure Park', '-117', '33' ),
    ('75ea578a-adc8-4116-a54d-dccb60765ef9', 'Magic Kingdom Park', '-81', '28')
