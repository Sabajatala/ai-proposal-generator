// src/pages/ProposalPreview.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProposalById, updateProposalStatus } from '../api/api';
import toast from 'react-hot-toast';

export default function ProposalPreview() {
  const { id } = useParams();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProposal = async () => {
    try {
      const res = await getProposalById(id);
      setProposal(res.data.data);
    } catch (err) {
      // interceptor already shows toast
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposal();
  }, [id]);

  const handleStatusChange = async (newStatus, confirmMessage) => {
    if (!confirm(confirmMessage)) return;

    setActionLoading(true);
    try {
      await updateProposalStatus(id, newStatus);
      toast.success(`Proposal marked as ${newStatus}`);
      await fetchProposal(); // refresh UI
    } catch (err) {
      // interceptor handles error toast
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="card">Loading proposal...</div>;
  if (!proposal) return <div className="card">Proposal not found</div>;

  const {
    title,
    clientName,
    clientEmail,
    clientIndustry,
    aiContent = {},
    status,
    pdfUrl,
    company = {},
    paymentTerms = ''
  } = proposal;

  return (
    <div>
      {/* Header with title, status badge and back link */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '25px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <h2 style={{ margin: 0 }}>{title || `Proposal for ${clientName}`}</h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link
            to="/proposals"
            style={{
              color: '#64748b',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            ← Back to Proposals
          </Link>

          <span style={{
            padding: '8px 18px',
            borderRadius: '999px',
            fontSize: '14px',
            fontWeight: '600',
            backgroundColor:
              status === 'Draft'     ? '#fef3c7' :
              status === 'Sent'      ? '#dbeafe' :
              status === 'Accepted'  ? '#d1fae5' :
              '#fee2e2',
            color:
              status === 'Draft'     ? '#92400e' :
              status === 'Sent'      ? '#1e40af' :
              status === 'Accepted'  ? '#065f46' :
              '#991b1b'
          }}>
            {status}
          </span>
        </div>
      </div>

      {/* Main Card */}
      <div className="card" style={{ padding: '2rem' }}>
        {/* Company & Client Info */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '2rem',
          marginBottom: '2.5rem',
          flexWrap: 'wrap'
        }}>
          {company.logoUrl && (
            <img
              src={company.logoUrl}
              alt={`${company.name} logo`}
              style={{
                maxWidth: '160px',
                height: 'auto',
                objectFit: 'contain',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}
            />
          )}

          <div>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{company.name || 'Your Company'}</h3>
            <p style={{ margin: '0.25rem 0', color: '#475569' }}>
              <strong>Proposal for:</strong> {clientName}
              {clientIndustry && ` (${clientIndustry})`}
            </p>
            {clientEmail && (
              <p style={{ margin: '0.25rem 0', color: '#475569' }}>
                <strong>Email:</strong> {clientEmail}
              </p>
            )}
          </div>
        </div>

        {/* Proposal Content Sections */}
        <div style={{ lineHeight: '1.7', fontSize: '1.05rem' }}>
          {aiContent.introduction && (
            <section style={{ marginBottom: '2rem' }}>
              <h4 style={{ marginBottom: '0.75rem', color: '#1e40af' }}>Introduction</h4>
              <p style={{ whiteSpace: 'pre-wrap' }}>{aiContent.introduction}</p>
            </section>
          )}

          {aiContent.understanding && (
            <section style={{ marginBottom: '2rem' }}>
              <h4 style={{ marginBottom: '0.75rem', color: '#1e40af' }}>Understanding Your Needs</h4>
              <p style={{ whiteSpace: 'pre-wrap' }}>{aiContent.understanding}</p>
            </section>
          )}

          {aiContent.scopeOfWork && (
            <section style={{ marginBottom: '2rem' }}>
              <h4 style={{ marginBottom: '0.75rem', color: '#1e40af' }}>Project Scope</h4>
              <p style={{ whiteSpace: 'pre-wrap' }}>{aiContent.scopeOfWork}</p>
            </section>
          )}

          {aiContent.timeline && (
            <section style={{ marginBottom: '2rem' }}>
              <h4 style={{ marginBottom: '0.75rem', color: '#1e40af' }}>Suggested Timeline</h4>
              <p style={{ fontWeight: '500' }}>{aiContent.timeline}</p>
            </section>
          )}

          {aiContent.pricing && (
            <section style={{ marginBottom: '2rem' }}>
              <h4 style={{ marginBottom: '0.75rem', color: '#1e40af' }}>Pricing</h4>
              <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e40af' }}>
                {aiContent.pricing}
              </p>

              {aiContent.priceBreakdown && Array.isArray(aiContent.priceBreakdown) && (
                <ul style={{
                  listStyle: 'none',
                  marginTop: '1rem',
                  paddingLeft: '0'
                }}>
                  {aiContent.priceBreakdown.map((item, index) => (
                    <li key={index} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '0.5rem 0',
                      borderBottom: '1px solid #e2e8f0'
                    }}>
                      <span>{item.item}</span>
                      <span style={{ fontWeight: '600' }}>{item.amount}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {aiContent.planType && (
            <section style={{ marginBottom: '2rem' }}>
              <h4 style={{ marginBottom: '0.75rem', color: '#1e40af' }}>Plan Type</h4>
              <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>{aiContent.planType}</p>
            </section>
          )}

          {paymentTerms && (
            <section style={{ marginBottom: '2rem' }}>
              <h4 style={{ marginBottom: '0.75rem', color: '#1e40af' }}>Payment Terms</h4>
              <p style={{ whiteSpace: 'pre-wrap' }}>{paymentTerms}</p>
            </section>
          )}

          {aiContent.projectFeasibility && (
  <section style={{ marginBottom: '2rem' }}>
    <h4 style={{ marginBottom: '0.75rem', color: '#1e40af' }}>Project Feasibility</h4>
    <p style={{ whiteSpace: 'pre-wrap', fontStyle: 'italic', color: '#374151' }}>
      {aiContent.projectFeasibility}
    </p>
  </section>
)}

          {aiContent.closing && (
            <section>
              <h4 style={{ marginBottom: '0.75rem', color: '#1e40af' }}>Closing</h4>
              <p style={{ whiteSpace: 'pre-wrap' }}>{aiContent.closing}</p>
            </section>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{
          marginTop: '3rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <button className="btn-primary" disabled>
            Regenerate with AI 
          </button>

          {pdfUrl ? (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ background: '#10b981', textDecoration: 'none' }}
            >
              Download PDF
            </a>
          ) : (
            <button className="btn-primary" disabled>
              Generate PDF 
            </button>
          )}

          {status === 'Draft' && (
            <button
              className="btn-primary"
              style={{ background: '#f59e0b' }}
              onClick={() => handleStatusChange('Sent', 'Mark this proposal as Sent?')}
              disabled={actionLoading}
            >
              {actionLoading ? 'Updating...' : 'Mark as Sent'}
            </button>
          )}

          {status === 'Sent' && (
            <>
              <button
                className="btn-primary"
                style={{ background: '#10b981' }}
                onClick={() => handleStatusChange('Accepted', 'Mark this proposal as Accepted?')}
                disabled={actionLoading}
              >
                {actionLoading ? 'Updating...' : 'Mark as Accepted'}
              </button>

              <button
                className="btn-primary"
                style={{ background: '#ef4444' }}
                onClick={() => handleStatusChange('Rejected', 'Mark this proposal as Rejected?')}
                disabled={actionLoading}
              >
                {actionLoading ? 'Updating...' : 'Mark as Rejected'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}