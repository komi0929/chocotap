/* ============================================ */
/*   chocotap — Shop Data & Badge Definitions   */
/*   Auto-generated: 2026-03-25   */
/* ============================================ */

const BADGE_DATA = [
  { id: 'hokkaido', pref: '北海道', name: '北海道ミルクチョコ', icon: '🥛🍫', desc: '北海道の新鮮なミルクとチョコのコラボ' },
  { id: 'aomori', pref: '青森県', name: '青森りんごチョコ', icon: '🍎🍫', desc: 'りんごの甘酸っぱさとカカオの出会い' },
  { id: 'miyagi', pref: '宮城県', name: '仙台ずんだチョコ', icon: '🫘🍫', desc: 'ずんだの風味がチョコに溶け込む' },
  { id: 'tokyo', pref: '東京都', name: '東京雷門チョコ', icon: '⛩️🍫', desc: '雷門をモチーフにした粋なチョコ' },
  { id: 'kanagawa', pref: '神奈川県', name: '横浜港チョコ', icon: '🚢🍫', desc: '港町横浜のハイカラチョコレート' },
  { id: 'shizuoka', pref: '静岡県', name: '静岡お茶チョコ', icon: '🍵🍫', desc: '深蒸し茶の旨みをチョコに凝縮' },
  { id: 'aichi', pref: '愛知県', name: '名古屋金シャチチョコ', icon: '🐟🍫', desc: '金のしゃちほこが輝くチョコ' },
  { id: 'mie', pref: '三重県', name: '伊勢神宮チョコ', icon: '🏯🍫', desc: '伊勢参りのお土産チョコ' },
  { id: 'shiga', pref: '滋賀県', name: '琵琶湖チョコ', icon: '💧🍫', desc: '琵琶湖の恵みが詰まったチョコ' },
  { id: 'kyoto', pref: '京都府', name: '京都抹茶チョコ', icon: '🍵🍫', desc: '宇治抹茶が織りなす和チョコ' },
  { id: 'osaka', pref: '大阪府', name: '大阪たこ焼きチョコ', icon: '🐙🍫', desc: 'たこ焼きソースがチョコと融合' },
  { id: 'hyogo', pref: '兵庫県', name: '神戸洋菓子チョコ', icon: '🎂🍫', desc: '洋菓子の街・神戸の本格チョコ' },
  { id: 'nara', pref: '奈良県', name: '奈良鹿チョコ', icon: '🦌🍫', desc: '鹿せんべい風味のユニークチョコ' },
  { id: 'okayama', pref: '岡山県', name: '岡山桃チョコ', icon: '🍑🍫', desc: '白桃の甘さとチョコのハーモニー' },
  { id: 'hiroshima', pref: '広島県', name: '広島もみじチョコ', icon: '🍁🍫', desc: 'もみじ饅頭風のご当地チョコ' },
  { id: 'ehime', pref: '愛媛県', name: '愛媛みかんチョコ', icon: '🍊🍫', desc: 'みかんの爽やかさがチョコを引き立てる' },
  { id: 'kagawa', pref: '香川県', name: '讃岐うどんチョコ', icon: '🍜🍫', desc: 'うどん県の実験的チョコレート' },
  { id: 'kochi', pref: '高知県', name: '高知柚子チョコ', icon: '🍋🍫', desc: '柚子の香りが広がるチョコ' },
  { id: 'fukuoka', pref: '福岡県', name: '博多明太子チョコ', icon: '🌶️🍫', desc: 'ピリ辛明太子とチョコの冒険' },
  { id: 'kumamoto', pref: '熊本県', name: '熊本くまモンチョコ', icon: '🐻🍫', desc: 'くまモンが見守るチョコレート' },
  { id: 'kagoshima', pref: '鹿児島県', name: '桜島チョコ', icon: '🌋🍫', desc: '火山のように情熱的なチョコ' },
  { id: 'okinawa', pref: '沖縄県', name: '沖縄シーサーチョコ', icon: '🦁🍫', desc: 'シーサーが守る南国チョコ' },
  { id: 'ishikawa', pref: '石川県', name: '金沢金箔チョコ', icon: '✨🍫', desc: '金箔が輝く加賀のチョコ' },
  { id: 'toyama', pref: '富山県', name: '富山ますチョコ', icon: '🐟🍫', desc: 'ます寿司の里のチョコレート' },
  { id: 'fukui', pref: '福井県', name: '恐竜チョコ', icon: '🦕🍫', desc: '恐竜王国のチョコレート' },
  { id: 'fukushima', pref: '福島県', name: '福島桃チョコ', icon: '🍑🍫', desc: '福島の桃が香るチョコ' },
  { id: 'iwate', pref: '岩手県', name: '岩手わんこチョコ', icon: '🥣🍫', desc: 'わんこそば風のチョコ体験' },
  { id: 'miyazaki', pref: '宮崎県', name: '宮崎マンゴーチョコ', icon: '🥭🍫', desc: 'トロピカルマンゴーチョコ' },
];

