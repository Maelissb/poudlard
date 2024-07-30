SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


SET default_tablespace = '';
SET default_table_access_method = heap;
SET schema 'public';


CREATE TABLE wizard (
  id SERIAL PRIMARY KEY,
  lastname VARCHAR(255) NOT NULL,
  firstname VARCHAR(255) NOT NULL,
  birthdate DATE NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  image VARCHAR(255) NOT NULL,
  house_id INTEGER,
  class_id INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Role (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  is_staff BOOLEAN NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE WizardRole (
  id SERIAL PRIMARY KEY,
  wizard_id INTEGER NOT NULL,
  role_id INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE House (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  building VARCHAR(255) NOT NULL,
  floor INTEGER NOT NULL,
  image VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Subject (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(255) NOT NULL,
  room_id INTEGER,
  wizard_id INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Room (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  building VARCHAR(255),
  floor INTEGER,
  number INTEGER,
  capacity INTEGER NOT NULL DEFAULT 30,
  image VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Class (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  level INTEGER NOT NULL,
  image VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Lesson (
  id SERIAL PRIMARY KEY,
  day_of_week INTEGER NOT NULL,
  start_hour TIME NOT NULL,
  end_hour TIME NOT NULL,
  color VARCHAR(255) NOT NULL,
  class_id INTEGER,
  subject_id INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);






INSERT INTO Class (name, level, image) VALUES 
('First Year', 1, 'https://via.placeholder.com/150'),
('Second Year', 2, 'https://via.placeholder.com/150'),
('Third Year', 3, 'https://via.placeholder.com/150'),
('Fourth Year', 4, 'https://via.placeholder.com/150'),
('Fifth Year', 5, 'https://via.placeholder.com/150'),
('Sixth Year', 6, 'https://via.placeholder.com/150'),
('Seventh Year', 7, 'https://via.placeholder.com/150');

INSERT INTO wizard (email, password, lastname, firstname, birthdate, image, house_id, class_id) VALUES 
('Potter@poudlard.co.uk', 'poudlard', 'Potter', 'Harry', '1980-07-31', 'https://via.placeholder.com/150', 1, 1),
('Granger@poudlard.co.uk', 'poudlard', 'Granger', 'Hermione', '1979-09-19', 'https://via.placeholder.com/150', 1, 1),
('Weasley@poudlard.co.uk', 'poudlard', 'Weasley', 'Ron', '1980-03-01', 'https://via.placeholder.com/150', 1, 1),
('Malfoy@poudlard.co.uk', 'poudlard', 'Malfoy', 'Drago', '1980-06-05', 'https://via.placeholder.com/150', 2, 1),
('McGonagall@poudlard.co.uk', 'poudlard', 'McGonagall', 'Minerva', '1935-10-04', 'https://via.placeholder.com/150', NULL, NULL),
('Hagrid@poudlard.co.uk', 'poudlard', 'Hagrid', 'Rubeus', '1928-12-06', 'https://via.placeholder.com/150', NULL, NULL),
('Lupin@poudlard.co.uk', 'poudlard', 'Lupin', 'Remus', '1960-03-10', 'https://via.placeholder.com/150', NULL, NULL),
('Black@poudlard.co.uk', 'poudlard', 'Black', 'Sirius', '1959-11-03', 'https://via.placeholder.com/150', NULL, NULL),
('Snape@poudlard.co.uk', 'poudlard', 'Snape', 'Severus', '1960-01-09', 'https://via.placeholder.com/150', NULL, NULL),
('Dumbledore@poudlard.co.uk', 'poudlard', 'Dumbledore', 'Albus', '1881-07-30', 'https://via.placeholder.com/150', NULL, NULL);

INSERT INTO Role (name, is_staff) VALUES 
('student', false),
('teacher', false),
('headmaster', true),
('caretaker', true),
('librarian', true);

INSERT INTO WizardRole (wizard_id, role_id) VALUES 
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 2),
(6, 2),
(7, 2),
(8, 2),
(9, 2),
(10, 3),
(1, 2),
(1, 4);

INSERT INTO House (name, building, floor, image) VALUES 
('Gryffindor', 'A', 1, 'https://via.placeholder.com/150'),
('Slytherin', 'B', 2, 'https://via.placeholder.com/150'),
('Ravenclaw', 'C', 1, 'https://via.placeholder.com/150'),
('Hufflepuff', 'D', 2, 'https://via.placeholder.com/150');

INSERT INTO Room (name, building, floor, number, image) VALUES 
('Great Hall', 'A', 1, 1, 'https://via.placeholder.com/150'),
('Dungeon', 'B', 2, 1, 'https://via.placeholder.com/150'),
('Classroom', 'C', 1, 1, 'https://via.placeholder.com/150'),
('Classroom', 'D', 2, 1, 'https://via.placeholder.com/150'),
('Library', 'A', 1, 2, 'https://via.placeholder.com/150'),
('Library', 'B', 2, 2, 'https://via.placeholder.com/150'),
('Outdoor', null, null, null, 'https://via.placeholder.com/150');

INSERT INTO Subject (name, description, image, room_id, wizard_id) VALUES 
('Potions', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tincidunt nunc ac imperdiet sollicitudin.', 'https://via.placeholder.com/150', 1, 5),
('Defense Against the Dark Arts', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tincidunt nunc ac imperdiet sollicitudin.', 'https://via.placeholder.com/150', 2, 6),
('Transfiguration', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tincidunt nunc ac imperdiet sollicitudin.', 'https://via.placeholder.com/150', 3, 7),
('Charms', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tincidunt nunc ac imperdiet sollicitudin.', 'https://via.placeholder.com/150', 4, 8),
('History of Magic', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tincidunt nunc ac imperdiet sollicitudin.', 'https://via.placeholder.com/150', 5, 9),
('Astronomy', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tincidunt nunc ac imperdiet sollicitudin.', 'https://via.placeholder.com/150', 6, 10),
('Quiditch', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tincidunt nunc ac imperdiet sollicitudin.', 'https://via.placeholder.com/150', 7, 1);

INSERT INTO Lesson (day_of_week, start_hour, end_hour, color, class_id, subject_id) VALUES 
(1, '08:00:00', '09:00:00', '#ff0000', 1, 1),
(1, '09:00:00', '10:00:00', '#ffff00', 1, 2),
(1, '10:00:00', '11:00:00', '#0000ff', 1, 3),
(1, '11:00:00', '12:00:00', '#ff00ff', 1, 4),
(1, '13:00:00', '14:00:00', '#00ff00', 1, 5),
(1, '14:00:00', '15:00:00', '#ff0000', 1, 6),
(2, '08:00:00', '09:00:00', '#ffff00', 2, 1),
(2, '09:00:00', '10:00:00', '#0000ff', 2, 2),
(2, '10:00:00', '11:00:00', '#ff00ff', 2, 3),
(2, '11:00:00', '12:00:00', '#00ff00', 2, 4),
(2, '13:00:00', '14:00:00', '#ff0000', 2, 5);




ALTER TABLE wizard ADD CONSTRAINT wizard_house_id_foreign FOREIGN KEY (house_id) REFERENCES house (id) ON DELETE SET NULL;
ALTER TABLE wizard ADD CONSTRAINT wizard_class_id_foreign FOREIGN KEY (class_id) REFERENCES class (id) ON DELETE SET NULL;
ALTER TABLE wizardrole ADD CONSTRAINT wizardrole_wizard_id_foreign FOREIGN KEY (wizard_id) REFERENCES wizard (id) ON DELETE CASCADE;
ALTER TABLE wizardrole ADD CONSTRAINT wizardrole_role_id_foreign FOREIGN KEY (role_id) REFERENCES role (id) ON DELETE CASCADE;
ALTER TABLE subject ADD CONSTRAINT subject_room_id_foreign FOREIGN KEY (room_id) REFERENCES room (id) ON DELETE SET NULL;
ALTER TABLE subject ADD CONSTRAINT subject_wizard_id_foreign FOREIGN KEY (wizard_id) REFERENCES wizard (id) ON DELETE SET NULL;
ALTER TABLE lesson ADD CONSTRAINT lesson_class_id_foreign FOREIGN KEY (class_id) REFERENCES class (id) ON DELETE SET NULL;
ALTER TABLE lesson ADD CONSTRAINT lesson_subject_id_foreign FOREIGN KEY (subject_id) REFERENCES subject (id) ON DELETE SET NULL;
