import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'

type BaseProps = {
  label: string
  name: string
  error?: string
  hint?: string
}

type InputFieldProps = BaseProps &
  InputHTMLAttributes<HTMLInputElement> & {
    as?: 'input'
  }

type TextareaFieldProps = BaseProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    as: 'textarea'
  }

type SelectFieldProps = BaseProps & {
  as: 'select'
  children: ReactNode
  selectProps?: React.SelectHTMLAttributes<HTMLSelectElement>
}

export function FormField(props: InputFieldProps | TextareaFieldProps | SelectFieldProps) {
  const errorId = props.error ? `${props.name}-error` : undefined

  if (props.as === 'textarea') {
    const { label, name, error, hint, as: _ignoredTextarea, className, ...rest } = props
    void _ignoredTextarea
    return (
      <label className="block space-y-1.5 text-sm">
        <span className="font-medium text-[var(--foreground)]">{label}</span>
        <textarea
          name={name}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={`glass-input min-h-24 ${error ? 'glass-input-error' : ''} ${className ?? ''}`}
          {...rest}
        />
        {hint && !error ? <span className="text-xs text-[var(--muted-foreground)]">{hint}</span> : null}
        {error ? (
          <p id={errorId} className="text-xs text-red-600 dark:text-red-400">
            {error}
          </p>
        ) : null}
      </label>
    )
  }

  if (props.as === 'select') {
    const { label, name, error, hint, children, selectProps } = props
    return (
      <label className="block space-y-1.5 text-sm">
        <span className="font-medium text-[var(--foreground)]">{label}</span>
        <select
          name={name}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={`glass-input ${error ? 'glass-input-error' : ''} ${selectProps?.className ?? ''}`}
          {...selectProps}
        >
          {children}
        </select>
        {hint && !error ? <span className="text-xs text-[var(--muted-foreground)]">{hint}</span> : null}
        {error ? (
          <p id={errorId} className="text-xs text-red-600 dark:text-red-400">
            {error}
          </p>
        ) : null}
      </label>
    )
  }

  const { label, name, error, hint, as: _ignoredInput, className, ...rest } = props
  void _ignoredInput
  return (
    <label className="block space-y-1.5 text-sm">
      <span className="font-medium text-[var(--foreground)]">{label}</span>
      <input
        name={name}
        aria-invalid={!!error}
        aria-describedby={errorId}
        className={`glass-input ${error ? 'glass-input-error' : ''} ${className ?? ''}`}
        {...rest}
      />
      {hint && !error ? <span className="text-xs text-[var(--muted-foreground)]">{hint}</span> : null}
      {error ? (
        <p id={errorId} className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </label>
  )
}