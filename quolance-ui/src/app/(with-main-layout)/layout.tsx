//all routes under this folder WILL contain header and footer
import Header from '@/components/global/Header';

function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}

export default layout;
