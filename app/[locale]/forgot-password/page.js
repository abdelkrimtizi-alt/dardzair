'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/fr/reset-password`,
    });

    if (error) {
      setMessage('Erreur : ' + error.message);
    } else {
      setMessage('Un e-mail de réinitialisation vous a été envoyé !');
    }
  };

  return (
    <form onSubmit={handleReset} className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Mot de passe oublié</h1>
      <input
        type="email"
        placeholder="Votre e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2 mb-4 rounded"
        required
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        Envoyer le lien
      </button>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </form>
  );
}
