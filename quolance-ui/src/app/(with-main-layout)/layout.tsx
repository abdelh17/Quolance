//all routes under this folder WILL contain header and footer

function layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      {children}
    </main>
  );
}

export default layout;
