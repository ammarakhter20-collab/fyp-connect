import React, { useEffect, useState } from 'react';
import { baseUrl } from '../../Components/config/config';

/* ─────────────────────────────────────────────────────────────────────────────
   Tiny reusable progress bar
───────────────────────────────────────────────────────────────────────────── */
const ProgressBar = ({ value, max = 100, color = '#514B96', label, sublabel }) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div style={{ marginBottom: '14px' }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>{label}</span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: color }}>
            {sublabel || `${value} / ${max}`}
          </span>
        </div>
      )}
      <div style={{
        width: '100%', height: '10px', borderRadius: '999px',
        background: '#e5e7eb', overflow: 'hidden'
      }}>
        <div style={{
          width: `${pct}%`, height: '100%', borderRadius: '999px',
          background: `linear-gradient(90deg, ${color}, ${color}dd)`,
          transition: 'width 1s cubic-bezier(.4,0,.2,1)'
        }} />
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Icon helpers
───────────────────────────────────────────────────────────────────────────── */
const IconClock = () => (
  <svg width="56" height="56" fill="none" stroke="#514B96" strokeWidth="1.5" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" strokeLinecap="round" />
  </svg>
);
const IconCheck = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconX = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
  </svg>
);
const IconTrophy = () => (
  <svg width="32" height="32" fill="none" stroke="#ffffff" strokeWidth="1.6" viewBox="0 0 24 24">
    <path d="M8 21h8M12 17v4M7 4H4v3a5 5 0 005 5h6a5 5 0 005-5V4h-3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 4h10v3a5 5 0 01-10 0V4z" strokeLinecap="round" />
  </svg>
);

