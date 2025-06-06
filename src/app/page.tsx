"use client";
import Landing3D from '../components/Landing3D';

export default function Home() {
  return (
    <main className="font-sans antialiased">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-800 relative overflow-hidden">
        <Landing3D />
      </div>
    </main>
  );
}
