import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '../store';

export function useSession(name: string) {
  const sessionName = decodeURIComponent(useParams().session ?? '');
  const session = useSelector((state: RootState) => state.sessions.find(x => x.name === sessionName));
  const dispatch = useDispatch();
  
  const commit = (session: string) => {
    
  };
}