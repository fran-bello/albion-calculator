/**
 * Configuración de items por categorías para Market Flipping.
 */

export const CITIES = [
    { name: 'Martlock', value: 'Martlock' },
    { name: 'Thetford', value: 'Thetford' },
    { name: 'Fort Sterling', value: 'Fort Sterling' },
    { name: 'Lymhurst', value: 'Lymhurst' },
    { name: 'Bridgewatch', value: 'Bridgewatch' },
    { name: 'Caerleon', value: 'Caerleon' }
];

// Helper para generar IDs por Tier y Encantamiento
const generateTiers = (baseId, name, category, startTier = 4, endTier = 8, maxEnchant = 0) => {
    const items = [];
    for (let t = startTier; t <= endTier; t++) {
        // Item base (Plano)
        items.push({
            id: `T${t}_${baseId}`,
            name: `${name} (T${t})`,
            category
        });

        // Encantamientos (.1, .2, .3, etc)
        for (let e = 1; e <= maxEnchant; e++) {
            items.push({
                id: `T${t}_${baseId}@${e}`,
                name: `${name} (T${t}.${e})`,
                category
            });
        }
    }
    return items;
};

export const ITEM_CATEGORIES = {
    'Recursos Refinados': [
        ...generateTiers('CLOTH', 'Cloth', 'Resource'),
        ...generateTiers('METALBAR', 'Metal Bar', 'Resource'),
        ...generateTiers('LEATHER', 'Leather', 'Resource'),
        ...generateTiers('PLANKS', 'Planks', 'Resource'),
        ...generateTiers('STONEBLOCK', 'Stone Block', 'Resource')
    ],
    'Comidas': [
        ...generateTiers('MEAL_SOUP', 'Soup', 'Food', 3, 5, 1),
        ...generateTiers('MEAL_SALAD', 'Salad', 'Food', 4, 6, 1),
        ...generateTiers('MEAL_PIE', 'Pie', 'Food', 4, 7, 1),
        ...generateTiers('MEAL_STEW', 'Stew', 'Food', 4, 8, 1),
        ...generateTiers('MEAL_SANDWICH', 'Sandwich', 'Food', 4, 8, 1),
        ...generateTiers('MEAL_ROAST', 'Roast', 'Food', 3, 7, 1)
    ],
    'Pociones': [
        ...generateTiers('POTION_HEAL', 'Healing Potion', 'Potion', 4, 6, 1),
        ...generateTiers('POTION_ENERGY', 'Energy Potion', 'Potion', 4, 6, 1),
        ...generateTiers('POTION_COOLDOWN', 'Gigantify Potion', 'Potion', 4, 6, 1)
    ],
    'Bolsas y Capas': [
        ...generateTiers('BAG', 'Bag', 'Equipment', 4, 8, 3), // Hasta .3
        ...generateTiers('CAPE', 'Cape', 'Equipment', 4, 8, 3)  // Hasta .3
    ],
    'Monturas': [
        ...generateTiers('MOUNT_HORSE', 'Riding Horse', 'Mount', 3, 8),
        ...generateTiers('MOUNT_OX', 'Transport Ox', 'Mount', 3, 8)
    ],
    'Facción (Corazones)': [
        { id: 'T2_ROCK_HEART', name: 'Mountain Heart (Martlock)', category: 'Faction' },
        { id: 'T2_TREE_HEART', name: 'Vineheart (Lymhurst)', category: 'Faction' },
        { id: 'T2_BEAST_HEART', name: 'Beastheart (Bridgewatch)', category: 'Faction' },
        { id: 'T2_SNOW_HEART', name: 'Rockheart (Fort Sterling)', category: 'Faction' },
        { id: 'T2_SWAMP_HEART', name: 'Swampheart (Thetford)', category: 'Faction' }
    ],
    'Armaduras (Plate)': [
        ...generateTiers('ARMOR_PLATE_SET3', 'Guardian Armor', 'Armor', 4, 8, 3),
        ...generateTiers('ARMOR_PLATE_SET2', 'Knight Armor', 'Armor', 4, 8, 3),
        ...generateTiers('ARMOR_PLATE_SET1', 'Soldier Armor', 'Armor', 4, 8, 3)
    ],
    'Chaquetas (Leather)': [
        ...generateTiers('ARMOR_LEATHER_SET3', 'Hunter Jacket', 'Armor', 4, 8, 3),
        ...generateTiers('ARMOR_LEATHER_SET2', 'Assassin Jacket', 'Armor', 4, 8, 3),
        ...generateTiers('ARMOR_LEATHER_SET1', 'Mercenary Jacket', 'Armor', 4, 8, 3)
    ],
    'Túnicas (Cloth)': [
        ...generateTiers('ARMOR_CLOTH_SET3', 'Mage Robe', 'Armor', 4, 8, 3),
        ...generateTiers('ARMOR_CLOTH_SET2', 'Cleric Robe', 'Armor', 4, 8, 3),
        ...generateTiers('ARMOR_CLOTH_SET1', 'Scholar Robe', 'Armor', 4, 8, 3)
    ],
    'Botas y Zapatos': [
        ...generateTiers('SHOES_PLATE_SET3', 'Guardian Boots', 'Armor', 4, 8, 3),
        ...generateTiers('SHOES_PLATE_SET2', 'Knight Boots', 'Armor', 4, 8, 3),
        ...generateTiers('SHOES_PLATE_SET1', 'Soldier Boots', 'Armor', 4, 8, 3),
        ...generateTiers('SHOES_LEATHER_SET3', 'Hunter Shoes', 'Armor', 4, 8, 3),
        ...generateTiers('SHOES_LEATHER_SET2', 'Assassin Shoes', 'Armor', 4, 8, 3),
        ...generateTiers('SHOES_LEATHER_SET1', 'Mercenary Shoes', 'Armor', 4, 8, 3),
        ...generateTiers('SHOES_CLOTH_SET3', 'Mage Sandals', 'Armor', 4, 8, 3),
        ...generateTiers('SHOES_CLOTH_SET2', 'Cleric Sandals', 'Armor', 4, 8, 3),
        ...generateTiers('SHOES_CLOTH_SET1', 'Scholar Sandals', 'Armor', 4, 8, 3)
    ],
    'Cascos y Capuchas': [
        ...generateTiers('HEAD_PLATE_SET3', 'Guardian Helmet', 'Armor', 4, 8, 3),
        ...generateTiers('HEAD_PLATE_SET2', 'Knight Helmet', 'Armor', 4, 8, 3),
        ...generateTiers('HEAD_PLATE_SET1', 'Soldier Helmet', 'Armor', 4, 8, 3),
        ...generateTiers('HEAD_LEATHER_SET3', 'Hunter Hood', 'Armor', 4, 8, 3),
        ...generateTiers('HEAD_LEATHER_SET2', 'Assassin Hood', 'Armor', 4, 8, 3),
        ...generateTiers('HEAD_LEATHER_SET1', 'Mercenary Hood', 'Armor', 4, 8, 3),
        ...generateTiers('HEAD_CLOTH_SET3', 'Mage Cowl', 'Armor', 4, 8, 3),
        ...generateTiers('HEAD_CLOTH_SET2', 'Cleric Cowl', 'Armor', 4, 8, 3),
        ...generateTiers('HEAD_CLOTH_SET1', 'Scholar Cowl', 'Armor', 4, 8, 3)
    ],
    'Armas - Espadas': [
        ...generateTiers('MAIN_SWORD', 'Broadsword', 'Weapon', 4, 8, 3),
        ...generateTiers('2H_CLAYMORE', 'Claymore', 'Weapon', 4, 8, 3),
        ...generateTiers('2H_DUALSWORD', 'Dual Swords', 'Weapon', 4, 8, 3)
    ],
    'Armas - Dagas': [
        ...generateTiers('MAIN_DAGGER', 'Dagger', 'Weapon', 4, 8, 3),
        ...generateTiers('2H_DAGGERPAIR', 'Dagger Pair', 'Weapon', 4, 8, 3),
        ...generateTiers('2H_CLAWS', 'Claws', 'Weapon', 4, 8, 3),
        ...generateTiers('MAIN_RAPIER_MORGANA', 'Bloodletter', 'Weapon', 4, 8, 3)
    ],
    'Armas - Arcos': [
        ...generateTiers('2H_BOW', 'Bow', 'Weapon', 4, 8, 3),
        ...generateTiers('2H_WARBOW', 'Warbow', 'Weapon', 4, 8, 3),
        ...generateTiers('2H_LONGBOW', 'Longbow', 'Weapon', 4, 8, 3)
    ],
    'Armas - Ballestas': [
        ...generateTiers('2H_CROSSBOW', 'Crossbow', 'Weapon', 4, 8, 3),
        ...generateTiers('2H_CROSSBOWLARGE', 'Heavy Crossbow', 'Weapon', 4, 8, 3),
        ...generateTiers('MAIN_1HCROSSBOW', 'Light Crossbow', 'Weapon', 4, 8, 3)
    ],
    'Armas - Varitas de Fuego': [
        ...generateTiers('MAIN_FIRESTAFF', 'Fire Staff', 'Weapon', 4, 8, 3),
        ...generateTiers('2H_FIRESTAFF', 'Great Fire Staff', 'Weapon', 4, 8, 3),
        ...generateTiers('2H_INFERNOSTAFF', 'Infernal Staff', 'Weapon', 4, 8, 3)
    ],
    'Armas - Varitas de Escarcha': [
        ...generateTiers('MAIN_FROSTSTAFF', 'Frost Staff', 'Weapon', 4, 8, 3),
        ...generateTiers('2H_FROSTSTAFF', 'Great Frost Staff', 'Weapon', 4, 8, 3),
        ...generateTiers('2H_GLACIALSTAFF', 'Glacial Staff', 'Weapon', 4, 8, 3)
    ],
    'Armas - Varitas Arcanas y Sagradas': [
        ...generateTiers('MAIN_ARCANESTAFF', 'Arcane Staff', 'Weapon', 4, 8, 3),
        ...generateTiers('2H_ARCANESTAFF', 'Great Arcane Staff', 'Weapon', 4, 8, 3),
        ...generateTiers('MAIN_HOLYSTAFF', 'Holy Staff', 'Weapon', 4, 8, 3),
        ...generateTiers('2H_HOLYSTAFF', 'Great Holy Staff', 'Weapon', 4, 8, 3)
    ],
    'Armas - Varitas de Naturaleza y Malditas': [
        ...generateTiers('MAIN_NATURESTAFF', 'Nature Staff', 'Weapon', 4, 8, 3),
        ...generateTiers('2H_NATURESTAFF', 'Great Nature Staff', 'Weapon', 4, 8, 3),
        ...generateTiers('MAIN_CURSEDSTAFF', 'Cursed Staff', 'Weapon', 4, 8, 3),
        ...generateTiers('2H_CURSEDSTAFF', 'Great Cursed Staff', 'Weapon', 4, 8, 3)
    ],
    'Armas - Mazas y Martillos': [
        ...generateTiers('MAIN_MACE', 'Mace', 'Weapon', 4, 8, 3),
        ...generateTiers('2H_MACE', 'Heavy Mace', 'Weapon', 4, 8, 3),
        ...generateTiers('MAIN_HAMMER', 'Hammer', 'Weapon', 4, 8, 3),
        ...generateTiers('2H_HAMMER', 'Great Hammer', 'Weapon', 4, 8, 3),
        ...generateTiers('2H_QUARTERSTAFF', 'Quarterstaff', 'Weapon', 4, 8, 3)
    ],
    'Armas - Lanzas y Hachas': [
        ...generateTiers('MAIN_SPEAR', 'Spear', 'Weapon', 4, 8, 3),
        ...generateTiers('2H_SPEAR', 'Pike', 'Weapon', 4, 8, 3),
        ...generateTiers('2H_GLAIVE', 'Glaive', 'Weapon', 4, 8, 3),
        ...generateTiers('MAIN_AXE', 'Battleaxe', 'Weapon', 4, 8, 3),
        ...generateTiers('2H_AXE', 'Greataxe', 'Weapon', 4, 8, 3),
        ...generateTiers('2H_HALBERD', 'Halberd', 'Weapon', 4, 8, 3)
    ]
};

// Flattened list for compatibility if needed, though we will use categories mainly
export const FLIPPING_CANDIDATES = Object.values(ITEM_CATEGORIES).flat();
