import React, { useEffect, useReducer, useRef } from 'react';

import './App.css';
import { BrowserRouter, Route, Routes, json } from 'react-router-dom';
import Home from './pages/Home';
import New from './pages/New';
import Eidt from './pages/Edit';
import Diary from './pages/Diary';
import Edit from './pages/Edit';
import DiaryList from './components/DiaryList';

//모든 데이터 수정(init, create, remove, edit) 되는 로직 reducer
const reducer = (state, action) => {
  let newState = [];
  switch (action.type) {
    case 'INIT': {
      return action.data;
    }
    case 'CREATE': {
      const newItem = {
        ...action.data
      };
      newState = [newItem, ...state];
      break;
    }
    case 'REMOVE': {
      newState = state.filter((it) => it.id !== action.targetId);
      break;
    }
    case 'EDIT': {
      newState = state.map((it) => it.id === action.data.id ? { ...action.data } : it);
      break;
    }
    default:
      return state;
  }

  localStorage.setItem('diary', JSON.stringify(newState))
  return newState;
};

export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();



function App() {
  const [data, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    //앱 컴포넌트가 마운트 되었을 때 localData라는 상수에 다이어리를 불러오는 함수
    const localData = localStorage.getItem('diary');
    if (localData) {
      const diaryList = JSON.parse(localData).sort(
        (a, b) => parseInt(b.id) - parseInt(a.id)
      );

      if (diaryList.length >= 1) {
        //정렬이 내림차순 id로 된 다이어리 리스트에서 0번째 요소를 뽑은 다음 그 id에 +1을 해준다.
        //데이터의 값이 6번이었으니깐 7번부터 저장을 시작하도록 하겠다.라고 current에 저장함.
        dataId.current = parseInt(diaryList[0].id) + 1;
        dispatch({ type: 'INIT', data: diaryList });
      }
    }
  }, []);


  const dataId = useRef(0);

  //CREATE
  const onCreate = (date, content, emotion) => {
    dispatch({
      type: "CREATE",
      data: {
        id: dataId.current,
        date: new Date(date).getTime(),
        content,
        emotion
      }
    });
    dataId.current += 1;
  }
  // REMOVE
  const onRemove = (targetId) => {
    dispatch({ type: "REMOVE", targetId });
  }
  // EDIT
  const onEdit = (targetId, date, content, emotion) => {
    dispatch({
      type: "EDIT",
      data: {
        id: targetId,
        date: new Date(date).getTime(),
        content,
        emotion
      }
    });
  }

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={{ onCreate, onEdit, onRemove }}>
        <BrowserRouter>
          <div className="App">
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/new' element={<New />} />
              <Route path='/edit/:id' element={<Edit />} />
              <Route path='/diary/:id' element={<Diary />} />
            </Routes>
          </div>
        </BrowserRouter>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider >
  );
}

export default App;