/* ─────────────────────────────────────────────────────────────────────────────
   Shared card wrapper
───────────────────────────────────────────────────────────────────────────── */
const Card = ({ children, style = {} }) => (
  <div style={{
    background: '#fff', borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(81,75,150,0.09)',
    border: '1px solid #e5e7eb', padding: '28px',
    ...style
  }}>
    {children}
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   LOADING SKELETON
───────────────────────────────────────────────────────────────────────────── */
const LoadingSkeleton = () => {
  const pulse = {
    background: 'linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)',
    backgroundSize: '200% 100%',
    animation: 'skeletonPulse 1.5s infinite',
    borderRadius: '8px'
  };
  return (
    <div>
      <style>{`@keyframes skeletonPulse{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div style={{ ...pulse, height: '28px', width: '240px', marginBottom: '20px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        {[1, 2].map(i => (
          <div key={i} style={{ ...pulse, height: '130px', borderRadius: '12px' }} />
        ))}
      </div>
      <div style={{ ...pulse, height: '200px', borderRadius: '12px' }} />
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   PENDING / LOCKED STATE
───────────────────────────────────────────────────────────────────────────── */
const PendingState = ({ partIStatus, partIIStatus }) => {
  const StatusCard = ({ title, status, partColor }) => {
    const weightOk = status.isWeightageComplete;
    const examsOk  = status.allExamsCompleted;
    const allGood  = weightOk && examsOk;

    return (
      <div style={{
        borderRadius: '14px', border: `2px solid ${allGood ? '#10b981' : '#e5e7eb'}`,
        padding: '20px',
        background: allGood ? '#f0fdf4' : '#fafafa'
      }}>
        {/* Title row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontWeight: 700, fontSize: '15px', color: '#1e1b4b' }}>{title}</span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700,
            background: allGood ? '#dcfce7' : '#fee2e2',
            color: allGood ? '#059669' : '#dc2626'
          }}>
            {allGood ? <><IconCheck /> Complete</> : <><IconX /> Incomplete</>}
          </span>
        </div>

        {/* Weightage bar */}
        <ProgressBar
          value={status.totalWeightage}
          max={100}
          color={weightOk ? '#10b981' : '#f59e0b'}
          label="Weightage"
          sublabel={`${status.totalWeightage} / 100`}
        />

        {/* Exams completed */}
        <ProgressBar
          value={status.completedExams}
          max={Math.max(status.totalExams, 1)}
          color={examsOk ? '#10b981' : '#514B96'}
          label="Exams Completed"
          sublabel={`${status.completedExams} / ${status.totalExams}`}
        />

        {/* Pending exams */}
        {status.pendingExams && status.pendingExams.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '6px' }}>
              Pending Exams:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {status.pendingExams.map((name, i) => (
                <span key={i} style={{
                  background: '#fef3c7', color: '#92400e',
                  fontSize: '11px', fontWeight: 600,
                  padding: '3px 10px', borderRadius: '999px',
                  border: '1px solid #fde68a'
                }}>
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Hero locked message */}
      <div style={{
        textAlign: 'center', padding: '36px 24px',
        background: 'linear-gradient(135deg, #efeffa 0%, #f7f6fe 100%)',
        borderRadius: '16px', border: '2px dashed #b9b6e3', marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <IconClock />
        </div>
        <h2 style={{
          fontSize: '20px', fontWeight: 800, color: '#1e1b4b',
          marginBottom: '10px', margin: '0 0 10px'
        }}>
          ⏳ Overall Result Pending
        </h2>
        <p style={{ color: '#6b7280', fontSize: '14px', maxWidth: '500px', margin: '0 auto' }}>
          Your overall result will appear here once <strong>all examinations</strong> in
          both Part I and Part II have been marked <strong>Completed</strong> and each
          part has <strong>100% weightage</strong> assigned.
        </p>
      </div>

      {/* Status cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <StatusCard title="Part I Status" status={partIStatus}  partColor="#514B96" />
        <StatusCard title="Part II Status" status={partIIStatus} partColor="#7068C6" />
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   READY / FULL RESULT STATE
───────────────────────────────────────────────────────────────────────────── */
const ReadyResult = ({ data }) => {
  const { student, termName, partI, partII, overallPercentage, passFail, passingCriteria } = data;
  const isPassing = passFail === 'PASS';

  const scoreCardStyle = (color) => ({
    background: `linear-gradient(135deg, ${color}18 0%, ${color}08 100%)`,
    borderRadius: '14px',
    border: `1.5px solid ${color}33`,
    padding: '20px 16px',
    textAlign: 'center',
    flex: 1
  });

  const ExamRow = ({ exam, bg }) => (
    <tr style={{ background: bg }}>
      <td style={tdStyle}>{exam.name}</td>
      <td style={{ ...tdStyle, textAlign: 'center', color: '#514B96', fontWeight: 700 }}>
        {exam.weightage}%
      </td>
      <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 700, color: '#111827' }}>
        {exam.marks.toFixed(2)}
      </td>
      <td style={{ ...tdStyle, textAlign: 'center' }}>
        <div style={{
          width: '80px', height: '8px', borderRadius: '999px',
          background: '#e5e7eb', overflow: 'hidden', margin: '0 auto'
        }}>
          <div style={{
            width: `${Math.min(100, (exam.marks / exam.weightage) * 100)}%`,
            height: '100%', borderRadius: '999px',
            background: 'linear-gradient(90deg, #514B96, #7068C6)',
            transition: 'width 1s ease'
          }} />
        </div>
      </td>
    </tr>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* ── Header banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #514B96 0%, #766fd1 100%)',
        borderRadius: '16px', padding: '24px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '14px',
            background: 'rgba(255,255,255,0.18)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <IconTrophy />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.75)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Overall FYP Result — Term {termName}
            </p>
            <h2 style={{ margin: '4px 0 2px', fontSize: '20px', fontWeight: 800, color: '#fff' }}>
              {student.name}
            </h2>
            <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
              {student.registrationNumber}
            </p>
          </div>
        </div>

        {/* PASS / FAIL badge */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          background: isPassing ? 'rgba(16,185,129,0.18)' : 'rgba(239,68,68,0.18)',
          border: `2px solid ${isPassing ? '#10b981' : '#ef4444'}`,
          borderRadius: '14px', padding: '14px 28px', minWidth: '110px'
        }}>
          <span style={{ fontSize: '28px', lineHeight: 1 }}>{isPassing ? '✅' : '❌'}</span>
          <span style={{
            marginTop: '6px', fontSize: '18px', fontWeight: 900,
            color: isPassing ? '#10b981' : '#ef4444', letterSpacing: '1px'
          }}>
            {passFail}
          </span>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', marginTop: '2px' }}>
            Passing: {passingCriteria}%
          </span>
        </div>
      </div>

      {/* ── Score cards row ── */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {[
          { label: 'Part I Score', value: partI.total,  color: '#514B96' },
          { label: 'Part II Score', value: partII.total, color: '#7068C6' },
          { label: 'Overall Score', value: overallPercentage, color: '#F47458', isFinal: true }
        ].map(({ label, value, color, isFinal }) => (
          <div key={label} style={scoreCardStyle(color)}>
            <p style={{ margin: '0 0 6px', fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {label}
            </p>
            <p style={{
              margin: '0 0 8px', fontSize: isFinal ? '34px' : '28px',
              fontWeight: 900, color: color, lineHeight: 1
            }}>
              {value.toFixed(2)}
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#9ca3af' }}> / 100</span>
            </p>
            <div style={{ height: '8px', borderRadius: '999px', background: '#e5e7eb', overflow: 'hidden' }}>
              <div style={{
                width: `${Math.min(100, value)}%`, height: '100%',
                borderRadius: '999px',
                background: `linear-gradient(90deg, ${color}, ${color}dd)`,
                transition: 'width 1.2s cubic-bezier(.4,0,.2,1)'
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Exam breakdown ── */}
      <Card>
        <h3 style={{ margin: '0 0 18px', fontSize: '16px', fontWeight: 700, color: '#1e1b4b' }}>
          📊 Exam Breakdown
        </h3>

        {/* Part I */}
        {partI.exams.length > 0 && (
          <>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '10px'
            }}>
              <span style={{
                fontSize: '12px', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.7px', color: '#514B96',
                background: '#efeffa', padding: '3px 12px', borderRadius: '999px'
              }}>
                Part I
              </span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#514B96' }}>
                Total: {partI.total.toFixed(2)} / 100
              </span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
              <thead>
                <tr style={{ background: '#f4f4fc' }}>
                  {['Exam', 'Weightage', 'Marks Obtained', 'Score'].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {partI.exams.map((exam, i) => (
                  <ExamRow key={exam.name} exam={exam} bg={i % 2 === 0 ? '#fff' : '#fafafa'} />
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* Part II */}
        {partII.exams.length > 0 && (
          <>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '10px'
            }}>
              <span style={{
                fontSize: '12px', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.7px', color: '#7068C6',
                background: '#f1f0fd', padding: '3px 12px', borderRadius: '999px'
              }}>
                Part II
              </span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#7068C6' }}>
                Total: {partII.total.toFixed(2)} / 100
              </span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f7f6fe' }}>
                  {['Exam', 'Weightage', 'Marks Obtained', 'Score'].map(h => (
                    <th key={h} style={{ ...thStyle, color: '#7068C6' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {partII.exams.map((exam, i) => (
                  <ExamRow key={exam.name} exam={exam} bg={i % 2 === 0 ? '#fff' : '#fafafa'} />
                ))}
              </tbody>
            </table>
          </>
        )}
      </Card>
    </div>
  );
};

/* shared table styles */
const thStyle = {
  padding: '10px 14px', textAlign: 'left', fontSize: '12px',
  fontWeight: 700, color: '#514B96', textTransform: 'uppercase',
  letterSpacing: '0.5px', borderBottom: '2px solid #e5e7eb'
};
const tdStyle = {
  padding: '11px 14px', fontSize: '14px', color: '#374151',
  borderBottom: '1px solid #f3f4f6'
};

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
const StdOverAllReport = () => {
  const [state, setState] = useState('loading'); // 'loading' | 'pending' | 'ready' | 'error'
  const [reportData, setReportData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchReport = async () => {
    try {
      setState('loading');
      const key  = JSON.parse(localStorage.getItem('key'));
      const user = JSON.parse(localStorage.getItem('user') || localStorage.getItem('studentData'));

      if (!user || !user._id) {
        setErrorMsg('User session data is missing. Please log out and log in again.');
        setState('error');
        return;
      }

      const termId = (user.term && typeof user.term === 'object') ? user.term._id : user.term;
      const studentId = user._id;

      if (!termId) {
        setErrorMsg('Academic term is not assigned to your student profile.');
        setState('error');
        return;
      }

      const response = await fetch(
        `${baseUrl}/api/EvaluateExamRoutes/student-overall-report/${termId}/${studentId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error || 'Failed to load report.');
        setState('error');
        return;
      }

      if (data.ready === false) {
        setReportData(data);
        setState('pending');
      } else if (data.ready === true) {
        setReportData(data);
        setState('ready');
      } else {
        setErrorMsg('Unexpected response from server.');
        setState('error');
      }

    } catch (err) {
      console.error('Error fetching overall report:', err);
      setErrorMsg('Network error. Please try again.');
      setState('error');
    }
  };

  /* ── Render ── */
  return (
    <div style={{
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      padding: '4px 4px 24px'
    }}>
      {state === 'loading' && <LoadingSkeleton />}

      {state === 'error' && (
        <div style={{
          textAlign: 'center', padding: '40px 24px',
          background: '#fff5f5', borderRadius: '14px',
          border: '2px dashed #fca5a5', color: '#b91c1c'
        }}>
          <p style={{ fontSize: '32px', margin: '0 0 12px' }}>⚠️</p>
          <p style={{ fontWeight: 700, fontSize: '16px', margin: '0 0 8px' }}>Could not load report</p>
          <p style={{ fontSize: '14px', margin: 0, color: '#dc2626' }}>{errorMsg}</p>
          <button
            onClick={fetchReport}
            style={{
              marginTop: '16px', padding: '8px 22px', borderRadius: '8px',
              background: '#4f46e5', color: '#fff', border: 'none',
              fontWeight: 600, cursor: 'pointer', fontSize: '14px'
            }}
          >
            Retry
          </button>
        </div>
      )}

      {state === 'pending' && reportData && (
        <PendingState
          partIStatus={reportData.partIStatus}
          partIIStatus={reportData.partIIStatus}
        />
      )}

      {state === 'ready' && reportData && (
        <ReadyResult data={reportData} />
      )}
    </div>
  );
};

export default StdOverAllReport;
