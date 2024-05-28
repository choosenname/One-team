const bcrypt = require('bcryptjs');
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

    const generalDepartment = await prisma.department.findUnique({
        where: { department: 'general' },
    });

    const hashedPassword = await bcrypt.hash('admin', 10); // Замените 'securepassword' на нужный пароль

    const admin = {
        name: 'admin',
        password: hashedPassword,
        role: 'ADMIN',
        departmentId: generalDepartment.id,
        post: "Admin",
        office: "404",
        startWork: new Date(),
        endWork: new Date(),
    };

    await prisma.user.upsert({
        where: { name: admin.name },
        update: {},
        create: admin,
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
