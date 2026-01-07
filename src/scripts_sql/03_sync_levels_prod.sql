-- Création des niveaux de difficulté
-- Note : La table level est vide en production, on crée des niveaux standards

INSERT INTO level (id, name) VALUES 
(1, 'Facile'),
(2, 'Moyen'),
(3, 'Difficile')
ON CONFLICT (id) DO NOTHING;
