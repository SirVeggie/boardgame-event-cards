import { useRef, useState } from 'react';
import { uuid } from 'shared';
import cx from 'classnames';
import { createUseStyles } from 'react-jss';
import { Button } from '../components/Button';
import { useKeyEvent } from './useKeyEvent';

export function useSelect(label: string, options: string[], className?: string) {
  const s = useStyles();
  const defaultValue = options[0] ?? '';
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const index = useRef(0);
  const downKey = useKeyEvent('arrowdown');
  const upKey = useKeyEvent('arrowup');

  if (options.length !== new Set(options).size) {
    throw new Error('useSelect: options must not contain duplicates');
  }

  if (downKey.pressed && index.current < options.length - 1 && open) {
    index.current = Math.min(index.current + 1, options.length - 1);
  } else if (upKey.pressed && index.current > 0 && open) {
    index.current = Math.max(index.current - 1, 0);
  }

  if (!options.some(x => x === value))
    setValue(defaultValue);

  const setDropdown = (state: boolean) => {
    setOpen(state);
    if (state && !open) {
      index.current = 0;
    }
  };
  
  const reset = () => {
    setValue(defaultValue);
  };
  
  const click: React.MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault();
    setDropdown(!open);
  };
  
  const focus: React.FocusEventHandler<HTMLButtonElement> = () => {
    setDropdown(true);
  };
  
  const blur: React.FocusEventHandler<HTMLDivElement> = e => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDropdown(false);
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
        {options.map((option, i) => <SelectButton key={option} option={option} focus={i === index.current} />)}
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
      <button autoFocus={p.focus} onClick={click} className='dropdown-option'>
        {p.option}
      </button>
    );
  }
}

function setFocus(index: number) {
  setTimeout(() => {
    (document.getElementsByClassName('dropdown-option')[index] as any)?.focus();
  }, 0);
}

type ButtonProps = {
  option: string;
  focus?: boolean;
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
    zIndex: 1,

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