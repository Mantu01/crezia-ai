import { Wand2 } from 'lucide-react';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href='/' className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
        <Wand2 className="w-5 h-5 text-black" />
      </div>
      <span className="text-2xl font-bold">Crezia</span>
    </Link>
  );
}