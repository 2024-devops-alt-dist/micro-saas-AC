-- Synchronisation des catégories avec la production
TRUNCATE TABLE category RESTART IDENTITY CASCADE;

INSERT INTO category (id, name) VALUES 
(1, 'Français'),
(2, 'Mathématiques'),
(3, 'Histoire'),
(4, 'Géographie'),
(5, 'Économie'),
(6, 'Sciences'),
(7, 'Technologie'),
(8, 'Arts'),
(9, 'Littérature'),
(10, 'Biologie'),
(11, 'Physique'),
(12, 'Chimie'),
(13, 'Informatique'),
(14, 'Philosophie'),
(15, 'droit'),
(16, 'gestion'),
(17, 'professionnel'),
(18, 'autres');
