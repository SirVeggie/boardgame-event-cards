import { useState } from 'react';
import { useDispatch } from 'react-redux';

export function useSession(name: string) {
  const dispatch = useDispatch();
  const [session, setSession] = useState(null);
  
  const commit = (session: string) => {
    
  };
}