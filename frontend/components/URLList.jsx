import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import Swal from 'sweetalert2';
import { Trash2, ExternalLink } from 'lucide-react';

const URLList = forwardRef((props, ref) => {
  const [urls, setUrls] = useState([]);

  const fetchUrls = async () => {
    try {
      const res = await fetch('http://localhost:5000/urls');
      const data = await res.json();
      setUrls(data.urls);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useImperativeHandle(ref, () => ({
    refresh: fetchUrls,
  }));

  const handleDelete = async (code) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the shortened URL permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:5000/urls/${code}`, {
          method: 'DELETE',
        });
        const data = await res.json();

        if (res.ok) {
          setUrls((prev) =>
            prev.filter((url) => url.shortCode !== code)
          );
          Swal.fire('Deleted!', data.message, 'success');
        } else {
          Swal.fire('Error', data.error || 'Failed to delete URL', 'error');
        }
      } catch (err) {
        Swal.fire('Error', 'Server error', 'error');
      }
    }
  };

  useEffect(() => {
    fetchUrls();
    const interval = setInterval(fetchUrls, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        Your Shortened URLs
      </h2>

      {urls.length === 0 ? (
        <p className="text-gray-500">No URLs found.</p>
      ) : (
        <ul className="space-y-4">
          {urls.map((url, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-white p-4 rounded-xl shadow-md border"
            >
              <div>
                <a
                  href={url.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-medium text-lg flex items-center gap-1 cursor-pointer"
                >
                  {url.shortUrl}
                  <ExternalLink size={16} />
                </a>
                <p className="text-sm text-gray-500 mt-1 truncate max-w-md">
                  ↪ {url.originalUrl}
                </p>
              </div>

              <button
                onClick={() => handleDelete(url.shortCode)}
                className="flex items-center gap-1 cursor-pointer bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm shadow-sm"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default URLList;
