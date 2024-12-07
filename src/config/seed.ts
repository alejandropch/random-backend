// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  const users = [];

  for (let i = 0; i < 50; i++) {
    users.push({
      username: faker.internet.username(),
      email: faker.internet.email(),
      fullname: faker.person.firstName() + faker.person.lastName(),
      password: faker.internet.password(),
      user_category: faker.helpers.arrayElement(['admin', 'user']),
      created_at: faker.date.recent(),
      updated_at: faker.date.recent(),
    });
  }

  await prisma.user.createMany({
    data: users,
  });

  console.log('50 fake users generated and added to the database!');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
