import clsx from 'clsx';
import { forwardRef } from 'react';
import styles from './Select.module.css';

const Select = forwardRef(function Select(
  {
    label,
    className,
    htmlType,
    options,
    defaultValue,
    size,
    ariaLabel,
    required,
  },
  ref
) {
  return (
    <div className={clsx(styles.root, className)}>
      <label>
        {label && <div className={styles.label}>{label}</div>}
        <select
          type={htmlType}
          defaultValue={defaultValue}
          ref={ref}
          className={clsx(styles.select, size && styles[size])}
          aria-label={ariaLabel}
          required={required}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
});

export default Select;
