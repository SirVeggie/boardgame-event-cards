import { useState } from 'react';
import cx from 'classnames';
import { uuid } from 'shared';
import { createUseStyles } from 'react-jss';

export function useInput(label: string, type?: string, className?: string) {
  const defaultValue = type === 'number' ? 0
    : type === 'color' ? '#000000'
      : '';
  const s = useStyles();
  const [value, setValue] = useState(defaultValue);

  const onChange = (e: any) => {
    setValue(e.target.value);
  };

  const reset = () => {
    setValue(defaultValue);
  };

  const id = uuid();
  const field = (
    <div className={s.input}>
      <label htmlFor={id}>{label}</label><br />
      {type === 'textarea' ? <textarea
        id={id}
        onChange={onChange}
        value={value}
        className={cx(className)}
      /> : <input
        id={id}
        type={type}
        onChange={onChange}
        value={value}
        className={cx(className)}
      />}
    </div>
  );

  return [
    { ...field, value, reset },
    value
  ] as [JSX.Element & { value: string, reset: () => void; }, string];
}

const useStyles = createUseStyles({
  input: {
    '& > :where(textarea, input)': {
      borderRadius: '3px',
      border: '1px solid #ccc',
      width: '200px',
      transition: 'border 200ms',
      boxSizing: 'border-box',
    },

    '& > :where(textarea, input):focus': {
      outline: 'none',
      borderColor: '#aaf',
    },

    '& > :where(textarea)': {
      minHeight: '100px',
      minWidth: '200px',
    },

    '& > :where(input)': {
      height: '25px',
    },
  },
});