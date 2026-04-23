import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function exportToJson() {
  const plans = await prisma.dailyPlan.findMany({
    include: { meals: true, exercises: true }
  });
  
  fs.writeFileSync('planData.json', JSON.stringify(plans, null, 2));
  console.log('Exported to planData.json');
}

exportToJson()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
