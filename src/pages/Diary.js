import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import { DiaryStateContext } from "../App";

import MyHeader from "../components/MyHeader";
import MyButton from './../components/MyButton';

import { getStringDate } from "../util/date";
import { emotionList } from "../util/emotion";


const Diary = () => {

  const { id } = useParams();
  const diaryList = useContext(DiaryStateContext);
  const navigate = useNavigate();
  //아이디와 일치하는 상세페이지를 보여주는 데이터를 찾아 일기가 존재할 때 state에 할당하기
  const [data, setData] = useState();


  //다이어리 상세페이지가 마운트될 때, 즉 켜졌을 때 
  //title이라는 태그네임을 갖는 모든 엘리먼트를 가져오기에
  //배열로 반환이 되어 반환 결과 값의 0번째를 추려내면 지금 우리가 변경하고자하는 title이 되게 된다.
  useEffect(() => {
    const titleElement = document.getElementsByTagName('title')[0];
    titleElement.innerHTML = `감정 일기장 - ${id}번 일기`;
  }, []);

  useEffect(() => {
    //일기 리스트가 하나라도 있을 때 데이터를 꺼내오는 로직
    if (diaryList.length >= 1) {
      const targetDiary = diaryList.find(
        (it) => parseInt(it.id) === parseInt(id));

      if (targetDiary) {
        //일기가 존재할 때
        setData(targetDiary)
      } else {
        //일기가 없을 때
        alert("없는 일기 입니다.")
        navigate('/', { replace: true })
      }
    }
  }, [id, diaryList]);


  if (!data) {
    //not data는 데이터가 false할 때 true가 되니깐 즉 일기 데이터가 없을 때 로딩중입니다..
    return <div className="DiaryPage" >로딩중입니다...</div>
  } else {

    const curEmotionData = emotionList.find(
      (it) => parseInt(it.emotion_id) === parseInt(data.emotion)
    );
    console.log(curEmotionData);
    return (
      <div className="DiaryPage">
        <MyHeader
          headText={`${getStringDate(new Date(data.date))} 기록`}
          leftchild={
            <MyButton text={"< 뒤로가기"}
              onClick={() => navigate(-1)}
            />
          }
          rightchild={
            <MyButton text={"수정하기"}
              onClick={() => navigate(`/edit/${data.id}`)}
            />
          }
        />
        <article>
          <section>
            <h4>오늘의 감정</h4>
            <div className={[
              "diary_img_wrapper",
              `diary_img_wrapper_${data.emotion}`
            ].join(" ")}
            >
              <img src={curEmotionData.emotion_img} />
              <div className="emotion_descript">
                {curEmotionData.emotion_descript}
              </div>
            </div>
          </section>
          <section>
            <h4>오늘의 일기</h4>
            <div className="diary_content_wrapper">
              <p>{data.content}</p>
            </div>
          </section>
        </article>
      </div >
    );
  }
};



export default Diary;