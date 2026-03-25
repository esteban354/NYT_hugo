import type { Period } from '../types/nyt';
import './PeriodSelector.css';

interface PeriodSelectorProps {
  currentPeriod: Period;
  onChangePeriod: (period: Period) => void;
}

export default function PeriodSelector({
  currentPeriod,
  onChangePeriod,
}: PeriodSelectorProps) {
  return (
    <>
      <label htmlFor="period-select" className="period-label">
        Mostrar popularidad del periodo:
      </label>
      <select
        id="period-select"
        value={currentPeriod}
        onChange={(e) => onChangePeriod(parseInt(e.target.value) as Period)}
      >
        <option value={1}>Último día (1 día)</option>
        <option value={7}>Última semana (7 días)</option>
        <option value={30}>Último mes (30 días)</option>
      </select>
    </>
  );
}
