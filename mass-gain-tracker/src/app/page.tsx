import ClientDashboard from '@/components/ClientDashboard';
import fs from 'fs';
import path from 'path';

export default async function Page() {
  const jsonPath = path.join(process.cwd(), 'planData.json');
  const fileContents = fs.readFileSync(jsonPath, 'utf8');
  const allPlans = JSON.parse(fileContents);

  return <ClientDashboard allPlans={allPlans} />;
}
