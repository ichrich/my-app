import { PrismaClient } from '@prisma/client'
import { randomBytes, scryptSync } from 'node:crypto'
const db = new PrismaClient()
const games = [
  [
    "Half-Life 2",
    220,
    "Action",
    "2004-11-16",
    "Гордон Фримен возвращается в мир, где Альянс подчинил человечество."
  ],
  [
    "Portal",
    400,
    "Puzzle",
    "2007-10-10",
    "Решайте пространственные головоломки с портальной пушкой."
  ],
  [
    "Portal 2",
    620,
    "Puzzle",
    "2011-04-19",
    "Вернитесь в лаборатории Aperture и пройдите испытания в одиночку или вдвоём."
  ],
  [
    "Dota 2",
    570,
    "Strategy",
    "2013-07-09",
    "Выберите героя и вместе с командой защищайте свою базу."
  ],
  [
    "Left 4 Dead 2",
    550,
    "Action",
    "2009-11-17",
    "Кооперативный шутер о выживании во время эпидемии."
  ],
  [
    "Team Fortress 2",
    440,
    "Action",
    "2007-10-10",
    "Командный шутер с девятью игровыми классами."
  ],
  [
    "Cyberpunk 2077",
    1091500,
    "RPG",
    "2020-12-10",
    "Исследуйте Найт-Сити в роли наёмника Ви.",
    "PlayStation",
    "Xbox",
    "Switch"
  ],
  [
    "The Witcher 3 Wild Hunt",
    292030,
    "RPG",
    "2015-05-18",
    "Геральт отправляется на поиски Цири.",
    "PlayStation",
    "Xbox",
    "Switch"
  ],
  [
    "Baldurs Gate 3",
    1086940,
    "RPG",
    "2023-08-03",
    "Соберите отряд и путешествуйте по Забытым королевствам.",
    "PlayStation",
    "Xbox"
  ],
  [
    "Elden Ring",
    1245620,
    "RPG",
    "2022-02-25",
    "Путешествие по Междуземью в поисках осколков Кольца Элден.",
    "PlayStation",
    "Xbox"
  ],
  [
    "Hades",
    1145360,
    "Action",
    "2020-09-17",
    "Загрей пытается выбраться из царства Аида.",
    "PlayStation",
    "Xbox",
    "Switch"
  ],
  [
    "Hades II",
    1145350,
    "Action",
    "2025-09-25",
    "Мелиноя сражается с силами титана времени.",
    "Switch"
  ],
  [
    "Hollow Knight",
    367520,
    "Adventure",
    "2017-02-24",
    "Откройте тайны заброшенного королевства Халлоунест.",
    "PlayStation",
    "Xbox",
    "Switch"
  ],
  [
    "Stardew Valley",
    413150,
    "Simulation",
    "2016-02-26",
    "Развивайте ферму и знакомьтесь с жителями долины.",
    "PlayStation",
    "Xbox",
    "Switch"
  ],
  [
    "Factorio",
    427520,
    "Simulation",
    "2020-08-14",
    "Стройте фабрики и автоматизируйте производственные цепочки.",
    "Switch"
  ],
  [
    "Terraria",
    105600,
    "Adventure",
    "2011-05-16",
    "Стройте, исследуйте и сражайтесь в мире с процедурной генерацией.",
    "PlayStation",
    "Xbox",
    "Switch"
  ],
  [
    "Subnautica",
    264710,
    "Adventure",
    "2018-01-23",
    "Исследуйте океан далёкой планеты после крушения корабля.",
    "PlayStation",
    "Xbox",
    "Switch"
  ],
  [
    "Outer Wilds",
    753640,
    "Adventure",
    "2019-05-28",
    "Разгадайте тайну солнечной системы, попавшей во временную петлю.",
    "PlayStation",
    "Xbox",
    "Switch"
  ],
  [
    "Disco Elysium",
    632470,
    "RPG",
    "2019-10-15",
    "Расследуйте преступление в Ревашоле.",
    "PlayStation",
    "Xbox",
    "Switch"
  ],
  [
    "Celeste",
    504230,
    "Adventure",
    "2018-01-25",
    "Помогите Мэдлин подняться на гору Селеста.",
    "PlayStation",
    "Xbox",
    "Switch"
  ],
  [
    "Slay the Spire",
    646570,
    "Strategy",
    "2019-01-23",
    "Соберите колоду и проложите путь к вершине башни.",
    "PlayStation",
    "Xbox",
    "Switch"
  ],
  [
    "Risk of Rain 2",
    632360,
    "Action",
    "2020-08-11",
    "Переживите волны противников на чужой планете.",
    "PlayStation",
    "Xbox",
    "Switch"
  ],
  [
    "DOOM Eternal",
    782330,
    "Action",
    "2020-03-20",
    "Остановите вторжение демонов на Землю.",
    "PlayStation",
    "Xbox",
    "Switch"
  ],
  [
    "No Mans Sky",
    275850,
    "Simulation",
    "2016-08-09",
    "Исследуйте планеты, собирайте ресурсы и стройте базы.",
    "PlayStation",
    "Xbox",
    "Switch"
  ]
]
async function entry(kind, slug, title, body, image, data = {}) {
  return db.entry.upsert({ where: { kind_slug: { kind, slug } }, create: { kind, slug, title, body, image, data }, update: {} })
}
const art = (id, file = 'header.jpg') => 'https://cdn.cloudflare.steamstatic.com/steam/apps/' + id + '/' + file
try {
  for (const [title, app, genre, release, body, ...consoles] of games) {
    const slug = title.toLowerCase().replaceAll(' ', '-')
    await entry('games', slug, title, body, art(app), {
      genre, release, platforms: ['PC', ...consoles], status: 'released',
      trailer: 'https://store.steampowered.com/app/' + app + '/',
      popularity: app === 1091500 ? 100 : app === 1245620 ? 98 : app === 1086940 ? 97 : 50
    })
  }
  await entry('games', 'signal-zero', 'Signal Zero', 'Демонстрационный анонс. Экспедиция отправляется к источнику сигнала на орбите далёкой планеты.', '/signal.svg',
    { genre: 'Adventure', platforms: ['PC'], status: 'upcoming' })
  await entry('banners', 'night-city', 'Cyberpunk 2077', 'Открой Найт-Сити. Город будущего ждёт тебя.', art(1091500, 'library_hero.jpg'), { target: '/games/cyberpunk-2077' })
  await entry('banners', 'elden-ring', 'Elden Ring', 'Отправься в Междуземье и выбери свой путь.', art(1245620, 'library_hero.jpg'), { target: '/games/elden-ring' })
  await entry('banners', 'portal-2', 'Portal 2', 'Возвращение в лаборатории Aperture.', art(620, 'library_hero.jpg'), { target: '/games/portal-2' })
  await entry('news', 'portal-2-coop', 'Portal 2 · Кооперативные испытания', 'Редакционная подборка для тех, кто ищет игру на двоих. У Portal 2 есть отдельная кооперативная кампания, где участники решают задачи с помощью четырёх порталов.', art(620))
  await entry('news', 'stardew-farm', 'Stardew Valley · Первые дни на ферме', 'Начните с небольшого огорода, познакомьтесь с жителями и выделите время на исследование долины.', art(413150))
  await entry('events', 'weekend-coop', 'Кооперативные выходные', 'Демонстрационное событие GameHub. Выберите игру для совместного прохождения и соберите команду.', art(550))
  const email = process.env.GAMEHUB_ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.GAMEHUB_ADMIN_PASSWORD
  if (email && password) {
    if (password.length < 12) throw new Error('GAMEHUB_ADMIN_PASSWORD must contain at least 12 characters')
    const salt = randomBytes(16).toString('hex')
    await db.user.upsert({ where: { email }, update: {}, create: {
      email, name: 'Администратор', role: 'admin', password: salt + ':' + scryptSync(password, salt, 64).toString('hex')
    } })
    if ((await db.user.findUnique({ where: { email } })).role !== 'admin') throw new Error('Administrator email is already registered to a regular user')
  }
} finally { await db.$disconnect() }
