import { useState } from 'react';
import { uuid } from 'shared';
import cx from 'classnames';
import { createUseStyles } from 'react-jss';
import { Button } from '../components/Button';

export function useSelect(label: string, options: string[], className?: string) {
  const s = useStyles();
  const defaultValue = options[0] ?? '';
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);

  if (options.length !== new Set(options).size) {
    throw new Error('useSelect: options must not contain duplicates');
  }
  
  if (!options.some(x => x === value))
    setValue(defaultValue);

  const reset = () => {
    setValue(defaultValue);
  };

  const click: React.MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault();
    setOpen(!open);
  };
  const focus: React.FocusEventHandler<HTMLButtonElement> = () => {
    setOpen(true);
  };
  const blur: React.FocusEventHandler<HTMLDivElement> = e => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setOpen(false);
    }
  };

  const id = uuid();
  const field = (
    <div className={s.select} onBlur={blur}>
      <label htmlFor={id}>{label}</label><br />
      <Button
        id={id}
        onClick={click}
        onFocus={focus}
        text={value}
        className={cx(s.button, className)}
      />
      <div className={cx(s.drop, open && 'open')}>
        {options.map(option => <SelectButton key={option} option={option} />)}
      </div>
    </div>
  );

  return [
    {
      ...field,
      value,
      reset
    },
    value
  ] as [JSX.Element & { value: string, reset: () => void; }, string];

  function SelectButton(p: ButtonProps) {
    const click = (e: any) => {
      e.preventDefault();
      setValue(p.option);
      setOpen(false);
    };
    
    return (
      <button onClick={click}>
        {p.option}
      </button>
    );
  }
}

type ButtonProps = {
  option: string;
};

const useStyles = createUseStyles({
  select: {
    ':where(&)': {
      position: 'relative',
    },
  },

  drop: {
    '--border': '1px',
    display: 'none',
    borderRadius: '3px',
    border: 'var(--border) solid #eee',
    position: 'absolute',
    backgroundColor: '#fff',
    width: '200px',
    boxSizing: 'border-box',
    maxHeight: 'calc(180px + var(--border) * 2)',
    overflowY: 'auto',

    '&.open': {
      display: 'flex',
      flexDirection: 'column',
    },

    '& > button': {
      cursor: 'pointer',
      padding: '0 10px',
      minHeight: '30px',
      border: 'none',
      backgroundColor: '#fff',
      textAlign: 'left',
      color: '#555',
      outline: 'none',

      '&:hover': {
        backgroundColor: '#f5f5f5',
      },
      
      '&:focus:not(:hover)': {
        backgroundColor: '#f8f8ff',
      },
    },
  },

  button: {
    width: 200,
    textAlign: 'left',
    padding: '0 10px',
    position: 'relative',
    boxShadow: '0px 1px 1px #0003',

    '&::after': {
      fontFamily: '"Font Awesome 5 Free"',
      fontWeight: 900,
      content: '"\\f0d7"',
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'black',
      top: 0,
      bottom: 0,
      right: 0,
      width: 30,
    },
  }
});