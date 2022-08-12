import { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { Button } from '../components/Button';
import { FormBase } from '../components/FormBase';
import { useInput } from './useInput';

export type FieldInfo = {
  type: string;
  className?: string;
};

export type FormResult<T extends string> = Record<T, string>;
export function useForm<T extends string>(title: string, fields: Record<T, FieldInfo>) {
  const s = useStyles();
  // eslint-disable-next-line no-empty-function, @typescript-eslint/no-empty-function
  const [submitFunc, setSubmitFunc] = useState<(data: FormResult<T>) => void>(() => { });
  const [open, setOpen] = useState(false);

  const keys = Object.keys(fields) as T[];
  const states = keys.reduce((obj, key) => {
    const field = fields[key] as FieldInfo;
    const [input] = useInput(key, field.type, field.className);

    const res = {
      ...obj,
      [key]: input
    };
    return res;
  }, {} as Record<T, ReturnType<typeof useInput>[0]>);

  const reset = () => {
    keys.forEach(key => {
      states[key].reset();
    });
  };

  const submit = (): FormResult<T> => {
    const data = keys.reduce((obj, key) => {
      const value = states[key].value;
      return {
        ...obj,
        [key]: value
      };
    }, {} as FormResult<T>);
    submitFunc(data);
    return data;
  };

  const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit();
  };


  const component = (
    <div className={s.modal}>
      <FormBase onSubmit={formSubmit} className={s.content}>
        <h2>{title}</h2>
        {keys.map(key => states[key])}
        <Button text='Submit' />
      </FormBase>
    </div>
  );

  return { submit, setSubmit: setSubmitFunc, component, isOpen: open, setOpen, reset };
}

const useStyles = createUseStyles({
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  '@keyframes dropIn': {
    from: { transform: 'translateY(-1rem)' },
    to: { transform: 'translateY(0)' },
  },

  modal: {
    position: 'fixed',
    cursor: 'initial',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'start',
    zIndex: 2000,
    animation: '$fadeIn 350ms ease',
  },
  
  content: {
    
  }
});