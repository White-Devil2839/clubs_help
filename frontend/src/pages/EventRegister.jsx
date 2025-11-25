import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../api/apiClient';
import PageHeader from '../components/PageHeader';

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
    <section className="page-card">
      <PageHeader
        eyebrow="Events"
        title="Event registration"
        description="We’re processing your RSVP and will update you shortly."
      />
      <p className={
        status === 'error' 
          ? 'alert alert-error' 
          : status === 'success' 
          ? 'alert alert-success' 
          : 'alert'
      }>{message}</p>
      <Link to="/events" className="btn btn-outline">
        Back to events
      </Link>
    </section>
  );
}
