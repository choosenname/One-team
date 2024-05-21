const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const departments = [
        { department: 'general' },
        { department: 'personal' }
    ];

    for (const dep of departments) {
        await prisma.department.upsert({
            where: { department: dep.department },
            update: {},
            create: dep,
        });
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
