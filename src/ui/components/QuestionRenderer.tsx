import type { AnswerValue, Question } from '@/core/models';
import { SingleSelectQuestion, isSingleSelectValid } from './questions/SingleSelectQuestion';
import { MultiSelectQuestion, isMultiSelectValid } from './questions/MultiSelectQuestion';
import { FreeTextQuestion, isFreeTextValid } from './questions/FreeTextQuestion';
import { SliderQuestion, isSliderValid } from './questions/SliderQuestion';
import { TopXQuestion, isTopXValid } from './questions/TopXQuestion';

type Props = {
  question: Question;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
};

export function QuestionRenderer({ question, value, onChange }: Props) {
  switch (question.type) {
    case 'single-select':
      return <SingleSelectQuestion question={question} value={value} onChange={onChange} />;
    case 'multi-select':
      return <MultiSelectQuestion question={question} value={value} onChange={onChange} />;
    case 'free-text':
      return <FreeTextQuestion question={question} value={value} onChange={onChange} />;
    case 'slider':
      return <SliderQuestion question={question} value={value} onChange={onChange} />;
    case 'top-x':
      return <TopXQuestion question={question} value={value} onChange={onChange} />;
  }
}

export function isAnswerValid(question: Question, value: AnswerValue | undefined): boolean {
  switch (question.type) {
    case 'single-select':
      return isSingleSelectValid(value);
    case 'multi-select':
      return isMultiSelectValid(question, value);
    case 'free-text':
      return isFreeTextValid(question, value);
    case 'slider':
      return isSliderValid(value);
    case 'top-x':
      return isTopXValid(question, value);
  }
}
