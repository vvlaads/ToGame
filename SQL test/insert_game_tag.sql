INSERT INTO game_tag (game_id, tag_id)
VALUES 
-- Dota 2
((SELECT id FROM game WHERE name = 'Dota 2'), (SELECT id FROM tag WHERE name = 'MOBA')),
((SELECT id FROM game WHERE name = 'Dota 2'), (SELECT id FROM tag WHERE name = 'Соревновательный')),
((SELECT id FROM game WHERE name = 'Dota 2'), (SELECT id FROM tag WHERE name = 'Командная')),
((SELECT id FROM game WHERE name = 'Dota 2'), (SELECT id FROM tag WHERE name = 'PvP')),
((SELECT id FROM game WHERE name = 'Dota 2'), (SELECT id FROM tag WHERE name = 'Киберспорт')),
((SELECT id FROM game WHERE name = 'Dota 2'), (SELECT id FROM tag WHERE name = 'Бесплатно')),

-- Counter-Strike 2
((SELECT id FROM game WHERE name = 'Counter-Strike 2'), (SELECT id FROM tag WHERE name = 'Шутер')),
((SELECT id FROM game WHERE name = 'Counter-Strike 2'), (SELECT id FROM tag WHERE name = 'Тактический')),
((SELECT id FROM game WHERE name = 'Counter-Strike 2'), (SELECT id FROM tag WHERE name = 'Соревновательный')),
((SELECT id FROM game WHERE name = 'Counter-Strike 2'), (SELECT id FROM tag WHERE name = 'От первого лица')),
((SELECT id FROM game WHERE name = 'Counter-Strike 2'), (SELECT id FROM tag WHERE name = 'Киберспорт')),

-- Apex Legends
((SELECT id FROM game WHERE name = 'Apex Legends'), (SELECT id FROM tag WHERE name = 'Шутер')),
((SELECT id FROM game WHERE name = 'Apex Legends'), (SELECT id FROM tag WHERE name = 'Королевская битва')),
((SELECT id FROM game WHERE name = 'Apex Legends'), (SELECT id FROM tag WHERE name = 'От первого лица')),
((SELECT id FROM game WHERE name = 'Apex Legends'), (SELECT id FROM tag WHERE name = 'Бесплатно')),
((SELECT id FROM game WHERE name = 'Apex Legends'), (SELECT id FROM tag WHERE name = 'Научная фантастика')),

-- Valorant
((SELECT id FROM game WHERE name = 'Valorant'), (SELECT id FROM tag WHERE name = 'Шутер')),
((SELECT id FROM game WHERE name = 'Valorant'), (SELECT id FROM tag WHERE name = 'Тактический')),
((SELECT id FROM game WHERE name = 'Valorant'), (SELECT id FROM tag WHERE name = 'Соревновательный')),
((SELECT id FROM game WHERE name = 'Valorant'), (SELECT id FROM tag WHERE name = 'От первого лица')),
((SELECT id FROM game WHERE name = 'Valorant'), (SELECT id FROM tag WHERE name = 'Бесплатно')),

-- League of Legends
((SELECT id FROM game WHERE name = 'League of Legends'), (SELECT id FROM tag WHERE name = 'MOBA')),
((SELECT id FROM game WHERE name = 'League of Legends'), (SELECT id FROM tag WHERE name = 'Соревновательный')),
((SELECT id FROM game WHERE name = 'League of Legends'), (SELECT id FROM tag WHERE name = 'Командная')),
((SELECT id FROM game WHERE name = 'League of Legends'), (SELECT id FROM tag WHERE name = 'PvP')),
((SELECT id FROM game WHERE name = 'League of Legends'), (SELECT id FROM tag WHERE name = 'Бесплатно')),

-- Minecraft
((SELECT id FROM game WHERE name = 'Minecraft'), (SELECT id FROM tag WHERE name = 'Песочница')),
((SELECT id FROM game WHERE name = 'Minecraft'), (SELECT id FROM tag WHERE name = 'Выживание')),
((SELECT id FROM game WHERE name = 'Minecraft'), (SELECT id FROM tag WHERE name = 'Приключения')),
((SELECT id FROM game WHERE name = 'Minecraft'), (SELECT id FROM tag WHERE name = 'Строительство')),
((SELECT id FROM game WHERE name = 'Minecraft'), (SELECT id FROM tag WHERE name = 'Открытый мир')),
((SELECT id FROM game WHERE name = 'Minecraft'), (SELECT id FROM tag WHERE name = 'Творческая')),

