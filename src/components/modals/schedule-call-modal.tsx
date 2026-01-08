import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface LovedOne {
  id: string;
  name: string;
  phone: string | null;
}

interface Question {
  id: string;
  question_text: string;
  category: string;
}

interface ScheduleDate {
  id: string;
  date: string;
  time: string;
  duration: number;
}

interface ScheduleCallModalProps {
  isOpen: boolean;
  lovedOne: LovedOne;
  userId: string;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const ScheduleCallModal: React.FC<ScheduleCallModalProps> = ({
  isOpen,
  lovedOne,
  userId,
  onClose,
  onSuccess,
  onError,
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [scheduleDates, setScheduleDates] = useState<ScheduleDate[]>([
    { id: '1', date: '', time: '', duration: 30 },
  ]);
  const [notes, setNotes] = useState('');
  const [applyToAll, setApplyToAll] = useState({ time: false, duration: false });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    if (isOpen) {
      fetchQuestions();
    }
  }, [isOpen]);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      setQuestions(data || []);
    } catch (error: any) {
      onError('Failed to load questions');
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.question_text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || q.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(questions.map((q) => q.category)))];

  const toggleQuestion = (questionId: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const addScheduleDate = () => {
     // Can customize this to any limit I want
    if (scheduleDates.length >= 10) {
      onError('Maximum 10 dates allowed');
      return;
    }
    setScheduleDates([
      ...scheduleDates,
      { id: Date.now().toString(), date: '', time: '', duration: 30 },
    ]);
  };

  const removeScheduleDate = (id: string) => {
    if (scheduleDates.length === 1) {
      onError('At least one date is required');
      return;
    }
    setScheduleDates(scheduleDates.filter((d) => d.id !== id));
  };

  const updateScheduleDate = (id: string, field: keyof ScheduleDate, value: string | number) => {
    setScheduleDates(
      scheduleDates.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );

    if (applyToAll.time && field === 'time') {
      setScheduleDates(scheduleDates.map((d) => ({ ...d, time: value as string })));
    }
    if (applyToAll.duration && field === 'duration') {
      setScheduleDates(scheduleDates.map((d) => ({ ...d, duration: value as number })));
    }
  };

  const validateStep1 = () => {
    if (selectedQuestions.length === 0) {
      onError('Please select at least one question');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    for (const schedule of scheduleDates) {
      if (!schedule.date || !schedule.time) {
        onError('Please fill in all date and time fields');
        return false;
      }
    }
    return true;
  };

  const handleSchedule = async () => {
    if (!validateStep2()) return;
    setLoading(true);

    try {
      for (const schedule of scheduleDates) {
        const scheduledDateTime = `${schedule.date}T${schedule.time}:00`;

        const { data: callData, error: callError } = await supabase
          .from('scheduled_calls')
          .insert({
            user_id: userId,
            loved_one_id: lovedOne.id,
            scheduled_date: scheduledDateTime,
            scheduled_time: schedule.time,
            duration_minutes: schedule.duration,
            notes: notes || null,
            status: 'scheduled',
          })
          .select()
          .single();

        if (callError) throw callError;

        const questionInserts = selectedQuestions.map((questionId, index) => ({
          call_id: callData.id,
          question_id: questionId,
          question_order: index + 1,
        }));

        const { error: questionsError } = await supabase
          .from('call_questions')
          .insert(questionInserts);

        if (questionsError) throw questionsError;
      }

      onSuccess(`${scheduleDates.length} call(s) scheduled with ${lovedOne.name}!`);
      onClose();
      resetModal();
    } catch (error: any) {
      onError(error.message || 'Failed to schedule calls');
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setStep(1);
    setSelectedQuestions([]);
    setScheduleDates([{ id: '1', date: '', time: '', duration: 30 }]);
    setNotes('');
    setSearchQuery('');
    setFilterCategory('all');
    setApplyToAll({ time: false, duration: false });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1a2332]/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-[#1a2332]/10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#1a2332]/40 hover:text-[#1a2332] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h3 className="text-2xl font-serif text-[#1a2332]">
            Schedule Call with {lovedOne.name}
          </h3>
          <p className="text-[#1a2332]/60 text-sm mt-1">
            {step === 1 ? 'Select questions to ask' : 'Choose dates and times'}
          </p>

          <div className="flex items-center gap-2 mt-4">
            <StepIndicator active={step === 1} completed={step > 1} number={1} />
            <div className="flex-1 h-px bg-[#1a2332]/10" />
            <StepIndicator active={step === 2} completed={false} number={2} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 border border-[#1a2332]/20 rounded-lg focus:outline-none focus:border-[#d4af37]"
                />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 border border-[#1a2332]/20 rounded-lg focus:outline-none focus:border-[#d4af37] bg-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-[#d4af37]/10 p-4 rounded-lg">
                <p className="text-sm text-[#1a2332]/70">
                  <strong>{selectedQuestions.length}</strong> question(s) selected
                </p>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredQuestions.map((question) => (
                  <label
                    key={question.id}
                    className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedQuestions.includes(question.id)
                        ? 'border-[#d4af37] bg-[#d4af37]/5'
                        : 'border-[#1a2332]/10 hover:border-[#d4af37]/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedQuestions.includes(question.id)}
                      onChange={() => toggleQuestion(question.id)}
                      className="mt-1 w-4 h-4 text-[#d4af37] rounded focus:ring-[#d4af37]"
                    />
                    <div className="flex-1">
                      <p className="text-[#1a2332] font-medium">{question.question_text}</p>
                      <span className="text-xs text-[#1a2332]/50 capitalize">{question.category}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-[#d4af37]/10 p-4 rounded-lg">
                <p className="text-sm text-[#1a2332]/70">
                  You've selected <strong>{selectedQuestions.length}</strong> question(s). Now schedule up to 10 dates.
                </p>
              </div>

              <div className="flex gap-4 mb-4">
                <label className="flex items-center gap-2 text-sm text-[#1a2332]">
                  <input
                    type="checkbox"
                    checked={applyToAll.time}
                    onChange={(e) => setApplyToAll({ ...applyToAll, time: e.target.checked })}
                    className="w-4 h-4 text-[#d4af37] rounded"
                  />
                  Apply same time to all
                </label>
                <label className="flex items-center gap-2 text-sm text-[#1a2332]">
                  <input
                    type="checkbox"
                    checked={applyToAll.duration}
                    onChange={(e) => setApplyToAll({ ...applyToAll, duration: e.target.checked })}
                    className="w-4 h-4 text-[#d4af37] rounded"
                  />
                  Apply same duration to all
                </label>
              </div>

              <div className="space-y-3">
                {scheduleDates.map((schedule, index) => (
                  <div key={schedule.id} className="flex gap-3 items-start p-4 bg-gray-50 rounded-lg">
                    <span className="font-semibold text-[#d4af37] mt-2">{index + 1}</span>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="date"
                        value={schedule.date}
                        onChange={(e) => updateScheduleDate(schedule.id, 'date', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="px-3 py-2 border border-[#1a2332]/20 rounded-lg focus:outline-none focus:border-[#d4af37]"
                      />
                      <input
                        type="time"
                        value={schedule.time}
                        onChange={(e) => updateScheduleDate(schedule.id, 'time', e.target.value)}
                        className="px-3 py-2 border border-[#1a2332]/20 rounded-lg focus:outline-none focus:border-[#d4af37]"
                      />
                      <select
                        value={schedule.duration}
                        onChange={(e) => updateScheduleDate(schedule.id, 'duration', parseInt(e.target.value))}
                        className="px-3 py-2 border border-[#1a2332]/20 rounded-lg focus:outline-none focus:border-[#d4af37] bg-white"
                      >
                        <option value={20}>20 mins</option>
                        <option value={30}>30 mins</option>
                        <option value={60}>1 hour</option>
                      </select>
                    </div>
                    {scheduleDates.length > 1 && (
                      <button
                        onClick={() => removeScheduleDate(schedule.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {scheduleDates.length < 10 && (
                <button
                  onClick={addScheduleDate}
                  className="w-full py-3 border-2 border-dashed border-[#1a2332]/20 rounded-lg text-[#1a2332]/60 hover:border-[#d4af37] hover:text-[#d4af37] transition-colors"
                >
                  + Add Another Date
                </button>
              )}

              <div>
                <label className="block text-sm font-medium text-[#1a2332] mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Any special instructions or notes for the call..."
                  className="w-full px-4 py-3 border border-[#1a2332]/20 rounded-lg focus:outline-none focus:border-[#d4af37] resize-none"
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-[#1a2332]/10 flex gap-3">
          {step === 1 ? (
            <>
              <button
                onClick={onClose}
                className="flex-1 py-3 border border-[#1a2332]/20 rounded-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (validateStep1()) setStep(2);
                }}
                className="flex-1 py-3 bg-[#d4af37] text-[#1a2332] font-semibold rounded-sm hover:bg-[#e5c55a] transition-colors"
              >
                Next: Choose Dates
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 border border-[#1a2332]/20 rounded-sm hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSchedule}
                disabled={loading}
                className="flex-1 py-3 bg-[#d4af37] text-[#1a2332] font-semibold rounded-sm hover:bg-[#e5c55a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Spinner />
                    <span className="ml-2">Scheduling...</span>
                  </>
                ) : (
                  `Schedule ${scheduleDates.length} Call(s)`
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const StepIndicator: React.FC<{ active: boolean; completed: boolean; number: number }> = ({
  active,
  completed,
  number,
}) => (
  <div
    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
      completed
        ? 'bg-[#d4af37] text-white'
        : active
        ? 'bg-[#d4af37] text-white'
        : 'bg-[#1a2332]/10 text-[#1a2332]/40'
    }`}
  >
    {completed ? '✓' : number}
  </div>
);

const Spinner: React.FC = () => (
  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export default ScheduleCallModal;