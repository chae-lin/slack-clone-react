import { type } from 'os';
import { useState, useCallback, Dispatch, SetStateAction } from 'react';
import { CodeFixAction } from 'typescript';

type ReturnTypes<T = any> = [T, (e: any) => void, Dispatch<SetStateAction<T>>];

// 제너릭에도 기본값을 넣어줄 수 있다.
// 변수는 자동으로 추론하기 때문에 추론하지 못할 경우에 직접 지정해주면 된다.
const useInput = <T = any>(initialValue: T): ReturnTypes<T> => {
  const [value, setValue] = useState(initialValue);
  const handler = useCallback((e) => {
    setValue(e.target.value);
    // 함수 기준으로 외부 변수일 경우에만 적어준다. (e.target.value는 안적는 이유)
  }, []);

  return [value, handler, setValue];
};

// any 대신 ChangeEvent<HTMLInputElement>,
// e.target 대신 e.target.value as unknon as T

export default useInput;
