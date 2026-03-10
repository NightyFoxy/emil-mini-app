import type { PropsWithChildren, ReactNode } from 'react';
import clsx from 'clsx';

export function Screen({ title, subtitle, children }: PropsWithChildren<{ title: string; subtitle?: string }>) {
  return (
    <section className="space-y-5">
      <header className="space-y-1 px-1">
        <h1 className="text-[1.55rem] font-semibold tracking-[-0.03em] text-[var(--tg-text-color)]">{title}</h1>
        {subtitle ? <p className="text-sm text-[var(--tg-hint-color)]">{subtitle}</p> : null}
      </header>
      {children}
    </section>
  );
}

export function Card({
  children,
  className,
}: PropsWithChildren<{
  className?: string;
}>) {
  return (
    <div
      className={clsx(
        'rounded-[24px] border border-black/5 bg-[color:var(--card-bg)] p-4 shadow-[0_6px_20px_rgba(15,23,42,0.08)]',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-sm font-semibold text-[var(--tg-hint-color)]">{title}</h2>
      {action}
    </div>
  );
}

export function Chip({
  selected = false,
  onClick,
  children,
}: PropsWithChildren<{ selected?: boolean; onClick?: () => void }>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'rounded-full border px-3 py-2 text-sm transition active:scale-[0.98]',
        selected
          ? 'border-[var(--tg-button-color)] bg-[var(--tg-button-color)] text-[var(--tg-button-text-color)]'
          : 'border-white/10 bg-white/4 text-[var(--tg-text-color)]',
      )}
    >
      {children}
    </button>
  );
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (next: T) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2 rounded-[20px] bg-black/10 p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={clsx(
            'rounded-2xl px-3 py-2 text-sm transition',
            value === option.value
              ? 'bg-[var(--tg-button-color)] text-[var(--tg-button-text-color)]'
              : 'text-[var(--tg-hint-color)]',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-start justify-between gap-4 rounded-[20px] border border-white/8 bg-black/8 px-4 py-3 text-left"
    >
      <div>
        <div className="text-sm font-medium text-[var(--tg-text-color)]">{label}</div>
        {description ? <div className="mt-1 text-xs text-[var(--tg-hint-color)]">{description}</div> : null}
      </div>
      <div
        className={clsx(
          'relative mt-0.5 h-7 w-12 rounded-full transition',
          checked ? 'bg-[var(--tg-button-color)]' : 'bg-white/10',
        )}
      >
        <span
          className={clsx(
            'absolute top-1 h-5 w-5 rounded-full bg-[var(--tg-button-text-color)] transition',
            checked ? 'left-6' : 'left-1 bg-white',
          )}
        />
      </div>
    </button>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  multiline = false,
  maxLength,
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder: string;
  multiline?: boolean;
  maxLength?: number;
}) {
  const className =
    'w-full rounded-[20px] border border-white/8 bg-black/8 px-4 py-3 text-sm text-[var(--tg-text-color)] outline-none placeholder:text-[var(--tg-hint-color)] focus:border-white/20';

  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={4}
        className={clsx(className, 'resize-none')}
      />
    );
  }

  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className={className}
    />
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  className,
}: PropsWithChildren<{ onClick?: () => void; disabled?: boolean; className?: string }>) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'w-full rounded-[20px] bg-[var(--tg-button-color)] px-4 py-3 text-sm font-semibold text-[var(--tg-button-text-color)] transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40',
        className,
      )}
    >
      {children}
    </button>
  );
}
