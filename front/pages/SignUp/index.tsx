import React, { useCallback, useState } from 'react';
import { Success, Form, Error, Label, Input, LinkContainer, Button, Header } from './styles';
import axios from 'axios';
import { Link } from 'react-router-dom';
import useInput from '@hooks/useInput';

const SignUp = () => {
  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  // useInput 같이 사용하고 싶지만 함수 코드가 다른겅우 , , 빈 값으로 둔다.
  const [password, , setPassword] = useInput('');
  const [passwordCheck, , setPasswordCheck] = useInput('');
  const [mismatchError, setMismatchError] = useState(false);
  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSuccese] = useState(false);

  const onChangePassword = useCallback(
    (e) => {
      setPassword(e.target.value);
      setMismatchError(e.target.value !== passwordCheck);
    },
    [passwordCheck],
  );

  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setMismatchError(e.target.value !== password);
    },
    [password],
  );

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!mismatchError) {
        // 비동기 요청에서 setState 하는 것들은 비동기 요청하기전에 초기화 해주는 것이 좋다.
        // 그렇지 않으면 요청을 연달아 날릴 때 이전에 보낸 요청의 값이 남아있는 경우가 있을 수 있어 요청 보내기전에 초기화 해주는 것이 좋다.
        setSignUpError('');
        setSignUpSuccese(false);
        axios
          // webpack.congig에서 proxy 설정한 경우
          // .post('/api/users', { email, nickname, password })
          // 위의 경우는 3095에서 3095로 보내는 것.
          // 아래의 경우는 3090에서 3095로 보내는 것
          .post('http://localhost:3095/api/users', { email, nickname, password })
          // 성공
          .then((response) => {
            setSignUpSuccese(true);
            console.log(response);
          })
          // 실패
          .catch((error) => {
            setSignUpError(error.response.data);
            console.log(error.response);
          });
        // 성공, 실패 모두 실행
        // .finally(() => {});
      }
    },
    [email, nickname, password, passwordCheck],
  );

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
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
          {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
          {!nickname && <Error>닉네임을 입력해주세요.</Error>}
          {signUpError && <Error>{signUpError}</Error>}
          {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <Link to="/login">로그인 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default SignUp;
