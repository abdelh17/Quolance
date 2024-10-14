//all routes under this folder WILL contain header and footer

function layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <h1> header </h1>
      {children}
      <h1> footer </h1>
    </main>
  );
}

export default layout;
