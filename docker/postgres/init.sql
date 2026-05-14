INSERT INTO avatar (name, descr, filepath, bannerfilepath)
VALUES (
        'Avatar 1',
        'Avatar 1',
        'avatar1.jpg',
        'banner1.jpg'
    ),
    (
        'Avatar 2',
        'Avatar 2',
        'avatar2.jpg',
        'banner2.jpg'
    ),
    (
        'Avatar 3',
        'Avatar 3',
        'avatar3.jpg',
        'banner3.jpg'
    ),
    (
        'Avatar 4',
        'Avatar 4',
        'avatar4.jpg',
        'banner1.jpg'
    ),
    (
        'Avatar 5',
        'Avatar 5',
        'avatar5.jpg',
        'banner2.jpg'
    ),
    (
        'Avatar 6',
        'Avatar 6',
        'avatar6.jpg',
        'banner3.jpg'
    );

INSERT INTO GAME (name, descr, filepath)
VALUES (
        'Dota 2',
        'Командная MOBA игра с глубокой стратегией и сотнями уникальных героев',
        'dota2.jpg'
    ),
    (
        'Counter-Strike 2',
        'Тактический шутер 5 на 5, где террористы противостоят спецназу',
        'cs2.jpg'
    ),
    (
        'Apex Legends',
        'Динамичный королевская битва с уникальными персонажами-легендами',
        'apex.jpg'
    ),
    (
        'Valorant',
        'Тактический шутер от Riot Games с уникальными способностями агентов',
        'valorant.jpg'
    ),
    (
        'League of Legends',
        'Самая популярная MOBA в мире с еженедельными обновлениями и турнирами',
        'lol.jpg'
    ),
    (
        'Minecraft',
        'Песочница с безграничными возможностями для творчества и выживания',
        'minecraft.jpg'
    ),
    (
        'Genshin Impact',
        'RPG в открытом мире с элементарной магией и мультиплеерным коопом',
        'genshin.jpg'
    ),
    (
        'Overwatch 2',
        'Командный шутер с разнообразными героями и красочными сражениями',
        'ow2.jpg'
    ),
    (
        'Warframe',
        'Кооперативный шутер про космических ниндзя с огромным контентом',
        'warframe.jpg'
    ),
    (
        'Rocket League',
        'Футбол на сверхзвуковых автомобилях с физикой на основе реальных законов',
        'rl.jpg'
    ),
    (
        'Phasmophobia',
        'Кооперативный хоррор об охоте на привидений с системой голосового чата',
        'phasmo.jpg'
    ),
    (
        'Among Us',
        'Социальная дедукция в космосе, где предатели пытаются саботировать команду',
        'amongus.jpg'
    ),
    (
        'Fortnite',
        'Королевская битва с механикой строительства и постоянными коллаборациями',
        'fortnite.jpg'
    ),
    (
        'World of Warcraft',
        'Культовая MMORPG с огромным миром, рейдами и PvP сражениями',
        'wow.jpg'
    );

INSERT INTO TAG (name)
VALUES ('MOBA'),
    ('Шутер'),
    ('Королевская битва'),
    ('Тактический'),
    ('Стратегия'),
    ('Экшен'),
    ('Приключения'),
    ('Выживание'),
    ('Хоррор'),
    ('Кооператив'),
    ('Соревновательный'),
    ('Казуальная'),
    ('MMORPG'),
    ('Песочница'),
    ('RPG'),
    ('Фэнтези'),
    ('Научная фантастика'),
    ('Инди'),
    ('Симулятор'),
    ('Спортивная'),
    ('Социальная дедукция'),
    ('Бесплатно'),
    ('PvP'),
    ('PvE'),
    ('От первого лица'),
    ('От третьего лица'),
    ('Мультиплеер'),
    ('Одиночная'),
    ('Строительство'),
    ('Открытый мир'),
    ('Командная'),
    ('Быстрые сражения'),
    ('Глубокий лор'),
    ('Создание персонажа'),
    ('Экономика'),
    ('Турниры'),
    ('Ранговые игры'),
    ('Киберспорт'),
    ('Расслабляющая'),
    ('Творческая');

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