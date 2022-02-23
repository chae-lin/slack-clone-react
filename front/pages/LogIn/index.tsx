import useInput from '@hooks/useInput';
import { Success, Form, Error, Label, Input, LinkContainer, Button, Header } from '@pages/SignUp/styles';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';

const LogIn = () => {
  // swr은 로딩상태도 알 수 있다. =  데이터가 존재하지 않으면 로딩 중
  // useSWR은 주소를 fetcher로 옮겨주는 역활만 함
  // fetcher에서 보내준 response.data가 data에 들어옴.
  // 로그인 성공시 mutate가 실행되어 fetcher가 바로 실행됨.
  const {
    data: userData,
    error,
    mutate: revalidateUser,
  } = useSWR('/api/users', fetcher, {
    // - 주기적으로 호출은 되지만 dedupingInterval 기간 내에는 캐시에서 불러온다.v (기본 값은 2000:2초)
    // dedupingInterval: 100000,
    // - revalidate 시간 설정
    // focusThrottleInterval: 5000,
    // - 에러가 나면 아래 시간 후에 재요청
    // errorRetryInterval: 5000,
    // - 로딩 시간이 길어질 경우 안내 메시지 같은 것을 띄워줄 수 있게.
    // loadingTimeout: 3000,
    // - 에러가 났을 경우 재요청 하는 시간
    // errorRetryInterval: 5000,
    // - 에러 났을 경우 최대 몇번까지 재요청하나
    // errorRetryCount: max error retry count
    // - 윈도우가 포커스 얻었을 경우 자동 revalidate
    // revalidateOnFocus: false
    // - 창이 보이지 않을 때 revalidate
    // refreshWhenHidden: false,
  });
  const [logInError, setLogInError] = useState(false);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setLogInError(false);
      axios
        .post(
          '/api/users/login',
          { email, password },
          // 쿠키 전달이 가능하게 하도록 (post에서는 3번째에 설정해야 함.)
          { withCredentials: true },
        )
        .then(() => {
          // 성공하면 useSWR('/api/users', fetcher 다시 실행되어 data에 내정보가 들어 있음.
          revalidateUser();
        })
        .catch((error) => {
          setLogInError(error.response?.data?.code === 401);
        });
    },
    [email, password],
  );

  if (userData === undefined) {
    return <div>로딩중...</div>;
  }

  if (userData) {
    // 페이지를 /workspace/channel로 옮긴다.
    return <Redirect to="/workspace/channel" />;
  }

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
          {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default LogIn;
