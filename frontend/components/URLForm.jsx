import React, { useState } from 'react';
import Swal from 'sweetalert2';

const URLForm = ({ onShorten }) => {
  const [input, setInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !/^https?:\/\//.test(input.trim())) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid URL',
        text: 'Please enter a valid URL starting with http:// or https://',
      });
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl: input }),
      });

      const data = await res.json();
      if (data.shortUrl) {
        onShorten(data.shortUrl);
        Swal.fire({
          icon: 'success',
          title: 'URL Shortened!',
          text: 'Short URL created successfully.',
          timer: 1500,
          showConfirmButton: false,
        });
        setInput('');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.error || 'Something went wrong.',
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'Could not connect to backend.',
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-2xl mx-auto flex flex-col gap-5 transition-all"
    >
      <h2 className="text-2xl font-bold text-gray-800">🔗 URL Shortener</h2>
      <input
        type="text"
        placeholder="Paste your long URL here"
        className="p-3 border-2 border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 "
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        type="submit"
        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-5 rounded-lg hover:shadow-lg cursor-pointer"
      >
        Generate Short URL
      </button>
    </form>
  );
};

export default URLForm;
