-- =============================================
-- LojaTech - Script de Criação do Banco de Dados
-- Versão simplificada para turma 202
-- Foco: Produtos + conexão via JavaScript (fetch)
-- =============================================

CREATE DATABASE IF NOT EXISTS lojatech 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE lojatech;

CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    estoque INT DEFAULT 0,
    categoria VARCHAR(100),
    imagem_url VARCHAR(255),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dados de exemplo
INSERT INTO produtos (nome, descricao, preco, estoque, categoria, imagem_url) VALUES
('Mouse Gamer RGB', 'Mouse óptico com iluminação RGB e 6 botões programáveis', 89.90, 45, 'Periféricos', 'https://picsum.photos/id/1015/300/200'),
('Teclado Mecânico', 'Teclado mecânico switch blue com iluminação RGB', 249.90, 28, 'Periféricos', 'https://picsum.photos/id/160/300/200'),
('Monitor 24" Full HD', 'Monitor LED 24 polegadas Full HD 75Hz', 799.00, 15, 'Monitores', 'https://picsum.photos/id/201/300/200'),
('Headset Gamer', 'Headset com microfone e som surround 7.1', 159.90, 33, 'Áudio', 'https://picsum.photos/id/251/300/200'),
('Webcam Full HD', 'Webcam 1080p com microfone embutido', 129.90, 22, 'Periféricos', 'https://picsum.photos/id/180/300/200');