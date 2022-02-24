import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
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
  ProfileBox,
  WorkspaceButton,
  WorkspaceModal,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from './styles';
import loadable from '@loadable/component';
import Menu from '@components/Menu';
import Modal from '@components/Modal';
import { Button, Input, Label } from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';
import { toast } from 'react-toastify';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

// children을 쓰는 컴포넌트는 FC, children을 안쓰는 컴포넌트는 VFC가 타입이다.
const Workspace: FC = ({ children }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);

  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');

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

  const onClickUserProfile = useCallback((e) => {
    e.stopPropagation();
    setShowUserMenu((prev) => !prev);
  }, []);

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
  }, []);

  const onCreateWorkspace = useCallback(
    (e) => {
      // 리액트에서 form 새로고침 안되도록
      e.preventDefault();
      // .trim() 넣어주지않으면 띄어쓰기하나에도 통과할 수 있다.
      if (!newWorkspace || !newWorkspace.trim()) return;
      if (!newUrl || !newUrl.trim()) return;
      axios
        .post('/api/workspaces', { workspace: newWorkspace, url: newUrl }, { withCredentials: true })
        .then(() => {
          revalidateUser();
          // input창 초기화
          setShowCreateWorkspaceModal(false);
          setNewWorkspace('');
          setNewUrl('');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newWorkspace, newUrl],
  );

  if (userData === false) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <ProfileBox onClick={onClickUserProfile}>
            {/* <ProfileImg src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt="" /> */}
            <ProfileImg src="" alt="" />
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} onCloseModal={onClickUserProfile}>
                <ProfileModal>
                  <img src="" alt="" style={{ width: '36px' }} />
                  <div>
                    <span id="pfodile-name">{userData.nickname}</span>
                    <span id="pfodile-active">active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogOut}>로그아웃</LogOutButton>
              </Menu>
            )}
          </ProfileBox>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {userData?.Workspaces.map((ws: any) => {
            return (
              <Link key={ws.id} to={`/workspace/${ws.url}/channel/일반`}>
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>
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
      {/* 인풋이 포함되어 있는 경우 별도의 컴포넌트로 빼는 것이 좋다. */}
      <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Label id="workspace-label">
            <span>워크스페이스 이름</span>
            <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
          </Label>
          <Label id="workspace-url-label">
            <span>워크스페이스 주소</span>
            <Input id="workspace-url" value={newUrl} onChange={onChangeNewUrl} />
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Workspace;
