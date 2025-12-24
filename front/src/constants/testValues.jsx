export const AVATAR_LIST = [
    {
        id: 1,
        name: 'Новичок',
        descr: 'Только осваиваю игровую индустрию'
    },
    {
        id: 2,
        name: 'Активный игрок',
        descr: 'Уделяю большое количество времени разным играм'
    },
    {
        id: 3,
        name: 'Киберспорстмен',
        descr: 'Играю в игры на профессиональном уровне'
    },
];

export const CHAT_LIST = [
    {
        id: 1,
        name: 'Посиделки',
        ownerId: 1,
        descr: 'Просто сидим с друзьями',
        image: 'vite.svg',
    },
    {
        id: 2,
        name: 'Киберспорт',
        ownerId: 1,
        descr: 'Играем турики каждый понедельник в 17:00',
        image: 'vite.svg',

    }
];

export const ROOM_LIST = [
    {
        uuid: '550e8400-e29b-41d4-a716-443255440000',
        name: 'Болталка',
        chatId: 1
    },
    {
        uuid: '320e8400-e29b-41d4-a716-446655440021',
        name: 'CS:GO',
        chatId: 2
    },
    {
        uuid: '107f8400-e22b-41d4-a716-446655440000',
        name: 'Общее',
        chatId: 2
    }
];

export const USER_LIST = [
    {
        id: 1,
        name: 'vvlaads',
        password: 'vvlaads',
        avatarId: 1,
        descr: 'Я новичок',
        roomId: null,
        image: 'Avatar.jpg',
        bannerImage: 'Banner.jpg'
    },
    {
        id: 2,
        name: 'GamerPro',
        password: '123',
        avatarId: 2,
        descr: 'Люблю играть в игры',
        roomId: null,
        image: 'Avatar1.jpg',
        bannerImage: 'Banner.jpg'
    },
    {
        id: 3,
        name: 'Capa',
        password: '123',
        avatarId: 3,
        descr: 'Люблю CS:GO',
        roomId: null,
        image: 'Avatar2.jpg',
        bannerImage: 'CS.png'
    }
];

export const TAG_LIST = [
    {
        id: 1,
        name: 'Шутер'
    },
    {
        id: 2,
        name: 'Стратегия'
    },
    {
        id: 3,
        name: 'Battle Royale'
    },
    {
        id: 4,
        name: 'Соревновательная'
    },
];

export const GAME_LIST = [
    {
        id: 1,
        name: 'Apex Legends',
        image: 'Apex.jpg',
        descr: 'Apex'
    },
    {
        id: 2,
        name: 'CS:GO',
        image: 'CS.png',
        descr: 'CS'
    },
    {
        id: 3,
        name: 'Dota 2',
        image: 'Dota.png',
        descr: 'Dota'
    }
];

export const FRIEND_LIST = [
    { user1Id: 1, user2Id: 2 },
    { user1Id: 1, user2Id: 3 },
];

export const LIKE_LIST = [
    {
        userId: 2,
        targetUserId: 3
    }
];

export const MESSAGE_LIST = [
    {
        uuid: '550e8400-e29b-41d4-a716-446655440000',
        createdAt: Date.now(),
        text: 'Привет!',
        userId: 1,
        chatId: 1,
    },
    {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        createdAt: Date.now(),
        text: 'Привет!',
        userId: 2,
        chatId: 2,
    }
];

export const GAME_TO_USER = [
    { userId: 1, gameId: 1 },
    { userId: 1, gameId: 2 },
    { userId: 2, gameId: 3 },
    { userId: 2, gameId: 1 },
    { userId: 3, gameId: 2 }
]

export const TAG_TO_GAME = [
    { tagId: 1, gameId: 1 },
    { tagId: 3, gameId: 1 },
    { tagId: 4, gameId: 1 },
    { tagId: 1, gameId: 2 },
    { tagId: 4, gameId: 2 },
    { tagId: 2, gameId: 3 },
    { tagId: 4, gameId: 3 }
]