const mongoose = require('mongoose');
const Technique = require('./src/models/technique');
require('dotenv').config();

// Exempel på tekniker att lägga till i databasen
const techniques = [
    {
        name: 'Armbar från Guard',
        category: 'Submissions',
        position: 'Guard',
        difficulty: 'Nybörjare',
        description: 'En klassisk submission där du bryter motståndarens arm från guard-position. En fundamental teknik som alla bör kunna.',
        steps: [
            'Kontrollera motståndarens arm',
            'Lägg ditt ben över ansiktet',
            'Lyft höfterna och dra armen',
            'Applicera press för submission'
        ],
        tags: ['fundamental', 'submission', 'guard'],
        beltLevel: 'White',
    },
    {
        name: 'Triangle Choke',
        category: 'Submissions',
        position: 'Guard',
        difficulty: 'Mellan',
        description: 'Kväver motståndaren med dina ben i en triangel runt nacke och arm. En mycket effektiv submission från guard.',
        steps: [
            'Kontrollera motståndarens postur',
            'Få ena armen över',
            'Forma triangeln med benen',
            'Dra ner huvudet och squeeze'
        ],
        tags: ['submission', 'guard', 'choke'],
        beltLevel: 'Blue',
    },
    {
        name: 'Berimbolo',
        category: 'Sweeps',
        position: 'De La Riva Guard',
        difficulty: 'Avancerad',
        description: 'En avancerad sweep som involverar att rulla under motståndaren för att ta ryggkontroll.',
        steps: [
            'Etablera De La Riva guard',
            'Kontrollera armen',
            'Rulla under motståndaren',
            'Ta ryggkontroll'
        ],
        tags: ['sweep', 'advanced', 'dlr', 'back-take'],
        beltLevel: 'Purple',
    },
    {
        name: 'Kimura',
        category: 'Submissions',
        position: 'Olika',
        difficulty: 'Nybörjare',
        description: 'Ett kraftfullt skulderlås som kan appliceras från många positioner. Även kallat double wristlock.',
        steps: [
            'Fånga armen i figure-four grip',
            'Kontrollera armbågen',
            'Rotera skuldran',
            'Applicera press tills tap'
        ],
        tags: ['submission', 'shoulder-lock', 'versatile'],
        beltLevel: 'White',
    },
    {
        name: 'Scissor Sweep',
        category: 'Sweeps',
        position: 'Closed Guard',
        difficulty: 'Nybörjare',
        description: 'En grundläggande sweep från closed guard. Perfekt för att komma på topp.',
        steps: [
            'Öppna guard',
            'Placera ena foten på höften',
            'Kontrollera armen och kragen',
            'Skjut och dra samtidigt'
        ],
        tags: ['sweep', 'fundamental', 'closed-guard'],
        beltLevel: 'White',
    },
    {
        name: 'Rear Naked Choke',
        category: 'Submissions',
        position: 'Back Control',
        difficulty: 'Nybörjare',
        description: 'Den mest vanliga submissionen från back control. En kvävning runt halsen.',
        steps: [
            'Säkra back control med hooks',
            'Få armen under hakan',
            'Andra armen bakom huvudet',
            'Squeeze för submission'
        ],
        tags: ['submission', 'choke', 'back-control'],
        beltLevel: 'White',
    },
    {
        name: 'Guillotine Choke',
        category: 'Submissions',
        position: 'Guard / Stående',
        difficulty: 'Nybörjare',
        description: 'En frontal kvävning som kan appliceras från stående eller guard.',
        steps: [
            'Fånga huvudet under armen',
            'Grip händerna ihop',
            'Dra uppåt och squeeze',
            'Använd höfterna för extra kraft'
        ],
        tags: ['submission', 'choke', 'front-headlock'],
        beltLevel: 'White',
    },
    {
        name: 'Omoplata',
        category: 'Submissions',
        position: 'Guard',
        difficulty: 'Avancerad',
        description: 'En skulderlås-submission där du använder benen för att rotera skuldran.',
        steps: [
            'Kontrollera armen från guard',
            'Svep benet över axeln',
            'Rulla motståndaren framåt',
            'Applicera skulderlåset'
        ],
        tags: ['submission', 'shoulder-lock', 'advanced'],
        beltLevel: 'Purple',
    },
    {
        name: 'X-Guard Sweep',
        category: 'Sweeps',
        position: 'X-Guard',
        difficulty: 'Mellan',
        description: 'En kraftfull sweep från X-guard position som ger dig topp-position.',
        steps: [
            'Etablera X-guard',
            'Kontrollera benet med händer',
            'Lift och extend',
            'Följ med till topp-position'
        ],
        tags: ['sweep', 'x-guard', 'modern'],
        beltLevel: 'Blue',
    },
    {
        name: 'Americana (Keylock)',
        category: 'Submissions',
        position: 'Side Control / Mount',
        difficulty: 'Nybörjare',
        description: 'Ett skulderlås från topp-position. Mycket vanlig från side control och mount.',
        steps: [
            'Isolera armen',
            'Fånga handled i figure-four',
            'Rotera armen mot mattan',
            'Applicera press på skuldran'
        ],
        tags: ['submission', 'shoulder-lock', 'top-position'],
        beltLevel: 'White',
    },
];

// Funktion för att seeda databasen
async function seedDatabase() {
    try {
        // Anslut till MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Ansluten till MongoDB');

        // Rensa befintliga tekniker (optional - ta bort om du vill behålla gamla)
        await Technique.deleteMany({});
        console.log('🗑️  Raderade gamla tekniker');

        // Lägg till nya tekniker
        const createdTechniques = await Technique.insertMany(techniques);
        console.log(`✅ Lade till ${createdTechniques.length} tekniker i databasen`);

        // Visa några exempel
        console.log('\n📚 Exempel på tillagda tekniker:');
        createdTechniques.slice(0, 3).forEach(tech => {
            console.log(`   - ${tech.name} (${tech.category}, ${tech.difficulty})`);
        });

        console.log('\n✨ Seeding klar!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Fel vid seeding:', error);
        process.exit(1);
    }
}

// Kör seeding
seedDatabase();
