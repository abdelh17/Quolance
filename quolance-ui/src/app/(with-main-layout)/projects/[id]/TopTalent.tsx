import { useGetFreelancerRecommendations } from '@/api/client-api';
import Loading from '@/components/ui/loading/loading';
import SimpleFreelancerCard from '@/components/ui/freelancers/SimpleFreelancerCard';
import { FreelancerRecommendationType } from '@/constants/models/user/UserResponse';

type TopTalentsProps = {
  projectId: string;
};

export default function TopTalents({ projectId }: TopTalentsProps) {
  // Hardcode top N as 3
  const topN = 3;

  const { data, isLoading, isError } = useGetFreelancerRecommendations(projectId, topN);

  if (isLoading) return <Loading />;
  if (isError) return <div>Error loading top talents.</div>;

  const recommendations: FreelancerRecommendationType[] = data?.data ?? [];

  return (
    <section className="container my-8">
      <h2 className="text-2xl font-bold mb-4">Top Talents Recommended</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {recommendations.map((rec) => (
          <SimpleFreelancerCard
            key={rec.profile.id}
            freelancerProfile={rec.profile}
            similarityScore={rec.similarityScore}
          />
        ))}
      </div>
    </section>
  );
}
