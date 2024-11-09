// 'use client';

// import { useParams } from 'next/navigation';
// import BreadCrumb from '@/components/global/BreadCrumb';
// import ProjectDetails from '@/app/(with-main-layout)/projects/[id]/ProjectDetails';
// import ProjectApplication from '@/app/(with-main-layout)/projects/[id]/ProjectApplication';
// import ProjectSubmissions from '@/app/(with-main-layout)/projects/[id]/ProjectSubmissions';
// import { useAuthGuard } from '@/api/auth-api';
// import { Role } from '@/constants/models/user/UserResponse';
// // import { useGetProjectInfo } from '@/api/projects-api';

// type Project = {
//   id: number;
//   name: string;
//   description: string;
//   tags: string[];
//   datePosted: string;
//   status: string;
//   applicants: number;
// };

// function ProjectPage() {
//   const { id } = useParams();
//   const { user } = useAuthGuard({ middleware: 'auth' });
//   const role = user?.role;

//   const projectId = Array.isArray(id) ? id[0] : id;
//   // const { data: project } = useGetProjectInfo(parseInt(projectId));

//   // quolance-ui/src/app/(with-main-layout)/projects/[id]/page.tsx:
//   return (
//     <>
//       <BreadCrumb pageName='Project Details' isSearchBoxShow={false} />
//       <section className='container mt-14'>
//         {/* Project Details - Visible to all users */}
//         {project && (
//           <>
//             <ProjectDetails project={project} />
//             <div className=''>
//               <div className=''>
//                 {/* Application Form - Only visible to freelancers */}
//                 {role === Role.FREELANCER && (
//                   <ProjectApplication projectId={project.id} />
//                 )}

//                 {/* Submission List - Only visible to clients */}
//                 {role === Role.CLIENT && (
//                   <ProjectSubmissions projectId={project.id} />
//                 )}
//               </div>
//             </div>
//           </>
//         )}
//       </section>
//     </>
//   );
// }

// export default ProjectPage;
