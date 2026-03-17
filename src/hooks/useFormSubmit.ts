import { useState, useCallback } from 'react';

const FORM_URL = 'https://formsubmit.co/ajax/brewstoryhb@gmail.com';

type FormStatus = 'idle' | 'sending' | 'submitted' | 'error';

export default function useFormSubmit(subject: string) {
  const [status, setStatus] = useState<FormStatus>('idle');

  const handleSubmit = useCallback(
    async (e: React.FormEvent, formData: Record<string, string>) => {
      e.preventDefault();
      setStatus('sending');
      try {
        await fetch(FORM_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            ...formData,
            _subject: subject,
            _template: 'table',
          }),
        });
        setStatus('submitted');
      } catch {
        setStatus('error');
        alert('Something went wrong. Please try again or email us directly.');
      }
    },
    [subject],
  );

  return {
    status,
    sending: status === 'sending',
    submitted: status === 'submitted',
    handleSubmit,
  } as const;
}