// Collection of all prefecture IDs for mapping
const PREF_ID_MAP = {
  '北海道': 'hokkaido', '青森県': 'aomori', '岩手県': 'iwate', '宮城県': 'miyagi',
  '秋田県': 'akita', '山形県': 'yamagata', '福島県': 'fukushima',
  '茨城県': 'ibaraki', '栃木県': 'tochigi', '群馬県': 'gunma',
  '埼玉県': 'saitama', '千葉県': 'chiba', '東京都': 'tokyo', '神奈川県': 'kanagawa',
  '新潟県': 'niigata', '富山県': 'toyama', '石川県': 'ishikawa', '福井県': 'fukui',
  '山梨県': 'yamanashi', '長野県': 'nagano',
  '岐阜県': 'gifu', '静岡県': 'shizuoka', '愛知県': 'aichi', '三重県': 'mie',
  '滋賀県': 'shiga', '京都府': 'kyoto', '大阪府': 'osaka', '兵庫県': 'hyogo',
  '奈良県': 'nara', '和歌山県': 'wakayama',
  '鳥取県': 'tottori', '島根県': 'shimane', '岡山県': 'okayama', '広島県': 'hiroshima', '山口県': 'yamaguchi',
  '徳島県': 'tokushima', '香川県': 'kagawa', '愛媛県': 'ehime', '高知県': 'kochi',
  '福岡県': 'fukuoka', '佐賀県': 'saga', '長崎県': 'nagasaki', '熊本県': 'kumamoto',
  '大分県': 'oita', '宮崎県': 'miyazaki', '鹿児島県': 'kagoshima', '沖縄県': 'okinawa'
};