-- Genshin Impact
((SELECT id FROM game WHERE name = 'Genshin Impact'), (SELECT id FROM tag WHERE name = 'RPG')),
((SELECT id FROM game WHERE name = 'Genshin Impact'), (SELECT id FROM tag WHERE name = 'Приключения')),
((SELECT id FROM game WHERE name = 'Genshin Impact'), (SELECT id FROM tag WHERE name = 'Открытый мир')),
((SELECT id FROM game WHERE name = 'Genshin Impact'), (SELECT id FROM tag WHERE name = 'Фэнтези')),
((SELECT id FROM game WHERE name = 'Genshin Impact'), (SELECT id FROM tag WHERE name = 'Бесплатно')),

-- Overwatch 2
((SELECT id FROM game WHERE name = 'Overwatch 2'), (SELECT id FROM tag WHERE name = 'Шутер')),
((SELECT id FROM game WHERE name = 'Overwatch 2'), (SELECT id FROM tag WHERE name = 'Командная')),
((SELECT id FROM game WHERE name = 'Overwatch 2'), (SELECT id FROM tag WHERE name = 'От первого лица')),
((SELECT id FROM game WHERE name = 'Overwatch 2'), (SELECT id FROM tag WHERE name = 'Бесплатно')),

-- Warframe
((SELECT id FROM game WHERE name = 'Warframe'), (SELECT id FROM tag WHERE name = 'Шутер')),
((SELECT id FROM game WHERE name = 'Warframe'), (SELECT id FROM tag WHERE name = 'Кооператив')),
((SELECT id FROM game WHERE name = 'Warframe'), (SELECT id FROM tag WHERE name = 'Научная фантастика')),
((SELECT id FROM game WHERE name = 'Warframe'), (SELECT id FROM tag WHERE name = 'PvE')),
((SELECT id FROM game WHERE name = 'Warframe'), (SELECT id FROM tag WHERE name = 'Бесплатно')),

-- Rocket League
((SELECT id FROM game WHERE name = 'Rocket League'), (SELECT id FROM tag WHERE name = 'Спортивная')),
((SELECT id FROM game WHERE name = 'Rocket League'), (SELECT id FROM tag WHERE name = 'Соревновательный')),
((SELECT id FROM game WHERE name = 'Rocket League'), (SELECT id FROM tag WHERE name = 'Командная')),
((SELECT id FROM game WHERE name = 'Rocket League'), (SELECT id FROM tag WHERE name = 'Киберспорт')),

-- Phasmophobia
((SELECT id FROM game WHERE name = 'Phasmophobia'), (SELECT id FROM tag WHERE name = 'Хоррор')),
((SELECT id FROM game WHERE name = 'Phasmophobia'), (SELECT id FROM tag WHERE name = 'Кооператив')),
((SELECT id FROM game WHERE name = 'Phasmophobia'), (SELECT id FROM tag WHERE name = 'Инди')),
((SELECT id FROM game WHERE name = 'Phasmophobia'), (SELECT id FROM tag WHERE name = 'Выживание')),

-- Among Us
((SELECT id FROM game WHERE name = 'Among Us'), (SELECT id FROM tag WHERE name = 'Социальная дедукция')),
((SELECT id FROM game WHERE name = 'Among Us'), (SELECT id FROM tag WHERE name = 'Казуальная')),
((SELECT id FROM game WHERE name = 'Among Us'), (SELECT id FROM tag WHERE name = 'Инди')),
((SELECT id FROM game WHERE name = 'Among Us'), (SELECT id FROM tag WHERE name = 'Бесплатно')),

-- Fortnite
((SELECT id FROM game WHERE name = 'Fortnite'), (SELECT id FROM tag WHERE name = 'Королевская битва')),
((SELECT id FROM game WHERE name = 'Fortnite'), (SELECT id FROM tag WHERE name = 'Шутер')),
((SELECT id FROM game WHERE name = 'Fortnite'), (SELECT id FROM tag WHERE name = 'Строительство')),
((SELECT id FROM game WHERE name = 'Fortnite'), (SELECT id FROM tag WHERE name = 'От третьего лица')),
((SELECT id FROM game WHERE name = 'Fortnite'), (SELECT id FROM tag WHERE name = 'Бесплатно')),

-- World of Warcraft
((SELECT id FROM game WHERE name = 'World of Warcraft'), (SELECT id FROM tag WHERE name = 'MMORPG')),
((SELECT id FROM game WHERE name = 'World of Warcraft'), (SELECT id FROM tag WHERE name = 'Фэнтези')),
((SELECT id FROM game WHERE name = 'World of Warcraft'), (SELECT id FROM tag WHERE name = 'PvE')),
((SELECT id FROM game WHERE name = 'World of Warcraft'), (SELECT id FROM tag WHERE name = 'PvP')),
((SELECT id FROM game WHERE name = 'World of Warcraft'), (SELECT id FROM tag WHERE name = 'Открытый мир'));