import { format } from 'date-fns';
import ClientDashboard from '@/components/ClientDashboard';
import fs from 'fs';
import path from 'path';

export default async function Page() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const jsonPath = path.join(process.cwd(), 'planData.json');
  const fileContents = fs.readFileSync(jsonPath, 'utf8');
  const allPlans = JSON.parse(fileContents);

  const plan = allPlans.find((p: any) => new Date(p.date).getTime() === today.getTime());

  if (!plan) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 p-6 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">План на сегодня не найден.</h1>
        <p className="text-slate-400">Возможно, 70-дневный план завершен или еще не начался.</p>
      </div>
    );
  }

  return <ClientDashboard plan={plan} todayStr={format(today, 'dd.MM.yyyy')} />;
}