// ========== SHOP DATA (Auto-fetched via Places API) ==========
const DEFAULT_SHOP_DATA = [
  // 京都府
  { name: "bean to bar chocolate ICHIJI", lat: 34.7291, lng: 135.3052, prefecture: "兵庫県" },
  { name: "Bean to bar chocolate NAGANO", lat: 34.7229, lng: 135.2596, prefecture: "兵庫県" },
  { name: "Choco Forest", lat: 34.7821, lng: 135.6306, prefecture: "京都府" },
  { name: "Nakamura Chocolate", lat: 34.7263, lng: 135.2732, prefecture: "兵庫県" },
  { name: "ショコラティエ パレ ド オール", lat: 34.7002, lng: 135.495, prefecture: "京都府" },
  // 北海道
  { name: "CACAO CROWN", lat: 42.8372, lng: 140.6752, prefecture: "北海道" },
  { name: "Chocolate&Espresso SATURDAYS Stand", lat: 43.068, lng: 141.3509, prefecture: "北海道" },
  { name: "coffee&chocolate Marley 東店", lat: 43.0554, lng: 141.3552, prefecture: "北海道" },
  { name: "SATURDAYS Chocolate Factory&Cafe", lat: 43.0593, lng: 141.3588, prefecture: "北海道" },
  { name: "SOIL CHOCOLATE(ソイル チョコレート)", lat: 43.0588, lng: 141.348, prefecture: "北海道" },
  { name: "Wolves tracks small batch chocolate", lat: 43.4257, lng: 142.4694, prefecture: "富山県" },
  { name: "リピチョコ -RIPi CIOCCO-", lat: 43.0641, lng: 141.3202, prefecture: "北海道" },
  { name: "ルセットショコラ", lat: 42.9116, lng: 143.1652, prefecture: "北海道" },
  { name: "ロイズカカオ&チョコレートタウン", lat: 43.1828, lng: 141.432, prefecture: "北海道" },
  { name: "ロイズチョコレートワールド", lat: 42.7874, lng: 141.6791, prefecture: "北海道" },
  // 千葉県
  { name: "Chocolate Cafe/Bar Seven Continents", lat: 35.674, lng: 139.9014, prefecture: "東京都" },
  { name: "green bean to bar CHOCOLATE 日本橋店", lat: 35.6877, lng: 139.7731, prefecture: "東京都" },
  { name: "MAISON CACAO グランスタ東京店（メゾンカカオ東京）", lat: 35.682, lng: 139.7668, prefecture: "東京都" },
  { name: "MAISONCACAO丸の内店(メゾンカカオ東京丸の内)", lat: 35.678, lng: 139.7624, prefecture: "東京都" },
  { name: "nel CRAFT CHOCOLATE TOKYO", lat: 35.6846, lng: 139.7897, prefecture: "東京都" },
  { name: "ショコラティエ パレ ド オール 東京", lat: 35.6827, lng: 139.764, prefecture: "東京都" },
  { name: "たぶん…世界一小さいチョコレート工場", lat: 35.563, lng: 140.3381, prefecture: "千葉県" },
  { name: "ル・ショコラ・アラン・デュカス 東京工房｜チョコレート専門店", lat: 35.6851, lng: 139.7764, prefecture: "東京都" },
  // 和歌山県
  { name: "K型 chocolate company Factory＆Cafe", lat: 33.6852, lng: 135.3546, prefecture: "和歌山県" },
  // 埼玉県
  { name: "東京 チョコレイト ファーム", lat: 35.7142, lng: 139.3807, prefecture: "埼玉県" },
  // 大阪府
  { name: "Cacaotier Gokan 高麗橋本店", lat: 34.6897, lng: 135.5043, prefecture: "大阪府" },
  { name: "DAIGO chocolat", lat: 34.6963, lng: 135.5138, prefecture: "大阪府" },
  { name: "KOBE CHOCO", lat: 34.6878, lng: 135.1912, prefecture: "兵庫県" },
  { name: "YARD Coffee ＆ Craft Chocolate", lat: 34.6519, lng: 135.5131, prefecture: "大阪府" },
  { name: "キャギ ド レーブ 大阪 チョコレート専門店", lat: 34.6771, lng: 135.5123, prefecture: "大阪府" },
  { name: "シオヤチョコレート", lat: 34.6374, lng: 135.0812, prefecture: "兵庫県" },
  { name: "ショコラトリー ココ", lat: 34.6795, lng: 135.5086, prefecture: "大阪府" },
  { name: "発酵カカオ専門店 チョコレート「カカオもの」【CACAOMONO】", lat: 34.6836, lng: 135.1636, prefecture: "兵庫県" },
  // 宮城県
  { name: "NAKAO CHOCOLATE HOUSE", lat: 38.3595, lng: 140.8933, prefecture: "宮城県" },
  { name: "チョコレートな関係", lat: 38.2613, lng: 140.8707, prefecture: "宮城県" },
  { name: "チョコレートな関係 cafe＆cake", lat: 38.2584, lng: 140.8717, prefecture: "宮城県" },
  { name: "チョコレート工房クレオバンテール", lat: 38.3163, lng: 141.0183, prefecture: "宮城県" },
  // 山口県
  { name: "萩チョコレートガーデン", lat: 34.413, lng: 131.4033, prefecture: "山口県" },
  // 岐阜県
  { name: "choco rico", lat: 35.2221, lng: 136.89, prefecture: "愛知県" },
  { name: "ショコラトリータカス", lat: 35.1743, lng: 136.9074, prefecture: "愛知県" },
  { name: "久遠チョコレート 名古屋藤巻", lat: 35.1499, lng: 136.9872, prefecture: "愛知県" },
  { name: "信州ショコラトリーGAKU 名古屋店 | チョコレート専門店", lat: 35.1675, lng: 136.9076, prefecture: "愛知県" },
  // 岡山県
  { name: "MARU CHOCOLATE FACTORY", lat: 34.4632, lng: 133.9954, prefecture: "岡山県" },
  { name: "sunny pantry(sun cacao工房)", lat: 34.5258, lng: 133.7985, prefecture: "岡山県" },
  { name: "石挽カカオ issai(イッサイ)", lat: 34.6246, lng: 133.588, prefecture: "岡山県" },
  { name: "石挽カカオ issai+", lat: 34.658, lng: 133.9181, prefecture: "岡山県" },
  // 岩手県
  { name: "盛岡クラフトチョコ専門店 クラフティ", lat: 39.6591, lng: 141.1486, prefecture: "岩手県" },
  // 島根県
  { name: "La chocolaterie NANAIRO", lat: 35.422, lng: 132.8562, prefecture: "島根県" },
  { name: "Pharmacy chocolate", lat: 34.4895, lng: 133.3646, prefecture: "広島県" },
  { name: "rit. craft chocolate and coffee", lat: 34.3619, lng: 132.4306, prefecture: "広島県" },
  { name: "Sora cacao lab.", lat: 34.8614, lng: 133.0038, prefecture: "島根県" },
  { name: "あさひチョコレート", lat: 34.4086, lng: 132.839, prefecture: "広島県" },
  { name: "カカオ果", lat: 34.3797, lng: 132.3581, prefecture: "広島県" },
  { name: "ショコラトリーエス", lat: 34.3975, lng: 132.4861, prefecture: "広島県" },
  { name: "御饌cacao", lat: 34.429, lng: 132.7449, prefecture: "広島県" },
  { name: "六感chocolate", lat: 34.3951, lng: 132.4653, prefecture: "広島県" },
  // 徳島県
  { name: "GBC Chocolate factory", lat: 33.9808, lng: 133.5323, prefecture: "徳島県" },
  // 愛媛県
  { name: "33.8° GOOD CACAO", lat: 33.8523, lng: 132.7861, prefecture: "愛媛県" },
  { name: "MARUCO 松山クラフトチョコレート", lat: 33.8538, lng: 132.7586, prefecture: "愛媛県" },
  { name: "U CHOCOLATE CLUB", lat: 33.459, lng: 132.4195, prefecture: "愛媛県" },
  // 愛知県
  // 東京都
  { name: "CRAFT CHOCOLATE WORKS 三軒茶屋", lat: 35.6461, lng: 139.6787, prefecture: "東京都" },
  { name: "green bean to bar CHOCOLATE 中目黒本店", lat: 35.6489, lng: 139.6941, prefecture: "東京都" },
  { name: "MOKA CHOCOLATE ＆ Factory （モカチョコレート＆ファクトリー）", lat: 35.6818, lng: 139.5758, prefecture: "東京都" },
  { name: "WHOSE CACAO奥沢ラボファクトリー", lat: 35.6, lng: 139.6715, prefecture: "東京都" },
  { name: "ショコラ房 （本店）", lat: 35.5423, lng: 139.5705, prefecture: "東京都" },
  // 沖縄県
  { name: "Lives Chocolate", lat: 26.3381, lng: 127.8153, prefecture: "沖縄県" },
  { name: "OKINAWA CACAO", lat: 26.7114, lng: 128.1628, prefecture: "沖縄県" },
  { name: "タイムレスチョコレート", lat: 26.3332, lng: 127.7446, prefecture: "沖縄県" },
  { name: "デザート ラボ ショコラ", lat: 26.213, lng: 127.718, prefecture: "沖縄県" },
  { name: "石垣チョコレート【Ishigaki chocolate】 Factory & Cafe", lat: 24.3409, lng: 124.1568, prefecture: "沖縄県" },
  // 滋賀県
  { name: "＋chocolat プラスショコラ", lat: 34.9988, lng: 135.7706, prefecture: "京都府" },
  { name: "CACAO MARKET by MARIEBELLE KYOTO", lat: 35.0051, lng: 135.7724, prefecture: "京都府" },
  { name: "Chocolaterie HISASHI", lat: 35.0095, lng: 135.7838, prefecture: "京都府" },
  { name: "Fran's Chocolates 京都BAL", lat: 35.0067, lng: 135.7698, prefecture: "京都府" },
  { name: "green bean to bar CHOCOLATE 京都店", lat: 35.0093, lng: 135.7598, prefecture: "京都府" },
  { name: "NEW STANDARD CHOCOLATE kyoto ニュー スタンダード チョコレート キョウト", lat: 35.0217, lng: 135.7516, prefecture: "京都府" },
  { name: "Premarché Cacaolate Lab プレマルシェ・カカオレート・ラボ", lat: 35.0086, lng: 135.7513, prefecture: "京都府" },
  { name: "ショコラ", lat: 35.0211, lng: 135.7316, prefecture: "滋賀県" },
  { name: "ショコラティエ・ドゥーブルセット", lat: 35.0027, lng: 135.7641, prefecture: "京都府" },
  { name: "京都生ショコラ オーガニックティーハウス", lat: 35.016, lng: 135.7863, prefecture: "京都府" },
  // 石川県
  { name: "AFTERGLOW CHOCOLATE/アフターグロウチョコレート", lat: 36.0672, lng: 136.2121, prefecture: "福井県" },
  { name: "FILFIL cacao factory & cafe", lat: 36.5617, lng: 136.6502, prefecture: "石川県" },
  { name: "FILFIL cacao factory by FIL D’OR", lat: 36.5781, lng: 136.6474, prefecture: "石川県" },
  { name: "カカオテ", lat: 36.5993, lng: 136.6124, prefecture: "石川県" },
  { name: "ショコラトリー 雨の詩", lat: 36.5649, lng: 136.6629, prefecture: "石川県" },
  { name: "横井チョコレート ショップ＆ファクトリーYOKOICHOCOLATE Shop&Factory", lat: 36.0889, lng: 136.2444, prefecture: "福井県" },
  // 神奈川県
  { name: "2U chocolate", lat: 35.4557, lng: 139.6045, prefecture: "神奈川県" },
  { name: "BLUE CACAO", lat: 35.4663, lng: 139.6219, prefecture: "神奈川県" },
  { name: "KAISEI chocolate laboratory", lat: 35.3373, lng: 139.1164, prefecture: "神奈川県" },
  { name: "MAISON CACAO FARM", lat: 35.3233, lng: 139.3779, prefecture: "神奈川県" },
  { name: "MAISON CACAO ニュウマン横浜店（メゾンカカオ横浜）", lat: 35.4671, lng: 139.623, prefecture: "神奈川県" },
  { name: "MAISON CACAO 鎌倉小町店", lat: 35.321, lng: 139.5521, prefecture: "神奈川県" },
  { name: "ショコラトリーキャメル", lat: 35.3209, lng: 139.5535, prefecture: "神奈川県" },
  { name: "たぶん、世界一小さいチョコレート工場 葉山直売店", lat: 35.2889, lng: 139.6, prefecture: "神奈川県" },
  { name: "チョコレートバンク", lat: 35.3185, lng: 139.5498, prefecture: "神奈川県" },
  { name: "メゾンカカオ（株）MAISON CACAO FACTORY", lat: 35.3332, lng: 139.3834, prefecture: "神奈川県" },
  // 福岡県
  { name: "cacao 326", lat: 33.3153, lng: 130.5074, prefecture: "福岡県" },
  { name: "Cacaori", lat: 33.5765, lng: 130.3928, prefecture: "福岡県" },
  { name: "CHOCOLATE BARチョコレイトバー", lat: 33.5713, lng: 130.4075, prefecture: "福岡県" },
  { name: "green bean to bar CHOCOLATE 福岡店", lat: 33.5862, lng: 130.3978, prefecture: "福岡県" },
  { name: "NICO chocolaterie（ニコ・ショコラトリー）", lat: 33.3998, lng: 130.5588, prefecture: "福岡県" },
  { name: "tabi cacao &LOCALS", lat: 33.5834, lng: 130.3852, prefecture: "福岡県" },
  { name: "to chocolate", lat: 33.5795, lng: 130.3787, prefecture: "福岡県" },
  { name: "オオツカファーム チョコ工房", lat: 33.5813, lng: 130.8566, prefecture: "福岡県" },
  { name: "カカオごと CACAOGOTO", lat: 33.6266, lng: 130.6089, prefecture: "福岡県" },
  { name: "カカオロマンス", lat: 33.5743, lng: 130.3936, prefecture: "福岡県" },
  { name: "カカオ研究所 cacaoken", lat: 33.6285, lng: 130.608, prefecture: "福岡県" },
  { name: "チョコレートショップ 山王店", lat: 33.5774, lng: 130.4322, prefecture: "福岡県" },
  { name: "チョコレートショップ 博多の石畳", lat: 33.5905, lng: 130.42, prefecture: "福岡県" },
  { name: "チョコレートショップ 福岡空港店", lat: 33.5968, lng: 130.4492, prefecture: "福岡県" },
  { name: "チョコレートショップ 本店", lat: 33.5972, lng: 130.408, prefecture: "福岡県" },
  { name: "レ トロワ ショコラ×チョコレートショップ", lat: 33.589, lng: 130.3992, prefecture: "福岡県" },
  { name: "久遠チョコレート＆DEMIｰSEC福岡六本松店", lat: 33.577, lng: 130.3767, prefecture: "福岡県" },
  { name: "焼生ショコラ専門店 Gateau-Lien 高宮店", lat: 33.5681, lng: 130.4141, prefecture: "福岡県" },
  // 福島県
  { name: "㈱いわきチョコレート 本店", lat: 36.9513, lng: 140.8925, prefecture: "福島県" },
  // 群馬県
  { name: "Bon Okawa 軽井沢チョコレートファクトリー", lat: 36.3439, lng: 138.6214, prefecture: "群馬県" },
  { name: "Bon Okawa 軽井沢チョコレートファクトリー チャーチストリート軽井沢店", lat: 36.3587, lng: 138.6353, prefecture: "群馬県" },
  { name: "Bon Okawa 軽井沢チョコレートファクトリー 軽井沢駅前店", lat: 36.3456, lng: 138.6349, prefecture: "群馬県" },
  // 茨城県
  { name: "Bean to Bar Chocolate Masakari/ビーントゥーバーチョコレートマサカリ", lat: 36.0335, lng: 140.1529, prefecture: "茨城県" },
  { name: "COFFEE&CACAO FACTORY", lat: 35.9528, lng: 139.9936, prefecture: "東京都" },
  { name: "SUNNY CHOCOLATE", lat: 35.714, lng: 139.8262, prefecture: "東京都" },
  { name: "Tribal Cacao", lat: 35.8665, lng: 139.9699, prefecture: "東京都" },
  { name: "ショコラティエ川路", lat: 35.7085, lng: 139.8014, prefecture: "東京都" },
  { name: "ダンデライオン・チョコレート ファクトリー＆カフェ蔵前", lat: 35.7037, lng: 139.7896, prefecture: "東京都" },
  { name: "東京チョコレートファーム KASHIWA", lat: 35.8341, lng: 139.9625, prefecture: "茨城県" },
  // 静岡県
  { name: "Conche（Craft chocolate specialty Store）", lat: 35.0105, lng: 138.4932, prefecture: "静岡県" },
  // 香川県
  { name: "ジャラク コーヒー & カカオ 林町店", lat: 34.3058, lng: 134.0665, prefecture: "香川県" },
];

