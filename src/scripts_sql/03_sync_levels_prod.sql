-- Création/synchronisation des niveaux de difficulté
-- Utilise INSERT ... ON CONFLICT UPDATE pour forcer la cohérence même si les lignes existent déjà

INSERT INTO level (id, name) VALUES 
(1, 'Facile'),
(2, 'Intermédiaire'),
(3, 'Difficile')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
