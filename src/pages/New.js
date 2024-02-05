import { useEffect } from "react";
import DiaryEditor from "../components/DiaryEditor";

const New = () => {

  //다이어리 상세페이지가 마운트될 때, 즉 켜졌을 때 
  //title이라는 태그네임을 갖는 모든 엘리먼트를 가져오기에
  //배열로 반환이 되어 반환 결과 값의 0번째를 추려내면 지금 우리가 변경하고자하는 title이 되게 된다.
  useEffect(() => {
    const titleElement = document.getElementsByTagName('title')[0];
    titleElement.innerHTML = `감정 일기장 - 새 일기`;
  }, []);

  return (
    <div>
      <DiaryEditor />
    </div>
  );
};

export default New;