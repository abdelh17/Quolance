//all routes under this folder WILL contain header and footer
import Header from "@/components/global/Header";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
        <Header />
      {children}
    </main>
  );
}

export default layout;