// ========== EXTRACTION SCRIPT ==========
const EXTRACT_SCRIPT = `// === chocotap 魔法の抽出スクリプト v1.0 ===
// Googleマップのリスト画面で実行してください
(async () => {
  const delay = ms => new Promise(r => setTimeout(r, ms));
  const panel = document.querySelector('[role="feed"]') 
    || document.querySelector('.m6QErb.DxyBCb');
  if (!panel) { alert('リストパネルが見つかりません'); return; }
  
  // スクロールして全件読み込み
  let prev = 0;
  while (true) {
    panel.scrollTop = panel.scrollHeight;
    await delay(1500);
    const items = panel.querySelectorAll('[data-index]');
    if (items.length === prev) break;
    prev = items.length;
    console.log('読み込み中... ' + items.length + '件');
  }
  
  // データ抽出
  const results = [];
  const links = panel.querySelectorAll('a[href*="maps/place"]');
  links.forEach(a => {
    const name = a.getAttribute('aria-label') || a.textContent.trim();
    const href = a.href || '';
    const m = href.match(/@(-?[\\d.]+),(-?[\\d.]+)/);
    if (name && m) {
      results.push({
        name: name,
        lat: parseFloat(m[1]),
        lng: parseFloat(m[2]),
        prefecture: '' // 手動で補完してください
      });
    }
  });
  
  if (results.length === 0) {
    // 別の抽出方法を試行
    const items = panel.querySelectorAll('.fontHeadlineSmall');
    items.forEach(el => {
      const name = el.textContent.trim();
      if (name) results.push({ name, lat: 0, lng: 0, prefecture: '' });
    });
  }
  
  const json = JSON.stringify(results, null, 2);
  await navigator.clipboard.writeText(json);
  alert('✅ ' + results.length + '件のデータをクリップボードにコピーしました！\\nchocotapのAdmin画面に貼り付けてください。');
  console.log(json);
})();`;
