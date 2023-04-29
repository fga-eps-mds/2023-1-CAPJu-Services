CREATE DATABASE capju;

\c capju;

CREATE TABLE unit (
  name_pk varchar(50) PRIMARY KEY
);

CREATE TABLE stage (
  name_pk varchar(50),
  duration_pk int,
  unit_name_fk varchar(50),
  PRIMARY KEY (name_pk, duration_pk),
  FOREIGN KEY (unit_name_fk) REFERENCES unit (name_pk)
);

CREATE TABLE flow (
  name_pk varchar(50),
  unit_name_fk varchar(50),
  PRIMARY KEY (name_pk),
  FOREIGN KEY (unit_name_fk) REFERENCES unit (name_pk)
);

CREATE TABLE process (
  id_pk serial PRIMARY KEY,
  record varchar(20),
  nickname varchar(50),
  unit_name_fk varchar(50),
  FOREIGN KEY (unit_name_fk) REFERENCES unit (name_pk)
);

CREATE TABLE priority (
  id_pk serial PRIMARY KEY,
  description varchar(50)
);

CREATE TABLE role (
  id_pk serial PRIMARY KEY,
  name varchar(50),
  access_level int
);

CREATE TABLE users (
  cpf_pk varchar(11),
  full_name varchar(50),
  email varchar(50),
  password varchar(50),
  unit_name_fk varchar(50),
  role_id_fk int,
  PRIMARY KEY (cpf_pk),
  FOREIGN KEY (unit_name_fk) REFERENCES unit (name_pk),
  FOREIGN KEY (role_id_fk) REFERENCES role (id_pk)
);

CREATE TABLE flow_stage (
  flow_name_fk varchar(50),
  duration_fk int,
  stage_name_fk varchar(50),
  place int,
  observation varchar(100),
  due_date date,
  end_date date,
  FOREIGN KEY (flow_name_fk) REFERENCES flow (name_pk),
  FOREIGN KEY (stage_name_fk, duration_fk) REFERENCES stage (name_pk, duration_pk)
);

CREATE TABLE process_priority (
  process_id_fk serial,
  priority_id_fk int,
  FOREIGN KEY (process_id_fk) REFERENCES process (id_pk),
  FOREIGN KEY (priority_id_fk) REFERENCES priority (id_pk)
);


CREATE TABLE process_flow (
  flow_name_fk varchar(50),
  process_id_fk int,
  FOREIGN KEY (flow_name_fk) REFERENCES flow (name_pk)
);
