import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../api/apiClient';

export default function EventRegister() {
  const { id } = useParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Registering...');

  useEffect(() => {
    async function run() {
      try {
        const res = await apiClient.post(`/events/${id}/register`, {});
        if (res && res.id) {
          setStatus('success');
          setMessage('Registered successfully.');
        } else {
          setStatus('error');
          setMessage(res.message || 'Registration failed.');
        }
      } catch (e) {
        setStatus('error');
        setMessage(e.message || 'Registration failed.');
      }
    }
    run();
  }, [id]);

  return (
    <div>
      <h1>Event Registration</h1>
      <p style={{ color: status === 'error' ? 'red' : 'inherit' }}>{message}</p>
    </div>
  );
}
