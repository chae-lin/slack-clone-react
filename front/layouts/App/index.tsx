import React, { FC } from 'react';
import loadable from '@loadable/component';
import { Switch, Route, Redirect } from 'react-router-dom';

// path를 기준으로 컴포넌트 구분
// Route: 컴포넌트를 화면에 띄워주는 역활
// Redirect: 다른 페이지로 돌려주는 역활

const LogIn = loadable(() => import('@pages/LogIn'));
const SignUp = loadable(() => import('@pages/SignUp'));

const App = () => {
  return (
    <Switch>
      <Redirect exact path="/" to="/login" />
      <Route path="/login" component={LogIn} />
      <Route path="/signup" component={SignUp} />
    </Switch>
  );
};

export default App;
