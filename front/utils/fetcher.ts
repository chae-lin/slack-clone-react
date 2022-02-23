import axios from 'axios';

const fetcher = (url: string) =>
  axios
    .get(url, {
      // 도메인이 다른 백과 프론트간에 쿠키전달을 가능하게 하도록 (get에서는 두번째에 설정해야 함.)
      withCredentials: true,
    })
    .then((response) => response.data);

export default fetcher;
