import { ReactElement } from 'react';
import { Button as MuiButton } from '@mui/material';
import styles from './Button.module.css'

interface ButtonProps {
  icon?: ReactElement;
  label: string;
  onClick: () => void;
}

export default function Button({ icon, label, onClick }: ButtonProps) {
  return (
    <MuiButton
      className={styles.container}
      startIcon={icon}
      onClick={onClick}
    >
      {label}
    </MuiButton>
  );
};
