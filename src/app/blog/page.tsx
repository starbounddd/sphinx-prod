export default function BlogPage() {
    return (
      <main className="bg-secondary py-16 px-6 max-w-3xl mx-auto">
        <h1 className="font-handwritten text-[75px]">Blog</h1>
        <p className="mb-4">
        Thoughts on structured mental health intake, AI safety, and care infrastructure.
        </p>

        <hr className="border-teal " />
  
        <h2 className="text-xl font-semibold mt-8 mb-2">Title...</h2>
        <p className="text-sm text-muted-foreground"> mm/dd/yyyy - N minutes read</p>
        <p>
          text...
        </p>
  
        <hr className="border-teal " />
  
        <h2 className="text-xl font-semibold mt-8 mb-2">Title...</h2>
        <p className="text-sm text-muted-foreground"> mm/dd/yyyy - N minutes read</p>
        <p>
          text...
        </p>
      </main>
    );
  }