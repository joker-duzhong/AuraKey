import { FC } from 'react';
import Layout from '../components/Layout';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';

const Dashboard: FC = () => {
  const stats = [
    { title: 'Total Users', value: '1,234', icon: '👥' },
    { title: 'Active Sessions', value: '456', icon: '📊' },
    { title: 'Revenue', value: '$12,345', icon: '💰' },
    { title: 'Conversion Rate', value: '3.2%', icon: '📈' },
  ];

  return (
    <Layout
      sidebar={<Sidebar />}
      header={<Header title="Tables" subtitle="Pages / Tables" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="h-[420px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Development Table</h3>
              <p className="text-sm text-[var(--muted)]">(placeholder content)</p>
            </div>
            <div className="text-sm text-[var(--muted)]">•••</div>
          </div>

          <div className="h-full border-t border-[#0f2336] pt-4 text-[var(--muted)]">
            <p>Table content area — replace later.</p>
          </div>
        </Card>

        <Card className="h-[420px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Check Table</h3>
              <p className="text-sm text-[var(--muted)]">(placeholder)</p>
            </div>
            <div className="text-sm text-[var(--muted)]">•••</div>
          </div>

          <div className="h-full border-t border-[#0f2336] pt-4 text-[var(--muted)]">
            <p>Right-side table content placeholder.</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-[260px]">
          <h3 className="text-lg font-semibold mb-3">4-Column Table</h3>
          <div className="text-[var(--muted)]">Short table placeholder.</div>
        </Card>

        <Card className="h-[260px]">
          <h3 className="text-lg font-semibold mb-3">Complex Table</h3>
          <div className="text-[var(--muted)]">Another placeholder panel.</div>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
