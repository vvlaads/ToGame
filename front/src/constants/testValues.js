import ApexAvatar from "../assets/Apex.jpg"

export const GAME_LIST = [
    {
        id: 1,
        name: "Apex Legends",
        avatar: ApexAvatar
    },
    {
        id: 2,
        name: "CS:GO",
        avatar: ApexAvatar
    },
    {
        id: 3,
        name: "Dota 2",
        avatar: ApexAvatar
    }
]

export const CHAT_LIST = [
    {
        id: 1,
        name: 'Чат 1',
        avatar: "../../public/vite.svg",
        rooms: [],
        messages: [
            {
                username: "vvlaads",
                date: "20.12.2025",
                time: "12:12:15",
                text: "Привет!"
            },
            {
                username: "vvlaads",
                date: "21.12.2025",
                time: "12:12:30",
                text: "Привет!"
            }
        ]
    },
    {
        id: 2,
        name: 'Чат 2',
        avatar: "../../public/vite.svg",
        rooms: [
            {
                id: 1,
                name: "Болталка",
                limit: 15,
                players: [
                    {
                        id: 1,
                        name: "vvlaads",
                        avatar: "../../public/vite.svg"
                    },
                    {
                        id: 2,
                        name: "GamerPro",
                        avatar: "../../public/vite.svg"
                    },
                    {
                        id: 3,
                        name: "Capa",
                        avatar: "../../public/vite.svg"
                    }
                ]
            },
            {
                id: 2,
                name: "CS:GO",
                limit: 15,
                players: [
                    {
                        id: 2,
                        name: "GamerPro",
                        avatar: "../../public/vite.svg"
                    },
                    {
                        id: 3,
                        name: "Capa",
                        avatar: "../../public/vite.svg"
                    }
                ]
            }
        ],
        messages: [
            {
                username: "GamerPro",
                date: "19.11.2025",
                time: "12:10:00",
                text: "Привет!"
            }
        ]
    }
];