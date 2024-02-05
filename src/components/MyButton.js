const MyButton = ({ text, type, onClick }) => {

  // btnType 배열은 positive, negative라는 배열을 만들어 주고 includes 안에 있냐 있다면, 
  // type이 그대로 반환하고 없다면 그냥 디폴트를 반환하게 강제한다.
  // positive나 negative 중 없는 이상한 타입의 글자가 들어오면 강제로 디폴트 타입으로 btn타입을 바꿔버린다.
  const btnType = ['positive', 'negative'].includes(type) ? type : 'default';

  return (
    <button
      className={["MyButton", `MyButton_${btnType}`].join(" ")}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

MyButton.defaultProps = {
  type: "default"
};

export default MyButton;