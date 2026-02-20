import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // 1 School
    const school = await prisma.school.create({
        data: {
            name: 'Tech Academy Main',
        },
    })

    // 1 Track with 2 Sessions
    const track = await prisma.track.create({
        data: {
            title: 'Python for Beginners',
            description: 'Introduction to Python programming',
            sessions: {
                create: [
                    { title: 'Session 1: Variables', orderIndex: 1 },
                    { title: 'Session 2: Loops', orderIndex: 2 },
                ],
            },
        },
    })

    // Users
    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: '123',
            name: 'Super Admin',
            role: 'ADMIN',
        },
    })

    const teacher = await prisma.user.create({
        data: {
            username: 'teacher1',
            password: '123',
            name: 'John Teacher',
            role: 'TEACHER',
        },
    })

    const student1 = await prisma.user.create({
        data: {
            username: 'student1',
            password: '123',
            name: 'Alice Student',
            role: 'STUDENT',
        },
    })

    const student2 = await prisma.user.create({
        data: {
            username: 'student2',
            password: '123',
            name: 'Bob Student',
            role: 'STUDENT',
        },
    })

    // 1 Group linked to School and Track (using GroupTrack relation)
    const group = await prisma.group.create({
        data: {
            name: 'Python Group A',
            dayOfWeek: 'Monday',
            timeSlot: '17:00 - 18:30',
            subject: 'Python Level 1',
            ageRange: '10-12 years',
            schoolId: school.id,
            groupTracks: {
                create: [{
                    trackId: track.id,
                    startDate: new Date(),
                }]
            },
            teachers: {
                connect: [{ id: teacher.id }],
            },
            students: {
                connect: [{ id: student1.id }, { id: student2.id }],
            },
        },
    })

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
