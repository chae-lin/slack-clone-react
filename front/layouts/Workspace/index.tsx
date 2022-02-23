import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { Redirect } from 'react-router';
import useSWR from 'swr';

// children을 쓰는 컴포넌트는 FC, children을 안쓰는 컴포넌트는 VFC가 타입이다.
const Workspace: FC = ({ children }) => {
  // swr은 컴포넌트간 넘나드는 전역스토리지
  const { data: userData, mutate: revalidateUser } = useSWR('/api/users', fetcher);

  const onLogOut = useCallback(() => {
    // 쿠키를 서로 공유하기 위해 ithCredentials: true
    axios.post('/api/users/logout', null, { withCredentials: true }).then(() => {
      revalidateUser();
    });
  }, []);

  if (userData === false) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <button onClick={onLogOut}>로그아웃</button>
      {children}
    </div>
  );
};

export default Workspace;
