import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DiaryDispatchContext } from "../App";

import MyHeader from "./MyHeader";
import MyButton from "./MyButton";
import EmotionItem from "./EmotionItem";

import { getStringDate } from "../util/date";
import { emotionList } from "../util/emotion";


//isEdit, originData prop 받기
const DiaryEditor = ({ isEdit, originData }) => {

  //textarea 포커스
  const contentRef = useRef();
  //오늘의 일기fmf state에 mapping하기 위한 state
  const [content, setContent] = useState("");

  //어떤 감정을 선택했는지 state
  const [emotion, setEmotion] = useState(3);

  //dateState의 초기값을 getStringDate 함수로 호출하면 
  //input의 초기값이 오늘 날짜로 사용할 수 있게 됨.
  const [date, setDate] = useState(getStringDate(new Date()));


  const { onCreate, onEdit, onRemove } = useContext(DiaryDispatchContext);
  //emotion 클릭이 발생하면 수행할 함수
  //재사용하기 위해 useCallback추가
  const handleClickEmote = useCallback((emotion) => {
    setEmotion(emotion)
  }, []);


  const navigate = useNavigate();

  //작성완료 버튼
  const handleSubmit = () => {
    //콘텐츠의 길이가 적어도 한 글자는 썼는지 검사
    if (content.length < 1) {
      contentRef.current.focus();
      return;
    }

    if (window.confirm(isEdit ? "일기를 수정하시겠습니까?" : "새로운 일기를 작성하시겠습니까?")) {
      if (!isEdit) {
        //콘텐츠 길이가 적정 길이로 되었을 때 onCreate함수 호출
        onCreate(date, content, emotion);
      } else {
        onEdit(originData.id, date, content, emotion);
      }
    }


    navigate('/', { replace: true })

  };

  const handleRemove = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      onRemove(originData.id);
      navigate('/', { replace: true });
    }
  };

  // Edit 로직
  // 수정 데이터 불러오기
  useEffect(() => {
    if (isEdit) {
      setDate(getStringDate(new Date(parseInt(originData.date))));
      setEmotion(originData.emotion);
      setContent(originData.content);
    }
  }, [isEdit, originData]);


  return (
    <div className="DiaryEditor">
      <MyHeader
        // isEdit이 true일 때면 일기 수정하기로 바꿔주기
        headText={isEdit ? "일기 수정하기" : "새로운 일기쓰기"}
        leftchild={
          <MyButton text={"< 뒤로가기"} onClick={() => navigate(-1)} />}
        //삭제하기버튼
        //isEdit이 true일 때만 삭제 하기
        rightchild={
          isEdit && (
            <MyButton
              text={"삭제하기"}
              type={"negative"}
              onClick={handleRemove}
            />
          )
        }
      />
      <div>
        <section>
          <h4>오늘은 언제인가요?</h4>
          <div className="input_box">
            <input className="input_date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type="date"
            />
          </div>
        </section>
        <section>
          <h4>오늘의 감정</h4>
          <div className="input_box emotion_list_wrapper">
            {emotionList.map((it) => (
              <EmotionItem
                key={it.emotion_id}
                {...it}
                onClick={handleClickEmote}
                //지금 선택된 감정 인지 아닌지 Prop isSelected 로 내려보자.
                //현재 감정아이템의 emotion_id가 현재 선택된 emotion의 
                //값과 같다면 true, 같지않다면 false로 전달 받게 됨
                isSelected={it.emotion_id === emotion}
              />
            ))}
          </div>
        </section>
        <section>
          <h4>오늘의 일기</h4>
          <div className="input_box_text_wrapper">
            <textarea
              placeholder="오늘은 어땠나요?"
              ref={contentRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </section>
        <section>
          <div className="control_box">
            <MyButton text={"취소하기"} onClick={() => navigate(-1)} />
            <MyButton text={"작성완료"} type={'positive'} onClick={handleSubmit} />
          </div>
        </section>
      </div>
    </div >
  );
};

export default DiaryEditor;