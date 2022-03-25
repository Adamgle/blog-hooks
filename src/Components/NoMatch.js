import { useParams } from "react-router-dom";
const NoMatch = () => {
  const params = useParams();
  console.log(params);
  return <div>Nothing There</div>;
};
export default NoMatch;
