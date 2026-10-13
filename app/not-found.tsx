import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#03060D] text-[#E8F4FF] flex flex-col items-center justify-center p-4 font-mono">
      <h1 className="text-3xl font-bold text-[#7DF9FF] mb-2">[ SYSTEM ERROR ]</h1>
      <p className="text-[#7FA6C9] mb-4">404: Dimensional Rift Not Found</p>
      <Link
        href="/"
        className="px-4 py-2 border border-[#2F8CFF] bg-[#2F8CFF]/20 text-[#7DF9FF] text-sm rounded hover:bg-[#2F8CFF]/40"
      >
        RETURN TO SYSTEM
      </Link>
    </div>
  );
}
