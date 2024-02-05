import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DiaryStateContext } from "../App";
import DiaryEditor from "../components/DiaryEditor";

const Edit = () => {

  //targetDiary 데이터를 저장할 state
  const [originData, setOriginData] = useState();

  const navigate = useNavigate();
  const { id } = useParams();

  const diaryList = useContext(DiaryStateContext);

  //다이어리 상세페이지가 마운트될 때, 즉 켜졌을 때 
  //title이라는 태그네임을 갖는 모든 엘리먼트를 가져오기에
  //배열로 반환이 되어 반환 결과 값의 0번째를 추려내면 지금 우리가 변경하고자하는 title이 되게 된다.
  useEffect(() => {
    const titleElement = document.getElementsByTagName('title')[0];
    titleElement.innerHTML = `감정 일기장 - ${id}번 일기 수정`;
  }, []);

  //다이어리 리스트에서 일기 데이트를 수정하려고 하는 데이터를 꺼내오자.
  //id가 변해도 다른 데이터를 꺼내와야되기에 아이디가 변하거나 리스트가 변할 때만 꺼내오는 로직
  useEffect(() => {
    //일기 데이터가 하나라도 있을때 일기 데이터를 꺼내오는 로직
    if (diaryList.length >= 1) {
      const targetDiary = diaryList.find(
        (it) => parseInt(it.id) === parseInt(id)
      );

      //없는 페이지를 검색하면 undefined일 때는 false, flasy 속성을 갖게 돼서,
      //if문에서는 거짓으로, undefined이 아닌 객체 값이 들어오면 if문의 truthy하게 참으로 평가.
      //tartetDiary가 없을 때 즉 아이디가 잘못 전달 되었을때 navigate 함수를 통해 home으로 보내기.
      if (targetDiary) {
        setOriginData(targetDiary);
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [id, diaryList]);

  return (
    <div>
      {originData && <DiaryEditor isEdit={true} originData={originData} />}
    </div >
  );
};

export default Edit;