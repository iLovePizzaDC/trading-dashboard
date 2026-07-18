import MomentumError from '@/features/momentum/components/molecules/MomentumError';
import MomentumSkeleton from '@/features/momentum/components/molecules/MomentumSkeleton';
import MomentumTimeline from '@/features/momentum/components/molecules/MomentumTimeline';
import { fetchDecisions } from '@/shared/api/data';
import { useFetch } from '@/shared/hooks/useFetch';

function Momentum() {
  const { data, loading, error } = useFetch(fetchDecisions);

  if (loading) return <MomentumSkeleton />;
  if (error || !data) return <MomentumError />;

  return <MomentumTimeline data={data} />;
}

export default Momentum;
