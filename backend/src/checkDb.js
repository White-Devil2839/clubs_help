const dotenv = require('dotenv');
dotenv.config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Connecting to database...');
        await prisma.$connect();
        console.log('Connected successfully.');

        const userCount = await prisma.user.count();
        console.log(`Found ${userCount} users.`);

        const users = await prisma.user.findMany({ take: 5 });
        console.log('Sample users:', users);

    } catch (error) {
        console.error('Database connection failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
