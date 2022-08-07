import { createUseStyles } from 'react-jss';

type Props = {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  children?: React.ReactNode;
};

export function FormBase(p: Props) {
  const s = useStyles();
  return (
    <form className={s.form} onSubmit={p.onSubmit}>{p.children}</form>
  );
}

const useStyles = createUseStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px',
    boxShadow: '0px 4px 10px #0005',
    flexBasis: 0,
  },
});