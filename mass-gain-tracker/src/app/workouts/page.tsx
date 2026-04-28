import fs from 'fs';
import path from 'path';
import WorkoutsDashboard from './WorkoutsDashboard';

export default async function Page() {
  const jsonPath = path.join(process.cwd(), 'planData.json');
  const fileContents = fs.readFileSync(jsonPath, 'utf8');
  const allPlans = JSON.parse(fileContents);

  return <WorkoutsDashboard allPlans={allPlans} />;
}
