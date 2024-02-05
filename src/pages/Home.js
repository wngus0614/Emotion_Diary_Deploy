import { useContext, useEffect, useState } from "react";

import MyHeader from './../components/MyHeader';
import MyButton from './../components/MyButton';
import { DiaryStateContext } from "../App";
import DiaryList from "../components/DiaryList";

const Home = () => {

  const diaryList = useContext(DiaryStateContext);

  const [data, setData] = useState([]);

  //날짜저장state
  const [curDate, setCurDate] = useState(new Date());

  //년월표시
  const headText = `${curDate.getFullYear()}년 ${curDate.getMonth() + 1}월`


  //다이어리 상세페이지가 마운트될 때, 즉 켜졌을 때 
  //title이라는 태그네임을 갖는 모든 엘리먼트를 가져오기에
  //배열로 반환이 되어 반환 결과 값의 0번째를 추려내면 지금 우리가 변경하고자하는 title이 되게 된다.
  useEffect(() => {
    const titleElement = document.getElementsByTagName('title')[0];
    titleElement.innerHTML = `감정 일기장`;
  }, []);


  //년도와 해당하는 일기 데이터 뽑아오기
  useEffect(() => {
    //diaryList 길이가 1이상일 때만 출력을 해라.
    if (diaryList.length >= 1) {
      //이번년도 이번 월의 1일
      const firstDay = new Date(
        curDate.getFullYear(),
        curDate.getMonth(),
        1
      ).getTime();

      //이번 월의 마지막 날
      const lastDay = new Date(
        curDate.getFullYear(),
        curDate.getMonth() + 1,
        0,
        23,
        59
      ).getTime();

      //firsDay는 월이 시작할 때, lastDay는 월이 끝날 때니깐 그 중간 사이 작성된 일기는 해당 월의 안에 작성된 걸로 볼 수 있다.
      setData(
        diaryList.filter((it) => firstDay <= it.date && it.date <= lastDay));
    };
    //뎁스에 diaryList를 전달 안하면 useEffect가 diaryList가 바꼈을 때 동작을 안하게 됨.
    //diaryList가 바꼈을 때 왜 동작을 해야하나?
    //diaryList가 바꼈다는 것은 일기가 추가,수정,삭제 됐는걸 의미함. 
    //그때는 리스트도 변경해줘야 하기에 뎁스에 diaryList도 넣어줘야함.
  }, [diaryList, curDate]);

  //diaryList가 정상적으로 뽑혔는지 콘솔 확인용
  // useEffect(() => {
  //   console.log(data);
  // }, [data]);

  //한달씩 앞으로 가는 함수
  const increaseMonth = () => {
    setCurDate(
      new Date(curDate.getFullYear(),
        curDate.getMonth() + 1
      )
    );
  };

  //한달씩 뒤로 가는 함수
  const decreaseMonth = () => {
    setCurDate(
      new Date(curDate.getFullYear(),
        curDate.getMonth() - 1
      )
    );
  };

  return (
    <div>
      <MyHeader
        headText={headText}
        leftchild={<MyButton text={'<'} onClick={decreaseMonth} />}
        rightchild={<MyButton text={'>'} onClick={increaseMonth} />}
      />
      <DiaryList diaryList={data} />
    </div >
  );
};

export default Home;