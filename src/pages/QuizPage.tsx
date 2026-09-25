import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Compass } from 'lucide-react';
import Button from '@/components/Button';
import { type SwordCategory, CATEGORY_LABELS } from '@/lib/supabase';

interface Question {
  id: string;
  question: string;
  description: string;
  options: {
    label: string;
    description: string;
    category: SwordCategory;
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'grip',
    question: 'How do you hold a sword?',
    description: 'Your preferred grip tells us about the balance and reach you value.',
    options: [
      { label: 'One hand', description: 'I prefer the speed and reach of a single-handed grip.', category: 'rapier' },
      { label: 'One or two', description: 'I like the flexibility of switching between one and two hands.', category: 'bastard_sword' },
      { label: 'Both hands', description: 'I want the power and control of a full two-handed grip.', category: 'greatsword' },
    ],
  },
  {
    id: 'style',
    question: 'What is your fighting style?',
    description: 'The art of the blade divides between the point and the edge.',
    options: [
      { label: 'The thrust', description: 'Precision, speed, and the elegance of the point.', category: 'smallsword' },
      { label: 'Cut and thrust', description: 'I want the versatility of both edge and point.', category: 'rapier' },
      { label: 'The broad stroke', description: 'Powerful cuts with weight behind every swing.', category: 'longsword' },
    ],
  },
  {
    id: 'era',
    question: 'Which era calls to you?',
    description: 'Each century produced swords of distinct character.',
    options: [
      { label: 'The Renaissance', description: '16th century — the age of the duelist and the Landsknecht.', category: 'longsword' },
      { label: 'The Baroque', description: '17th century — the golden age of the rapier and the great sword.', category: 'rapier' },
      { label: 'The Age of Enlightenment', description: '18th century — refinement, the smallsword, and the court.', category: 'smallsword' },
    ],
  },
  {
    id: 'weight',
    question: 'Light and agile, or heavy and powerful?',
    description: 'Your preference for weight shapes the family of blade we recommend.',
    options: [
      { label: 'Light and fast', description: 'Featherweight — under 1kg. Speed is everything.', category: 'smallsword' },
      { label: 'Balanced', description: 'A moderate weight — 1 to 2kg. Versatility matters.', category: 'bastard_sword' },
      { label: 'Heavy and strong', description: 'Over 2kg — I want the weight to do the work.', category: 'greatsword' },
    ],
  },
];

export default function QuizPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<SwordCategory[]>([]);

  const handleAnswer = (category: SwordCategory) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = category;
    setAnswers(newAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } else {
      // Calculate result
      const counts: Record<string, number> = {};
      newAnswers.forEach((cat) => {
        counts[cat] = (counts[cat] ?? 0) + 1;
      });
      const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as SwordCategory;
      setTimeout(() => navigate(`/quiz/result?category=${winner}`), 300);
    }
  };

  const question = QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-forge-black pt-20 md:pt-24 flex items-center justify-center px-6 lg:px-8">
      <div className="w-full max-w-2xl py-12">
        {/* Progress bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-sans tracking-widest uppercase text-forge-gold/70">
              Question {currentStep + 1} of {QUESTIONS.length}
            </p>
            <p className="text-xs text-gray-600">{Math.round(progress)}%</p>
          </div>
          <div className="h-px bg-forge-ash/30 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-forge-gold transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div key={currentStep} className="animate-fade-in-up">
          <div className="text-center mb-10">
            <Compass className="text-forge-gold/40 mx-auto mb-6" size={48} strokeWidth={1} />
            <h1 className="text-3xl md:text-4xl font-serif text-gray-100 mb-4 text-balance">
              {question.question}
            </h1>
            <p className="text-gray-500 text-balance">{question.description}</p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option.label}
                onClick={() => handleAnswer(option.category)}
                className="card-surface w-full p-5 text-left group hover:border-forge-gold/40 hover:bg-forge-graphite/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-forge-gold/30"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-serif text-gray-100 group-hover:text-forge-gold transition-colors duration-300 mb-1">
                      {option.label}
                    </h3>
                    <p className="text-sm text-gray-500">{option.description}</p>
                  </div>
                  <ArrowRight
                    size={20}
                    className="text-gray-600 group-hover:text-forge-gold group-hover:translate-x-1 transition-all duration-300 flex-shrink-0"
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Back button */}
          {currentStep > 0 && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-forge-gold transition-colors duration-200"
              >
                <ArrowLeft size={16} /> Previous question
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
