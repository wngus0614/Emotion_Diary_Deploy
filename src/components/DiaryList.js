import React, { useEffect, useState } from "react";
import { json } from "react-router-dom";
import MyButton from "./MyButton";
import { useNavigate } from "react-router-dom";
import DiaryItem from "./DiaryItem";

const sortOptionList = [
  { value: "latest", name: "최신순" },
  { value: "oldest", name: "오래된순" }

];

const filterOptionList = [
  { value: "all", name: "전부다" },
  { value: "good", name: "좋은 감정만" },
  { value: "bad", name: "안좋은 감정만" }
];

//최적화 시키기
//컴포넌트를 React.memo라는 함수인자로 전달하면 강화된 컴포넌트로 돌려주는 고착컴포넌트이다.
//React.memo를 통해 만들어진 고착컴포넌트는 전달받은 prop 값이 
//바뀌지 않으면 렌더링 일어나지 않게 메모이제이션 해주는 최적화 기법 중 하나이다.
const ControlMenu = React.memo(({ value, onChange, optionList }) => {

  return (
    <select className="ControlMenu" value={value} onChange={(e) => onChange(e.target.value)}>
      {optionList.map((it, idx) => (
        <option key={idx} value={it.value}>
          {it.name}
        </option>
      ))}
    </select>
  );
});


const DiaryList = ({ diaryList }) => {
  const navigate = useNavigate();

  //최신순, 오래된순 필터
  const [sortType, setSortType] = useState("latest");
  //감정필터
  const [filter, setFilter] = useState("all");

  //최신순, 오래된순으로 일기 순서 정렬
  const getProcessdDiaryList = () => {


    //감정필터링 함수
    const filterCallBack = (item) => {
      //필터가 good인 경우 3이하
      if (filter === 'good') {
        //산술연산을 적용하기 위해서는 emotion도 숫자고 3도 숫자여야한다. parseInt로 숫자 형변환 적용.
        return parseInt(item.emotion) <= 3;
      } else { //필터가bad인 경우 3이상
        return parseInt(item.emotion) > 3;
      }
    };


    //최신,오래된 필터링 함수
    const compare = (a, b) => {
      if (sortType === "latest") {
        //문자열이 들어올수도 있기에 parseInt.
        return parseInt(b.date) - parseInt(a.date);
      } else {
        return parseInt(a.date) - parseInt(b.date);
      }
    };

    //stringify는 JSON화를 시켜 문자열로 반환시켜 parse를 수행시키며 다시 배열로 복구화시켜 copyList로 넣어줌 .
    //diaryList의 원본 배열의 값이 문자열로 바뀌었다가 다시 배열로 바뀜.
    //diaryList가 저장하고 있는 배열을 건드리지 않게 하기 위해서 수행
    const copyList = JSON.parse(JSON.stringify(diaryList));

    const filteredList = filter === 'all' ? copyList : copyList.filter((it) => filterCallBack(it));

    const sortedList = filteredList.sort(compare);
    return sortedList;
  };

  return (
    <div className="DiaryList">
      <div className="menu_wrapper">
        <div className="left_col">
          <ControlMenu
            value={sortType}
            onChange={setSortType}
            optionList={sortOptionList}
          />
          <ControlMenu
            value={filter}
            onChange={setFilter}
            optionList={filterOptionList}
          />
        </div>
        <div className="right_col">
          <MyButton type={"positive"}
            text={"새 일기쓰기"}
            onClick={() => navigate("/new")}
          />
        </div>
      </div>

      {getProcessdDiaryList().map((it) => (
        <DiaryItem
          key={it.id} {...it}
        />
      ))}
    </div>
  );
};

DiaryList.defaultProps = {
  diaryList: []
};

export default DiaryList;