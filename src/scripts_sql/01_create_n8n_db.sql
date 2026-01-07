-- Create n8n database if it doesn't exist
SELECT 'CREATE DATABASE my_n8n_local'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'my_n8n_local')\gexec
