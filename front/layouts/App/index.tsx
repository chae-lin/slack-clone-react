import React, { FC } from 'react';
import loadable from '@loadable/component';
import { Switch, Route, Redirect } from 'react-router-dom';

// path를 기준으로 컴포넌트 구분
// Route: 컴포넌트를 화면에 띄워주는 역활
// Redirect: 다른 페이지로 돌려주는 역활

// Code Spliting이란? 싱글페이지 어플리케이션에서 번들 사이즈가 커지면 로딩속도나 성능면에서 문제가 생길 수 있다. 코드 스플리팅은 이것들을 여러개의 번들로 나누거나 동적으로 import 하는 기법을 말한다.
// 해당 컴포넌트가 불러질 때 파일을 읽어온다는 것이다.
// 코드 스플리팅을 할때에 어떠한 기준으로 나눌 것이냐에 대한 기준을 세우기가 어려운데 일단은 라우트 기준으로 나누어 보는것을 많은 사람들과 공식문서에서 추천하고 있다.
const LogIn = loadable(() => import('@pages/LogIn'));
const SignUp = loadable(() => import('@pages/SignUp'));
const Workspaces = loadable(() => import('@layouts/Workspace'));

const App = () => {
  return (
    <Switch>
      <Redirect exact path="/" to="/login" />
      <Route path="/login" component={LogIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/workspace" component={Workspaces} />
    </Switch>
  );
};

export default App;
