import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import useSWR from 'swr';
// swr에 있는 mutate는 범용적으로 사용할 수 있다. (1번의 요청도 아낄 수 있음)
import gravatar from 'gravatar';
import {
  AddButton,
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceButton,
  WorkspaceModal,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from './styles';
import loadable from '@loadable/component';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

// children을 쓰는 컴포넌트는 FC, children을 안쓰는 컴포넌트는 VFC가 타입이다.
const Workspace: FC = ({ children }) => {
  // swr은 컴포넌트간 넘나드는 전역스토리지
  // 요청은 같은 곳으로 보내나 fetcher를 사용하고 싶을 때: 주소뒤에 ? 또는 #을 붙여준다. 'users?' 'users#'
  const { data: userData, mutate: revalidateUser } = useSWR('/api/users', fetcher);

  const onLogOut = useCallback(() => {
    // 쿠키를 서로 공유하기 위해 ithCredentials: true
    axios.post('/api/users/logout', null, { withCredentials: true }).then(() => {
      revalidateUser();
      // Optimistic UI: 먼저 성공한다고 생각하고 실행하고 서버에 요청보내는 것 (swr에서 mutate를 이용해서)
      // Pessimistic UI: 서버에 먼저 요청보내고 그에 따라 실행
    });
  }, []);

  if (userData === false) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span>
            {/* <ProfileImg src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt="" /> */}
            <ProfileImg src="" alt="" />
          </span>
        </RightMenu>
      </Header>
      <button onClick={onLogOut}>로그아웃</button>
      <WorkspaceWrapper>
        <Workspaces>test</Workspaces>
        <Channels>
          <WorkspaceName>sd</WorkspaceName>
          <MenuScroll>dd</MenuScroll>
        </Channels>
        <Chats>
          <Switch>
            <Route path="/workspace/channel" component={Channel} />
            <Route path="/workspace/dm" component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
    </div>
  );
};

export default Workspace;
