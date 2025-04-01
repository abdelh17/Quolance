'use client';

import { useGetFreelancerRecommendations } from '@/api/client-api';
import Loading from '@/components/ui/loading/loading';
import TopTalentFreelancerCard from '@/components/ui/freelancers/TopTalentFreelancerCard';
import { FreelancerRecommendationType } from '@/constants/models/user/UserResponse';
import { motion } from 'framer-motion';

type TopTalentsProps = {
  projectId: string;
};

export default function TopTalents({ projectId }: TopTalentsProps) {
  const topN = 3;
  const { data, isLoading, isError } = useGetFreelancerRecommendations(projectId, topN);
  const recommendations: FreelancerRecommendationType[] = data?.data ?? [];

  if (isLoading) return <Loading />;
  if (isError) return <div>Error loading top talents.</div>;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-n100 bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-6 py-14 shadow-xl backdrop-blur-md my-14">
      {/* Decorative Gradient Glow */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        style={{
          background: 'radial-gradient(circle at 30% 30%, #c084fc, transparent 60%)',
        }}
      />

      {/* Header */}
      <motion.div
        className="relative z-10 text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 animate-text">
          🔮 AI-Powered Talent Matches
        </h2>
        <p className="mt-3 text-gray-600 text-lg max-w-xl mx-auto">
          Smartly selected freelancers, matched with your project using semantic vector embeddings and similarity scoring.
        </p>
      </motion.div>

      {/* Cards */}
      <motion.div
        className="grid grid-cols-1 gap-8 md:grid-cols-3 relative z-10"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
      >
        {recommendations.map((rec) => (
          <motion.div
            key={rec.profile.id}
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              show: { opacity: 1, scale: 1 },
            }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
            whileHover={{ scale: 1.04 }}
            className="rounded-xl bg-white/80 shadow-md ring-1 ring-n100 transition-transform duration-300"
          >
            <TopTalentFreelancerCard
              freelancerProfile={rec.profile}
              similarityScore={rec.similarityScore}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}