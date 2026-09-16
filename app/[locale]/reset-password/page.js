'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
import { useRouter } from 'next/navigation';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setMessage('Erreur : ' + error.message);
    } else {
      setMessage('Mot de passe mis à jour avec succès !');
      setTimeout(() => router.push('/'), 2000);
    }
  };

  return (
    <form onSubmit={handleUpdatePassword} className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Nouveau mot de passe</h1>
      <input
        type="password"
        placeholder="Saisissez votre nouveau mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2 mb-4 rounded"
        minLength={6}
        required
      />
      <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
        Enregistrer
      </button>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </form>
  );
}
