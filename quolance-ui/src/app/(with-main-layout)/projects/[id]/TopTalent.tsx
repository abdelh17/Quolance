'use client';

import { useGetFreelancerRecommendations } from '@/api/client-api';
import Loading from '@/components/ui/loading/loading';
import TopTalentFreelancerCard from '@/components/ui/freelancers/TopTalentFreelancerCard';
import { FreelancerRecommendationType } from '@/models/user/UserResponse';
import { motion } from 'framer-motion';
import { Sparkles, BrainCircuit, Cpu } from 'lucide-react';

type TopTalentsProps = {
  projectId: string;
};

export default function TopTalents({ projectId }: TopTalentsProps) {
  const topN = 3;
  const { data, isLoading, isError } = useGetFreelancerRecommendations(projectId, topN);
  const recommendations: FreelancerRecommendationType[] = data?.data ?? [];

  if (isLoading) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Loading />
    </div>
  );
  
  if (isError) return (
    <div className="min-h-[200px] flex items-center justify-center text-gray-600 bg-gray-50 rounded-xl p-8">
      <p className="text-center">Unable to load talent recommendations. Please try again later.</p>
    </div>
  );

  return (
    <section className="relative overflow-hidden rounded-3xl border border-indigo-200/50 bg-gradient-to-br from-indigo-50/90 via-white to-indigo-100/90 px-8 py-12 shadow-xl backdrop-blur-lg my-14">
      {/* Multiple Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Gradient Glow */}
        <motion.div
          className="absolute -top-20 -left-20 w-96 h-96 rounded-full pointer-events-none z-0 opacity-30 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 30, 0],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          style={{
            background: 'radial-gradient(circle at center, #818cf8, transparent 70%)',
          }}
        />
        
        <motion.div
          className="absolute -bottom-10 -right-10 w-80 h-80 rounded-full pointer-events-none z-0 opacity-20 blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -20, 0],
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "reverse" 
          }}
          style={{
            background: 'radial-gradient(circle at center, #c084fc, transparent 70%)',
          }}
        />
        
        {/* Circuit Pattern */}
        <div className="absolute inset-0 bg-[url('/images/circuit-pattern.svg')] bg-repeat opacity-5"></div>
        
        {/* Border glow */}
        <div className="absolute inset-0 rounded-3xl border border-indigo-300/20 shadow-inner"></div>
      </div>

      {/* Header - slightly reduced in size */}
      <motion.div
        className="relative z-10 text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-center mb-5">
          <motion.div
            className="relative inline-flex items-center justify-center h-16 w-16"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-indigo-100 rounded-full"></div>
            <div className="absolute inset-1 bg-white rounded-full shadow-inner"></div>
            <motion.div
              className="relative z-10 bg-gradient-to-br from-indigo-600 to-purple-600 p-2.5 rounded-full shadow-lg"
              whileHover={{ 
                scale: 1.05,
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 0.5 }}
            >
              <BrainCircuit className="h-7 w-7 text-white" />
            </motion.div>
          </motion.div>
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600">
              AI-Matched Talent
            </span>
            <motion.span
              className="absolute top-0 right-0 -mt-2 -mr-2"
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="h-5 w-5 text-indigo-500" />
            </motion.span>
          </span>
        </h2>
        
        <motion.p 
          className="mt-3 text-gray-600 text-base max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          These freelancers were specifically selected for your project using advanced AI matching technology, evaluating skills, experience, and project requirements.
        </motion.p>
        
        <div className="flex items-center justify-center mt-4 space-x-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            <Cpu className="h-3 w-3 mr-1" /> Vector Similarity
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <Sparkles className="h-3 w-3 mr-1" /> Semantic Matching
          </span>
        </div>
      </motion.div>

      {/* Cards Container with Perspective Effect - fixed sizing */}
      <div className="relative z-10 perspective-1000">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 relative"
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
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.profile.id}
              className="w-full h-full"
              variants={{
                hidden: { opacity: 0, y: 20, rotateX: 5 },
                show: { 
                  opacity: 1, 
                  y: 0, 
                  rotateX: 0, 
                  transition: { 
                    type: "spring", 
                    stiffness: 100,
                    damping: 15,
                    mass: 1,
                    delay: index * 0.1 
                  } 
                }
              }}
            >
              <TopTalentFreelancerCard
                freelancerProfile={rec.profile}
                similarityScore={rec.similarityScore}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Empty state if no recommendations - made slightly smaller */}
      {recommendations.length === 0 && (
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-xl p-8 text-center shadow-md border border-indigo-100 max-w-xl mx-auto mt-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-indigo-100 mb-3">
            <Cpu className="h-7 w-7 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No matches found yet</h3>
          <p className="text-gray-600 text-sm">
            Our AI is still learning about your project requirements. Check back soon for tailored talent recommendations.
          </p>
        </motion.div>
      )}
      
      {/* Source label - reduced margin */}
      <div className="relative z-10 mt-10 text-center">
        <span className="text-xs font-medium text-gray-500">
          Powered by advanced AI matching algorithms
        </span>
      </div>
    </section>
  );
}