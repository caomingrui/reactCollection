import { AppContext } from '@/utils/route'
import {useContext} from "react";
// import { useHistory } from "react-router-dom";

export default () => {
    const [state, getToken] = useContext(AppContext);

    // let history = useHistory();

    return (
        <>
            <p onClick={() => { getToken(); }}> 过~ </p>
            <p>我是黑桃A~</p>
        </>
    );
}
