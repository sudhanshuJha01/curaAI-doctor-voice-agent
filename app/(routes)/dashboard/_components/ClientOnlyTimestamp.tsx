"use client";

import { useEffect, useState } from 'react';
import moment from 'moment';

const ClientOnlyTimestamp = ({ date }: { date: string | Date }) => {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    setFormattedDate(moment(new Date(date)).fromNow());
  }, [date]);

  return <span>{formattedDate || '...'}</span>;
};

export default ClientOnlyTimestamp;